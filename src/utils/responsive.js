/**
 * Responsive Utilities
 * Centralized scaling functions for consistent responsive design across all screen sizes
 */

import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone X/11/12 - most common)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

/**
 * Scale font size responsively
 * @param {number} size - Base font size
 * @param {number} min - Minimum size (default: 10)
 * @param {number} max - Maximum size (default: Infinity)
 * @returns {number} Scaled font size
 */
export const scaleFontSize = (size, min = 10, max = Infinity) => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const scaledSize = size * scale;
  return Math.max(min, Math.min(scaledSize, max === Infinity ? scaledSize * 1.2 : max));
};

/**
 * Scale dimension (width, height, padding, margin, etc.)
 * @param {number} size - Base size
 * @returns {number} Scaled size
 */
export const scaleSize = (size) => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  return size * scale;
};

/**
 * Scale vertical dimension (height-based scaling)
 * @param {number} size - Base size
 * @returns {number} Scaled size
 */
export const scaleVertical = (size) => {
  const scale = SCREEN_HEIGHT / BASE_HEIGHT;
  return size * scale;
};

/**
 * Get responsive icon size based on screen width
 * Icons typically scale less aggressively than text
 * @param {number} size - Base icon size
 * @returns {number} Scaled icon size
 */
export const scaleIcon = (size) => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  // Icons typically scale less aggressively (capped at 1.1x)
  return Math.max(16, Math.min(size * scale, size * 1.1));
};

/**
 * Moderate scale - less aggressive scaling for larger screens
 * @param {number} size - Base size
 * @param {number} factor - Scaling factor (0-1, default: 0.5)
 * @returns {number} Moderately scaled size
 */
export const moderateScale = (size, factor = 0.5) => {
  return size + (scaleSize(size) - size) * factor;
};

/**
 * Platform-specific scaling
 * @param {number} ios - iOS value
 * @param {number} android - Android value
 * @returns {number} Platform-specific value
 */
export const platformScale = (ios, android) => {
  return Platform.OS === 'ios' ? ios : android;
};

/**
 * Create spaced container style (replacement for gap property)
 * @param {string} direction - 'row' or 'column'
 * @param {number} spacing - Spacing value
 * @returns {Object} Style object
 */
export const createSpacedStyles = (direction = 'row', spacing = 12) => {
  const isRow = direction === 'row';
  return {
    flexDirection: direction,
    marginHorizontal: isRow ? -spacing / 2 : 0,
    marginVertical: isRow ? 0 : -spacing / 2,
  };
};

/**
 * Create spaced item style (for use with createSpacedStyles)
 * @param {string} direction - 'row' or 'column'
 * @param {number} spacing - Spacing value
 * @returns {Object} Style object
 */
export const spacedItem = (direction = 'row', spacing = 12) => {
  const isRow = direction === 'row';
  return {
    marginHorizontal: isRow ? spacing / 2 : 0,
    marginVertical: isRow ? 0 : spacing / 2,
  };
};

export default {
  scaleFontSize,
  scaleSize,
  scaleVertical,
  scaleIcon,
  moderateScale,
  platformScale,
  createSpacedStyles,
  spacedItem,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
};
