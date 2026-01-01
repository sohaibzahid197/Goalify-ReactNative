/**
 * Comprehensive Theme Configuration for Goalify
 * Supports light and dark modes with Energetic Teal & Orange palette
 */

import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { PRIMARY, SECONDARY, NEUTRAL, SEMANTIC, FUNCTIONAL } from './colors';

// Color Palette (using new energetic teal & orange system)
export const palette = {
    // Primary Colors - Teal
    teal: PRIMARY.teal500,
    tealDark: PRIMARY.teal600,
    tealLight: PRIMARY.teal400,
    
    // Secondary Colors - Orange
    orange: SECONDARY.orange500,
    orangeDark: SECONDARY.orange600,
    orangeLight: SECONDARY.orange400,
    
    // Success Colors
    success: SEMANTIC.success,
    successDark: SEMANTIC.successDark,
    successLight: SEMANTIC.successLight,
    
    // Neutral Colors
    white: '#FFFFFF',
    black: '#000000',
    darkGray: NEUTRAL.slate800,
    mediumGray: NEUTRAL.slate600,
    lightGray: NEUTRAL.slate500,
    veryLightGray: NEUTRAL.slate100,
    
    // Status Colors
    error: SEMANTIC.error,
    warning: SEMANTIC.warning,
    info: SEMANTIC.info,
    
    // Dark Mode Specific
    darkBackground: NEUTRAL.slate900,
    darkCard: NEUTRAL.slate800,
    darkBorder: NEUTRAL.slate700,
    
    // Legacy names for backward compatibility
    skyBlue: PRIMARY.teal500,
    skyBlueDark: PRIMARY.teal600,
    skyBlueLight: PRIMARY.teal400,
    vibrantOrange: SECONDARY.orange500,
    vibrantOrangeDark: SECONDARY.orange600,
    vibrantOrangeLight: SECONDARY.orange400,
    energeticGreen: SEMANTIC.success,
    energeticGreenDark: SEMANTIC.successDark,
    energeticGreenLight: SEMANTIC.successLight,
};

// Spacing Scale (8pt grid system)
export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
};

// Typography
export const typography = {
    fontFamily: {
        regular: 'System', // Will use system default (SF Pro on iOS, Roboto on Android)
        medium: 'System',
        semibold: 'System',
        bold: 'System',
    },
    fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
        xxxl: 32,
        huge: 48,
    },
    fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    },
    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
    },
};

// Border Radius
export const borderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
};

// Shadows
export const shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3.84,
        elevation: 5,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4.65,
        elevation: 8,
    },
    xl: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 12,
    },
};

// Light Theme
export const lightTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: PRIMARY.teal500,              // #06b6d4 - Main brand teal
        primaryContainer: PRIMARY.teal100,       // #cffafe - Light teal container
        secondary: SECONDARY.orange500,          // #f97316 - Energetic orange
        secondaryContainer: SECONDARY.orange100, // #ffedd5 - Light orange container
        tertiary: SEMANTIC.success,              // #10b981 - Success green
        tertiaryContainer: SEMANTIC.successLight, // #d1fae5 - Light green container
        error: SEMANTIC.error,                   // #ef4444
        background: FUNCTIONAL.background,       // #f8fafc
        surface: FUNCTIONAL.surface,             // #ffffff
        surfaceVariant: FUNCTIONAL.surfaceVariant, // #f1f5f9
        onPrimary: '#ffffff',                    // White text on teal
        onSecondary: '#ffffff',                  // White text on orange
        onBackground: NEUTRAL.slate800,          // #1e293b - Primary text
        onSurface: NEUTRAL.slate800,             // #1e293b - Surface text
        outline: NEUTRAL.slate300,               // #cbd5e1 - Borders/outlines
    },
    spacing,
    typography,
    borderRadius,
    shadows,
};

// Dark Theme
export const darkTheme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: PRIMARY.teal400,               // #22d3ee - Lighter teal for dark mode
        primaryContainer: PRIMARY.teal900,       // #164e63 - Dark teal container
        secondary: SECONDARY.orange400,          // #fb923c - Lighter orange for dark mode
        secondaryContainer: SECONDARY.orange900, // #7c2d12 - Dark orange container
        tertiary: '#34d399',                     // Lighter green for dark mode
        tertiaryContainer: SEMANTIC.successDark, // #065f46 - Dark green container
        error: '#f87171',                        // Lighter red for dark mode
        background: NEUTRAL.slate900,            // #0f172a - Deep dark background
        surface: NEUTRAL.slate800,               // #1e293b - Card surface
        surfaceVariant: NEUTRAL.slate700,        // #334155 - Alternative surface
        onPrimary: NEUTRAL.slate900,             // Dark text on teal
        onSecondary: NEUTRAL.slate900,           // Dark text on orange
        onBackground: NEUTRAL.slate50,           // #f8fafc - Light text on dark
        onSurface: NEUTRAL.slate50,              // #f8fafc - Light text on surface
        outline: NEUTRAL.slate600,               // #475569 - Borders/outlines
    },
    spacing,
    typography,
    borderRadius,
    shadows,
};

export default {
    light: lightTheme,
    dark: darkTheme,
    palette,
    spacing,
    typography,
    borderRadius,
    shadows,
};
