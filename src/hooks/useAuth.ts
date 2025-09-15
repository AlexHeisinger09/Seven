// src/hooks/useAuth.ts
import { useState, useCallback } from 'react';

export interface Usuario {
  usu_cod: number;
  usu_user: string;
  usu_rut: string;
  usu_nombre: string;
  usu_apellido_p: string;
  usu_apellido_m: string;
  usu_email: string;
  usu_vig_desde: string;
  usu_vig_hasta: string;
  usu_tipo: number;
  usu_ultima_conexion: string | null;
  usu_ficha: number | null;
  nombre_completo: string;
  vigente: boolean;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  usuario: Usuario;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  error?: string;
}

export interface LoginRequest {
  credential: string;
  password: string;
}

export interface AuthState {
  user: Usuario | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const API_BASE_URL = 'http://localhost:8081/api/v1';

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('auth_token'),
    loading: false,
    error: null
  });

  const updateState = useCallback((updates: Partial<AuthState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const login = useCallback(async (credential: string, password: string): Promise<void> => {
    updateState({ loading: true, error: null });

    try {
      const loginData: LoginRequest = {
        credential: credential.trim(),
        password: password
      };

      console.log('🔐 Iniciando login con:', { credential: loginData.credential });

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });

      console.log('📡 Respuesta del servidor:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Credenciales inválidas. Verifica tu usuario y contraseña.');
        } else if (response.status === 403) {
          throw new Error('Acceso denegado. Tu cuenta podría estar inactiva.');
        } else if (response.status >= 500) {
          throw new Error('Error del servidor. Intenta nuevamente más tarde.');
        } else {
          throw new Error(`Error de conexión. Código: ${response.status}`);
        }
      }

      const result: ApiResponse<LoginResponse> = await response.json();
      console.log('📦 Datos recibidos:', result);
      console.log('📦 Usuario completo:', result.data.usuario);

      if (!result.success) {
        // Si el backend devuelve un mensaje específico, usarlo
        const errorMsg = result.error || result.message || 'Error en el login';
        if (errorMsg.toLowerCase().includes('credencial') || errorMsg.toLowerCase().includes('inválid')) {
          throw new Error('Credenciales inválidas. Verifica tu usuario y contraseña.');
        }
        throw new Error(errorMsg);
      }

      const { token, usuario } = result.data;
      console.log('👤 Usuario a guardar:', usuario);

      localStorage.setItem('auth_token', token);

      updateState({
        user: usuario,
        token: token,
        loading: false,
        error: null
      });

      console.log('✅ Login exitoso para:', usuario.nombre_completo);

    } catch (error) {
      console.error('❌ Error en login:', error);
      
      let errorMessage = 'Error de conexión. Verifica tu internet e intenta nuevamente.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      localStorage.removeItem('auth_token');
      
      updateState({
        user: null,
        token: null,
        loading: false,
        error: errorMessage
      });

      throw new Error(errorMessage);
    }
  }, [updateState]);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    updateState({
      user: null,
      token: null,
      loading: false,
      error: null
    });
  }, [updateState]);

  const validateToken = useCallback(async (): Promise<boolean> => {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const result: ApiResponse<Usuario> = await response.json();
        if (result.success) {
          updateState({
            user: result.data,
            token: token,
            loading: false,
            error: null
          });
          return true;
        }
      }
      
      localStorage.removeItem('auth_token');
      updateState({
        user: null,
        token: null,
        loading: false,
        error: null
      });
      return false;

    } catch (error) {
      console.error('Error validando token:', error);
      localStorage.removeItem('auth_token');
      updateState({
        user: null,
        token: null,
        loading: false,
        error: null
      });
      return false;
    }
  }, [updateState]);

  const getCurrentUser = useCallback(async (): Promise<Usuario | null> => {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      return null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const result: ApiResponse<Usuario> = await response.json();
        if (result.success) {
          updateState({
            user: result.data,
            token: token,
            loading: false,
            error: null
          });
          return result.data;
        }
      }
      
      return null;

    } catch (error) {
      console.error('Error obteniendo usuario actual:', error);
      return null;
    }
  }, [updateState]);

  return {
    user: state.user,
    token: state.token,
    loading: state.loading,
    error: state.error,
    isAuthenticated: !!state.user && !!state.token,
    login,
    logout,
    validateToken,
    getCurrentUser
  };
}