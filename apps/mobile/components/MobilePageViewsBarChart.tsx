import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';
import { BarChart } from 'react-native-gifted-charts';

export function MobilePageViewsBarChart() {
  const barData = [
    {
      value: 2234 + 3098 + 4051,
      label: 'Jan',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: '#666' },
      frontColor: '#0d47a1',
    },
    {
      value: 3872 + 4215 + 2275,
      frontColor: '#1976d2',
    },
    {
      value: 2998 + 2384 + 3129,
      frontColor: '#4285f4',
    },
    {
      value: 4125 + 2101 + 4693,
      label: 'Apr',
      frontColor: '#0d47a1',
    },
    {
      value: 3357 + 4752 + 3904,
      frontColor: '#1976d2',
    },
    {
      value: 2789 + 3593 + 2038,
      frontColor: '#4285f4',
    },
    {
      value: 2998 + 2384 + 2275,
      label: 'Jul',
      frontColor: '#0d47a1',
    },
  ];

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>
          Page views and downloads
        </Text>
        <View style={styles.headerRow}>
          <Text variant="headlineMedium" style={styles.mainValue}>
            1.3M
          </Text>
          <Chip
            mode="outlined"
            style={styles.errorChip}
            textStyle={styles.errorText}
          >
            -8%
          </Chip>
        </View>
        <Text variant="bodySmall" style={styles.subtitle}>
          Page views and downloads for the last 6 months
        </Text>

        <View style={styles.chartContainer}>
          <BarChart
            data={barData}
            height={250}
            barWidth={25}
            spacing={15}
            roundedTop
            roundedBottom
            hideRules
            xAxisThickness={0}
            yAxisThickness={0}
            yAxisTextStyle={styles.axisText}
            noOfSections={4}
            maxValue={Math.max(...barData.map(item => item.value)) * 1.1}
            isAnimated
            animationDuration={800}
          />
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#fff',
  },
  title: {
    fontWeight: '600',
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  mainValue: {
    fontWeight: 'bold',
  },
  errorChip: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
  },
  errorText: {
    color: '#f44336',
    fontSize: 12,
  },
  subtitle: {
    color: '#666',
    marginBottom: 16,
  },
  chartContainer: {
    flex: 1,
    marginTop: 8,
    overflow: 'hidden',
    alignItems: 'center',
  },
  axisText: {
    fontSize: 10,
    color: '#666',
  },
});
