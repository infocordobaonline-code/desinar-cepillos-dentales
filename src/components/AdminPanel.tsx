import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, AppSettings, Order } from '../types';
import {
  X,
  Settings,
  Package,
  Palette,
  ClipboardList,
  Edit,
  Trash2,
  Plus,
  RotateCcw,
  Upload,
  Check,
  Search,
  MessageSquare,
  Eye,
  Save,
  Image as ImageIcon,
  DollarSign,
  AlertCircle
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    products,
    updateProduct,
    addProduct,
    deleteProduct,
    resetProductsToDefault,
    settings,
    updateSettings,
    resetSettingsToDefault,
    orders,
    updateOrderStatus,
    deleteOrder,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'products' | 'branding' | 'orders'>('products');
  const [productSearch, setProductSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [saveToast, setSaveToast] = useState('');

  // Logo file input ref
  const logoInputRef = useRef<HTMLInputElement>(null);
  const productImageInputRef = useRef<HTMLInputElement>(null);

  if (!isAdminOpen) return null;

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(''), 2500);
  };

  // Filter products for admin
  const filteredProducts = products.filter(
    p =>
      p.code.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          updateSettings({ logoUrl: reader.result });
          showToast('¡Logo actualizado con éxito!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Product Image Upload
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProduct) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setEditingProduct({ ...editingProduct, image: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (isCreatingNew) {
      addProduct(editingProduct);
      showToast('¡Producto agregado al catálogo!');
    } else {
      updateProduct(editingProduct);
      showToast('¡Producto actualizado con éxito!');
    }
    setEditingProduct(null);
    setIsCreatingNew(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div
        className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#183054] text-white p-4 sm:p-5 flex items-center justify-between border-b border-blue-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Settings className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Panel de Administración</h2>
              <p className="text-xs text-blue-200">
                Gestión de catálogo, precios, imágenes, logo y diseño general
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminOpen(false)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 flex gap-2 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'products'
                ? 'border-[#183054] text-[#183054] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Productos y Precios ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('branding')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'branding'
                ? 'border-[#183054] text-[#183054] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Diseño, Logo y Textos</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'orders'
                ? 'border-[#183054] text-[#183054] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Historial de Pedidos ({orders.length})</span>
          </button>
        </div>

        {/* Toast alert */}
        {saveToast && (
          <div className="bg-emerald-600 text-white text-xs font-bold py-2 px-4 text-center flex items-center justify-center gap-1.5 animate-fade-in shrink-0">
            <Check className="w-4 h-4" />
            <span>{saveToast}</span>
          </div>
        )}

        {/* Main Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
          {/* TAB 1: PRODUCTS & PRICES */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              {/* Product Controls Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Buscar producto por código o nombre..."
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsCreatingNew(true);
                      setEditingProduct({
                        id: `PROD-${Date.now().toString().slice(-4)}`,
                        code: '',
                        name: '',
                        unitsPerBox: 48,
                        unitPrice: 500,
                        boxPrice: 24000,
                        suggestedPrice: 1200,
                        image: '/products/AX1.png',
                        category: 'Adulto',
                        line: 'Línea Clásica',
                        isActive: true,
                      });
                    }}
                    className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nuevo Producto</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm('¿Seguro que deseás restaurar el catálogo con todos los precios e imágenes originales del PDF?')) {
                        resetProductsToDefault();
                        showToast('Catálogo restaurado a los valores del PDF original.');
                      }
                    }}
                    className="py-2 px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                    title="Restaurar valores del PDF"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Restaurar PDF</span>
                  </button>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200">
                        <th className="py-2.5 px-3">Foto</th>
                        <th className="py-2.5 px-3">Código</th>
                        <th className="py-2.5 px-3">Nombre</th>
                        <th className="py-2.5 px-2 text-center">Unid/cj</th>
                        <th className="py-2.5 px-3 text-right">Unitario s/IVA</th>
                        <th className="py-2.5 px-3 text-right">Precio Caja s/IVA</th>
                        <th className="py-2.5 px-3 text-right">Sugerido c/IVA</th>
                        <th className="py-2.5 px-3 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2 px-3">
                            <div className="w-10 h-10 bg-slate-50 border border-slate-200 rounded p-0.5 flex items-center justify-center">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                          </td>
                          <td className="py-2 px-3 font-mono font-bold text-slate-900">
                            {p.code}
                          </td>
                          <td className="py-2 px-3 font-medium text-slate-800 max-w-xs truncate">
                            {p.name}
                          </td>
                          <td className="py-2 px-2 text-center text-slate-600 font-semibold">
                            {p.unitsPerBox}
                          </td>
                          <td className="py-2 px-3 text-right text-slate-700">
                            ${p.unitPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-[#183054]">
                            ${p.boxPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-2 px-3 text-right text-emerald-700 font-semibold">
                            ${p.suggestedPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => {
                                  setIsCreatingNew(false);
                                  setEditingProduct({ ...p });
                                }}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                title="Editar producto, imagen o precios"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`¿Eliminar producto ${p.code} (${p.name})?`)) {
                                    deleteProduct(p.id);
                                    showToast(`Producto ${p.code} eliminado.`);
                                  }
                                }}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                title="Eliminar producto"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BRANDING, LOGO, AND DESIGN */}
          {activeTab === 'branding' && (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Logo Section */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  <span>Logo de la Aplicación</span>
                </h3>

                <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-48 h-20 bg-[#183054] rounded-lg p-2 flex items-center justify-center shadow-inner">
                    <img
                      src={settings.logoUrl}
                      alt="Logo actual"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="space-y-2 flex-1">
                    <p className="text-xs text-slate-600">
                      Podés subir tu propio logo corporativo o cambiarlo cuando desees.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <input
                        type="file"
                        ref={logoInputRef}
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <button
                        onClick={() => logoInputRef.current?.click()}
                        className="py-1.5 px-3 bg-[#183054] hover:bg-blue-900 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Subir nuevo logo</span>
                      </button>

                      <button
                        onClick={() => {
                          updateSettings({ logoUrl: '/catalog/desinar_logo.png' });
                          showToast('Logo DESINAR restaurado.');
                        }}
                        className="py-1.5 px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Restaurar logo DESINAR</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* General App Info & WhatsApp Destination */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Settings className="w-4 h-4 text-blue-600" />
                  <span>Información General y Contacto de Ventas</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Nombre de la Aplicación
                    </label>
                    <input
                      type="text"
                      value={settings.appName}
                      onChange={(e) => updateSettings({ appName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Subtítulo Comercial
                    </label>
                    <input
                      type="text"
                      value={settings.companySubtitle}
                      onChange={(e) => updateSettings({ companySubtitle: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Número de WhatsApp Receptor (sin 0 ni 15)
                    </label>
                    <input
                      type="text"
                      value={settings.whatsappNumber}
                      onChange={(e) => updateSettings({ whatsappNumber: e.target.value })}
                      placeholder="3517708059"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <span className="text-[10px] text-slate-500">
                      Destino de los pedidos: +{settings.whatsappCountryCode} {settings.whatsappNumber}
                    </span>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Objetivo de Cajas Mínimas
                    </label>
                    <input
                      type="number"
                      value={settings.minBoxesGoal}
                      onChange={(e) => updateSettings({ minBoxesGoal: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Exact Pre-checkout Notice Text */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Cartel de Aviso Previo al Pedido</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Este mensaje se le muestra obligatoriamente al cliente en el cartel antes de procesar el pedido.
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Título del Cartel de Aviso
                    </label>
                    <input
                      type="text"
                      value={settings.preCheckoutNoticeTitle}
                      onChange={(e) => updateSettings({ preCheckoutNoticeTitle: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Mensaje de Aviso
                    </label>
                    <textarea
                      rows={3}
                      value={settings.preCheckoutNoticeBody}
                      onChange={(e) => updateSettings({ preCheckoutNoticeBody: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Reset to defaults */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    if (window.confirm('¿Deseás reiniciar la configuración de marca a los valores por defecto?')) {
                      resetSettingsToDefault();
                      showToast('Configuración reiniciada.');
                    }
                  }}
                  className="py-2 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  Reiniciar Configuración
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS HISTORY */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Total de pedidos registrados: <strong>{orders.length}</strong></span>
              </div>

              {orders.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500">
                  <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-700">Aún no hay pedidos registrados</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Cuando los clientes completen sus pedidos se guardarán aquí automáticamente.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#183054] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {ord.id}
                          </span>
                          <span className="text-xs text-slate-500">{ord.date}</span>
                        </div>

                        {/* Order status selector */}
                        <div className="flex items-center gap-2">
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as Order['status'])}
                            className="text-xs font-semibold py-1 px-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-800 focus:outline-none"
                          >
                            <option value="pendiente">🟡 Pendiente</option>
                            <option value="confirmado">🔵 Confirmado</option>
                            <option value="en_preparacion">🟣 En preparación</option>
                            <option value="entregado">🟢 Entregado</option>
                            <option value="cancelado">🔴 Cancelado</option>
                          </select>

                          <button
                            onClick={() => {
                              if (window.confirm(`¿Eliminar orden ${ord.id}?`)) {
                                deleteOrder(ord.id);
                              }
                            }}
                            className="text-slate-400 hover:text-red-500 p-1"
                            title="Eliminar orden"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Customer info */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-slate-500 block">Cliente:</span>
                          <strong className="text-slate-900">{ord.customerName}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block">WhatsApp:</span>
                          <a
                            href={`https://wa.me/${ord.customerWhatsApp.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{ord.customerWhatsApp}</span>
                          </a>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Volumen y Monto:</span>
                          <strong className="text-slate-900">
                            {ord.totalBoxes} cajas (${ord.totalAmount.toLocaleString('es-AR', { minimumFractionDigits: 2 })})
                          </strong>
                        </div>
                      </div>

                      {ord.notes && (
                        <div className="text-xs bg-slate-50 p-2 rounded border border-slate-200 text-slate-700">
                          <span className="font-semibold text-slate-800">Nota:</span> {ord.notes}
                        </div>
                      )}

                      {/* Items brief */}
                      <div className="text-[11px] text-slate-600 bg-slate-50/50 p-2 rounded divide-y divide-slate-100">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="py-1 flex justify-between">
                            <span>
                              [{it.productCode}] {it.productName} ({it.boxes} cj / {it.units} u)
                            </span>
                            <span className="font-semibold">
                              ${it.subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Product Edit / Create Modal Sub-Dialog */}
        {editingProduct && (
          <div className="fixed inset-0 z-60 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
              <div className="bg-[#183054] text-white p-4 flex items-center justify-between">
                <h3 className="text-sm font-bold">
                  {isCreatingNew ? 'Agregar Nuevo Producto' : `Editar Producto ${editingProduct.code}`}
                </h3>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="p-1 rounded-lg text-slate-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="p-5 space-y-4 text-xs">
                {/* Image editing preview */}
                <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="w-20 h-20 bg-white rounded-lg border border-slate-200 p-1 flex items-center justify-center shrink-0">
                    <img
                      src={editingProduct.image}
                      alt={editingProduct.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <span className="font-semibold text-slate-700 block">Imagen del producto:</span>
                    <input
                      type="file"
                      ref={productImageInputRef}
                      accept="image/*"
                      onChange={handleProductImageUpload}
                      className="hidden"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => productImageInputRef.current?.click()}
                        className="py-1.5 px-2.5 bg-[#183054] text-white rounded font-bold hover:bg-blue-900 transition-colors cursor-pointer"
                      >
                        Subir Imagen
                      </button>
                    </div>
                    <input
                      type="text"
                      value={editingProduct.image}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      placeholder="o ingresá URL de la imagen"
                      className="w-full bg-white border border-slate-300 rounded p-1 text-[11px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Código</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.code}
                      onChange={(e) => setEditingProduct({ ...editingProduct, code: e.target.value })}
                      placeholder="Ej. AX1, DR-1008"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Unidades por Caja</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.unitsPerBox}
                      onChange={(e) => {
                        const units = parseInt(e.target.value) || 1;
                        const boxPrice = units * editingProduct.unitPrice;
                        setEditingProduct({ ...editingProduct, unitsPerBox: units, boxPrice });
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nombre / Descripción</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 font-medium"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Precio Unit. s/IVA</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={editingProduct.unitPrice}
                      onChange={(e) => {
                        const unitPrice = parseFloat(e.target.value) || 0;
                        const boxPrice = unitPrice * editingProduct.unitsPerBox;
                        setEditingProduct({ ...editingProduct, unitPrice, boxPrice });
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Precio Caja s/IVA</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={editingProduct.boxPrice}
                      onChange={(e) => {
                        const boxPrice = parseFloat(e.target.value) || 0;
                        const unitPrice = editingProduct.unitsPerBox > 0 ? boxPrice / editingProduct.unitsPerBox : 0;
                        setEditingProduct({ ...editingProduct, boxPrice, unitPrice });
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-[#183054] font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Sugerido c/IVA</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={editingProduct.suggestedPrice}
                      onChange={(e) => setEditingProduct({ ...editingProduct, suggestedPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-emerald-700 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Categoría</label>
                    <input
                      type="text"
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      placeholder="Adulto, Infantil, Sustentable, etc."
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Línea de Producto</label>
                    <input
                      type="text"
                      value={editingProduct.line}
                      onChange={(e) => setEditingProduct({ ...editingProduct, line: e.target.value })}
                      placeholder="Axis, 2Lifex, Disney, SMILO, etc."
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="py-2 px-4 rounded-lg bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-5 rounded-lg bg-[#183054] text-white font-bold hover:bg-blue-900 cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Producto</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
