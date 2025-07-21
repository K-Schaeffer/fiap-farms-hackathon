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
  currentPath?: string;
  onNavigate?: (href: string) => void;
  navigationItems: NavigationItem[];
}

export interface WebOptionsMenuProps {
  onLogout?: () => Promise<void>;
}

export interface WebAppNavbarProps {
  user?: WebSideMenuUser | null;
  onLogout?: () => Promise<void>;
  title?: string;
  currentPath?: string;
  onNavigate?: (href: string) => void;
  navigationItems: NavigationItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsData {
  items: BreadcrumbItem[];
  title: string;
}

export interface WebHeaderProps {
  breadcrumbs?: BreadcrumbsData;
}

export interface WebMenuContentProps {
  currentPath?: string;
  onNavigate?: (href: string) => void;
  navigationItems: NavigationItem[];
}

export interface NavigationItem {
  text: string;
  icon: React.ReactNode;
  href?: string;
  children?: NavigationItem[];
}
