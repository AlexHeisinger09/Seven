// src/hooks/useNombradas.ts
import { useState, useCallback } from 'react';

export interface Nombrada {
  traFichaTrabajador: number;
  traNombre: string;
  traApellidoP: string;
  traApellidoM: string;
  tnomDescripcion: string;
  tfaDescripcion: string;
  faeTurnoCod: number;
  faeFechaInicialPlanif: string;
  faeHoraInicialPlanif: string;
  faeHoraFinalPlanif: string;
  nombreCompleto: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  error?: string;
}

export interface NombradaState {
  nombradas: Nombrada[];
  loading: boolean;
  error: string | null;
}

const API_BASE_URL = 'http://localhost:8081/api/v1';

export function useNombradas() {
  const [state, setState] = useState<NombradaState>({
    nombradas: [],
    loading: false,
    error: null
  });

  const updateState = useCallback((updates: Partial<NombradaState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Obtener mis nombradas por fecha y turno
   */
  const getMisNombradas = useCallback(async (
    fecha: string, 
    turno: number
  ): Promise<Nombrada[]> => {
    updateState({ loading: true, error: null });

    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        updateState({ 
          loading: false, 
          error: 'No hay sesión activa',
          nombradas: [] 
        });
        return [];
      }

      console.log('🔍 Obteniendo nombradas para fecha:', fecha, 'turno:', turno);

      const response = await fetch(
        `${API_BASE_URL}/nombradas/me?fecha=${fecha}&turno=${turno}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('📡 Respuesta del servidor:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sesión expirada. Inicia sesión nuevamente.');
        } else if (response.status === 404) {
          throw new Error('No se encontraron nombradas.');
        } else if (response.status >= 500) {
          throw new Error('Error del servidor. Intenta nuevamente más tarde.');
        } else {
          throw new Error(`Error de conexión. Código: ${response.status}`);
        }
      }

      const result: ApiResponse<Nombrada[]> = await response.json();
      console.log('📦 Nombradas recibidas:', result);

      if (!result.success) {
        const errorMsg = result.error || result.message || 'Error obteniendo nombradas';
        throw new Error(errorMsg);
      }

      const nombradas = result.data;
      console.log('✅ Total de nombradas:', nombradas.length);

      updateState({
        nombradas: nombradas,
        loading: false,
        error: null
      });

      return nombradas;

    } catch (error) {
      console.error('❌ Error obteniendo nombradas:', error);
      
      let errorMessage = 'Error obteniendo nombradas.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      updateState({
        nombradas: [],
        loading: false,
        error: errorMessage
      });

      return [];
    }
  }, [updateState]);

  /**
   * Obtener todas las nombradas por fecha y turno (para administradores)
   */
  const getAllNombradas = useCallback(async (
    fecha: string, 
    turno: number
  ): Promise<Nombrada[]> => {
    updateState({ loading: true, error: null });

    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch(
        `${API_BASE_URL}/nombradas?fecha=${fecha}&turno=${turno}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('No se encontraron nombradas');
        }
        throw new Error(`Error: ${response.status}`);
      }

      const result: ApiResponse<Nombrada[]> = await response.json();

      if (!result.success) {
        throw new Error(result.error || result.message || 'Error obteniendo nombradas');
      }

      updateState({
        nombradas: result.data,
        loading: false,
        error: null
      });

      return result.data;

    } catch (error) {
      console.error('Error obteniendo todas las nombradas:', error);
      
      let errorMessage = 'Error obteniendo nombradas';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      updateState({
        nombradas: [],
        loading: false,
        error: errorMessage
      });

      return [];
    }
  }, [updateState]);

  const clearState = useCallback(() => {
    setState({
      nombradas: [],
      loading: false,
      error: null
    });
  }, []);

  return {
    nombradas: state.nombradas,
    loading: state.loading,
    error: state.error,
    getMisNombradas,
    getAllNombradas,
    clearState
  };
}