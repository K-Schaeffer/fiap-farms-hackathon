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

// Page components - Main application pages and forms
export {
  WebProductionDashboard,
  WebProductionManagement,
  WebSalesDashboard,
  WebSaleForm,
  WebLogin,
  WebSignUp,
} from './pages';

// Kanban components - Production board and cards
export {
  WebProductionKanbanBoard,
  WebProductionCard,
  WebAvailableProductCard,
} from './kanban';

// Modal components - Dialogs and modal forms
export { WebPlantingModal, WebHarvestModal } from './modals';

// Common components - Shared UI elements
export { WebStatCard, WebProductionStatusChip } from './common';

// ===== TYPE EXPORTS =====

// Common component types
export type {
  WebStatCardProps,
  WebProductionStatusChipProps,
  WebProductionStatus,
} from './common';

// Kanban types
export type {
  WebKanbanColumn,
  WebProductionKanbanBoardProps,
  WebProductionCardProps,
  WebAvailableProductCardProps,
  WebProductData,
  WebProductionCardData,
} from './kanban';

// Modal types
export type {
  WebPlantingModalProps,
  WebPlantingFormData,
  WebHarvestModalProps,
  WebHarvestFormData,
} from './modals';

// Page types
export type {
  WebProductionManagementProps,
  WebSaleFormData,
  WebSaleFormProps,
  WebSaleProduct,
  WebSaleItemFormData,
} from './pages';

// ===== UTILITY FUNCTION EXPORTS =====

// Export Web-prefixed utility functions
export {
  getWebProductionStatusColor,
  getWebProductionStatusLabel,
} from './common/WebProductionStatusChip';

export { getWebUnitColor } from './kanban/WebAvailableProductCard';
