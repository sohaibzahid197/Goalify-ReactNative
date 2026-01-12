/**
 * Settings Screen
 * Update user info and preferences
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Dimensions, Alert } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../assets/colors';
import useStore from '../state/store';
import { userActions, settingsActions } from '../state/actions';
import { validateAge, validateEmail, validateName } from '../utils/validation';
import { calculateStrideFromHeight } from '../utils/activityCalculations';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Responsive font size function
const scaleFontSize = (size) => {
  const scale = SCREEN_WIDTH / 375; // Base width (iPhone X)
  return Math.max(12, Math.min(size * scale, size * 1.2));
};

function SettingsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const user = useStore((state) => state.user);
  const settings = useStore((state) => state.settings);
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [age, setAge] = useState(user.age?.toString() || '');
  const [gender, setGender] = useState(user.gender || '');
  const [lifeSituation, setLifeSituation] = useState(user.lifeSituation || '');
  const [difficultyPreference, setDifficultyPreference] = useState(user.difficultyPreference || settings.difficultyPreference || 'medium');
  
  // Fitness profile
  const [weight, setWeight] = useState(user.weight?.toString() || '');
  const [height, setHeight] = useState(user.height?.toString() || '');
  const [dailyStepGoal, setDailyStepGoal] = useState(user.dailyStepGoal?.toString() || '10000');
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [ageError, setAgeError] = useState('');
  const [weightError, setWeightError] = useState('');
  const [heightError, setHeightError] = useState('');
  const [goalError, setGoalError] = useState('');

  const handleNameChange = (text) => {
    setName(text);
    setNameError('');
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    setEmailError('');
  };

  const handleAgeChange = (text) => {
    setAge(text);
    setAgeError('');
  };

  const handleSaveProfile = () => {
    // Validate name
    const nameValidation = validateName(name);
    if (!nameValidation.isValid) {
      setNameError(nameValidation.error);
      Alert.alert('Validation Error', nameValidation.error);
      return;
    }

    // Validate email (if provided)
    if (email && email.trim() !== '') {
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        setEmailError(emailValidation.error);
        Alert.alert('Validation Error', emailValidation.error);
        return;
      }
    }

    // Validate age (if provided)
    if (age && age.trim() !== '') {
      const ageValidation = validateAge(age);
      if (!ageValidation.isValid) {
        setAgeError(ageValidation.error);
        Alert.alert('Validation Error', ageValidation.error);
        return;
      }
    }

    // Validate weight (if provided)
    let weightValue = null;
    if (weight && weight.trim() !== '') {
      const weightNum = parseFloat(weight);
      if (isNaN(weightNum) || weightNum <= 0 || weightNum > 300) {
        setWeightError('Weight must be between 1 and 300 kg');
        Alert.alert('Validation Error', 'Weight must be between 1 and 300 kg');
        return;
      }
      weightValue = weightNum;
    }

    // Validate height (if provided)
    let heightValue = null;
    if (height && height.trim() !== '') {
      const heightNum = parseFloat(height);
      if (isNaN(heightNum) || heightNum <= 0 || heightNum > 300) {
        setHeightError('Height must be between 1 and 300 cm');
        Alert.alert('Validation Error', 'Height must be between 1 and 300 cm');
        return;
      }
      heightValue = heightNum;
    }

    // Calculate stride length from height if height is provided
    let strideLength = user.strideLength;
    if (heightValue) {
      strideLength = calculateStrideFromHeight(heightValue);
    }

    // Validate daily step goal
    const goalNum = parseInt(dailyStepGoal, 10);
    if (isNaN(goalNum) || goalNum <= 0 || goalNum > 100000) {
      setGoalError('Daily step goal must be between 1 and 100,000 steps');
      Alert.alert('Validation Error', 'Daily step goal must be between 1 and 100,000 steps');
      return;
    }

    // Save to store (will be persisted automatically)
    userActions.updateUser({
      name: nameValidation.value,
      email: email && email.trim() !== '' ? email.trim() : user.email || '',
      age: age && age.trim() !== '' ? parseInt(age, 10) : user.age || null,
      gender,
      lifeSituation,
      difficultyPreference,
      weight: weightValue,
      height: heightValue,
      strideLength,
      dailyStepGoal: goalNum,
    });
    
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleToggleNotifications = () => {
    settingsActions.toggleNotifications();
  };

  const handleThemeChange = (theme) => {
    settingsActions.setTheme(theme);
  };

  const handleDifficultyChange = (difficulty) => {
    setDifficultyPreference(difficulty);
    userActions.updateUser({ difficultyPreference: difficulty });
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]} 
      contentContainerStyle={styles.content}
    >
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 16, 20) }]}>
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>Settings</Text>
        <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>Manage your account and preferences</Text>
      </View>

      {/* Profile Section */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Profile Information</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={[styles.input, nameError && styles.inputError]}
            placeholder="Enter your name"
            placeholderTextColor={colors.textLight}
            value={name}
            onChangeText={handleNameChange}
          />
          {nameError ? (
            <Text style={styles.errorText}>{nameError}</Text>
          ) : null}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, emailError && styles.inputError]}
            placeholder="Enter your email"
            placeholderTextColor={colors.textLight}
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
        </View>

        <View style={styles.inputGroup}>
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
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gender</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your gender"
            placeholderTextColor={colors.textLight}
            value={gender}
            onChangeText={setGender}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Life Situation</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your life situation"
            placeholderTextColor={colors.textLight}
            value={lifeSituation}
            onChangeText={setLifeSituation}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
          <Text style={styles.saveButtonText}>Save Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Fitness Profile Section */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Fitness Profile</Text>
        <Text style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
          Set your fitness metrics for accurate activity calculations
        </Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={[styles.input, weightError && styles.inputError]}
            placeholder="Enter your weight in kg"
            placeholderTextColor={colors.textLight}
            value={weight}
            onChangeText={(text) => {
              setWeight(text);
              setWeightError('');
            }}
            keyboardType="decimal-pad"
          />
          {weightError ? (
            <Text style={styles.errorText}>{weightError}</Text>
          ) : null}
          <Text style={styles.inputHint}>Used for calories calculation</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Height (cm)</Text>
          <TextInput
            style={[styles.input, heightError && styles.inputError]}
            placeholder="Enter your height in cm"
            placeholderTextColor={colors.textLight}
            value={height}
            onChangeText={(text) => {
              setHeight(text);
              setHeightError('');
            }}
            keyboardType="numeric"
          />
          {heightError ? (
            <Text style={styles.errorText}>{heightError}</Text>
          ) : null}
          <Text style={styles.inputHint}>
            Used to calculate stride length: {height ? `${calculateStrideFromHeight(parseFloat(height) || 175).toFixed(2)} m` : '0.75 m (default)'}
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Daily Step Goal</Text>
          <TextInput
            style={[styles.input, goalError && styles.inputError]}
            placeholder="Enter daily step goal"
            placeholderTextColor={colors.textLight}
            value={dailyStepGoal}
            onChangeText={(text) => {
              setDailyStepGoal(text);
              setGoalError('');
            }}
            keyboardType="numeric"
          />
          {goalError ? (
            <Text style={styles.errorText}>{goalError}</Text>
          ) : null}
          <Text style={styles.inputHint}>Default: 10,000 steps per day</Text>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
          <Text style={styles.saveButtonText}>Save Fitness Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Preferences Section */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Preferences</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Text style={styles.settingDescription}>
              Receive push notifications for challenges
            </Text>
          </View>
          <Switch
            value={settings.notifications}
            onValueChange={handleToggleNotifications}
            trackColor={{ false: colors.borderLight, true: colors.primary }}
            thumbColor={colors.background}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Theme</Text>
          <View style={styles.themeOptions}>
            <TouchableOpacity
              style={[
                styles.themeOption,
                settings.theme === 'light' && styles.themeOptionSelected,
              ]}
              onPress={() => handleThemeChange('light')}
            >
              <Text
                style={[
                  styles.themeOptionText,
                  settings.theme === 'light' && styles.themeOptionTextSelected,
                ]}
              >
                Light
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeOption,
                settings.theme === 'dark' && styles.themeOptionSelected,
              ]}
              onPress={() => handleThemeChange('dark')}
            >
              <Text
                style={[
                  styles.themeOptionText,
                  settings.theme === 'dark' && styles.themeOptionTextSelected,
                ]}
              >
                Dark
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Challenge Difficulty</Text>
          <Text style={styles.settingDescription}>
            Default difficulty for new challenges
          </Text>
          <View style={styles.difficultyOptions}>
            {['easy', 'medium', 'hard'].map((difficulty) => (
              <TouchableOpacity
                key={difficulty}
                style={[
                  styles.difficultyOption,
                  difficultyPreference === difficulty && styles.difficultyOptionSelected,
                ]}
                onPress={() => handleDifficultyChange(difficulty)}
              >
                <Text
                  style={[
                    styles.difficultyOptionText,
                    difficultyPreference === difficulty && styles.difficultyOptionTextSelected,
                  ]}
                >
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* About Section */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>About</Text>
        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>App Version</Text>
          <Text style={styles.aboutValue}>1.0.0</Text>
        </View>
        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>Build Number</Text>
          <Text style={styles.aboutValue}>1</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Math.max(SCREEN_WIDTH * 0.053, 16),
    paddingBottom: 20,
  },
  header: {
    marginBottom: Math.max(SCREEN_WIDTH * 0.08, 24),
    paddingHorizontal: Math.max(SCREEN_WIDTH * 0.053, 16),
  },
  title: {
    fontSize: scaleFontSize(32),
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: scaleFontSize(16),
    lineHeight: scaleFontSize(22),
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: scaleFontSize(20),
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: scaleFontSize(14),
    marginBottom: 20,
    lineHeight: scaleFontSize(20),
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 1,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  inputHint: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
    marginLeft: 4,
    fontStyle: 'italic',
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
  settingItem: {
    marginBottom: 24,
  },
  settingInfo: {
    marginBottom: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textLight,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  themeOption: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.borderLight,
  },
  themeOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  themeOptionText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  themeOptionTextSelected: {
    color: colors.background,
  },
  difficultyOptions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  difficultyOption: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.borderLight,
  },
  difficultyOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  difficultyOptionText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  difficultyOptionTextSelected: {
    color: colors.background,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  aboutLabel: {
    fontSize: 16,
    color: colors.text,
  },
  aboutValue: {
    fontSize: 16,
    color: colors.textLight,
    fontWeight: '600',
  },
});

export default SettingsScreen;
