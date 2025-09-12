import React from 'react';
import type { HeaderProps } from '../types';

interface ExtendedHeaderProps extends HeaderProps {
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onToggleCollapse: () => void;
}

export function Header({ 
  user, 
  onSignOut, 
  isSidebarOpen, 
  isSidebarCollapsed, 
  onToggleSidebar, 
  onToggleCollapse 
}: ExtendedHeaderProps) {
  return (
    <header className="h-20 flex items-center bg-white border-b border-gray-200 px-4 lg:px-6 shadow-sm">
      {/* Botón hamburguesa para móvil y botón colapsar para desktop */}
      <div className="flex items-center">
        {/* Botón hamburguesa - solo móvil */}
        <button
          onClick={onToggleSidebar}
          className="p-3 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Botón colapsar - solo desktop */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex p-3 rounded-lg hover:bg-gray-100 transition-colors items-center justify-center"
          aria-label="Collapse sidebar"
        >
          <svg 
            className={`w-6 h-6 text-gray-600 transition-transform duration-200 ${
              isSidebarCollapsed ? 'rotate-180' : ''
            }`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7" 
            />
          </svg>
        </button>

      </div>

      {/* Barra de búsqueda */}
      <div className="flex-1 max-w-2xl mx-6 hidden md:block">
        <div className="relative">
          <svg 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar (Ctrl + B)"
            className="w-full pl-12 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 hover:bg-gray-100"
          />
        </div>
      </div>

      {/* Acciones del usuario */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Botón de notificaciones */}
        <button className="p-3 rounded-xl hover:bg-gray-100 transition-colors relative">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {/* Indicador de notificación */}
          <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
        </button>

        {/* Botón de ayuda */}
        <button className="p-3 rounded-xl hover:bg-gray-100 transition-colors">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        {/* Perfil de usuario */}
        <div className="flex items-center gap-3 ml-3 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
            <span className="text-white text-sm font-semibold">
              {user.email.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold text-gray-900">
              Alex Heisinger
            </div>
            <div className="text-xs text-gray-500">
              {user.email}
            </div>
          </div>
          <svg className="w-4 h-4 text-gray-400 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </header>
  );
}