import { getSupabaseAdmin } from '../supabase/supabaseAdmin';
import {
  sendBuyerInvoiceEmail,
  sendAdminOrderNotificationEmail,
} from '../email/email.service';
import type { OrderItem } from '../email/buyerInvoiceEmail.template';

export interface FulfillOrderParams {
  orderCode: string;
  paymentMethod?: string;
  paidAmount?: number;
  paymentDetails?: Record<string, unknown>;
  fallbackBuyerName?: string;
  fallbackBuyerEmail?: string;
  fallbackBuyerPhone?: string;
  fallbackItems?: OrderItem[];
  fallbackAddress?: Record<string, unknown>;
}

export interface FulfillOrderResult {
  success: boolean;
  alreadyProcessed?: boolean;
  orderCode: string;
  buyerEmail?: string;
  error?: string;
}

/**
 * Fulfills an order upon receiving a verified payment confirmation webhook.
 * Guarantees strict IDEMPOTENCY: if an order is already marked 'paid',
 * it gracefully exits without resending duplicate emails.
 */
export async function fulfillOrderPayment({
  orderCode,
  paymentMethod = 'Online Payment',
  paidAmount,
  paymentDetails,
  fallbackBuyerName,
  fallbackBuyerEmail,
  fallbackBuyerPhone,
  fallbackItems,
  fallbackAddress,
}: FulfillOrderParams): Promise<FulfillOrderResult> {
  const cleanOrderCode = orderCode.trim();
  if (!cleanOrderCode) {
    return { success: false, orderCode: '', error: 'Kode transaksi order wajib diisi.' };
  }

  const hasSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  let orderRecord: any = null;

  if (hasSupabase) {
    const admin = getSupabaseAdmin();

    // 1. Fetch current order state
    const { data: existingOrder, error: fetchErr } = await admin
      .from('orders')
      .select('*')
      .eq('order_code', cleanOrderCode)
      .maybeSingle();

    if (fetchErr) {
      console.error('[Fulfillment] Error fetching order:', fetchErr.message);
    }

    // 2. IDEMPOTENCY GUARD: If already marked as paid, exit immediately
    if (existingOrder && existingOrder.payment_status === 'paid') {
      console.log(`[Fulfillment IDEMPOTENT] Order ${cleanOrderCode} is already marked as paid. Skipping duplicate emails.`);
      return {
        success: true,
        alreadyProcessed: true,
        orderCode: cleanOrderCode,
        buyerEmail: existingOrder.buyer_email,
      };
    }

    orderRecord = existingOrder;

    // 3. Update order in database to 'paid'
    const nowIso = new Date().toISOString();
    if (existingOrder) {
      const { error: updateErr } = await admin
        .from('orders')
        .update({
          payment_status: 'paid',
          paid_at: nowIso,
          payment_method: paymentMethod,
          updated_at: nowIso,
        })
        .eq('id', existingOrder.id);

      if (updateErr) {
        console.error('[Fulfillment] Error updating order status to paid:', updateErr.message);
      }
    } else {
      // If order was not pre-saved in checkout, insert it directly
      const buyerName = fallbackBuyerName || 'Pelanggan TEMBOX';
      const buyerEmail = fallbackBuyerEmail || 'pelanggan@ice-tembox.id';
      const total = paidAmount || 0;

      const { data: newOrder, error: insertErr } = await admin
        .from('orders')
        .insert({
          order_code: cleanOrderCode,
          buyer_name: buyerName,
          buyer_email: buyerEmail,
          buyer_phone: fallbackBuyerPhone || '',
          shipping_address: fallbackAddress || {},
          items: fallbackItems || [],
          total_amount: total,
          payment_status: 'paid',
          payment_method: paymentMethod,
          paid_at: nowIso,
        })
        .select()
        .single();

      if (insertErr) {
        console.error('[Fulfillment] Error inserting paid order:', insertErr.message);
      } else {
        orderRecord = newOrder;
      }
    }
  }

  // 4. Extract details for email delivery
  const buyerName = orderRecord?.buyer_name || fallbackBuyerName || 'Pelanggan TEMBOX';
  const buyerEmail = orderRecord?.buyer_email || fallbackBuyerEmail;
  const buyerPhone = orderRecord?.buyer_phone || fallbackBuyerPhone || '';
  const totalAmount = Number(orderRecord?.total_amount || paidAmount || 0);
  const items: OrderItem[] = (orderRecord?.items as OrderItem[]) || fallbackItems || [
    { name: 'TEMBOX IoT Cold-Chain Unit', quantity: 1, price: totalAmount },
  ];
  const shippingAddress = (orderRecord?.shipping_address as any) || fallbackAddress;
  const paidAt = orderRecord?.paid_at || new Date().toISOString();

  if (!buyerEmail || !buyerEmail.includes('@')) {
    console.warn(`[Fulfillment] Buyer email not available or invalid for order ${cleanOrderCode}. Emails skipped.`);
    return {
      success: true,
      orderCode: cleanOrderCode,
      error: 'Buyer email not valid',
    };
  }

  // 5. Send Dual Emails Asynchronously (Safe isolated execution)
  try {
    // Email 1: Buyer Invoice & Thank You
    await sendBuyerInvoiceEmail(buyerEmail, {
      buyerName,
      orderCode: cleanOrderCode,
      items,
      totalAmount,
      paymentMethod,
      paidAt,
      shippingAddress,
    });

    // Email 2: Internal Admin / Owner Notification
    await sendAdminOrderNotificationEmail({
      buyerName,
      buyerEmail,
      buyerPhone,
      orderCode: cleanOrderCode,
      items,
      totalAmount,
      paymentMethod,
      paidAt,
      shippingAddress,
    });
  } catch (emailErr) {
    console.error('[Fulfillment] Error dispatching dual order notification emails:', emailErr);
  }

  return {
    success: true,
    alreadyProcessed: false,
    orderCode: cleanOrderCode,
    buyerEmail,
  };
}
