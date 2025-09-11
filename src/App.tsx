import { useState } from 'react';
import type { User } from './types';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Content } from './components/Content';

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  if (!user) {
    return <Login onSuccess={setUser} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} onSignOut={() => setUser(null)} />
      <div className="flex flex-1">
        <Sidebar />
        <Content />
      </div>
    </div>
  );
}