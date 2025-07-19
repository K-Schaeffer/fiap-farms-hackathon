import { useAuth } from '@fiap-farms/auth-store';
import { useRouter } from 'next/router';
import { useEffect, ReactNode } from 'react';
import { CircularProgress, Container } from '@mui/material';

interface AuthGuardProps {
  children: ReactNode;
}

/**
 * AuthGuard component that handles global authentication checking
 * This centralizes all auth logic instead of having it in individual pages
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Protect all routes except the index page
  const isProtectedRoute = router.pathname !== '/';

  useEffect(() => {
    // Only redirect if we're on a protected route and user is not authenticated
    if (isProtectedRoute && !isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isProtectedRoute, isAuthenticated, isLoading, router]);

  // Show loading spinner while checking authentication on protected routes
  if (isProtectedRoute && isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  // Don't render protected content if user is not authenticated (will redirect)
  if (isProtectedRoute && !isAuthenticated && !isLoading) {
    return null;
  }

  // Render children for public routes or authenticated users on protected routes
  return <>{children}</>;
}
