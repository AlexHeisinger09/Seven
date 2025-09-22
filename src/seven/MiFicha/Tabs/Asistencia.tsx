import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAsistencia, type AsistenciaRecord, type EstadisticasAsistencia } from '../../../hooks/useAsistencia';

interface CalendarDay {
  day: number;
  date: Date;
  isToday: boolean;
  isWeekend: boolean;
  asistencias: AsistenciaRecord[];
  hasWork: boolean;
  status: 'worked' | 'absent' | 'weekend' | 'no-work' | 'future';
}

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export function Asistencia() {
  // Estados locales - Volver al mes actual
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth());
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);

  // Hook de asistencia
  const { 
    asistencias, 
    estadisticas, 
    loading, 
    error, 
    getAsistenciaMensual, // Volver al método original que funciona
    getEstadisticasMensuales,
    clearState 
  } = useAsistencia();

  // Cargar datos cuando cambia el mes/año
  useEffect(() => {
    const loadMonthData = async () => {
      console.log(`🔄 Cargando datos para ${viewMonth + 1}/${viewYear}`);
      try {
        // Solo cargar asistencias por ahora
        await getAsistenciaMensual(viewYear, viewMonth + 1);
        
        // Comentar estadísticas temporalmente hasta arreglar el error 500
        // await getEstadisticasMensuales(viewYear, viewMonth + 1);
        
        console.log('✅ Datos cargados correctamente');
      } catch (error) {
        console.error('❌ Error cargando datos:', error);
      }
    };

    loadMonthData();
  }, [viewMonth, viewYear, getAsistenciaMensual]); // Remover getEstadisticasMensuales temporalmente

  // Limpiar estado cuando se desmonta el componente
  useEffect(() => {
    return () => {
      console.log('🧹 Limpiando estado de asistencias');
      clearState();
    };
  }, [clearState]);

  // Debug: mostrar datos cargados
  useEffect(() => {
    console.log('📊 Estado actual de asistencias:', {
      asistencias: asistencias.length,
      estadisticas,
      loading,
      error
    });
    
    if (asistencias.length > 0) {
      console.log('📋 Primeras 3 asistencias:', asistencias.slice(0, 3));
    }
  }, [asistencias, estadisticas, loading, error]);

  // Generar días del calendario
  const calendarDays = useMemo(() => {
    console.log(`📅 Generando calendario para ${viewMonth + 1}/${viewYear}`);
    console.log(`📊 Asistencias disponibles:`, asistencias.length);
    
    const year = viewYear;
    const month = viewMonth;
    const today = new Date();
    
    // Primer día del mes y último día del mes
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Días del mes anterior para completar la primera semana
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Días del mes siguiente para completar la última semana
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    const days: CalendarDay[] = [];
    const currentDatePointer = new Date(startDate);

    while (currentDatePointer <= endDate) {
      const day = currentDatePointer.getDate();
      const isCurrentMonth = currentDatePointer.getMonth() === month;
      const isToday = currentDatePointer.toDateString() === today.toDateString();
      const isWeekend = currentDatePointer.getDay() === 0 || currentDatePointer.getDay() === 6;
      const isFuture = currentDatePointer > today;

      // Filtrar asistencias para este día
      const dayAsistencias = asistencias.filter(a => {
        if (!a.faeFechaInicialPlanif) return false;
        
        // El backend envía fechas en formato ISO "YYYY-MM-DD"
        let asistenciaDate: Date;
        
        if (typeof a.faeFechaInicialPlanif === 'string') {
          // Para fechas ISO como "2024-04-05", crear fecha directamente
          // Esto evita problemas de zona horaria
          const [year, month, day] = a.faeFechaInicialPlanif.split('-').map(Number);
          asistenciaDate = new Date(year, month - 1, day); // month - 1 porque Date usa base 0
        } else {
          asistenciaDate = new Date(a.faeFechaInicialPlanif);
        }
        
        // Comparar solo año, mes y día
        const asistenciaYear = asistenciaDate.getFullYear();
        const asistenciaMonth = asistenciaDate.getMonth();
        const asistenciaDay = asistenciaDate.getDate();
        
        const currentYear = currentDatePointer.getFullYear();
        const currentMonth = currentDatePointer.getMonth();
        const currentDay = currentDatePointer.getDate();
        
        const matches = (
          asistenciaYear === currentYear &&
          asistenciaMonth === currentMonth &&
          asistenciaDay === currentDay
        );
        
        if (matches) {
          console.log(`✅ Asistencia encontrada para ${currentDay}/${currentMonth + 1}/${currentYear}:`, {
            fechaOriginal: a.faeFechaInicialPlanif,
            fechaParsed: `${asistenciaDay}/${asistenciaMonth + 1}/${asistenciaYear}`,
            turno: a.turnoNombre,
            tieneAsistencia: a.tieneAsistencia
          });
        }
        
        return matches;
      });

      const hasWork = dayAsistencias.length > 0;
      const hasAssistance = dayAsistencias.some(a => a.tieneAsistencia);

      let status: CalendarDay['status'];
      if (isFuture) {
        status = 'future';
      } else if (hasWork) {
        status = hasAssistance ? 'worked' : 'absent';
      } else {
        // Los fines de semana también pueden tener trabajo, así que no los tratamos especial
        status = 'no-work';
      }

      if (isCurrentMonth) {
        days.push({
          day,
          date: new Date(currentDatePointer),
          isToday,
          isWeekend,
          asistencias: dayAsistencias,
          hasWork,
          status
        });
      }

      currentDatePointer.setDate(currentDatePointer.getDate() + 1);
    }

    console.log(`📅 Calendario generado: ${days.length} días, ${days.filter(d => d.hasWork).length} con trabajo`);
    return days;
  }, [viewYear, viewMonth, asistencias]);

  // Funciones de navegación
  const goToPreviousMonth = useCallback(() => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
    setSelectedDay(null);
  }, [viewMonth, viewYear]);

  const goToNextMonth = useCallback(() => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
    setSelectedDay(null);
  }, [viewMonth, viewYear]);

  const goToToday = useCallback(() => {
    const today = new Date();
    setViewMonth(today.getMonth());
    setViewYear(today.getFullYear());
    setSelectedDay(null);
  }, []);

  // Función para obtener el estilo de cada día
  const getDayStyle = (day: CalendarDay) => {
    const baseClasses = 'relative p-2 md:p-3 rounded-lg text-center text-xs md:text-sm border-2 transition-all duration-200 cursor-pointer hover:scale-105';
    
    if (day.isToday) {
      return `${baseClasses} border-blue-500 bg-blue-50 text-blue-700 font-bold shadow-md`;
    }
    
    switch (day.status) {
      case 'worked':
        return `${baseClasses} border-green-300 bg-green-50 text-green-700 hover:bg-green-100`;
      case 'absent':
        return `${baseClasses} border-red-300 bg-red-50 text-red-700 hover:bg-red-100`;
      case 'no-work':
        return `${baseClasses} border-gray-200 bg-white text-gray-500 hover:bg-gray-50`;
      case 'future':
        return `${baseClasses} border-gray-200 bg-gray-50 text-gray-400`;
      default:
        return `${baseClasses} border-gray-200 hover:border-gray-300`;
    }
  };

  // Función para manejar click en un día
  const handleDayClick = (day: CalendarDay) => {
    if (day.hasWork) {
      setSelectedDay(day);
    }
  };

  // Función para obtener el resumen de horas del día
  const getDaySummary = (day: CalendarDay) => {
    if (!day.hasWork) return null;
    
    const totalHours = day.asistencias.reduce((sum, a) => {
      if (a.horaEntrada && a.horaSalida) {
        // Calcular horas trabajadas (simplificado)
        return sum + 8; // Asumimos 8 horas por día con asistencia
      }
      return sum;
    }, 0);

    return totalHours > 0 ? `${totalHours}h` : null;
  };

  const canGoNext = () => {
    const today = new Date();
    return !(viewYear === today.getFullYear() && viewMonth >= today.getMonth());
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error al cargar asistencias</h3>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      {/* Calendario */}
      <div className="lg:col-span-2 bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
        {/* Header del calendario */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {MONTHS[viewMonth]} {viewYear}
            </h3>
            <p className="text-sm text-gray-500">
              {loading ? 'Cargando asistencias...' : `${asistencias.length} registros encontrados`}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Hoy
            </button>
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={loading}
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !canGoNext()}
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-4">
          {WEEKDAYS.map(day => (
            <div key={day} className="text-center text-xs md:text-sm font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Días del calendario */}
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-4">
          {calendarDays.map((day, index) => (
            <div
              key={`${day.date.getTime()}-${index}`}
              className={getDayStyle(day)}
              onClick={() => handleDayClick(day)}
            >
              <div className="font-medium">
                {day.day < 10 ? `0${day.day}` : day.day}
              </div>
              
              {/* Quitar el resumen de horas - ya no se muestra getDaySummary(day) */}
              
              {/* Indicadores de estado */}
              {day.hasWork && (
                <div className="absolute top-1 right-1">
                  {day.status === 'worked' && (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                  {day.status === 'absent' && (
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Leyenda */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Asistió</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Ausente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="text-gray-600">Sin trabajo programado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-blue-500 rounded-full bg-white"></div>
            <span className="text-gray-600">Hoy</span>
          </div>
        </div>
      </div>

      {/* Panel lateral */}
      <div className="space-y-4 md:space-y-6">
        {/* Estadísticas del mes */}
        {estadisticas && (
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 md:p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Resumen del mes</h4>
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Total días</span>
                <span className="text-xl font-bold">{estadisticas.totalDias}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Días asistidos</span>
                <span className="text-xl font-bold">{estadisticas.diasAsistidos}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Ausencias</span>
                <span className="text-xl font-bold">{estadisticas.diasAusentes}</span>
              </div>
              <div className="pt-2 border-t border-blue-400">
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Asistencia</span>
                  <span className="text-xl font-bold">
                    {estadisticas.porcentajeAsistencia.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading state para estadísticas */}
        {loading && !estadisticas && (
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="h-3 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        )}

        {/* Detalle del día seleccionado */}
        {selectedDay && (
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">
                {selectedDay.day} de {MONTHS[viewMonth]}
              </h4>
              <button
                onClick={() => setSelectedDay(null)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              {selectedDay.asistencias.map((asistencia, index) => (
                <div
                  key={`${asistencia.faeCod}-${index}`}
                  className={`p-3 rounded-lg border ${
                    asistencia.tieneAsistencia 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {asistencia.turnoNombre}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      asistencia.tieneAsistencia 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {asistencia.tieneAsistencia ? 'Asistió' : 'Ausente'}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Faena: {asistencia.tfaDescripcion}</div>
                    {asistencia.carNombre && (
                      <div>Cargo: {asistencia.carNombre}</div>
                    )}
                    <div className="flex justify-between">
                      <span>Entrada: {asistencia.horaEntrada || 'No registrada'}</span>
                      <span>Salida: {asistencia.horaSalida || 'No registrada'}</span>
                    </div>
                    {asistencia.dasiAusencia && (
                      <div className="text-red-600">
                        Motivo ausencia: {asistencia.dasiAusencia}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}