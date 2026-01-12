/**
 * Weekly Progress Chart Component
 * Bar chart showing daily breakdown of challenge progress
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { useTheme } from 'react-native-paper';
import Card from '../Card';
import { 
  transformDailyBreakdownForChart, 
  calculateChartMaxValue,
  calculateBarWidth,
  formatValue,
} from '../../utils/chartDataTransform';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const WeeklyProgressChart = ({ 
  challenge, 
  style,
  height = 220,
  showTitle = true,
  showSummary = true,
}) => {
  const theme = useTheme();
  
  // Transform data for chart
  const chartData = useMemo(() => {
    if (!challenge?.progress?.dailyBreakdown || challenge.progress.dailyBreakdown.length === 0) {
      if (__DEV__) {
        console.log('WeeklyProgressChart - No dailyBreakdown data available');
      }
      return [];
    }
    
    if (__DEV__) {
      console.log('WeeklyProgressChart - Processing', challenge.progress.dailyBreakdown.length, 'days of data');
    }
    
    return transformDailyBreakdownForChart(
      challenge.progress.dailyBreakdown,
      theme
    );
  }, [challenge?.progress?.dailyBreakdown, theme]);
  
  // Calculate max value for Y-axis
  const maxValue = useMemo(() => {
    return calculateChartMaxValue(chartData, 0.2); // 20% padding
  }, [chartData]);
  
  // Calculate bar width based on screen width
  const barWidth = useMemo(() => {
    const numberOfBars = Math.max(chartData.length, 7);
    return calculateBarWidth(numberOfBars, SCREEN_WIDTH, 8, 64);
  }, [chartData.length]);
  
  if (!challenge) {
    return (
      <Card variant="elevated" style={[styles.container, style]}>
        <Text style={[styles.emptyText, { color: theme.colors?.onSurfaceVariant || '#757575' }]}>
          No challenge data available
        </Text>
      </Card>
    );
  }

  // Show chart even with empty data (will show empty bars)
  if (chartData.length === 0) {
    return (
      <Card variant="elevated" style={[styles.container, style]}>
        {showTitle && (
          <Text style={[styles.title, { color: theme.colors?.onSurface || '#000000' }]}>
            Weekly Progress
          </Text>
        )}
        <Text style={[styles.emptyText, { color: theme.colors?.onSurfaceVariant || '#757575', marginTop: 16 }]}>
          Start your challenge to see progress! 📊
        </Text>
        <Text style={[styles.emptySubtext, { color: theme.colors?.onSurfaceVariant || '#757575' }]}>
          Activity data will appear here as you complete daily goals.
        </Text>
      </Card>
    );
  }
  
  const progress = challenge.progress || {};
  
  return (
    <Card variant="elevated" style={[styles.container, style]}>
      {showTitle && (
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors?.onSurface || '#000000' }]}>
            Weekly Progress
          </Text>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: theme.colors?.success || '#4CAF50' }]} />
              <Text style={[styles.legendText, { color: theme.colors?.onSurfaceVariant || '#757575' }]}>
                Completed
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: theme.colors?.primary || '#2196F3' }]} />
              <Text style={[styles.legendText, { color: theme.colors?.onSurfaceVariant || '#757575' }]}>
                In Progress
              </Text>
            </View>
          </View>
        </View>
      )}
      
      <BarChart
        data={chartData}
        width={SCREEN_WIDTH - 64}
        height={height}
        barWidth={barWidth}
        spacing={8}
        roundedTop
        roundedBottom
        hideRules={false}
        rulesType="solid"
        rulesColor={theme.colors?.surfaceVariant || '#E0E0E0'}
        rulesThickness={1}
        xAxisThickness={0}
        yAxisThickness={0}
        yAxisTextStyle={{
          color: theme.colors?.onSurfaceVariant || '#757575',
          fontSize: 10,
        }}
        xAxisLabelTextStyle={{
          color: theme.colors?.onSurfaceVariant || '#757575',
          fontSize: 10,
          fontWeight: '500',
        }}
        maxValue={maxValue}
        noOfSections={4}
        yAxisLabelSuffix={challenge.activityType === 'steps' ? 'K' : ''}
        isAnimated={true}
        animationDuration={1200}
        showGradient={false}
        backgroundColor={theme.colors?.surface || '#FFFFFF'}
        onPress={(item, index) => {
          // Handle bar press
          console.log('Bar pressed:', item, index);
        }}
        showReferenceLine1={false}
        showReferenceLine2={false}
        showReferenceLine3={false}
      />
      
      {/* Summary Stats */}
      {showSummary && progress && (
        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: theme.colors?.onSurfaceVariant || '#757575' }]}>
              Total
            </Text>
            <Text style={[styles.summaryValue, { color: theme.colors?.onSurface || '#000000' }]}>
              {formatValue(progress.currentValue || 0, challenge.activityType)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: theme.colors?.onSurfaceVariant || '#757575' }]}>
              Avg/Day
            </Text>
            <Text style={[styles.summaryValue, { color: theme.colors?.onSurface || '#000000' }]}>
              {formatValue(Math.round(progress.averageDaily || 0), challenge.activityType)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: theme.colors?.onSurfaceVariant || '#757575' }]}>
              Best Day
            </Text>
            <Text style={[styles.summaryValue, { color: theme.colors?.success || '#4CAF50' }]}>
              {formatValue(progress.bestDay?.value || 0, challenge.activityType)}
            </Text>
          </View>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  legend: {
    flexDirection: 'row',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 10,
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    fontSize: 12,
    opacity: 0.7,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 10,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WeeklyProgressChart;
