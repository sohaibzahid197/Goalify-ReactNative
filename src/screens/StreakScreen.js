/**
 * Streak Screen - Streak Tracker
 * Detailed view of user's streak progress
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import colors from '../assets/colors';
import useStore from '../state/store';

function StreakScreen() {
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Streak</Text>
        <Text style={styles.subtitle}>{getStreakMessage()}</Text>
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
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{streak.longestStreak}</Text>
          <Text style={styles.statLabel}>Longest Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {streak.lastActivityDate
              ? new Date(streak.lastActivityDate).toLocaleDateString()
              : 'Never'}
          </Text>
          <Text style={styles.statLabel}>Last Activity</Text>
        </View>
      </View>

      {/* Progress Section */}
      <View style={styles.progressSection}>
        <Text style={styles.sectionTitle}>Milestones</Text>
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
                  achieved && styles.milestoneItemAchieved,
                  isNext && styles.milestoneItemNext,
                ]}
              >
                <Text
                  style={[
                    styles.milestoneText,
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
        <Text style={styles.sectionTitle}>Keep Your Streak Going</Text>
        <View style={styles.tipsList}>
          <Text style={styles.tipItem}>• Complete at least one challenge daily</Text>
          <Text style={styles.tipItem}>• Set reminders to stay consistent</Text>
          <Text style={styles.tipItem}>• Celebrate small wins along the way</Text>
          <Text style={styles.tipItem}>• Don't break the chain!</Text>
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
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
  progressSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  milestonesList: {
    gap: 12,
  },
  milestoneItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.borderLight,
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
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
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
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
  },
  tipItem: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
    lineHeight: 24,
  },
});

export default StreakScreen;
