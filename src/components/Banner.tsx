import React from 'react';
import { useStore } from '../context/StoreContext';
import { Package, Truck, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const Banner: React.FC = () => {
  const { settings, totalBoxes } = useStore();

  const minGoal = settings.minBoxesGoal || 35;
  const progressPercent = Math.min(100, Math.round((totalBoxes / minGoal) * 100));
  const boxesRemaining = Math.max(0, minGoal - totalBoxes);

  return (
    <div className="bg-gradient-to-r from-slate-900 via-[#183054] to-slate-900 text-white border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 items-center">
          {/* Quick value props */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 border border-blue-400/30 rounded-lg text-blue-300 shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-blue-200 font-semibold">
                Venta Directa Mayorista
              </div>
              <div className="text-xs text-slate-300">
                Precios por caja s/IVA para distribuidores y cadenas
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 border border-emerald-400/30 rounded-lg text-emerald-300 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-emerald-200 font-semibold">
                Gestión Vía WhatsApp
              </div>
              <div className="text-xs text-slate-300">
                Confirmación rápida de stock, pago y logística
              </div>
            </div>
          </div>

          {/* Wholesale Min Boxes status indicator */}
          <div className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700/80">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-slate-200 flex items-center gap-1.5">
                {totalBoxes >= minGoal ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>Pedido Mínimo: <strong>{minGoal} {minGoal === 1 ? 'caja' : 'cajas'}</strong></span>
              </span>
              <span className="text-[11px] font-bold text-amber-300">
                {totalBoxes} / {minGoal} ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-700">
              <div
                className={`h-full transition-all duration-300 ${
                  totalBoxes >= minGoal ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-emerald-400'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
              <span>
                {totalBoxes >= minGoal
                  ? `✓ ¡Pedido mínimo alcanzado! (${totalBoxes} ${totalBoxes === 1 ? 'caja' : 'cajas'})`
                  : `Agregá al menos ${boxesRemaining} ${boxesRemaining === 1 ? 'caja' : 'cajas'} para continuar`}
              </span>
              <span className="text-slate-400">Venta directa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
