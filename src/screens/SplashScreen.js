/**
 * Splash Screen
 * Initial loading screen with modern gradient design
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GRADIENTS } from '../assets/colors';
import colors from '../assets/colors';

function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('OnboardingStep1');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient
      colors={GRADIENTS.headerGradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Icon name="target" size={64} color="#FFFFFF" style={styles.logoIcon} />
          <Text style={styles.logo}>Goalify</Text>
        </View>
        <Text style={styles.tagline}>Achieve Your Goals, One Challenge at a Time</Text>
        <ActivityIndicator size="large" color="#FFFFFF" style={styles.loader} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoIcon: {
    marginBottom: 16,
  },
  logo: {
    fontSize: 56,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.95,
    marginBottom: 50,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 26,
  },
  loader: {
    marginTop: 20,
  },
});

export default SplashScreen;
