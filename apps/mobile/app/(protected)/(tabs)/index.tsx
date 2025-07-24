import React from 'react';
import { useRouter } from 'expo-router';
import { MobileSalesWelcome } from '../../../components';

export default function SalesPage() {
  const router = useRouter();

  const handleNavigateToNewSale = () => {
    router.push('/(protected)/new-sale');
  };

  const handleNavigateToDashboard = () => {
    router.push('/(protected)/sales-dashboard');
  };

  return (
    <MobileSalesWelcome
      onNavigateToNewSale={handleNavigateToNewSale}
      onNavigateToDashboard={handleNavigateToDashboard}
    />
  );
}
