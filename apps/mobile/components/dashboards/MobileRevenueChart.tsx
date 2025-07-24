import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { LineChart } from 'react-native-gifted-charts';

export interface ChartTrendData {
  months: string[];
  revenue: number[];
  liquidRevenue: number[];
}

export interface MobileRevenueChartProps {
  trendData: ChartTrendData;
}

export function MobileRevenueChart({ trendData }: MobileRevenueChartProps) {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 64; // Account for padding and margins

  // Transform data for react-native-gifted-charts
  const lineData = trendData.months.map((month, index) => ({
    value: trendData.revenue[index] || 0,
    label: month.includes('-') ? month.substring(5) : month, // Handle both YYYY-MM and short formats
    labelTextStyle: {
      fontSize: 10,
      color: '#666',
    },
  }));

  const lineData2 = trendData.months.map((month, index) => ({
    value: trendData.liquidRevenue[index] || 0,
  }));

  const maxValue = Math.max(...trendData.revenue, ...trendData.liquidRevenue);

  // Dynamic spacing calculation to maximize available space
  const availableWidth = chartWidth - 60; // Maximum space utilization
  const dataPoints = trendData.months.length;
  const calculatedSpacing = Math.max(
    Math.floor(availableWidth / Math.max(1, dataPoints - 1)),
    20 // Minimum spacing for readability
  );
  const calculatedInitialSpacing = Math.max(
    Math.floor(availableWidth * 0.02), // Minimal initial spacing (2%)
    8 // Very small initial spacing
  );
  const calculatedEndSpacing = Math.max(
    Math.floor(availableWidth * 0.005), // Ultra-minimal end spacing (0.5%)
    2 // Absolute minimal end spacing
  );

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  return (
    <Card style={styles.chartCard} mode="outlined">
      <Card.Content style={styles.chartContent}>
        <Text variant="titleMedium" style={styles.chartTitle}>
          Revenue Trends
        </Text>
        <Text variant="bodyMedium" style={styles.chartSubtitle}>
          Total vs Liquid Revenue Over Time
        </Text>

        <View style={styles.chartContainer}>
          <LineChart
            data={lineData}
            data2={lineData2}
            width={chartWidth - 20}
            height={220}
            spacing={calculatedSpacing}
            initialSpacing={calculatedInitialSpacing}
            endSpacing={calculatedEndSpacing}
            color1="#2e7d32"
            color2="#1976d2"
            thickness1={3}
            thickness2={3}
            startFillColor1="rgba(46, 125, 50, 0.3)"
            startFillColor2="rgba(25, 118, 210, 0.3)"
            endFillColor1="rgba(46, 125, 50, 0.1)"
            endFillColor2="rgba(25, 118, 210, 0.1)"
            areaChart
            curved
            animateOnDataChange
            animationDuration={1000}
            hideDataPoints={false}
            dataPointsColor1="#2e7d32"
            dataPointsColor2="#1976d2"
            dataPointsRadius={4}
            yAxisColor="#e0e0e0"
            xAxisColor="#e0e0e0"
            hideRules={false}
            rulesColor="#f0f0f0"
            rulesType="solid"
            yAxisTextStyle={{
              fontSize: 10,
              color: '#666',
            }}
            formatYLabel={(value: string) => {
              const numValue = parseFloat(value);
              return formatCurrency(numValue);
            }}
            noOfSections={4}
            maxValue={maxValue * 1.1}
            showVerticalLines={false}
            stepValue={maxValue / 4}
          />
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#2e7d32' }]} />
            <Text variant="bodySmall" style={styles.legendText}>
              Total Revenue
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#1976d2' }]} />
            <Text variant="bodySmall" style={styles.legendText}>
              Liquid Revenue
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  chartCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  chartContent: {
    padding: 20,
  },
  chartTitle: {
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  chartSubtitle: {
    color: '#666',
    marginBottom: 20,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    color: '#666',
  },
});
