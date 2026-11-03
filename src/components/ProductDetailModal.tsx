import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Package, TrendingUp, ShoppingCart, Check, Info } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { selectedProductForDetail, setSelectedProductForDetail, addToCart, cart, updateQuantity, settings } = useStore();
  const [boxes, setBoxes] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  if (!selectedProductForDetail) return null;

  const product = selectedProductForDetail;
  const inCart = cart.find(c => c.productId === product.id);
  const currentInCartBoxes = inCart ? inCart.boxes : 0;

  const margin = product.suggestedPrice > product.unitPrice
    ? Math.round(((product.suggestedPrice - product.unitPrice) / product.suggestedPrice) * 100)
    : 0;

  const handleAdd = () => {
    addToCart(product.id, boxes);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      setSelectedProductForDetail(null);
    }, 900);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
      onClick={() => setSelectedProductForDetail(null)}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between p-4 bg-[#183054] text-white">
          <div className="flex items-center gap-2">
            <span className="font-mono bg-blue-900 text-amber-300 px-2.5 py-0.5 rounded text-xs font-bold">
              {product.code}
            </span>
            <span className="text-xs text-blue-200 font-medium">{product.category}</span>
          </div>
          <button
            onClick={() => setSelectedProductForDetail(null)}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Large image preview */}
          <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-center min-h-[260px] border border-slate-200">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-64 max-w-full object-contain"
            />
          </div>

          {/* Product details */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                {product.name}
              </h2>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                <Package className="w-3.5 h-3.5 text-slate-400" />
                <span>Presentación: Caja cerrada por <strong>{product.unitsPerBox} unidades</strong></span>
              </div>
            </div>

            {/* Price breakdown card */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                  <span>Precio por Caja:</span>
                  <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-200 px-1 rounded font-bold">s/IVA</span>
                </span>
                <span className="text-xl font-black text-[#183054]">
                  ${product.boxPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-baseline justify-between text-xs text-slate-600 pt-1.5 border-t border-slate-200">
                <span>Precio Unitario (sin IVA):</span>
                <span className="font-semibold text-slate-800">
                  ${product.unitPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })} / u
                </span>
              </div>

              {settings.showSuggestedPrice && (
                <div className="flex items-baseline justify-between text-xs text-slate-600 pt-1.5 border-t border-slate-200">
                  <span className="flex items-center gap-1 text-slate-700">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Precio Sugerido Venta Público:</span>
                  </span>
                  <div className="text-right">
                    <span className="font-bold text-emerald-700 text-sm">
                      ${product.suggestedPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </span>
                    {margin > 0 && (
                      <span className="ml-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                        +{margin}% margen
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Ordering box stepper */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Cantidad de cajas a agregar:
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-2xs">
                  <button
                    onClick={() => setBoxes(prev => Math.max(1, prev - 1))}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={boxes}
                    onChange={(e) => setBoxes(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-14 text-center text-sm font-bold text-slate-900 border-x border-slate-200 py-1.5 focus:outline-none"
                  />
                  <button
                    onClick={() => setBoxes(prev => prev + 1)}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                    justAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#183054] hover:bg-blue-900 text-white'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>¡Agregado al Carrito!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Agregar {boxes} {boxes === 1 ? 'Caja' : 'Cajas'} (${(boxes * product.boxPrice).toLocaleString('es-AR', { minimumFractionDigits: 2 })})</span>
                    </>
                  )}
                </button>
              </div>

              {currentInCartBoxes > 0 && (
                <p className="text-[11px] text-blue-700 font-medium mt-2 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  <span>Actualmente ya tenés {currentInCartBoxes} {currentInCartBoxes === 1 ? 'caja' : 'cajas'} de este artículo en tu carrito.</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
