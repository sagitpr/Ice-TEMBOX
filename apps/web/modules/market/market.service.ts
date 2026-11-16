import type { CheckoutPayload, OrderResult } from './market.types';

/**
 * Calculates estimated shipping cost based on destination port/city.
 * Free or subsidized maritime logistics tier.
 */
export async function calculateShipping(city: string): Promise<number> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 200));

  const normalized = city.trim().toLowerCase();
  if (!normalized) return 35000;

  // Major fishing ports / maritime hubs
  if (
    normalized.includes('tasikmalaya') ||
    normalized.includes('pangandaran') ||
    normalized.includes('cilacap') ||
    normalized.includes('muara baru') ||
    normalized.includes('jakarta')
  ) {
    return 25000; // Local / direct delivery
  }

  if (
    normalized.includes('banyuwangi') ||
    normalized.includes('bali') ||
    normalized.includes('benoa') ||
    normalized.includes('semarang') ||
    normalized.includes('surabaya')
  ) {
    return 45000;
  }

  // Outside Java coastal hubs (Bitung, Ambon, Sorong, Kendari)
  if (
    normalized.includes('bitung') ||
    normalized.includes('ambon') ||
    normalized.includes('makassar') ||
    normalized.includes('kendari')
  ) {
    return 75000;
  }

  return 35000;
}

/**
 * Creates a DOKU payment session via the server-side API route.
 */
export async function createDokuOrder(payload: CheckoutPayload): Promise<{
  paymentUrl: string;
  invoiceNumber: string;
  orderResult: OrderResult;
}> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (payload.token) {
    headers['Authorization'] = `Bearer ${payload.token}`;
  }

  const res = await fetch('/api/payment/doku/checkout', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      product: payload.items[0]?.product,
      quantity: payload.items[0]?.quantity || 1,
      shippingAddress: payload.shippingAddress,
      subtotal: payload.subtotal,
      shippingCost: payload.shippingCost,
      totalAmount: payload.totalAmount,
      userId: payload.userId,
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || 'Gagal membuat sesi pembayaran DOKU.');
  }

  const assignedDeviceId = `TEMBOX-${String(Math.floor(10 + Math.random() * 90)).padStart(3, '0')}`;
  const pairingToken = `PAIR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const orderResult: OrderResult = {
    orderId: `order_${Date.now()}`,
    orderNumber: data.invoiceNumber,
    status: 'pending',
    statusLabel: 'Menunggu Pembayaran DOKU',
    totalAmount: payload.totalAmount,
    paymentMethod: 'doku',
    paymentUrl: data.paymentUrl,
    createdAt: new Date().toISOString(),
    assignedDeviceId,
    pairingToken,
  };

  // Cache in localStorage for session verification
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('tembox_last_order', JSON.stringify(orderResult));
      localStorage.setItem('tembox_last_checkout_payload', JSON.stringify(payload));
    } catch {
      // Ignore localStorage errors
    }
  }

  return {
    paymentUrl: data.paymentUrl,
    invoiceNumber: data.invoiceNumber,
    orderResult,
  };
}
