/**
 * Onboarding Step 4: Difficulty Preference
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import colors from '../assets/colors';
import useStore from '../state/store';
import { userActions } from '../state/actions';

function OnboardingStep4({ navigation, route }) {
  const [difficulty, setDifficulty] = useState('');
  const onboardingData = route.params?.onboardingData || {};
  const updateUser = useStore((state) => state.updateUser);

  const difficulties = [
    { value: 'easy', label: 'Easy', description: 'Gentle start, build habits gradually' },
    { value: 'medium', label: 'Medium', description: 'Balanced challenges, steady progress' },
    { value: 'hard', label: 'Hard', description: 'Intense challenges, maximum growth' },
  ];

  const handleComplete = () => {
    // Save onboarding data to store
    updateUser({
      ...onboardingData,
      difficultyPreference: difficulty,
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
    });

    // Navigate to main app
    navigation.replace('Main');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.stepIndicator}>Step 4 of 4</Text>
        <Text style={styles.title}>Choose your challenge level</Text>
        <Text style={styles.subtitle}>We'll tailor challenges to your preference</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.difficultyContainer}>
          {difficulties.map((item) => {
            const isSelected = difficulty === item.value;
            return (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.difficultyButton,
                  isSelected && styles.difficultyButtonSelected,
                ]}
                onPress={() => setDifficulty(item.value)}
              >
                <Text
                  style={[
                    styles.difficultyLabel,
                    isSelected && styles.difficultyLabelSelected,
                  ]}
                >
                  {item.label}
                </Text>
                <Text
                  style={[
                    styles.difficultyDescription,
                    isSelected && styles.difficultyDescriptionSelected,
                  ]}
                >
                  {item.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !difficulty && styles.buttonDisabled]}
          onPress={handleComplete}
          disabled={!difficulty}
        >
          <Text style={styles.buttonText}>Get Started</Text>
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
  difficultyContainer: {
    marginTop: 24,
  },
  difficultyButton: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  difficultyButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  difficultyLabel: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  difficultyLabelSelected: {
    color: '#FFFFFF',
  },
  difficultyDescription: {
    fontSize: 15,
    color: colors.textLight,
    lineHeight: 22,
  },
  difficultyDescriptionSelected: {
    color: '#FFFFFF',
    opacity: 0.95,
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

export default OnboardingStep4;
