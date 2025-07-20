import React from 'react';
import { MobileProductsTable } from '../../components/MobileProductsTable';
import { useProducts } from '../../hooks/useProducts';

export default function ProductsPage() {
  const { products, loading, error } = useProducts();

  return (
    <MobileProductsTable products={products} loading={loading} error={error} />
  );
}
