import type { HeaderProps } from '../types';
import { COLORS } from '../utils/constants';

const { BUK_BLUE } = COLORS;

export function Header({ user, onSignOut }: HeaderProps) {
  return (
    <header 
      className="h-16 flex items-center justify-between px-6 border-b bg-white" 
      style={{ borderColor: '#E5E7EB' }}
    >
      <div className="flex items-center gap-3">
        <img 
          src="/logo.png" 
          alt="Logo" 
          className="w-10 h-10 rounded-lg"
          style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.1))' }}
        />
        <span className="font-semibold text-gray-800">
          MDP TI – Demo RRHH
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 hidden sm:inline">
          {user.email}
        </span>
        <button 
          onClick={onSignOut} 
          className="text-sm px-3 py-1.5 rounded-md text-white hover:opacity-90 transition-opacity" 
          style={{ background: BUK_BLUE }}
        >
          Salir
        </button>
      </div>
    </header>
  );
}