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

  // Protect all routes that are not public
  const isProtectedRoute = !router.pathname.includes('public');

  useEffect(() => {
    // Only redirect if we're on a protected route and user is not authenticated
    if (isProtectedRoute && !isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isProtectedRoute, isAuthenticated, isLoading, router]);

  // Show loading spinner while checking authentication on protected routes
  if (isProtectedRoute && isLoading) {
    return (
      <Container
        maxWidth={false}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          width: '100vw',
        }}
      >
        <CircularProgress size={160} thickness={4} />
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
