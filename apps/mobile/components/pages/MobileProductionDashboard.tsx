import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text } from 'react-native-paper';
import { MobileStatCard } from '../common/MobileStatCard';
import {
  MobileProductionCards,
  MobileProductionChart,
  MobileProductionDistributionChart,
} from '../dashboards';
import type { MobileProductionItemDashboard } from '../dashboards';

export interface MobileProductionDashboardProps {
  productionItems: MobileProductionItemDashboard[];
  dashboardStats: import('../../utils/transformers').MobileProductionDashboardStats;
  trendData: import('../../utils/transformers').MobileProductionChartTrendData;
  distributionData: import('../../utils/transformers').MobileProductionChartDistributionData[];
  onRefresh?: () => void;
}

export function MobileProductionDashboard({
  productionItems,
  dashboardStats,
  trendData,
  distributionData,
  onRefresh,
}: MobileProductionDashboardProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh?.();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Overview Section */}
      <View style={[styles.section, styles.firstSection]}>
        <Text variant="headlineSmall" style={styles.sectionTitle}>
          Production Overview
        </Text>

        <View style={styles.statsGrid}>
          <View style={styles.statRow}>
            <MobileStatCard
              title="Planted"
              value={dashboardStats.totalPlanted.toString()}
              interval="Current"
              color="success"
              icon="spa"
            />
            <MobileStatCard
              title="Harvested"
              value={dashboardStats.totalHarvested.toString()}
              interval="Current"
              color="info"
              icon="agriculture"
            />
          </View>

          <View style={styles.statRow}>
            <MobileStatCard
              title="In Production"
              value={dashboardStats.totalInProduction.toString()}
              interval="Current"
              color="warning"
              icon="schedule"
            />
            <MobileStatCard
              title="Overdue"
              value={dashboardStats.totalOverdue.toString()}
              interval="Current"
              color="error"
              icon="warning"
            />
          </View>
        </View>
      </View>

      {/* Charts Section */}
      <View style={styles.section}>
        <Text variant="headlineSmall" style={styles.sectionTitle}>
          Production Insights
        </Text>

        <MobileProductionChart trendData={trendData} />
        <MobileProductionDistributionChart
          distributionData={distributionData}
        />
      </View>

      {/* Production Items Section */}
      <View style={styles.section}>
        <Text variant="headlineSmall" style={styles.sectionTitle}>
          Production Items
        </Text>

        <MobileProductionCards productionItems={productionItems} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    marginBottom: 24,
  },
  firstSection: {
    paddingTop: 24,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 16,
    color: '#333',
  },
  statsGrid: {
    paddingHorizontal: 16,
  },
  statRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
});
