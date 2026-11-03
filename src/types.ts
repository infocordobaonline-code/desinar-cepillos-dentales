export interface Product {
  id: string;
  code: string;
  name: string;
  unitsPerBox: number;
  unitPrice: number;        // Precio unitario SIN IVA
  boxPrice: number;         // Precio por caja sin IVA
  suggestedPrice: number;   // Precio sugerido con IVA
  image: string;            // URL or path to image
  category: string;         // 'Adulto' | 'Infantil' | 'Sustentable / Bambú' | 'Reciclado' | 'Licencias'
  line: string;             // 'Axis' | '2Lifex' | 'SMILO' | 'Diamante' | 'Disney' | 'Pixar' | 'Otros'
  isActive: boolean;
  notes?: string;
}

export interface CartItem {
  productId: string;
  boxes: number;
  units?: number;
}

export interface OrderItemSummary {
  productCode: string;
  productName: string;
  boxes: number;
  units: number;
  unitPrice: number;
  boxPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  customerWhatsApp: string;
  notes?: string;
  items: OrderItemSummary[];
  totalBoxes: number;
  totalUnits: number;
  totalAmount: number;
  status: 'pendiente' | 'confirmado' | 'en_preparacion' | 'entregado' | 'cancelado';
}

export interface AppSettings {
  appName: string;
  companySubtitle: string;
  logoUrl: string;
  whatsappNumber: string; // e.g. "3517708059"
  whatsappCountryCode: string; // e.g. "549"
  minBoxesNotice: string;
  minBoxesGoal: number;
  preCheckoutNoticeTitle: string;
  preCheckoutNoticeBody: string;
  bannerNotice: string;
  primaryColor: string; // hex
  showSuggestedPrice: boolean;
  allowUnitOrdering: boolean;
}
