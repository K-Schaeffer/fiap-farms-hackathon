import dynamic from 'next/dynamic';

const ProductsAppManagement = dynamic(() => import('productsApp/Management'), {
  ssr: false,
});

export default function ProductsManagementPage() {
  return <ProductsAppManagement />;
}
