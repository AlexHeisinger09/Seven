// src/App.tsx - Componente App Corregido
import { useState, useEffect } from 'react';
import { useAuth, type Usuario } from './hooks/useAuth';
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

  // Log para debugging
  console.log('🏠 App render - Estado actual:', {
    hasUser: !!user,
    isAuthenticated,
    isInitializing,
    loading,
    userName: user?.nombre_completo
  });

  // Verificar autenticación al cargar la app
  useEffect(() => {
    const initAuth = async () => {
      console.log('🔄 Inicializando autenticación...');
      try {
        const token = localStorage.getItem('auth_token');
        console.log('🔑 Token encontrado:', !!token);
        
        if (token) {
          // Validar token y obtener usuario actual
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

  // También escuchar cambios en el usuario para salir del modo inicialización
  useEffect(() => {
    if (user && isInitializing) {
      console.log('👤 Usuario detectado, terminando inicialización');
      setIsInitializing(false);
    }
  }, [user, isInitializing]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleSignOut = () => {
    logout();
    setIsSidebarOpen(false);
  };

  // Mostrar loading mientras se inicializa o está cargando
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

  // Mostrar login si no está autenticado
  if (!isAuthenticated || !user) {
    console.log('🔐 Mostrando login - No autenticado');
    return <Login onSuccess={(user: Usuario) => {
      console.log('✅ Login exitoso callback para:', user.nombre_completo);
    }} />;
  }

  // Si llegamos aquí, el usuario está autenticado
  console.log('🏠 Mostrando aplicación principal para:', user.nombre_completo);

  // Encontrar el componente de la ruta actual
  const currentRouteData = routes.find(route => route.key === currentRoute);
  const CurrentComponent = currentRouteData?.component || routes[1].component; // Fallback a Mi Ficha

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
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}