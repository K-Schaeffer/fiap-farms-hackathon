import dynamic from 'next/dynamic';

const SalesApp = dynamic(() => import('salesApp/Index'), {
  ssr: false,
});

export default function RootViewDashboard() {
  return (
    <>
      <SalesApp />
    </>
  );
}
