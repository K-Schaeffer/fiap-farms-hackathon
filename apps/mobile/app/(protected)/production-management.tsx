import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { MobileProductionManagement } from '../../components';
import { useProductionManagement } from '../../hooks';

export default function ProductionManagementPage() {
  const {
    availableProducts,
    productionItems,
    loading,
    error,
    startProduction,
    updateStatus,
    harvestItem,
    refresh,
  } = useProductionManagement();

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
        <Text style={styles.loadingText}>Loading production management...</Text>
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

  return (
    <View style={styles.container}>
      <MobileProductionManagement
        availableProducts={availableProducts}
        productionItems={productionItems}
        onStartProduction={startProduction}
        onUpdateStatus={updateStatus}
        onHarvestItem={harvestItem}
        onRefresh={handleRefresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  retryText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
