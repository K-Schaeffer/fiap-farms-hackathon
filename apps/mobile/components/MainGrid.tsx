import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import StatCard, { StatCardProps } from './StatCard';
import CustomizedDataGrid from './CustomizedDataGrid';
import SessionsChart from './SessionsChart';
import PageViewsBarChart from './PageViewsBarChart';
import ChartUserByCountry from './ChartUserByCountry';

const data: StatCardProps[] = [
  {
    title: 'Users',
    value: '14k',
    interval: 'Last 30 days',
    trend: 'up',
    data: [
      200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360, 340,
      380, 360, 400, 380, 420, 400, 640, 340, 460, 440, 480, 460, 600, 880, 920,
    ],
  },
  {
    title: 'Conversions',
    value: '325',
    interval: 'Last 30 days',
    trend: 'down',
    data: [
      1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820, 840, 600,
      820, 780, 800, 760, 380, 740, 660, 620, 840, 500, 520, 480, 400, 360, 300,
      220,
    ],
  },
  {
    title: 'Event count',
    value: '200k',
    interval: 'Last 30 days',
    trend: 'neutral',
    data: [
      500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530, 620, 510,
      530, 520, 410, 530, 520, 610, 530, 520, 610, 530, 420, 510, 430, 520, 510,
    ],
  },
];

export default function MainGrid() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="titleLarge" style={styles.sectionTitle}>
        Overview
      </Text>

      <View style={styles.statsGrid}>
        {data.map((card, index) => (
          <View key={index} style={styles.statCard}>
            <StatCard {...card} />
          </View>
        ))}
      </View>

      <View style={styles.chartsSection}>
        <View style={styles.chartCard}>
          <SessionsChart />
        </View>
        <View style={styles.chartCard}>
          <PageViewsBarChart />
        </View>
        <View style={styles.sideSection}>
          <ChartUserByCountry />
        </View>
      </View>

      <Text variant="titleLarge" style={styles.sectionTitle}>
        Details
      </Text>

      <View style={styles.detailsGrid}>
        <View style={styles.dataGridSection}>
          <CustomizedDataGrid />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'column',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: 150,
    height: 120,
  },
  chartsSection: {
    flexDirection: 'column',
    gap: 16,
    marginBottom: 24,
  },
  chartCard: {
    flex: 1,
  },
  detailsGrid: {
    flexDirection: 'column',
    gap: 16,
  },
  dataGridSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    flex: 1,
    minHeight: 400,
  },
  sideSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    minHeight: 300,
  },
});
