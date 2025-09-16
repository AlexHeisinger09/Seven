// src/hooks/useTrabajador.ts
import { useState, useCallback } from 'react';

export interface Trabajador {
  // Identificación básica
  traFicha: number;
  traFichaTrabajador: number;
  traRut: string;
  traNombre: string;
  traApellidoP: string;
  traApellidoM: string;
  nombreCompleto: string;
  
  // Fechas importantes
  traFechaIngMdp: string;
  showTraFechaIngMdp: string;
  traFechaNacimiento: string;
  showTraFechaNacimiento: string;
  edad: number;
  
  // Información de contacto
  traDireccion: string;
  traMovil: string;
  traEmail: string;
  direccionCompleta: string;
  
  // Información personal
  traSexo: number;
  tseNombre: string;
  nacCod: number;
  nacDescripcion: string;
  ciuCod: number;
  ciuNombre: string;
  traEstadocivil: number;
  eciNombre: string;
  
  // Información educativa y sindical
  traEducacionCod: number;
  eduNombre: string;
  traSindicatoCod: number;
  sinNombre: string;
  
  // Información de licencia
  traLicenciaCod: number;
  licTipo: string;
  licDescripcion: string;
  
  // Cargas familiares
  traCargasSimple: number;
  traCargaPorInvalides: number;
  
  // Información laboral
  traContratoProvision: string;
  traAccesoVehicular: string;
  traCursoRendido: string;
  traPasePortuario: string;
  traReglamentoInterno: string;
  traVencimientoPase: string;
  showTraVencimientoPase: string;
  
  // Información física
  traTallaRopa: string;
  traNumCalzado: string;
  
  // Seguridad social
  traLibretaInp: string;
  traSubsidioCesantia: string;
  traAfpCod: number;
  afpNombre: string;
  traSaludCod: number;
  salNombre: string;
  traUfIsapre: number;
  ufIsapre: string;
  
  // APV
  traAfpApvCod: number;
  afpApv: string;
  traNcontratoApv: string;
  traApvTipoValor: number;
  tipoValorApv: string;
  traAfpApvPorc: number;
  afpApvPorc: string;
  traFormaPagoApv: string;
  
  // Cuenta 2
  traAfpC2Cod: number;
  afpC2: string;
  traC2TipoValor: number;
  tipoValorC2: string;
  traAfpC2Porc: number;
  afpC2Porc: string;
  
  // Información bancaria
  traFormaPagoCod: number;
  fopaDescripcion: string;
  banCod: number;
  banNombre: string;
  traNcuenta: string;
  
  // Vigencia
  traVigDesde: string;
  showTraVigDesde: string;
  traVigHasta: string;
  showTraVigHasta: string;
  vigente: boolean;
  
  // Información de auditoría
  traUserUltimo: number;
  usuUser: string;
  traFechaUltimo: string;
  showTraFechaUltimo: string;
  
  // Información de salud
  traPensionado: number;
  pensionado: string;
  traCronico: number;
  cronico: string;
  traEnfermedad: string;
  
  // Requerimientos
  traReqContrato: number;
  reqContrato: string;
  
  // Foto
  traFoto: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  error?: string;
}

export interface TrabajadorState {
  trabajador: Trabajador | null;
  loading: boolean;
  error: string | null;
}

const API_BASE_URL = 'http://localhost:8081/api/v1';

export function useTrabajador() {
  const [state, setState] = useState<TrabajadorState>({
    trabajador: null,
    loading: false,
    error: null
  });

  const updateState = useCallback((updates: Partial<TrabajadorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const getMiInformacion = useCallback(async (): Promise<Trabajador | null> => {
    updateState({ loading: true, error: null });

    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        updateState({ 
          loading: false, 
          error: 'No hay sesión activa',
          trabajador: null 
        });
        return null;
      }

      console.log('🔍 Obteniendo información del trabajador...');

      const response = await fetch(`${API_BASE_URL}/trabajadores/me`, {
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
          throw new Error('No se encontró información del trabajador asociada a tu usuario.');
        } else if (response.status >= 500) {
          throw new Error('Error del servidor. Intenta nuevamente más tarde.');
        } else {
          throw new Error(`Error de conexión. Código: ${response.status}`);
        }
      }

      const result: ApiResponse<Trabajador> = await response.json();
      console.log('📦 Información del trabajador recibida:', result);

      if (!result.success) {
        const errorMsg = result.error || result.message || 'Error obteniendo información del trabajador';
        throw new Error(errorMsg);
      }

      const trabajador = result.data;
      console.log('👤 Trabajador cargado:', trabajador.nombreCompleto);

      updateState({
        trabajador: trabajador,
        loading: false,
        error: null
      });

      return trabajador;

    } catch (error) {
      console.error('❌ Error obteniendo información del trabajador:', error);
      
      let errorMessage = 'Error obteniendo información del trabajador.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      updateState({
        trabajador: null,
        loading: false,
        error: errorMessage
      });

      return null;
    }
  }, [updateState]);

  const getTrabajadorByFicha = useCallback(async (fichaTrabajador: number): Promise<Trabajador | null> => {
    updateState({ loading: true, error: null });

    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch(`${API_BASE_URL}/trabajadores/ficha/${fichaTrabajador}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Trabajador no encontrado');
        }
        throw new Error(`Error: ${response.status}`);
      }

      const result: ApiResponse<Trabajador> = await response.json();

      if (!result.success) {
        throw new Error(result.error || result.message || 'Error obteniendo trabajador');
      }

      updateState({
        trabajador: result.data,
        loading: false,
        error: null
      });

      return result.data;

    } catch (error) {
      console.error('Error obteniendo trabajador por ficha:', error);
      
      let errorMessage = 'Error obteniendo información del trabajador';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      updateState({
        trabajador: null,
        loading: false,
        error: errorMessage
      });

      return null;
    }
  }, [updateState]);

  const searchTrabajadores = useCallback(async (nombre: string): Promise<Trabajador[]> => {
    if (!nombre.trim()) {
      return [];
    }

    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch(`${API_BASE_URL}/trabajadores/search?nombre=${encodeURIComponent(nombre)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result: ApiResponse<Trabajador[]> = await response.json();

      if (!result.success) {
        throw new Error(result.error || result.message || 'Error buscando trabajadores');
      }

      return result.data;

    } catch (error) {
      console.error('Error buscando trabajadores:', error);
      return [];
    }
  }, []);

  const getCumpleanosHoy = useCallback(async (): Promise<Trabajador[]> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return [];
      }

      const response = await fetch(`${API_BASE_URL}/trabajadores/cumpleanos/hoy`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        return [];
      }

      const result: ApiResponse<Trabajador[]> = await response.json();

      if (result.success) {
        return result.data;
      }

      return [];

    } catch (error) {
      console.error('Error obteniendo cumpleaños de hoy:', error);
      return [];
    }
  }, []);

  const getTrabajadoresNuevos = useCallback(async (dias: number = 30): Promise<Trabajador[]> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return [];
      }

      const response = await fetch(`${API_BASE_URL}/trabajadores/nuevos?dias=${dias}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        return [];
      }

      const result: ApiResponse<Trabajador[]> = await response.json();

      if (result.success) {
        return result.data;
      }

      return [];

    } catch (error) {
      console.error('Error obteniendo trabajadores nuevos:', error);
      return [];
    }
  }, []);

  const clearState = useCallback(() => {
    setState({
      trabajador: null,
      loading: false,
      error: null
    });
  }, []);

  return {
    trabajador: state.trabajador,
    loading: state.loading,
    error: state.error,
    getMiInformacion,
    getTrabajadorByFicha,
    searchTrabajadores,
    getCumpleanosHoy,
    getTrabajadoresNuevos,
    clearState
  };
}