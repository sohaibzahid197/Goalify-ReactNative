/**
 * Animated Counter Component
 * Smoothly animates number changes using Reanimated 2
 */

import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { useTheme } from 'react-native-paper';

const AnimatedText = Animated.createAnimatedComponent(Text);

export const AnimatedCounter = ({
  value = 0,
  duration = 1000,
  style,
  formatter = (val) => val.toLocaleString(),
  useSpring = false,
  decimalPlaces = 0,
  textStyle,
}) => {
  const theme = useTheme();
  const animatedValue = useSharedValue(0);
  
  useEffect(() => {
    if (useSpring) {
      animatedValue.value = withSpring(value, {
        damping: 15,
        stiffness: 100,
      });
    } else {
      animatedValue.value = withTiming(value, {
        duration,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [value, duration, useSpring]);
  
  const animatedStyle = useAnimatedStyle(() => {
    const maxVal = Math.max(value, 1);
    
    return {
      opacity: interpolate(
        animatedValue.value,
        [0, maxVal * 0.1, maxVal],
        [0, 0.5, 1],
        Extrapolate.CLAMP
      ),
      transform: [
        {
          scale: interpolate(
            animatedValue.value,
            [0, maxVal * 0.5, maxVal],
            [0.8, 1.1, 1],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });
  
  // Use a simpler approach - just animate the style, display the value
  return (
    <AnimatedText
      style={[
        styles.text,
        { color: theme.colors?.onSurface || '#000000' },
        animatedStyle,
        textStyle,
        style,
      ]}
    >
      {formatter(Math.round(value * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces))}
    </AnimatedText>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default AnimatedCounter;
