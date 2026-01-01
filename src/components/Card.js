/**
 * Modern Card Component
 * Neumorphic design with soft shadows and press interactions
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

const Card = ({
    children,
    onPress,
    variant = 'elevated', // elevated, flat, outlined, glass
    padding = 'medium', // none, small, medium, large
    style,
    ...props
}) => {
    const theme = useTheme();

    const getPaddingStyle = () => {
        switch (padding) {
            case 'none':
                return { padding: 0 };
            case 'small':
                return { padding: 12 };
            case 'large':
                return { padding: 24 };
            default:
                return { padding: 16 };
        }
    };

    const getCardStyle = () => {
        const baseStyle = [styles.card, getPaddingStyle()];

        switch (variant) {
            case 'elevated':
                baseStyle.push({
                    backgroundColor: theme.colors.surface,
                    ...styles.elevated,
                });
                break;
            case 'flat':
                baseStyle.push({
                    backgroundColor: theme.colors.surface,
                    borderWidth: 1,
                    borderColor: theme.colors.surfaceVariant,
                });
                break;
            case 'outlined':
                baseStyle.push({
                    backgroundColor: theme.colors.surface,
                    borderWidth: 1,
                    borderColor: theme.colors.outline,
                });
                break;
            case 'glass':
                baseStyle.push({
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    ...styles.glass,
                });
                break;
        }

        return baseStyle;
    };

    const CardContent = (
        <View style={[...getCardStyle(), style]} {...props}>
            {children}
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
                {CardContent}
            </TouchableOpacity>
        );
    }

    return CardContent;
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    elevated: {
        shadowColor: '#06b6d4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 8,
    },
    glass: {
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
});

export default Card;
