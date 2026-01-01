/**
 * Onboarding Step 1: Age & Gender
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import colors from '../assets/colors';
import { validateAge, validateGender } from '../utils/validation';
import useStore from '../state/store';

function OnboardingStep1({ navigation, route }) {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [ageError, setAgeError] = useState('');
  const onboardingData = route.params?.onboardingData || {};
  const updateUser = useStore((state) => state.updateUser);

  const genders = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

  const handleAgeChange = (text) => {
    setAge(text);
    setAgeError('');
  };

  const handleNext = () => {
    // Validate age
    const ageValidation = validateAge(age);
    if (!ageValidation.isValid) {
      setAgeError(ageValidation.error);
      return;
    }

    // Validate gender
    const genderValidation = validateGender(gender);
    if (!genderValidation.isValid) {
      Alert.alert('Validation Error', genderValidation.error);
      return;
    }

    // Save to store
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.stepIndicator}>Step 1 of 4</Text>
        <Text style={styles.title}>Tell us about yourself</Text>
        <Text style={styles.subtitle}>This helps us personalize your experience</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={[styles.input, ageError && styles.inputError]}
          placeholder="Enter your age (1-120)"
          placeholderTextColor={colors.textLight}
          value={age}
          onChangeText={handleAgeChange}
          keyboardType="numeric"
          maxLength={3}
        />
        {ageError ? (
          <Text style={styles.errorText}>{ageError}</Text>
        ) : null}

        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderContainer}>
          {genders.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.genderButton,
                gender === item && styles.genderButtonSelected,
              ]}
              onPress={() => setGender(item)}
            >
              <Text
                style={[
                  styles.genderButtonText,
                  gender === item && styles.genderButtonTextSelected,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, (!age || !gender) && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!age || !gender}
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
  label: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: 18,
    fontSize: 16,
    color: colors.text,
    borderWidth: 2,
    borderColor: colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  genderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 12,
  },
  genderButton: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  genderButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  genderButtonText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  genderButtonTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  footer: {
    marginTop: 40,
    marginBottom: 24,
  },
  button: {
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

export default OnboardingStep1;
