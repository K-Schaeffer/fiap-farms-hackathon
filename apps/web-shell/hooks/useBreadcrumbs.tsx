import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { WebBreadcrumbsData } from '@fiap-farms/web-ui';

export function useBreadcrumbs(): WebBreadcrumbsData {
  const router = useRouter();

  return useMemo(() => {
    const pathname = router.pathname;

    switch (pathname) {
      case '/':
        return {
          title: 'Home',
          items: [{ label: 'Home', href: '/' }],
        };

      // Sales routes
      case '/sales/dashboard':
        return {
          title: 'Sales Dashboard',
          items: [{ label: 'Sales', href: '/sales' }, { label: 'Dashboard' }],
        };

      case '/sales/new':
        return {
          title: 'New Sale',
          items: [{ label: 'Sales', href: '/sales' }, { label: 'New sale' }],
        };

      // Products routes
      case '/products/management':
        return {
          title: 'Production Management',
          items: [
            { label: 'Products', href: '/products' },
            { label: 'Production Management' },
          ],
        };

      case '/products/dashboard':
        return {
          title: 'Products Dashboard',
          items: [
            { label: 'Products', href: '/products' },
            { label: 'Dashboard' },
          ],
        };

      case '/login':
        return {
          title: 'Login',
          items: [],
        };

      case '/signup':
        return {
          title: 'Sign Up',
          items: [],
        };

      default:
        return {
          title: 'Unknown',
          items: [{ label: '?', href: '/' }],
        };
    }
  }, [router.pathname]);
}
