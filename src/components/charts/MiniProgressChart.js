/**
 * Mini Progress Chart Component
 * Compact bar chart for HomeScreen preview
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatValue, addOpacityToHex } from '../../utils/chartDataTransform';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const MiniProgressChart = ({ 
  challenge, 
  onPress,
  style,
  height = 120,
}) => {
  const theme = useTheme();
  
  const chartData = useMemo(() => {
    if (!challenge?.progress?.dailyBreakdown) return [];
    
    // Only show last 7 days
    const last7Days = challenge.progress.dailyBreakdown.slice(-7);
    
    const successColor = theme.colors?.success || '#4CAF50';
    const primaryColor = theme.colors?.primary || '#2196F3';
    
    return last7Days.map((day) => {
      const baseColor = day.completed ? successColor : primaryColor;
      return {
        value: (day.value || 0) / 1000, // Convert to K for display
        frontColor: baseColor,
        spacing: 4,
      };
    });
  }, [challenge?.progress?.dailyBreakdown, theme]);
  
  if (!challenge) return null;
  
  // Show empty state if no data yet
  if (chartData.length === 0) {
    return (
      <TouchableOpacity 
        onPress={onPress}
        activeOpacity={0.7}
        style={[
          styles.container,
          { backgroundColor: theme.colors?.surface || '#FFFFFF' },
          style,
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors?.onSurface || '#000000' }]}>
            Weekly View
          </Text>
          <Icon name="chevron-right" size={20} color={theme.colors?.primary || '#2196F3'} />
        </View>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: theme.colors?.onSurfaceVariant || '#757575' }]}>
            Start your challenge to see progress charts! 📊
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
  
  const maxValue = Math.max(...chartData.map(d => d.value || 0), 10) * 1.3;
  
  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.container,
        { backgroundColor: theme.colors?.surface || '#FFFFFF' },
        style,
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors?.onSurface || '#000000' }]}>
          Weekly View
        </Text>
        <Icon name="chevron-right" size={20} color={theme.colors?.primary || '#2196F3'} />
      </View>
      
      <BarChart
        data={chartData}
        width={SCREEN_WIDTH - 64}
        height={height}
        barWidth={Math.max(20, (SCREEN_WIDTH - 100) / 7 - 4)}
        spacing={4}
        roundedTop
        hideRules
        xAxisThickness={0}
        yAxisThickness={0}
        hideYAxisText
        hideAxesAndRules
        isAnimated={true}
        animationDuration={800}
        showGradient={false}
        noOfSections={2}
        maxValue={maxValue}
        backgroundColor={theme.colors?.surface || '#FFFFFF'}
      />
      
      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <Text style={[styles.statLabel, { color: theme.colors?.onSurfaceVariant || '#757575' }]}>
          {formatValue(challenge.progress?.currentValue || 0)} total
        </Text>
        <Text style={[styles.statLabel, { color: theme.colors?.onSurfaceVariant || '#757575' }]}>
          {challenge.progress?.daysCompleted || 0}/{challenge.duration || 7} days
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  emptyText: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default MiniProgressChart;
