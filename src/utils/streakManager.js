/**
 * Streak Manager
 * Handles automatic streak tracking and management
 */

/**
 * Check if a date is today
 */
const isToday = (dateString) => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const today = new Date();
  
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if a date is yesterday
 */
const isYesterday = (dateString) => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
};

/**
 * Get days since last activity
 */
export const getDaysSinceLastActivity = (lastActivityDate) => {
  if (!lastActivityDate) return null;
  
  const lastDate = new Date(lastActivityDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  lastDate.setHours(0, 0, 0, 0);
  
  const diffTime = today - lastDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Check if streak should be incremented
 * Returns true if user completed activity today and hasn't already incremented
 */
export const shouldIncrementStreak = (lastActivityDate) => {
  // If no last activity, can start streak
  if (!lastActivityDate) return true;
  
  // If last activity was today, don't increment again
  if (isToday(lastActivityDate)) return false;
  
  // If last activity was yesterday, can increment
  if (isYesterday(lastActivityDate)) return true;
  
  // If last activity was more than 1 day ago, streak should reset
  return false;
};

/**
 * Check if streak should be reset
 * Returns true if user missed a day (last activity was more than 1 day ago)
 */
export const shouldResetStreak = (lastActivityDate) => {
  if (!lastActivityDate) return false;
  
  const daysSince = getDaysSinceLastActivity(lastActivityDate);
  
  // Reset if more than 1 day has passed since last activity
  return daysSince !== null && daysSince > 1;
};

/**
 * Calculate new streak state based on current state and activity
 */
export const calculateStreakState = (currentStreak, longestStreak, lastActivityDate) => {
  const today = new Date().toISOString();
  
  // Check if we should reset
  if (shouldResetStreak(lastActivityDate)) {
    return {
      currentStreak: 0,
      longestStreak: Math.max(currentStreak, longestStreak),
      lastActivityDate: null,
      shouldUpdate: true,
    };
  }
  
  // Check if we should increment
  if (shouldIncrementStreak(lastActivityDate)) {
    const newStreak = currentStreak + 1;
    return {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, longestStreak),
      lastActivityDate: today,
      shouldUpdate: true,
    };
  }
  
  // No change needed
  return {
    currentStreak,
    longestStreak,
    lastActivityDate: lastActivityDate || today,
    shouldUpdate: false,
  };
};

/**
 * Auto-update streak based on last activity
 * This should be called on app launch or when checking streak
 */
export const autoUpdateStreak = (streakState) => {
  const { currentStreak, longestStreak, lastActivityDate } = streakState;
  
  return calculateStreakState(currentStreak, longestStreak, lastActivityDate);
};

export default {
  getDaysSinceLastActivity,
  shouldIncrementStreak,
  shouldResetStreak,
  calculateStreakState,
  autoUpdateStreak,
};
