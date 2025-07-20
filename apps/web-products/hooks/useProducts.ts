import { useState, useEffect } from 'react';
import {
  GetProductsUseCase,
  FirestoreProductRepository,
  Product,
} from '@fiap-farms/core';
import { getFirebaseDb } from '@fiap-farms/firebase';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Initialize repository and use case
      const productRepo = new FirestoreProductRepository(getFirebaseDb());
      const getProductsUseCase = new GetProductsUseCase(productRepo);

      // Execute use case
      const fetchedProducts = await getProductsUseCase.execute();
      setProducts(fetchedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, refetch: fetchProducts };
}
