import { CONTENT_MODULES } from '../../utils/constants';

interface ContentProps {
  isSidebarCollapsed?: boolean;
}

export function Content({ isSidebarCollapsed = false }: ContentProps) {
  return (
    <main className={`
      flex-1 bg-gray-50 min-h-[calc(100vh-5rem)] w-full overflow-x-hidden
      transition-all duration-300 ease-in-out
      p-4 lg:p-6
      pb-20 lg:pb-6
      ${isSidebarCollapsed ? 'lg:ml-0' : 'lg:ml-0'}
    `}>
      <div className="max-w-7xl mx-auto">
        {/* Header del contenido */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mi Ficha</h1>
          <p className="text-gray-600">Gestiona tu información personal y configuraciones</p>
        </div>

        {/* Grid de módulos */}
        <div className="grid gap-4 lg:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {CONTENT_MODULES.map((module, index) => (
            <div 
              key={module} 
              className="bg-white rounded-xl p-4 lg:p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200 hover:scale-[1.02] group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-200 transition-colors">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      {index % 3 === 0 && (
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      )}
                      {index % 3 === 1 && (
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      )}
                      {index % 3 === 2 && (
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
                      )}
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                      {module}
                    </h3>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Módulo para gestión de {module.toLowerCase()}. Accede a todas las funcionalidades relacionadas.
              </p>

              {/* Indicadores o badges */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {index % 2 === 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Activo
                    </span>
                  )}
                  {index % 3 === 1 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      Nuevo
                    </span>
                  )}
                </div>
                
                <div className="text-xs text-gray-400">
                  Actualizado recientemente
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sección adicional */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Accesos rápidos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Perfil', 'Configuración', 'Ayuda', 'Contacto'].map((item, index) => (
              <button 
                key={item}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <svg className="w-4 h-4 text-gray-600 group-hover:text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors">
                  {item}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}