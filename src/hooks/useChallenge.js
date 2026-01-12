/**
 * Custom hook for challenge management
 * Provides easy access to challenge-related state and actions
 */

import { useCallback } from 'react';
import useStore from '../state/store';
import { challengeActions, streakActions } from '../state/actions';
import { generateChallenge } from '../services/challengeService';
import { updateChallengeProgress } from '../utils/challengeProgress';

/**
 * Custom hook for managing challenges
 * @returns {Object} Challenge state and actions
 */
export const useChallenge = () => {
  const challenges = useStore((state) => state.challenges);
  const activeChallenge = useStore((state) => state.activeChallenge);
  const completedChallenges = useStore((state) => state.completedChallenges);

  const createChallenge = useCallback(async (params) => {
    try {
      const challenge = await generateChallenge(params);
      challengeActions.addChallenge(challenge);
      challengeActions.setActiveChallenge(challenge);
      return challenge;
    } catch (error) {
      console.error('Error creating challenge:', error);
      throw error;
    }
  }, []);

  const setActiveChallenge = useCallback((challenge) => {
    challengeActions.setActiveChallenge(challenge);
  }, []);

  const completeChallenge = useCallback((challengeId) => {
    challengeActions.completeChallenge(challengeId);
    // Increment streak when challenge is completed
    streakActions.incrementStreak();
  }, []);

  const clearActiveChallenge = useCallback(() => {
    challengeActions.clearActiveChallenge();
  }, []);

  const updateProgress = useCallback((challengeId, progress) => {
    challengeActions.updateChallengeProgress(challengeId, progress);
  }, []);

  const updateProgressAutomatically = useCallback((challenge, activityTracking = null, dailyGoal = null) => {
    if (!challenge) return challenge;
    
    // Use the fixed updateChallengeProgress with activity tracking
    const updatedChallenge = updateChallengeProgress(challenge, activityTracking, dailyGoal);
    
    // Check if challenge changed (progress, completions, milestones, status)
    const challengeChanged = 
      updatedChallenge.progress !== challenge.progress ||
      JSON.stringify(updatedChallenge.dailyCompletions) !== JSON.stringify(challenge.dailyCompletions) ||
      JSON.stringify(updatedChallenge.milestonesReached) !== JSON.stringify(challenge.milestonesReached) ||
      updatedChallenge.status !== challenge.status;
    
    if (challengeChanged) {
      // Update in store with full updated challenge object (preserves dailyCompletions, milestones, etc.)
      challengeActions.updateChallengeProgress(
        challenge.id, 
        updatedChallenge.progress, 
        updatedChallenge
      );
      
      // Handle new milestones for celebration
      if (updatedChallenge.newMilestones && updatedChallenge.newMilestones.length > 0) {
        updatedChallenge.newMilestones.forEach(milestone => {
          console.log(`🎉 Milestone reached: ${milestone.message}`);
          // TODO: Trigger milestone celebration
        });
      }
      
      // If challenge completed, increment streak and complete challenge
      if (updatedChallenge.status === 'completed' && challenge.status !== 'completed') {
        streakActions.incrementStreak();
        challengeActions.completeChallenge(challenge.id);
        // TODO: Trigger challenge completion celebration
      }
    }
    
    return updatedChallenge;
  }, []);

  return {
    challenges,
    activeChallenge,
    completedChallenges,
    createChallenge,
    setActiveChallenge,
    completeChallenge,
    clearActiveChallenge,
    updateProgress,
    updateProgressAutomatically,
  };
};

export default useChallenge;
