/**
 * useStepCounter Hook
 * React hook for managing step counter functionality
 * Auto-loads steps on mount and calculates metrics
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { AppState } from 'react-native';
import {
  requestStepCounterPermissions,
  isStepCounterAvailable,
  startStepCounter,
  stopStepCounter,
  getStepCount,
  resetStepCount as resetStepCountService,
  checkAndResetDaily,
  getRawStepCount,
  getBaseline,
} from '../services/stepCounterService';
import useStore from '../state/store';
import {
  calculateCalories,
  calculateDistance,
  calculateStrideFromHeight,
  calculateGoalProgress,
  getMotivationalMessage,
  calculateActiveTime,
} from '../utils/activityCalculations';

export const useStepCounter = () => {
  // UI state only (not data state)
  const [isAvailable, setIsAvailable] = useState(false);
  const [isActive, setIsActive] = useState(false);
  // Only show loading if no data exists in store
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const cleanupRef = useRef(null);
  const initializedRef = useRef(false);

  // Get store state and actions
  const { user, activityTracking, updateActivityTracking, resetActivityTracking, addDailyStepRecord } = useStore();
  
  // Data comes from store (single source of truth)
  const stepCount = activityTracking.todaySteps || 0;
  
  // Calculate metrics from steps
  const calculateMetrics = useCallback((steps) => {
    const weight = user.weight || 70;
    const height = user.height || 175;
    const strideLength = user.strideLength || calculateStrideFromHeight(height);
    const dailyGoal = user.dailyStepGoal || 10000;
    
    const calories = calculateCalories(steps, weight);
    const distance = calculateDistance(steps, strideLength);
    const activeTime = calculateActiveTime(steps);
    const goalProgress = calculateGoalProgress(steps, dailyGoal);
    const motivationalMessage = getMotivationalMessage(goalProgress);
    
    return {
      calories,
      distance,
      activeTime,
      goalProgress,
      motivationalMessage,
      strideLength,
    };
  }, [user.weight, user.height, user.strideLength, user.dailyStepGoal]);

  // Check if daily reset is needed
  const checkDailyReset = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastResetDate = activityTracking.lastResetDate;
    
    if (lastResetDate !== today) {
      // Save yesterday's record if steps > 0
      if (activityTracking.todaySteps > 0 && lastResetDate) {
        addDailyStepRecord({
          date: lastResetDate,
          steps: activityTracking.todaySteps,
          calories: activityTracking.todayCalories,
          distance: activityTracking.todayDistance,
          activeTime: activityTracking.todayActiveTime,
        });
      }
      
      // Reset for new day
      resetActivityTracking();
      return true;
    }
    return false;
  }, [activityTracking, addDailyStepRecord, resetActivityTracking]);

  // Auto-initialize and load steps on mount
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    
    initializeStepCounter();
    
    return () => {
      // Cleanup on unmount
      if (cleanupRef.current) {
        cleanupRef.current();
      }
      stopStepCounter();
    };
  }, []);

  // Refresh steps when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && hasPermission && isAvailable) {
        // App came to foreground - refresh steps
        refresh();
      }
    });

    return () => {
      subscription?.remove();
    };
  }, [hasPermission, isAvailable, refresh]);

  // Initialize step counter (auto-load steps)
  const initializeStepCounter = useCallback(async () => {
    try {
      // Check if we have stored data - only show loading if no data exists
      const hasStoredData = activityTracking.todaySteps > 0 && activityTracking.lastUpdate;
      setIsLoading(!hasStoredData);
      setError(null);

      // Check availability
      const available = await isStepCounterAvailable();
      setIsAvailable(available);
      
      if (!available) {
        setIsLoading(false);
        return;
      }

      // Request permissions first
      const permissionResult = await requestStepCounterPermissions();
      if (!permissionResult.granted) {
        setHasPermission(false);
        setError(permissionResult.error || 'Permission denied');
        setIsLoading(false);
        return;
      }
      
      setHasPermission(true);
      
      // Check and perform daily reset if needed (native module handles this)
      try {
        const resetResult = await checkAndResetDaily();
        if (resetResult.resetHappened) {
          console.log('Daily reset performed:', resetResult);
          // Reset store tracking for new day
          resetActivityTracking();
        }
      } catch (err) {
        console.warn('Could not check daily reset:', err);
        // Continue anyway - will check in JavaScript
        checkDailyReset();
      }
      
      // AUTO-START TRACKING: Start step counter automatically when permission is granted
      try {
        // Get baseline from native module (persisted in SharedPreferences)
        let baseline = 0;
        try {
          baseline = await getBaseline();
        } catch (err) {
          console.warn('Could not get baseline:', err);
          baseline = activityTracking.baselineSteps || 0;
        }

        // Start step counter with callback (automatic tracking)
        cleanupRef.current = startStepCounter(async (data) => {
          if (data.error) {
            setError(data.error);
          } else {
            // Data from native module already has calculated stepCount (current - baseline)
            const todaySteps = data.stepCount || 0;
            
            // Calculate metrics
            const metrics = calculateMetrics(todaySteps);
            
            // Get current baseline from native
            let currentBaseline = baseline;
            try {
              currentBaseline = await getBaseline();
            } catch (err) {
              console.warn('Could not get baseline in callback:', err);
            }
            
            // Update store only (stepCount updates automatically)
            updateActivityTracking({
              todaySteps,
              todayCalories: metrics.calories,
              todayDistance: metrics.distance,
              todayActiveTime: metrics.activeTime,
              baselineSteps: currentBaseline,
              lastUpdate: new Date().toISOString(),
              lastResetDate: new Date().toISOString().split('T')[0],
            });
            
            setError(null);
          }
        });

        if (cleanupRef.current) {
          setIsActive(true);
          setError(null);
        } else {
          setError('Failed to start step counter');
        }
      } catch (startErr) {
        console.warn('Could not auto-start step counter:', startErr);
        // Fallback: try to get step count manually
        try {
          const todaySteps = await getStepCount();
          const metrics = calculateMetrics(todaySteps);
          
          // Update store only
          updateActivityTracking({
            todaySteps,
            todayCalories: metrics.calories,
            todayDistance: metrics.distance,
            todayActiveTime: metrics.activeTime,
            lastUpdate: new Date().toISOString(),
            lastResetDate: new Date().toISOString().split('T')[0],
          });
        } catch (fallbackErr) {
          // If error and no stored data, show error
          if (!hasStoredData) {
            setError(fallbackErr.message || 'Failed to load step count');
          }
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to initialize step counter');
      setIsAvailable(false);
    } finally {
      setIsLoading(false);
    }
  }, [activityTracking, calculateMetrics, checkDailyReset, updateActivityTracking, resetActivityTracking]);

  const checkAvailability = useCallback(async () => {
    try {
      setIsLoading(true);
      const available = await isStepCounterAvailable();
      setIsAvailable(available);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to check step counter availability');
      setIsAvailable(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const requestPermissions = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await requestStepCounterPermissions();
      
      if (result.granted) {
        setHasPermission(true);
        setError(null);
        return true;
      } else {
        setHasPermission(false);
        setError(result.error || 'Permission denied');
        return false;
      }
    } catch (err) {
      setError(err.message || 'Failed to request permissions');
      setHasPermission(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const start = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Request permissions first
      const permissionGranted = await requestPermissions();
      if (!permissionGranted) {
        return;
      }

      // Check availability
      const available = await isStepCounterAvailable();
      if (!available) {
        setError('Step counter is not available on this device');
        return;
      }

      // Get baseline from native module (persisted in SharedPreferences)
      let baseline = 0;
      try {
        baseline = await getBaseline();
        if (baseline === 0) {
          // If no baseline, get raw count and set it as baseline
          const rawCount = await getRawStepCount();
          if (rawCount > 0) {
            baseline = rawCount;
            // Note: Native module will set baseline on first sensor reading
            // But we can also set it manually if needed
          }
        }
      } catch (err) {
        console.warn('Could not get baseline:', err);
        // Fallback to store value
        baseline = activityTracking.baselineSteps || 0;
      }

      // Start step counter with callback
      cleanupRef.current = startStepCounter(async (data) => {
        if (data.error) {
          setError(data.error);
        } else {
          // Data from native module already has calculated stepCount (current - baseline)
          const todaySteps = data.stepCount || 0;
          
          // Calculate metrics
          const metrics = calculateMetrics(todaySteps);
          
          // Get current baseline from native
          let currentBaseline = baseline;
          try {
            currentBaseline = await getBaseline();
          } catch (err) {
            console.warn('Could not get baseline in callback:', err);
          }
          
          // Update store only (stepCount updates automatically)
          updateActivityTracking({
            todaySteps,
            todayCalories: metrics.calories,
            todayDistance: metrics.distance,
            todayActiveTime: metrics.activeTime,
            baselineSteps: currentBaseline,
            lastUpdate: new Date().toISOString(),
          });
          
          setError(null);
        }
      });

      if (cleanupRef.current) {
        setIsActive(true);
        setError(null);
      } else {
        setError('Failed to start step counter');
      }
    } catch (err) {
      setError(err.message || 'Failed to start step counter');
      setIsActive(false);
    } finally {
      setIsLoading(false);
    }
  }, [requestPermissions, activityTracking, calculateMetrics, updateActivityTracking]);

  const stop = useCallback(() => {
    try {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      stopStepCounter();
      setIsActive(false);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to stop step counter');
    }
  }, []);

  const reset = useCallback(() => {
    try {
      resetStepCountService();
      // Reset store (stepCount will be 0 automatically)
      resetActivityTracking();
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to reset step count');
    }
  }, [resetActivityTracking]);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Check daily reset first
      try {
        const resetResult = await checkAndResetDaily();
        if (resetResult.resetHappened) {
          console.log('Daily reset performed on refresh:', resetResult);
          resetActivityTracking();
        }
      } catch (err) {
        console.warn('Could not check daily reset on refresh:', err);
        checkDailyReset();
      }
      
      // Get current step count (native module handles calculation)
      const todaySteps = await getStepCount();
      
      // Calculate metrics
      const metrics = calculateMetrics(todaySteps);
      
      // Get baseline for store
      const baseline = await getBaseline().catch(() => 0);
      
      // Update store only (stepCount updates automatically)
      updateActivityTracking({
        todaySteps,
        todayCalories: metrics.calories,
        todayDistance: metrics.distance,
        todayActiveTime: metrics.activeTime,
        baselineSteps: baseline,
        lastUpdate: new Date().toISOString(),
        lastResetDate: new Date().toISOString().split('T')[0],
      });
      
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to refresh step count');
    } finally {
      setIsLoading(false);
    }
  }, [activityTracking, calculateMetrics, updateActivityTracking, checkDailyReset, resetActivityTracking]);

  // Get calculated metrics from store's stepCount (single source of truth)
  const metrics = calculateMetrics(stepCount);
  const dailyGoal = user.dailyStepGoal || 10000;
  const stepsRemaining = Math.max(0, dailyGoal - stepCount);

  return {
    stepCount, // From store (single source of truth)
    isAvailable,
    isActive,
    isLoading,
    error,
    hasPermission,
    start,
    stop,
    reset,
    refresh,
    requestPermissions,
    checkAvailability,
    // Additional metrics (calculated from store's stepCount)
    calories: metrics.calories,
    distance: metrics.distance,
    activeTime: metrics.activeTime,
    goalProgress: metrics.goalProgress,
    motivationalMessage: metrics.motivationalMessage,
    dailyGoal,
    stepsRemaining,
  };
};

export default useStepCounter;
