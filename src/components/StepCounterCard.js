/**
 * Step Counter Card Component
 * Displays step counter with metrics, goal progress, and auto-loading
 */

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useStepCounter } from '../hooks/useStepCounter';
import Card from './Card';
import Button from './Button';
import ProgressRing from './ProgressRing';
import colors from '../assets/colors';
import { formatDistance } from '../utils/activityCalculations';

const { width } = Dimensions.get('window');

const StepCounterCard = ({ style }) => {
  const theme = useTheme();
  
  // Safely get step counter hook with error handling
  let stepCounterData = {
    stepCount: 0,
    isAvailable: false,
    isActive: false,
    isLoading: false,
    error: null,
    hasPermission: false,
    reset: () => {},
  };

  try {
    const hookData = useStepCounter();
    stepCounterData = hookData;
  } catch (error) {
    console.error('Error initializing step counter hook:', error);
    stepCounterData.error = error.message || 'Failed to initialize step counter';
  }

  const {
    stepCount,
    isAvailable,
    isActive,
    isLoading,
    error,
    hasPermission,
    reset,
    calories,
    distance,
    goalProgress,
    motivationalMessage,
    dailyGoal,
    stepsRemaining,
  } = stepCounterData;

  const handleReset = () => {
    Alert.alert(
      'Reset Step Count',
      'Are you sure you want to reset your step count to zero?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            reset();
          },
        },
      ]
    );
  };

  if (!isAvailable) {
    return (
      <Card style={[styles.card, style]}>
        <View style={styles.container}>
          <Icon name="walk" size={32} color={theme.colors.outline} />
          <Text style={[styles.unavailableText, { color: theme.colors.outline }]}>
            Step counter not available on this device
          </Text>
        </View>
      </Card>
    );
  }

  return (
    <Card style={[styles.card, style]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Icon 
              name="walk" 
              size={28} 
              color={isActive ? theme.colors.primary : theme.colors.outline} 
            />
          </View>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Activity Today
            </Text>
            {error && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {error}
              </Text>
            )}
          </View>
        </View>

        {/* Main Step Count */}
        <View style={styles.stepCountContainer}>
          {isLoading && stepCount === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={[styles.loadingText, { color: theme.colors.onSurfaceVariant }]}>
                Loading steps...
              </Text>
            </View>
          ) : (
            <>
              <Text style={[styles.stepCount, { color: theme.colors.primary }]}>
                {stepCount.toLocaleString()}
              </Text>
              <Text style={[styles.stepLabel, { color: theme.colors.onSurfaceVariant }]}>
                steps
              </Text>
            </>
          )}
        </View>

        {/* Metrics Grid */}
        {!isLoading && stepCount >= 0 && (
          <View style={styles.metricsGrid}>
            <View style={[styles.metricBox, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Icon name="fire" size={24} color={theme.colors.error} />
              <Text style={[styles.metricValue, { color: theme.colors.onSurface }]}>
                {calories || 0}
              </Text>
              <Text style={[styles.metricLabel, { color: theme.colors.onSurfaceVariant }]}>
                calories
              </Text>
            </View>
            <View style={[styles.metricBox, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Icon name="map-marker-distance" size={24} color={theme.colors.primary} />
              <Text style={[styles.metricValue, { color: theme.colors.onSurface }]}>
                {distance ? formatDistance(distance) : '0 m'}
              </Text>
              <Text style={[styles.metricLabel, { color: theme.colors.onSurfaceVariant }]}>
                distance
              </Text>
            </View>
          </View>
        )}

        {/* Goal Progress Section */}
        {!isLoading && dailyGoal > 0 && (
          <View style={styles.goalSection}>
            <View style={styles.goalHeader}>
              <Text style={[styles.goalTitle, { color: theme.colors.onSurface }]}>
                Daily Goal: {dailyGoal.toLocaleString()} steps
              </Text>
              <Text style={[styles.goalPercentage, { color: theme.colors.primary }]}>
                {goalProgress?.toFixed(0) || 0}%
              </Text>
            </View>
            <View style={styles.progressContainer}>
              <ProgressRing
                progress={goalProgress || 0}
                size={width * 0.15}
                strokeWidth={8}
                color={theme.colors.primary}
                backgroundColor={theme.colors.surfaceVariant}
              />
              <View style={styles.progressInfo}>
                <Text style={[styles.progressText, { color: theme.colors.onSurface }]}>
                  {stepsRemaining > 0 
                    ? `${stepsRemaining.toLocaleString()} steps to go`
                    : 'Goal achieved! 🎉'}
                </Text>
                {motivationalMessage && (
                  <Text style={[styles.motivationalText, { color: theme.colors.onSurfaceVariant }]}>
                    {motivationalMessage}
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Optional Reset Button - Only show if steps > 0 */}
        {!isLoading && stepCount > 0 && hasPermission && (
          <View style={styles.buttonContainer}>
            <Button
              mode="text"
              onPress={handleReset}
              style={styles.resetButton}
              textColor={theme.colors.error}
              icon="refresh"
            >
              Reset Daily Steps
            </Button>
          </View>
        )}

        {/* Status Indicator - Always show when permission granted */}
        {hasPermission && (
          <View style={styles.statusContainer}>
            <View style={[styles.statusIndicator, { backgroundColor: theme.colors.primary }]} />
            <Text style={[styles.statusText, { color: theme.colors.onSurfaceVariant }]}>
              {isActive ? 'Live tracking active' : 'Tracking ready'}
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
  },
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  stepCountContainer: {
    alignItems: 'center',
    marginVertical: 16,
    minHeight: 80,
    justifyContent: 'center',
  },
  stepCount: {
    fontSize: 48,
    fontWeight: 'bold',
    lineHeight: 56,
  },
  stepLabel: {
    fontSize: 16,
    marginTop: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    fontSize: 14,
    marginTop: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 16,
  },
  metricBox: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 12,
    marginTop: 4,
    textTransform: 'capitalize',
  },
  goalSection: {
    marginVertical: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  goalPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  progressInfo: {
    flex: 1,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  motivationalText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginTop: 16,
  },
  resetButton: {
    marginVertical: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
  },
  unavailableText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default StepCounterCard;
