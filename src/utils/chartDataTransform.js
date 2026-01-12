/**
 * Chart Data Transformation Utilities
 * Transforms challenge data into formats suitable for chart libraries
 */

import { Text } from 'react-native';

/**
 * Convert hex color to hex with opacity (for LinearGradient compatibility)
 */
export const addOpacityToHex = (hexColor, opacity = 128) => {
  if (!hexColor || typeof hexColor !== 'string') {
    return '#000000'; // Default black if invalid
  }
  
  // Remove # if present
  const cleanHex = hexColor.replace('#', '');
  
  // Ensure valid hex color (6 characters)
  if (cleanHex.length !== 6 || !/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
    return hexColor; // Return original if invalid format
  }
  
  // Convert opacity (0-255) to hex
  const opacityHex = Math.max(0, Math.min(255, Math.round(opacity))).toString(16).padStart(2, '0');
  
  return `#${cleanHex}${opacityHex}`;
};

/**
 * Get safe color value (ensure it's never null/undefined)
 */
const getSafeColor = (color, fallback = '#2196F3') => {
  if (!color || typeof color !== 'string') {
    return fallback;
  }
  return color;
};

/**
 * Transform daily breakdown data for Gifted Charts Bar Chart
 */

export const transformDailyBreakdownForChart = (dailyBreakdown, theme) => {
  if (!dailyBreakdown || dailyBreakdown.length === 0) return [];
  
  // Get safe color values with fallbacks
  const successColor = getSafeColor(theme.colors?.success, '#4CAF50');
  const primaryColor = getSafeColor(theme.colors?.primary, '#2196F3');
  const surfaceVariantColor = getSafeColor(theme.colors?.onSurfaceVariant, '#757575');
  const surfaceColor = getSafeColor(theme.colors?.onSurface, '#000000');
  
  return dailyBreakdown.map((day, index) => {
    const date = new Date(day.date);
    const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
    
    const baseColor = day.completed ? successColor : primaryColor;
    
    return {
      value: day.value || 0,
      label: dayLabel,
      labelWidth: 40,
      labelTextStyle: {
        color: surfaceVariantColor,
        fontSize: 10,
        fontWeight: '500',
      },
      frontColor: baseColor,
      spacing: 8,
      topLabelComponent: () => {
        if (!day.value || day.value === 0) return null;
        return (
          <Text style={{
            color: surfaceColor,
            fontSize: 9,
            fontWeight: '600',
            marginBottom: 4,
          }}>
            {formatValue(day.value)}
          </Text>
        );
      },
      topLabelContainerStyle: {
        height: 20,
      },
    };
  });
};

/**
 * Transform data for line chart (trend visualization)
 */
export const transformDataForLineChart = (dailyBreakdown, theme) => {
  if (!dailyBreakdown || dailyBreakdown.length === 0) return [];
  
  const surfaceVariantColor = getSafeColor(theme?.colors?.onSurfaceVariant, '#757575');
  
  return dailyBreakdown.map((day, index) => {
    const date = new Date(day.date);
    const dayNumber = date.getDate();
    
    return {
      value: day.value || 0,
      label: dayNumber.toString(),
      labelTextStyle: {
        color: surfaceVariantColor,
        fontSize: 10,
      },
    };
  });
};

/**
 * Calculate chart max value with padding
 */
export const calculateChartMaxValue = (data, paddingPercent = 0.2) => {
  if (!data || data.length === 0) return 1000;
  
  const maxValue = Math.max(...data.map(d => d.value || 0));
  if (maxValue === 0) return 1000;
  
  return Math.ceil(maxValue * (1 + paddingPercent));
};

/**
 * Format value for display (e.g., 7500 -> "7.5K")
 */
export const formatValue = (value, type = 'steps') => {
  if (value >= 1000) {
    const thousands = value / 1000;
    // Show 1 decimal if less than 10K, no decimal if 10K or more
    if (thousands < 10) {
      return thousands.toFixed(1) + 'K';
    }
    return Math.round(thousands) + 'K';
  }
  return Math.round(value).toString();
};

/**
 * Prepare comparison chart data (current vs previous)
 */
export const prepareComparisonData = (currentWeek, previousWeek, theme) => {
  if (!currentWeek || currentWeek.length === 0) {
    return { current: [], previous: [] };
  }
  
  const current = transformDailyBreakdownForChart(currentWeek, theme);
  
  let previous = [];
  if (previousWeek && previousWeek.length > 0) {
    const outlineColor = getSafeColor(theme?.colors?.outline, '#9E9E9E');
    previous = transformDailyBreakdownForChart(previousWeek, theme).map(item => ({
      ...item,
      frontColor: outlineColor, // Use solid color for comparison
    }));
  }
  
  return { current, previous };
};

/**
 * Calculate trend from daily breakdown
 */
export const calculateTrend = (dailyBreakdown) => {
  if (!dailyBreakdown || dailyBreakdown.length < 3) return 'stable';
  
  const values = dailyBreakdown.map(d => d.value || 0);
  const midPoint = Math.floor(values.length / 2);
  
  const firstHalf = values.slice(0, midPoint);
  const secondHalf = values.slice(midPoint);
  
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  if (firstAvg === 0) return 'stable';
  
  const improvement = ((secondAvg - firstAvg) / firstAvg) * 100;
  
  if (improvement > 10) return 'improving';
  if (improvement < -10) return 'declining';
  return 'stable';
};

/**
 * Get trend color based on trend type
 */
export const getTrendColor = (trend, theme) => {
  const success = theme?.colors?.success || '#4CAF50';
  const error = theme?.colors?.error || '#F44336';
  const warning = theme?.colors?.warning || '#FF9800';
  
  switch (trend) {
    case 'improving':
      return success;
    case 'declining':
      return error;
    default:
      return warning;
  }
};

/**
 * Get trend icon based on trend type
 */
export const getTrendIcon = (trend) => {
  switch (trend) {
    case 'improving':
      return '📈';
    case 'declining':
      return '📉';
    default:
      return '→';
  }
};

/**
 * Calculate bar width based on number of bars and screen width
 */
export const calculateBarWidth = (numberOfBars, screenWidth, spacing = 8, padding = 64) => {
  const availableWidth = screenWidth - padding;
  const totalSpacing = spacing * (numberOfBars - 1);
  const barWidth = (availableWidth - totalSpacing) / numberOfBars;
  return Math.max(25, Math.min(barWidth, 50)); // Min 25px, Max 50px
};

export default {
  transformDailyBreakdownForChart,
  transformDataForLineChart,
  calculateChartMaxValue,
  formatValue,
  prepareComparisonData,
  calculateTrend,
  getTrendColor,
  getTrendIcon,
  addOpacityToHex,
  calculateBarWidth,
};
