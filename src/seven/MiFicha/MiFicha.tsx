// src/seven/MiFicha/MiFicha.tsx - ACTUALIZADO CON NOMBRADAS
import { useState, useEffect } from 'react';
import { Avatar } from '../../components/Avatar';
import { useTrabajador, type Trabajador } from '../../hooks/useTrabajador';
import { Resumen } from './Tabs/Resumen';
import { Asistencia } from './Tabs/Asistencia';
import { NombradasTab } from './Tabs/Nombradas';

interface MiFichaProps {
  isSidebarCollapsed?: boolean;
}

type TabKey = 'resumen' | 'nombradas' | 'asistencia'  | 'horas-extras' | 'permisos' | 'documentos'; // ACTUALIZADO

interface Tab {
  key: TabKey;
  label: string;
  shortLabel?: string;
  icon: React.ReactNode;
  colors: {
    bg: string;
    bgHover: string;
    text: string;
    border: string;
    hoverBorder: string;
  };
}

export function MiFicha({ isSidebarCollapsed = false }: MiFichaProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('resumen');
  const { trabajador, loading, error, getMiInformacion } = useTrabajador();

  const tabs: Tab[] = [
    {
      key: 'resumen',
      label: 'Resumen',
      shortLabel: 'Resumen',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      ),
      colors: {
        bg: 'bg-gradient-to-r from-blue-600 to-blue-700',
        bgHover: 'bg-gradient-to-r from-blue-700 to-blue-800',
        text: 'text-white',
        border: 'border-blue-300',
        hoverBorder: 'border-blue-400'
      }
    },
    {
      key: 'nombradas',
      label: 'Nombradas',
      shortLabel: 'Nombradas',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      ),
      colors: {
        bg: 'bg-gradient-to-r from-blue-600 to-blue-700',
        bgHover: 'bg-gradient-to-r from-blue-700 to-blue-800',
        text: 'text-white',
        border: 'border-blue-300',
        hoverBorder: 'border-blue-400'
      }
    },
    {
      key: 'asistencia',
      label: 'Registro de asistencia',
      shortLabel: 'Asistencia',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      ),
      colors: {
        bg: 'bg-gradient-to-r from-blue-600 to-blue-700',
        bgHover: 'bg-gradient-to-r from-blue-700 to-blue-800',
        text: 'text-white',
        border: 'border-blue-300',
        hoverBorder: 'border-blue-400'
      }
    },
    {
      key: 'horas-extras',
      label: 'Horas extras',
      shortLabel: 'H. Extras',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
      colors: {
        bg: 'bg-gradient-to-r from-blue-600 to-blue-700',
        bgHover: 'bg-gradient-to-r from-blue-700 to-blue-800',
        text: 'text-white',
        border: 'border-blue-300',
        hoverBorder: 'border-blue-400'
      }
    },
    {
      key: 'permisos',
      label: 'Permisos solicitados',
      shortLabel: 'Permisos',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      ),
      colors: {
        bg: 'bg-gradient-to-r from-blue-600 to-blue-700',
        bgHover: 'bg-gradient-to-r from-blue-700 to-blue-800',
        text: 'text-white',
        border: 'border-blue-300',
        hoverBorder: 'border-blue-400'
      }
    },
    {
      key: 'documentos',
      label: 'Documentos',
      shortLabel: 'Docs',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      ),
      colors: {
        bg: 'bg-gradient-to-r from-blue-600 to-blue-700',
        bgHover: 'bg-gradient-to-r from-blue-700 to-blue-800',
        text: 'text-white',
        border: 'border-blue-300',
        hoverBorder: 'border-blue-400'
      }
    }
  ];

  useEffect(() => {
    getMiInformacion();
  }, [getMiInformacion]);

  const getAvatarGender = (): 'male' | 'female' => {
    if (trabajador?.traFoto && trabajador.traFoto.trim() !== '') {
      return 'male';
    }

    if (trabajador?.tseNombre?.toLowerCase().includes('femenino')) {
      return 'female';
    }

    return 'male';
  };

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
        return <Resumen trabajador={trabajador} />;

      case 'nombradas':
        return <NombradasTab />;

      case 'asistencia':
        return <Asistencia />;

      case 'permisos':
        return (
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Permisos Solicitados</h3>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-blue-50 rounded-lg border border-blue-200 gap-3">
                <div>
                  <p className="font-medium text-blue-900">Permiso médico</p>
                  <p className="text-sm text-blue-700">19 - 09 - 2025</p>
                </div>
                <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full self-start sm:self-center">Aprobado</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200 gap-3">
                <div>
                  <p className="font-medium text-yellow-900">Permiso personal</p>
                  <p className="text-sm text-yellow-700">25 - 09 - 2025</p>
                </div>
                <span className="px-3 py-1 bg-yellow-600 text-white text-xs rounded-full self-start sm:self-center">Pendiente</span>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
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

  if (loading && !trabajador) {
    return (
      <main className={`flex-1 bg-gray-50 min-h-[calc(100vh-5rem)] w-full overflow-x-hidden transition-all duration-300 ease-in-out pb-20 lg:pb-6 ${isSidebarCollapsed ? 'lg:ml-0' : 'lg:ml-0'}`}>
        <div className="max-w-7xl mx-auto p-4 md:p-6">
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
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header con información del trabajador */}
        <div className="mb-6">
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col lg:flex-row items-start gap-4 md:gap-6">
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

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                    {trabajador?.nombreCompleto || 'Cargando...'}
                  </h1>
                  {trabajador?.vigente ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Activo
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      No Vigente
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-4">{trabajador?.eduNombre || 'Cargo no especificado'}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
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
                    <p className="font-medium text-gray-900">{trabajador?.sinNombre}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pestañas */}
        <div className="mb-6">
          {/* Pestañas para desktop y tablet */}
          <div className="hidden sm:flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-lg text-xs md:text-sm font-medium 
                  transition-all duration-200 transform hover:scale-105 shadow-sm
                  ${activeTab === tab.key
                    ? `${tab.colors.bg} ${tab.colors.text} shadow-lg ring-2 ring-blue-200 ring-offset-1`
                    : `bg-white text-gray-600 hover:bg-gray-50 border ${tab.colors.border} hover:${tab.colors.hoverBorder} hover:text-gray-800`
                  }
                `}
              >
                {tab.icon}
                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden">{tab.shortLabel || tab.label}</span>
              </button>
            ))}
          </div>

          {/* Pestañas para móvil - Dropdown */}
          <div className="sm:hidden">
            <div className="relative">
              <button
                onClick={() => {
                  const dropdown = document.getElementById('mobile-tabs-dropdown');
                  dropdown?.classList.toggle('hidden');
                }}
                className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2">
                  {tabs.find(tab => tab.key === activeTab)?.icon}
                  <span className="font-medium text-gray-900">
                    {tabs.find(tab => tab.key === activeTab)?.shortLabel || tabs.find(tab => tab.key === activeTab)?.label}
                  </span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div id="mobile-tabs-dropdown" className="hidden absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key);
                      document.getElementById('mobile-tabs-dropdown')?.classList.add('hidden');
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 text-left transition-colors first:rounded-t-lg last:rounded-b-lg
                      ${activeTab === tab.key
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                        : 'hover:bg-gray-50 text-gray-700'
                      }
                    `}
                  >
                    {tab.icon}
                    <span className="font-medium">{tab.shortLabel || tab.label}</span>
                    {activeTab === tab.key && (
                      <svg className="w-4 h-4 text-blue-600 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
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