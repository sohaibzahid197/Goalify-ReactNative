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
    weight: null, // Weight in kg (for calories calculation)
    height: null, // Height in cm (for stride calculation)
    strideLength: null, // Stride length in meters (auto-calculated or manual)
    dailyStepGoal: 10000, // Daily step goal (default 10,000)
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
  
  // Activity tracking (today's metrics)
  activityTracking: {
    todaySteps: 0,
    todayCalories: 0,
    todayDistance: 0, // km
    todayActiveTime: 0, // minutes
    baselineSteps: 0, // Baseline for daily calculation
    lastUpdate: null,
    lastResetDate: null, // Track when daily reset happens
  },
  
  // Daily step history (last 30 days)
  dailyStepHistory: [],
  
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
  updateChallengeProgress: (challengeId, progress, updatedChallenge = null) => set((state) => {
    // Find challenge in challenges array or activeChallenge
    const challenge = state.challenges.find(c => c.id === challengeId) || 
                     (state.activeChallenge?.id === challengeId ? state.activeChallenge : null);
    
    if (!challenge && !updatedChallenge) return state;
    
    // If updatedChallenge is provided (from updateChallengeProgress utility), use it
    // This preserves dailyCompletions, milestonesReached, and all other fields
    // Otherwise, just update progress value (fallback for backwards compatibility)
    const challengeToUpdate = updatedChallenge || {
      ...challenge,
      progress: Math.min(100, Math.max(0, progress || 0)),
    };
    
    // Remove newMilestones from challenge object (it's only for celebration, not storage)
    const { newMilestones, ...challengeForStorage } = challengeToUpdate;
    
    const clampedProgress = challengeForStorage.progress || 0;
    const isCompleted = clampedProgress >= 100 && challengeForStorage.status !== 'completed';
    
    if (isCompleted) {
      // Move to completed challenges
      const completedChallenge = {
        ...challengeForStorage,
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
      // Update challenge with all properties (including dailyCompletions, milestonesReached, etc.)
      let updatedChallenges = [...state.challenges];
      const challengeIndex = updatedChallenges.findIndex(c => c.id === challengeId);
      
      if (challengeIndex >= 0) {
        // Update existing challenge
        updatedChallenges[challengeIndex] = challengeForStorage;
      } else {
        // Challenge not in array yet, add it (shouldn't happen, but handle it)
        updatedChallenges.push(challengeForStorage);
      }
      
      // Update active challenge if it's the one being updated
      let updatedActiveChallenge = state.activeChallenge;
      if (state.activeChallenge?.id === challengeId) {
        updatedActiveChallenge = challengeForStorage;
      } else if (!state.activeChallenge && challengeForStorage.status === 'active') {
        // Set as active if no active challenge exists
        updatedActiveChallenge = challengeForStorage;
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
  
  // Activity tracking actions
  setActivityTracking: (data) => set({ activityTracking: data }),
  updateActivityTracking: (updates) => set((state) => ({
    activityTracking: { ...state.activityTracking, ...updates },
  })),
  resetActivityTracking: () => set({
    activityTracking: {
      todaySteps: 0,
      todayCalories: 0,
      todayDistance: 0,
      todayActiveTime: 0,
      baselineSteps: 0,
      lastUpdate: null,
      lastResetDate: new Date().toISOString().split('T')[0],
    },
  }),
  
  // Daily step history actions
  addDailyStepRecord: (record) => set((state) => {
    // Remove existing record for same date if exists
    const filteredHistory = state.dailyStepHistory.filter(
      r => r.date !== record.date
    );
    return {
      dailyStepHistory: [...filteredHistory, record].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      ).slice(0, 30), // Keep last 30 days
    };
  }),
  getTodayStepRecord: () => {
    const state = useStore.getState();
    const today = new Date().toISOString().split('T')[0];
    return state.dailyStepHistory.find(r => r.date === today);
  },
  clearDailyStepHistory: () => set({ dailyStepHistory: [] }),
  
  // Reset store
  reset: () => set({
    user: {
      id: null,
      name: '',
      email: '',
      avatar: null,
      weight: null,
      height: null,
      strideLength: null,
      dailyStepGoal: 10000,
      createdAt: null,
    },
    activityTracking: {
      todaySteps: 0,
      todayCalories: 0,
      todayDistance: 0,
      todayActiveTime: 0,
      baselineSteps: 0,
      lastUpdate: null,
      lastResetDate: null,
    },
    dailyStepHistory: [],
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
        activityTracking: state.activityTracking,
        dailyStepHistory: state.dailyStepHistory,
      }),
    }
  )
);

export default useStore;
