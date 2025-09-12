import React from 'react';
import type { HeaderProps } from '../types';

interface ExtendedHeaderProps extends HeaderProps {
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onToggleCollapse: () => void;
}

export function Header({ user, onSignOut, isSidebarOpen, isSidebarCollapsed, onToggleSidebar, onToggleCollapse }: ExtendedHeaderProps) {
  return (
    <header className="h-16 flex items-center bg-white border-b border-gray-200 px-4 lg:px-6">
      {/* Botón hamburguesa para móvil y botón colapsar para desktop */}
      <div className="flex items-center">
        {/* Botón hamburguesa - solo móvil */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Botón colapsar - solo desktop */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Collapse sidebar"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="flex-1 max-w-xl mx-6 hidden md:block">
        <div className="relative">
          <svg 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar (Ctrl + B)"
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Acciones del usuario - pegadas a la derecha */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Botón de notificaciones */}
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        {/* Botón de ayuda */}
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        {/* Perfil de usuario */}
        <div className="flex items-center gap-2 ml-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user.email.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-sm text-blue-600 font-medium hidden sm:inline">
            Alex Brayam
          </span>
        </div>
      </div>
    </header>
  );
}