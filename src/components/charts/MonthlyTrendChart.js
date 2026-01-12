/**
 * Monthly Trend Chart Component
 * Line chart showing activity trend over time
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useTheme } from 'react-native-paper';
import Card from '../Card';
import { 
  transformDataForLineChart, 
  calculateChartMaxValue,
  getTrendColor,
  getTrendIcon,
  addOpacityToHex,
} from '../../utils/chartDataTransform';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const MonthlyTrendChart = ({ 
  challenge, 
  style,
  height = 220,
  showTitle = true,
}) => {
  const theme = useTheme();
  
  const chartData = useMemo(() => {
    if (!challenge?.progress?.dailyBreakdown) return [];
    
    return transformDataForLineChart(
      challenge.progress.dailyBreakdown,
      theme
    );
  }, [challenge?.progress?.dailyBreakdown, theme]);
  
  const maxValue = useMemo(() => {
    return calculateChartMaxValue(chartData, 0.2);
  }, [chartData]);
  
  const progress = challenge.progress || {};
  const trend = progress.weeklyTrend || 'stable';
  const trendColor = getTrendColor(trend, theme);
  const trendIcon = getTrendIcon(trend);
  
  if (!challenge || chartData.length === 0) {
    return (
      <Card variant="elevated" style={[styles.container, style]}>
        <Text style={[styles.emptyText, { color: theme.colors?.onSurfaceVariant || '#757575' }]}>
          No trend data available yet
        </Text>
      </Card>
    );
  }
  
  return (
    <Card variant="elevated" style={[styles.container, style]}>
      {showTitle && (
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors?.onSurface || '#000000' }]}>
            Activity Trend
          </Text>
          {progress.weeklyTrend && (
            <View style={[styles.trendBadge, { backgroundColor: addOpacityToHex(trendColor, 32) || '#F5F5F5' }]}>
              <Text style={[styles.trendText, { color: trendColor || '#FF9800' }]}>
                {trendIcon} {trend}
              </Text>
            </View>
          )}
        </View>
      )}
      
      <LineChart
        data={chartData}
        width={SCREEN_WIDTH - 64}
        height={height}
        spacing={Math.max(20, (SCREEN_WIDTH - 64) / Math.max(chartData.length, 1))}
        thickness={3}
        color={theme.colors?.primary || '#2196F3'}
        curved={true}
        backgroundColor={theme.colors?.surface || '#FFFFFF'}
        rulesType="solid"
        rulesColor={theme.colors?.surfaceVariant || '#E0E0E0'}
        rulesThickness={1}
        yAxisTextStyle={{
          color: theme.colors?.onSurfaceVariant || '#757575',
          fontSize: 10,
        }}
        xAxisLabelTextStyle={{
          color: theme.colors?.onSurfaceVariant || '#757575',
          fontSize: 10,
        }}
        maxValue={maxValue}
        noOfSections={4}
        yAxisLabelSuffix={challenge.activityType === 'steps' ? 'K' : ''}
        hideYAxisText={false}
        areaChart={false}
        isAnimated={true}
        animationDuration={1500}
        animateOnDataChange={true}
        onDataChangeAnimationDuration={800}
        initialSpacing={0}
        endSpacing={0}
        pointerConfig={{
          pointer1Color: theme.colors?.primary || '#2196F3',
          pointerStripUptoDataPoint: true,
          pointerStripColor: theme.colors?.primary || '#2196F3',
          pointerStripWidth: 2,
          activatePointersOnLongPress: true,
          activatePointersDelay: 100,
          hidePointer1: false,
          pointer1Radius: 6,
          pointer1Width: 3,
        }}
        hideRules={false}
        dataPointsColor={theme.colors?.primary || '#2196F3'}
        dataPointsRadius={4}
        textShiftY={-10}
        textShiftX={-5}
        textFontSize={9}
        textColor={theme.colors?.onSurface || '#000000'}
      />
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
  trendBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 14,
  },
});

export default MonthlyTrendChart;
