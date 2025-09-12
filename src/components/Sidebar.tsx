// src/components/Sidebar.tsx
import React, { useState } from 'react';
import { useRouter } from '../hooks/useRouter';
import type { RouteKey } from '../types/router';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, isCollapsed, onClose }: SidebarProps) {
  const { routes, currentRoute, navigate } = useRouter();
  const [isMoreModalOpen, setIsMoreModalOpen] = useState(false);

  // Primeros 4 items para la barra inferior en móvil
  const mainMenuItems = routes.slice(0, 4);
  // Items adicionales para el modal "Más"
  const additionalItems = routes.slice(4);

  const handleMoreClick = () => {
    setIsMoreModalOpen(!isMoreModalOpen);
  };

  const handleMoreModalClose = () => {
    setIsMoreModalOpen(false);
  };

  const handleMenuItemClick = (routeKey: RouteKey) => {
    navigate(routeKey);
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
            {routes.map((route) => (
              <button 
                key={route.key}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 group
                  ${currentRoute === route.key
                    ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
                title={isCollapsed ? route.label : undefined}
                onClick={() => handleMenuItemClick(route.key)}
              >
                <span className={`
                  flex-shrink-0 transition-colors duration-200
                  ${currentRoute === route.key
                    ? 'text-blue-600' 
                    : 'text-gray-500 group-hover:text-gray-700'
                  }
                `}>
                  {route.icon}
                </span>
                {!isCollapsed && (
                  <span className="text-sm font-medium truncate">
                    {route.label}
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
            {mainMenuItems.map((route) => (
              <button 
                key={route.key}
                className={`
                  flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-0 flex-1
                  ${currentRoute === route.key
                    ? 'text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
                onClick={() => handleMenuItemClick(route.key)}
              >
                <span className={`
                  mb-1 transition-colors duration-200
                  ${currentRoute === route.key
                    ? 'text-blue-600' 
                    : 'text-gray-500'
                  }
                `}>
                  {route.icon}
                </span>
                <span className="text-xs font-medium truncate max-w-full">
                  {route.label}
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
              {additionalItems.map((route) => (
                <button 
                  key={route.key}
                  className={`
                    w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors
                    ${currentRoute === route.key
                      ? 'bg-blue-50 text-blue-700'
                      : 'hover:bg-gray-50 active:bg-gray-100'
                    }
                  `}
                  onClick={() => handleMenuItemClick(route.key)}
                >
                  <span className={`
                    flex-shrink-0
                    ${currentRoute === route.key ? 'text-blue-600' : 'text-gray-500'}
                  `}>
                    {route.icon}
                  </span>
                  <span className={`
                    text-sm font-medium
                    ${currentRoute === route.key ? 'text-blue-700' : 'text-gray-700'}
                  `}>
                    {route.label}
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