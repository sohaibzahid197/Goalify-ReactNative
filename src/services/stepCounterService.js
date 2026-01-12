/**
 * Step Counter Service
 * Handles step counter functionality with proper permissions and error handling
 */

import { NativeModules, NativeEventEmitter, PermissionsAndroid, Platform } from 'react-native';

// Safely get StepCounter module with error handling
let StepCounter = null;
let stepCounterEmitter = null;

try {
  StepCounter = NativeModules.StepCounter || null;
  if (StepCounter) {
    stepCounterEmitter = new NativeEventEmitter(StepCounter);
  }
} catch (error) {
  console.warn('StepCounter native module not available:', error);
  StepCounter = null;
  stepCounterEmitter = null;
}

/**
 * Request Android permissions for step counter
 * Required for Android 10+ (API 29+)
 */
export const requestStepCounterPermissions = async () => {
  if (Platform.OS !== 'android') {
    return { granted: false, error: 'Step counter only available on Android' };
  }

  try {
    // For Android 10+ (API 29+), need ACTIVITY_RECOGNITION permission
    if (Platform.Version >= 29) {
      // First, check if permission is already granted
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION
      );

      if (hasPermission) {
        // Permission already granted, return success
        return { granted: true };
      }

      // Permission not granted, request it
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
        {
          title: 'Activity Recognition Permission',
          message: 'Goalify needs access to your step count to track your fitness goals and challenges.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        return { 
          granted: false, 
          error: 'Activity recognition permission is required to track steps' 
        };
      }
    }

    return { granted: true };
  } catch (err) {
    console.error('Error requesting step counter permissions:', err);
    return { 
      granted: false, 
      error: err.message || 'Failed to request permissions' 
    };
  }
};

/**
 * Check if step counter is available on device
 */
export const isStepCounterAvailable = async () => {
  if (!StepCounter) {
    return false;
  }

  try {
    const available = await StepCounter.isStepCounterAvailable();
    return available;
  } catch (error) {
    console.error('Error checking step counter availability:', error);
    return false;
  }
};

/**
 * Check if step detector is available on device
 */
export const isStepDetectorAvailable = async () => {
  if (!StepCounter) {
    return false;
  }

  try {
    const available = await StepCounter.isStepDetectorAvailable();
    return available;
  } catch (error) {
    console.error('Error checking step detector availability:', error);
    return false;
  }
};

/**
 * Start step counter
 * @param {Function} callback - Callback function that receives step data
 * @returns {Function} Cleanup function to stop the step counter
 */
export const startStepCounter = (callback) => {
  if (!StepCounter) {
    console.error('StepCounter native module not available');
    return null;
  }

  if (!stepCounterEmitter) {
    console.error('StepCounter event emitter not available');
    return null;
  }

  try {
    // Set up event listeners
    const stepCountSubscription = stepCounterEmitter.addListener(
      'StepCountChanged',
      (data) => {
        if (callback) {
          callback({
            stepCount: data.stepCount || 0,
            totalSteps: data.totalSteps || 0,
            baselineSteps: data.baselineSteps || 0,
            timestamp: data.timestamp || Date.now(),
          });
        }
      }
    );

    const stepDetectedSubscription = stepCounterEmitter.addListener(
      'StepDetected',
      (data) => {
        // Optional: Handle individual step detection
        // This fires each time a step is detected
      }
    );

    const errorSubscription = stepCounterEmitter.addListener(
      'StepCounterError',
      (data) => {
        console.error('Step counter error:', data.error);
        if (callback) {
          callback({ error: data.error });
        }
      }
    );

    // Start the step counter
    StepCounter.startStepCounter();

    // Return cleanup function
    return () => {
      try {
        stepCountSubscription.remove();
        stepDetectedSubscription.remove();
        errorSubscription.remove();
        StepCounter.stopStepCounter();
      } catch (error) {
        console.error('Error cleaning up step counter:', error);
      }
    };
  } catch (error) {
    console.error('Error starting step counter:', error);
    return null;
  }
};

/**
 * Stop step counter
 */
export const stopStepCounter = () => {
  if (!StepCounter) {
    console.error('StepCounter native module not available');
    return;
  }

  try {
    StepCounter.stopStepCounter();
  } catch (error) {
    console.error('Error stopping step counter:', error);
  }
};

/**
 * Get current step count
 * @returns {Promise<number>} Current step count
 */
export const getStepCount = async () => {
  if (!StepCounter) {
    throw new Error('StepCounter native module not available');
  }

  try {
    const stepCount = await StepCounter.getStepCount();
    return stepCount || 0;
  } catch (error) {
    console.error('Error getting step count:', error);
    throw error;
  }
};

/**
 * Reset step count to zero
 */
export const resetStepCount = () => {
  if (!StepCounter) {
    console.error('StepCounter native module not available');
    return;
  }

  try {
    StepCounter.resetStepCount();
  } catch (error) {
    console.error('Error resetting step count:', error);
  }
};

/**
 * Get raw sensor value (cumulative since device boot)
 * @returns {Promise<number>} Raw sensor value
 */
export const getRawStepCount = async () => {
  if (!StepCounter) {
    throw new Error('StepCounter native module not available');
  }

  try {
    const rawCount = await StepCounter.getRawStepCount();
    return rawCount || 0;
  } catch (error) {
    console.error('Error getting raw step count:', error);
    throw error;
  }
};

/**
 * Check if daily reset is needed and perform it if necessary
 * @returns {Promise<Object>} Reset information
 */
export const checkAndResetDaily = async () => {
  if (!StepCounter) {
    throw new Error('StepCounter native module not available');
  }

  try {
    const result = await StepCounter.checkAndResetDaily();
    return result;
  } catch (error) {
    console.error('Error checking daily reset:', error);
    throw error;
  }
};

/**
 * Set baseline manually
 * @param {number} baseline - Baseline value to set
 * @returns {Promise<boolean>} Success status
 */
export const setBaseline = async (baseline) => {
  if (!StepCounter) {
    throw new Error('StepCounter native module not available');
  }

  try {
    const success = await StepCounter.setBaseline(baseline);
    return success;
  } catch (error) {
    console.error('Error setting baseline:', error);
    throw error;
  }
};

/**
 * Get current baseline value
 * @returns {Promise<number>} Baseline value
 */
export const getBaseline = async () => {
  if (!StepCounter) {
    throw new Error('StepCounter native module not available');
  }

  try {
    const baseline = await StepCounter.getBaseline();
    return baseline || 0;
  } catch (error) {
    console.error('Error getting baseline:', error);
    throw error;
  }
};

export default {
  requestStepCounterPermissions,
  isStepCounterAvailable,
  isStepDetectorAvailable,
  startStepCounter,
  stopStepCounter,
  getStepCount,
  resetStepCount,
  getRawStepCount,
  checkAndResetDaily,
  setBaseline,
  getBaseline,
};
