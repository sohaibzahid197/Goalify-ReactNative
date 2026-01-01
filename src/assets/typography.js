/**
 * Typography System for Goalify
 * Defines font families, sizes, weights, and text styles
 */

export const fontFamilies = {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
};

export const fontSizes = {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 48,
};

export const fontWeights = {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
};

export const lineHeights = {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
};

// Pre-defined text styles
export const textStyles = {
    // Headings
    h1: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.huge,
        fontWeight: fontWeights.bold,
        lineHeight: fontSizes.huge * lineHeights.tight,
    },
    h2: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.xxxl,
        fontWeight: fontWeights.bold,
        lineHeight: fontSizes.xxxl * lineHeights.tight,
    },
    h3: {
        fontFamily: fontFamilies.semibold,
        fontSize: fontSizes.xxl,
        fontWeight: fontWeights.semibold,
        lineHeight: fontSizes.xxl * lineHeights.normal,
    },
    h4: {
        fontFamily: fontFamilies.semibold,
        fontSize: fontSizes.xl,
        fontWeight: fontWeights.semibold,
        lineHeight: fontSizes.xl * lineHeights.normal,
    },

    // Body text
    body: {
        fontFamily: fontFamilies.regular,
        fontSize: fontSizes.base,
        fontWeight: fontWeights.regular,
        lineHeight: fontSizes.base * lineHeights.normal,
    },
    bodyLarge: {
        fontFamily: fontFamilies.regular,
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.regular,
        lineHeight: fontSizes.lg * lineHeights.normal,
    },
    bodySmall: {
        fontFamily: fontFamilies.regular,
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.regular,
        lineHeight: fontSizes.sm * lineHeights.normal,
    },

    // Labels
    label: {
        fontFamily: fontFamilies.medium,
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.medium,
        lineHeight: fontSizes.sm * lineHeights.normal,
    },
    labelLarge: {
        fontFamily: fontFamilies.medium,
        fontSize: fontSizes.base,
        fontWeight: fontWeights.medium,
        lineHeight: fontSizes.base * lineHeights.normal,
    },

    // Buttons
    button: {
        fontFamily: fontFamilies.semibold,
        fontSize: fontSizes.base,
        fontWeight: fontWeights.semibold,
        lineHeight: fontSizes.base * lineHeights.tight,
    },
    buttonLarge: {
        fontFamily: fontFamilies.semibold,
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.semibold,
        lineHeight: fontSizes.lg * lineHeights.tight,
    },

    // Caption
    caption: {
        fontFamily: fontFamilies.regular,
        fontSize: fontSizes.xs,
        fontWeight: fontWeights.regular,
        lineHeight: fontSizes.xs * lineHeights.normal,
    },
};

export default {
    fontFamilies,
    fontSizes,
    fontWeights,
    lineHeights,
    textStyles,
};
