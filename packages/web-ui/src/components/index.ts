// ===== ORGANIZED COMPONENT EXPORTS =====

// Shell components - Navigation, menus, and shell-level UI
export {
  WebAppNavbar,
  WebHeader,
  WebSideMenu,
  WebSideMenuMobile,
  WebMenuButton,
  WebMenuContent,
  WebNavbarBreadcrumbs,
  WebOptionsMenu,
} from './shell';

// Shell component types
export type {
  WebSideMenuUser,
  WebSideMenuProps,
  WebOptionsMenuProps,
} from './shell';

// Chart components - Data visualization and analytics
export {
  WebUserByCountryChart,
  WebPageViewsBarChart,
  WebSessionsChart,
} from './charts';

// Grid components - Data tables and layouts
export { WebCustomizedDataGrid, renderAvatar, columns, rows } from './grids';

// Page components - Complete page layouts
export { WebMainGrid, WebLoginPage, WebSignUpPage } from './pages';

// Common/reusable components - Shared UI elements
export { WebHighlightedCard, WebStatCard } from './common';

export type { StatCardProps } from './common';
