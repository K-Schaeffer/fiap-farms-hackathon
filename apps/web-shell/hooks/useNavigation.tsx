import { useRouter } from 'next/router';
import { NavigationItem } from '@fiap-farms/web-ui';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import AssessmentIcon from '@mui/icons-material/Assessment';

export function useNavigation() {
  const router = useRouter();

  const navigationItems: NavigationItem[] = [
    {
      text: 'Home',
      icon: <HomeIcon />,
      href: '/',
    },
    {
      text: 'Sales',
      icon: <ShoppingCartIcon />,
      children: [
        {
          text: 'Dashboard',
          icon: <DashboardIcon />,
          href: '/sales/dashboard',
        },
        {
          text: 'New',
          icon: <AddIcon />,
          href: '/sales/new',
        },
      ],
    },
    {
      text: 'Products',
      icon: <InventoryIcon />,
      children: [
        {
          text: 'Production Management',
          icon: <AssessmentIcon />,
          href: '/products/management',
        },
        {
          text: 'Dashboard',
          icon: <DashboardIcon />,
          href: '/products/dashboard',
        },
      ],
    },
  ];

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  return {
    navigationItems,
    currentPath: router.pathname,
    onNavigate: handleNavigate,
  };
}
