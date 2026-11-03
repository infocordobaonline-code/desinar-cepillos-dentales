import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { AlertCircle, CheckCircle, MessageSquare, ArrowLeft, Send, ShieldCheck, Clock, CreditCard, Truck } from 'lucide-react';

interface PreCheckoutNoticeModalProps {
  onSuccessOrder: (result: { whatsappUrl: string; messageText: string; orderId: string }) => void;
}

export const PreCheckoutNoticeModal: React.FC<PreCheckoutNoticeModalProps> = ({ onSuccessOrder }) => {
  const {
    isNoticeModalOpen,
    setIsNoticeModalOpen,
    pendingCustomer,
    confirmOrderAndSendWhatsApp,
    totalBoxes,
    totalAmount,
    settings,
  } = useStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isNoticeModalOpen || !pendingCustomer) return null;

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const result = confirmOrderAndSendWhatsApp();
      setIsSubmitting(false);
      setIsNoticeModalOpen(false);

      if (result.success) {
        // Open WhatsApp automatically
        window.open(result.whatsappUrl, '_blank');
        onSuccessOrder({
          whatsappUrl: result.whatsappUrl,
          messageText: result.messageText,
          orderId: result.order.id,
        });
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Amber / Brand Notice Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-slate-950 p-5 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-amber-700 shadow-sm shrink-0">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-950/80 bg-white/40 px-2 py-0.5 rounded">
              Paso Final de Confirmación
            </span>
            <h3 className="text-lg font-black text-slate-950 leading-tight mt-1">
              {settings.preCheckoutNoticeTitle}
            </h3>
          </div>
        </div>

        {/* Modal Body with the exact requested notice */}
        <div className="p-6 space-y-5">
          {/* Main highlighted quote notice */}
          <div className="bg-amber-50/90 border-2 border-amber-300/80 rounded-xl p-4 text-slate-900">
            <p className="text-sm sm:text-base font-bold leading-snug text-slate-900">
              "{settings.preCheckoutNoticeBody}"
            </p>
          </div>

          {/* Explanation steps for customer confidence */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              ¿Cómo continúa tu compra?
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">1. Stock disponible</span>
                  <span className="text-[11px] text-slate-500">Chequeamos el depósito para tus {totalBoxes} cajas.</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2">
                <CreditCard className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">2. Precio y Pago</span>
                  <span className="text-[11px] text-slate-500">Confirmamos lista, IVA y medios de pago.</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2">
                <Truck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">3. Despacho</span>
                  <span className="text-[11px] text-slate-500">Coordinamos transporte o retiro a convenir.</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">4. Atención Directa</span>
                  <span className="text-[11px] text-slate-500">Respuesta inmediata al +{settings.whatsappCountryCode} {settings.whatsappNumber}.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Order mini-summary */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-600">
              <span>Cliente:</span>
              <strong className="text-slate-900">{pendingCustomer.name}</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>WhatsApp de contacto:</span>
              <strong className="text-slate-900">{pendingCustomer.whatsapp}</strong>
            </div>
            <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200">
              <span>Volumen del pedido:</span>
              <strong className="text-slate-900">{totalBoxes} cajas</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Subtotal estimado:</span>
              <strong className="text-emerald-700 text-sm">
                ${totalAmount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </strong>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 space-y-2">
            <button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Procesando...' : 'Entendido, Enviar Pedido a WhatsApp'}</span>
            </button>

            <button
              onClick={() => setIsNoticeModalOpen(false)}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a revisar mi carrito</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
