import { useState, useEffect, useCallback } from 'react';
import {
  Product,
  ProductionItem,
  ProductionValidationError,
  FirestoreProductRepository,
  FirestoreProductionRepository,
  GetProductsUseCase,
  GetProductionOverviewUseCase,
  StartNewProductionUseCase,
  UpdateProductionStatusUseCase,
} from '@fiap-farms/core';
import { WebPlantingFormData, WebHarvestFormData } from '@fiap-farms/web-ui';
import { getFirebaseDb } from '@fiap-farms/firebase';
import { useAuth } from '@fiap-farms/shared-stores';

export function useProductionManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productionItems, setProductionItems] = useState<ProductionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const OWNER_ID = user?.uid || 'no-owner-something-went-wrong';

  // Initialize repositories and use cases
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
      return; // Don't load data if user is not authenticated
    }

    try {
      setLoading(true);
      setError(null);

      const { getProductsUseCase, getProductionOverviewUseCase } =
        getRepositories();

      // Load products and production items in parallel
      const [fetchedProducts, productionOverview] = await Promise.all([
        getProductsUseCase.execute(),
        getProductionOverviewUseCase.execute(OWNER_ID),
      ]);

      setProducts(fetchedProducts);

      // Combine all production items from overview
      const allProductionItems = [
        ...productionOverview.plantedItems,
        ...productionOverview.inProductionItems,
        ...productionOverview.harvestedItems,
      ];

      setProductionItems(allProductionItems);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [user, OWNER_ID]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  const startProductionWithForm = useCallback(
    async (productId: string, data: WebPlantingFormData) => {
      try {
        const { startNewProductionUseCase } = getRepositories();
        const product = products.find(p => p._id === productId);
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

        setProductionItems(prev => [...prev, newProductionItem]);
      } catch (err) {
        console.error('Error starting production with form:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to start production'
        );
        throw err;
      }
    },
    [OWNER_ID, products]
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

        // Update local state with the returned item
        setProductionItems(prev =>
          prev.map(item => (item._id === itemId ? updatedItem : item))
        );
      } catch (err) {
        console.error('Error updating status:', err);

        // Don't set global error state for validation errors - they should just
        // cancel the drag-and-drop operation without showing a full-screen error
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

  const harvestItemWithForm = useCallback(
    async (itemId: string, data: WebHarvestFormData) => {
      try {
        const { updateProductionStatusUseCase } = getRepositories();

        const updatedItem = await updateProductionStatusUseCase.execute({
          productionItemId: itemId,
          newStatus: 'harvested',
          yieldAmount: data.yieldAmount,
        });

        // Update local state with the returned item
        setProductionItems(prev =>
          prev.map(item => (item._id === itemId ? updatedItem : item))
        );
      } catch (err) {
        console.error('Error harvesting item with form:', err);
        setError(err instanceof Error ? err.message : 'Failed to harvest item');
        throw err;
      }
    },
    []
  );

  const reorderItems = useCallback(
    async (sourceIndex: number, destinationIndex: number, columnId: string) => {
      try {
        if (columnId === 'available') {
          // Reorder products
          setProducts(prev => {
            const newProducts = [...prev];
            const [movedItem] = newProducts.splice(sourceIndex, 1);
            newProducts.splice(destinationIndex, 0, movedItem);
            return newProducts;
          });
        } else {
          // Reorder production items within a status
          setProductionItems(prev => {
            const itemsInColumn = prev.filter(item => item.status === columnId);
            const otherItems = prev.filter(item => item.status !== columnId);

            const [movedItem] = itemsInColumn.splice(sourceIndex, 1);
            itemsInColumn.splice(destinationIndex, 0, movedItem);

            return [...otherItems, ...itemsInColumn];
          });
        }
      } catch (err) {
        console.error('Error reordering items:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to reorder items'
        );
        throw err;
      }
    },
    []
  );

  return {
    products,
    productionItems,
    loading,
    error,
    startProductionWithForm,
    updateStatus,
    harvestItemWithForm,
    reorderItems,
    refreshData,
  };
}
