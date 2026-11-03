import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Product, CartItem, Order, AppSettings, OrderItemSummary } from '../types';
import { INITIAL_PRODUCTS, DEFAULT_SETTINGS } from '../data/initialProducts';

interface StoreContextType {
  products: Product[];
  settings: AppSettings;
  cart: CartItem[];
  orders: Order[];
  viewMode: 'grid' | 'table';
  setViewMode: (mode: 'grid' | 'table') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedLine: string;
  setSelectedLine: (line: string) => void;
  
  // UI states
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isNoticeModalOpen: boolean;
  setIsNoticeModalOpen: (open: boolean) => void;
  selectedProductForDetail: Product | null;
  setSelectedProductForDetail: (p: Product | null) => void;

  // Cart operations
  addToCart: (productId: string, boxes?: number) => void;
  updateQuantity: (productId: string, boxes: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  
  // Computed cart metrics
  cartDetailedItems: { item: CartItem; product: Product; subtotal: number; units: number }[];
  totalBoxes: number;
  totalUnits: number;
  totalAmount: number;
  totalItemsCount: number;

  // Checkout and WhatsApp
  pendingCustomer: { name: string; whatsapp: string; notes?: string } | null;
  setPendingCustomer: (data: { name: string; whatsapp: string; notes?: string } | null) => void;
  initiateCheckout: (data: { name: string; whatsapp: string; notes?: string }) => void;
  confirmOrderAndSendWhatsApp: () => { success: boolean; whatsappUrl: string; messageText: string; order: Order };

  // Admin operations
  updateProduct: (product: Product) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (productId: string) => void;
  resetProductsToDefault: () => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetSettingsToDefault: () => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  deleteOrder: (orderId: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Products state
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('deninar_products_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading products from localStorage', e);
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('deninar_products_v2', JSON.stringify(products));
    } catch (e) {
      console.error('Error saving products to localStorage', e);
    }
  }, [products]);

  // 2. Settings state
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('deninar_settings_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Automatically migrate previous default of 35 to 1
        if (parsed.minBoxesGoal === 35) {
          parsed.minBoxesGoal = 1;
        }
        if (parsed.minBoxesNotice === 'Pedido mínimo 35 cajas') {
          parsed.minBoxesNotice = 'Pedido mínimo 1 caja';
        }
        if (parsed.bannerNotice && parsed.bannerNotice.includes('35 cajas')) {
          parsed.bannerNotice = parsed.bannerNotice.replace('35 cajas', '1 caja');
        }
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (e) {
      console.error('Error loading settings from localStorage', e);
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('deninar_settings_v2', JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings to localStorage', e);
    }
  }, [settings]);

  // 3. Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('deninar_cart_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading cart', e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('deninar_cart_v2', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart', e);
    }
  }, [cart]);

  // 4. Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('deninar_orders_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading orders', e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('deninar_orders_v2', JSON.stringify(orders));
    } catch (e) {
      console.error('Error saving orders', e);
    }
  }, [orders]);

  // UI state
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedLine, setSelectedLine] = useState('Todas');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [pendingCustomer, setPendingCustomer] = useState<{ name: string; whatsapp: string; notes?: string } | null>(null);

  // Cart operations
  const addToCart = (productId: string, boxes: number = 1) => {
    if (boxes <= 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item =>
          item.productId === productId ? { ...item, boxes: item.boxes + boxes } : item
        );
      }
      return [...prev, { productId, boxes }];
    });
  };

  const updateQuantity = (productId: string, boxes: number) => {
    if (boxes <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.productId === productId ? { ...item, boxes } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Detailed cart calculation
  const cartDetailedItems = useMemo(() => {
    return cart
      .map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return null;
        const boxes = item.boxes;
        const units = boxes * product.unitsPerBox;
        const subtotal = boxes * product.boxPrice;
        return { item, product, subtotal, units };
      })
      .filter((entry): entry is { item: CartItem; product: Product; subtotal: number; units: number } => entry !== null);
  }, [cart, products]);

  const totalBoxes = useMemo(() => {
    return cartDetailedItems.reduce((acc, curr) => acc + curr.item.boxes, 0);
  }, [cartDetailedItems]);

  const totalUnits = useMemo(() => {
    return cartDetailedItems.reduce((acc, curr) => acc + curr.units, 0);
  }, [cartDetailedItems]);

  const totalAmount = useMemo(() => {
    return cartDetailedItems.reduce((acc, curr) => acc + curr.subtotal, 0);
  }, [cartDetailedItems]);

  const totalItemsCount = cartDetailedItems.length;

  // Checkout flow
  const initiateCheckout = (data: { name: string; whatsapp: string; notes?: string }) => {
    setPendingCustomer(data);
    setIsNoticeModalOpen(true);
  };

  const confirmOrderAndSendWhatsApp = () => {
    if (!pendingCustomer || cartDetailedItems.length === 0) {
      return { success: false, whatsappUrl: '', messageText: '', order: null as unknown as Order };
    }

    const orderSummaries: OrderItemSummary[] = cartDetailedItems.map(({ item, product, subtotal, units }) => ({
      productCode: product.code,
      productName: product.name,
      boxes: item.boxes,
      units,
      unitPrice: product.unitPrice,
      boxPrice: product.boxPrice,
      subtotal,
    }));

    const newOrder: Order = {
      id: `DEN-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      customerName: pendingCustomer.name.trim(),
      customerWhatsApp: pendingCustomer.whatsapp.trim(),
      notes: pendingCustomer.notes?.trim() || '',
      items: orderSummaries,
      totalBoxes,
      totalUnits,
      totalAmount,
      status: 'pendiente',
    };

    // Save order
    setOrders(prev => [newOrder, ...prev]);

    // Format WhatsApp message
    const formattedDate = newOrder.date;
    const itemsList = orderSummaries
      .map(
        (it, idx) =>
          `${idx + 1}. *[${it.productCode}]* ${it.productName}\n` +
          `   📦 ${it.boxes} ${it.boxes === 1 ? 'caja' : 'cajas'} (${it.units} unid.) x $${it.boxPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })} s/IVA = *$${it.subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })} s/IVA*`
      )
      .join('\n\n');

    const messageLines = [
      `🦷 *PEDIDO ${newOrder.id} - ${settings.appName.toUpperCase()}*`,
      `📅 Fecha: ${formattedDate}`,
      `-----------------------------------------`,
      `👤 *Cliente:* ${newOrder.customerName}`,
      `📱 *WhatsApp:* ${newOrder.customerWhatsApp}`,
      newOrder.notes ? `📝 *Observaciones:* ${newOrder.notes}` : '',
      `-----------------------------------------`,
      `📦 *DETALLE DE PRODUCTOS:*`,
      itemsList,
      `-----------------------------------------`,
      `📦 *TOTAL CAJAS:* ${newOrder.totalBoxes} cajas (${newOrder.totalUnits} cepillos)`,
      `💰 *SUBTOTAL ESTIMADO (Sin IVA):* $${newOrder.totalAmount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`,
      `-----------------------------------------`,
      `ℹ️ *Aviso:* ${settings.preCheckoutNoticeBody}`,
    ].filter(Boolean);

    const messageText = messageLines.join('\n');

    // Clean destination phone number
    const cleanPhone = settings.whatsappNumber.replace(/\D/g, '');
    const cleanCountry = settings.whatsappCountryCode.replace(/\D/g, '');
    const fullPhone = cleanPhone.startsWith(cleanCountry) ? cleanPhone : `${cleanCountry}${cleanPhone}`;

    const whatsappUrl = `https://wa.me/${fullPhone}?text=${encodeURIComponent(messageText)}`;

    // Clear cart and reset pending
    clearCart();
    setIsCartOpen(false);

    return {
      success: true,
      whatsappUrl,
      messageText,
      order: newOrder,
    };
  };

  // Admin operations
  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
  };

  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const id = newProd.code.trim() || `PROD-${Date.now().toString().slice(-4)}`;
    setProducts(prev => [...prev, { ...newProd, id }]);
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    removeFromCart(productId);
  };

  const resetProductsToDefault = () => {
    setProducts(INITIAL_PRODUCTS);
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettingsToDefault = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status } : o)));
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        settings,
        cart,
        orders,
        viewMode,
        setViewMode,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedLine,
        setSelectedLine,
        isCartOpen,
        setIsCartOpen,
        isAdminOpen,
        setIsAdminOpen,
        isNoticeModalOpen,
        setIsNoticeModalOpen,
        selectedProductForDetail,
        setSelectedProductForDetail,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartDetailedItems,
        totalBoxes,
        totalUnits,
        totalAmount,
        totalItemsCount,
        pendingCustomer,
        setPendingCustomer,
        initiateCheckout,
        confirmOrderAndSendWhatsApp,
        updateProduct,
        addProduct,
        deleteProduct,
        resetProductsToDefault,
        updateSettings,
        resetSettingsToDefault,
        updateOrderStatus,
        deleteOrder,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
