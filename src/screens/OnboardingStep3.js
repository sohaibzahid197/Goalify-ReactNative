/**
 * Onboarding Step 3: Main Goals
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import colors from '../assets/colors';
import { validateGoals } from '../utils/validation';
import useStore from '../state/store';

function OnboardingStep3({ navigation, route }) {
  const [selectedGoals, setSelectedGoals] = useState([]);
  const onboardingData = route.params?.onboardingData || {};
  const updateUser = useStore((state) => state.updateUser);

  const goals = [
    'Health & Fitness',
    'Career & Professional',
    'Financial',
    'Education & Learning',
    'Relationships',
    'Personal Development',
    'Creative & Hobbies',
    'Travel & Adventure',
  ];

  const toggleGoal = (goal) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleNext = () => {
    // Validate goals
    const validation = validateGoals(selectedGoals);
    if (!validation.isValid) {
      Alert.alert('Validation Error', validation.error);
      return;
    }

    // Save to store
    updateUser({
      mainGoals: validation.value,
    });

    navigation.navigate('OnboardingStep4', {
      onboardingData: {
        ...onboardingData,
        mainGoals: validation.value,
      },
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.stepIndicator}>Step 3 of 4</Text>
        <Text style={styles.title}>What are your main goals?</Text>
        <Text style={styles.subtitle}>Select all that apply</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.goalsContainer}>
          {goals.map((goal) => {
            const isSelected = selectedGoals.includes(goal);
            return (
              <TouchableOpacity
                key={goal}
                style={[
                  styles.goalButton,
                  isSelected && styles.goalButtonSelected,
                ]}
                onPress={() => toggleGoal(goal)}
              >
                <Text
                  style={[
                    styles.goalButtonText,
                    isSelected && styles.goalButtonTextSelected,
                  ]}
                >
                  {goal}
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
          style={[styles.button, selectedGoals.length === 0 && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={selectedGoals.length === 0}
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
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 24,
    gap: 12,
  },
  goalButton: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: colors.borderLight,
    minWidth: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  goalButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  goalButtonText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '600',
  },
  goalButtonTextSelected: {
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

export default OnboardingStep3;
