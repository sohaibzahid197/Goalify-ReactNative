/**
 * Settings Screen
 * Update user info and preferences
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch } from 'react-native';
import colors from '../assets/colors';
import useStore from '../state/store';
import { userActions, settingsActions } from '../state/actions';

function SettingsScreen() {
  const user = useStore((state) => state.user);
  const settings = useStore((state) => state.settings);
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [age, setAge] = useState(user.age?.toString() || '');
  const [gender, setGender] = useState(user.gender || '');
  const [lifeSituation, setLifeSituation] = useState(user.lifeSituation || '');
  const [difficultyPreference, setDifficultyPreference] = useState(user.difficultyPreference || settings.difficultyPreference || 'medium');

  const handleSaveProfile = () => {
    userActions.updateUser({
      name,
      email,
      age: age ? parseInt(age) : null,
      gender,
      lifeSituation,
      difficultyPreference,
    });
    alert('Profile updated successfully!');
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your account and preferences</Text>
      </View>

      {/* Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Information</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor={colors.textLight}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={colors.textLight}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your age"
            placeholderTextColor={colors.textLight}
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            maxLength={3}
          />
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
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

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
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
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
    backgroundColor: colors.backgroundLight,
  },
  content: {
    padding: 20,
  },
  header: {
    marginTop: 10,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
  },
  section: {
    backgroundColor: colors.card,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
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
