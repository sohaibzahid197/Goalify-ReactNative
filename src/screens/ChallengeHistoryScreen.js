/**
 * Challenge History Screen
 * Display completed challenges
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import colors from '../assets/colors';
import useStore from '../state/store';

function ChallengeHistoryScreen() {
  const completedChallenges = useStore((state) => state.completedChallenges);

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return colors.success;
      case 'medium':
        return colors.warning;
      case 'hard':
        return colors.error;
      default:
        return colors.textLight;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Challenge History</Text>
        <Text style={styles.subtitle}>
          {completedChallenges.length} challenge{completedChallenges.length !== 1 ? 's' : ''} completed
        </Text>
      </View>

      {completedChallenges.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📋</Text>
          <Text style={styles.emptyTitle}>No completed challenges yet</Text>
          <Text style={styles.emptyText}>
            Complete your first challenge to see it here!
          </Text>
        </View>
      ) : (
        <View style={styles.challengesList}>
          {completedChallenges.map((challenge, index) => (
            <View key={challenge.id || index} style={styles.challengeCard}>
              <View style={styles.challengeHeader}>
                <Text style={styles.challengeTitle}>{challenge.title || 'Challenge'}</Text>
                <View
                  style={[
                    styles.difficultyBadge,
                    { backgroundColor: getDifficultyColor(challenge.difficulty) },
                  ]}
                >
                  <Text style={styles.difficultyText}>
                    {challenge.difficulty?.toUpperCase() || 'N/A'}
                  </Text>
                </View>
              </View>

              {challenge.description && (
                <Text style={styles.challengeDescription} numberOfLines={2}>
                  {challenge.description}
                </Text>
              )}

              <View style={styles.challengeFooter}>
                <View style={styles.challengeMeta}>
                  {challenge.duration && (
                    <Text style={styles.metaText}>
                      {challenge.duration} day{challenge.duration !== 1 ? 's' : ''}
                    </Text>
                  )}
                  {challenge.completedAt && (
                    <Text style={styles.metaText}>
                      • Completed {formatDate(challenge.completedAt)}
                    </Text>
                  )}
                </View>
                <View style={styles.completedBadge}>
                  <Text style={styles.completedText}>✓ Completed</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Stats Summary */}
      {completedChallenges.length > 0 && (
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Achievements</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{completedChallenges.length}</Text>
              <Text style={styles.statLabel}>Total Completed</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>
                {completedChallenges.filter(c => c.difficulty?.toLowerCase() === 'hard').length}
              </Text>
              <Text style={styles.statLabel}>Hard Challenges</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>
                {completedChallenges.reduce((sum, c) => sum + (c.duration || 0), 0)}
              </Text>
              <Text style={styles.statLabel}>Total Days</Text>
            </View>
          </View>
        </View>
      )}
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
  challengesList: {
    gap: 16,
    marginBottom: 20,
  },
  challengeCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
    color: colors.text,
    marginRight: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.background,
  },
  challengeDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  challengeMeta: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaText: {
    fontSize: 12,
    color: colors.textLight,
    marginRight: 8,
  },
  completedBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  completedText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.background,
  },
  statsSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
});

export default ChallengeHistoryScreen;
