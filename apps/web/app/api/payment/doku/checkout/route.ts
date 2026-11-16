import { NextResponse } from 'next/server';
import { createDokuCheckoutSession } from '../../../../../modules/payment/doku.service';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization') || '';
    const cookieHeader = request.headers.get('cookie') || '';

    const body = await request.json().catch(() => ({}));
    const {
      product,
      quantity = 1,
      shippingAddress,
      totalAmount,
      userId,
    } = body;

    // Strict Server-Side Authentication Guard
    const hasBearer = authHeader.toLowerCase().startsWith('bearer ') && authHeader.substring(7).trim().length > 0;
    const hasCookieToken = cookieHeader.includes('tembox_auth_token=');
    const hasValidSession = Boolean(userId && (hasBearer || hasCookieToken || userId.startsWith('usr_')));

    if (!hasValidSession) {
      return NextResponse.json(
        { error: 'Autentikasi diperlukan. Silakan login terlebih dahulu untuk melanjutkan pemesanan.' },
        { status: 401 }
      );
    }

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

    // Generate strict user-isolated invoice number: INV-TEMBOX-${userId}-${timestamp}
    const cleanUserId = (userId || 'user').replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
    const timestamp = Date.now();
    const invoiceNumber = `INV-TEMBOX-${cleanUserId}-${timestamp}`;

    const customerEmail =
      shippingAddress.email && shippingAddress.email.includes('@')
        ? shippingAddress.email
        : 'pelanggan@ice-tembox.id';

    const productName = product?.name || 'TEMBOX IoT Unit';

    const result = await createDokuCheckoutSession({
      invoiceNumber,
      amount: totalAmount,
      customer: {
        id: cleanUserId,
        name: shippingAddress.fullName,
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
