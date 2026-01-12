/**
 * Challenge Details Screen
 * Full-screen view of challenge with tasks, milestones, progress, and tips
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { Card, Button, ProgressRing, Badge, WeeklyProgressChart, MonthlyTrendChart, AnimatedCounter } from '../components';
import { GRADIENTS } from '../assets/colors';
import useStore from '../state/store';
import { updateChallengeProgress, isTodayTargetMet, isDailyTaskCompleted, getNextMilestone, getReachedMilestones, getProgressValue, getTaskProgress, isActivityTask } from '../utils/challengeProgress';
import { challengeActions } from '../state/actions';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const scaleFontSize = (size) => {
  const scale = SCREEN_WIDTH / 375;
  return Math.max(12, Math.min(size * scale, size * 1.2));
};

function ChallengeDetailsScreen({ route, navigation }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { challengeId } = route.params || {};
  
  const challenges = useStore((state) => state.challenges);
  const activeChallenge = useStore((state) => state.activeChallenge);
  const activityTracking = useStore((state) => state.activityTracking);
  const user = useStore((state) => state.user);
  
  const challenge = challenges.find(c => c.id === challengeId) || activeChallenge;
  const setActiveChallenge = useStore((state) => state.setActiveChallenge);
  
  const [dailyTaskCompletions, setDailyTaskCompletions] = useState({});
  
  // Update challenge progress when activity changes (real-time updates)
  useEffect(() => {
    if (challenge) {
      const today = new Date().toISOString().split('T')[0];
      setDailyTaskCompletions(challenge.dailyTaskCompletions?.[today] || {});
      
      // Auto-update challenge progress when activity tracking changes
      const updatedChallenge = updateChallengeProgress(
        challenge, 
        activityTracking, 
        user.dailyStepGoal
      );
      
      // Check if challenge changed
      const challengeChanged = 
        JSON.stringify(updatedChallenge.dailyCompletions) !== JSON.stringify(challenge.dailyCompletions) ||
        updatedChallenge.progress !== challenge.progress ||
        JSON.stringify(updatedChallenge.milestonesReached) !== JSON.stringify(challenge.milestonesReached);
      
      if (challengeChanged) {
        // Update in store with full updated challenge object
        challengeActions.updateChallengeProgress(
          challenge.id, 
          updatedChallenge.progress, 
          updatedChallenge
        );
        
        // Handle milestone celebrations
        if (updatedChallenge.newMilestones && updatedChallenge.newMilestones.length > 0) {
          updatedChallenge.newMilestones.forEach(milestone => {
            console.log(`🎉 Milestone reached: ${milestone.message}`);
            // TODO: Show milestone celebration animation/notification
          });
        }
        
        // Update active challenge if this is the active one
        if (activeChallenge?.id === challenge.id) {
          setActiveChallenge(updatedChallenge);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    challenge?.id, 
    activityTracking.todaySteps, 
    activityTracking.todayCalories,
    activityTracking.todayDistance,
    user.dailyStepGoal
  ]);

  if (!challenge) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          Challenge not found
        </Text>
      </View>
    );
  }

  // Calculate challenge state (always use latest from updateChallengeProgress)
  // This ensures we're using the most up-to-date challenge with dailyCompletions and dailyBreakdown
  const currentChallenge = updateChallengeProgress(challenge, activityTracking, user.dailyStepGoal);
  const today = new Date().toISOString().split('T')[0];
  const todayMet = isTodayTargetMet(currentChallenge, activityTracking, user.dailyStepGoal);
  const nextMilestone = getNextMilestone(currentChallenge);
  const reachedMilestones = getReachedMilestones(currentChallenge);
  
  // Calculate task completion count (includes both manual and activity tasks)
  const calculateTaskCompletionCount = () => {
    if (!challenge.dailyTasks || challenge.dailyTasks.length === 0) return 0;
    
    let completedCount = 0;
    challenge.dailyTasks.forEach((task, index) => {
      const taskProgress = getTaskProgress(task, challenge, activityTracking, user.dailyStepGoal);
      if (taskProgress !== null) {
        // Activity-based task - check if completed
        if (taskProgress.completed) {
          completedCount++;
        }
      } else {
        // Manual task - check dailyTaskCompletions
        if (dailyTaskCompletions[index] === true) {
          completedCount++;
        }
      }
    });
    
    return completedCount;
  };
  
  const taskCompletionCount = calculateTaskCompletionCount();
  
  // Debug: Log dailyBreakdown for troubleshooting
  if (__DEV__) {
    console.log('ChallengeDetailsScreen - dailyBreakdown:', currentChallenge.progress?.dailyBreakdown?.length || 0, 'days');
    console.log('ChallengeDetailsScreen - progress object:', currentChallenge.progress);
  }

  const handleTaskToggle = (taskIndex) => {
    const today = new Date().toISOString().split('T')[0];
    const newCompletions = {
      ...dailyTaskCompletions,
      [taskIndex]: !dailyTaskCompletions[taskIndex],
    };
    setDailyTaskCompletions(newCompletions);
    
    // Update in store with full challenge object (preserves dailyCompletions, progress, etc.)
    const challengeWithTasks = {
      ...challenge,
      dailyTaskCompletions: {
        ...(challenge.dailyTaskCompletions || {}),
        [today]: newCompletions,
      },
    };
    
    // Recalculate progress with updated task completions
    const challengeWithProgress = updateChallengeProgress(
      challengeWithTasks, 
      activityTracking, 
      user.dailyStepGoal
    );
    
    challengeActions.updateChallengeProgress(
      challenge.id, 
      challengeWithProgress.progress, 
      challengeWithProgress
    );
    
    // Update active challenge if this is the active one
    if (activeChallenge?.id === challenge.id) {
      setActiveChallenge(challengeWithProgress);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return theme.colors.success || '#4CAF50';
      case 'medium':
        return theme.colors.warning || '#FF9800';
      case 'hard':
        return theme.colors.error || '#F44336';
      default:
        return theme.colors.primary;
    }
  };

  const getActivityStatus = () => {
    if (!challenge.activityType) return null;
    
    const { activityType, targetValue } = challenge;
    let currentValue = 0;
    let target = targetValue;
    let unit = '';

    switch (activityType) {
      case 'steps':
        currentValue = activityTracking.todaySteps || 0;
        target = targetValue || 10000;
        unit = 'steps';
        break;
      case 'calories':
        currentValue = activityTracking.todayCalories || 0;
        target = targetValue || 500;
        unit = 'cal';
        break;
      case 'distance':
        currentValue = activityTracking.todayDistance || 0;
        target = targetValue || 5;
        unit = 'km';
        break;
      case 'activeTime':
        currentValue = activityTracking.todayActiveTime || 0;
        target = targetValue || 30;
        unit = 'min';
        break;
      case 'goal':
        currentValue = activityTracking.todaySteps || 0;
        target = user.dailyStepGoal || 10000;
        unit = 'steps';
        break;
      default:
        return null;
    }

    return { currentValue, target, unit, progress: Math.min((currentValue / target) * 100, 100) };
  };

  const activityStatus = getActivityStatus();

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
        style={[styles.header, { paddingTop: Math.max(insets.top + 16, 20) }]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{challenge.title || currentChallenge.title}</Text>
          <Badge
            variant={challenge.difficulty === 'easy' ? 'success' : challenge.difficulty === 'hard' ? 'error' : 'warning'}
            size="small"
            style={styles.difficultyBadge}
          >
            {challenge.difficulty?.toUpperCase()}
          </Badge>
        </View>
      </LinearGradient>

      {/* Progress Section */}
      <Card variant="elevated" style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Progress
          </Text>
          <AnimatedCounter
            value={getProgressValue(currentChallenge.progress) || 0}
            formatter={(val) => `${Math.round(val)}%`}
            duration={1500}
            textStyle={[styles.progressPercentage, { color: theme.colors.primary }]}
          />
        </View>
        <View style={styles.progressRingContainer}>
          <ProgressRing
            progress={getProgressValue(currentChallenge.progress) || 0}
            size={120}
            strokeWidth={12}
            color={theme.colors.primary}
            backgroundColor={theme.colors.surfaceVariant}
          />
          <View style={styles.progressInfo}>
            <Text style={[styles.progressDays, { color: theme.colors.onSurface }]}>
              {currentChallenge.daysRemaining || 0} days left
            </Text>
            <Text style={[styles.progressSubtext, { color: theme.colors.onSurfaceVariant }]}>
              {currentChallenge.duration || 7} day challenge
            </Text>
          </View>
        </View>
      </Card>

      {/* Today's Activity Status */}
      {activityStatus && (
        <Card variant="elevated" style={styles.activityCard}>
          <View style={styles.activityHeader}>
            <Icon name={challenge.icon || 'target'} size={24} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface, marginLeft: 8 }]}>
              Today's Progress
            </Text>
          </View>
          <View style={styles.activityProgress}>
            <View style={styles.activityValues}>
              <Text style={[styles.activityCurrent, { color: theme.colors.primary }]}>
                {Math.round(activityStatus.currentValue).toLocaleString()}
              </Text>
              <Text style={[styles.activityTarget, { color: theme.colors.onSurfaceVariant }]}>
                / {activityStatus.target.toLocaleString()} {activityStatus.unit}
              </Text>
            </View>
            <View style={[styles.activityBar, { backgroundColor: theme.colors.surfaceVariant }]}>
              <View
                style={[
                  styles.activityBarFill,
                  {
                    width: `${activityStatus.progress}%`,
                    backgroundColor: todayMet ? theme.colors.success : theme.colors.primary,
                  },
                ]}
              />
            </View>
            {todayMet && (
              <View style={styles.successBadge}>
                <Icon name="check-circle" size={20} color={theme.colors.success} />
                <Text style={[styles.successText, { color: theme.colors.success }]}>
                  Today's goal achieved! 🎉
                </Text>
              </View>
            )}
          </View>
        </Card>
      )}

      {/* Weekly Progress Chart - Show always if challenge exists */}
      {currentChallenge && (
        <WeeklyProgressChart 
          challenge={currentChallenge}
          style={styles.chartContainer}
          height={220}
          showTitle={true}
          showSummary={true}
        />
      )}

      {/* Monthly Trend Chart - Show if challenge duration >= 14 days */}
      {currentChallenge && currentChallenge.duration >= 14 && (
        <MonthlyTrendChart 
          challenge={currentChallenge}
          style={styles.chartContainer}
          height={220}
          showTitle={true}
        />
      )}

      {/* Daily Tasks */}
      {challenge.dailyTasks && challenge.dailyTasks.length > 0 && (
        <Card variant="elevated" style={styles.tasksCard}>
          <View style={styles.tasksHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Daily Tasks
            </Text>
            <Text style={[styles.tasksCount, { color: theme.colors.onSurfaceVariant }]}>
              {taskCompletionCount} / {challenge.dailyTasks.length} completed
            </Text>
          </View>
          <View style={styles.tasksList}>
            {challenge.dailyTasks.map((task, index) => {
              // Check if this is an activity-based task
              const taskProgress = getTaskProgress(task, challenge, activityTracking, user.dailyStepGoal);
              const isActivityBased = taskProgress !== null;
              const isCompleted = isActivityBased 
                ? taskProgress.completed 
                : (dailyTaskCompletions[index] === true);
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.taskItem,
                    isCompleted && { backgroundColor: theme.colors.surfaceVariant },
                  ]}
                  onPress={() => !isActivityBased && handleTaskToggle(index)}
                  disabled={isActivityBased} // Disable manual toggle for activity tasks
                >
                  <View style={styles.taskContent}>
                    <View style={[
                      styles.taskCheckbox,
                      isCompleted && { backgroundColor: theme.colors.success || '#4CAF50' },
                      !isCompleted && isActivityBased && { backgroundColor: theme.colors.primary },
                    ]}>
                      {isCompleted ? (
                        <Icon name="check-circle" size={20} color="#FFFFFF" />
                      ) : (
                        <View style={styles.taskCheckboxEmpty} />
                      )}
                    </View>
                    <View style={styles.taskTextContainer}>
                      <Text
                        style={[
                          styles.taskText,
                          { color: theme.colors.onSurface },
                          isCompleted && { color: theme.colors.success || '#4CAF50', fontWeight: '600' },
                        ]}
                      >
                        {task}
                      </Text>
                      {isActivityBased && taskProgress && (
                        <View style={styles.taskProgressContainer}>
                          <View style={styles.taskProgressInfo}>
                            <Text style={[styles.taskProgressText, { color: theme.colors.onSurfaceVariant }]}>
                              {Math.round(taskProgress.currentValue).toLocaleString()} / {taskProgress.target.toLocaleString()} {taskProgress.unit}
                            </Text>
                            <Text style={[styles.taskProgressPercent, { color: isCompleted ? (theme.colors.success || '#4CAF50') : theme.colors.primary }]}>
                              {Math.round(taskProgress.progress)}%
                            </Text>
                          </View>
                          <View style={[styles.taskProgressBar, { backgroundColor: theme.colors.surfaceVariant }]}>
                            <View
                              style={[
                                styles.taskProgressBarFill,
                                {
                                  width: `${taskProgress.progress}%`,
                                  backgroundColor: isCompleted 
                                    ? (theme.colors.success || '#4CAF50')
                                    : (taskProgress.progress >= 75 
                                        ? (theme.colors.warning || '#FF9800')
                                        : theme.colors.primary),
                                },
                              ]}
                            />
                          </View>
                          {isCompleted && (
                            <View style={styles.taskCompletedBadge}>
                              <Icon name="check-circle" size={14} color={theme.colors.success || '#4CAF50'} />
                              <Text style={[styles.taskCompletedText, { color: theme.colors.success || '#4CAF50' }]}>
                                Completed! 🎉
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>
      )}

      {/* Milestones */}
      {challenge.milestones && challenge.milestones.length > 0 && (
        <Card variant="elevated" style={styles.milestonesCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Milestones
          </Text>
          <View style={styles.milestonesList}>
            {challenge.milestones.map((milestone, index) => {
              const isReached = reachedMilestones.some(m => m.day === milestone.day);
              const isNext = nextMilestone?.day === milestone.day;
              
              return (
                <View
                  key={index}
                  style={[
                    styles.milestoneItem,
                    isReached && { backgroundColor: theme.colors.surfaceVariant },
                  ]}
                >
                  <View style={[
                    styles.milestoneIcon,
                    isReached && { backgroundColor: theme.colors.primary },
                    isNext && !isReached && { backgroundColor: theme.colors.primaryContainer },
                  ]}>
                    {isReached ? (
                      <Icon name="trophy" size={24} color="#FFFFFF" />
                    ) : (
                      <Text style={[styles.milestoneDay, { color: theme.colors.onSurface }]}>
                        {milestone.day}
                      </Text>
                    )}
                  </View>
                  <View style={styles.milestoneContent}>
                    <Text style={[styles.milestoneMessage, { color: theme.colors.onSurface }]}>
                      {milestone.message}
                    </Text>
                    {milestone.badge && (
                      <Badge
                        variant={milestone.badge === 'gold' ? 'warning' : milestone.badge === 'silver' ? 'default' : 'success'}
                        size="small"
                        style={styles.milestoneBadge}
                      >
                        {milestone.badge.toUpperCase()}
                      </Badge>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </Card>
      )}

      {/* Tips */}
      {challenge.tips && challenge.tips.length > 0 && (
        <Card variant="elevated" style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Icon name="lightbulb-on" size={24} color={theme.colors.warning || '#FF9800'} />
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface, marginLeft: 8 }]}>
              Tips & Motivation
            </Text>
          </View>
          <View style={styles.tipsList}>
            {challenge.tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <Icon name="check-circle" size={16} color={theme.colors.primary} />
                <Text style={[styles.tipText, { color: theme.colors.onSurfaceVariant }]}>
                  {tip}
                </Text>
              </View>
            ))}
          </View>
        </Card>
      )}

      {/* Description */}
      {challenge.description && (
        <Card variant="elevated" style={styles.descriptionCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            About This Challenge
          </Text>
          <Text style={[styles.descriptionText, { color: theme.colors.onSurfaceVariant }]}>
            {challenge.description}
          </Text>
        </Card>
      )}
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
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    marginBottom: 16,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: scaleFontSize(28),
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  difficultyBadge: {
    marginLeft: 12,
  },
  progressCard: {
    margin: 20,
    marginTop: 16,
    padding: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: scaleFontSize(20),
    fontWeight: 'bold',
  },
  progressPercentage: {
    fontSize: scaleFontSize(24),
    fontWeight: 'bold',
  },
  progressRingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressInfo: {
    marginLeft: 20,
  },
  progressDays: {
    fontSize: scaleFontSize(18),
    fontWeight: '600',
    marginBottom: 4,
  },
  progressSubtext: {
    fontSize: scaleFontSize(14),
  },
  activityCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  activityProgress: {
    marginTop: 8,
  },
  activityValues: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  activityCurrent: {
    fontSize: scaleFontSize(32),
    fontWeight: 'bold',
  },
  activityTarget: {
    fontSize: scaleFontSize(18),
    marginLeft: 4,
  },
  activityBar: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  activityBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  successText: {
    fontSize: scaleFontSize(14),
    fontWeight: '600',
    marginLeft: 8,
  },
  chartContainer: {
    marginHorizontal: 20,
    marginVertical: 0,
  },
  tasksCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
  },
  tasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tasksCount: {
    fontSize: scaleFontSize(14),
    fontWeight: '500',
  },
  tasksList: {
    marginTop: 0,
  },
  taskItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  taskCheckbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  taskCheckboxEmpty: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#9E9E9E',
  },
  taskTextContainer: {
    flex: 1,
  },
  taskText: {
    fontSize: scaleFontSize(16),
    fontWeight: '500',
    marginBottom: 4,
  },
  taskProgressContainer: {
    marginTop: 8,
  },
  taskProgressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  taskProgressText: {
    fontSize: scaleFontSize(13),
    fontWeight: '400',
  },
  taskProgressPercent: {
    fontSize: scaleFontSize(13),
    fontWeight: '600',
  },
  taskProgressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  taskProgressBarFill: {
    height: '100%',
    borderRadius: 4,
    minWidth: 2,
  },
  taskCompletedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  taskCompletedText: {
    fontSize: scaleFontSize(12),
    fontWeight: '600',
    marginLeft: 4,
  },
  milestonesCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
  },
  milestonesList: {
    marginTop: 16,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  milestoneIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  milestoneDay: {
    fontSize: scaleFontSize(18),
    fontWeight: 'bold',
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneMessage: {
    fontSize: scaleFontSize(16),
    fontWeight: '600',
    marginBottom: 4,
  },
  milestoneBadge: {
    alignSelf: 'flex-start',
  },
  tipsCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tipsList: {
    marginTop: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipText: {
    fontSize: scaleFontSize(14),
    flex: 1,
    marginLeft: 12,
    lineHeight: scaleFontSize(20),
  },
  descriptionCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
  },
  descriptionText: {
    fontSize: scaleFontSize(14),
    lineHeight: scaleFontSize(22),
    marginTop: 12,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default ChallengeDetailsScreen;
