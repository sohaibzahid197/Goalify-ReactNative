/**
 * Challenge History Screen
 * Display completed challenges
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
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

function ChallengeHistoryScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
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
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]} 
      contentContainerStyle={styles.content}
    >
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 16, 20) }]}>
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>Challenge History</Text>
        <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          {completedChallenges.length} challenge{completedChallenges.length !== 1 ? 's' : ''} completed
        </Text>
      </View>

      {completedChallenges.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📋</Text>
          <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>No completed challenges yet</Text>
          <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
            Complete your first challenge to see it here!
          </Text>
        </View>
      ) : (
        <View style={styles.challengesList}>
          {completedChallenges.map((challenge, index) => (
            <View key={challenge.id || index} style={[styles.challengeCard, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.challengeHeader}>
                <Text style={[styles.challengeTitle, { color: theme.colors.onSurface }]}>{challenge.title || 'Challenge'}</Text>
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
                <Text style={[styles.challengeDescription, { color: theme.colors.onSurfaceVariant }]} numberOfLines={2}>
                  {challenge.description}
                </Text>
              )}

              <View style={styles.challengeFooter}>
                <View style={styles.challengeMeta}>
                  {challenge.duration && (
                    <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}>
                      {challenge.duration} day{challenge.duration !== 1 ? 's' : ''}
                    </Text>
                  )}
                  {challenge.completedAt && (
                    <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}>
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
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Your Achievements</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statBox, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.statNumber, { color: theme.colors.primary }]}>{completedChallenges.length}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>Total Completed</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
                {completedChallenges.filter(c => c.difficulty?.toLowerCase() === 'hard').length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>Hard Challenges</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
                {completedChallenges.reduce((sum, c) => sum + (c.duration || 0), 0)}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>Total Days</Text>
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
    fontSize: scaleFontSize(20),
    fontWeight: '600',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: scaleFontSize(16),
    textAlign: 'center',
  },
  challengesList: {
    gap: 16,
    marginBottom: 20,
  },
  challengeCard: {
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
    fontSize: scaleFontSize(20),
    fontWeight: 'bold',
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
    fontSize: scaleFontSize(14),
    marginBottom: 16,
    lineHeight: scaleFontSize(20),
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
    fontSize: scaleFontSize(12),
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
    fontSize: scaleFontSize(20),
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: scaleFontSize(24),
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: scaleFontSize(12),
    textAlign: 'center',
  },
});

export default ChallengeHistoryScreen;
