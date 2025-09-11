export const COLORS = {
  BUK_BLUE: '#2E49B7',
  BUK_DARK: '#1C2C6B',
  ACCENT_YELLOW: '#FFB100',
} as const;

export const SIDEBAR_ITEMS = [
  { icon: '📊', label: 'Dashboard' },
  { icon: '👤', label: 'Colaboradores' },
  { icon: '📝', label: 'Remuneraciones' },
  { icon: '⏱️', label: 'Asistencia' },
  { icon: '📄', label: 'Documentos' },
  { icon: '⚙️', label: 'Configuración' },
] as const;

export const CONTENT_MODULES = [
  'Colaboradores',
  'Tareas', 
  'Documentos',
  'Novedades',
  'Licencias',
  'Beneficios'
] as const;