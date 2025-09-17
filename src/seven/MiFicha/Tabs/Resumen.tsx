// src/seven/MiFicha/components/Resumen.tsx
import { type Trabajador } from '../../../hooks/useTrabajador';

interface ResumenProps {
  trabajador: Trabajador;
}

export function Resumen({ trabajador }: ResumenProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      {/* Información Personal */}
      <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Información Personal</h3>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
            <span className="text-sm text-gray-500">Dirección</span>
            <span className="text-sm font-medium text-right">{trabajador.traDireccion}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
            <span className="text-sm text-gray-500">Fecha de Nacimiento</span>
            <span className="text-sm font-medium text-right">{trabajador.showTraFechaNacimiento} ({trabajador.edad} años)</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
            <span className="text-sm text-gray-500">Licencia</span>
            <span className="text-sm font-medium text-right">{trabajador.licDescripcion}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
            <span className="text-sm text-gray-500">Género</span>
            <span className="text-sm font-medium text-right">{trabajador.tseNombre}</span>
          </div>
        </div>
      </div>

      {/* Forma de Pago */}
      <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Forma de Pago</h3>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
            <span className="text-sm text-gray-500">Banco</span>
            <span className="text-sm font-medium text-right">{trabajador.banNombre}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
            <span className="text-sm text-gray-500">Tipo de Cuenta</span>
            <span className="text-sm font-medium text-right">{trabajador.fopaDescripcion}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
            <span className="text-sm text-gray-500">N° de Cuenta</span>
            <span className="text-sm font-medium text-right">{trabajador.traNcuenta}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
            <span className="text-sm text-gray-500">Estado</span>
            <span className={`text-sm font-medium text-right ${trabajador.vigente ? 'text-green-600' : 'text-red-600'}`}>
              {trabajador.vigente ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>
      </div>

      {/* Previsión y Salud */}
      <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Previsión y Salud</h3>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
            <span className="text-sm text-gray-500">AFP</span>
            <span className="text-sm font-medium text-right">{trabajador.afpNombre}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
            <span className="text-sm text-gray-500">Salud</span>
            <span className="text-sm font-medium text-right">{trabajador.salNombre}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
            <span className="text-sm text-gray-500">APV %</span>
            <span className="text-sm font-medium text-right">{trabajador.afpApvPorc}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
            <span className="text-sm text-gray-500">Pensionado</span>
            <span className="text-sm font-medium text-right">{trabajador.pensionado}</span>
          </div>
        </div>
      </div>
    </div>
  );
}