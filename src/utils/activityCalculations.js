/**
 * Activity Calculations
 * All calculations done locally, no external APIs
 */

/**
 * Calculate calories burned from steps
 * Formula: Calories = Steps × (Weight × 0.0005)
 * @param {number} steps - Number of steps
 * @param {number} weightKg - User weight in kilograms
 * @returns {number} Calories burned
 */
export const calculateCalories = (steps, weightKg = 70) => {
  if (!steps || steps <= 0) return 0;
  if (!weightKg || weightKg <= 0) weightKg = 70; // Default 70kg
  
  // Formula: ~40 calories per 1000 steps for average person
  // More accurate: Steps × (Weight × 0.0005)
  const calories = steps * (weightKg * 0.0005);
  return Math.round(calories);
};

/**
 * Calculate distance from steps
 * Formula: Distance = Steps × Stride Length
 * @param {number} steps - Number of steps
 * @param {number} strideLengthMeters - Stride length in meters (default 0.7m)
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (steps, strideLengthMeters = 0.7) => {
  if (!steps || steps <= 0) return 0;
  
  const distanceMeters = steps * strideLengthMeters;
  const distanceKm = distanceMeters / 1000;
  return Math.round(distanceKm * 10) / 10; // Round to 1 decimal
};

/**
 * Calculate stride length from height
 * Formula: Stride = Height × 0.43 (for walking)
 * @param {number} heightCm - Height in centimeters
 * @returns {number} Stride length in meters
 */
export const calculateStrideFromHeight = (heightCm) => {
  if (!heightCm || heightCm <= 0) return 0.7; // Default 0.7m
  
  // Average stride is ~43% of height
  const strideMeters = (heightCm / 100) * 0.43;
  return Math.round(strideMeters * 100) / 100; // Round to 2 decimals
};

/**
 * Calculate daily goal progress percentage
 * @param {number} currentSteps - Current step count
 * @param {number} dailyGoal - Daily step goal
 * @returns {number} Progress percentage (0-100)
 */
export const calculateGoalProgress = (currentSteps, dailyGoal = 10000) => {
  if (!dailyGoal || dailyGoal <= 0) return 0;
  const progress = (currentSteps / dailyGoal) * 100;
  return Math.min(100, Math.max(0, Math.round(progress * 10) / 10));
};

/**
 * Get motivational message based on progress
 * @param {number} progress - Progress percentage
 * @returns {string} Motivational message
 */
export const getMotivationalMessage = (progress) => {
  if (progress >= 100) return "🎉 Goal achieved! Amazing work!";
  if (progress >= 75) return "🔥 You're almost there! Keep going!";
  if (progress >= 50) return "💪 Halfway there! You've got this!";
  if (progress >= 25) return "🚶 Great start! Keep moving!";
  return "👟 Every step counts! Let's go!";
};

/**
 * Calculate active time from steps
 * Assumes average walking pace: 100 steps/minute
 * @param {number} steps - Number of steps
 * @returns {number} Active time in minutes
 */
export const calculateActiveTime = (steps) => {
  if (!steps || steps <= 0) return 0;
  // Average: 100 steps per minute
  const minutes = steps / 100;
  return Math.round(minutes);
};

/**
 * Format distance for display
 * @param {number} distanceKm - Distance in kilometers
 * @returns {string} Formatted distance string
 */
export const formatDistance = (distanceKm) => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
};

/**
 * Get steps remaining to reach goal
 * @param {number} currentSteps - Current step count
 * @param {number} dailyGoal - Daily step goal
 * @returns {number} Steps remaining
 */
export const getStepsRemaining = (currentSteps, dailyGoal = 10000) => {
  const remaining = dailyGoal - currentSteps;
  return Math.max(0, remaining);
};

export default {
  calculateCalories,
  calculateDistance,
  calculateStrideFromHeight,
  calculateGoalProgress,
  getMotivationalMessage,
  calculateActiveTime,
  formatDistance,
  getStepsRemaining,
};
