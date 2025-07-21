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
export {
  WebMainGrid,
  WebLoginPage,
  WebSignUpPage,
  ProductionManagementPage,
} from './pages';

// Common/reusable components - Shared UI elements
export { WebHighlightedCard, WebStatCard } from './common';

// Kanban components - Production management board
export {
  ProductionKanbanBoard,
  ProductionCard,
  AvailableProductCard,
} from './kanban';

// Modal components - Dialog and form modals
export { PlantingModal, HarvestModal } from './modals';

export type { StatCardProps } from './common';

export type {
  KanbanColumn,
  ProductionKanbanBoardProps,
  ProductionCardProps,
  AvailableProductCardProps,
  ProductData,
  ProductionCardData,
} from './kanban';

export type {
  PlantingModalProps,
  PlantingFormData,
  HarvestModalProps,
  HarvestFormData,
} from './modals';

export type { ProductionManagementPageProps } from './pages';
