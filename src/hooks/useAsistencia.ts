// src/hooks/useAsistencia.ts
import { useState, useCallback } from 'react';

export interface AsistenciaRecord {
  faeCod: number;
  cnomCod: number;
  faeTipoFaena: number;
  tfaDescripcion: string;
  faeFechaInicialPlanif: string;
  showFechaPlanif: string;
  faeHoraInicialPlanif: string;
  faeTurnoCod: number;
  turnoNombre: string;
  traFicha: number;
  traFichaTrabajador: number;
  traNombre: string;
  traApellidoP: string;
  traApellidoM: string;
  nombreCompleto: string;
  traSindicatoCod: number;
  sinNombre: string;
  dasiEntrada: string;
  horaEntrada: string;
  dasiSalida: string;
  horaSalida: string;
  dasiAusencia: string;
  carCodAsociaFaena: number;
  carNombre: string;
  tieneAsistencia: boolean;
}

export interface EstadisticasAsistencia {
  totalDias: number;
  diasAsistidos: number;
  diasAusentes: number;
  porcentajeAsistencia: number;
  porcentajeAusencias: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  error?: string;
}

export interface AsistenciaState {
  asistencias: AsistenciaRecord[];
  diasConAsistencia: number[];
  estadisticas: EstadisticasAsistencia | null;
  ultimasAsistencias: AsistenciaRecord[];
  asistenciasFecha: AsistenciaRecord[];
  loading: boolean;
  error: string | null;
}

const API_BASE_URL = 'http://localhost:8081/api/v1';

export function useAsistencia() {
  const [state, setState] = useState<AsistenciaState>({
    asistencias: [],
    diasConAsistencia: [],
    estadisticas: null,
    ultimasAsistencias: [],
    asistenciasFecha: [],
    loading: false,
    error: null
  });

  const updateState = useCallback((updates: Partial<AsistenciaState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const getAsistenciaMensual = useCallback(async (anio: number, mes: number): Promise<AsistenciaRecord[]> => {
    updateState({ loading: true, error: null });

    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      // Validar parámetros
      if (mes < 1 || mes > 12) {
        throw new Error('El mes debe estar entre 1 y 12');
      }

      if (anio < 2000) {
        throw new Error('El año debe ser mayor a 2000');
      }

      console.log(`🗓️ Obteniendo asistencia para ${mes}/${anio}...`);

      const response = await fetch(`${API_BASE_URL}/asistencia/me/mes/${anio}/${mes}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      console.log('📡 Respuesta del servidor:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sesión expirada. Inicia sesión nuevamente.');
        } else if (response.status === 404) {
          throw new Error('No se encontró información de asistencia.');
        } else {
          throw new Error(`Error del servidor. Código: ${response.status}`);
        }
      }

      const result: ApiResponse<AsistenciaRecord[]> = await response.json();
      console.log('📦 Asistencias recibidas:', result);

      if (!result.success) {
        const errorMsg = result.error || result.message || 'Error obteniendo asistencias';
        throw new Error(errorMsg);
      }

      const asistencias = result.data || [];
      console.log(`✅ Se obtuvieron ${asistencias.length} registros de asistencia`);

      updateState({
        asistencias: asistencias,
        loading: false,
        error: null
      });

      return asistencias;

    } catch (error) {
      console.error('❌ Error obteniendo asistencia mensual:', error);
      
      let errorMessage = 'Error obteniendo asistencias.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      updateState({
        asistencias: [],
        loading: false,
        error: errorMessage
      });

      return [];
    }
  }, [updateState]);

  const getAsistenciaFecha = useCallback(async (fecha: string): Promise<AsistenciaRecord[]> => {
    updateState({ loading: true, error: null });

    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      console.log(`🗓️ Obteniendo asistencia para fecha ${fecha}...`);

      const response = await fetch(`${API_BASE_URL}/asistencia/me/fecha/${fecha}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sesión expirada. Inicia sesión nuevamente.');
        } else {
          throw new Error(`Error del servidor. Código: ${response.status}`);
        }
      }

      const result: ApiResponse<AsistenciaRecord[]> = await response.json();

      if (!result.success) {
        const errorMsg = result.error || result.message || 'Error obteniendo asistencias de la fecha';
        throw new Error(errorMsg);
      }

      const asistencias = result.data || [];
      console.log(`✅ Se obtuvieron ${asistencias.length} registros para la fecha ${fecha}`);

      updateState({
        asistenciasFecha: asistencias,
        loading: false,
        error: null
      });

      return asistencias;

    } catch (error) {
      console.error('❌ Error obteniendo asistencia por fecha:', error);
      
      let errorMessage = 'Error obteniendo asistencias de la fecha.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      updateState({
        asistenciasFecha: [],
        loading: false,
        error: errorMessage
      });

      return [];
    }
  }, [updateState]);

  const getDiasConAsistencia = useCallback(async (anio: number, mes: number): Promise<number[]> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      console.log(`📅 Obteniendo días con asistencia para ${mes}/${anio}...`);

      const response = await fetch(`${API_BASE_URL}/asistencia/me/dias-asistencia/${anio}/${mes}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Error del servidor. Código: ${response.status}`);
      }

      const result: ApiResponse<number[]> = await response.json();

      if (!result.success) {
        throw new Error(result.error || result.message || 'Error obteniendo días con asistencia');
      }

      const dias = result.data || [];
      console.log(`✅ Días con asistencia:`, dias);

      updateState({
        diasConAsistencia: dias,
        error: null
      });

      return dias;

    } catch (error) {
      console.error('❌ Error obteniendo días con asistencia:', error);
      updateState({
        diasConAsistencia: [],
        error: error instanceof Error ? error.message : 'Error obteniendo días con asistencia'
      });
      return [];
    }
  }, [updateState]);

  const getEstadisticasMensuales = useCallback(async (anio: number, mes: number): Promise<EstadisticasAsistencia | null> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      console.log(`📊 Obteniendo estadísticas para ${mes}/${anio}...`);

      const response = await fetch(`${API_BASE_URL}/asistencia/me/estadisticas/${anio}/${mes}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Error del servidor. Código: ${response.status}`);
      }

      const result: ApiResponse<EstadisticasAsistencia> = await response.json();

      if (!result.success) {
        throw new Error(result.error || result.message || 'Error obteniendo estadísticas');
      }

      const estadisticas = result.data;
      console.log(`✅ Estadísticas obtenidas:`, estadisticas);

      updateState({
        estadisticas: estadisticas,
        error: null
      });

      return estadisticas;

    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      updateState({
        estadisticas: null,
        error: error instanceof Error ? error.message : 'Error obteniendo estadísticas'
      });
      return null;
    }
  }, [updateState]);

  const getUltimasAsistencias = useCallback(async (limite: number = 10): Promise<AsistenciaRecord[]> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      console.log(`📋 Obteniendo últimas ${limite} asistencias...`);

      const response = await fetch(`${API_BASE_URL}/asistencia/me/ultimas?limite=${limite}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Error del servidor. Código: ${response.status}`);
      }

      const result: ApiResponse<AsistenciaRecord[]> = await response.json();

      if (!result.success) {
        throw new Error(result.error || result.message || 'Error obteniendo últimas asistencias');
      }

      const asistencias = result.data || [];
      console.log(`✅ Se obtuvieron ${asistencias.length} últimas asistencias`);

      updateState({
        ultimasAsistencias: asistencias,
        error: null
      });

      return asistencias;

    } catch (error) {
      console.error('❌ Error obteniendo últimas asistencias:', error);
      updateState({
        ultimasAsistencias: [],
        error: error instanceof Error ? error.message : 'Error obteniendo últimas asistencias'
      });
      return [];
    }
  }, [updateState]);

  const clearState = useCallback(() => {
    setState({
      asistencias: [],
      diasConAsistencia: [],
      estadisticas: null,
      ultimasAsistencias: [],
      asistenciasFecha: [],
      loading: false,
      error: null
    });
  }, []);

  return {
    // Estado
    asistencias: state.asistencias,
    diasConAsistencia: state.diasConAsistencia,
    estadisticas: state.estadisticas,
    ultimasAsistencias: state.ultimasAsistencias,
    asistenciasFecha: state.asistenciasFecha,
    loading: state.loading,
    error: state.error,
    
    // Métodos
    getAsistenciaMensual,
    getAsistenciaFecha,
    getDiasConAsistencia,
    getEstadisticasMensuales,
    getUltimasAsistencias,
    clearState
  };
}