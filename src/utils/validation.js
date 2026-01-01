/**
 * Validation Utilities
 * Form validation functions for user inputs
 */

/**
 * Validate age (must be between 1 and 120)
 */
export const validateAge = (age) => {
  if (!age || age.trim() === '') {
    return { isValid: false, error: 'Age is required' };
  }

  const ageNum = parseInt(age, 10);
  
  if (isNaN(ageNum)) {
    return { isValid: false, error: 'Age must be a number' };
  }

  if (ageNum < 1 || ageNum > 120) {
    return { isValid: false, error: 'Age must be between 1 and 120' };
  }

  return { isValid: true, error: null, value: ageNum };
};

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true, error: null, value: email.trim() };
};

/**
 * Validate goal text (non-empty, max 100 chars)
 */
export const validateGoal = (goal) => {
  if (!goal || goal.trim() === '') {
    return { isValid: false, error: 'Goal is required' };
  }

  const trimmedGoal = goal.trim();
  
  if (trimmedGoal.length > 100) {
    return { isValid: false, error: 'Goal must be 100 characters or less' };
  }

  if (trimmedGoal.length < 3) {
    return { isValid: false, error: 'Goal must be at least 3 characters' };
  }

  return { isValid: true, error: null, value: trimmedGoal };
};

/**
 * Validate name (non-empty, reasonable length)
 */
export const validateName = (name) => {
  if (!name || name.trim() === '') {
    return { isValid: false, error: 'Name is required' };
  }

  const trimmedName = name.trim();
  
  if (trimmedName.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
  }

  if (trimmedName.length > 50) {
    return { isValid: false, error: 'Name must be 50 characters or less' };
  }

  return { isValid: true, error: null, value: trimmedName };
};

/**
 * Validate gender selection
 */
export const validateGender = (gender) => {
  if (!gender || gender.trim() === '') {
    return { isValid: false, error: 'Gender selection is required' };
  }

  return { isValid: true, error: null, value: gender };
};

/**
 * Validate life situation selection
 */
export const validateLifeSituation = (lifeSituation) => {
  if (!lifeSituation || lifeSituation.trim() === '') {
    return { isValid: false, error: 'Life situation selection is required' };
  }

  return { isValid: true, error: null, value: lifeSituation };
};

/**
 * Validate goals array (at least one selected)
 */
export const validateGoals = (goals) => {
  if (!goals || !Array.isArray(goals) || goals.length === 0) {
    return { isValid: false, error: 'Please select at least one goal' };
  }

  return { isValid: true, error: null, value: goals };
};

/**
 * Validate difficulty preference
 */
export const validateDifficulty = (difficulty) => {
  const validDifficulties = ['easy', 'medium', 'hard'];
  
  if (!difficulty || !validDifficulties.includes(difficulty)) {
    return { isValid: false, error: 'Please select a difficulty level' };
  }

  return { isValid: true, error: null, value: difficulty };
};

export default {
  validateAge,
  validateEmail,
  validateGoal,
  validateName,
  validateGender,
  validateLifeSituation,
  validateGoals,
  validateDifficulty,
};
