/**
 * Onboarding Step 1: Age & Gender
 * Premium redesign with gradient header, animated progress, and polished inputs
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors, { GRADIENTS } from '../assets/colors';
import { validateAge, validateGender } from '../utils/validation';
import useStore from '../state/store';

const { width } = Dimensions.get('window');
const TOTAL_STEPS = 4;
const CURRENT_STEP = 1;

function OnboardingStep1({ navigation, route }) {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [ageError, setAgeError] = useState('');
  const onboardingData = route.params?.onboardingData || {};
  const updateUser = useStore((state) => state.updateUser);

  // Animations
  const headerAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(30)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const emojiAnim = useRef(new Animated.Value(0)).current;

  const genders = [
    { label: 'Male', icon: 'gender-male' },
    { label: 'Female', icon: 'gender-female' },
    { label: 'Non-binary', icon: 'gender-non-binary' },
    { label: 'Prefer not to say', icon: 'account-outline' },
  ];

  useEffect(() => {
    // Staggered entrance animations
    Animated.sequence([
      Animated.parallel([
        Animated.timing(headerAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(emojiAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(formAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(formOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: CURRENT_STEP / TOTAL_STEPS,
      duration: 800,
      delay: 300,
      useNativeDriver: false,
    }).start();

    // Pulse animation for active progress dot
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();

    return () => pulse.stop();
  }, [headerAnim, formAnim, formOpacity, progressAnim, pulseAnim, emojiAnim]);

  const handleAgeChange = (text) => {
    setAge(text);
    setAgeError('');
  };

  const handleGenderSelect = (item) => {
    setGender(item);
    // Subtle button bounce when form becomes complete
    if (age && !gender) {
      Animated.sequence([
        Animated.timing(buttonScale, { toValue: 1.05, duration: 150, useNativeDriver: true }),
        Animated.timing(buttonScale, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
    }
  };

  const handleNext = () => {
    const ageValidation = validateAge(age);
    if (!ageValidation.isValid) {
      setAgeError(ageValidation.error);
      return;
    }

    const genderValidation = validateGender(gender);
    if (!genderValidation.isValid) {
      Alert.alert('Validation Error', genderValidation.error);
      return;
    }

    updateUser({
      age: ageValidation.value,
      gender: genderValidation.value,
    });

    navigation.navigate('OnboardingStep2', {
      onboardingData: {
        ...onboardingData,
        age: ageValidation.value,
        gender: genderValidation.value,
      },
    });
  };

  const isFormComplete = age && gender;

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <Animated.View style={[styles.headerGradientWrap, { opacity: headerAnim }]}>
        <LinearGradient
          colors={['#06b6d4', '#0891b2', '#0e7490']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Decorative circles */}
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />

          {/* Emoji / Icon */}
          <Animated.View
            style={[
              styles.emojiContainer,
              {
                opacity: emojiAnim,
                transform: [
                  {
                    translateY: emojiAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.emojiBubble}>
              <Icon name="hand-wave" size={32} color="#f97316" />
            </View>
          </Animated.View>

          <Text style={styles.headerTitle}>Welcome!</Text>
          <Text style={styles.headerSubtitle}>Let's personalize your journey</Text>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
            <View style={styles.progressDots}>
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <Animated.View
                  key={i}
                  style={[
                    styles.progressDot,
                    i < CURRENT_STEP && styles.progressDotActive,
                    i === CURRENT_STEP - 1 && {
                      transform: [{ scale: pulseAnim }],
                    },
                  ]}
                />
              ))}
            </View>
            <Text style={styles.stepText}>Step {CURRENT_STEP} of {TOTAL_STEPS}</Text>
          </View>
        </LinearGradient>
        {/* Curved bottom edge */}
        <View style={styles.headerCurve} />
      </Animated.View>

      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex1}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Form Section */}
          <Animated.View
            style={[
              styles.formSection,
              {
                opacity: formOpacity,
                transform: [{ translateY: formAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>Tell us about yourself</Text>

            {/* Age Input */}
            <Text style={styles.label}>Your Age</Text>
            <View style={[styles.inputContainer, ageError && styles.inputContainerError]}>
              <View style={styles.inputIconWrap}>
                <Icon name="cake-variant" size={20} color="#06b6d4" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter your age"
                placeholderTextColor={colors.textLight}
                value={age}
                onChangeText={handleAgeChange}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>
            {ageError ? (
              <View style={styles.errorRow}>
                <Icon name="alert-circle" size={14} color={colors.error} />
                <Text style={styles.errorText}>{ageError}</Text>
              </View>
            ) : null}

            {/* Gender Selection */}
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderGrid}>
              {genders.map((item) => {
                const isSelected = gender === item.label;
                return (
                  <TouchableOpacity
                    key={item.label}
                    activeOpacity={0.7}
                    onPress={() => handleGenderSelect(item.label)}
                  >
                    {isSelected ? (
                      <LinearGradient
                        colors={['#06b6d4', '#0891b2']}
                        style={styles.genderCard}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <View style={styles.genderIconWrapSelected}>
                          <Icon name={item.icon} size={22} color="#FFFFFF" />
                        </View>
                        <Text style={styles.genderTextSelected}>{item.label}</Text>
                        <View style={styles.checkBadge}>
                          <Icon name="check" size={12} color="#06b6d4" />
                        </View>
                      </LinearGradient>
                    ) : (
                      <View style={styles.genderCard}>
                        <View style={styles.genderIconWrap}>
                          <Icon name={item.icon} size={22} color="#06b6d4" />
                        </View>
                        <Text style={styles.genderText}>{item.label}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Floating CTA Button */}
      <Animated.View
        style={[styles.floatingFooter, { transform: [{ scale: buttonScale }] }]}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleNext}
          disabled={!isFormComplete}
        >
          <LinearGradient
            colors={isFormComplete ? ['#06b6d4', '#0e7490'] : ['#cbd5e1', '#94a3b8']}
            style={styles.ctaButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.ctaText}>Continue</Text>
            <Icon name="arrow-right" size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  flex1: {
    flex: 1,
  },
  // ---- Header ----
  headerGradientWrap: {
    position: 'relative',
    zIndex: 1,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    overflow: 'hidden',
  },
  headerCurve: {
    height: 30,
    backgroundColor: '#f0f9ff',
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  decorCircle1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  decorCircle2: {
    position: 'absolute',
    bottom: 10,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  emojiContainer: {
    marginBottom: 12,
  },
  emojiBubble: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
    marginBottom: 20,
  },
  // ---- Progress Bar ----
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  progressDots: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  progressDotActive: {
    backgroundColor: '#FFFFFF',
  },
  stepText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  // ---- Form ----
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 120,
  },
  formSection: {},
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 24,
    letterSpacing: -0.3,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 10,
    marginTop: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // ---- Age Input ----
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  inputContainerError: {
    borderColor: colors.error,
  },
  inputIconWrap: {
    paddingLeft: 16,
    paddingRight: 4,
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    fontWeight: '500',
  },
  // ---- Gender Cards ----
  genderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  genderCard: {
    width: (width - 60) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    position: 'relative',
  },
  genderIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ecfeff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  genderIconWrapSelected: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  genderText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  genderTextSelected: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // ---- Floating CTA ----
  floatingFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    paddingTop: 16,
    backgroundColor: 'rgba(240,249,255,0.95)',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

export default OnboardingStep1;
