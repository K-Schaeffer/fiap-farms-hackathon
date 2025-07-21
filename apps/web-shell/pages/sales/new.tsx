import dynamic from 'next/dynamic';

const SalesAppNew = dynamic(() => import('salesApp/New'), {
  ssr: false,
});

export default function SalesNewPage() {
  return <SalesAppNew />;
}
