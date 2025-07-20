// Shell components - Navigation, menus, and shell-level UI elements
export { WebAppNavbar } from './WebAppNavbar';
export { WebHeader } from './WebHeader';
export { WebSideMenu } from './WebSideMenu';
export { WebSideMenuMobile } from './WebSideMenuMobile';
export { WebMenuButton } from './WebMenuButton';
export { WebMenuContent } from './WebMenuContent';
export { WebNavbarBreadcrumbs } from './WebNavbarBreadcrumbs';
export { WebOptionsMenu } from './WebOptionsMenu';

// Types
export interface WebSideMenuUser {
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
}

export interface WebSideMenuProps {
  user?: WebSideMenuUser | null;
  onLogout?: () => Promise<void>;
}

export interface WebOptionsMenuProps {
  onLogout?: () => Promise<void>;
}
