/**
 * Storage Utility
 * AsyncStorage wrapper for app data persistence
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER: '@goalify:user',
  STREAK: '@goalify:streak',
  CHALLENGES: '@goalify:challenges',
  COMPLETED_CHALLENGES: '@goalify:completedChallenges',
  ACTIVE_CHALLENGE: '@goalify:activeChallenge',
  SETTINGS: '@goalify:settings',
  ONBOARDING_COMPLETE: '@goalify:onboardingComplete',
};

/**
 * Save user data to storage
 */
export const saveUserData = async (userData) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
};

/**
 * Load user data from storage
 */
export const loadUserData = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading user data:', error);
    return null;
  }
};

/**
 * Save streak data to storage
 */
export const saveStreakData = async (streakData) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(streakData));
    return true;
  } catch (error) {
    console.error('Error saving streak data:', error);
    return false;
  }
};

/**
 * Load streak data from storage
 */
export const loadStreakData = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.STREAK);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading streak data:', error);
    return null;
  }
};

/**
 * Save challenges to storage
 */
export const saveChallenges = async (challenges) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));
    return true;
  } catch (error) {
    console.error('Error saving challenges:', error);
    return false;
  }
};

/**
 * Load challenges from storage
 */
export const loadChallenges = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CHALLENGES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading challenges:', error);
    return [];
  }
};

/**
 * Save completed challenges to storage
 */
export const saveCompletedChallenges = async (completedChallenges) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.COMPLETED_CHALLENGES, JSON.stringify(completedChallenges));
    return true;
  } catch (error) {
    console.error('Error saving completed challenges:', error);
    return false;
  }
};

/**
 * Load completed challenges from storage
 */
export const loadCompletedChallenges = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_CHALLENGES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading completed challenges:', error);
    return [];
  }
};

/**
 * Save active challenge to storage
 */
export const saveActiveChallenge = async (activeChallenge) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_CHALLENGE, JSON.stringify(activeChallenge));
    return true;
  } catch (error) {
    console.error('Error saving active challenge:', error);
    return false;
  }
};

/**
 * Load active challenge from storage
 */
export const loadActiveChallenge = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_CHALLENGE);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading active challenge:', error);
    return null;
  }
};

/**
 * Save settings to storage
 */
export const saveSettings = async (settings) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

/**
 * Load settings from storage
 */
export const loadSettings = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading settings:', error);
    return null;
  }
};

/**
 * Clear all app data
 */
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
};

/**
 * Load all app data
 */
export const loadAllData = async () => {
  try {
    const [user, streak, challenges, completedChallenges, activeChallenge, settings] = await Promise.all([
      loadUserData(),
      loadStreakData(),
      loadChallenges(),
      loadCompletedChallenges(),
      loadActiveChallenge(),
      loadSettings(),
    ]);

    return {
      user: user || null,
      streak: streak || null,
      challenges: challenges || [],
      completedChallenges: completedChallenges || [],
      activeChallenge: activeChallenge || null,
      settings: settings || null,
    };
  } catch (error) {
    console.error('Error loading all data:', error);
    return null;
  }
};

export default {
  saveUserData,
  loadUserData,
  saveStreakData,
  loadStreakData,
  saveChallenges,
  loadChallenges,
  saveCompletedChallenges,
  loadCompletedChallenges,
  saveActiveChallenge,
  loadActiveChallenge,
  saveSettings,
  loadSettings,
  clearAllData,
  loadAllData,
};
