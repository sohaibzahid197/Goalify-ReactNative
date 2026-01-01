/**
 * Enhanced Button Component
 * Modern button with variants, sizes, loading states, and animations
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Button = ({
    children,
    onPress,
    variant = 'primary', // primary, secondary, outline, text
    size = 'medium', // small, medium, large
    loading = false,
    disabled = false,
    icon = null,
    iconPosition = 'left', // left, right
    fullWidth = false,
    style,
    textStyle,
    ...props
}) => {
    const theme = useTheme();

    const getButtonStyle = () => {
        const baseStyle = [styles.button];

        // Size styles
        switch (size) {
            case 'small':
                baseStyle.push(styles.buttonSmall);
                break;
            case 'large':
                baseStyle.push(styles.buttonLarge);
                break;
            default:
                baseStyle.push(styles.buttonMedium);
        }

        // Variant styles
        switch (variant) {
            case 'primary':
                baseStyle.push({
                    backgroundColor: theme.colors.primary,
                });
                break;
            case 'secondary':
                baseStyle.push({
                    backgroundColor: theme.colors.secondary,
                });
                break;
            case 'outline':
                baseStyle.push({
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderColor: theme.colors.primary,
                });
                break;
            case 'text':
                baseStyle.push({
                    backgroundColor: 'transparent',
                });
                break;
        }

        if (fullWidth) {
            baseStyle.push(styles.fullWidth);
        }

        if (disabled || loading) {
            baseStyle.push(styles.disabled);
        }

        return baseStyle;
    };

    const getTextStyle = () => {
        const baseTextStyle = [styles.text];

        // Size text styles
        switch (size) {
            case 'small':
                baseTextStyle.push(styles.textSmall);
                break;
            case 'large':
                baseTextStyle.push(styles.textLarge);
                break;
            default:
                baseTextStyle.push(styles.textMedium);
        }

        // Variant text styles
        switch (variant) {
            case 'primary':
            case 'secondary':
                baseTextStyle.push({ color: '#FFFFFF' });
                break;
            case 'outline':
                baseTextStyle.push({ color: theme.colors.primary });
                break;
            case 'text':
                baseTextStyle.push({ color: theme.colors.primary });
                break;
        }

        return baseTextStyle;
    };

    const renderContent = () => {
        if (loading) {
            return (
                <ActivityIndicator
                    color={variant === 'outline' || variant === 'text' ? theme.colors.primary : '#FFFFFF'}
                    size={size === 'small' ? 'small' : 'small'}
                />
            );
        }

        return (
            <View style={styles.content}>
                {icon && iconPosition === 'left' && (
                    <Icon
                        name={icon}
                        size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
                        color={variant === 'outline' || variant === 'text' ? theme.colors.primary : '#FFFFFF'}
                        style={styles.iconLeft}
                    />
                )}
                <Text style={[...getTextStyle(), textStyle]}>{children}</Text>
                {icon && iconPosition === 'right' && (
                    <Icon
                        name={icon}
                        size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
                        color={variant === 'outline' || variant === 'text' ? theme.colors.primary : '#FFFFFF'}
                        style={styles.iconRight}
                    />
                )}
            </View>
        );
    };

    return (
        <TouchableOpacity
            style={[...getButtonStyle(), style]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
            {...props}
        >
            {renderContent()}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#06b6d4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonSmall: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    buttonMedium: {
        paddingVertical: 14,
        paddingHorizontal: 24,
    },
    buttonLarge: {
        paddingVertical: 18,
        paddingHorizontal: 32,
    },
    fullWidth: {
        width: '100%',
    },
    disabled: {
        opacity: 0.5,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontWeight: '600',
    },
    textSmall: {
        fontSize: 14,
    },
    textMedium: {
        fontSize: 16,
    },
    textLarge: {
        fontSize: 18,
    },
    iconLeft: {
        marginRight: 8,
    },
    iconRight: {
        marginLeft: 8,
    },
});

export default Button;
