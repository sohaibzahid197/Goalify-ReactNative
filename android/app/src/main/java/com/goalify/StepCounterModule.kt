package com.goalify

import android.content.Context
import android.content.SharedPreferences
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.text.SimpleDateFormat
import java.util.*

class StepCounterModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext),
    SensorEventListener {

    private val sensorManager: SensorManager =
        reactContext.getSystemService(Context.SENSOR_SERVICE) as SensorManager
    private var stepCounterSensor: Sensor? = null
    private var stepDetectorSensor: Sensor? = null
    private var lastStepCount = 0f
    private var isListening = false
    
    // SharedPreferences for persistent storage
    private val prefs: SharedPreferences = reactContext.getSharedPreferences("StepCounterPrefs", Context.MODE_PRIVATE)
    
    // Persistent baseline (loaded from SharedPreferences)
    private var baselineStepCount: Float
        get() = prefs.getFloat("baselineSteps", 0f)
        set(value) {
            prefs.edit().putFloat("baselineSteps", value).apply()
        }
    
    // Last reset date for daily reset check
    private var lastResetDate: String
        get() = prefs.getString("lastResetDate", "") ?: ""
        set(value) {
            prefs.edit().putString("lastResetDate", value).apply()
        }
    
    // Last known sensor value (for reading without listener)
    private var lastKnownSensorValue: Float
        get() = prefs.getFloat("lastKnownSensorValue", 0f)
        set(value) {
            prefs.edit().putFloat("lastKnownSensorValue", value).apply()
        }

    init {
        stepCounterSensor = sensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER)
        stepDetectorSensor = sensorManager.getDefaultSensor(Sensor.TYPE_STEP_DETECTOR)
        
        // Load last known sensor value
        lastStepCount = lastKnownSensorValue
        
        // If baseline is 0 and we have a sensor value, set baseline to current value
        // This handles the case where app is opened for the first time today
        if (baselineStepCount == 0f && lastStepCount > 0f) {
            baselineStepCount = lastStepCount
        }
    }

    override fun getName(): String {
        return "StepCounter"
    }

    @ReactMethod
    fun isStepCounterAvailable(promise: Promise) {
        try {
            val available = stepCounterSensor != null
            promise.resolve(available)
        } catch (e: Exception) {
            promise.reject("SENSOR_CHECK_ERROR", "Error checking step counter availability: ${e.message}", e)
        }
    }

    @ReactMethod
    fun isStepDetectorAvailable(promise: Promise) {
        try {
            val available = stepDetectorSensor != null
            promise.resolve(available)
        } catch (e: Exception) {
            promise.reject("SENSOR_CHECK_ERROR", "Error checking step detector availability: ${e.message}", e)
        }
    }

    @ReactMethod
    fun startStepCounter() {
        if (isListening) {
            return
        }

        try {
            stepCounterSensor?.let { sensor ->
                // Read current sensor value before starting listener
                // This ensures we have the latest value even if listener hasn't fired yet
                val currentValue = lastStepCount
                if (currentValue > 0f && baselineStepCount == 0f) {
                    baselineStepCount = currentValue
                }
                
                val registered = sensorManager.registerListener(
                    this,
                    sensor,
                    SensorManager.SENSOR_DELAY_UI
                )
                
                if (registered) {
                    isListening = true
                } else {
                    sendErrorEvent("Failed to register step counter sensor")
                }
            } ?: run {
                sendErrorEvent("Step counter sensor not available")
            }
        } catch (e: Exception) {
            sendErrorEvent("Error starting step counter: ${e.message}")
        }
    }

    @ReactMethod
    fun stopStepCounter() {
        if (!isListening) {
            return
        }

        try {
            sensorManager.unregisterListener(this)
            isListening = false
        } catch (e: Exception) {
            sendErrorEvent("Error stopping step counter: ${e.message}")
        }
    }

    @ReactMethod
    fun getStepCount(promise: Promise) {
        try {
            if (stepCounterSensor == null) {
                promise.reject("SENSOR_UNAVAILABLE", "Step counter sensor is not available on this device")
                return
            }

            // Use last known sensor value (from memory or SharedPreferences)
            val currentSensorValue = if (lastStepCount > 0f) {
                lastStepCount
            } else {
                lastKnownSensorValue
            }
            
            // Calculate today's steps: current sensor - baseline
            val todaySteps = if (baselineStepCount > 0f) {
                (currentSensorValue - baselineStepCount).toInt()
            } else {
                // No baseline set yet, return 0 (will be set on first sensor reading)
                0
            }

            promise.resolve(maxOf(0, todaySteps))
        } catch (e: Exception) {
            promise.reject("GET_STEP_COUNT_ERROR", "Error getting step count: ${e.message}", e)
        }
    }
    
    /**
     * Get raw sensor value (cumulative since device boot)
     */
    @ReactMethod
    fun getRawStepCount(promise: Promise) {
        try {
            if (stepCounterSensor == null) {
                promise.reject("SENSOR_UNAVAILABLE", "Step counter sensor is not available on this device")
                return
            }
            
            val rawValue = if (lastStepCount > 0f) {
                lastStepCount
            } else {
                lastKnownSensorValue
            }
            
            promise.resolve(rawValue.toDouble())
        } catch (e: Exception) {
            promise.reject("GET_RAW_STEP_COUNT_ERROR", "Error getting raw step count: ${e.message}", e)
        }
    }
    
    /**
     * Check if daily reset is needed and perform it if necessary
     * Returns true if reset happened, false otherwise
     */
    @ReactMethod
    fun checkAndResetDaily(promise: Promise) {
        try {
            val today = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
            val lastReset = lastResetDate
            
            if (lastReset != today) {
                // New day detected - perform reset
                val currentSensorValue = if (lastStepCount > 0f) {
                    lastStepCount
                } else {
                    lastKnownSensorValue
                }
                
                // Save yesterday's baseline (for history if needed)
                val yesterdayBaseline = baselineStepCount
                
                // Set new baseline to current sensor value
                baselineStepCount = currentSensorValue
                lastResetDate = today
                
                // Return reset info
                val result = Arguments.createMap().apply {
                    putBoolean("resetHappened", true)
                    putString("previousDate", lastReset)
                    putString("newDate", today)
                    putDouble("previousBaseline", yesterdayBaseline.toDouble())
                    putDouble("newBaseline", currentSensorValue.toDouble())
                }
                
                promise.resolve(result)
            } else {
                // No reset needed
                val result = Arguments.createMap().apply {
                    putBoolean("resetHappened", false)
                    putString("currentDate", today)
                }
                promise.resolve(result)
            }
        } catch (e: Exception) {
            promise.reject("DAILY_RESET_ERROR", "Error checking daily reset: ${e.message}", e)
        }
    }
    
    /**
     * Set baseline manually (useful for first-time setup or manual reset)
     */
    @ReactMethod
    fun setBaseline(baseline: Double, promise: Promise) {
        try {
            baselineStepCount = baseline.toFloat()
            lastResetDate = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("SET_BASELINE_ERROR", "Error setting baseline: ${e.message}", e)
        }
    }
    
    /**
     * Get baseline value
     */
    @ReactMethod
    fun getBaseline(promise: Promise) {
        try {
            promise.resolve(baselineStepCount.toDouble())
        } catch (e: Exception) {
            promise.reject("GET_BASELINE_ERROR", "Error getting baseline: ${e.message}", e)
        }
    }

    @ReactMethod
    fun resetStepCount() {
        try {
            val currentSensorValue = if (lastStepCount > 0f) {
                lastStepCount
            } else {
                lastKnownSensorValue
            }
            
            // Reset baseline to current sensor value (so today's steps become 0)
            baselineStepCount = currentSensorValue
            lastResetDate = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
        } catch (e: Exception) {
            sendErrorEvent("Error resetting step count: ${e.message}")
        }
    }

    override fun onSensorChanged(event: SensorEvent?) {
        event?.let {
            when (it.sensor.type) {
                Sensor.TYPE_STEP_COUNTER -> {
                    val currentSteps = it.values[0]
                    lastStepCount = currentSteps
                    lastKnownSensorValue = currentSteps // Persist to SharedPreferences
                    
                    // Set baseline on first reading if not set
                    if (baselineStepCount == 0f) {
                        baselineStepCount = currentSteps
                        lastResetDate = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
                    }
                    
                    // Calculate steps since baseline
                    val stepsSinceBaseline = (currentSteps - baselineStepCount).toInt()
                    
                    // Send event to JavaScript
                    val params = Arguments.createMap().apply {
                        putInt("stepCount", maxOf(0, stepsSinceBaseline))
                        putDouble("totalSteps", currentSteps.toDouble())
                        putDouble("baselineSteps", baselineStepCount.toDouble())
                        putDouble("timestamp", System.currentTimeMillis().toDouble())
                    }
                    
                    sendEvent("StepCountChanged", params)
                }
                Sensor.TYPE_STEP_DETECTOR -> {
                    // Step detector fires each time a step is detected
                    val params = Arguments.createMap().apply {
                        putDouble("timestamp", System.currentTimeMillis().toDouble())
                    }
                    sendEvent("StepDetected", params)
                }
            }
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {
        // Handle accuracy changes
        val params = Arguments.createMap().apply {
            putInt("accuracy", accuracy)
            putString("sensorType", when (sensor?.type) {
                Sensor.TYPE_STEP_COUNTER -> "STEP_COUNTER"
                Sensor.TYPE_STEP_DETECTOR -> "STEP_DETECTOR"
                else -> "UNKNOWN"
            })
        }
        sendEvent("SensorAccuracyChanged", params)
    }

    private fun sendEvent(eventName: String, params: WritableMap) {
        try {
            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(eventName, params)
        } catch (e: Exception) {
            // Log error but don't crash
            android.util.Log.e("StepCounterModule", "Error sending event: ${e.message}")
        }
    }

    private fun sendErrorEvent(message: String) {
        val params = Arguments.createMap().apply {
            putString("error", message)
            putDouble("timestamp", System.currentTimeMillis().toDouble())
        }
        sendEvent("StepCounterError", params)
    }

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        if (isListening) {
            try {
                sensorManager.unregisterListener(this)
            } catch (e: Exception) {
                // Ignore errors during cleanup
            }
        }
    }
}
