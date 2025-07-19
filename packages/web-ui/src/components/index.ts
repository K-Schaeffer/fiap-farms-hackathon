// ===== ORGANIZED COMPONENT EXPORTS =====

// Shell components - Navigation, menus, and shell-level UI
export {
  AppNavbar,
  Header,
  SideMenu,
  SideMenuMobile,
  MenuButton,
  MenuContent,
  NavbarBreadcrumbs,
  OptionsMenu,
} from './shell';

// Chart components - Data visualization and analytics
export { ChartUserByCountry, PageViewsBarChart, SessionsChart } from './charts';

// Grid components - Data tables and layouts
export { CustomizedDataGrid, renderAvatar, columns, rows } from './grids';

// Page components - Complete page layouts
export { MainGrid } from './pages';

// Common/reusable components - Shared UI elements
export { HighlightedCard, StatCard } from './common';

export type { StatCardProps } from './common';
