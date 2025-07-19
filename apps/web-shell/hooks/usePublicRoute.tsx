import { useRouter } from 'next/router';
import { useMemo } from 'react';

export function usePublicRoute() {
  const router = useRouter();

  const isPublic = useMemo(() => {
    const publicRoutes = ['/login', '/signup', '/_error'];

    return publicRoutes.includes(router.pathname);
  }, [router.pathname]);

  return {
    isPublic,
  };
}
