import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { MobileSalesDashboard } from '../../components';
import { useSalesDashboard } from '../../hooks';
import { useAuth } from '@fiap-farms/shared-stores';

export default function SalesDashboardPage() {
  const { user } = useAuth();
  const {
    salesHistory,
    dashboardStats,
    trendData,
    distributionData,
    loading,
    error,
    refresh,
  } = useSalesDashboard();

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text variant="headlineSmall" style={styles.messageText}>
          Please log in to view sales dashboard
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text variant="bodyLarge" style={styles.loadingText}>
          Loading sales dashboard...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text variant="headlineSmall" style={styles.errorText}>
          Error loading dashboard
        </Text>
        <Text variant="bodyMedium" style={styles.errorMessage}>
          {error}
        </Text>
      </View>
    );
  }

  if (!dashboardStats || !trendData || !distributionData) {
    return (
      <View style={styles.centerContainer}>
        <Text variant="headlineSmall" style={styles.messageText}>
          No sales data available
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MobileSalesDashboard
        salesHistory={salesHistory}
        dashboardStats={dashboardStats}
        trendData={trendData}
        distributionData={distributionData}
        onRefresh={refresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  messageText: {
    color: '#666',
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorMessage: {
    color: '#666',
    textAlign: 'center',
  },
});
