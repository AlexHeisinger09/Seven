import { CONTENT_MODULES } from '../utils/constants';

interface ContentProps {
  isSidebarCollapsed?: boolean;
}

export function Content({ isSidebarCollapsed = false }: ContentProps) {
  return (
    <main className={`
      flex-1 p-4 lg:p-6 bg-gray-50 min-h-[calc(100vh-4rem)] w-full overflow-x-hidden
      transition-all duration-300 ease-in-out
      ${isSidebarCollapsed ? 'lg:ml-0' : 'lg:ml-0'}
    `}>
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-4 lg:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {CONTENT_MODULES.map((module) => (
            <div 
              key={module} 
              className="bg-white rounded-xl p-4 lg:p-5 shadow-sm border hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
            >
              <h3 className="font-semibold mb-2 text-gray-900">{module}</h3>
              <p className="text-sm text-gray-600">
                Módulo placeholder para {module.toLowerCase()} (datos mock).
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}