import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, ProgressBar } from 'react-native-paper';
import { PieChart } from 'react-native-gifted-charts';

const countries = [
  {
    name: 'India',
    value: 50,
    color: '#0d47a1',
  },
  {
    name: 'USA',
    value: 35,
    color: '#1976d2',
  },
  {
    name: 'Brazil',
    value: 10,
    color: '#4285f4',
  },
  {
    name: 'Other',
    value: 5,
    color: '#90caf9',
  },
];

const pieData = countries.map(country => ({
  value: country.value,
  color: country.color,
  text: `${country.value}%`,
}));

export default function MobileUserByCountryChart() {
  const totalUsers = 100000;

  const renderLegendItem = (country: (typeof countries)[0]) => (
    <View key={country.name} style={styles.legendItem}>
      <View style={styles.legendRow}>
        <View style={[styles.colorDot, { backgroundColor: country.color }]} />
        <Text variant="bodyMedium" style={styles.countryName}>
          {country.name}
        </Text>
        <Text variant="bodyMedium" style={styles.percentage}>
          {country.value}%
        </Text>
      </View>
      <ProgressBar
        progress={country.value / 100}
        color={country.color}
        style={styles.progressBar}
      />
      <Text variant="bodySmall" style={styles.userCount}>
        {((totalUsers * country.value) / 100).toLocaleString()} users
      </Text>
    </View>
  );

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>
          Users by country
        </Text>

        <View style={styles.chartContainer}>
          <PieChart
            data={pieData}
            donut
            radius={70}
            innerRadius={45}
            centerLabelComponent={() => (
              <View style={styles.centerLabel}>
                <Text variant="headlineSmall" style={styles.centerText}>
                  100K
                </Text>
                <Text variant="bodySmall" style={styles.centerSubtext}>
                  Total
                </Text>
              </View>
            )}
          />
        </View>

        <View style={styles.legendContainer}>
          {countries.map(renderLegendItem)}
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
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  centerLabel: {
    alignItems: 'center',
  },
  centerText: {
    fontWeight: 'bold',
    color: '#000',
  },
  centerSubtext: {
    color: '#666',
  },
  legendContainer: {
    gap: 12,
  },
  legendItem: {
    gap: 4,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  countryName: {
    flex: 1,
    fontWeight: '500',
  },
  percentage: {
    color: '#666',
    fontWeight: '500',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#f0f0f0',
  },
  userCount: {
    color: '#666',
    marginLeft: 20,
  },
});
