/**
 * Theme Color Utilities
 * Safe color access with fallbacks for consistent theming
 */

/**
 * Get theme-aware colors with fallbacks
 * Ensures colors always work even if theme is incomplete
 * @param {Object} theme - Theme object
 * @param {string} colorPath - Dot-notation path to color (e.g., 'colors.primary')
 * @param {string} fallback - Fallback color if path doesn't exist
 * @returns {string} Color value
 */
export const getThemeColor = (theme, colorPath, fallback) => {
  if (!theme) return fallback;
  
  const paths = colorPath.split('.');
  let value = theme;
  
  for (const path of paths) {
    value = value?.[path];
    if (value === undefined || value === null) {
      return fallback;
    }
  }
  
  return value || fallback;
};

/**
 * Safe color access with consistent fallbacks
 * Only truly constant colors should be exported here
 */
export const safeColors = {
  // Only use for colors that never change
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  
  // Helper functions for theme colors
  primary: (theme) => getThemeColor(theme, 'colors.primary', '#06b6d4'),
  surface: (theme) => getThemeColor(theme, 'colors.surface', '#FFFFFF'),
  surfaceVariant: (theme) => getThemeColor(theme, 'colors.surfaceVariant', '#F1F5F9'),
  outline: (theme) => getThemeColor(theme, 'colors.outline', '#CBD5E1'),
  onSurface: (theme) => getThemeColor(theme, 'colors.onSurface', '#1E293B'),
  onSurfaceVariant: (theme) => getThemeColor(theme, 'colors.onSurfaceVariant', '#64748B'),
  background: (theme) => getThemeColor(theme, 'colors.background', '#F8FAFC'),
  onPrimary: (theme) => getThemeColor(theme, 'colors.onPrimary', '#FFFFFF'),
  error: (theme) => getThemeColor(theme, 'colors.error', '#EF4444'),
  success: (theme) => getThemeColor(theme, 'colors.success', '#10B981'),
  warning: (theme) => getThemeColor(theme, 'colors.warning', '#F59E0B'),
};

export default {
  getThemeColor,
  safeColors,
};