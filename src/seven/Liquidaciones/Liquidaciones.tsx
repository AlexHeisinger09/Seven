// src/seven/Liquidaciones/Liquidaciones.tsx
import { useState, useEffect } from 'react';
import { useLiquidaciones, type LiquidacionAgrupada } from '../../hooks/useLiquidaciones';
import { LiquidacionDetallePDF } from './LiquidacionDetallePDF';

interface LiquidacionesProps {
  isSidebarCollapsed?: boolean;
}

export function Liquidaciones({ isSidebarCollapsed = false }: LiquidacionesProps) {
  const [selectedPeriodo, setSelectedPeriodo] = useState<LiquidacionAgrupada | null>(null);
  const { liquidacionesAgrupadas, loading, error, getMisLiquidaciones } = useLiquidaciones();

  useEffect(() => {
    getMisLiquidaciones();
  }, [getMisLiquidaciones]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(value);
  };

  if (loading && liquidacionesAgrupadas.length === 0) {
    return (
      <main className={`flex-1 bg-gray-50 min-h-[calc(100vh-5rem)] w-full overflow-x-hidden transition-all duration-300 pb-20 lg:pb-6 ${isSidebarCollapsed ? 'lg:ml-0' : 'lg:ml-0'}`}>
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Cargando liquidaciones</h2>
              <p className="text-gray-600">Obteniendo tus liquidaciones de sueldo...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={`flex-1 bg-gray-50 min-h-[calc(100vh-5rem)] w-full overflow-x-hidden transition-all duration-300 pb-20 lg:pb-6 ${isSidebarCollapsed ? 'lg:ml-0' : 'lg:ml-0'}`}>
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">Error al cargar liquidaciones</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={() => getMisLiquidaciones()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (selectedPeriodo) {
    return (
      <main className={`flex-1 bg-gray-50 min-h-[calc(100vh-5rem)] w-full overflow-x-hidden transition-all duration-300 pb-20 lg:pb-6 ${isSidebarCollapsed ? 'lg:ml-0' : 'lg:ml-0'}`}>
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <button
            onClick={() => setSelectedPeriodo(null)}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Volver a la lista</span>
          </button>
          
          <LiquidacionDetallePDF periodo={selectedPeriodo} />
        </div>
      </main>
    );
  }

  return (
    <main className={`flex-1 bg-gray-50 min-h-[calc(100vh-5rem)] w-full overflow-x-hidden transition-all duration-300 pb-20 lg:pb-6 ${isSidebarCollapsed ? 'lg:ml-0' : 'lg:ml-0'}`}>
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Mis Liquidaciones</h1>
          <p className="text-gray-600">Consulta el detalle de tus liquidaciones de sueldo por mes</p>
        </div>

        {/* Tabla de liquidaciones */}
        {liquidacionesAgrupadas.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay liquidaciones disponibles</h3>
            <p className="text-gray-600">Aún no tienes liquidaciones registradas en el sistema</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Tabla para desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Período</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Días Trabajados</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Total Haberes</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Total Descuentos</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Líquido a Pagar</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {liquidacionesAgrupadas.map((periodo) => (
                    <tr key={periodo.periodo} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">{periodo.mes} {periodo.anio}</span>
                          <span className="text-xs text-gray-500">{periodo.periodo}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                          {periodo.diasTrabajados} {periodo.diasTrabajados === 1 ? 'día' : 'días'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-medium text-gray-900">{formatCurrency(periodo.totalHaberes)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-medium text-gray-900">{formatCurrency(periodo.totalDescuentos)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-lg font-bold text-gray-900">{formatCurrency(periodo.liquidoTotal)}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedPeriodo(periodo)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Ver liquidación
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards para móvil */}
            <div className="md:hidden divide-y divide-gray-100">
              {liquidacionesAgrupadas.map((periodo) => (
                <div key={periodo.periodo} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{periodo.mes} {periodo.anio}</h3>
                      <p className="text-xs text-gray-500">{periodo.periodo}</p>
                    </div>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                      {periodo.diasTrabajados} {periodo.diasTrabajados === 1 ? 'día' : 'días'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Haberes</p>
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(periodo.totalHaberes)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Descuentos</p>
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(periodo.totalDescuentos)}</p>
                    </div>
                  </div>

                  <div className="bg-gray-100 rounded-lg p-3 mb-3">
                    <p className="text-xs text-gray-600 mb-1">Líquido a Pagar</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(periodo.liquidoTotal)}</p>
                  </div>

                  <button
                    onClick={() => setSelectedPeriodo(periodo)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Ver liquidación
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}