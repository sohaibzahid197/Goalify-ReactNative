/**
 * Onboarding Step 4: Difficulty Preference
 * Premium redesign with gradient header, animated progress, and difficulty cards
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../assets/colors';
import useStore from '../state/store';
import { validateDifficulty } from '../utils/validation';

const TOTAL_STEPS = 4;
const CURRENT_STEP = 4;

function OnboardingStep4({ navigation, route }) {
  const [difficulty, setDifficulty] = useState('');
  const onboardingData = route.params?.onboardingData || {};
  const updateUser = useStore((state) => state.updateUser);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(30)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const difficulties = [
    {
      value: 'easy',
      label: 'Easy',
      description: 'Gentle start, build habits gradually',
      icon: 'leaf',
      color: '#10b981',
      emoji: 'Relaxed pace',
    },
    {
      value: 'medium',
      label: 'Medium',
      description: 'Balanced challenges, steady progress',
      icon: 'fire',
      color: '#f97316',
      emoji: 'Sweet spot',
    },
    {
      value: 'hard',
      label: 'Hard',
      description: 'Intense challenges, maximum growth',
      icon: 'lightning-bolt',
      color: '#ef4444',
      emoji: 'Beast mode',
    },
  ];

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(formAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(formOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
    ]).start();

    Animated.timing(progressAnim, {
      toValue: CURRENT_STEP / TOTAL_STEPS,
      duration: 800, delay: 300, useNativeDriver: false,
    }).start();

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.3, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [headerAnim, formAnim, formOpacity, progressAnim, pulseAnim]);

  const handleSelect = (value) => {
    setDifficulty(value);
    if (!difficulty) {
      Animated.sequence([
        Animated.timing(buttonScale, { toValue: 1.05, duration: 150, useNativeDriver: true }),
        Animated.timing(buttonScale, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
    }
  };

  const handleComplete = () => {
    const validation = validateDifficulty(difficulty);
    if (!validation.isValid) {
      Alert.alert('Validation Error', validation.error);
      return;
    }

    updateUser({
      ...onboardingData,
      difficultyPreference: validation.value,
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
    });

    navigation.replace('Main');
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.headerGradientWrap, { opacity: headerAnim }]}>
        <LinearGradient
          colors={['#06b6d4', '#0891b2', '#0e7490']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />
          <View style={styles.emojiBubble}>
            <Icon name="rocket-launch" size={32} color="#f97316" />
          </View>
          <Text style={styles.headerTitle}>Almost There!</Text>
          <Text style={styles.headerSubtitle}>Choose how you want to be challenged</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, {
                width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
              }]} />
            </View>
            <View style={styles.progressDots}>
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <Animated.View key={i} style={[
                  styles.progressDot,
                  i < CURRENT_STEP && styles.progressDotActive,
                  i === CURRENT_STEP - 1 && { transform: [{ scale: pulseAnim }] },
                ]} />
              ))}
            </View>
            <Text style={styles.stepText}>Step {CURRENT_STEP} of {TOTAL_STEPS}</Text>
          </View>
        </LinearGradient>
        <View style={styles.headerCurve} />
      </Animated.View>

      <ScrollView style={styles.flex1} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: formOpacity, transform: [{ translateY: formAnim }] }}>
          <Text style={styles.sectionTitle}>Choose your challenge level</Text>

          {difficulties.map((item) => {
            const isSelected = difficulty === item.value;
            return (
              <TouchableOpacity
                key={item.value}
                activeOpacity={0.7}
                onPress={() => handleSelect(item.value)}
              >
                {isSelected ? (
                  <LinearGradient
                    colors={['#06b6d4', '#0891b2']}
                    style={styles.difficultyCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <View style={styles.difficultyHeader}>
                      <View style={styles.diffIconWrapSelected}>
                        <Icon name={item.icon} size={26} color="#FFFFFF" />
                      </View>
                      <View style={styles.diffTextWrap}>
                        <Text style={styles.diffLabelSelected}>{item.label}</Text>
                        <Text style={styles.diffTagSelected}>{item.emoji}</Text>
                      </View>
                      <Icon name="check-circle" size={24} color="#FFFFFF" />
                    </View>
                    <Text style={styles.diffDescSelected}>{item.description}</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.difficultyCard}>
                    <View style={styles.difficultyHeader}>
                      <View style={[styles.diffIconWrap, { backgroundColor: item.color + '15' }]}>
                        <Icon name={item.icon} size={26} color={item.color} />
                      </View>
                      <View style={styles.diffTextWrap}>
                        <Text style={styles.diffLabel}>{item.label}</Text>
                        <Text style={styles.diffTag}>{item.emoji}</Text>
                      </View>
                      <View style={styles.radioOuter} />
                    </View>
                    <Text style={styles.diffDesc}>{item.description}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      </ScrollView>

      <Animated.View style={[styles.floatingFooter, { transform: [{ scale: buttonScale }] }]}>
        <View style={styles.footerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={20} color={colors.text} />
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleComplete}
            disabled={!difficulty}
            style={styles.flex1}
          >
            <LinearGradient
              colors={difficulty ? ['#f97316', '#ea580c'] : ['#cbd5e1', '#94a3b8']}
              style={styles.ctaButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Icon name="rocket-launch" size={20} color="#FFFFFF" />
              <Text style={styles.ctaText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f9ff' },
  flex1: { flex: 1 },
  headerGradientWrap: { position: 'relative', zIndex: 1 },
  headerGradient: { paddingTop: 60, paddingBottom: 40, paddingHorizontal: 24, alignItems: 'center', overflow: 'hidden' },
  headerCurve: { height: 30, backgroundColor: '#f0f9ff', marginTop: -30, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  decorCircle1: { position: 'absolute', top: -40, right: -40, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.08)' },
  decorCircle2: { position: 'absolute', bottom: 10, left: -30, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.06)' },
  emojiBubble: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
  headerSubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.85)', fontWeight: '500', marginBottom: 20 },
  progressContainer: { width: '100%', alignItems: 'center' },
  progressTrack: { width: '100%', height: 4, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#FFFFFF', borderRadius: 2 },
  progressDots: { flexDirection: 'row', marginTop: 10, gap: 8 },
  progressDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)' },
  progressDotActive: { backgroundColor: '#FFFFFF' },
  stepText: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600', marginTop: 6 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 140 },
  sectionTitle: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 20, letterSpacing: -0.3 },
  // Difficulty cards
  difficultyCard: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 16,
    borderWidth: 2, borderColor: '#e2e8f0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  difficultyHeader: { flexDirection: 'row', alignItems: 'center' },
  diffIconWrap: { width: 50, height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  diffIconWrapSelected: { width: 50, height: 50, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  diffTextWrap: { flex: 1 },
  diffLabel: { fontSize: 20, fontWeight: '800', color: colors.text },
  diffLabelSelected: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  diffTag: { fontSize: 12, fontWeight: '600', color: colors.textLight, marginTop: 2 },
  diffTagSelected: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  diffDesc: { fontSize: 14, color: colors.textLight, lineHeight: 20, marginTop: 12 },
  diffDescSelected: { fontSize: 14, color: 'rgba(255,255,255,0.9)', lineHeight: 20, marginTop: 12 },
  radioOuter: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#cbd5e1' },
  // Footer
  floatingFooter: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24, paddingTop: 16,
    backgroundColor: 'rgba(240,249,255,0.95)',
  },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 18, paddingHorizontal: 20,
    backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 2, borderColor: '#e2e8f0',
  },
  backBtnText: { fontSize: 16, fontWeight: '700', color: colors.text },
  ctaButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 18, borderRadius: 16, gap: 8,
    shadowColor: '#f97316', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
  ctaText: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.5 },
});

export default OnboardingStep4;
