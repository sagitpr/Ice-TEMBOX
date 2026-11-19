import { NextResponse } from 'next/server';
import { verifyDokuNotificationSignature } from '../../../../../modules/payment/doku.service';
import { fulfillOrderPayment } from '../../../../../modules/payment/orderFulfillment.service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const clientId = request.headers.get('client-id') || request.headers.get('Client-Id') || '';
    const requestId = request.headers.get('request-id') || request.headers.get('Request-Id') || '';
    const timestamp = request.headers.get('request-timestamp') || request.headers.get('Request-Timestamp') || '';
    const signature = request.headers.get('signature') || request.headers.get('Signature') || '';

    const secretKey = process.env.DOKU_SECRET_KEY || '';
    const requestTarget = '/api/payment/doku/notification';

    if (secretKey && signature) {
      const isValid = verifyDokuNotificationSignature({
        clientId,
        requestId,
        timestamp,
        requestTarget,
        bodyString: rawBody,
        signatureHeader: signature,
        secretKey,
      });

      if (!isValid) {
        console.warn('DOKU notification signature mismatch.');
      }
    }

    let parsedBody: Record<string, any> = {};
    try {
      parsedBody = JSON.parse(rawBody);
    } catch {
      // Body might be empty or form-encoded
    }

    console.log('DOKU Notification Received:', parsedBody);

    // Extract invoice number and status
    const orderObj = parsedBody.order || {};
    const transactionObj = parsedBody.transaction || {};
    const invoiceNumber =
      orderObj.invoice_number ||
      parsedBody.invoice_number ||
      transactionObj.invoice_number;

    const transactionStatus =
      transactionObj.status ||
      parsedBody.transaction_status ||
      parsedBody.status;

    // Fulfill order if payment is SUCCESS / PAID
    if (
      invoiceNumber &&
      (String(transactionStatus).toUpperCase() === 'SUCCESS' ||
        String(transactionStatus).toUpperCase() === 'PAID' ||
        String(transactionStatus).toUpperCase() === 'COMPLETED')
    ) {
      const amount = Number(orderObj.amount || parsedBody.amount || 0);
      await fulfillOrderPayment({
        orderCode: String(invoiceNumber),
        paymentMethod: 'doku',
        paidAmount: amount,
        paymentDetails: parsedBody,
      });
    }

    // Return 200 OK to acknowledge receipt to DOKU
    return NextResponse.json({ status: 'OK' }, { status: 200 });
  } catch (error) {
    console.error('Error handling DOKU webhook notification:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
