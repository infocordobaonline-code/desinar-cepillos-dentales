import React from 'react';
import { useStore } from '../context/StoreContext';
import { Phone, ShieldCheck, Settings, ArrowUp, MessageSquare, Truck, PackageCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, setIsAdminOpen } = useStore();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-12 text-xs">
      {/* Upper banner */}
      <div className="bg-[#10223d] border-b border-blue-900/50 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Venta Directa de Fábrica</h4>
              <p className="text-slate-400 text-xs">Atención a grandes cadenas, mayoristas y farmacias.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Derivación Automática a WhatsApp</h4>
              <p className="text-slate-400 text-xs">Confirmación inmediata al +{settings.whatsappCountryCode} {settings.whatsappNumber}.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Logística y Despacho</h4>
              <p className="text-slate-400 text-xs">Envíos coordinados a todo el territorio nacional.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-center md:text-left">
            {settings.logoUrl && (
              <img
                src={settings.logoUrl}
                alt={settings.appName}
                className="h-9 w-auto object-contain rounded bg-white/5 p-1 border border-white/10"
              />
            )}
            <div>
              <h3 className="text-white font-bold text-sm">{settings.appName}</h3>
              <p className="text-slate-400 text-xs">{settings.companySubtitle}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <a
              href={`https://wa.me/${settings.whatsappCountryCode}${settings.whatsappNumber.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp: +{settings.whatsappCountryCode} {settings.whatsappNumber}</span>
            </a>

            <button
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Panel de Administración</span>
            </button>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Subir</span>
            </button>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-800 text-center text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} {settings.appName}. Todos los derechos reservados. Precios sujetos a confirmación comercial de stock y forma de pago vía WhatsApp.</p>
        </div>
      </div>
    </footer>
  );
};
