import { type LiquidacionAgrupada } from '../../hooks/useLiquidaciones';

interface LiquidacionDetallePDFProps {
  periodo: LiquidacionAgrupada;
}

export function LiquidacionDetallePDF({ periodo }: LiquidacionDetallePDFProps) {
  const formatCurrency = (value: number): string => {
    return `$ ${new Intl.NumberFormat('es-CL', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)}`;
  };

  // Obtener datos del primer registro para información del trabajador
  const primerLiq = periodo.liquidaciones[0];
  
  // Calcular totales
  const sueldoBase = periodo.liquidaciones.reduce((sum, liq) => sum + liq.valorBase, 0);
  const gratificacion = 0; // No viene en los datos
  const aguinaldo = 0; // No viene en los datos
  
  const colacion = periodo.liquidaciones.reduce((sum, liq) => sum + liq.colacion, 0);
  const movilizacion = periodo.liquidaciones.reduce((sum, liq) => sum + liq.movilizacion, 0);
  
  const totalHaberesImponibles = periodo.totalHaberesImponibles;
  const totalHaberesNoImponibles = periodo.totalHaberesNoImponibles;
  const totalHaberes = periodo.totalHaberes;
  
  const cotizPreviObligatoria = periodo.liquidaciones.reduce((sum, liq) => sum + liq.descAfp, 0);
  const cotizSaludObligatoria = periodo.liquidaciones.reduce((sum, liq) => sum + liq.descSalud, 0);
  const seguroCesantia = periodo.liquidaciones.reduce((sum, liq) => sum + liq.descC2, 0);
  const impuestoUnico = periodo.liquidaciones.reduce((sum, liq) => sum + liq.imptoUnico, 0);
  
  const seguroComplementario = 0; // No viene en los datos
  const aguinaldoPagado = 0; // No viene en los datos
  
  const totalDescuentosLegales = cotizPreviObligatoria + cotizSaludObligatoria + seguroCesantia + impuestoUnico;
  const totalOtrosDescuentos = seguroComplementario + aguinaldoPagado;
  
  const totalDescuentos = periodo.totalDescuentos;
  
  const impPrevSalud = cotizPreviObligatoria + cotizSaludObligatoria;
  const impCesantia = seguroCesantia;
  const baseTributable = totalHaberesImponibles - totalDescuentosLegales;
  
  const liquidoARecibir = periodo.liquidoTotal;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Botón de imprimir - se oculta al imprimir */}
      <div className="mb-6 print:hidden">
        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Imprimir / Descargar PDF
        </button>
      </div>

      {/* Documento de liquidación */}
      <div className="bg-white p-8 rounded-xl shadow-lg print:shadow-none print:rounded-none">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 pb-4 border-b-2 border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Liquidación de Sueldo</h1>
            <p className="text-gray-600">
              <strong>Empleador:</strong> Muelles de Penco S.A. (91.577.000-2)
            </p>
            <p className="text-gray-600">
              <strong>Mes:</strong> {periodo.mes} {periodo.anio}
            </p>
          </div>
          <div className="text-right">
            <img 
              src="/logo.png" 
              alt="Muelles de Penco" 
              className="h-24 mb-6"
            />
          </div>
        </div>

        {/* Información del trabajador */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-6 text-sm">
          <div className="flex">
            <span className="font-semibold text-gray-700 w-32">Sr(a):</span>
            <span className="text-gray-900">
              {primerLiq.trabajadorApellidoP} {primerLiq.trabajadorApellidoM}, {primerLiq.trabajadorNombre}
            </span>
          </div>
          <div className="flex">
            <span className="font-semibold text-gray-700 w-32">Tipo Contrato:</span>
            <span className="text-gray-900">{primerLiq.traContratoProvision || 'Indefinido'}</span>
          </div>
          <div className="flex">
            <span className="font-semibold text-gray-700 w-32">RUT:</span>
            <span className="text-gray-900">{primerLiq.traFicha}</span>
          </div>
          <div className="flex">
            <span className="font-semibold text-gray-700 w-32">Inicio Contrato:</span>
            <span className="text-gray-900">{primerLiq.faeFechaInicialShow}</span>
          </div>
          <div className="flex">
            <span className="font-semibold text-gray-700 w-32">Cargo:</span>
            <span className="text-gray-900">{primerLiq.carNombre}</span>
          </div>
          <div className="flex">
            <span className="font-semibold text-gray-700 w-32">Días Trabajados:</span>
            <span className="text-gray-900">{periodo.diasTrabajados} días</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex">
            <span className="font-semibold text-gray-700 text-sm">Sueldo Base:</span>
            <span className="text-gray-900 text-sm ml-2">{formatCurrency(sueldoBase)}</span>
          </div>
        </div>

        {/* Tabla principal */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* HABERES IMPONIBLES */}
          <div>
            <div className="bg-gray-100 px-4 py-2 font-bold text-gray-900 text-sm mb-2">
              HABERES IMPONIBLES
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between px-4 py-1">
                <span className="text-gray-700">Sueldo Base</span>
                <span className="text-gray-900">{formatCurrency(sueldoBase)}</span>
              </div>
              <div className="flex justify-between px-4 py-1">
                <span className="text-gray-700">Gratificación Mensual</span>
                <span className="text-gray-900">{formatCurrency(gratificacion)}</span>
              </div>
              <div className="flex justify-between px-4 py-1">
                <span className="text-gray-700">Aguinaldo (Fiestas Patrias)</span>
                <span className="text-gray-900">{formatCurrency(aguinaldo)}</span>
              </div>
            </div>
          </div>

          {/* DESCUENTOS LEGALES */}
          <div>
            <div className="bg-gray-100 px-4 py-2 font-bold text-gray-900 text-sm mb-2">
              DESCUENTOS LEGALES
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between px-4 py-1">
                <span className="text-gray-700">Cotiz. Previ. Obligatoria</span>
                <span className="text-gray-900">{formatCurrency(cotizPreviObligatoria)}</span>
              </div>
              <div className="flex justify-between px-4 py-1">
                <span className="text-gray-700">Cotiz. Salud Obligatoria</span>
                <span className="text-gray-900">{formatCurrency(cotizSaludObligatoria)}</span>
              </div>
              <div className="flex justify-between px-4 py-1">
                <span className="text-gray-700">Seguro Cesantía</span>
                <span className="text-gray-900">{formatCurrency(seguroCesantia)}</span>
              </div>
              <div className="flex justify-between px-4 py-1">
                <span className="text-gray-700">Impuesto Único</span>
                <span className="text-gray-900">{formatCurrency(impuestoUnico)}</span>
              </div>
            </div>
          </div>

          {/* HABERES NO IMPONIBLES */}
          <div>
            <div className="bg-gray-100 px-4 py-2 font-bold text-gray-900 text-sm mb-2">
              HABERES NO IMPONIBLES
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between px-4 py-1">
                <span className="text-gray-700">Colación</span>
                <span className="text-gray-900">{formatCurrency(colacion)}</span>
              </div>
              <div className="flex justify-between px-4 py-1">
                <span className="text-gray-700">Movilización</span>
                <span className="text-gray-900">{formatCurrency(movilizacion)}</span>
              </div>
            </div>
          </div>

          {/* OTROS DESCUENTOS */}
          <div>
            <div className="bg-gray-100 px-4 py-2 font-bold text-gray-900 text-sm mb-2">
              OTROS DESCUENTOS
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between px-4 py-1">
                <span className="text-gray-700">Seguro Complementario</span>
                <span className="text-gray-900">{formatCurrency(seguroComplementario)}</span>
              </div>
              <div className="flex justify-between px-4 py-1">
                <span className="text-gray-700">Aguinaldo Pagado</span>
                <span className="text-gray-900">{formatCurrency(aguinaldoPagado)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Totales */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 px-4 py-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-900">TOTAL HABERES:</span>
              <span className="font-bold text-gray-900 text-lg">{formatCurrency(totalHaberes)}</span>
            </div>
          </div>
          <div className="bg-blue-50 px-4 py-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-900">TOTAL DESCUENTOS:</span>
              <span className="font-bold text-gray-900 text-lg">{formatCurrency(totalDescuentos)}</span>
            </div>
          </div>
        </div>

        {/* Resumen final */}
        <div className="border-t-2 border-gray-200 pt-4 mb-6">
          <div className="grid grid-cols-3 gap-4 text-sm mb-4">
            <div className="text-center">
              <div className="font-semibold text-gray-700 mb-1">IMP. PREV./SALUD:</div>
              <div className="font-bold text-gray-900">{formatCurrency(impPrevSalud)}</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-700 mb-1">IMP. CESANTÍA:</div>
              <div className="font-bold text-gray-900">{formatCurrency(impCesantia)}</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-700 mb-1">BASE TRIBUTABLE:</div>
              <div className="font-bold text-gray-900">{formatCurrency(baseTributable)}</div>
            </div>
          </div>

          <div className="bg-blue-100 px-6 py-4 rounded-lg text-center">
            <div className="text-gray-700 font-semibold mb-2 text-lg">LÍQUIDO A RECIBIR:</div>
            <div className="text-3xl font-bold text-blue-700">{formatCurrency(liquidoARecibir)}</div>
          </div>
        </div>

        {/* Declaración */}
        <div className="text-sm text-gray-700 mb-8 p-4 bg-gray-50 rounded">
          <p className="mb-2">
            Certifico que he recibido de Muelles de Penco S.A. (91.577.000-2) a mi entera satisfacción 
            el saldo indicado en la presente Liquidación y no tengo cargo ni cobro posterior que hacer.
          </p>
        </div>

        {/* Firma */}
        <div className="flex justify-center mt-12">
          <div className="text-center">
            <div className="border-t-2 border-gray-900 w-64 mb-2"></div>
            <p className="font-semibold text-gray-900">FIRMA CONFORME</p>
          </div>
        </div>

        {/* Detalle de días trabajados - print:hidden para no imprimir */}
        <div className="mt-8 pt-8 border-t-2 border-gray-200 print:hidden">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Detalle por día trabajado</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Fecha</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Faena</th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-700">Haberes</th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-700">Descuentos</th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-700">Líquido</th>
                </tr>
              </thead>
              <tbody>
                {periodo.liquidaciones.map((liq, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-2">{liq.faeFechaInicialShow}</td>
                    <td className="px-4 py-2">{liq.tfaDescripcion}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(liq.totalHaber)}</td>
                    <td className="px-4 py-2 text-right text-red-600">{formatCurrency(liq.totalDescuentos)}</td>
                    <td className="px-4 py-2 text-right font-semibold">{formatCurrency(liq.liquidoPago)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 font-bold">
                  <td className="px-4 py-3" colSpan={2}>TOTAL</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(totalHaberes)}</td>
                  <td className="px-4 py-3 text-right text-red-600">{formatCurrency(totalDescuentos)}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(liquidoARecibir)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}