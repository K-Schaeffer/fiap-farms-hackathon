import { useRouter } from 'next/router';
import { WebNavigationItem } from '@fiap-farms/web-ui';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import PieChart from '@mui/icons-material/PieChart';

export function useNavigation() {
  const router = useRouter();

  const navigationItems: WebNavigationItem[] = [
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
          text: 'New',
          icon: <AddIcon />,
          href: '/sales/new',
        },
        {
          text: 'Dashboard',
          icon: <AssessmentIcon />,
          href: '/sales/dashboard',
        },
      ],
    },
    {
      text: 'Products',
      icon: <InventoryIcon />,
      children: [
        {
          text: 'Management',
          icon: <AgricultureIcon />,
          href: '/products/management',
        },
        {
          text: 'Dashboard',
          icon: <PieChart />,
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
