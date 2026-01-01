/**
 * Zustand store for app state management
 * Manages user profile, streaks, challenges, and other app state
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useStore = create(
  persist(
    (set) => ({
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
      const completedChallenge = {
        ...challenge,
        completedAt: new Date().toISOString(),
        status: 'completed',
        progress: 100,
      };
      return {
        challenges: state.challenges.filter(c => c.id !== challengeId),
        completedChallenges: [...state.completedChallenges, completedChallenge],
        activeChallenge: state.activeChallenge?.id === challengeId ? null : state.activeChallenge,
      };
    }
    return state;
  }),
  updateChallengeProgress: (challengeId, progress) => set((state) => {
    const challenge = state.challenges.find(c => c.id === challengeId);
    if (!challenge) return state;
    
    const clampedProgress = Math.min(100, Math.max(0, progress));
    const isCompleted = clampedProgress >= 100 && challenge.status !== 'completed';
    
    if (isCompleted) {
      // Move to completed challenges
      const completedChallenge = {
        ...challenge,
        progress: 100,
        status: 'completed',
        completedAt: new Date().toISOString(),
      };
      
      return {
        challenges: state.challenges.filter(c => c.id !== challengeId),
        completedChallenges: [...state.completedChallenges, completedChallenge],
        activeChallenge: state.activeChallenge?.id === challengeId ? null : state.activeChallenge,
      };
    } else {
      // Update progress in active challenges
      const updatedChallenges = state.challenges.map(c => {
        if (c.id === challengeId) {
          return {
            ...c,
            progress: clampedProgress,
          };
        }
        return c;
      });
      
      // Update active challenge if it's the one being updated
      let updatedActiveChallenge = state.activeChallenge;
      if (state.activeChallenge?.id === challengeId) {
        const updated = updatedChallenges.find(c => c.id === challengeId);
        if (updated) {
          updatedActiveChallenge = updated;
        }
      }
      
      return {
        challenges: updatedChallenges,
        activeChallenge: updatedActiveChallenge,
      };
    }
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
    }),
    {
      name: 'goalify-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        streak: state.streak,
        challenges: state.challenges,
        activeChallenge: state.activeChallenge,
        completedChallenges: state.completedChallenges,
        settings: state.settings,
      }),
    }
  )
);

export default useStore;
