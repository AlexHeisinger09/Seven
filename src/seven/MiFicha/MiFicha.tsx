// src/seven/MiFicha/MiFicha.tsx
import { useState } from 'react';
import { Avatar } from '../../components/Avatar';

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

  const renderTabContent = () => {
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
                    <span className="text-sm text-gray-600">Cargo</span>
                    <span className="text-sm font-medium text-gray-900">Ingeniero de software</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Recinto</span>
                    <span className="text-sm font-medium text-gray-900">Sin Recinto</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Área</span>
                    <span className="text-sm font-medium text-gray-900">Proyectos IT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">División</span>
                    <span className="text-sm font-medium text-gray-900">Administración</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Empresa</span>
                    <span className="text-sm font-medium text-gray-900">Muelles de Penco S.A.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Supervisor</span>
                    <span className="text-sm font-medium text-gray-900">Vanegas, Leonel</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Suplente</span>
                    <span className="text-sm font-medium text-gray-900">Sin Suplencia</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tipo Contrato</span>
                    <span className="text-sm font-medium text-gray-900">Indefinido</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Jornada Laboral</span>
                    <span className="text-sm font-medium text-gray-900">Mensual 42,0 hrs. (L, M, M, J, V)</span>
                  </div>
                </div>
              </div>

              {/* Estadísticas */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Estadísticas</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-900">Días trabajados</span>
                      <span className="text-2xl font-bold text-blue-600">245</span>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-900">Vacaciones disponibles</span>
                      <span className="text-2xl font-bold text-green-600">15</span>
                    </div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-orange-900">Horas extras este mes</span>
                      <span className="text-2xl font-bold text-orange-600">8</span>
                    </div>
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
                { name: 'Contrato de Trabajo', date: '15 Mar 2023', type: 'PDF' },
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
              name="Alex Heisinger Vivanco"
              size="xl"
              className="shadow-lg flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-blue-600 text-sm font-medium">¡Hola!</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Alex Heisinger Vivanco</h1>
              <p className="text-lg text-gray-600 mb-4">Ingeniero de software</p>
            </div>
          </div>

          {/* Grid de información organizada */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Columna 1: Identificación */}
            <div className="space-y-4">
              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Identificación</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-500 text-sm">RUT</span>
                    <p className="font-semibold text-gray-900">17.539.138-k</p>
                  </div>
                </div>
              </div>
              
              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Datos Personales</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-500 text-sm">Cumpleaños</span>
                    <p className="font-semibold text-gray-900">11-03-1990 <span className="text-gray-500">(35 años)</span></p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Teléfono Particular</span>
                    <p className="font-semibold text-gray-900">+56 9 6310 7627</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna 2: Contacto y Ubicación */}
            <div className="space-y-4">
              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Contacto Corporativo</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-500 text-sm">Email</span>
                    <p className="font-semibold text-gray-900 break-all">aheisinger@muellesdepenco.cl</p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Dirección</h3>
                <div>
                  <p className="text-gray-700 leading-relaxed">Calle Cuatro, prolongación Quiriquina #1226, Casa 19</p>
                </div>
              </div>
            </div>

            {/* Columna 3: Información Laboral */}
            <div className="space-y-4">
              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Información Laboral</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-500 text-sm">Fecha de Ingreso</span>
                    <p className="font-semibold text-gray-900">05-05-2025</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Empresa</span>
                    <p className="font-semibold text-gray-900">Muelles de Penco S.A.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  <span className="text-gray-900 font-semibold text-sm">Estado</span>
                </div>
                <p className="text-gray-700 font-medium">Empleado Activo</p>
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