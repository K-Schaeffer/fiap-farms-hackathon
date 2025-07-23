import { useState, useEffect, useCallback } from 'react';
import { getFirebaseDb } from '@fiap-farms/firebase';
import {
  GetSalesDashboardDataUseCase,
  FirestoreSaleRepository,
} from '@fiap-farms/core';
import { useAuth } from '@fiap-farms/shared-stores';
import { WebSalesDashboardProps } from '@fiap-farms/web-ui';
import { transformSalesDashboardToUI } from '../utils/transformers';

export function useSalesDashboard() {
  const [dashboard, setDashboard] = useState<WebSalesDashboardProps | null>(
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

      setDashboard(dashboardData);
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
