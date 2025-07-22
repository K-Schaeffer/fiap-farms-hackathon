import { useState, useEffect, useCallback } from 'react';
import { getFirebaseDb } from '@fiap-farms/firebase';
import {
  GetInventoryOverviewUseCase,
  FirestoreInventoryRepository,
  RegisterSaleUseCase,
  FirestoreSaleRepository,
} from '@fiap-farms/core';
import { transformInventoryItemsToUI } from '../utils/transformers';
import type { WebSaleProduct, WebSaleFormData } from '@fiap-farms/web-ui';
import { useAuth } from '@fiap-farms/auth-store';

export function useSalesManagement() {
  const [availableProducts, setAvailableProducts] = useState<WebSaleProduct[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const OWNER_ID = user?.uid || 'no-owner-something-went-wrong';

  // Initialize repositories and use cases
  const getRepositories = () => {
    const db = getFirebaseDb();
    const inventoryRepo = new FirestoreInventoryRepository(db);
    const saleRepo = new FirestoreSaleRepository(db);
    return {
      inventoryRepo,
      saleRepo,
      getInventoryOverviewUseCase: new GetInventoryOverviewUseCase(
        inventoryRepo
      ),
      registerSaleUseCase: new RegisterSaleUseCase(saleRepo, inventoryRepo),
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

      const { getInventoryOverviewUseCase } = getRepositories();
      const inventoryOverview =
        await getInventoryOverviewUseCase.execute(OWNER_ID);

      const products = transformInventoryItemsToUI(inventoryOverview.items);
      setAvailableProducts(products);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [user, OWNER_ID]);

  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  const handleRegisterSale = useCallback(
    async (data: WebSaleFormData) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      try {
        const { registerSaleUseCase } = getRepositories();

        const saleItems = data.items.map(item => {
          const product = availableProducts.find(p => p.id === item.productId);
          if (!product) {
            throw new Error(`Product not found: ${item.productId}`);
          }
          return {
            productId: item.productId,
            productName: product.name,
            quantity: Number(item.quantity),
            pricePerUnit: Number(item.pricePerUnit),
          };
        });

        await registerSaleUseCase.execute({
          ownerId: OWNER_ID,
          items: saleItems,
          client: data.client,
          saleDate: new Date(),
        });

        return true;
      } catch (err) {
        console.error('Error registering sale:', err);
        throw new Error(
          err instanceof Error ? err.message : 'Failed to register sale'
        );
      }
    },
    [user, OWNER_ID, availableProducts]
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    availableProducts,
    loading,
    error,
    refresh: refreshData,
    registerSale: handleRegisterSale,
  };
}
