// src/App.tsx
import { useState } from 'react';
import type { User } from './types';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { RouterProvider, useRouter } from './hooks/useRouter';

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { currentRoute, routes } = useRouter();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  if (!user) {
    return <Login onSuccess={setUser} />;
  }

  // Encontrar el componente de la ruta actual
  const currentRouteData = routes.find(route => route.key === currentRoute);
  const CurrentComponent = currentRouteData?.component || routes[1].component; // Fallback a Mi Ficha

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header 
        user={user} 
        onSignOut={() => setUser(null)} 
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