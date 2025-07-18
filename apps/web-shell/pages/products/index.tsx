import dynamic from 'next/dynamic';
import { useAuth } from '@fiap-farms/auth-store';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { CircularProgress, Container } from '@mui/material';

const ProductsApp = dynamic(() => import('productsApp/Index'), {
  ssr: false,
});

export default function RootViewDashboard() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <>
      <ProductsApp />
    </>
  );
}
