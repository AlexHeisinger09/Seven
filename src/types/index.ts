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
}

export interface SidebarItem {
  icon: string;
  label: string;
  href?: string;
}

export interface LoginFormData {
  email: string;
}

export interface LoginState {
  email: string;
  error: string;
  loading: boolean;
}