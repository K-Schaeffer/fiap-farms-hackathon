import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';
import { LineChart } from 'react-native-gifted-charts';

function getDaysInMonth(month: number, year: number) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString('en-US', {
    month: 'short',
  });
  const daysInMonth = date.getDate();
  const days = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
}

export function MobileSessionsChart() {
  const xAxisLabels = getDaysInMonth(4, 2024);

  // Data for the three series (Direct, Referral, Organic)
  const directData = [
    300, 900, 600, 1200, 1500, 1800, 2400, 2100, 2700, 3000, 1800, 3300, 3600,
    3900, 4200, 4500, 3900, 4800, 5100, 5400, 4800, 5700, 6000, 6300, 6600,
    6900, 7200, 7500, 7800, 8100,
  ];

  const referralData = [
    500, 900, 700, 1400, 1100, 1700, 2300, 2000, 2600, 2900, 2300, 3200, 3500,
    3800, 4100, 4400, 2900, 4700, 5000, 5300, 5600, 5900, 6200, 6500, 5600,
    6800, 7100, 7400, 7700, 8000,
  ];

  const organicData = [
    1000, 1500, 1200, 1700, 1300, 2000, 2400, 2200, 2600, 2800, 2500, 3000,
    3400, 3700, 3200, 3900, 4100, 3500, 4300, 4500, 4000, 4700, 5000, 5200,
    4800, 5400, 5600, 5900, 6100, 6300,
  ];

  // Prepare data for stacked area chart
  const chartData = directData.map((value, index) => ({
    value: value + referralData[index] + organicData[index],
    label: index % 5 === 0 ? xAxisLabels[index] : '',
    labelTextStyle: { fontSize: 10 },
  }));

  const chartData2 = directData.map((value, index) => ({
    value: value + referralData[index],
  }));

  const chartData3 = directData.map((value, index) => ({
    value: value,
  }));

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>
          Sessions
        </Text>
        <View style={styles.headerRow}>
          <Text variant="headlineMedium" style={styles.mainValue}>
            13,277
          </Text>
          <Chip
            mode="outlined"
            style={styles.successChip}
            textStyle={styles.successText}
          >
            +35%
          </Chip>
        </View>
        <Text variant="bodySmall" style={styles.subtitle}>
          Sessions per day for the last 30 days
        </Text>

        <View style={styles.chartContainer}>
          <LineChart
            data={chartData}
            data2={chartData2}
            data3={chartData3}
            height={250}
            spacing={8}
            initialSpacing={0}
            color1="#4285f4"
            color2="#1976d2"
            color3="#0d47a1"
            thickness={2}
            thickness2={2}
            thickness3={2}
            areaChart
            curved
            startFillColor1="rgba(66, 133, 244, 0.3)"
            endFillColor1="rgba(66, 133, 244, 0.1)"
            startFillColor2="rgba(25, 118, 210, 0.3)"
            endFillColor2="rgba(25, 118, 210, 0.1)"
            startFillColor3="rgba(13, 71, 161, 0.3)"
            endFillColor3="rgba(13, 71, 161, 0.1)"
            startOpacity={0.3}
            endOpacity={0.1}
            startOpacity2={0.3}
            endOpacity2={0.1}
            startOpacity3={0.3}
            endOpacity3={0.1}
            rulesType="solid"
            rulesColor="#e0e0e0"
            showVerticalLines
            verticalLinesColor="#e0e0e0"
            xAxisColor="#e0e0e0"
            yAxisColor="#e0e0e0"
            yAxisTextStyle={styles.axisText}
            xAxisLabelTextStyle={styles.axisText}
            hideDataPoints
            adjustToWidth
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
  successChip: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4caf50',
  },
  successText: {
    color: '#4caf50',
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
  },
  axisText: {
    fontSize: 10,
    color: '#666',
  },
});
