/**
 * Challenge Progress Manager
 * Handles challenge progress calculation and updates
 * Supports both time-based and activity-based progress
 */

/**
 * Mark today as completed if target is met (CRITICAL FIX)
 * This function actually updates the dailyCompletions object
 */
export const markDayCompleted = (challenge, activityTracking, dailyGoal) => {
  if (!challenge || !challenge.activityType || !activityTracking) {
    return challenge;
  }

  const today = new Date().toISOString().split('T')[0];
  const todayMet = isTodayTargetMet(challenge, activityTracking, dailyGoal);
  
  if (!todayMet) {
    return challenge; // Target not met, no changes
  }

  // Create a new dailyCompletions object (immutable update)
  const dailyCompletions = { ...(challenge.dailyCompletions || {}) };
  
  // Mark today as completed if not already marked
  if (!dailyCompletions[today]) {
    dailyCompletions[today] = true;
    
    // Calculate days completed to check milestones
    const daysCompleted = Object.keys(dailyCompletions).filter(
      date => dailyCompletions[date] === true
    ).length;
    
    // Check and add new milestones
    const milestonesReached = [...(challenge.milestonesReached || [])];
    const newMilestones = [];
    
    if (challenge.milestones && Array.isArray(challenge.milestones)) {
      challenge.milestones.forEach(milestone => {
        if (daysCompleted >= milestone.day && !milestonesReached.includes(milestone.day)) {
          milestonesReached.push(milestone.day);
          newMilestones.push(milestone);
        }
      });
    }
    
    // Return updated challenge with completed day and milestones
    return {
      ...challenge,
      dailyCompletions,
      milestonesReached,
      newMilestones: newMilestones.length > 0 ? newMilestones : undefined,
    };
  }
  
  return challenge;
};

/**
 * Calculate activity-based progress (FIXED)
 * Now properly uses dailyCompletions after marking today
 */
export const calculateActivityProgress = (challenge, activityTracking, dailyGoal) => {
  if (!challenge || !challenge.activityType) {
    return calculateProgress(challenge); // Fallback to time-based
  }

  // First, mark today as completed if target is met
  const challengeWithCompletion = markDayCompleted(challenge, activityTracking, dailyGoal);
  
  // Then calculate progress using updated dailyCompletions
  const dailyCompletions = challengeWithCompletion.dailyCompletions || {};
  const duration = challenge.duration || 7;
  
  // Count completed days (where value is true)
  const daysCompleted = Object.keys(dailyCompletions).filter(
    date => dailyCompletions[date] === true
  ).length;

  // For consistency type, use days completed
  if (challenge.activityType === 'consistency') {
    const progress = Math.min(Math.round((daysCompleted / duration) * 100), 100);
    return {
      ...challengeWithCompletion,
      progress: Math.max(0, progress),
      daysCompleted,
    };
  }

  // For other activity types, progress = (days completed / total days) * 100
  const progress = Math.min(Math.round((daysCompleted / duration) * 100), 100);
  
  return {
    ...challengeWithCompletion,
    progress: Math.max(0, progress),
    daysCompleted,
  };
};

/**
 * Calculate progress percentage based on days elapsed (time-based)
 */
export const calculateProgress = (challenge) => {
  if (!challenge || !challenge.createdAt || !challenge.duration) {
    return 0;
  }

  const startDate = new Date(challenge.createdAt);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);

  const daysElapsed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
  const totalDays = challenge.duration || 7;
  
  // Progress cannot exceed 100%
  const progress = Math.min(Math.round((daysElapsed / totalDays) * 100), 100);
  
  return Math.max(0, progress);
};

/**
 * Check if today's challenge target is met
 */
export const isTodayTargetMet = (challenge, activityTracking, dailyGoal) => {
  if (!challenge || !challenge.activityType) return false;

  const { activityType, targetValue } = challenge;
  let currentValue = 0;
  let target = targetValue;

  switch (activityType) {
    case 'steps':
      currentValue = activityTracking.todaySteps || 0;
      target = targetValue || 10000;
      break;
    case 'calories':
      currentValue = activityTracking.todayCalories || 0;
      target = targetValue || 500;
      break;
    case 'distance':
      currentValue = activityTracking.todayDistance || 0;
      target = targetValue || 5;
      break;
    case 'activeTime':
      currentValue = activityTracking.todayActiveTime || 0;
      target = targetValue || 30;
      break;
    case 'goal':
      currentValue = activityTracking.todaySteps || 0;
      target = dailyGoal || 10000;
      break;
    case 'consistency':
      // For consistency, any activity counts
      return (activityTracking.todaySteps || 0) > 0;
    default:
      return false;
  }

  return currentValue >= target;
};

/**
 * Check if daily task is completed
 */
export const isDailyTaskCompleted = (challenge, taskIndex, date = null) => {
  if (!challenge || !challenge.dailyTaskCompletions) return false;
  
  const today = date || new Date().toISOString().split('T')[0];
  const dayCompletions = challenge.dailyTaskCompletions[today] || {};
  
  return dayCompletions[taskIndex] === true;
};

/**
 * Check if milestone is reached
 */
export const isMilestoneReached = (challenge, milestoneDay) => {
  if (!challenge || !challenge.milestonesReached) return false;
  return challenge.milestonesReached.includes(milestoneDay);
};

/**
 * Get reached milestones
 */
export const getReachedMilestones = (challenge) => {
  if (!challenge || !challenge.milestones || !challenge.milestonesReached) return [];
  
  return challenge.milestones.filter(m => 
    challenge.milestonesReached.includes(m.day)
  );
};

/**
 * Get next milestone
 */
export const getNextMilestone = (challenge) => {
  if (!challenge || !challenge.milestones || !challenge.milestonesReached) {
    return challenge?.milestones?.[0] || null;
  }
  
  const reachedDays = challenge.milestonesReached || [];
  const nextMilestone = challenge.milestones.find(m => !reachedDays.includes(m.day));
  
  return nextMilestone || null;
};

/**
 * Check if challenge is completed (progress >= 100%)
 */
export const isChallengeCompleted = (challenge) => {
  if (!challenge) return false;
  
  const progress = challenge.progress || calculateProgress(challenge);
  return progress >= 100;
};

/**
 * Get days remaining in challenge
 */
export const getDaysRemaining = (challenge) => {
  if (!challenge || !challenge.createdAt || !challenge.duration) {
    return 0;
  }

  const startDate = new Date(challenge.createdAt);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);

  const daysElapsed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
  const totalDays = challenge.duration || 7;
  const daysRemaining = totalDays - daysElapsed;
  
  return Math.max(0, daysRemaining);
};

/**
 * Check challenge expiry (if challenge duration has passed)
 */
export const checkChallengeExpiry = (challenge) => {
  if (!challenge || !challenge.createdAt || !challenge.duration) {
    return challenge;
  }

  const startDate = new Date(challenge.createdAt);
  const today = new Date();
  startDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const daysElapsed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
  const duration = challenge.duration || 7;

  // If challenge duration has passed and not completed, mark as expired
  if (daysElapsed > duration && challenge.status === 'active') {
    return {
      ...challenge,
      status: 'expired',
      expiredAt: new Date().toISOString(),
    };
  }

  return challenge;
};

/**
 * Clean old daily completions (remove completions beyond challenge duration)
 */
export const cleanOldCompletions = (challenge) => {
  if (!challenge || !challenge.createdAt || !challenge.duration || !challenge.dailyCompletions) {
    return challenge;
  }

  const startDate = new Date(challenge.createdAt);
  const duration = challenge.duration || 7;
  const dailyCompletions = { ...(challenge.dailyCompletions || {}) };
  const cleanedCompletions = {};

  // Keep only completions within challenge duration
  Object.keys(dailyCompletions).forEach(date => {
    const completionDate = new Date(date);
    const daysSinceStart = Math.floor((completionDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    
    if (daysSinceStart >= 1 && daysSinceStart <= duration) {
      cleanedCompletions[date] = dailyCompletions[date];
    }
  });

  return {
    ...challenge,
    dailyCompletions: cleanedCompletions,
  };
};

/**
 * Generate daily breakdown array from challenge and activity data
 * Creates array with all days from challenge start to today
 */
export const generateDailyBreakdown = (challenge, activityTracking, dailyGoal) => {
  if (!challenge || !challenge.createdAt) return [];

  const startDate = new Date(challenge.createdAt);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);

  const dailyBreakdown = [];
  const duration = challenge.duration || 7;
  const dailyCompletions = challenge.dailyCompletions || {};
  const dailyActivityHistory = challenge.dailyActivityHistory || {}; // Store actual values

  // Get today's activity value
  const todayValue = getTodayActivityValue(challenge, activityTracking, dailyGoal);
  const todayDateStr = today.toISOString().split('T')[0];

  // Store today's value in history if not already stored
  if (!dailyActivityHistory[todayDateStr] && todayValue > 0) {
    dailyActivityHistory[todayDateStr] = todayValue;
  }

  // Generate breakdown for all days from start to today (or duration)
  for (let i = 0; i < duration; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    currentDate.setHours(0, 0, 0, 0);
    
    // Don't show future days
    if (currentDate > today) break;

    const dateStr = currentDate.toISOString().split('T')[0];
    const isToday = dateStr === todayDateStr;
    
    // Get value for this day (from history or today's current value)
    let value = dailyActivityHistory[dateStr] || 0;
    if (isToday) {
      value = todayValue; // Use current activity for today
    }

    // Check if this day is completed
    const completed = dailyCompletions[dateStr] === true || 
                     (isToday && isTodayTargetMet(challenge, activityTracking, dailyGoal));

    dailyBreakdown.push({
      date: dateStr,
      value: value,
      completed: completed,
    });
  }

  return dailyBreakdown;
};

/**
 * Get today's activity value based on challenge activity type
 */
const getTodayActivityValue = (challenge, activityTracking, dailyGoal) => {
  if (!challenge || !challenge.activityType || !activityTracking) return 0;

  const { activityType, targetValue } = challenge;

  switch (activityType) {
    case 'steps':
      return activityTracking.todaySteps || 0;
    case 'calories':
      return activityTracking.todayCalories || 0;
    case 'distance':
      return activityTracking.todayDistance || 0;
    case 'activeTime':
      return activityTracking.todayActiveTime || 0;
    case 'goal':
      return activityTracking.todaySteps || 0;
    case 'consistency':
      return (activityTracking.todaySteps || 0) > 0 ? 1 : 0;
    default:
      return 0;
  }
};

/**
 * Calculate summary statistics from daily breakdown
 */
export const calculateProgressStats = (dailyBreakdown) => {
  if (!dailyBreakdown || dailyBreakdown.length === 0) {
    return {
      currentValue: 0,
      averageDaily: 0,
      bestDay: null,
      worstDay: null,
      daysCompleted: 0,
    };
  }

  const values = dailyBreakdown.map(d => d.value || 0);
  const currentValue = values.reduce((sum, val) => sum + val, 0);
  const averageDaily = currentValue / dailyBreakdown.length;
  const daysCompleted = dailyBreakdown.filter(d => d.completed).length;

  const bestDay = dailyBreakdown.reduce((best, day) => {
    return (!best || (day.value || 0) > (best.value || 0)) ? day : best;
  }, null);

  const worstDay = dailyBreakdown.reduce((worst, day) => {
    const dayValue = day.value || 0;
    const worstValue = worst ? (worst.value || 0) : Infinity;
    return dayValue > 0 && dayValue < worstValue ? day : worst;
  }, null);

  return {
    currentValue,
    averageDaily,
    bestDay,
    worstDay,
    daysCompleted,
  };
};

/**
 * Update challenge progress (supports both time and activity-based) - FIXED
 * Now properly marks days as completed and calculates progress with dailyBreakdown
 */
export const updateChallengeProgress = (challenge, activityTracking = null, dailyGoal = null) => {
  if (!challenge) return challenge;

  // Clean old completions first
  let updatedChallenge = cleanOldCompletions(challenge);

  // Check for expiry
  updatedChallenge = checkChallengeExpiry(updatedChallenge);

  // If expired or completed, return as is (but still generate breakdown for display)
  if (updatedChallenge.status === 'expired' || updatedChallenge.status === 'completed') {
    // Generate breakdown for historical display even if expired/completed
    const dailyBreakdown = generateDailyBreakdown(updatedChallenge, activityTracking, dailyGoal);
    const stats = calculateProgressStats(dailyBreakdown);
    
    const existingProgress = typeof updatedChallenge.progress === 'number'
      ? { percentage: updatedChallenge.progress }
      : (updatedChallenge.progress || {});
    
    return {
      ...updatedChallenge,
      progress: {
        ...existingProgress,
        dailyBreakdown,
        currentValue: stats.currentValue,
        averageDaily: stats.averageDaily,
        bestDay: stats.bestDay,
        worstDay: stats.worstDay,
        daysCompleted: stats.daysCompleted,
      },
    };
  }

  // Use activity-based progress if activity tracking is available and challenge has activityType
  let challengeWithProgress;
  if (updatedChallenge.activityType && activityTracking) {
    // This will mark today as completed and calculate progress
    challengeWithProgress = calculateActivityProgress(updatedChallenge, activityTracking, dailyGoal);
  } else {
    // Fallback to time-based progress
    const progress = calculateProgress(updatedChallenge);
    challengeWithProgress = {
      ...updatedChallenge,
      progress,
    };
  }

  // Generate daily breakdown array for charts
  const dailyBreakdown = generateDailyBreakdown(challengeWithProgress, activityTracking, dailyGoal);
  
  // Calculate progress statistics
  const stats = calculateProgressStats(dailyBreakdown);
  
  // Update daily activity history with today's value
  const todayDateStr = new Date().toISOString().split('T')[0];
  const dailyActivityHistory = { ...(challengeWithProgress.dailyActivityHistory || {}) };
  const todayValue = getTodayActivityValue(challengeWithProgress, activityTracking, dailyGoal);
  if (todayValue > 0) {
    dailyActivityHistory[todayDateStr] = todayValue;
  }

  const isCompleted = challengeWithProgress.progress >= 100;
  const daysRemaining = getDaysRemaining(challengeWithProgress);

  // Calculate trend from breakdown
  const trend = calculateTrendFromBreakdown(dailyBreakdown);

  // If progress is a number, convert it to an object
  const progressObject = typeof challengeWithProgress.progress === 'number' 
    ? { percentage: challengeWithProgress.progress }
    : (challengeWithProgress.progress || {});

  return {
    ...challengeWithProgress,
    dailyActivityHistory, // Store actual values for each day
    progress: {
      ...progressObject,
      percentage: challengeWithProgress.progress || 0,
      dailyBreakdown,
      currentValue: stats.currentValue,
      averageDaily: stats.averageDaily,
      bestDay: stats.bestDay,
      worstDay: stats.worstDay,
      daysCompleted: stats.daysCompleted,
      weeklyTrend: trend,
    },
    daysRemaining,
    status: isCompleted ? 'completed' : (updatedChallenge.status || 'active'),
    completedAt: isCompleted && !updatedChallenge.completedAt 
      ? new Date().toISOString() 
      : updatedChallenge.completedAt,
  };
};

/**
 * Calculate trend from daily breakdown
 */
const calculateTrendFromBreakdown = (dailyBreakdown) => {
  if (!dailyBreakdown || dailyBreakdown.length < 3) return 'stable';

  const values = dailyBreakdown.map(d => d.value || 0);
  const midPoint = Math.floor(values.length / 2);

  const firstHalf = values.slice(0, midPoint);
  const secondHalf = values.slice(midPoint);

  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

  if (firstAvg === 0) return 'stable';

  const improvement = ((secondAvg - firstAvg) / firstAvg) * 100;

  if (improvement > 10) return 'improving';
  if (improvement < -10) return 'declining';
  return 'stable';
};

/**
 * Get progress value (handles both number and object formats)
 * Fixes NaN issue by extracting percentage from progress object
 */
export const getProgressValue = (progress) => {
  if (typeof progress === 'number') {
    return progress;
  }
  if (progress && typeof progress === 'object') {
    return progress.percentage || 0;
  }
  return 0;
};

/**
 * Get task progress information for activity-based tasks
 * Returns current value, target, unit, and completion status
 */
export const getTaskProgress = (taskText, challenge, activityTracking, dailyGoal) => {
  if (!challenge || !challenge.activityType || !activityTracking) {
    return null;
  }

  // Check if task text contains activity keywords
  const taskLower = taskText.toLowerCase();
  const activityType = challenge.activityType;
  const targetValue = challenge.targetValue;

  // Extract numbers from task text (e.g., "Walk 10,000 steps" -> 10000)
  const numberMatch = taskText.match(/[\d,]+/);
  const extractedTarget = numberMatch ? parseInt(numberMatch[0].replace(/,/g, '')) : null;

  let currentValue = 0;
  let target = extractedTarget || targetValue;
  let unit = '';
  let isActivityTask = false;

  // Determine if this is an activity task and get current value
  if (activityType === 'steps' && (taskLower.includes('step') || taskLower.includes('walk'))) {
    currentValue = activityTracking.todaySteps || 0;
    target = target || 10000;
    unit = 'steps';
    isActivityTask = true;
  } else if (activityType === 'calories' && taskLower.includes('calorie')) {
    currentValue = activityTracking.todayCalories || 0;
    target = target || 500;
    unit = 'cal';
    isActivityTask = true;
  } else if (activityType === 'distance' && (taskLower.includes('km') || taskLower.includes('distance'))) {
    currentValue = activityTracking.todayDistance || 0;
    target = target || 5;
    unit = 'km';
    isActivityTask = true;
  } else if (activityType === 'activeTime' && (taskLower.includes('minute') || taskLower.includes('active'))) {
    currentValue = activityTracking.todayActiveTime || 0;
    target = target || 30;
    unit = 'min';
    isActivityTask = true;
  } else if (activityType === 'goal' && taskLower.includes('goal')) {
    currentValue = activityTracking.todaySteps || 0;
    target = dailyGoal || 10000;
    unit = 'steps';
    isActivityTask = true;
  } else if (activityType === 'consistency' && (taskLower.includes('stay active') || taskLower.includes('consistent'))) {
    currentValue = activityTracking.todaySteps || 0;
    target = 1000; // Minimum for consistency
    unit = 'steps';
    isActivityTask = true;
  }

  if (!isActivityTask) {
    return null; // Not an activity task
  }

  const progress = Math.min((currentValue / target) * 100, 100);
  const completed = currentValue >= target;

  return {
    currentValue,
    target,
    unit,
    progress,
    completed,
    isActivityTask: true,
  };
};

/**
 * Check if task is activity-based (auto-completes)
 */
export const isActivityTask = (taskText, challenge) => {
  if (!challenge || !challenge.activityType) return false;

  const taskLower = taskText.toLowerCase();
  const activityType = challenge.activityType;

  if (activityType === 'steps' && (taskLower.includes('step') || taskLower.includes('walk'))) {
    return true;
  }
  if (activityType === 'calories' && taskLower.includes('calorie')) {
    return true;
  }
  if (activityType === 'distance' && (taskLower.includes('km') || taskLower.includes('distance'))) {
    return true;
  }
  if (activityType === 'activeTime' && (taskLower.includes('minute') || taskLower.includes('active'))) {
    return true;
  }
  if (activityType === 'goal' && taskLower.includes('goal')) {
    return true;
  }
  if (activityType === 'consistency' && (taskLower.includes('stay active') || taskLower.includes('consistent'))) {
    return true;
  }

  return false;
};

/**
 * Update multiple challenges progress
 */
export const updateChallengesProgress = (challenges) => {
  if (!Array.isArray(challenges)) return [];

  return challenges.map(challenge => updateChallengeProgress(challenge));
};

/**
 * Get active challenges that need progress updates
 */
export const getActiveChallenges = (challenges) => {
  if (!Array.isArray(challenges)) return [];

  return challenges.filter(challenge => {
    const status = challenge.status || 'active';
    return status === 'active' && !isChallengeCompleted(challenge);
  });
};

/**
 * Get completed challenges
 */
export const getCompletedChallenges = (challenges) => {
  if (!Array.isArray(challenges)) return [];

  return challenges.filter(challenge => {
    return isChallengeCompleted(challenge) || challenge.status === 'completed';
  });
};

/**
 * Get new milestones that were just reached (for celebration)
 */
export const getNewMilestones = (challenge) => {
  return challenge.newMilestones || [];
};

/**
 * Sync challenge progress with store (persists daily completions)
 */
export const syncChallengeProgress = (challenge, activityTracking, dailyGoal) => {
  const updated = updateChallengeProgress(challenge, activityTracking, dailyGoal);
  
  // Return updated challenge with all changes
  return updated;
};

export default {
  calculateProgress,
  calculateActivityProgress,
  markDayCompleted,
  isChallengeCompleted,
  getDaysRemaining,
  updateChallengeProgress,
  updateChallengesProgress,
  getActiveChallenges,
  getCompletedChallenges,
  isTodayTargetMet,
  isDailyTaskCompleted,
  isMilestoneReached,
  getReachedMilestones,
  getNextMilestone,
  checkChallengeExpiry,
  cleanOldCompletions,
  getNewMilestones,
  syncChallengeProgress,
  getProgressValue,
  getTaskProgress,
  isActivityTask,
};
