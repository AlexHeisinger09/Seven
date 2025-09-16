// src/hooks/useChangePassword.ts
import { useState, useCallback } from 'react';

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordState {
  loading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
}

const API_BASE_URL = 'http://localhost:8081/api/v1';

export function useChangePassword() {
  const [state, setState] = useState<ChangePasswordState>({
    loading: false,
    error: null,
    success: false,
    message: null
  });

  const updateState = useCallback((updates: Partial<ChangePasswordState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const changePassword = useCallback(async (request: ChangePasswordRequest): Promise<boolean> => {
    updateState({ loading: true, error: null, success: false, message: null });

    try {
      // Validar que las contraseñas nuevas coincidan
      if (request.newPassword !== request.confirmPassword) {
        updateState({
          loading: false,
          error: 'Las contraseñas nuevas no coinciden',
          success: false
        });
        return false;
      }

      // Validar longitud mínima
      if (request.newPassword.length < 1) {
        updateState({
          loading: false,
          error: 'La nueva contraseña no puede estar vacía',
          success: false
        });
        return false;
      }

      const token = localStorage.getItem('auth_token');
      if (!token) {
        updateState({
          loading: false,
          error: 'No hay sesión activa',
          success: false
        });
        return false;
      }

      console.log('🔐 Enviando solicitud de cambio de contraseña...');

      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(request)
      });

      console.log('📡 Respuesta del servidor:', response.status);

      const result = await response.json();
      console.log('📦 Datos recibidos:', result);

      if (response.ok && result.success) {
        // Éxito
        updateState({
          loading: false,
          error: null,
          success: true,
          message: 'Contraseña cambiada exitosamente'
        });
        return true;
      } else {
        // Error del servidor
        const errorMessage = result.message || result.error || 'Error al cambiar la contraseña';
        updateState({
          loading: false,
          error: errorMessage,
          success: false
        });
        return false;
      }

    } catch (error) {
      console.error('❌ Error en cambio de contraseña:', error);
      
      let errorMessage = 'Error de conexión. Verifica tu internet e intenta nuevamente.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      updateState({
        loading: false,
        error: errorMessage,
        success: false
      });

      return false;
    }
  }, [updateState]);

  const clearState = useCallback(() => {
    setState({
      loading: false,
      error: null,
      success: false,
      message: null
    });
  }, []);

  return {
    loading: state.loading,
    error: state.error,
    success: state.success,
    message: state.message,
    changePassword,
    clearState
  };
}