import React from 'react';
import { ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { MobileProductionDashboard } from '../../components/pages/MobileProductionDashboard';
import { useProductionDashboard } from '../../hooks/useProductionDashboard';

export default function ProductsDashboardScreen() {
  const {
    dashboardStats,
    trendData,
    distributionData,
    productionItems,
    loading,
    error,
    refresh,
  } = useProductionDashboard();

  const handleRefresh = () => {
    refresh();
  };

  if (loading) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.loadingContainer}
      >
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading production dashboard...</Text>
      </ScrollView>
    );
  }

  if (error) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.errorContainer}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
      >
        <Text style={styles.errorText}>Error: {error}</Text>
        <Text style={styles.retryText}>Pull to refresh and try again</Text>
      </ScrollView>
    );
  }

  if (!dashboardStats || !trendData || !distributionData) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.noDataContainer}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
      >
        <Text style={styles.noDataText}>No production data available</Text>
        <Text style={styles.retryText}>Pull to refresh and try again</Text>
      </ScrollView>
    );
  }

  return (
    <MobileProductionDashboard
      dashboardStats={dashboardStats}
      trendData={trendData}
      distributionData={distributionData}
      productionItems={productionItems}
      onRefresh={handleRefresh}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 8,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  retryText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
