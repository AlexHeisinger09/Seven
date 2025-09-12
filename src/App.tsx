import { useState } from 'react';
import type { User } from './types';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Content } from './components/Content';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  if (!user) {
    return <Login onSuccess={setUser} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header 
        user={user} 
        onSignOut={() => setUser(null)} 
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
        isSidebarCollapsed={false}
        onToggleCollapse={() => {}}
      />
      <div className="flex flex-1 relative">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <Content isSidebarCollapsed={false} />
      </div>
    </div>
  );
}