import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { PieChart } from 'react-native-gifted-charts';
import { MaterialIcons } from '@expo/vector-icons';

export interface ChartDistributionData {
  label: string;
  value: number;
  color: string;
}

export interface MobileClientChartProps {
  distributionData: ChartDistributionData[];
}

export function MobileClientChart({
  distributionData,
}: MobileClientChartProps) {
  // Check if there's no data to display
  const hasNoData = !distributionData || distributionData.length === 0;

  // Transform data for react-native-gifted-charts
  const pieData = distributionData.map(item => ({
    value: item.value,
    color: item.color,
    text: `${item.value}%`,
    textColor: '#fff',
    textSize: 12,
    fontWeight: 'bold',
  }));

  const renderLegend = () => {
    return (
      <View style={styles.legendContainer}>
        {distributionData.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text variant="bodyMedium" style={styles.legendLabel}>
              {item.label}
            </Text>
            <Text variant="bodyMedium" style={styles.legendValue}>
              {item.value}%
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <Card style={styles.chartCard} mode="outlined">
      <Card.Content style={styles.chartContent}>
        <Text variant="titleMedium" style={styles.chartTitle}>
          Best Clients
        </Text>
        <Text variant="bodyMedium" style={styles.chartSubtitle}>
          Client distribution by sales volume
        </Text>

        {hasNoData ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="pie-chart" size={48} color="#ccc" />
            <Text variant="bodyMedium" style={styles.emptyText}>
              No data to display
            </Text>
          </View>
        ) : (
          <View style={styles.chartSection}>
            <View style={styles.pieContainer}>
              <PieChart
                data={pieData}
                radius={80}
                innerRadius={50}
                strokeColor="#fff"
                strokeWidth={2}
                textColor="#fff"
                textSize={10}
                fontWeight="bold"
                focusOnPress
                toggleFocusOnPress={false}
                sectionAutoFocus
              />
            </View>

            {renderLegend()}
          </View>
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
  chartSection: {
    alignItems: 'center',
  },
  pieContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  centerLabel: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabelText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 12,
  },
  legendContainer: {
    width: '100%',
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  legendLabel: {
    flex: 1,
    color: '#333',
  },
  legendValue: {
    fontWeight: '600',
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
