import React from 'react';
import { useRouter } from 'expo-router';
import { MobileProductsWelcome } from '../../../components';

export default function ProductsPage() {
  const router = useRouter();

  const handleNavigateToManagement = () => {
    router.push('/(protected)/production-management');
  };

  const handleNavigateToDashboard = () => {
    router.push('/(protected)/products-dashboard');
  };

  return (
    <MobileProductsWelcome
      onNavigateToManagement={handleNavigateToManagement}
      onNavigateToDashboard={handleNavigateToDashboard}
    />
  );
}
