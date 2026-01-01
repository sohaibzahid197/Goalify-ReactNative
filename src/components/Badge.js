/**
 * Badge Component
 * Color-coded badges for difficulty levels and status indicators
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Badge = ({
    children,
    variant = 'default', // default, success, warning, error, info
    size = 'medium', // small, medium, large
    icon = null,
    style,
    textStyle,
    ...props
}) => {
    const theme = useTheme();

    const getBackgroundColor = () => {
        switch (variant) {
            case 'success':
                return '#6BCB77';
            case 'warning':
                return '#F5A623';
            case 'error':
                return '#FF3B30';
            case 'info':
                return '#4A90E2';
            default:
                return theme.colors.surfaceVariant;
        }
    };

    const getTextColor = () => {
        switch (variant) {
            case 'success':
            case 'warning':
            case 'error':
            case 'info':
                return '#FFFFFF';
            default:
                return theme.colors.onSurface;
        }
    };

    const getSizeStyle = () => {
        switch (size) {
            case 'small':
                return styles.small;
            case 'large':
                return styles.large;
            default:
                return styles.medium;
        }
    };

    const getIconSize = () => {
        switch (size) {
            case 'small':
                return 12;
            case 'large':
                return 18;
            default:
                return 14;
        }
    };

    return (
        <View
            style={[
                styles.badge,
                getSizeStyle(),
                { backgroundColor: getBackgroundColor() },
                style,
            ]}
            {...props}
        >
            {icon && (
                <Icon
                    name={icon}
                    size={getIconSize()}
                    color={getTextColor()}
                    style={styles.icon}
                />
            )}
            <Text
                style={[
                    styles.text,
                    { color: getTextColor() },
                    size === 'small' && styles.textSmall,
                    size === 'large' && styles.textLarge,
                    textStyle,
                ]}
            >
                {children}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    small: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    medium: {
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    large: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    text: {
        fontWeight: '600',
        fontSize: 12,
    },
    textSmall: {
        fontSize: 10,
    },
    textLarge: {
        fontSize: 14,
    },
    icon: {
        marginRight: 4,
    },
});

export default Badge;
