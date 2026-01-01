/**
 * Actions for updating the Zustand store
 * Contains functions to update the store state
 */

import useStore from './store';

/**
 * User actions
 */
export const userActions = {
  setUser: (user) => useStore.getState().setUser(user),
  updateUser: (updates) => useStore.getState().updateUser(updates),
  clearUser: () => useStore.getState().setUser({
    id: null,
    name: '',
    email: '',
    avatar: null,
    createdAt: null,
  }),
};

/**
 * Streak actions
 */
export const streakActions = {
  setStreak: (streak) => useStore.getState().setStreak(streak),
  updateStreak: (updates) => useStore.getState().updateStreak(updates),
  incrementStreak: () => {
    const { streak } = useStore.getState();
    const today = new Date().toISOString();
    
    // Only increment if last activity wasn't today
    const lastActivity = streak.lastActivityDate;
    const isToday = lastActivity && new Date(lastActivity).toDateString() === new Date().toDateString();
    
    if (!isToday) {
      const newStreak = streak.currentStreak + 1;
      useStore.getState().updateStreak({
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, streak.longestStreak),
        lastActivityDate: today,
      });
    }
  },
  resetStreak: () => useStore.getState().updateStreak({
    currentStreak: 0,
    lastActivityDate: null,
  }),
  checkAndUpdateStreak: () => {
    const { streak } = useStore.getState();
    // Import streakManager dynamically to avoid circular dependencies
    const streakManager = require('../utils/streakManager');
    const newState = streakManager.autoUpdateStreak(streak);
    
    if (newState.shouldUpdate) {
      useStore.getState().updateStreak({
        currentStreak: newState.currentStreak,
        longestStreak: newState.longestStreak,
        lastActivityDate: newState.lastActivityDate,
      });
    }
  },
};

/**
 * Challenge actions
 */
export const challengeActions = {
  setChallenges: (challenges) => useStore.getState().setChallenges(challenges),
  addChallenge: (challenge) => useStore.getState().addChallenge(challenge),
  setActiveChallenge: (challenge) => useStore.getState().setActiveChallenge(challenge),
  completeChallenge: (challengeId) => {
    const state = useStore.getState();
    const challenge = state.challenges.find(c => c.id === challengeId);
    if (challenge) {
      const completedChallenge = {
        ...challenge,
        completedAt: new Date().toISOString(),
        status: 'completed',
        progress: 100,
      };
      useStore.setState({
        challenges: state.challenges.filter(c => c.id !== challengeId),
        completedChallenges: [...state.completedChallenges, completedChallenge],
        activeChallenge: state.activeChallenge?.id === challengeId ? null : state.activeChallenge,
      });
    }
  },
  clearActiveChallenge: () => useStore.getState().setActiveChallenge(null),
  updateChallengeProgress: (challengeId, progress) => {
    useStore.getState().updateChallengeProgress(challengeId, progress);
  },
};

/**
 * Goal actions
 */
export const goalActions = {
  setGoals: (goals) => useStore.getState().setGoals(goals),
  addGoal: (goal) => useStore.getState().addGoal(goal),
  completeGoal: (goalId) => useStore.getState().completeGoal(goalId),
  updateGoal: (goalId, updates) => {
    const { goals } = useStore.getState();
    const updatedGoals = goals.map(goal =>
      goal.id === goalId ? { ...goal, ...updates } : goal
    );
    useStore.getState().setGoals(updatedGoals);
  },
};

/**
 * Settings actions
 */
export const settingsActions = {
  updateSettings: (updates) => useStore.getState().updateSettings(updates),
  toggleNotifications: () => {
    const { settings } = useStore.getState();
    useStore.getState().updateSettings({
      notifications: !settings.notifications,
    });
  },
  setTheme: (theme) => useStore.getState().updateSettings({ theme }),
  setLanguage: (language) => useStore.getState().updateSettings({ language }),
};

/**
 * General actions
 */
export const appActions = {
  reset: () => useStore.getState().reset(),
};

export default {
  userActions,
  streakActions,
  challengeActions,
  goalActions,
  settingsActions,
  appActions,
};
