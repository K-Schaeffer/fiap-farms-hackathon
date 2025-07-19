// Shell components - Navigation, menus, and shell-level UI elements
export { default as WebAppNavbar } from './WebAppNavbar';
export { default as WebHeader } from './WebHeader';
export { default as WebSideMenu } from './WebSideMenu';
export { default as WebSideMenuMobile } from './WebSideMenuMobile';
export { default as WebMenuButton } from './WebMenuButton';
export { default as WebMenuContent } from './WebMenuContent';
export { default as WebNavbarBreadcrumbs } from './WebNavbarBreadcrumbs';
export { default as WebOptionsMenu } from './WebOptionsMenu';

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
