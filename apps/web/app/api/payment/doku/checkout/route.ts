import { NextResponse } from 'next/server';
import { createDokuCheckoutSession } from '../../../../../modules/payment/doku.service';
import { requireServerAuth } from '../../../../../modules/auth/serverAuth';

export async function POST(request: Request) {
  try {
    // 1. Strict Server-Side Anti-IDOR Authentication Guard
    const authResult = await requireServerAuth(request);
    if (authResult.response) {
      return authResult.response;
    }

    const verifiedUser = authResult.user;

    const body = await request.json().catch(() => ({}));
    const {
      product,
      quantity = 1,
      shippingAddress,
      totalAmount,
    } = body;

    // Validate essential inputs
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.streetAddress) {
      return NextResponse.json(
        { error: 'Data penerima dan alamat pengiriman wajib diisi dengan lengkap.' },
        { status: 400 }
      );
    }

    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json(
        { error: 'Total nominal pembayaran tidak valid.' },
        { status: 400 }
      );
    }

    // Generate strict user-isolated invoice number using cryptographically verified user ID
    const cleanUserId = verifiedUser.id.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
    const timestamp = Date.now();
    const invoiceNumber = `INV-TEMBOX-${cleanUserId}-${timestamp}`;

    const customerEmail =
      verifiedUser.email ||
      (shippingAddress.email && shippingAddress.email.includes('@')
        ? shippingAddress.email
        : 'pelanggan@ice-tembox.id');

    const productName = product?.name || 'TEMBOX IoT Unit';

    const result = await createDokuCheckoutSession({
      invoiceNumber,
      amount: totalAmount,
      customer: {
        id: cleanUserId,
        name: shippingAddress.fullName || verifiedUser.name,
        email: customerEmail,
        phone: shippingAddress.phone,
        address: `${shippingAddress.streetAddress}, ${shippingAddress.city || ''}`,
      },
      lineItems: [
        {
          name: `${productName} (${quantity} unit)`,
          price: totalAmount,
          quantity: 1,
        },
      ],
    });

    return NextResponse.json({
      success: true,
      paymentUrl: result.paymentUrl,
      invoiceNumber: result.invoiceNumber,
    });
  } catch (error: unknown) {
    console.error('API DOKU Checkout Error:', error);
    const message = error instanceof Error ? error.message : 'Terjadi kendala saat menghubungkan ke gateway pembayaran DOKU.';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
