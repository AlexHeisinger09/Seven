import { useState, useEffect } from 'react';
import { useAuth, type Usuario } from './hooks/useAuth';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { RouterProvider, useRouter } from './hooks/useRouter';
import { NotificationProvider } from './contexts/NotificationContext'; // 👈 NUEVO IMPORT

function AppContent() {
  const { user, logout, validateToken, getCurrentUser, isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const { currentRoute, routes } = useRouter();

  // Verificar autenticación al cargar la app
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Validar token y obtener usuario actual
          const isValid = await validateToken();
          if (isValid) {
            await getCurrentUser();
          }
        }
      } catch (error) {
        console.error('Error inicializando autenticación:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, [validateToken, getCurrentUser]);

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

  // Mostrar loading mientras se inicializa
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Mostrar login si no está autenticado
  if (!isAuthenticated || !user) {
    return <Login onSuccess={(user: Usuario) => {
      // Esta función se llama después del login exitoso
      // pero el estado ya debería estar actualizado por el hook
      console.log('Login exitoso para:', user.nombreCompleto);
    }} />;
  }

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
    <NotificationProvider> {/* 👈 ENVOLVER CON EL PROVIDER DE NOTIFICACIONES */}
      <RouterProvider>
        <AppContent />
      </RouterProvider>
    </NotificationProvider>
  );
}
