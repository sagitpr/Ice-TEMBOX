import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { fulfillOrderPayment } from '../../../../../modules/payment/orderFulfillment.service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/payment/midtrans/notification
 * Webhook handler for Midtrans payment notifications.
 * Verifies SHA-512 signature, ensures idempotency, and dispatches dual emails.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type,
    } = body;

    if (!order_id) {
      return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
    }

    // 1. Signature Verification (SHA512(order_id + status_code + gross_amount + ServerKey))
    const serverKey = process.env.MIDTRANS_SERVER_KEY?.trim();
    if (serverKey && signature_key) {
      const payloadToHash = `${order_id}${status_code}${gross_amount}${serverKey}`;
      const expectedSignature = crypto
        .createHash('sha512')
        .update(payloadToHash)
        .digest('hex');

      if (expectedSignature !== signature_key) {
        console.warn(`[Midtrans Webhook] Signature mismatch for order ${order_id}.`);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
      }
    }

    console.log(`[Midtrans Webhook] Received notification for ${order_id}:`, {
      transaction_status,
      fraud_status,
      payment_type,
    });

    // 2. Process Successful Settlement or Capture
    const isPaid =
      transaction_status === 'settlement' ||
      (transaction_status === 'capture' && fraud_status === 'accept');

    if (isPaid) {
      const amount = Number(gross_amount) || 0;
      await fulfillOrderPayment({
        orderCode: String(order_id),
        paymentMethod: payment_type ? `midtrans-${payment_type}` : 'midtrans',
        paidAmount: amount,
        paymentDetails: body,
      });
    }

    return NextResponse.json({ status: 'OK' }, { status: 200 });
  } catch (error) {
    console.error('[Midtrans Webhook Error]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
