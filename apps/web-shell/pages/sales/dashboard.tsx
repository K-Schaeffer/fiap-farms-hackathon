import dynamic from 'next/dynamic';

const SalesAppDashboard = dynamic(() => import('salesApp/Dashboard'), {
  ssr: false,
});

export default function SalesDashboardPage() {
  return <SalesAppDashboard />;
}
