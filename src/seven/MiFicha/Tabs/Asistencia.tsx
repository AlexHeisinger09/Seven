import { useMemo } from 'react';

interface CalendarDay {
  day: number;
  isToday: boolean;
  isWeekend: boolean;
  isWorked: boolean;
  hours: string;
  status: 'worked' | 'weekend' | 'pending';
}

export function Asistencia() {
  // Generar días del mes (simulado)
  const calendarDays = useMemo(() => {
    const days: CalendarDay[] = [];
    const today = new Date().getDate();

    for (let i = 1; i <= 30; i++) {
      const isToday = i === today;
      const isWeekend = i % 7 === 0 || (i + 1) % 7 === 0;
      const isWorked = i <= today && !isWeekend && Math.random() > 0.1;

      days.push({
        day: i,
        isToday,
        isWeekend,
        isWorked,
        hours: isWorked ? '8:00 hrs' : '',
        status: isWorked ? 'worked' : isWeekend ? 'weekend' : 'pending'
      });
    }
    return days;
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      {/* Calendario */}
      <div className="lg:col-span-2 bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Septiembre 2025</h3>
          <div className="flex gap-2">
            <button className="p-1 hover:bg-gray-100 rounded">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-4">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div key={day} className="text-center text-xs md:text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {calendarDays.map(day => (
            <div
              key={day.day}
              className={`
                relative p-2 md:p-3 rounded-lg text-center text-xs md:text-sm border-2 transition-colors
                ${day.isToday
                  ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold'
                  : day.isWorked
                    ? 'border-green-200 bg-green-50 text-green-700'
                    : day.isWeekend
                      ? 'border-gray-200 bg-gray-50 text-gray-400'
                      : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="font-medium">{day.day < 10 ? `0${day.day}` : day.day}</div>
              {day.hours && (
                <div className="text-xs text-gray-600 mt-1 hidden md:block">{day.hours}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Resumen de horas */}
      <div className="space-y-4 md:space-y-6">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 md:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl md:text-3xl font-bold">60 hrs</div>
              <div className="text-yellow-100 text-sm">Total del mes</div>
            </div>
            <div className="text-right">
              <div className="text-xl md:text-2xl font-bold">$120</div>
              <div className="text-yellow-100 text-sm">Monto</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-4">Detalles</h4>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Investigación de tendencias</span>
              <span className="font-medium">2 hr</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Desarrollo de portafolio digital</span>
              <span className="font-medium">4 hr</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Análisis de campañas anteriores</span>
              <span className="font-medium">2 hr</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Benchmarking de marcas competidoras</span>
              <span className="font-medium">1 hr</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}