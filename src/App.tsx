import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Banner } from './components/Banner';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { WholesaleTable } from './components/WholesaleTable';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { PreCheckoutNoticeModal } from './components/PreCheckoutNoticeModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { ShoppingCart, Search, LayoutGrid, Table, ArrowRight, Package } from 'lucide-react';

const CatalogContent: React.FC = () => {
  const {
    products,
    searchQuery,
    selectedCategory,
    viewMode,
    setViewMode,
    totalBoxes,
    totalAmount,
    setIsCartOpen,
  } = useStore();

  const [completedOrderData, setCompletedOrderData] = useState<{
    whatsappUrl: string;
    messageText: string;
    orderId: string;
  } | null>(null);

  // Filter products by category and search
  const filteredProducts = products.filter((p) => {
    if (!p.isActive) return false;

    // Category filter
    let matchCat = true;
    if (selectedCategory !== 'Todos') {
      if (selectedCategory === 'Licencias') {
        matchCat =
          p.category.includes('Licencias') ||
          p.line.includes('Disney') ||
          p.line.includes('Pixar');
      } else {
        matchCat = p.category.toLowerCase().includes(selectedCategory.toLowerCase());
      }
    }

    // Search query
    let matchSearch = true;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      matchSearch =
        p.code.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.line.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
    }

    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <Header />

      {/* Hero / Value Banner */}
      <Banner />

      {/* Categories interactive tabs */}
      <CategoryFilter />

      {/* Main Catalog Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {/* Sub-header / Status & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Catálogo de Cepillos Dentales
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Mostrando {filteredProducts.length} de {products.length} productos disponibles • <span className="font-semibold text-slate-700">Precios por caja s/IVA</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle for mobile/tablet */}
            <div className="flex sm:hidden items-center bg-white p-1 rounded-lg border border-slate-300 shadow-2xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded text-xs ${
                  viewMode === 'grid' ? 'bg-[#183054] text-white' : 'text-slate-600'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded text-xs ${
                  viewMode === 'table' ? 'bg-[#183054] text-white' : 'text-slate-600'
                }`}
              >
                <Table className="w-4 h-4" />
              </button>
            </div>

            {totalBoxes > 0 && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="hidden sm:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Ver Carrito ({totalBoxes} cj - ${totalAmount.toLocaleString('es-AR', { minimumFractionDigits: 0 })})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Catalog Content (Grid or Wholesale Table) */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 max-w-md mx-auto my-8">
            <Package className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-800">No se encontraron productos</h3>
            <p className="text-xs text-slate-500 mt-1">
              Probá ajustando la búsqueda o seleccionando otra categoría.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <WholesaleTable products={filteredProducts} />
        )}
      </main>

      {/* Floating Bottom Bar on Mobile when Cart has items */}
      {totalBoxes > 0 && (
        <div className="sm:hidden fixed bottom-4 inset-x-4 z-40">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-[#183054] text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between border-2 border-emerald-400 cursor-pointer animate-fade-in"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {totalBoxes}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold leading-tight">
                  {totalBoxes} {totalBoxes === 1 ? 'caja' : 'cajas'} en carrito
                </div>
                <div className="text-[11px] text-emerald-300 font-extrabold leading-tight">
                  Total s/IVA: ${totalAmount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs">
              <span>Procesar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      )}

      {/* Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <PreCheckoutNoticeModal onSuccessOrder={setCompletedOrderData} />
      <OrderSuccessModal
        orderData={completedOrderData}
        onClose={() => setCompletedOrderData(null)}
      />
      <AdminPanel />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <CatalogContent />
    </StoreProvider>
  );
}
