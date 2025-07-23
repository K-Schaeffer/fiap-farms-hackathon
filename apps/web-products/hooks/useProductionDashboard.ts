import { useState, useEffect, useCallback } from 'react';
import {
  FirestoreProductionRepository,
  GetProductionOverviewUseCase,
  GetProductionDashboardDataUseCase,
  ProductionItem,
  ProductionDistributionItem,
  ProductionTrendItem,
} from '@fiap-farms/core';
import { getFirebaseDb } from '@fiap-farms/firebase';
import { useAuth } from '@fiap-farms/shared-stores';
import {
  transformProductionItemsToUI,
  transformProductionDashboardStats,
  transformProductionTrendData,
  transformProductionDistributionData,
} from '../utils/transformers';

export function useProductionDashboard() {
  const [productionItems, setProductionItems] = useState<ProductionItem[]>([]);
  const [distribution, setDistribution] = useState<
    ProductionDistributionItem[]
  >([]);
  const [trend, setTrend] = useState<ProductionTrendItem[]>([]);
  const [harvestedTrend, setHarvestedTrend] = useState<ProductionTrendItem[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const OWNER_ID = user?.uid || 'no-owner-something-went-wrong';

  const getRepositories = () => {
    const db = getFirebaseDb();
    const productionRepo = new FirestoreProductionRepository(db);
    return {
      getProductionOverviewUseCase: new GetProductionOverviewUseCase(
        productionRepo
      ),
      getProductionDashboardDataUseCase: new GetProductionDashboardDataUseCase(
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
        getProductionOverviewUseCase,
        getProductionDashboardDataUseCase,
      } = getRepositories();
      const [productionOverview, dashboardData] = await Promise.all([
        getProductionOverviewUseCase.execute(OWNER_ID),
        getProductionDashboardDataUseCase.execute(OWNER_ID),
      ]);
      // Combine all production items from overview
      const allProductionItems = [
        ...productionOverview.plantedItems,
        ...productionOverview.inProductionItems,
        ...productionOverview.harvestedItems,
      ];
      setProductionItems(allProductionItems);
      setDistribution(dashboardData.distribution);
      setTrend(dashboardData.trends.planted);
      setHarvestedTrend(dashboardData.trends.harvested);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [user, OWNER_ID]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Transform for UI
  const uiProductionItems = transformProductionItemsToUI(productionItems);
  const dashboardStats = transformProductionDashboardStats(productionItems);
  const trendData = transformProductionTrendData(trend, harvestedTrend);
  const distributionData = transformProductionDistributionData(distribution);

  return {
    productionItems: uiProductionItems,
    dashboardStats,
    trendData,
    distributionData,
    loading,
    error,
    refresh: loadData,
  };
}
