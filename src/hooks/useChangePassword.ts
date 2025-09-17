import { useState, useCallback } from 'react';
import { useNotification } from '../contexts/NotificationContext';

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

  const { showSuccess, showError } = useNotification();

  const updateState = useCallback((updates: Partial<ChangePasswordState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const changePassword = useCallback(async (request: ChangePasswordRequest): Promise<boolean> => {
    updateState({ loading: true, error: null, success: false, message: null });

    try {
      // Validar que las contraseñas nuevas coincidan
      if (request.newPassword !== request.confirmPassword) {
        const errorMsg = 'Las contraseñas nuevas no coinciden';
        updateState({
          loading: false,
          error: errorMsg,
          success: false
        });
        return false;
      }

      // Validar longitud mínima
      if (request.newPassword.length < 1) {
        const errorMsg = 'La nueva contraseña no puede estar vacía';
        updateState({
          loading: false,
          error: errorMsg,
          success: false
        });
        return false;
      }

      const token = localStorage.getItem('auth_token');
      if (!token) {
        const errorMsg = 'No hay sesión activa';
        updateState({
          loading: false,
          error: errorMsg,
          success: false
        });
        showError(errorMsg);
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
        const successMsg = 'Contraseña cambiada exitosamente';
        updateState({
          loading: false,
          error: null,
          success: true,
          message: successMsg
        });
        showSuccess('¡Contraseña cambiada exitosamente!');
        return true;
      } else {
        // Error del servidor - Mejorar mensajes de error comunes
        let errorMessage = result.message || result.error || 'Error al cambiar la contraseña';
        
        // Mensajes más amigables para errores específicos
        if (errorMessage.includes('clave antigua no conincide') || 
            errorMessage.includes('contraseña actual no es correcta') ||
            errorMessage.includes('password is incorrect')) {
          errorMessage = 'La contraseña actual no es correcta. Verifica e intenta nuevamente.';
        } else if (errorMessage.includes('contraseña muy corta') || 
                   errorMessage.includes('password too short')) {
          errorMessage = 'La nueva contraseña debe tener al menos 6 caracteres.';
        } else if (errorMessage.includes('contraseñas deben ser diferentes') ||
                   errorMessage.includes('same password')) {
          errorMessage = 'La nueva contraseña debe ser diferente a la actual.';
        }
        
        updateState({
          loading: false,
          error: errorMessage,
          success: false
        });
        return false;
      }

    } catch (error) {
      console.error('❌ Error en cambio de contraseña:', error);
      
      let errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión e intenta nuevamente.';
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Error de conexión. Verifica tu internet e intenta nuevamente.';
        } else {
          errorMessage = error.message;
        }
      }

      updateState({
        loading: false,
        error: errorMessage,
        success: false
      });

      showError(errorMessage);
      return false;
    }
  }, [updateState, showSuccess, showError]);

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
