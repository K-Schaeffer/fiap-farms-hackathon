import { useState, useEffect, useCallback } from 'react';
import { getFirebaseDb } from '@fiap-farms/firebase';
import {
  GetSalesDashboardDataUseCase,
  FirestoreSaleRepository,
} from '@fiap-farms/core';
import { useAuth } from '@fiap-farms/shared-stores';
import {
  transformSalesDashboardToUI,
  transformSalesDashboardStats,
  transformSalesTrendData,
  transformSalesDistributionData,
  type SalesDashboardStats,
  type ChartTrendData,
  type ChartDistributionData,
} from '../utils/transformers';

interface EnhancedSalesDashboard {
  totalSales: number;
  totalRevenue: number;
  totalRevenueLiquid: number;
  bestMonth: string;
  salesByMonth: { month: string; amount: number; count: number }[];
  topClients: { client: string; totalAmount: number; salesCount: number }[];
  salesHistory: { client: string; saleDate: string; totalSaleAmount: number }[];
  dashboardStats: SalesDashboardStats;
  trendData: ChartTrendData;
  distributionData: ChartDistributionData[];
}

export function useSalesDashboard() {
  const [dashboard, setDashboard] = useState<EnhancedSalesDashboard | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const OWNER_ID = user?.uid || 'no-owner-something-went-wrong';

  const loadDashboard = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const db = getFirebaseDb();
      const saleRepo = new FirestoreSaleRepository(db);
      const getSalesDashboardData = new GetSalesDashboardDataUseCase(saleRepo);
      const data = await getSalesDashboardData.execute(OWNER_ID);

      const dashboardData = transformSalesDashboardToUI(data);
      const dashboardStats = transformSalesDashboardStats(data);
      const trendData = transformSalesTrendData(data.salesByMonth);
      const distributionData = transformSalesDistributionData(
        data.topClients,
        data.totalRevenue
      );

      setDashboard({
        ...dashboardData,
        dashboardStats,
        trendData,
        distributionData,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [user, OWNER_ID]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return { dashboard, loading, error, refresh: loadDashboard };
}
