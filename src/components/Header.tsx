import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingCart, Phone, Settings, Search, LayoutGrid, Table, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    settings,
    totalBoxes,
    totalItemsCount,
    setIsCartOpen,
    setIsAdminOpen,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
  } = useStore();

  return (
    <header className="sticky top-0 z-30 bg-[#183054] text-white shadow-md border-b border-blue-900/50">
      {/* Top micro bar for corporate info */}
      <div className="bg-[#0f1f38] text-xs py-1.5 px-4 border-b border-blue-950/80">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 text-slate-300">
            <span className="font-medium text-amber-300 tracking-wide flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
              Canal de Venta Mayorista Oficial
            </span>
            <span className="hidden sm:inline text-slate-400">•</span>
            <span className="hidden sm:inline text-slate-300">{settings.minBoxesNotice}</span>
            <span className="hidden md:inline text-slate-400">•</span>
            <span className="hidden md:inline text-amber-200 font-medium">Precios por caja s/IVA</span>
          </div>

          <div className="flex items-center gap-4 text-slate-300 text-xs">
            <a
              href={`https://wa.me/${settings.whatsappCountryCode}${settings.whatsappNumber.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-emerald-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp Ventas: <strong>+{settings.whatsappCountryCode} {settings.whatsappNumber}</strong></span>
            </a>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer pl-2 border-l border-slate-700"
              title="Panel de Administración"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.appName}
                className="h-10 sm:h-12 w-auto object-contain rounded bg-white/5 p-1 border border-white/10"
                onError={(e) => {
                  // Fallback if custom logo fails to load
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : null}
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white leading-tight">
                {settings.appName}
              </h1>
              <p className="text-xs text-blue-200 hidden sm:block tracking-wide">
                {settings.companySubtitle}
              </p>
            </div>
          </div>

          {/* Quick Search on larger screens */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por código (ej. AX1, DR-1008) o nombre..."
                className="w-full bg-[#112340] text-sm text-white placeholder-slate-400 rounded-lg pl-9 pr-4 py-2 border border-blue-800/80 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Actions: View toggle & Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Mode Toggle: Grid or Table */}
            <div className="hidden sm:flex items-center bg-[#10223d] p-1 rounded-lg border border-blue-900">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white font-medium shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Vista en Cuadrícula"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden xl:inline">Tarjetas</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-blue-600 text-white font-medium shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Vista en Tabla Mayorista (estilo PDF)"
              >
                <Table className="w-4 h-4" />
                <span className="hidden xl:inline">Lista Mayorista</span>
              </button>
            </div>

            {/* Cart Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer font-medium"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-amber-400 text-slate-950 font-bold text-[11px] rounded-full h-5 w-5 flex items-center justify-center shadow">
                    {totalItemsCount}
                  </span>
                )}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-[11px] uppercase tracking-wider text-emerald-100 font-semibold leading-tight">
                  Carrito
                </div>
                <div className="text-xs font-bold leading-tight">
                  {totalBoxes} {totalBoxes === 1 ? 'caja' : 'cajas'}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile search input */}
        <div className="mt-3 lg:hidden">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por código o descripción..."
              className="w-full bg-[#112340] text-sm text-white placeholder-slate-400 rounded-lg pl-9 pr-4 py-2 border border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
