// src/types/index.ts
import { Usuario } from '../hooks/useAuth';

// Mantener la interfaz User original para compatibilidad, pero ahora usar Usuario de la API
export interface User extends Usuario {
  token?: string; // Opcional para mantener compatibilidad
}

export interface LoginProps {
  onSuccess: (user: Usuario) => void;
}

export interface HeaderProps {
  user: Usuario;
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
  credential: string;
  password: string;
}

export interface LoginState {
  credential: string;
  password: string;
  showPassword: boolean;
}