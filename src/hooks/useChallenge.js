/**
 * Custom hook for challenge management
 * Provides easy access to challenge-related state and actions
 */

import { useCallback } from 'react';
import useStore from '../state/store';
import { challengeActions } from '../state/actions';
import { generateChallenge } from '../services/challengeService';

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
  }, []);

  const clearActiveChallenge = useCallback(() => {
    challengeActions.clearActiveChallenge();
  }, []);

  return {
    challenges,
    activeChallenge,
    completedChallenges,
    createChallenge,
    setActiveChallenge,
    completeChallenge,
    clearActiveChallenge,
  };
};

export default useChallenge;
