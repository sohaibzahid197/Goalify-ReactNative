/**
 * Zustand store for app state management
 * Manages user profile, streaks, challenges, and other app state
 */

import { create } from 'zustand';

const useStore = create((set) => ({
  // User profile
  user: {
    id: null,
    name: '',
    email: '',
    avatar: null,
    createdAt: null,
  },
  
  // Streak information
  streak: {
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: null,
  },
  
  // Challenges
  challenges: [],
  activeChallenge: null,
  completedChallenges: [],
  
  // Goals
  goals: [],
  activeGoals: [],
  completedGoals: [],
  
  // Settings
  settings: {
    notifications: true,
    theme: 'light', // 'light' | 'dark'
    language: 'en',
  },
  
  // Actions
  setUser: (user) => set({ user }),
  updateUser: (updates) => set((state) => ({
    user: { ...state.user, ...updates },
  })),
  
  setStreak: (streak) => set({ streak }),
  updateStreak: (updates) => set((state) => ({
    streak: { ...state.streak, ...updates },
  })),
  
  setChallenges: (challenges) => set({ challenges }),
  addChallenge: (challenge) => set((state) => ({
    challenges: [...state.challenges, challenge],
  })),
  setActiveChallenge: (challenge) => set({ activeChallenge: challenge }),
  completeChallenge: (challengeId) => set((state) => {
    const challenge = state.challenges.find(c => c.id === challengeId);
    if (challenge) {
      return {
        challenges: state.challenges.filter(c => c.id !== challengeId),
        completedChallenges: [...state.completedChallenges, challenge],
      };
    }
    return state;
  }),
  
  setGoals: (goals) => set({ goals }),
  addGoal: (goal) => set((state) => ({
    goals: [...state.goals, goal],
    activeGoals: [...state.activeGoals, goal],
  })),
  completeGoal: (goalId) => set((state) => {
    const goal = state.goals.find(g => g.id === goalId);
    if (goal) {
      return {
        goals: state.goals.filter(g => g.id !== goalId),
        activeGoals: state.activeGoals.filter(g => g.id !== goalId),
        completedGoals: [...state.completedGoals, goal],
      };
    }
    return state;
  }),
  
  updateSettings: (updates) => set((state) => ({
    settings: { ...state.settings, ...updates },
  })),
  
  // Reset store
  reset: () => set({
    user: {
      id: null,
      name: '',
      email: '',
      avatar: null,
      createdAt: null,
    },
    streak: {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
    },
    challenges: [],
    activeChallenge: null,
    completedChallenges: [],
    goals: [],
    activeGoals: [],
    completedGoals: [],
    settings: {
      notifications: true,
      theme: 'light',
      language: 'en',
    },
  }),
}));

export default useStore;
