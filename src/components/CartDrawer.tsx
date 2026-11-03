import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, Plus, Minus, ArrowRight, Package, User, Phone, FileText, AlertCircle, ShoppingBag } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cartDetailedItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalBoxes,
    totalUnits,
    totalAmount,
    initiateCheckout,
    settings,
  } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isCartOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg('Por favor ingresá tu Nombre y Apellido.');
      return;
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 7) {
      setErrorMsg('Por favor ingresá un número de WhatsApp válido.');
      return;
    }

    // Call checkout initiation -> triggers the mandatory PreCheckoutNoticeModal
    initiateCheckout({
      name: customerName,
      whatsapp: customerPhone,
      notes: customerNotes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-white shadow-2xl flex flex-col">
          {/* Top Bar */}
          <div className="p-4 bg-[#183054] text-white flex items-center justify-between border-b border-blue-900">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-amber-300" />
              <div>
                <h2 className="text-base font-bold leading-tight">Tu Carrito de Pedido</h2>
                <p className="text-xs text-blue-200">
                  {totalBoxes} {totalBoxes === 1 ? 'caja seleccionada' : 'cajas seleccionadas'} ({totalUnits} unidades)
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          {cartDetailedItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="text-base font-semibold text-slate-800 mb-1">
                El carrito está vacío
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mb-6">
                Seleccioná los cepillos dentales y cantidades desde el catálogo interactivo.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="py-2 px-5 bg-[#183054] text-white text-xs font-bold rounded-lg hover:bg-blue-900 transition-colors cursor-pointer"
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {/* Product items list */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
                  <span>Productos en tu orden ({cartDetailedItems.length})</span>
                  <button
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-700 text-xs font-medium cursor-pointer"
                  >
                    Vaciar carrito
                  </button>
                </div>

                {cartDetailedItems.map(({ item, product, subtotal, units }) => (
                  <div
                    key={item.productId}
                    className="flex gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80 items-center"
                  >
                    {/* Thumbnail */}
                    <div className="w-14 h-14 bg-white rounded-lg border border-slate-200 p-1 flex items-center justify-center shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[11px] font-bold text-slate-900 bg-slate-200 px-1.5 rounded">
                          {product.code}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {product.unitsPerBox} u/caja
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-800 truncate mt-0.5">
                        {product.name}
                      </h4>
                      <div className="text-xs text-slate-600 mt-1">
                        ${product.boxPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })} / caja <span className="text-[10px] text-slate-500 font-semibold">s/IVA</span>
                      </div>
                    </div>

                    {/* Stepper & Total */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <div className="flex items-center border border-slate-300 rounded-md bg-white shadow-2xs">
                        <button
                          onClick={() => updateQuantity(item.productId, item.boxes - 1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-100 text-xs font-bold"
                          title="Restar caja"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-slate-900">
                          {item.boxes}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.boxes + 1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-100 text-xs font-bold"
                          title="Sumar caja"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-xs font-bold text-[#183054]">
                        ${subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-0.5"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals Summary */}
              <div className="p-4 bg-slate-50/80 space-y-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Total Cajas:</span>
                  <span className="font-bold text-slate-900">{totalBoxes} cajas</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Total Cepillos / Unidades:</span>
                  <span className="font-semibold text-slate-800">{totalUnits} unidades</span>
                </div>
                <div className="flex justify-between text-sm text-slate-900 font-bold pt-2 border-t border-slate-200">
                  <span>Subtotal Estimado (sin IVA):</span>
                  <span className="text-base text-emerald-700 font-extrabold">
                    ${totalAmount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {totalBoxes < settings.minBoxesGoal && (
                  <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800 flex items-start gap-1.5 mt-2">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      Nota: El pedido mínimo sugerido es de <strong>{settings.minBoxesGoal} {settings.minBoxesGoal === 1 ? 'caja' : 'cajas'}</strong>.
                    </span>
                  </div>
                )}
              </div>

              {/* Customer Data Form (Name and WhatsApp ONLY) */}
              <form onSubmit={handleSubmit} className="p-4 bg-white space-y-3">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>Tus Datos de Contacto</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Solo necesitamos tu nombre y WhatsApp para procesar tu pedido.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Nombre y Apellido */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nombre y Apellido <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ej. Martín González (Distribuidora MG)"
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Número de WhatsApp */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Número de WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Ej. 351 1234567"
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Te responderemos a este número para confirmar tu pedido.
                  </p>
                </div>

                {/* Optional note */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Observaciones / Localidad <span className="text-slate-400 font-normal">(Opcional)</span>
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <textarea
                      rows={2}
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      placeholder="Ej. Córdoba Capital, transporte preferido o horario de entrega..."
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#183054] hover:bg-blue-900 active:bg-blue-950 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                  >
                    <span>Procesar Pedido</span>
                    <ArrowRight className="w-4 h-4 text-amber-300" />
                  </button>
                  <p className="text-[11px] text-center text-slate-500 mt-2">
                    Al presionar verás el aviso de confirmación y se derivará automáticamente a WhatsApp.
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
