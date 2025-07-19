import dynamic from 'next/dynamic';

const ProductsApp = dynamic(() => import('productsApp/Index'), {
  ssr: false,
});

export default function RootViewDashboard() {
  return <ProductsApp />;
}
