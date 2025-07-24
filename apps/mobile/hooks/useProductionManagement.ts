import { useState, useEffect, useCallback } from 'react';
import {
  ProductionValidationError,
  FirestoreProductRepository,
  FirestoreProductionRepository,
  GetProductsUseCase,
  GetProductionOverviewUseCase,
  StartNewProductionUseCase,
  UpdateProductionStatusUseCase,
} from '@fiap-farms/core';
import { getFirebaseDb } from '@fiap-farms/firebase';
import { useAuth } from '@fiap-farms/shared-stores';
import {
  transformProductsToMobile,
  transformProductionItemsToMobileManagement,
} from '../utils/transformers';
import type {
  MobileProductData,
  MobileProductionItem,
  MobilePlantingFormData,
  MobileHarvestFormData,
} from '../components';

export function useProductionManagement() {
  const [availableProducts, setAvailableProducts] = useState<
    MobileProductData[]
  >([]);
  const [productionItems, setProductionItems] = useState<
    MobileProductionItem[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const OWNER_ID = user?.uid || 'no-owner-something-went-wrong';

  const getRepositories = () => {
    const db = getFirebaseDb();
    const productRepo = new FirestoreProductRepository(db);
    const productionRepo = new FirestoreProductionRepository(db);

    return {
      productRepo,
      productionRepo,
      getProductsUseCase: new GetProductsUseCase(productRepo),
      getProductionOverviewUseCase: new GetProductionOverviewUseCase(
        productionRepo
      ),
      startNewProductionUseCase: new StartNewProductionUseCase(productionRepo),
      updateProductionStatusUseCase: new UpdateProductionStatusUseCase(
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

      const { getProductsUseCase, getProductionOverviewUseCase } =
        getRepositories();

      const [fetchedProducts, productionOverview] = await Promise.all([
        getProductsUseCase.execute(),
        getProductionOverviewUseCase.execute(OWNER_ID),
      ]);

      // Transform data for mobile components
      const transformedProducts = transformProductsToMobile(fetchedProducts);

      // Combine all production items from overview
      const allProductionItems = [
        ...productionOverview.plantedItems,
        ...productionOverview.inProductionItems,
        ...productionOverview.harvestedItems,
      ];
      const transformedProductionItems =
        transformProductionItemsToMobileManagement(allProductionItems);

      setAvailableProducts(transformedProducts);
      setProductionItems(transformedProductionItems);
    } catch (err) {
      console.error('Error loading production management data:', err);
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

  const startProduction = useCallback(
    async (productId: string, data: MobilePlantingFormData) => {
      try {
        const { startNewProductionUseCase } = getRepositories();
        const product = availableProducts.find(p => p.id === productId);
        const productName = product?.name || 'Unknown Product';
        const productUnit = product?.unit || 'kg';

        const newProductionItem = await startNewProductionUseCase.execute({
          productId,
          productName,
          productUnit,
          ownerId: OWNER_ID,
          location: data.location,
          expectedHarvestDate: data.expectedHarvestDate,
        });

        // Transform the new item and add to state
        const transformedNewItem = transformProductionItemsToMobileManagement([
          newProductionItem,
        ])[0];
        setProductionItems(prev => [...prev, transformedNewItem]);
      } catch (err) {
        console.error('Error starting production:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to start production'
        );
        throw err;
      }
    },
    [OWNER_ID, availableProducts]
  );

  const updateStatus = useCallback(
    async (
      itemId: string,
      newStatus: 'planted' | 'in_production' | 'harvested'
    ) => {
      try {
        const { updateProductionStatusUseCase } = getRepositories();

        const updatedItem = await updateProductionStatusUseCase.execute({
          productionItemId: itemId,
          newStatus,
        });

        // Transform and update local state
        const transformedUpdatedItem =
          transformProductionItemsToMobileManagement([updatedItem])[0];
        setProductionItems(prev =>
          prev.map(item => (item.id === itemId ? transformedUpdatedItem : item))
        );
      } catch (err) {
        console.error('Error updating status:', err);

        // Don't set global error state for validation errors
        const isValidationError =
          ProductionValidationError.isProductionValidationError(err);

        if (!isValidationError) {
          setError(
            err instanceof Error ? err.message : 'Failed to update status'
          );
        }

        throw err;
      }
    },
    []
  );

  const harvestItem = useCallback(
    async (itemId: string, data: MobileHarvestFormData) => {
      try {
        const { updateProductionStatusUseCase } = getRepositories();

        const updatedItem = await updateProductionStatusUseCase.execute({
          productionItemId: itemId,
          newStatus: 'harvested',
          yieldAmount: data.yieldAmount,
        });

        // Transform and update local state
        const transformedUpdatedItem =
          transformProductionItemsToMobileManagement([updatedItem])[0];
        setProductionItems(prev =>
          prev.map(item => (item.id === itemId ? transformedUpdatedItem : item))
        );
      } catch (err) {
        console.error('Error harvesting item:', err);
        setError(err instanceof Error ? err.message : 'Failed to harvest item');
        throw err;
      }
    },
    []
  );

  return {
    availableProducts,
    productionItems,
    loading,
    error,
    startProduction,
    updateStatus,
    harvestItem,
    refresh,
  };
}
