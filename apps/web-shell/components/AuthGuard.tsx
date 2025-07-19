import { useAuth } from '@fiap-farms/auth-store';
import { useRouter } from 'next/router';
import { useEffect, ReactNode } from 'react';
import { CircularProgress, Container } from '@mui/material';
import { usePublicRoute } from '../hooks/usePublicRoute';

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
  const { isPublic } = usePublicRoute();

  // Protect all routes that are not public

  useEffect(() => {
    // Only redirect if we're on a protected route and user is not authenticated
    if (!isPublic && !isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isPublic, isAuthenticated, isLoading, router]);

  // Show loading spinner while checking authentication on protected routes
  if (!isPublic && isLoading) {
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
  if (!isPublic && !isAuthenticated && !isLoading) {
    return null;
  }

  // Render children for public routes or authenticated users on protected routes
  return <>{children}</>;
}
