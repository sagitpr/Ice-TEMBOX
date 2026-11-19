import type { OrderItem } from './buyerInvoiceEmail.template';

export interface AdminOrderNotificationEmailOptions {
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  orderCode: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod?: string;
  paidAt?: string;
  shippingAddress?: {
    fullName?: string;
    phone?: string;
    streetAddress?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    harborOrTpi?: string;
  };
}

export function buildAdminOrderNotificationEmail({
  buyerName,
  buyerEmail,
  buyerPhone,
  orderCode,
  items,
  totalAmount,
  paymentMethod = 'Online Gateway',
  paidAt,
  shippingAddress,
}: AdminOrderNotificationEmailOptions): string {
  const formattedTotal = 'Rp ' + Number(totalAmount).toLocaleString('id-ID');
  const paymentDate = paidAt
    ? new Date(paidAt).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })
    : new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' });

  const itemsHtml = (items || [])
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; font-size: 13.5px; color: #0F172A;">
          <strong>${item.name}</strong> ${item.variant ? `(${item.variant})` : ''}
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; font-size: 13.5px; color: #0F172A; text-align: center;">
          <strong style="color: #0284C7;">${item.quantity} unit</strong>
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; font-size: 13.5px; color: #475569; text-align: right;">
          Rp ${Number(item.price).toLocaleString('id-ID')}
        </td>
      </tr>
    `
    )
    .join('');

  const fullAddress = shippingAddress
    ? `${shippingAddress.streetAddress || ''}, ${shippingAddress.city || ''}, ${shippingAddress.province || ''} ${shippingAddress.postalCode || ''}`.replace(/^[\s,]+|[\s,]+$/g, '')
    : '-';

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Notifikasi Pesanan Baru TEMBOX</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0F172A; line-height: 1.6;">
  <div style="max-width: 620px; margin: 32px auto; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);">
    
    <!-- Header Admin Banner -->
    <div style="background-color: #0F172A; padding: 24px 32px; border-bottom: 3px solid #38BDF8;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 18px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px;">
          TEMBOX <span style="color: #38BDF8;">Admin Hub</span>
        </span>
        <span style="background-color: #0284C7; color: #FFFFFF; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 3px 8px; border-radius: 4px;">
          Pesanan Baru
        </span>
      </div>
    </div>

    <!-- Content -->
    <div style="padding: 32px;">
      <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 800; color: #071A27;">
        Pesanan IoT Masuk — Status Lunas
      </h2>
      <p style="margin: 0 0 24px; font-size: 14px; color: #475569;">
        Transaksi dengan kode <strong>${orderCode}</strong> telah berhasil dibayar oleh pembeli dan siap diproses oleh tim gudang &amp; perakitan.
      </p>

      <!-- Buyer Identity Card -->
      <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 18px 20px; margin-bottom: 24px;">
        <h4 style="margin: 0 0 12px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748B;">
          Data Lengkap Pembeli
        </h4>
        <div style="font-size: 13.5px; line-height: 1.7; color: #0F172A;">
          <div><strong>Nama:</strong> ${buyerName}</div>
          <div><strong>Email:</strong> <a href="mailto:${buyerEmail}" style="color: #0284C7; text-decoration: none;">${buyerEmail}</a></div>
          <div><strong>WhatsApp / Telepon:</strong> <a href="tel:${buyerPhone}" style="color: #0284C7; text-decoration: none;">${buyerPhone || '-'}</a></div>
          <div><strong>Dermaga / TPI:</strong> ${shippingAddress?.harborOrTpi || '-'}</div>
          <div><strong>Alamat Tujuan:</strong> ${fullAddress}</div>
        </div>
      </div>

      <!-- Order Details -->
      <div style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 18px 20px; margin-bottom: 24px;">
        <h4 style="margin: 0 0 12px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748B;">
          Daftar Unit &amp; Nominal
        </h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">
          <thead>
            <tr style="border-bottom: 1px solid #CBD5E1;">
              <th style="padding: 6px 0; font-size: 12px; text-align: left; color: #64748B;">Varian Box</th>
              <th style="padding: 6px 0; font-size: 12px; text-align: center; color: #64748B;">Qty</th>
              <th style="padding: 6px 0; font-size: 12px; text-align: right; color: #64748B;">Harga Satuan</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        <div style="border-top: 1.5px solid #E2E8F0; padding-top: 10px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 13px; color: #64748B;">Total Terbayar (${paymentMethod}):</span>
          <strong style="font-size: 16px; color: #15803D;">${formattedTotal}</strong>
        </div>
        <div style="font-size: 12px; color: #64748B; margin-top: 4px;">
          Waktu Transaksi: ${paymentDate}
        </div>
      </div>

      <!-- Action Items for Warehouse -->
      <div style="background-color: #FEF3C7; border: 1px solid #FCD34D; border-radius: 8px; padding: 16px 20px;">
        <h4 style="margin: 0 0 8px 0; font-size: 13px; color: #92400E; font-weight: 700;">
          Tindakan Divisi Logistik &amp; Perakitan:
        </h4>
        <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #78350F; line-height: 1.6;">
          <li>Ambil unit fisik sesuai varian dari rak inventaris.</li>
          <li>Flash firmware terbaru dan lakukan kalibrasi sensor suhu DS18B20 &amp; RTC DS3231.</li>
          <li>Pastikan pairing Device ID &amp; PIN pada LCD 1602 muncul dengan normal.</li>
          <li>Kemas unit dengan pelindung benturan (bubble wrap + box kayu jika rute laut).</li>
        </ul>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 16px 32px; font-size: 12px; color: #94A3B8; text-align: center;">
      Email notifikasi internal otomatis dikirimkan ke administrator sistem TEMBOX.
    </div>

  </div>
</body>
</html>
  `.trim();
}
