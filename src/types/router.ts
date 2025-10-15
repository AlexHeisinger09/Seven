// src/types/router.ts
export type RouteKey = 
  | 'portal'
  | 'mi-ficha'
  | 'beneficios'
  | 'reconocimientos'
  | 'configuracion'
  | 'centro-ayuda'
  | 'notificaciones';

export interface Route {
  key: RouteKey;
  label: string;
  icon: React.ReactNode;
  component: React.ComponentType<any>;
  isActive?: boolean;
}

export interface RouterContextType {
  currentRoute: RouteKey;
  navigate: (route: RouteKey) => void;
  routes: Route[];
}