// src/config/api.ts
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8081/api/v1',
  ENDPOINTS: {
    LOGIN: '/auth/login',
    VALIDATE: '/auth/validate', 
    ME: '/auth/me',
    LOGOUT: '/auth/logout'
  },
  DEFAULT_PASSWORD: '123' // Password por defecto según tu API
} as const;

// Función helper para construir URLs completas
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};