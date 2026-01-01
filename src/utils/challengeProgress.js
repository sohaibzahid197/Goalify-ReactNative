/**
 * Challenge Progress Manager
 * Handles challenge progress calculation and updates
 */

/**
 * Calculate progress percentage based on days elapsed
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
 * Update challenge progress
 */
export const updateChallengeProgress = (challenge) => {
  if (!challenge) return challenge;

  const progress = calculateProgress(challenge);
  const isCompleted = progress >= 100;
  const daysRemaining = getDaysRemaining(challenge);

  return {
    ...challenge,
    progress,
    daysRemaining,
    status: isCompleted ? 'completed' : challenge.status || 'active',
    completedAt: isCompleted && !challenge.completedAt 
      ? new Date().toISOString() 
      : challenge.completedAt,
  };
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

export default {
  calculateProgress,
  isChallengeCompleted,
  getDaysRemaining,
  updateChallengeProgress,
  updateChallengesProgress,
  getActiveChallenges,
  getCompletedChallenges,
};
