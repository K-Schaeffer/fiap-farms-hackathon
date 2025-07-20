import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';
import { LineChart } from 'react-native-gifted-charts';

export type MobileStatCardProps = {
  title: string;
  value: string;
  interval: string;
  trend: 'up' | 'down' | 'neutral';
  data: number[];
};

export function MobileStatCard({
  title,
  value,
  interval,
  trend,
  data,
}: MobileStatCardProps) {
  const trendColors = {
    up: '#4caf50',
    down: '#f44336',
    neutral: '#9e9e9e',
  };

  const trendValues = { up: '+25%', down: '-25%', neutral: '+5%' };

  // Prepare chart data
  const chartData = data.map(value => ({ value }));

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Text variant="labelMedium" style={styles.title}>
          {title}
        </Text>
        <View style={styles.mainContent}>
          <View style={styles.topSection}>
            <View style={styles.valueRow}>
              <Text variant="headlineMedium" style={styles.value}>
                {value}
              </Text>
              <Chip
                compact
                textStyle={[styles.chipText, { color: trendColors[trend] }]}
                style={styles.chip}
              >
                {trendValues[trend]}
              </Chip>
            </View>
            <Text variant="bodySmall" style={styles.interval}>
              {interval}
            </Text>
          </View>
          <View style={styles.chartContainer}>
            <LineChart
              data={chartData}
              height={50}
              spacing={data.length > 25 ? 1.5 : 2}
              initialSpacing={0}
              endSpacing={0}
              color={trendColors[trend]}
              thickness={1.5}
              areaChart
              startFillColor={trendColors[trend]}
              endFillColor={trendColors[trend]}
              startOpacity={0.3}
              endOpacity={0.1}
              hideDataPoints
              hideRules
              hideYAxisText
              hideAxesAndRules
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    height: '100%',
    flex: 1,
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.7,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topSection: {
    marginBottom: 16,
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  value: {
    fontWeight: '600',
  },
  chip: {
    borderRadius: 12,
    height: 34,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  interval: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.6,
  },
  chartContainer: {
    height: 50,
    marginTop: 8,
    alignSelf: 'stretch',
  },
});
