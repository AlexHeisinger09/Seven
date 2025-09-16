// src/seven/MiFicha/MiFicha.tsx
import { useState, useEffect } from 'react';
import { Avatar } from '../../components/Avatar';
import { useTrabajador, type Trabajador } from '../../hooks/useTrabajador';

interface MiFichaProps {
  isSidebarCollapsed?: boolean;
}

type TabKey = 'resumen' | 'liquidaciones' | 'documentos' | 'historia' | 'bitacora' | 'asistencia' | 'vacaciones' | 'talento';

interface Tab {
  key: TabKey;
  label: string;
  hasDropdown?: boolean;
}

export function MiFicha({ isSidebarCollapsed = false }: MiFichaProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('resumen');
  const { trabajador, loading, error, getMiInformacion } = useTrabajador();

  const tabs: Tab[] = [
    { key: 'resumen', label: 'Resumen' },
    { key: 'liquidaciones', label: 'Liquidaciones' },
    { key: 'documentos', label: 'Documentos' },
    { key: 'historia', label: 'Historia' },
    { key: 'bitacora', label: 'Bitácora' },
    { key: 'asistencia', label: 'Asistencia', hasDropdown: true },
    { key: 'vacaciones', label: 'Vacaciones' },
    { key: 'talento', label: 'Talento', hasDropdown: true }
  ];

  // Cargar información del trabajador al montar el componente
  useEffect(() => {
    getMiInformacion();
  }, [getMiInformacion]);

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
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Información laboral */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Información Laboral</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">RUT</span>
                    <span className="text-sm font-medium text-gray-900">{trabajador.traRut || 'No disponible'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Fecha de Ingreso</span>
                    <span className="text-sm font-medium text-gray-900">{trabajador.showTraFechaIngMdp || 'No disponible'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Educación</span>
                    <span className="text-sm font-medium text-gray-900">{trabajador.eduNombre || 'No disponible'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Sindicato</span>
                    <span className="text-sm font-medium text-gray-900">{trabajador.sinNombre || 'No aplica'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Licencia</span>
                    <span className="text-sm font-medium text-gray-900">{trabajador.licDescripcion || 'No disponible'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Pase Portuario</span>
                    <span className="text-sm font-medium text-gray-900">{trabajador.traPasePortuario || 'No disponible'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Vigencia</span>
                    <span className={`text-sm font-medium ${trabajador.vigente ? 'text-green-600' : 'text-red-600'}`}>
                      {trabajador.vigente ? 'Vigente' : 'No Vigente'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Información personal */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Información Personal</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Fecha de Nacimiento</span>
                    <span className="text-sm font-medium text-gray-900">{trabajador.showTraFechaNacimiento || 'No disponible'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Edad</span>
                    <span className="text-sm font-medium text-gray-900">{trabajador.edad || 0} años</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Género</span>
                    <span className="text-sm font-medium text-gray-900">{trabajador.tseNombre || 'No especificado'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Estado Civil</span>
                    <span className="text-sm font-medium text-gray-900">{trabajador.eciNombre || 'No especificado'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Nacionalidad</span>
                    <span className="text-sm font-medium text-gray-900">{trabajador.nacDescripcion || 'No disponible'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Ciudad</span>
                    <span className="text-sm font-medium text-gray-900">{trabajador.ciuNombre || 'No disponible'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Cargas Simples</span>
                    <span className="text-sm font-medium text-gray-900">{trabajador.traCargasSimple || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Cargas por Invalidez</span>
                    <span className="text-sm font-medium text-gray-900">{trabajador.traCargaPorInvalides || 0}</span>
                  </div>
                </div>
              </div>

              {/* Información de contacto */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Información de Contacto</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Email</span>
                    <span className="text-sm font-medium text-gray-900 break-all">{trabajador.traEmail || 'No disponible'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Teléfono</span>
                    <span className="text-sm font-medium text-gray-900">{trabajador.traMovil || 'No disponible'}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Dirección</span>
                    <p className="text-sm font-medium text-gray-900 mt-1">{trabajador.direccionCompleta || 'No disponible'}</p>
                  </div>
                </div>
              </div>

              {/* Información previsional */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Información Previsional</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">AFP</span>
                    <span className="text-sm font-medium text-gray-900">{trabajador.afpNombre || 'No disponible'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Salud</span>
                    <span className="text-sm font-medium text-gray-900">{trabajador.salNombre || 'No disponible'}</span>
                  </div>
                  {trabajador.traUfIsapre && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">UF Isapre</span>
                      <span className="text-sm font-medium text-gray-900">{trabajador.ufIsapre}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Pensionado</span>
                    <span className="text-sm font-medium text-gray-900">{trabajador.pensionado || 'No'}</span>
                  </div>
                  {trabajador.traEnfermedad && (
                    <div>
                      <span className="text-sm text-gray-600">Enfermedad Crónica</span>
                      <p className="text-sm font-medium text-gray-900 mt-1">{trabajador.cronico}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Información bancaria */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Información Bancaria</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Banco</span>
                    <span className="text-sm font-medium text-gray-900">{trabajador.banNombre || 'No disponible'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Número de Cuenta</span>
                    <span className="text-sm font-medium text-gray-900">{trabajador.traNcuenta || 'No disponible'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Forma de Pago</span>
                    <span className="text-sm font-medium text-gray-900">{trabajador.fopaDescripcion || 'No disponible'}</span>
                  </div>
                </div>
              </div>

              {/* Información física */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Información Física</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Talla de Ropa</span>
                    <span className="text-sm font-medium text-gray-900">{trabajador.traTallaRopa || 'No disponible'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Número de Calzado</span>
                    <span className="text-sm font-medium text-gray-900">{trabajador.traNumCalzado || 'No disponible'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'documentos':
        return (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Mis Documentos</h3>
            <div className="space-y-3">
              {[
                { name: 'Contrato de Trabajo', date: trabajador?.showTraFechaIngMdp || '15 Mar 2023', type: 'PDF' },
                { name: 'Certificado de Antecedentes', date: '10 Mar 2023', type: 'PDF' },
                { name: 'Evaluación de Desempeño 2024', date: '05 Ene 2024', type: 'PDF' },
                { name: 'Liquidación de Sueldo - Agosto 2024', date: '31 Ago 2024', type: 'PDF' }
              ].map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-sm text-gray-500">{doc.type} • {doc.date}</p>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                </div>
              ))}
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
      <div className="max-w-7xl mx-auto">
        {/* Cabecera con información del usuario */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-6 mb-6">
          {/* Información principal con foto y nombre */}
          <div className="flex items-start gap-4 mb-6">
            <Avatar 
              name={trabajador?.nombreCompleto || 'Usuario'}
              size="xl"
              className="shadow-lg flex-shrink-0"
              gender={trabajador?.tseNombre === 'FEMENINO' ? 'female' : 'male'}
              src={trabajador?.traFoto}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-blue-600 text-sm font-medium">¡Hola!</span>
                {trabajador?.vigente && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    Activo
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {trabajador?.nombreCompleto || 'Cargando...'}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                {trabajador?.eduNombre || 'Trabajador'}
              </p>
            </div>
          </div>

          {/* Grid de información organizada */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Columna 1: Identificación */}
            <div className="space-y-4">
              <div className="border-l-4 border-blue-300 pl-4">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Identificación</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-500 text-sm">RUT</span>
                    <p className="font-semibold text-gray-900">{trabajador?.traRut || 'No disponible'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Ficha</span>
                    <p className="font-semibold text-gray-900">{trabajador?.traFichaTrabajador || 'No disponible'}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-l-4 border-green-300 pl-4">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Datos Personales</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-500 text-sm">Cumpleaños</span>
                    <p className="font-semibold text-gray-900">
                      {trabajador?.showTraFechaNacimiento || 'No disponible'}
                      {trabajador?.edad && <span className="text-gray-500"> ({trabajador.edad} años)</span>}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Teléfono</span>
                    <p className="font-semibold text-gray-900">{trabajador?.traMovil || 'No disponible'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna 2: Contacto y Ubicación */}
            <div className="space-y-4">
              <div className="border-l-4 border-purple-300 pl-4">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Contacto</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-500 text-sm">Email</span>
                    <p className="font-semibold text-gray-900 break-all">{trabajador?.traEmail || 'No disponible'}</p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-orange-300 pl-4">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Dirección</h3>
                <div>
                  <p className="text-gray-700 leading-relaxed">{trabajador?.direccionCompleta || 'No disponible'}</p>
                  {trabajador?.ciuNombre && (
                    <p className="text-sm text-gray-500 mt-1">{trabajador.ciuNombre}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Columna 3: Información Laboral */}
            <div className="space-y-4">
              <div className="border-l-4 border-indigo-300 pl-4">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Información Laboral</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-500 text-sm">Fecha de Ingreso</span>
                    <p className="font-semibold text-gray-900">{trabajador?.showTraFechaIngMdp || 'No disponible'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Empresa</span>
                    <p className="font-semibold text-gray-900">Muelles de Penco S.A.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 ${trabajador?.vigente ? 'bg-green-600' : 'bg-red-600'} rounded-full`}></div>
                  <span className="text-gray-900 font-semibold text-sm">Estado</span>
                </div>
                <p className={`font-medium ${trabajador?.vigente ? 'text-green-700' : 'text-red-700'}`}>
                  {trabajador?.vigente ? 'Empleado Activo' : 'No Vigente'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sistema de pestañas */}
        <div className="px-4 lg:px-6">
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 overflow-x-auto" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`
                      group relative min-w-0 flex-shrink-0 py-4 px-1 text-sm font-medium text-center border-b-2 transition-colors whitespace-nowrap
                      ${activeTab === tab.key
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <span className="flex items-center gap-2">
                      {tab.label}
                      {tab.hasDropdown && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Contenido de la pestaña activa */}
          <div className="pb-8">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </main>
  );
}