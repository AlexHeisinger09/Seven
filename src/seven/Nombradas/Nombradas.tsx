import { useState, useEffect } from 'react';
import { useNombradas, type Nombrada } from '../../hooks/useNombradas';

export function Nombradas() {
  const [fecha, setFecha] = useState<string>('');
  const [turno, setTurno] = useState<number>(1);
  const { nombradas, loading, error, getMisNombradas } = useNombradas();

  useEffect(() => {
    if (fecha) {
      getMisNombradas(fecha, turno);
    }
  }, [fecha, turno, getMisNombradas]);

  const getTurnoColor = (turnoCod: number) => {
    switch (turnoCod) {
      case 1: return 'bg-blue-100 text-blue-700 border-blue-200';
      case 2: return 'bg-green-100 text-green-700 border-green-200';
      case 3: return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <main className="flex-1 bg-gray-50 min-h-screen w-full p-4 md:p-6 pb-20 lg:pb-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {nombradas.length > 0 
              ? `${nombradas[0].traNombre} ${nombradas[0].traApellidoP} ${nombradas[0].traApellidoM}`
              : 'Nombradas'
            }
          </h1>
          {nombradas.length > 0 && (
            <p className="text-gray-600">Ficha: {nombradas[0].traFichaTrabajador}</p>
          )}
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Filtro de Fecha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha
              </label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                placeholder="Seleccione una fecha"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filtro de Turno */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Turno
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTurno(t)}
                    className={`
                      px-4 py-2.5 rounded-lg font-medium transition-all
                      ${turno === t
                        ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-200'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    Turno {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando nombradas...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-900 mb-1">Error al cargar datos</h3>
                <p className="text-red-700">{error}</p>
                <button
                  onClick={() => getMisNombradas(fecha, turno)}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Nombradas */}
        {!loading && !error && fecha && (
          <div className="space-y-4">
            {nombradas.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay nombradas</h3>
                <p className="text-gray-600">No se encontraron nombradas para la fecha y turno seleccionados</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {nombradas.map((nombrada: Nombrada, index: number) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                      <h2 className="text-lg font-bold text-gray-900">Información de la Nombrada</h2>
                      <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold ${getTurnoColor(nombrada.faeTurnoCod)}`}>
                        Turno {nombrada.faeTurnoCod}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Tipo de Nombrada */}
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-500 mb-1">Tipo de Nombrada</p>
                          <p className="font-semibold text-gray-900">{nombrada.tnomDescripcion}</p>
                        </div>
                      </div>

                      {/* Faena */}
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-500 mb-1">Faena</p>
                          <p className="font-semibold text-gray-900">{nombrada.tfaDescripcion}</p>
                        </div>
                      </div>

                      {/* Horario */}
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-500 mb-1">Horario</p>
                          <p className="font-semibold text-gray-900">
                            {nombrada.faeHoraInicialPlanif} - {nombrada.faeHoraFinalPlanif}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mensaje inicial cuando no hay fecha seleccionada */}
        {!loading && !error && !fecha && (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecciona una fecha</h3>
            <p className="text-gray-600">Elige una fecha y turno para consultar tus nombradas</p>
          </div>
        )}
      </div>
    </main>
  );
}