/**
 * ENERGETIC TEAL & ORANGE COLOR SYSTEM
 * Complete color palette for health/challenge app
 * Optimized for Android Material Design 3
 */

// ============================================
// PRIMARY COLORS - Main Brand Colors
// ============================================
export const PRIMARY = {
  // Teal Spectrum
  teal50: '#ecfeff',    // Very light teal - backgrounds
  teal100: '#cffafe',   // Light teal - hover states
  teal200: '#a5f3fc',   // Light teal - disabled states
  teal300: '#67e8f9',   // Medium light - secondary buttons
  teal400: '#22d3ee',   // Medium - active states
  teal500: '#06b6d4',   // PRIMARY TEAL - main brand color
  teal600: '#0891b2',   // Dark teal - pressed states
  teal700: '#0e7490',   // Darker - headers
  teal800: '#155e75',   // Very dark - text on light
  teal900: '#164e63',   // Deepest - dark mode backgrounds
};

// ============================================
// SECONDARY COLORS - Accent & Energy
// ============================================
export const SECONDARY = {
  // Orange Spectrum
  orange50: '#fff7ed',   // Very light orange - backgrounds
  orange100: '#ffedd5',  // Light orange - hover
  orange200: '#fed7aa',  // Light orange - disabled
  orange300: '#fdba74',  // Medium light - tags
  orange400: '#fb923c',  // Medium - notifications
  orange500: '#f97316',  // PRIMARY ORANGE - success/achievement
  orange600: '#ea580c',  // Dark orange - pressed
  orange700: '#c2410c',  // Darker - warnings
  orange800: '#9a3412',  // Very dark - text
  orange900: '#7c2d12',  // Deepest - dark mode
};

// ============================================
// NEUTRAL COLORS - Text & Backgrounds
// ============================================
export const NEUTRAL = {
  // Slate Spectrum (cool grays)
  slate50: '#f8fafc',    // Background light
  slate100: '#f1f5f9',   // Surface light
  slate200: '#e2e8f0',   // Border light
  slate300: '#cbd5e1',   // Divider
  slate400: '#94a3b8',   // Disabled text
  slate500: '#64748b',   // Secondary text
  slate600: '#475569',   // Body text
  slate700: '#334155',   // Heading text
  slate800: '#1e293b',   // PRIMARY TEXT
  slate900: '#0f172a',   // Deepest text/dark bg
};

// ============================================
// SEMANTIC COLORS - Status & Feedback
// ============================================
export const SEMANTIC = {
  // Success (Green)
  success: '#10b981',
  successLight: '#d1fae5',
  successDark: '#065f46',
  
  // Warning (Amber)
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  warningDark: '#92400e',
  
  // Error (Red)
  error: '#ef4444',
  errorLight: '#fee2e2',
  errorDark: '#991b1b',
  
  // Info (Sky Blue)
  info: '#0ea5e9',
  infoLight: '#e0f2fe',
  infoDark: '#075985',
};

// ============================================
// FUNCTIONAL COLORS - UI Elements
// ============================================
export const FUNCTIONAL = {
  // Backgrounds
  background: '#f8fafc',          // Main app background
  surface: '#ffffff',             // Card/container background
  surfaceVariant: '#f1f5f9',      // Alternative surface
  
  // Overlays
  overlay: 'rgba(15, 23, 42, 0.5)',     // Modal overlay
  overlayLight: 'rgba(15, 23, 42, 0.2)', // Light overlay
  
  // Borders & Dividers
  border: '#e2e8f0',
  borderFocus: '#06b6d4',
  divider: '#cbd5e1',
  
  // States
  hover: 'rgba(6, 182, 212, 0.08)',
  pressed: 'rgba(6, 182, 212, 0.12)',
  focus: 'rgba(6, 182, 212, 0.12)',
  disabled: '#94a3b8',
  
  // Shadows
  shadow: 'rgba(15, 23, 42, 0.1)',
  shadowDark: 'rgba(15, 23, 42, 0.2)',
};

// ============================================
// GRADIENT DEFINITIONS
// ============================================
export const GRADIENTS = {
  // Primary Gradients
  tealGradient: ['#06b6d4', '#0891b2'],
  tealGradientVertical: ['#06b6d4', '#0e7490'],
  
  // Accent Gradients
  orangeGradient: ['#f97316', '#ea580c'],
  energyGradient: ['#06b6d4', '#f97316'], // Teal to Orange
  
  // Background Gradients
  lightGradient: ['#f8fafc', '#ffffff'],
  headerGradient: ['#06b6d4', '#0891b2', '#0e7490'],
  
  // Special Effects
  glowGradient: ['#06b6d4', '#22d3ee', '#06b6d4'],
  successGradient: ['#10b981', '#059669'],
};

// ============================================
// COMPLETE THEME OBJECT (for backward compatibility)
// ============================================
export const colors = {
  // Main Colors
  primary: PRIMARY.teal500,           // #06b6d4
  primaryDark: PRIMARY.teal600,       // #0891b2
  primaryLight: PRIMARY.teal400,      // #22d3ee
  
  secondary: SECONDARY.orange500,     // #f97316
  secondaryDark: SECONDARY.orange600, // #ea580c
  secondaryLight: SECONDARY.orange400,// #fb923c
  
  // Background colors
  background: NEUTRAL.slate50,        // #f8fafc
  backgroundDark: NEUTRAL.slate900,   // #0f172a
  backgroundLight: NEUTRAL.slate100,  // #f1f5f9
  
  // Text colors
  text: NEUTRAL.slate800,             // #1e293b
  textDark: NEUTRAL.slate900,         // #0f172a
  textLight: NEUTRAL.slate500,        // #64748b
  textSecondary: NEUTRAL.slate600,    // #475569
  
  // Status colors
  success: SEMANTIC.success,          // #10b981
  error: SEMANTIC.error,              // #ef4444
  warning: SEMANTIC.warning,          // #f59e0b
  info: SEMANTIC.info,                // #0ea5e9
  
  // Border colors
  border: FUNCTIONAL.border,          // #e2e8f0
  borderLight: NEUTRAL.slate200,       // #e2e8f0
  borderDark: NEUTRAL.slate700,       // #334155
  
  // Card colors
  card: FUNCTIONAL.surface,           // #ffffff
  cardDark: NEUTRAL.slate800,         // #1e293b
  
  // Overlay colors
  overlay: FUNCTIONAL.overlay,        // rgba(15, 23, 42, 0.5)
  overlayLight: FUNCTIONAL.overlayLight, // rgba(15, 23, 42, 0.2)
  
  // Accent (for backward compatibility)
  accent: SEMANTIC.success,           // #10b981
  accentDark: SEMANTIC.successDark,   // #065f46
  accentLight: SEMANTIC.successLight, // #d1fae5
};

// ============================================
// DARK MODE COLORS
// ============================================
export const DARK_THEME = {
  primary: PRIMARY.teal400,           // Lighter in dark mode
  primaryDark: PRIMARY.teal500,
  primaryLight: PRIMARY.teal300,
  
  secondary: SECONDARY.orange400,     // Lighter in dark mode
  secondaryDark: SECONDARY.orange500,
  secondaryLight: SECONDARY.orange300,
  
  background: NEUTRAL.slate900,       // #0f172a
  backgroundDark: NEUTRAL.slate900,
  backgroundLight: NEUTRAL.slate800,
  
  text: NEUTRAL.slate50,              // #f8fafc
  textDark: NEUTRAL.slate50,
  textLight: NEUTRAL.slate400,
  textSecondary: NEUTRAL.slate300,
  
  success: '#34d399',
  error: '#f87171',
  warning: '#fbbf24',
  info: '#38bdf8',
  
  border: NEUTRAL.slate700,           // #334155
  borderLight: NEUTRAL.slate600,      // #475569
  borderDark: NEUTRAL.slate700,
  
  card: NEUTRAL.slate800,             // #1e293b
  cardDark: NEUTRAL.slate900,
  
  overlay: FUNCTIONAL.overlay,
  overlayLight: FUNCTIONAL.overlayLight,
  
  accent: '#34d399',
  accentDark: '#065f46',
  accentLight: '#d1fae5',
};

// ============================================
// EXPORT DEFAULT (for backward compatibility)
// ============================================
export default colors;
