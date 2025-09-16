// src/components/Header.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Usuario } from '../hooks/useAuth';
import { useTrabajador } from '../hooks/useTrabajador'; // ✅ Importar hook del trabajador
import { Avatar } from './Avatar';
import { ChangePasswordModal } from '../seven/Configuracion/ChangePasswordModal';

interface HeaderProps {
  user: Usuario;
  onSignOut: () => void;
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
}: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ Hook para obtener información completa del trabajador (incluyendo foto y género)
  const { trabajador, loading: trabajadorLoading, getMiInformacion } = useTrabajador();

  // ✅ Cargar información del trabajador al montar el Header
  useEffect(() => {
    getMiInformacion();
  }, [getMiInformacion]);

  // Debug logs
  useEffect(() => {
    if (trabajador) {
      console.log('👤 Trabajador cargado en Header:', {
        nombre: trabajador.nombreCompleto,
        foto: trabajador.traFoto,
        genero: trabajador.tseNombre
      });
    }
  }, [trabajador]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleConfigClick = () => {
    setIsDropdownOpen(false);
    console.log('Abrir configuración');
  };

  const handleChangePasswordClick = () => {
    setIsDropdownOpen(false);
    setIsChangePasswordModalOpen(true);
  };

  const handleSignOutClick = () => {
    setIsDropdownOpen(false);
    onSignOut();
  };

  const handleToggleClick = () => {
    if (window.innerWidth >= 1024) {
      onToggleCollapse();
    }
  };

  // ✅ Función para obtener el nombre completo (prioriza info del trabajador)
  const getUserDisplayName = (): string => {
    // 1. Priorizar información completa del trabajador
    if (trabajador?.nombreCompleto) {
      return trabajador.nombreCompleto;
    }

    // 2. Fallback a información básica del usuario
    if (user.nombreCompleto) {
      return user.nombreCompleto;
    }

    // 3. Construir nombre desde partes individuales
    const parts = [user.usuNombre, user.usuApellidoP, user.usuApellidoM].filter(Boolean);
    if (parts.length > 0) {
      return parts.join(' ');
    }

    // 4. Último fallback
    return user.usuUser || 'Usuario';
  };

  // ✅ Función para obtener el email (prioriza info del trabajador)
  const getUserEmail = (): string => {
    return trabajador?.traEmail || user.usuEmail || 'Sin email';
  };

  // ✅ Función para determinar género - EXACTAMENTE IGUAL QUE EN MIFICHA
  const getAvatarGender = (): 'male' | 'female' | 'other' => {
    const g = trabajador?.tseNombre?.toLowerCase() || '';
    if (g.includes('femenino') || g.includes('femenina')) return 'female';
    if (g.includes('masculino') || g.includes('masculina')) return 'male';
    return 'other';
  };

  return (
    <>
      <header className="h-20 flex items-center bg-white border-b border-gray-200 px-4 lg:px-6 shadow-sm">
        {/* Botón hamburguesa - solo visible en desktop para colapsar */}
        <div className="flex items-center">
          <button
            onClick={handleToggleClick}
            className="hidden lg:flex p-3 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg
              className={`w-6 h-6 text-gray-600 transition-transform duration-200 ${isSidebarCollapsed ? 'rotate-0' : 'rotate-0'
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Logo visible en móvil cuando no hay botón hamburguesa */}
        <div className="lg:hidden flex items-center">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-18 h-18"
          />
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
          {/* Botón de búsqueda en móvil */}
          <button className="md:hidden p-3 rounded-xl hover:bg-gray-100 transition-colors">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Botón de notificaciones */}
          <button className="p-3 rounded-xl hover:bg-gray-100 transition-colors relative">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
          </button>

          {/* Botón de ayuda */}
          <button className="hidden sm:flex p-3 rounded-xl hover:bg-gray-100 transition-colors">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          {/* Perfil de usuario con dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center gap-3 ml-3 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={handleProfileClick}
            >
              {/* ✅ Avatar con información completa del trabajador */}
              <Avatar
                name={getUserDisplayName()}
                size="md"
                className="shadow-sm"
                gender={getAvatarGender()}
                src={trabajador?.traFoto && trabajador.traFoto.trim() !== '' ? trabajador.traFoto : undefined}
              />
              <div className="hidden sm:block">
                <div className="text-sm font-semibold text-gray-900">
                  {getUserDisplayName()}
                </div>
                <div className="text-xs text-gray-500">
                  {getUserEmail()}
                </div>
              </div>
              <svg
                className={`w-4 h-4 text-gray-400 hidden sm:block transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-3 z-50">
                {/* Opción Configuración */}
                <button
                  onClick={handleConfigClick}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Configuración
                </button>

                {/* Opción Cambiar Contraseña */}
                <button
                  onClick={handleChangePasswordClick}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Cambiar Contraseña
                </button>

                {/* Separador */}
                <div className="border-t border-gray-100 my-1"></div>

                {/* Opción Cerrar Sesión */}
                <button
                  onClick={handleSignOutClick}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal de cambio de contraseña */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />
    </>
  );
}