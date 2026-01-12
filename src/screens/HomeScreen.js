/**
 * Home Screen - Daily Challenge
 * Main dashboard showing today's challenge with modern UI
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useStore from '../state/store';
import { Card, Button, ProgressRing, Badge, MiniProgressChart } from '../components';
import StepCounterCard from '../components/StepCounterCard';
import { GRADIENTS } from '../assets/colors';
import { streakActions, challengeActions } from '../state/actions';
import { autoUpdateStreak } from '../utils/streakManager';
import { updateChallengeProgress, isTodayTargetMet, getNextMilestone, getReachedMilestones } from '../utils/challengeProgress';

function HomeScreen({ navigation }) {
  const theme = useTheme();
  const activeChallenge = useStore((state) => state.activeChallenge);
  const streak = useStore((state) => state.streak);
  const user = useStore((state) => state.user);
  const activityTracking = useStore((state) => state.activityTracking);
  const updateStreak = useStore((state) => state.updateStreak);
  const setActiveChallenge = useStore((state) => state.setActiveChallenge);

  // Debug: Log activeChallenge
  React.useEffect(() => {
    console.log('HomeScreen - activeChallenge:', activeChallenge);
    console.log('HomeScreen - challenges:', useStore.getState().challenges);
  }, [activeChallenge]);

  // Auto-update streak and challenge progress on mount and when activity changes
  useEffect(() => {
    // Check and update streak
    try {
      const newStreakState = autoUpdateStreak(streak);
      if (newStreakState.shouldUpdate) {
        updateStreak({
          currentStreak: newStreakState.currentStreak,
          longestStreak: newStreakState.longestStreak,
          lastActivityDate: newStreakState.lastActivityDate,
        });
      }
    } catch (error) {
      console.error('Error updating streak:', error);
    }

    // Update active challenge progress (with activity tracking) - FIXED
    // Now updates whenever activityTracking changes (real-time updates)
    if (activeChallenge) {
      try {
        const updatedChallenge = updateChallengeProgress(activeChallenge, activityTracking, user.dailyStepGoal);
        
        // Check if challenge actually changed (progress, completions, milestones, etc.)
        const challengeChanged = 
          updatedChallenge.progress !== activeChallenge.progress ||
          JSON.stringify(updatedChallenge.dailyCompletions) !== JSON.stringify(activeChallenge.dailyCompletions) ||
          JSON.stringify(updatedChallenge.milestonesReached) !== JSON.stringify(activeChallenge.milestonesReached) ||
          updatedChallenge.status !== activeChallenge.status;

        if (challengeChanged) {
          // Update in store with full updated challenge object (preserves dailyCompletions, milestones, etc.)
          challengeActions.updateChallengeProgress(
            activeChallenge.id, 
            updatedChallenge.progress, 
            updatedChallenge
          );
          
          // Handle milestone celebrations if new milestones reached
          if (updatedChallenge.newMilestones && updatedChallenge.newMilestones.length > 0) {
            updatedChallenge.newMilestones.forEach(milestone => {
              console.log(`🎉 Milestone reached: ${milestone.message}`);
              // TODO: Show celebration animation/notification
            });
          }
          
          // Handle challenge completion
          if (updatedChallenge.status === 'completed' && activeChallenge.status !== 'completed') {
            console.log('🎉 Challenge completed!');
            challengeActions.completeChallenge(activeChallenge.id);
            // TODO: Show celebration animation
          } else if (updatedChallenge.status !== 'completed') {
            // Update active challenge with all changes (including dailyCompletions)
            setActiveChallenge(updatedChallenge);
          }
        }
      } catch (error) {
        console.error('Error updating challenge progress:', error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeChallenge?.id, 
    activityTracking.todaySteps, 
    activityTracking.todayCalories, 
    activityTracking.todayDistance,
    user.dailyStepGoal
  ]); // Watch activity changes for real-time updates

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getDifficultyVariant = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Header with Gradient */}
      <LinearGradient
        colors={GRADIENTS?.headerGradient || ['#06b6d4', '#0891b2', '#0e7490']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>{getGreeting()}! 👋</Text>
          <Text style={styles.userName}>{user?.name || 'Champion'}</Text>
          <Text style={styles.subtitle}>Ready to tackle today's challenge?</Text>
        </View>
      </LinearGradient>

      {/* Streak Card */}
      <Card variant="elevated" style={styles.streakCard}>
        <View style={styles.streakContent}>
          <View style={styles.streakInfo}>
            <Text style={[styles.streakLabel, { color: theme.colors.onSurface }]}>
              Current Streak
            </Text>
            <View style={styles.streakValueContainer}>
              <Text style={[styles.streakValue, { color: theme.colors.primary }]}>
                {streak.currentStreak}
              </Text>
              <Text style={[styles.streakDays, { color: theme.colors.primary }]}>
                days
              </Text>
              <Text style={styles.fireEmoji}>🔥</Text>
            </View>
            <Text style={[styles.streakSubtext, { color: theme.colors.outline }]}>
              Keep it going!
            </Text>
          </View>
          <ProgressRing
            progress={(streak.currentStreak / 30) * 100}
            size={100}
            strokeWidth={8}
            color={theme.colors.primary}
          />
        </View>
      </Card>

      {/* Daily Challenge Section */}
      <View style={styles.challengeSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Today's Challenge
        </Text>

        {activeChallenge ? (() => {
          try {
            // Ensure challenge has required fields
            if (!activeChallenge.id) {
              console.warn('Challenge missing ID:', activeChallenge);
              return null;
            }

            // Safely calculate progress and other values
            let updatedChallenge;
            try {
              updatedChallenge = updateChallengeProgress(activeChallenge, activityTracking, user.dailyStepGoal) || activeChallenge;
            } catch (err) {
              console.error('Error updating challenge progress:', err);
              updatedChallenge = activeChallenge;
            }

            let todayMet = false;
            try {
              todayMet = isTodayTargetMet(activeChallenge, activityTracking, user.dailyStepGoal);
            } catch (err) {
              console.error('Error checking today target:', err);
            }

            let nextMilestone = null;
            try {
              nextMilestone = getNextMilestone(activeChallenge);
            } catch (err) {
              console.error('Error getting next milestone:', err);
            }

            const today = new Date().toISOString().split('T')[0];
            const dailyTaskCompletions = activeChallenge.dailyTaskCompletions?.[today] || {};
            
            return (
              <Card variant="elevated" style={styles.challengeCard}>
              <View style={styles.challengeHeader}>
                <Text style={[styles.challengeTitle, { color: theme.colors.onSurface }]}>
                  {activeChallenge.title}
                </Text>
                <Badge
                  variant={getDifficultyVariant(activeChallenge.difficulty)}
                  size="small"
                >
                  {activeChallenge.difficulty?.toUpperCase()}
                </Badge>
              </View>

              <Text style={[styles.challengeDescription, { color: theme.colors.outline }]}>
                {activeChallenge.description}
              </Text>

              <View style={styles.challengeMeta}>
                <View style={styles.metaItem}>
                  <Icon name="calendar" size={16} color={theme.colors.outline} />
                  <Text style={[styles.metaText, { color: theme.colors.outline }]}>
                    {activeChallenge.duration || 7} days
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Icon name="chart-line" size={16} color={theme.colors.outline} />
                  <Text style={[styles.metaText, { color: theme.colors.outline }]}>
                    {Math.round(updatedChallenge.progress || activeChallenge.progress || 0)}% complete
                  </Text>
                </View>
                {todayMet && (
                  <View style={[styles.metaItem, { backgroundColor: theme.colors.success + '20', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }]}>
                    <Icon name="check-circle" size={16} color={theme.colors.success} />
                    <Text style={[styles.metaText, { color: theme.colors.success, marginLeft: 4 }]}>
                      Today ✓
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    { backgroundColor: theme.colors.surfaceVariant }
                  ]}
                >
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(100, Math.max(0, updatedChallenge.progress || activeChallenge.progress || 0))}%`,
                        backgroundColor: theme.colors.primary
                      }
                    ]}
                  />
                </View>
              </View>

              {/* Daily Tasks Preview */}
              {activeChallenge.dailyTasks && activeChallenge.dailyTasks.length > 0 && (
                <View style={styles.dailyTasksPreview}>
                  <Text style={[styles.tasksTitle, { color: theme.colors.onSurface }]}>
                    Today's Tasks
                  </Text>
                  {activeChallenge.dailyTasks.slice(0, 2).map((task, index) => {
                    const isCompleted = dailyTaskCompletions[index] === true;
                    return (
                      <View key={index} style={styles.taskPreviewItem}>
                        <Icon
                          name={isCompleted ? "check-circle" : "circle-outline"}
                          size={18}
                          color={isCompleted ? theme.colors.success : theme.colors.outline}
                        />
                        <Text
                          style={[
                            styles.taskPreviewText,
                            { color: theme.colors.onSurfaceVariant },
                            isCompleted && { textDecorationLine: 'line-through', opacity: 0.6 }
                          ]}
                        >
                          {task}
                        </Text>
                      </View>
                    );
                  })}
                  {activeChallenge.dailyTasks.length > 2 && (
                    <Text style={[styles.moreTasksText, { color: theme.colors.primary }]}>
                      +{activeChallenge.dailyTasks.length - 2} more tasks
                    </Text>
                  )}
                </View>
              )}

              {/* Next Milestone Preview */}
              {nextMilestone && (
                <View style={styles.milestonePreview}>
                  <Icon name="trophy-outline" size={20} color={theme.colors.warning || '#FF9800'} />
                  <Text style={[styles.milestonePreviewText, { color: theme.colors.onSurfaceVariant }]}>
                    Next: {nextMilestone.message}
                  </Text>
                </View>
              )}

              {/* Mini Weekly Progress Chart - Show always if challenge exists */}
              {updatedChallenge && (
                <MiniProgressChart
                  challenge={updatedChallenge}
                  onPress={() => navigation.navigate('ChallengeDetails', { challengeId: activeChallenge.id })}
                  style={styles.miniChart}
                />
              )}

              <Button
                variant="primary"
                size="medium"
                icon="arrow-right"
                iconPosition="right"
                fullWidth
                onPress={() => navigation.navigate('ChallengeDetails', { challengeId: activeChallenge.id })}
              >
                View Details
              </Button>
            </Card>
            );
          } catch (error) {
            console.error('Error rendering challenge:', error);
            // Fallback: Show challenge even if there's an error
            return (
              <Card variant="elevated" style={styles.challengeCard}>
                <View style={styles.challengeHeader}>
                  <Text style={[styles.challengeTitle, { color: theme.colors.onSurface }]}>
                    {activeChallenge.title || 'Challenge'}
                  </Text>
                  {activeChallenge.difficulty && (
                    <Badge
                      variant={getDifficultyVariant(activeChallenge.difficulty)}
                      size="small"
                    >
                      {activeChallenge.difficulty?.toUpperCase()}
                    </Badge>
                  )}
                </View>
                {activeChallenge.description && (
                  <Text style={[styles.challengeDescription, { color: theme.colors.outline }]}>
                    {activeChallenge.description}
                  </Text>
                )}
                <Button
                  variant="primary"
                  size="medium"
                  icon="arrow-right"
                  iconPosition="right"
                  fullWidth
                  onPress={() => navigation.navigate('ChallengeDetails', { challengeId: activeChallenge.id })}
                >
                  View Details
                </Button>
              </Card>
            );
          }
        })() : (
          <Card variant="outlined" style={styles.emptyChallengeCard}>
            <Icon
              name="target"
              size={64}
              color={theme.colors.outline}
              style={styles.emptyIcon}
            />
            <Text style={[styles.emptyText, { color: theme.colors.onSurface }]}>
              No active challenge
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.colors.outline }]}>
              Create a new challenge to get started!
            </Text>
            <Button
              variant="primary"
              size="medium"
              icon="plus"
              onPress={() => navigation.getParent()?.navigate('ChallengeCreation')}
              style={styles.createButton}
            >
              Create Challenge
            </Button>
          </Card>
        )}
      </View>

      {/* Step Counter Card */}
      <View style={styles.stepCounterSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Activity Tracking
        </Text>
        <StepCounterCard style={styles.stepCounterCard} />
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Card
          variant="flat"
          padding="medium"
          style={[styles.quickActionCard, { borderColor: theme.colors.surfaceVariant }]}
          onPress={() => navigation.navigate('Streak')}
        >
          <Icon name="fire" size={32} color={theme.colors.secondary} />
          <Text style={[styles.quickActionText, { color: theme.colors.onSurface }]}>
            View Streak
          </Text>
        </Card>
        <Card
          variant="flat"
          padding="medium"
          style={[styles.quickActionCard, { borderColor: theme.colors.surfaceVariant }]}
          onPress={() => navigation.navigate('ChallengeHistory')}
        >
          <Icon name="history" size={32} color={theme.colors.tertiary} />
          <Text style={[styles.quickActionText, { color: theme.colors.onSurface }]}>
            History
          </Text>
        </Card>
      </View>
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
    padding: 28,
    paddingTop: 50,
    paddingBottom: 70,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    opacity: 0.95,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 1,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 0.2,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  streakCard: {
    margin: 20,
    marginTop: -60,
    borderRadius: 24,
  },
  streakContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakInfo: {
    flex: 1,
  },
  streakLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  streakValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  streakValue: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  streakDays: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  fireEmoji: {
    fontSize: 32,
    marginLeft: 8,
  },
  streakSubtext: {
    fontSize: 14,
  },
  challengeSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  challengeCard: {
    marginBottom: 16,
  },
  miniChart: {
    marginVertical: 12,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  challengeTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 12,
  },
  challengeDescription: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 24,
  },
  challengeMeta: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  dailyTasksPreview: {
    marginTop: 16,
    marginBottom: 12,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 12,
  },
  tasksTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  taskPreviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  taskPreviewText: {
    fontSize: 14,
    flex: 1,
  },
  moreTasksText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  milestonePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    borderRadius: 12,
    gap: 8,
  },
  milestonePreviewText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  emptyChallengeCard: {
    alignItems: 'center',
    paddingVertical: 48,
    borderRadius: 24,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    minWidth: 200,
  },
  stepCounterSection: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 8,
  },
  stepCounterCard: {
    marginTop: 12,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 24,
    borderRadius: 20,
    borderWidth: 1,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
  },
});

export default HomeScreen;

