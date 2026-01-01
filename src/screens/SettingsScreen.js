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
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [ageError, setAgeError] = useState('');

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

    // Save to store (will be persisted automatically)
    userActions.updateUser({
      name: nameValidation.value,
      email: email && email.trim() !== '' ? email.trim() : user.email || '',
      age: age && age.trim() !== '' ? parseInt(age, 10) : user.age || null,
      gender,
      lifeSituation,
      difficultyPreference,
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
    marginBottom: 20,
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
