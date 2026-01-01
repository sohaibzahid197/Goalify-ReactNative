/**
 * Streak Screen - Streak Tracker
 * Detailed view of user's streak progress
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../assets/colors';
import useStore from '../state/store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Responsive font size function
const scaleFontSize = (size) => {
  const scale = SCREEN_WIDTH / 375; // Base width (iPhone X)
  return Math.max(12, Math.min(size * scale, size * 1.2));
};

function StreakScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const streak = useStore((state) => state.streak);

  const getStreakMessage = () => {
    if (streak.currentStreak === 0) {
      return "Start your streak today!";
    } else if (streak.currentStreak < 7) {
      return "You're building momentum!";
    } else if (streak.currentStreak < 30) {
      return "You're on fire! 🔥";
    } else if (streak.currentStreak < 100) {
      return "Incredible dedication! 💪";
    } else {
      return "You're a legend! 🌟";
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]} 
      contentContainerStyle={styles.content}
    >
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 16, 20) }]}>
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>Your Streak</Text>
        <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>{getStreakMessage()}</Text>
      </View>

      {/* Current Streak Display */}
      <View style={styles.streakDisplay}>
        <View style={styles.streakCircle}>
          <Text style={styles.streakNumber}>{streak.currentStreak}</Text>
          <Text style={styles.streakLabel}>Days</Text>
        </View>
        <Text style={styles.streakEmoji}>
          {streak.currentStreak > 0 ? '🔥' : '💪'}
        </Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.statValue, { color: theme.colors.primary }]}>{streak.longestStreak}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>Longest Streak</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.statValue, { color: theme.colors.primary }]}>
            {streak.lastActivityDate
              ? new Date(streak.lastActivityDate).toLocaleDateString()
              : 'Never'}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>Last Activity</Text>
        </View>
      </View>

      {/* Progress Section */}
      <View style={styles.progressSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Milestones</Text>
        <View style={styles.milestonesList}>
          {[7, 30, 60, 100, 365].map((milestone) => {
            const achieved = streak.currentStreak >= milestone;
            const isNext = streak.currentStreak < milestone &&
              (milestone === 7 || streak.currentStreak >= [7, 30, 60, 100, 365].find(m => m > streak.currentStreak) - 1);
            
            return (
              <View
                key={milestone}
                style={[
                  styles.milestoneItem,
                  { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
                  achieved && styles.milestoneItemAchieved,
                  isNext && { borderColor: theme.colors.primary },
                ]}
              >
                <Text
                  style={[
                    styles.milestoneText,
                    { color: theme.colors.onSurface },
                    achieved && styles.milestoneTextAchieved,
                  ]}
                >
                  {achieved ? '✓' : '○'} {milestone} Days
                </Text>
                {achieved && (
                  <Text style={styles.milestoneBadge}>Achieved!</Text>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* Tips Section */}
      <View style={styles.tipsSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Keep Your Streak Going</Text>
        <View style={[styles.tipsList, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.tipItem, { color: theme.colors.onSurface }]}>• Complete at least one challenge daily</Text>
          <Text style={[styles.tipItem, { color: theme.colors.onSurface }]}>• Set reminders to stay consistent</Text>
          <Text style={[styles.tipItem, { color: theme.colors.onSurface }]}>• Celebrate small wins along the way</Text>
          <Text style={[styles.tipItem, { color: theme.colors.onSurface }]}>• Don't break the chain!</Text>
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
  streakDisplay: {
    alignItems: 'center',
    marginBottom: 40,
  },
  streakCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  streakNumber: {
    fontSize: 64,
    fontWeight: 'bold',
    color: colors.background,
  },
  streakLabel: {
    fontSize: 18,
    color: colors.background,
    opacity: 0.9,
  },
  streakEmoji: {
    fontSize: 48,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: Math.max(SCREEN_WIDTH * 0.053, 16),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statValue: {
    fontSize: scaleFontSize(24),
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: scaleFontSize(14),
    textAlign: 'center',
  },
  progressSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: scaleFontSize(20),
    fontWeight: 'bold',
    marginBottom: 16,
  },
  milestonesList: {
    gap: 12,
  },
  milestoneItem: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
  },
  milestoneItemAchieved: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  milestoneItemNext: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  milestoneText: {
    fontSize: scaleFontSize(16),
    fontWeight: '600',
  },
  milestoneTextAchieved: {
    color: colors.background,
  },
  milestoneBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.background,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tipsSection: {
    marginBottom: 20,
  },
  tipsList: {
    borderRadius: 12,
    padding: 20,
  },
  tipItem: {
    fontSize: scaleFontSize(16),
    marginBottom: 12,
    lineHeight: scaleFontSize(24),
  },
});

export default StreakScreen;
