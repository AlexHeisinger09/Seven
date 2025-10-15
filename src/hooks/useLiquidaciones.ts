import { useState, useCallback } from 'react';

export interface LiquidacionDetalle {
  cnomCod: number;
  faeFechaInicial: string;
  faeFechaInicialShow: string;
  traFicha: number;
  trabajadorNombre: string;
  trabajadorApellidoP: string;
  trabajadorApellidoM: string;
  carNombre: string;
  sinNombre: string;
  traContratoProvision: string;
  faeCod: number;
  tfaDescripcion: string;
  navDescripcion: string;
  estado: string;
  permiso: string;
  
  // Haberes imponibles
  valorBase: number;
  numHorasExtra: number;
  valorHoraExtra: number;
  tonelajeOCamion: number;
  tonPagado: number;
  otrosImponibles: number;
  totalImponible: number;
  
  // Haberes no imponibles
  colacion: number;
  movilizacion: number;
  movCol: number;
  colAdicional: number;
  otrosNoImponibles: number;
  totalHaber: number;
  
  // Descuentos previsionales
  afpNombre: string;
  afpPorcMasComision: string;
  descAfp: number;
  descC2: number;
  descApv: number;
  salNombre: string;
  descSalud: number;
  imptoUnico: number;
  
  // Otros descuentos
  ptmoMuelle: number;
  ptmoCaja: number;
  cuotaSindicato: number;
  otrosDescuentos: number;
  totalDescuentos: number;
  
  // Líquido
  liquidoPago: number;
  
  fechaLiquidacionShow: string;
  nomino: string;
  finalizo: string;
  liquido: string;
  glosaNomina: string;
  glosaFaena: string;
}

export interface LiquidacionAgrupada {
  periodo: string; // YYYYMM
  mes: string; // Nombre del mes
  anio: string;
  diasTrabajados: number;
  liquidaciones: LiquidacionDetalle[];
  
  // Totales agrupados
  totalHaberesImponibles: number;
  totalHaberesNoImponibles: number;
  totalHaberes: number;
  totalDescuentos: number;
  liquidoTotal: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  error?: string;
}

export interface LiquidacionesResponse {
  liquidaciones: LiquidacionDetalle[];
  total: number;
  hasMore: boolean;
}

const API_BASE_URL = 'http://localhost:8081/api/v1';

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export function useLiquidaciones() {
  const [liquidaciones, setLiquidaciones] = useState<LiquidacionDetalle[]>([]);
  const [liquidacionesAgrupadas, setLiquidacionesAgrupadas] = useState<LiquidacionAgrupada[]>([]);
  const [periodos, setPeriodos] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const agruparPorPeriodo = useCallback((liquidaciones: LiquidacionDetalle[]): LiquidacionAgrupada[] => {
    const grupos = new Map<string, LiquidacionDetalle[]>();
    
    // Agrupar liquidaciones por período
    liquidaciones.forEach(liq => {
      const fecha = new Date(liq.faeFechaInicial);
      const periodo = `${fecha.getFullYear()}${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      
      if (!grupos.has(periodo)) {
        grupos.set(periodo, []);
      }
      grupos.get(periodo)?.push(liq);
    });

    // Convertir a array y calcular totales
    const agrupadas: LiquidacionAgrupada[] = [];
    
    grupos.forEach((liquidaciones, periodo) => {
      const anio = periodo.substring(0, 4);
      const mesNumero = parseInt(periodo.substring(4, 6));
      const mes = MESES[mesNumero - 1];
      
      const totalHaberesImponibles = liquidaciones.reduce((sum, liq) => sum + liq.totalImponible, 0);
      const totalHaberesNoImponibles = liquidaciones.reduce((sum, liq) => 
        sum + liq.colacion + liq.movilizacion + liq.movCol + liq.colAdicional + liq.otrosNoImponibles, 0
      );
      const totalHaberes = liquidaciones.reduce((sum, liq) => sum + liq.totalHaber, 0);
      const totalDescuentos = liquidaciones.reduce((sum, liq) => sum + liq.totalDescuentos, 0);
      const liquidoTotal = liquidaciones.reduce((sum, liq) => sum + liq.liquidoPago, 0);
      
      agrupadas.push({
        periodo,
        mes,
        anio,
        diasTrabajados: liquidaciones.length,
        liquidaciones: liquidaciones.sort((a, b) => 
          new Date(b.faeFechaInicial).getTime() - new Date(a.faeFechaInicial).getTime()
        ),
        totalHaberesImponibles,
        totalHaberesNoImponibles,
        totalHaberes,
        totalDescuentos,
        liquidoTotal
      });
    });

    // Ordenar por período descendente (más reciente primero)
    return agrupadas.sort((a, b) => b.periodo.localeCompare(a.periodo));
  }, []);

  const getMisLiquidaciones = useCallback(async (
    page: number = 1,
    limit: number = 100,
    periodo?: number,
    fechaDesde?: string,
    fechaHasta?: string
  ): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      let url = `${API_BASE_URL}/liquidaciones/me?page=${page}&limit=${limit}`;
      
      if (periodo) {
        url += `&periodo=${periodo}`;
      }
      
      if (fechaDesde && fechaHasta) {
        url += `&fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`;
      }

      console.log('🔍 Obteniendo liquidaciones:', url);

      const response = await fetch(url, {
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
          throw new Error('No se encontraron liquidaciones.');
        } else if (response.status >= 500) {
          throw new Error('Error del servidor. Intenta nuevamente más tarde.');
        } else {
          throw new Error(`Error de conexión. Código: ${response.status}`);
        }
      }

      const result: ApiResponse<LiquidacionesResponse> = await response.json();
      console.log('📦 Liquidaciones recibidas:', result);

      if (!result.success) {
        throw new Error(result.error || result.message || 'Error obteniendo liquidaciones');
      }

      const liquidacionesData = result.data.liquidaciones;
      console.log('💰 Total liquidaciones cargadas:', liquidacionesData.length);

      setLiquidaciones(liquidacionesData);
      
      // Agrupar por período
      const agrupadas = agruparPorPeriodo(liquidacionesData);
      setLiquidacionesAgrupadas(agrupadas);

    } catch (error) {
      console.error('❌ Error obteniendo liquidaciones:', error);
      
      let errorMessage = 'Error obteniendo liquidaciones.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      setLiquidaciones([]);
      setLiquidacionesAgrupadas([]);
    } finally {
      setLoading(false);
    }
  }, [agruparPorPeriodo]);

  const getPeriodosDisponibles = useCallback(async (): Promise<void> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return;
      }

      const response = await fetch(`${API_BASE_URL}/liquidaciones/periodos`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        return;
      }

      const result: ApiResponse<number[]> = await response.json();

      if (result.success) {
        setPeriodos(result.data);
      }

    } catch (error) {
      console.error('Error obteniendo períodos disponibles:', error);
    }
  }, []);

  const getLiquidacionDetalle = useCallback(async (cnomCod: number): Promise<LiquidacionDetalle | null> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch(`${API_BASE_URL}/liquidaciones/${cnomCod}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Error obteniendo detalle de liquidación');
      }

      const result: ApiResponse<LiquidacionDetalle> = await response.json();

      if (result.success) {
        return result.data;
      }

      return null;

    } catch (error) {
      console.error('Error obteniendo detalle de liquidación:', error);
      return null;
    }
  }, []);

  const clearState = useCallback(() => {
    setLiquidaciones([]);
    setLiquidacionesAgrupadas([]);
    setPeriodos([]);
    setError(null);
  }, []);

  return {
    liquidaciones,
    liquidacionesAgrupadas,
    periodos,
    loading,
    error,
    getMisLiquidaciones,
    getPeriodosDisponibles,
    getLiquidacionDetalle,
    clearState
  };
}