/**
 * Challenge Creation Screen
 * Allows users to create a new challenge
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Input, Button, Card } from '../components';
import { useChallenge } from '../hooks/useChallenge';
import { validateGoal } from '../utils/validation';

function ChallengeCreationScreen({ navigation }) {
  const theme = useTheme();
  const { createChallenge } = useChallenge();
  
  const [goal, setGoal] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [duration, setDuration] = useState(7);
  const [loading, setLoading] = useState(false);
  const [goalError, setGoalError] = useState('');

  const difficulties = [
    { value: 'easy', label: 'Easy', description: 'Perfect for beginners', icon: 'speedometer-slow' },
    { value: 'medium', label: 'Medium', description: 'Balanced challenge', icon: 'speedometer-medium' },
    { value: 'hard', label: 'Hard', description: 'Push your limits', icon: 'speedometer' },
  ];

  const durations = [7, 14, 30];

  const handleGoalChange = (text) => {
    setGoal(text);
    setGoalError('');
  };

  const handleCreateChallenge = async () => {
    // Validate goal
    const validation = validateGoal(goal);
    if (!validation.isValid) {
      setGoalError(validation.error);
      Alert.alert('Validation Error', validation.error);
      return;
    }

    setLoading(true);
    try {
      await createChallenge({
        goal: validation.value,
        difficulty,
        duration,
      });
      
      Alert.alert(
        'Success!',
        'Your challenge has been created!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error creating challenge:', error);
      Alert.alert(
        'Error',
        'Failed to create challenge. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>
          Create Challenge
        </Text>
        <View style={styles.placeholder} />
      </View>

      <Card variant="elevated" style={styles.formCard}>
        {/* Goal Input */}
        <Input
          label="What's your goal?"
          placeholder="e.g., Run 5km daily, Learn Spanish, Read 30 minutes"
          value={goal}
          onChangeText={handleGoalChange}
          leftIcon="target"
          maxLength={100}
          showCounter
          error={goalError}
        />

        {/* Difficulty Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.colors.onSurface }]}>
            Difficulty Level
          </Text>
          <View style={styles.difficultyContainer}>
            {difficulties.map((item) => {
              const isSelected = difficulty === item.value;
              return (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.difficultyButton,
                    isSelected && {
                      backgroundColor: theme.colors.primary,
                      borderColor: theme.colors.primary,
                    },
                    !isSelected && {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.outline,
                    },
                  ]}
                  onPress={() => setDifficulty(item.value)}
                >
                  <Icon
                    name={item.icon}
                    size={24}
                    color={isSelected ? '#FFFFFF' : theme.colors.onSurface}
                  />
                  <Text
                    style={[
                      styles.difficultyLabel,
                      {
                        color: isSelected ? '#FFFFFF' : theme.colors.onSurface,
                        fontWeight: isSelected ? '600' : '400',
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                  <Text
                    style={[
                      styles.difficultyDescription,
                      {
                        color: isSelected ? '#FFFFFF' : theme.colors.outline,
                        opacity: isSelected ? 0.9 : 1,
                      },
                    ]}
                  >
                    {item.description}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Duration Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.colors.onSurface }]}>
            Duration
          </Text>
          <View style={styles.durationContainer}>
            {durations.map((days) => {
              const isSelected = duration === days;
              return (
                <TouchableOpacity
                  key={days}
                  style={[
                    styles.durationButton,
                    isSelected && {
                      backgroundColor: theme.colors.primaryContainer,
                      borderColor: theme.colors.primary,
                    },
                    !isSelected && {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.outline,
                    },
                  ]}
                  onPress={() => setDuration(days)}
                >
                  <Text
                    style={[
                      styles.durationValue,
                      {
                        color: isSelected ? theme.colors.primary : theme.colors.onSurface,
                        fontWeight: isSelected ? 'bold' : '600',
                      },
                    ]}
                  >
                    {days}
                  </Text>
                  <Text
                    style={[
                      styles.durationLabel,
                      {
                        color: isSelected ? theme.colors.primary : theme.colors.outline,
                      },
                    ]}
                  >
                    {days === 1 ? 'day' : 'days'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Create Button */}
        <Button
          variant="primary"
          size="large"
          fullWidth
          onPress={handleCreateChallenge}
          loading={loading}
          disabled={loading || !goal.trim()}
          icon="plus"
          style={styles.createButton}
        >
          Create Challenge
        </Button>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  formCard: {
    margin: 20,
    marginTop: 8,
  },
  section: {
    marginTop: 24,
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  difficultyContainer: {
    gap: 12,
  },
  difficultyButton: {
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
    alignItems: 'center',
  },
  difficultyLabel: {
    fontSize: 18,
    marginTop: 8,
    marginBottom: 4,
  },
  difficultyDescription: {
    fontSize: 12,
  },
  durationContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  durationButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 2,
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  durationValue: {
    fontSize: 32,
  },
  durationLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  createButton: {
    marginTop: 32,
  },
});

export default ChallengeCreationScreen;
