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

  const updateProgressAutomatically = useCallback((challenge) => {
    if (!challenge) return;
    const updatedChallenge = updateChallengeProgress(challenge);
    if (updatedChallenge.progress !== challenge.progress) {
      challengeActions.updateChallengeProgress(challenge.id, updatedChallenge.progress);
      
      // If challenge completed, increment streak
      if (updatedChallenge.status === 'completed' && challenge.status !== 'completed') {
        streakActions.incrementStreak();
        challengeActions.completeChallenge(challenge.id);
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
