/**
 * Onboarding Step 2: Life Situation
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import colors from '../assets/colors';

function OnboardingStep2({ navigation, route }) {
  const [lifeSituation, setLifeSituation] = useState('');
  const onboardingData = route.params?.onboardingData || {};

  const situations = [
    'Student',
    'Working Professional',
    'Entrepreneur',
    'Stay-at-home Parent',
    'Retired',
    'Freelancer',
    'Other',
  ];

  const handleNext = () => {
    navigation.navigate('OnboardingStep3', {
      onboardingData: {
        ...onboardingData,
        lifeSituation,
      },
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.stepIndicator}>Step 2 of 4</Text>
        <Text style={styles.title}>What's your life situation?</Text>
        <Text style={styles.subtitle}>This helps us tailor challenges to your lifestyle</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.optionsContainer}>
          {situations.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.optionButton,
                lifeSituation === item && styles.optionButtonSelected,
              ]}
              onPress={() => setLifeSituation(item)}
            >
              <Text
                style={[
                  styles.optionButtonText,
                  lifeSituation === item && styles.optionButtonTextSelected,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !lifeSituation && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!lifeSituation}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginTop: 50,
    marginBottom: 40,
  },
  stepIndicator: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    color: colors.textLight,
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  optionsContainer: {
    marginTop: 24,
  },
  optionButton: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  optionButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  optionButtonText: {
    fontSize: 17,
    color: colors.text,
    fontWeight: '600',
  },
  optionButtonTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 40,
    marginBottom: 24,
    gap: 16,
  },
  backButton: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  button: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: colors.borderLight,
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

export default OnboardingStep2;
