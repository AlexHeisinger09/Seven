export interface User {
  token: string;
  email: string;
}

export interface LoginProps {
  onSuccess: (user: User) => void;
}

export interface HeaderProps {
  user: User;
  onSignOut: () => void;
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onToggleCollapse: () => void;
}

export interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
}

export interface ContentProps {
  isSidebarCollapsed?: boolean;
}

export interface SidebarItem {
  icon: string;
  label: string;
  href?: string;
  isActive?: boolean;
}

export interface LoginFormData {
  email: string;
}

export interface LoginState {
  email: string;
  error: string;
  loading: boolean;
}