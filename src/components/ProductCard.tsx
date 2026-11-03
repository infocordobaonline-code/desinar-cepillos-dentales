import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Plus, Minus, Check, Eye, Package, TrendingUp } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { cart, addToCart, updateQuantity, setSelectedProductForDetail, settings } = useStore();
  const [justAdded, setJustAdded] = useState(false);

  const existingInCart = cart.find(c => c.productId === product.id);
  const currentBoxes = existingInCart ? existingInCart.boxes : 0;
  const [localBoxes, setLocalBoxes] = useState(1);

  const handleAddOne = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product.id, localBoxes);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentBoxes > 0) {
      updateQuantity(product.id, currentBoxes + 1);
    } else {
      setLocalBoxes(prev => prev + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentBoxes > 0) {
      updateQuantity(product.id, currentBoxes - 1);
    } else {
      setLocalBoxes(prev => Math.max(1, prev - 1));
    }
  };

  // Profit margin calculation for reseller
  // Unit without IVA vs suggested price with IVA
  const marginPercent = product.unitPrice > 0
    ? Math.round(((product.suggestedPrice - product.unitPrice) / product.suggestedPrice) * 100)
    : 0;

  return (
    <div
      onClick={() => setSelectedProductForDetail(product)}
      className="group relative bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Product Image Area */}
      <div className="relative bg-slate-50 p-4 flex items-center justify-center min-h-[190px] border-b border-slate-100 overflow-hidden">
        {/* Code Badge */}
        <div className="absolute top-3 left-3 z-10 bg-[#183054] text-white font-mono font-bold text-xs px-2.5 py-1 rounded shadow-sm">
          {product.code}
        </div>

        {/* Units per box badge */}
        <div className="absolute top-3 right-3 z-10 bg-slate-200/90 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 backdrop-blur-xs">
          <Package className="w-3 h-3 text-slate-500" />
          <span>{product.unitsPerBox} u / caja</span>
        </div>

        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="max-h-36 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            // Fallback placeholder
            (e.target as HTMLElement).setAttribute('src', '/catalog/desinar_logo.png');
          }}
        />

        {/* Quick View Hover Indicator */}
        <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <div className="bg-white/95 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 backdrop-blur-xs">
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>Ver detalle</span>
          </div>
        </div>
      </div>

      {/* Product Details Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Line sub-label */}
          <div className="text-[11px] font-medium text-blue-600 uppercase tracking-wider mb-1">
            {product.category} {product.line ? `• ${product.line}` : ''}
          </div>

          {/* Product Name */}
          <h3 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 min-h-[2.5rem] mb-3">
            {product.name}
          </h3>

          {/* Pricing Grid */}
          <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200/80 mb-3 space-y-1.5">
            {/* Box Price (Primary for wholesalers) */}
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-600 font-medium">
                Precio por Caja <strong className="text-slate-900 font-bold">s/IVA</strong>:
              </span>
              <span className="text-base font-extrabold text-[#183054]">
                ${product.boxPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Unit Price */}
            <div className="flex items-baseline justify-between text-xs text-slate-600 pt-1 border-t border-slate-200/60">
              <span className="text-slate-500">Unitario s/IVA:</span>
              <span className="font-semibold text-slate-700">
                ${product.unitPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Suggested Retail Price */}
            {settings.showSuggestedPrice && (
              <div className="flex items-baseline justify-between text-xs text-slate-600 pt-1 border-t border-slate-200/60">
                <span className="text-slate-500 flex items-center gap-1">
                  <span>Sugerido c/IVA:</span>
                </span>
                <div className="text-right">
                  <span className="font-bold text-emerald-700">
                    ${product.suggestedPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </span>
                  {marginPercent > 0 && (
                    <span className="ml-1 text-[10px] text-emerald-600 font-bold bg-emerald-100 px-1 rounded">
                      +{marginPercent}%
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quantity Controls & Add to Cart */}
        <div className="pt-2 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
          {currentBoxes > 0 ? (
            /* Item is already in cart: show active stepper */
            <div className="flex items-center justify-between gap-2 bg-blue-50 border border-blue-200 rounded-lg p-1">
              <button
                onClick={handleDecrement}
                className="w-8 h-8 rounded bg-white hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center border border-slate-200 shadow-xs active:scale-95 transition-transform"
                title="Quitar 1 caja"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <div className="text-center">
                <div className="text-xs font-bold text-[#183054] leading-tight">
                  {currentBoxes} {currentBoxes === 1 ? 'caja' : 'cajas'}
                </div>
                <div className="text-[10px] text-slate-500">
                  {currentBoxes * product.unitsPerBox} unid.
                </div>
              </div>

              <button
                onClick={handleIncrement}
                className="w-8 h-8 rounded bg-[#183054] hover:bg-blue-900 text-white font-bold flex items-center justify-center shadow-xs active:scale-95 transition-transform"
                title="Sumar 1 caja"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Item is not yet in cart: stepper + Add button */
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden shrink-0">
                <button
                  onClick={handleDecrement}
                  className="px-2 py-2 hover:bg-slate-200 text-slate-600 transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center text-xs font-bold text-slate-800">
                  {localBoxes}
                </span>
                <button
                  onClick={handleIncrement}
                  className="px-2 py-2 hover:bg-slate-200 text-slate-600 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <button
                onClick={handleAddOne}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer ${
                  justAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#183054] hover:bg-blue-900 text-white'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>¡Agregado!</span>
                  </>
                ) : (
                  <>
                    <Package className="w-3.5 h-3.5" />
                    <span>Agregar ({localBoxes} cj)</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
