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
    const newStreak = streak.currentStreak + 1;
    useStore.getState().updateStreak({
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, streak.longestStreak),
      lastActivityDate: new Date().toISOString(),
    });
  },
  resetStreak: () => useStore.getState().updateStreak({
    currentStreak: 0,
    lastActivityDate: null,
  }),
};

/**
 * Challenge actions
 */
export const challengeActions = {
  setChallenges: (challenges) => useStore.getState().setChallenges(challenges),
  addChallenge: (challenge) => useStore.getState().addChallenge(challenge),
  setActiveChallenge: (challenge) => useStore.getState().setActiveChallenge(challenge),
  completeChallenge: (challengeId) => useStore.getState().completeChallenge(challengeId),
  clearActiveChallenge: () => useStore.getState().setActiveChallenge(null),
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
