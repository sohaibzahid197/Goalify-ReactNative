/**
 * Challenge Service
 * Handles challenge generation using local templates (no API needed)
 */

import { getChallengeTemplate, getAllChallengeTemplates, getSuggestedChallenges } from '../data/challengeTemplates';
import { getFriendlyMilestoneDays } from '../utils/durationFormatter';

/**
 * Generate a challenge from template or custom goal
 * @param {Object} params - Challenge generation parameters
 * @param {string} params.templateId - Template ID to use (optional)
 * @param {string} params.goal - Custom goal text (optional, if no templateId)
 * @param {string} params.difficulty - Difficulty level ('easy', 'medium', 'hard')
 * @param {number} params.duration - Duration in days
 * @param {string} params.category - Challenge category ('fitness', 'health', 'wellness')
 * @returns {Promise<Object>} Generated challenge object
 */
export const generateChallenge = async ({
  templateId,
  goal,
  difficulty = 'medium',
  duration = 7,
  category = 'fitness',
}) => {
  try {
    let baseChallenge;
    
    // If templateId is provided, use the template
    if (templateId) {
      const template = getChallengeTemplate(templateId);
      if (template) {
        baseChallenge = { ...template };
      }
    } else if (goal) {
      // If custom goal is provided, create a custom challenge
      baseChallenge = {
        title: `${goal} Challenge`,
        description: `A ${difficulty} challenge to help you achieve your goal: ${goal}`,
        category: category || 'wellness',
        difficulty,
        duration,
        activityType: 'consistency', // Default for custom challenges
        dailyTasks: [
          'Work on your goal daily',
          'Track your progress',
          'Stay consistent',
        ],
        milestones: (() => {
          const milestoneDays = getFriendlyMilestoneDays(duration);
          return [
            { day: milestoneDays.bronze, message: `Making progress on ${goal}! 🔥`, badge: 'bronze' },
            { day: milestoneDays.silver, message: 'Halfway there! 💪', badge: 'silver' },
            { day: milestoneDays.gold, message: 'Challenge complete! 🎉', badge: 'gold' },
          ];
        })(),
        tips: [
          'Stay consistent',
          'Celebrate small wins',
          'Track your progress daily',
          'Don\'t be too hard on yourself',
        ],
      };
    } else {
      throw new Error('Either templateId or goal must be provided');
    }

    // Initialize challenge with proper progress structure (object, not number)
    const challenge = {
      ...baseChallenge,
      id: `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      status: 'active',
      // Progress as object with all required fields for chart compatibility
      progress: {
        percentage: 0,
        dailyBreakdown: [], // Empty array initially - will be populated by updateChallengeProgress
        currentValue: 0,
        averageDaily: 0,
        daysCompleted: 0,
        weeklyTrend: 'stable',
      },
      dailyCompletions: {},
      dailyTaskCompletions: {},
      dailyActivityHistory: {},
      milestonesReached: [],
      points: 0,
    };

    return challenge;
  } catch (error) {
    console.error('Error generating challenge:', error);
    throw error;
  }
};

/**
 * Generate multiple challenge options from templates
 * @param {string} category - Challenge category ('fitness', 'health', 'wellness')
 * @returns {Promise<Array>} Array of challenge templates
 */
export const generateChallengeOptions = async (category = 'fitness') => {
  const { getChallengesByCategory } = require('../data/challengeTemplates');
  return getChallengesByCategory(category) || [];
};

/**
 * Get suggested challenges based on user activity
 * @param {Object} userActivity - Current user activity data
 * @param {number} dailyGoal - User's daily step goal
 * @returns {Array} Array of suggested challenge templates
 */
export const getSuggestedChallengesForUser = (userActivity, dailyGoal) => {
  return getSuggestedChallenges(userActivity, dailyGoal);
};

/**
 * Update challenge progress
 * @param {string} challengeId - Challenge ID
 * @param {number} progress - Progress percentage (0-100)
 */
export const updateChallengeProgress = (challengeId, progress) => {
  // Import challengeProgress utility
  const challengeProgress = require('../utils/challengeProgress');
  
  // This function is typically called from actions, but can be used directly
  // The actual update happens in the store via actions
  const clampedProgress = Math.min(100, Math.max(0, progress));
  console.log(`Updating challenge ${challengeId} progress to ${clampedProgress}%`);
  
  return clampedProgress;
};

/**
 * Calculate and update challenge progress automatically
 * @param {Object} challenge - Challenge object
 * @returns {Object} Updated challenge with progress
 */
export const calculateAndUpdateProgress = (challenge) => {
  const challengeProgress = require('../utils/challengeProgress');
  return challengeProgress.updateChallengeProgress(challenge);
};

export default {
  generateChallenge,
  generateChallengeOptions,
  updateChallengeProgress,
};
