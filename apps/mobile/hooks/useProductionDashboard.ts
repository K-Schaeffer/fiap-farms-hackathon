import { useState, useEffect, useCallback } from 'react';
import {
  FirestoreProductionRepository,
  GetProductionDashboardDataUseCase,
  GetProductionOverviewUseCase,
} from '@fiap-farms/core';
import { getFirebaseDb } from '@fiap-farms/firebase';
import { useAuth } from '@fiap-farms/shared-stores';
import {
  transformProductionDashboardStats,
  transformProductionTrendData,
  transformProductionDistributionData,
  transformProductionItemsToMobile,
  type MobileProductionDashboardStats,
  type MobileProductionChartTrendData,
  type MobileProductionChartDistributionData,
} from '../utils/transformers';
import { MobileProductionItemDashboard } from '../components';

export function useProductionDashboard() {
  const [productionItems, setProductionItems] = useState<
    MobileProductionItemDashboard[]
  >([]);
  const [dashboardStats, setDashboardStats] =
    useState<MobileProductionDashboardStats | null>(null);
  const [trendData, setTrendData] =
    useState<MobileProductionChartTrendData | null>(null);
  const [distributionData, setDistributionData] = useState<
    MobileProductionChartDistributionData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const OWNER_ID = user?.uid || 'no-owner-something-went-wrong';

  const getRepositories = () => {
    const db = getFirebaseDb();
    const productionRepo = new FirestoreProductionRepository(db);
    return {
      getProductionDashboardDataUseCase: new GetProductionDashboardDataUseCase(
        productionRepo
      ),
      getProductionOverviewUseCase: new GetProductionOverviewUseCase(
        productionRepo
      ),
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
      const {
        getProductionDashboardDataUseCase,
        getProductionOverviewUseCase,
      } = getRepositories();

      const [dashboardData, overviewData] = await Promise.all([
        getProductionDashboardDataUseCase.execute(OWNER_ID),
        getProductionOverviewUseCase.execute(OWNER_ID),
      ]);

      // Transform dashboard data for charts
      const transformedTrendData = transformProductionTrendData(
        dashboardData.trends
      );
      const transformedDistributionData = transformProductionDistributionData(
        dashboardData.distribution
      );

      // Transform overview data for stats
      const transformedStats = transformProductionDashboardStats(overviewData);

      // Get all production items for the list
      const allItems = [
        ...overviewData.plantedItems,
        ...overviewData.inProductionItems,
        ...overviewData.harvestedItems,
      ];
      const transformedItems = transformProductionItemsToMobile(allItems);

      setTrendData(transformedTrendData);
      setDistributionData(transformedDistributionData);
      setDashboardStats(transformedStats);
      setProductionItems(transformedItems);
    } catch (err) {
      console.error('Error loading production dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [OWNER_ID, user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refresh = useCallback(() => {
    loadData();
  }, [loadData]);

  return {
    productionItems,
    dashboardStats,
    trendData,
    distributionData,
    loading,
    error,
    refresh,
  };
}
