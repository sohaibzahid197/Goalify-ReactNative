/**
 * Lottie Animation Wrapper Component
 * Simplified wrapper for Lottie animations
 */

import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const LottieAnimation = ({
    source,
    autoPlay = true,
    loop = true,
    speed = 1,
    onAnimationFinish,
    style,
    size = 200,
    ...props
}) => {
    const animationRef = useRef(null);

    useEffect(() => {
        if (autoPlay && animationRef.current) {
            animationRef.current.play();
        }
    }, [autoPlay]);

    return (
        <View style={[styles.container, { width: size, height: size }, style]}>
            <LottieView
                ref={animationRef}
                source={source}
                autoPlay={autoPlay}
                loop={loop}
                speed={speed}
                onAnimationFinish={onAnimationFinish}
                style={styles.animation}
                {...props}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    animation: {
        width: '100%',
        height: '100%',
    },
});

export default LottieAnimation;
