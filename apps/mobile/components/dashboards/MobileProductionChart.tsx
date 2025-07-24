import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { BarChart } from 'react-native-gifted-charts';
import { MaterialIcons } from '@expo/vector-icons';

export interface ProductionChartTrendData {
  months: string[];
  planted: number[];
  harvested: number[];
}

export interface MobileProductionChartProps {
  trendData: ProductionChartTrendData;
}

export function MobileProductionChart({
  trendData,
}: MobileProductionChartProps) {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 64; // Account for padding and margins

  // Check if there's no data to display
  const hasNoData =
    !trendData ||
    !trendData.months ||
    trendData.months.length === 0 ||
    (trendData.planted.every(val => val === 0) &&
      trendData.harvested.every(val => val === 0));

  // Combine data for grouped bars
  const combinedData: {
    value: number;
    frontColor: string;
    label?: string;
    spacing: number;
  }[] = [];

  const maxValue = Math.max(...trendData.planted, ...trendData.harvested);

  const availableWidth = chartWidth - 60; // Account for chart margins
  const dataPoints = trendData.months.length;
  const calculatedBarWidth = Math.max(
    Math.floor((availableWidth - dataPoints * 8) / (dataPoints * 2)), // 2 bars per group
    12 // Minimum bar width
  );
  const calculatedSpacing = Math.max(
    Math.floor(availableWidth * 0.03), // 3% of available width for group spacing
    8 // Minimum spacing
  );

  trendData.months.forEach((month, index) => {
    combinedData.push({
      value: trendData.planted[index] || 0,
      frontColor: '#388e3c',
      label: month.includes('-') ? month.substring(5) : month,
      spacing: 2,
    });
    combinedData.push({
      value: trendData.harvested[index] || 0,
      frontColor: '#1976d2',
      spacing: index === trendData.months.length - 1 ? 0 : calculatedSpacing,
    });
  });

  return (
    <Card style={styles.chartCard} mode="outlined">
      <Card.Content style={styles.chartContent}>
        <Text variant="titleMedium" style={styles.chartTitle}>
          Production Trends
        </Text>
        <Text variant="bodyMedium" style={styles.chartSubtitle}>
          Planted vs Harvested Over Time
        </Text>

        {hasNoData ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="bar-chart" size={48} color="#ccc" />
            <Text variant="bodyMedium" style={styles.emptyText}>
              No data to display
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.chartContainer}>
              <BarChart
                data={combinedData}
                width={chartWidth - 60}
                height={220}
                barWidth={calculatedBarWidth}
                spacing={calculatedSpacing}
                yAxisColor="#e0e0e0"
                xAxisColor="#e0e0e0"
                hideRules={false}
                rulesColor="#f0f0f0"
                rulesType="solid"
                yAxisTextStyle={{
                  fontSize: 10,
                  color: '#666',
                }}
                xAxisLabelTextStyle={{
                  fontSize: 10,
                  color: '#666',
                }}
                noOfSections={4}
                maxValue={maxValue * 1.1}
                isAnimated
                animationDuration={1000}
              />
            </View>

            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: '#388e3c' }]}
                />
                <Text variant="bodySmall" style={styles.legendText}>
                  Planted
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: '#1976d2' }]}
                />
                <Text variant="bodySmall" style={styles.legendText}>
                  Harvested
                </Text>
              </View>
            </View>
          </>
        )}
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
    marginBottom: 20,
  },
  topLabel: {
    marginBottom: 4,
  },
  topLabelText: {
    fontSize: 10,
    color: '#333',
    textAlign: 'center',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    color: '#666',
    textAlign: 'center',
  },
});
