import { useRouter } from 'next/router';
import { useMemo } from 'react';

export function usePublicRoute() {
  const router = useRouter();

  const isPublic = useMemo(() => {
    return router.pathname.startsWith('/public');
  }, [router.pathname]);

  return {
    isPublic,
  };
}
