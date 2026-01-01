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
import { Card, Button, ProgressRing, Badge } from '../components';
import { GRADIENTS } from '../assets/colors';
import { streakActions, challengeActions } from '../state/actions';
import { autoUpdateStreak } from '../utils/streakManager';
import { updateChallengeProgress } from '../utils/challengeProgress';

function HomeScreen({ navigation }) {
  const theme = useTheme();
  const activeChallenge = useStore((state) => state.activeChallenge);
  const streak = useStore((state) => state.streak);
  const user = useStore((state) => state.user);
  const updateStreak = useStore((state) => state.updateStreak);
  const setActiveChallenge = useStore((state) => state.setActiveChallenge);

  // Auto-update streak and challenge progress on mount
  useEffect(() => {
    // Check and update streak
    const newStreakState = autoUpdateStreak(streak);
    if (newStreakState.shouldUpdate) {
      updateStreak({
        currentStreak: newStreakState.currentStreak,
        longestStreak: newStreakState.longestStreak,
        lastActivityDate: newStreakState.lastActivityDate,
      });
    }

    // Update active challenge progress
    if (activeChallenge) {
      const updatedChallenge = updateChallengeProgress(activeChallenge);
      if (updatedChallenge.progress !== activeChallenge.progress) {
        challengeActions.updateChallengeProgress(activeChallenge.id, updatedChallenge.progress);
        
        // Update active challenge if it changed
        if (updatedChallenge.status === 'completed' && activeChallenge.status !== 'completed') {
          // Challenge completed - move to completed and clear active
          challengeActions.completeChallenge(activeChallenge.id);
        } else if (updatedChallenge.status !== 'completed') {
          setActiveChallenge(updatedChallenge);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

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
        colors={GRADIENTS.headerGradient}
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

        {activeChallenge ? (
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
                  {activeChallenge.progress || 0}% complete
                </Text>
              </View>
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
                      width: `${activeChallenge.progress || 0}%`,
                      backgroundColor: theme.colors.primary
                    }
                  ]}
                />
              </View>
            </View>

            <Button
              variant="primary"
              size="medium"
              icon="arrow-right"
              iconPosition="right"
              fullWidth
              onPress={() => alert('Challenge details coming soon!')}
            >
              View Details
            </Button>
          </Card>
        ) : (
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

