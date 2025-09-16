// src/seven/MiFicha/MiFicha.tsx
import { useState, useEffect } from 'react';
import { Avatar } from '../../components/Avatar';
import { useTrabajador, type Trabajador } from '../../hooks/useTrabajador';

interface MiFichaProps {
  isSidebarCollapsed?: boolean;
}

type TabKey = 'resumen' | 'asistencia' | 'vacaciones' | 'horas-extras' | 'permisos' | 'documentos';

interface Tab {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
  color: string;
}

export function MiFicha({ isSidebarCollapsed = false }: MiFichaProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('resumen');
  const { trabajador, loading, error, getMiInformacion } = useTrabajador();

  const tabs: Tab[] = [
    {
      key: 'resumen',
      label: 'Resumen',
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>,
      color: 'bg-blue-600'
    },
    {
      key: 'asistencia',
      label: 'Registro de asistencia',
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>,
      color: 'bg-orange-600'
    },
    {
      key: 'horas-extras',
      label: 'Horas extras',
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>,
      color: 'bg-green-600'
    },
    {
      key: 'vacaciones',
      label: 'Vacaciones',
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>,
      color: 'bg-blue-500'
    },
    {
      key: 'permisos',
      label: 'Permisos solicitados',
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>,
      color: 'bg-green-500'
    },
    {
      key: 'documentos',
      label: 'Documentos',
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg>,
      color: 'bg-gray-600'
    }
  ];

  // Cargar información del trabajador al montar el componente
  useEffect(() => {
    getMiInformacion();
  }, [getMiInformacion]);

  // Función para determinar el género del avatar
  const getAvatarGender = (): 'male' | 'female' => {
    // Si hay foto personalizada, el género no se usa (la foto tiene prioridad)
    if (trabajador?.traFoto && trabajador.traFoto.trim() !== '') {
      return 'male'; // Valor por defecto, no se usa porque hay foto personalizada
    }

    // Si no hay foto personalizada, usar el género especificado en los datos
    if (trabajador?.tseNombre?.toLowerCase().includes('femenino')) {
      return 'female'; // Mostrará women.png
    }

    // Por defecto masculino
    return 'male'; // Mostrará men.png
  };

  // Generar días del mes (simulado)
  const generateCalendarDays = () => {
    const days = [];
    const today = new Date().getDate();

    for (let i = 1; i <= 30; i++) {
      const isToday = i === today;
      const isWeekend = i % 7 === 0 || (i + 1) % 7 === 0;
      const isWorked = i <= today && !isWeekend && Math.random() > 0.1;

      days.push({
        day: i,
        isToday,
        isWeekend,
        isWorked,
        hours: isWorked ? '8:00 hrs' : '',
        status: isWorked ? 'worked' : isWeekend ? 'weekend' : 'pending'
      });
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando información...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-900 mb-2">Error al cargar información</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={getMiInformacion}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      );
    }

    if (!trabajador) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">Sin información disponible</h3>
            <p className="text-yellow-700">No se encontró información del trabajador.</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'resumen':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Información Personal */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Información Personal</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Dirección</span>
                  <span className="text-sm font-medium">{trabajador.traDireccion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Fecha de Nacimiento</span>
                  <span className="text-sm font-medium">{trabajador.showTraFechaNacimiento} ({trabajador.edad} años)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Licencia</span>
                  <span className="text-sm font-medium">{trabajador.licDescripcion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Género</span>
                  <span className="text-sm font-medium">{trabajador.tseNombre}</span>
                </div>
              </div>
            </div>

            {/* Forma de Pago */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Forma de Pago</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Banco</span>
                  <span className="text-sm font-medium">{trabajador.banNombre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Tipo de Cuenta</span>
                  <span className="text-sm font-medium">{trabajador.fopaDescripcion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">N° de Cuenta</span>
                  <span className="text-sm font-medium">{trabajador.traNcuenta}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Estado</span>
                  <span className={`text-sm font-medium ${trabajador.vigente ? 'text-green-600' : 'text-red-600'}`}>
                    {trabajador.vigente ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            </div>

            {/* Previsión y Salud */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Previsión y Salud</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">AFP</span>
                  <span className="text-sm font-medium">{trabajador.afpNombre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Salud</span>
                  <span className="text-sm font-medium">{trabajador.salNombre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">APV %</span>
                  <span className="text-sm font-medium">{trabajador.afpApvPorc}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Pensionado</span>
                  <span className="text-sm font-medium">{trabajador.pensionado}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'asistencia':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendario */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Septiembre 2025</h3>
                <div className="flex gap-2">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map(day => (
                  <div
                    key={day.day}
                    className={`
                      relative p-3 rounded-lg text-center text-sm border-2 transition-colors
                      ${day.isToday
                        ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold'
                        : day.isWorked
                          ? 'border-green-200 bg-green-50 text-green-700'
                          : day.isWeekend
                            ? 'border-gray-200 bg-gray-50 text-gray-400'
                            : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="font-medium">{day.day < 10 ? `0${day.day}` : day.day}</div>
                    {day.hours && (
                      <div className="text-xs text-gray-600 mt-1">{day.hours}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Resumen de horas */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold">60 hrs</div>
                    <div className="text-yellow-100">Total del mes</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">$120</div>
                    <div className="text-yellow-100">Monto</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-4">Detalles</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Investigación de tendencias</span>
                    <span className="font-medium">2 hr</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Desarrollo de portafolio digital</span>
                    <span className="font-medium">4 hr</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Análisis de campañas anteriores</span>
                    <span className="font-medium">2 hr</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Benchmarking de marcas competidoras</span>
                    <span className="font-medium">1 hr</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'vacaciones':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Vacaciones Disponibles</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">15</div>
                <p className="text-gray-600">días disponibles</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Próximo Período</h3>
              <p className="text-gray-600 mb-2">11 de septiembre - 11 de octubre</p>
              <div className="grid grid-cols-10 gap-1">
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${i < 5 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                    {i + 1 < 10 ? `0${i + 1}` : i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'permisos':
        return (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Permisos Solicitados</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="font-medium text-blue-900">Permiso médico</p>
                  <p className="text-sm text-blue-700">19 - 09 - 2025</p>
                </div>
                <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full">Aprobado</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div>
                  <p className="font-medium text-yellow-900">Permiso personal</p>
                  <p className="text-sm text-yellow-700">25 - 09 - 2025</p>
                </div>
                <span className="px-3 py-1 bg-yellow-600 text-white text-xs rounded-full">Pendiente</span>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {tabs.find(tab => tab.key === activeTab)?.label}
              </h3>
              <p className="text-gray-600">Esta sección está en desarrollo</p>
            </div>
          </div>
        );
    }
  };

  // Mostrar loading mientras se carga la información inicial
  if (loading && !trabajador) {
    return (
      <main className={`flex-1 bg-gray-50 min-h-[calc(100vh-5rem)] w-full overflow-x-hidden transition-all duration-300 ease-in-out pb-20 lg:pb-6 ${isSidebarCollapsed ? 'lg:ml-0' : 'lg:ml-0'}`}>
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Cargando información</h2>
              <p className="text-gray-600">Obteniendo tu información de trabajador...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={`
      flex-1 bg-gray-50 min-h-[calc(100vh-5rem)] w-full overflow-x-hidden
      transition-all duration-300 ease-in-out
      pb-20 lg:pb-6
      ${isSidebarCollapsed ? 'lg:ml-0' : 'lg:ml-0'}
    `}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header con información del trabajador */}
        <div className="mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0 mx-auto lg:mx-0">
                <Avatar
                  name={trabajador?.nombreCompleto || 'Usuario'}
                  size="xl"
                  variant="rect"
                  className="shadow-lg border-4 border-white"
                  gender={getAvatarGender()}
                  src={trabajador?.traFoto && trabajador.traFoto.trim() !== '' ? trabajador.traFoto : undefined}
                />
              </div>

              {/* Información principal */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {trabajador?.nombreCompleto || 'Cargando...'}
                  </h1>
                  {trabajador?.vigente && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Activo
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-4">{trabajador?.eduNombre || 'Cargo no especificado'}</p>

                {/* Información básica en línea */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">RUT</span>
                    <p className="font-medium text-gray-900">{trabajador?.traRut}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Email</span>
                    <p className="font-medium text-gray-900">{trabajador?.traEmail}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Teléfono</span>
                    <p className="font-medium text-gray-900">{trabajador?.traMovil}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Fecha de ingreso</span>
                    <p className="font-medium text-gray-900">{trabajador?.showTraFechaIngMdp}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Ficha</span>
                    <p className="font-medium text-gray-900">{trabajador?.traFichaTrabajador}</p>
                  </div>
                   <div>
                    <span className="text-gray-500">Sindicato</span>
                    <p className="font-medium text-gray-900">{trabajador?.sinNombre} </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pestañas */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${activeTab === tab.key
                    ? `${tab.color} text-white shadow-lg`
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }
                `}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido de la pestaña activa */}
        <div>
          {renderTabContent()}
        </div>
      </div>
    </main>
  );
}