export interface ProductItem {
  id: 'mini' | 'pro' | 'enterprise';
  name: string;
  badge?: string;
  tagline: string;
  price: number;
  priceFormatted: string;
  image: string;
  probes: string;
  storage: string;
  power: string;
  connectivity: string;
  features: string[];
  recommendedFor: string;
  inStock: boolean;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  province: string;
  postalCode: string;
  streetAddress: string;
  harborOrTpi?: string;
}

export type PaymentMethodType = 'doku' | 'qris';

export interface CheckoutPayload {
  items: CartItem[];
  shippingAddress: ShippingAddress;
  shippingCost: number;
  subtotal: number;
  totalAmount: number;
  paymentMethod: PaymentMethodType;
  notes?: string;
  userId?: string;
  token?: string;
}

export interface OrderResult {
  orderId: string;
  orderNumber: string;
  status: 'pending' | 'settlement' | 'processing' | 'menunggu_verifikasi';
  statusLabel?: string;
  totalAmount: number;
  paymentMethod: PaymentMethodType;
  createdAt: string;
  assignedDeviceId?: string;
  pairingToken?: string;
  paymentUrl?: string;
}
