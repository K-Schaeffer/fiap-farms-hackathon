import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text } from 'react-native-paper';
import { MobileStatCard } from '../common/MobileStatCard';
import {
  MobileSalesCards,
  MobileSaleHistoryItem,
  MobileRevenueChart,
  MobileClientChart,
} from '../dashboards';

export interface SalesDashboardStats {
  totalSales: number;
  totalRevenue: number;
  totalRevenueLiquid: number;
  bestMonth: string;
}

export interface ChartTrendData {
  months: string[];
  revenue: number[];
  liquidRevenue: number[];
}

export interface ChartDistributionData {
  label: string;
  value: number;
  color: string;
}

export interface MobileSalesDashboardProps {
  salesHistory: MobileSaleHistoryItem[];
  dashboardStats: SalesDashboardStats;
  trendData: ChartTrendData;
  distributionData: ChartDistributionData[];
  onRefresh?: () => void;
}

export function MobileSalesDashboard({
  salesHistory,
  dashboardStats,
  trendData,
  distributionData,
  onRefresh,
}: MobileSalesDashboardProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh?.();
    } finally {
      setRefreshing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
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
          Sales Overview
        </Text>

        <View style={styles.statsGrid}>
          <View style={styles.statRow}>
            <MobileStatCard
              title="Total Sales"
              value={dashboardStats.totalSales.toString()}
              interval="This Year"
              color="default"
              icon="shopping-cart"
            />
            <MobileStatCard
              title="Revenue"
              value={formatCurrency(dashboardStats.totalRevenue)}
              interval="This Year"
              color="success"
              icon="attach-money"
            />
          </View>

          <View style={styles.statRow}>
            <MobileStatCard
              title="Liquid Revenue"
              value={formatCurrency(dashboardStats.totalRevenueLiquid)}
              interval="This Year"
              color="info"
              icon="trending-up"
            />
            <MobileStatCard
              title="Best Month"
              value={dashboardStats.bestMonth || 'N/A'}
              interval="This Year"
              color="warning"
              icon="event"
            />
          </View>
        </View>
      </View>

      {/* Charts Section */}
      <View style={styles.section}>
        <Text variant="headlineSmall" style={styles.sectionTitle}>
          Sales Insights
        </Text>

        <MobileRevenueChart trendData={trendData} />
        <MobileClientChart distributionData={distributionData} />
      </View>

      {/* Sales History Section */}
      <View style={styles.section}>
        <Text variant="headlineSmall" style={styles.sectionTitle}>
          Sales History
        </Text>

        <MobileSalesCards salesHistory={salesHistory} />
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
