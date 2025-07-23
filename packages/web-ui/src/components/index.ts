export * from './pages';
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
  WebAppNavbarProps,
  WebHeaderProps,
  WebBreadcrumbsData,
  WebNavigationItem,
  WebMenuContentProps,
  WebNotificationsData,
} from './shell';

// Page components - Complete page layouts
export {
  WebLoginPage,
  WebSignUpPage,
  WebProductionManagement,
  WebProductionDashboard,
  WebSaleForm,
} from './pages';

// Common/reusable components - Shared UI elements
export { WebStatCard } from './common';

// Kanban components - Production management board
export {
  WebProductionKanbanBoard,
  WebProductionCard,
  WebAvailableProductCard,
} from './kanban';

// Modal components - Dialog and form modals
export { WebPlantingModal, WebHarvestModal } from './modals';

export type { WebStatCardProps } from './common';

export type {
  WebKanbanColumn,
  WebProductionKanbanBoardProps,
  WebProductionCardProps,
  WebAvailableProductCardProps,
  WebProductData,
  WebProductionCardData,
} from './kanban';

export type {
  WebPlantingModalProps,
  WebPlantingFormData,
  WebHarvestModalProps,
  WebHarvestFormData,
} from './modals';

export type {
  WebProductionManagementProps,
  WebSaleFormData,
  WebSaleFormProps,
  WebSaleProduct,
} from './pages';
