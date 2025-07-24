import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { MobileSaleForm } from '../../components';
import { useSalesManagement } from '../../hooks';
import { router } from 'expo-router';

export default function NewSalePage() {
  const { availableProducts, loading, error, registerSale, refresh } =
    useSalesManagement();

  const handleBackToSales = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text variant="bodyLarge" style={styles.loadingText}>
          Loading products...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text variant="headlineSmall" style={styles.errorTitle}>
          Error Loading Products
        </Text>
        <Text variant="bodyMedium" style={styles.errorMessage}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MobileSaleForm
        products={availableProducts}
        onBack={handleBackToSales}
        onSubmitSale={registerSale}
        onRefreshData={refresh}
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
    backgroundColor: '#f5f5f5',
    gap: 16,
  },
  loadingText: {
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 24,
  },
  errorTitle: {
    color: '#d32f2f',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    color: '#666',
    textAlign: 'center',
  },
});
