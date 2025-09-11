import { SIDEBAR_ITEMS } from '../utils/constants';

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-white h-[calc(100vh-4rem)] overflow-y-auto">
      <nav className="p-3 space-y-1">
        {SIDEBAR_ITEMS.map((item) => (
          <button 
            key={item.label}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-gray-100 text-gray-700 transition-colors duration-150"
          >
            <span className="text-lg" aria-hidden="true">
              {item.icon}
            </span>
            <span className="text-sm font-medium">
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );
}