// src/App.tsx - CON IMPORTACIONES CORREGIDAS
import React, { useState, useEffect } from 'react';
import { useAuth, type Usuario, AuthProvider } from './hooks/useAuth';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { RouterProvider, useRouter } from './hooks/useRouter';

function AppContent() {
  const { user, logout, validateToken, getCurrentUser, isAuthenticated, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const { currentRoute, routes } = useRouter();

  console.log('🏠 App render - Estado actual:', {
    hasUser: !!user,
    isAuthenticated,
    isInitializing,
    loading,
    userName: user?.nombre_completo
  });

  useEffect(() => {
    const initAuth = async () => {
      console.log('🔄 Inicializando autenticación...');
      try {
        const token = localStorage.getItem('auth_token');
        console.log('🔑 Token encontrado:', !!token);
        
        if (token) {
          const isValid = await validateToken();
          console.log('✅ Token válido:', isValid);
          if (isValid) {
            await getCurrentUser();
          }
        }
      } catch (error) {
        console.error('❌ Error inicializando autenticación:', error);
      } finally {
        console.log('✅ Inicialización completa');
        setIsInitializing(false);
      }
    };

    initAuth();
  }, [validateToken, getCurrentUser]);

  useEffect(() => {
    if (user && isInitializing) {
      console.log('👤 Usuario detectado, terminando inicialización');
      setIsInitializing(false);
    }
  }, [user, isInitializing]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleCollapse = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const closeSidebar = () => setIsSidebarOpen(false);
  const handleSignOut = () => {
    logout();
    setIsSidebarOpen(false);
  };

  if (isInitializing || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isInitializing ? 'Cargando...' : 'Iniciando sesión...'}
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    console.log('🔐 Mostrando login - No autenticado');
    return <Login onSuccess={(user: Usuario) => {
      console.log('✅ Login exitoso callback para:', user.nombre_completo);
    }} />;
  }

  console.log('🏠 Mostrando aplicación principal para:', user.nombre_completo);

  const currentRouteData = routes.find(route => route.key === currentRoute);
  const CurrentComponent = currentRouteData?.component || routes[1].component;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header 
        user={user}
        onSignOut={handleSignOut}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleCollapse}
      />
      <div className="flex flex-1 relative">
        <Sidebar 
          isOpen={isSidebarOpen} 
          isCollapsed={isSidebarCollapsed}
          onClose={closeSidebar} 
        />
        <CurrentComponent isSidebarCollapsed={isSidebarCollapsed} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider>
        <AppContent />
      </RouterProvider>
    </AuthProvider>
  );
}