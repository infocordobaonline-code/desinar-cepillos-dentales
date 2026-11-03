import React, { useState } from 'react';
import { CheckCircle2, MessageSquare, Copy, Check, ExternalLink, X } from 'lucide-react';

interface OrderSuccessModalProps {
  orderData: {
    whatsappUrl: string;
    messageText: string;
    orderId: string;
  } | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ orderData, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!orderData) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(orderData.messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative my-6">
        {/* Header */}
        <div className="bg-emerald-600 text-white p-5 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-100 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 text-white">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold">¡Pedido Generado con Éxito!</h3>
          <p className="text-xs text-emerald-100 mt-1">
            Orden N° <strong>{orderData.orderId}</strong>
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 text-center leading-relaxed">
            Hemos preparado el detalle de tu pedido para el equipo de <strong>Grupo Deninar</strong>. Si WhatsApp no se abrió automáticamente, podés hacer clic abajo o copiar el mensaje.
          </p>

          {/* Action buttons */}
          <div className="space-y-2">
            <a
              href={orderData.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Abrir WhatsApp Ahora</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={handleCopy}
              className="w-full bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-xs border border-slate-300 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>¡Mensaje copiado al portapapeles!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar texto del pedido</span>
                </>
              )}
            </button>
          </div>

          {/* Collapsible preview of the order message */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
              Vista previa del mensaje enviado:
            </span>
            <pre className="text-[11px] font-mono text-slate-700 whitespace-pre-wrap max-h-36 overflow-y-auto leading-tight bg-white p-2 rounded border border-slate-200">
              {orderData.messageText}
            </pre>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-bold text-[#183054] hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
          >
            Volver al Catálogo
          </button>
        </div>
      </div>
    </div>
  );
};
