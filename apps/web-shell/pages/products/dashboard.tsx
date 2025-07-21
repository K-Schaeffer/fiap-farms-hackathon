import dynamic from 'next/dynamic';

const ProductsAppDashboard = dynamic(() => import('productsApp/Dashboard'), {
  ssr: false,
});

export default function ProductsDashboardPagge() {
  return <ProductsAppDashboard />;
}
