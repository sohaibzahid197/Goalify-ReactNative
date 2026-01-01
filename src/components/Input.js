/**
 * Enhanced Input Component
 * Text input with floating labels, icons, and error states
 */

import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Input = ({
    label,
    value,
    onChangeText,
    placeholder,
    error = null,
    leftIcon = null,
    rightIcon = null,
    maxLength,
    showCounter = false,
    style,
    inputStyle,
    ...props
}) => {
    const theme = useTheme();
    const [isFocused, setIsFocused] = useState(false);

    const hasValue = value && value.length > 0;
    const hasError = error && error.length > 0;

    const getBorderColor = () => {
        if (hasError) return theme.colors.error;
        if (isFocused) return theme.colors.primary;
        return theme.colors.outline;
    };

    return (
        <View style={[styles.container, style]}>
            {label && (
                <Text style={[styles.label, { color: theme.colors.onSurface }]}>
                    {label}
                </Text>
            )}
            <View
                style={[
                    styles.inputContainer,
                    {
                        borderColor: getBorderColor(),
                        backgroundColor: theme.colors.surface,
                    },
                ]}
            >
                {leftIcon && (
                    <Icon
                        name={leftIcon}
                        size={20}
                        color={isFocused ? theme.colors.primary : theme.colors.outline}
                        style={styles.leftIcon}
                    />
                )}
                <TextInput
                    style={[
                        styles.input,
                        { color: theme.colors.onSurface },
                        inputStyle,
                    ]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={theme.colors.outline}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    maxLength={maxLength}
                    {...props}
                />
                {rightIcon && (
                    <Icon
                        name={rightIcon}
                        size={20}
                        color={isFocused ? theme.colors.primary : theme.colors.outline}
                        style={styles.rightIcon}
                    />
                )}
            </View>
            {hasError && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                    {error}
                </Text>
            )}
            {showCounter && maxLength && (
                <Text style={[styles.counter, { color: theme.colors.outline }]}>
                    {value?.length || 0}/{maxLength}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 16,
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
    },
    leftIcon: {
        marginRight: 12,
    },
    rightIcon: {
        marginLeft: 12,
    },
    errorText: {
        fontSize: 12,
        marginTop: 4,
    },
    counter: {
        fontSize: 12,
        marginTop: 4,
        textAlign: 'right',
    },
});

export default Input;
