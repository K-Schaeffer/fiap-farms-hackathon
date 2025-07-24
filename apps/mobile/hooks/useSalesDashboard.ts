import { useState, useEffect, useCallback } from 'react';
import {
  FirestoreSaleRepository,
  GetSalesDashboardDataUseCase,
  SalesDashboardData,
} from '@fiap-farms/core';
import { getFirebaseDb } from '@fiap-farms/firebase';
import { useAuth } from '@fiap-farms/shared-stores';
import {
  transformSalesDashboardStats,
  transformSalesTrendData,
  transformSalesDistributionData,
  transformSalesHistoryToMobile,
  type MobileSalesDashboardStats,
  type MobileChartTrendData,
  type MobileChartDistributionData,
} from '../utils/transformers';
import { MobileSaleHistoryItem } from '../components';

export function useSalesDashboard() {
  const [salesHistory, setSalesHistory] = useState<MobileSaleHistoryItem[]>([]);
  const [dashboardStats, setDashboardStats] =
    useState<MobileSalesDashboardStats | null>(null);
  const [trendData, setTrendData] = useState<MobileChartTrendData | null>(null);
  const [distributionData, setDistributionData] = useState<
    MobileChartDistributionData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const OWNER_ID = user?.uid || 'no-owner-something-went-wrong';

  const getRepositories = () => {
    const db = getFirebaseDb();
    const saleRepo = new FirestoreSaleRepository(db);
    return {
      getSalesDashboardDataUseCase: new GetSalesDashboardDataUseCase(saleRepo),
    };
  };

  const loadData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const { getSalesDashboardDataUseCase } = getRepositories();

      const dashboardData: SalesDashboardData =
        await getSalesDashboardDataUseCase.execute(OWNER_ID);

      // Transform data for mobile UI
      const stats = transformSalesDashboardStats(dashboardData);
      const trends = transformSalesTrendData(dashboardData.salesByMonth);
      const distribution = transformSalesDistributionData(
        dashboardData.topClients,
        dashboardData.totalRevenue
      );
      const history = transformSalesHistoryToMobile(dashboardData.salesHistory);

      setDashboardStats(stats);
      setTrendData(trends);
      setDistributionData(distribution);
      setSalesHistory(history);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load sales dashboard data'
      );
    } finally {
      setLoading(false);
    }
  }, [user, OWNER_ID]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    salesHistory,
    dashboardStats,
    trendData,
    distributionData,
    loading,
    error,
    refresh: loadData,
  };
}
