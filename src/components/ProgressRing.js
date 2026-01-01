/**
 * Animated Progress Ring Component
 * Circular progress indicator with smooth animations
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from 'react-native-paper';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const ProgressRing = ({
    progress = 0, // 0-100
    size = 120,
    strokeWidth = 10,
    color,
    backgroundColor,
    showPercentage = true,
    children,
    style,
}) => {
    const theme = useTheme();
    const progressValue = useSharedValue(0);

    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;

    const ringColor = color || theme.colors.primary;
    const bgColor = backgroundColor || theme.colors.surfaceVariant;

    useEffect(() => {
        progressValue.value = withTiming(progress, {
            duration: 1000,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
    }, [progress]);

    const animatedProps = useAnimatedProps(() => {
        const strokeDashoffset = circumference - (progressValue.value / 100) * circumference;
        return {
            strokeDashoffset,
        };
    });

    return (
        <View style={[styles.container, { width: size, height: size }, style]}>
            <Svg width={size} height={size}>
                {/* Background Circle */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={bgColor}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Progress Circle */}
                <AnimatedCircle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={ringColor}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    animatedProps={animatedProps}
                    strokeLinecap="round"
                    rotation="-90"
                    origin={`${size / 2}, ${size / 2}`}
                />
            </Svg>
            <View style={styles.content}>
                {showPercentage && !children && (
                    <Text style={[styles.percentage, { color: ringColor }]}>
                        {Math.round(progress)}%
                    </Text>
                )}
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    percentage: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default ProgressRing;
