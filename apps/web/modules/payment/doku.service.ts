import crypto from 'crypto';

export interface GenerateDokuSignatureParams {
  clientId: string;
  requestId: string;
  timestamp: string;
  requestTarget: string;
  bodyString: string;
  secretKey: string;
}

export interface DokuSignatureResult {
  digest: string;
  signature: string;
}

/**
 * Generates SHA-256 Digest and HMAC-SHA256 Signature according to DOKU Checkout API specification.
 */
export function generateDokuSignature({
  clientId,
  requestId,
  timestamp,
  requestTarget,
  bodyString,
  secretKey,
}: GenerateDokuSignatureParams): DokuSignatureResult {
  // 1. Calculate SHA-256 Base64 Digest of the JSON body
  const digest = crypto
    .createHash('sha256')
    .update(bodyString, 'utf-8')
    .digest('base64');

  // 2. Prepare Component Signature String
  const componentSignature =
    `Client-Id:${clientId}\n` +
    `Request-Id:${requestId}\n` +
    `Request-Timestamp:${timestamp}\n` +
    `Request-Target:${requestTarget}\n` +
    `Digest:${digest}`;

  // 3. Calculate HMAC-SHA256 with Secret Key
  const hmac = crypto
    .createHmac('sha256', secretKey)
    .update(componentSignature, 'utf-8')
    .digest('base64');

  const signature = `HMACSHA256=${hmac}`;

  return { digest, signature };
}

/**
 * Verifies incoming notification signature from DOKU webhook callback.
 */
export function verifyDokuNotificationSignature({
  clientId,
  requestId,
  timestamp,
  requestTarget,
  bodyString,
  signatureHeader,
  secretKey,
}: {
  clientId: string;
  requestId: string;
  timestamp: string;
  requestTarget: string;
  bodyString: string;
  signatureHeader: string;
  secretKey: string;
}): boolean {
  try {
    const { signature } = generateDokuSignature({
      clientId,
      requestId,
      timestamp,
      requestTarget,
      bodyString,
      secretKey,
    });

    return signature === signatureHeader;
  } catch (err) {
    console.error('DOKU signature verification error:', err);
    return false;
  }
}

export interface DokuOrderCustomer {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
}

export interface DokuCheckoutOrderPayload {
  invoiceNumber: string;
  amount: number;
  customer: DokuOrderCustomer;
  callbackUrl?: string;
  lineItems?: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
}

export interface DokuCheckoutResult {
  success: boolean;
  paymentUrl: string;
  invoiceNumber: string;
  dokuResponse?: unknown;
}

/**
 * Creates a DOKU Checkout Session and retrieves the hosted payment URL.
 * Strictly executed server-side.
 */
export async function createDokuCheckoutSession(
  payload: DokuCheckoutOrderPayload
): Promise<DokuCheckoutResult> {
  const isProd = process.env.DOKU_ENV === 'production';
  const baseUrl = isProd ? 'https://api.doku.com' : 'https://api-sandbox.doku.com';
  const requestTarget = '/checkout/v1/payment';

  const clientId = process.env.DOKU_CLIENT_ID;
  const secretKey = process.env.DOKU_SECRET_KEY;

  if (!clientId || !secretKey) {
    throw new Error('Konfigurasi DOKU_CLIENT_ID dan DOKU_SECRET_KEY belum diatur pada environment variables server.');
  }

  const requestId = `REQ-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  // ISO-8601 UTC format: YYYY-MM-DDTHH:mm:ssZ
  const timestamp = new Date().toISOString().slice(0, 19) + 'Z';

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ice-tembox.vercel.app';
  const callbackUrl = payload.callbackUrl || `${siteUrl}/checkout/success?orderNumber=${encodeURIComponent(payload.invoiceNumber)}`;

  const bodyObj = {
    order: {
      invoice_number: payload.invoiceNumber,
      amount: payload.amount,
      currency: 'IDR',
      callback_url: callbackUrl,
      auto_redirect: true,
      line_items: payload.lineItems || [
        {
          name: 'Perangkat TEMBOX',
          price: payload.amount,
          quantity: 1,
        },
      ],
    },
    payment: {
      payment_due_date: 60, // 60 minutes
    },
    customer: {
      id: payload.customer.id || `CUST-${Date.now()}`,
      name: payload.customer.name,
      email: payload.customer.email,
      phone: payload.customer.phone,
      address: payload.customer.address || 'Alamat Pengiriman Maritim',
    },
  };

  const bodyString = JSON.stringify(bodyObj);

  const { signature, digest } = generateDokuSignature({
    clientId,
    requestId,
    timestamp,
    requestTarget,
    bodyString,
    secretKey,
  });

  const headers = {
    'Client-Id': clientId,
    'Request-Id': requestId,
    'Request-Timestamp': timestamp,
    'Signature': signature,
    'Digest': digest,
    'Content-Type': 'application/json',
  };

  const response = await fetch(`${baseUrl}${requestTarget}`, {
    method: 'POST',
    headers,
    body: bodyString,
  });

  const resData = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorDetail =
      (resData && resData.error && resData.error.message) ||
      (resData && resData.message) ||
      `HTTP ${response.status} dari gateway DOKU`;
    throw new Error(`DOKU Checkout gagal: ${errorDetail}`);
  }

  // Extract payment URL from response
  // DOKU standard response contains: response.payment.url
  const paymentUrl =
    resData?.response?.payment?.url ||
    resData?.payment?.url ||
    resData?.url;

  if (!paymentUrl) {
    throw new Error('Gateway DOKU berhasil merespons tetapi tidak mengembalikan payment.url.');
  }

  return {
    success: true,
    paymentUrl,
    invoiceNumber: payload.invoiceNumber,
    dokuResponse: resData,
  };
}
