import { CONTENT_MODULES } from '../utils/constants';

export function Content() {
  return (
    <main className="flex-1 p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {CONTENT_MODULES.map((module) => (
          <div 
            key={module} 
            className="bg-white rounded-2xl p-5 shadow-sm border hover:shadow-md transition-shadow duration-200"
          >
            <h3 className="font-semibold mb-2">{module}</h3>
            <p className="text-sm text-gray-600">
              Módulo placeholder para {module.toLowerCase()} (datos mock).
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}