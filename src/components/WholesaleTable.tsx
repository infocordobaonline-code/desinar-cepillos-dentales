import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Plus, Minus, Package, Eye } from 'lucide-react';

interface WholesaleTableProps {
  products: Product[];
}

export const WholesaleTable: React.FC<WholesaleTableProps> = ({ products }) => {
  const { cart, updateQuantity, addToCart, setSelectedProductForDetail, settings } = useStore();

  const getCartBoxes = (productId: string) => {
    const item = cart.find(c => c.productId === productId);
    return item ? item.boxes : 0;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#183054] text-white uppercase text-[11px] tracking-wider border-b border-blue-900">
              <th className="py-3 px-3 font-semibold">Código</th>
              <th className="py-3 px-2 font-semibold">Foto</th>
              <th className="py-3 px-4 font-semibold min-w-[200px]">Descripción</th>
              <th className="py-3 px-3 font-semibold text-center">Unid/caja</th>
              <th className="py-3 px-3 font-semibold text-right">Unitario s/IVA</th>
              <th className="py-3 px-3 font-semibold text-right">Precio Caja s/IVA</th>
              {settings.showSuggestedPrice && (
                <th className="py-3 px-3 font-semibold text-right">Sugerido c/IVA</th>
              )}
              <th className="py-3 px-4 font-semibold text-center min-w-[140px]">Pedir Cajas</th>
              <th className="py-3 px-4 font-semibold text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700">
            {products.map((p, idx) => {
              const currentBoxes = getCartBoxes(p.id);
              const subtotal = currentBoxes * p.boxPrice;
              const isEven = idx % 2 === 0;

              return (
                <tr
                  key={p.id}
                  className={`hover:bg-blue-50/60 transition-colors ${
                    currentBoxes > 0 ? 'bg-emerald-50/40' : isEven ? 'bg-white' : 'bg-slate-50/50'
                  }`}
                >
                  {/* Código */}
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                    <span className="bg-slate-100 text-[#183054] px-2 py-0.5 rounded border border-slate-200">
                      {p.code}
                    </span>
                  </td>

                  {/* Imagen */}
                  <td className="py-2.5 px-2">
                    <div
                      onClick={() => setSelectedProductForDetail(p)}
                      className="w-12 h-12 bg-white rounded border border-slate-200 p-1 flex items-center justify-center cursor-pointer hover:border-blue-400 group relative"
                      title="Click para ampliar"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="max-h-full max-w-full object-contain"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                        <Eye className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </td>

                  {/* Descripción */}
                  <td className="py-2.5 px-4 font-medium text-slate-800">
                    <div
                      onClick={() => setSelectedProductForDetail(p)}
                      className="cursor-pointer hover:text-blue-600 transition-colors font-medium leading-snug"
                    >
                      {p.name}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                      {p.category} {p.line ? `• ${p.line}` : ''}
                    </div>
                  </td>

                  {/* Unidades por caja */}
                  <td className="py-2.5 px-3 text-center font-semibold text-slate-600">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {p.unitsPerBox}
                    </span>
                  </td>

                  {/* Precio unitario sin IVA */}
                  <td className="py-2.5 px-3 text-right font-medium text-slate-700">
                    ${p.unitPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </td>

                  {/* Precio por caja sin IVA */}
                  <td className="py-2.5 px-3 text-right font-bold text-[#183054]">
                    ${p.boxPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </td>

                  {/* Precio sugerido con IVA */}
                  {settings.showSuggestedPrice && (
                    <td className="py-2.5 px-3 text-right text-emerald-700 font-semibold">
                      ${p.suggestedPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </td>
                  )}

                  {/* Stepper Cajas */}
                  <td className="py-2.5 px-4 text-center">
                    <div className="inline-flex items-center border border-slate-300 rounded-lg bg-white shadow-2xs overflow-hidden">
                      <button
                        onClick={() => updateQuantity(p.id, Math.max(0, currentBoxes - 1))}
                        disabled={currentBoxes === 0}
                        className={`px-2 py-1.5 transition-colors ${
                          currentBoxes === 0
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'text-slate-700 hover:bg-slate-100 active:bg-slate-200'
                        }`}
                        title="Restar 1 caja"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <input
                        type="number"
                        min="0"
                        value={currentBoxes}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          updateQuantity(p.id, Math.max(0, val));
                        }}
                        className="w-12 text-center text-xs font-bold text-slate-900 border-x border-slate-200 focus:outline-none focus:bg-blue-50 py-1"
                      />

                      <button
                        onClick={() => {
                          if (currentBoxes === 0) {
                            addToCart(p.id, 1);
                          } else {
                            updateQuantity(p.id, currentBoxes + 1);
                          }
                        }}
                        className="px-2 py-1.5 text-white bg-[#183054] hover:bg-blue-900 active:bg-blue-950 transition-colors"
                        title="Sumar 1 caja"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* Subtotal */}
                  <td className="py-2.5 px-4 text-right font-bold">
                    {subtotal > 0 ? (
                      <span className="text-emerald-700 text-sm">
                        ${subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-normal">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
