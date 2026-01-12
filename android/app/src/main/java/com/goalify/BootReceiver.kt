package com.goalify

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.util.Log

/**
 * BootReceiver handles device reboot events
 * When device reboots, the step counter sensor resets to 0,
 * so we need to reset our baseline as well
 */
class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED) {
            try {
                val prefs: SharedPreferences = 
                    context.getSharedPreferences("StepCounterPrefs", Context.MODE_PRIVATE)
                
                // Reset baseline after reboot (sensor resets to 0 on reboot)
                prefs.edit()
                    .putFloat("baselineSteps", 0f)
                    .putFloat("lastKnownSensorValue", 0f)
                    .apply()
                
                Log.d("BootReceiver", "Step counter baseline reset after device reboot")
            } catch (e: Exception) {
                Log.e("BootReceiver", "Error resetting step counter baseline: ${e.message}")
            }
        }
    }
}
