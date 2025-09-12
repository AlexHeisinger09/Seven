import React, { useState } from 'react';
import { COLORS } from '../utils/constants';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, isCollapsed, onClose }: SidebarProps) {
  // Estado local para el modal de "Más opciones" en móvil
  const [isMoreModalOpen, setIsMoreModalOpen] = useState(false);

  const menuItems = [
    { 
      label: 'Portal', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
      )
    },
    { 
      label: 'Mi Ficha', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      ),
      isActive: true
    },
    { 
      label: 'Beneficios', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
      )
    },
    { 
      label: 'Mis Encuestas', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 00-1 1v6a1 1 0 001 1v1a2 2 0 01-2-2V5zM16 5a2 2 0 00-2-2v1a1 1 0 011 1v6a1 1 0 01-1 1v1a2 2 0 002-2V5z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      label: 'Reconocimientos', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    },
    { 
      label: 'Configuración', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      label: 'Centro de Ayuda', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      label: 'Notificaciones', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
      )
    }
  ];

  // Primeros 4 items para la barra inferior en móvil
  const mainMenuItems = menuItems.slice(0, 4);
  // Items adicionales para el modal "Más"
  const additionalItems = menuItems.slice(4);

  const handleMoreClick = () => {
    setIsMoreModalOpen(!isMoreModalOpen);
  };

  const handleMoreModalClose = () => {
    setIsMoreModalOpen(false);
  };

  const handleMenuItemClick = () => {
    // Cerrar ambos modals cuando se selecciona un item
    setIsMoreModalOpen(false);
    onClose();
  };

  return (
    <>
      {/* Overlay para móvil - solo para el modal principal */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Overlay para el modal "Más" */}
      {isMoreModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
          onClick={handleMoreModalClose}
        />
      )}

      {/* Sidebar Desktop */}
      <aside className={`
        hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}>
        {/* Logo en sidebar cuando no está colapsado */}
        {!isCollapsed && (
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="w-18 h-18 rounded"
              />
            </div>
          </div>
        )}

        {/* Menú de navegación */}
        <nav className="flex-1 p-3">
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <button 
                key={index}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 group
                  ${item.isActive 
                    ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
                title={isCollapsed ? item.label : undefined}
                onClick={handleMenuItemClick}
              >
                <span className={`
                  flex-shrink-0 transition-colors duration-200
                  ${item.isActive 
                    ? 'text-blue-600' 
                    : 'text-gray-500 group-hover:text-gray-700'
                  }
                `}>
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="text-sm font-medium truncate">
                    {item.label}
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>
      </aside>

      {/* Sidebar Móvil - Bottom Navigation */}
      <div className="lg:hidden">
        {/* Bottom Navigation Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
          <div className="flex justify-around items-center py-2 px-4">
            {mainMenuItems.map((item, index) => (
              <button 
                key={index}
                className={`
                  flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-0 flex-1
                  ${item.isActive 
                    ? 'text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
                onClick={handleMenuItemClick}
              >
                <span className={`
                  mb-1 transition-colors duration-200
                  ${item.isActive 
                    ? 'text-blue-600' 
                    : 'text-gray-500'
                  }
                `}>
                  {item.icon}
                </span>
                <span className="text-xs font-medium truncate max-w-full">
                  {item.label}
                </span>
              </button>
            ))}
            {/* Botón More para items adicionales */}
            <button 
              onClick={handleMoreClick}
              className={`
                flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-0 flex-1
                ${isMoreModalOpen 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              <span className={`
                mb-1 transition-colors duration-200
                ${isMoreModalOpen 
                  ? 'text-blue-600' 
                  : 'text-gray-500'
                }
              `}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </span>
              <span className="text-xs font-medium">Más</span>
            </button>
          </div>
        </div>

        {/* Padding bottom para evitar que el contenido se oculte detrás del bottom nav */}
        <div className="pb-16"></div>
      </div>

      {/* Modal para más opciones en móvil */}
      {isMoreModalOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed bottom-16 left-4 right-4 bg-white rounded-2xl shadow-2xl p-4 max-h-80 overflow-y-auto border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Más opciones</h3>
              <button
                onClick={handleMoreModalClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-2">
              {additionalItems.map((item, index) => (
                <button 
                  key={index}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors hover:bg-gray-50 active:bg-gray-100"
                  onClick={handleMenuItemClick}
                >
                  <span className="flex-shrink-0 text-gray-500">
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}