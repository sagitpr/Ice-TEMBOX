export interface OrderItem {
  id?: string;
  name: string;
  quantity: number;
  price: number;
  variant?: string;
}

export interface BuyerInvoiceEmailOptions {
  buyerName: string;
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
  };
  bannerUrl?: string;
}

export function buildBuyerInvoiceEmail({
  buyerName,
  orderCode,
  items,
  totalAmount,
  paymentMethod = 'Online Payment',
  paidAt,
  shippingAddress,
  bannerUrl,
}: BuyerInvoiceEmailOptions): string {
  const formattedTotal = 'Rp ' + Number(totalAmount).toLocaleString('id-ID');
  const paymentDate = paidAt
    ? new Date(paidAt).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })
    : new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' });

  const itemsHtml = (items || [])
    .map((item) => {
      const itemSubtotal = 'Rp ' + (Number(item.price) * Number(item.quantity)).toLocaleString('id-ID');
      const itemPrice = 'Rp ' + Number(item.price).toLocaleString('id-ID');
      return `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #E2E8F0; font-size: 14px; color: #0F172A;">
            <strong style="color: #071A27;">${item.name}</strong>
            ${item.variant ? `<br/><span style="font-size: 12px; color: #64748B;">Varian: ${item.variant}</span>` : ''}
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #E2E8F0; font-size: 14px; color: #475569; text-align: center;">
            ${item.quantity} unit
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #E2E8F0; font-size: 14px; color: #475569; text-align: right;">
            ${itemPrice}
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #E2E8F0; font-size: 14px; color: #0284C7; font-weight: 700; text-align: right;">
            ${itemSubtotal}
          </td>
        </tr>
      `;
    })
    .join('');

  const addressText = shippingAddress
    ? `${shippingAddress.streetAddress || ''}, ${shippingAddress.city || ''}, ${shippingAddress.province || ''} ${shippingAddress.postalCode || ''}`.replace(/^[\s,]+|[\s,]+$/g, '')
    : '-';

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bukti Pembayaran & Invoice TEMBOX</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0F172A; line-height: 1.6;">
  <div style="max-width: 620px; margin: 32px auto; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);">
    
    <!-- Header Banner -->
    <div style="background: linear-gradient(135deg, #071A27 0%, #0B2D42 100%); padding: 36px 32px 32px; text-align: left; border-bottom: 3px solid #7DDCE8;">
      <div style="font-size: 24px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px;">
        TEMBOX<span style="color: #7DDCE8;">.</span>
      </div>
      <p style="margin: 6px 0 0; font-size: 13px; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">
        Cold-Chain IoT Marine Telemetry
      </p>
    </div>

    <!-- Main Body -->
    <div style="padding: 36px 32px;">
      <div style="display: inline-block; background-color: #DCFCE7; color: #15803D; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px;">
        ✓ Pembayaran Berhasil — Lunas
      </div>

      <h1 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 800; color: #071A27;">
        Terima Kasih atas Kepercayaan Anda, ${buyerName}!
      </h1>
      <p style="margin: 0 0 24px; font-size: 14.5px; color: #475569; line-height: 1.6;">
        Kami telah menerima pembayaran pesanan Anda. Terima kasih telah mempercayakan pengawasan mutu rantai dingin (cold-chain) hasil tangkapan armada Anda kepada platform <strong>TEMBOX</strong>.
      </p>

      <!-- Invoice Details Box -->
      <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 20px 24px; margin-bottom: 28px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-size: 13px; color: #64748B;">Nomor Transaksi:</span>
          <strong style="font-size: 13.5px; color: #071A27; font-family: monospace;">${orderCode}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-size: 13px; color: #64748B;">Waktu Pembayaran:</span>
          <span style="font-size: 13px; color: #071A27;">${paymentDate}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-size: 13px; color: #64748B;">Metode Pembayaran:</span>
          <span style="font-size: 13px; color: #071A27; text-transform: uppercase;">${paymentMethod}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="font-size: 13px; color: #64748B;">Alamat Pengiriman:</span>
          <span style="font-size: 13px; color: #071A27; max-width: 320px; text-align: right;">${addressText}</span>
        </div>
      </div>

      <!-- Item Breakdown Table -->
      <div style="margin-bottom: 28px;">
        <h3 style="margin: 0 0 12px; font-size: 15px; font-weight: 700; color: #071A27;">
          Rincian Unit Perangkat
        </h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 1.5px solid #CBD5E1;">
              <th style="padding: 8px 0; font-size: 12px; font-weight: 700; text-align: left; color: #64748B; text-transform: uppercase;">Unit / Varian</th>
              <th style="padding: 8px 0; font-size: 12px; font-weight: 700; text-align: center; color: #64748B; text-transform: uppercase;">Jumlah</th>
              <th style="padding: 8px 0; font-size: 12px; font-weight: 700; text-align: right; color: #64748B; text-transform: uppercase;">Harga</th>
              <th style="padding: 8px 0; font-size: 12px; font-weight: 700; text-align: right; color: #64748B; text-transform: uppercase;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 16px 0 0; font-size: 15px; font-weight: 700; text-align: right; color: #071A27;">
                Total Pembayaran:
              </td>
              <td style="padding: 16px 0 0; font-size: 18px; font-weight: 800; text-align: right; color: #0284C7;">
                ${formattedTotal}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Device Activation Guide -->
      <div style="border-top: 1px solid #E2E8F0; padding-top: 24px; margin-bottom: 28px;">
        <h3 style="margin: 0 0 12px; font-size: 15px; font-weight: 700; color: #071A27;">
          Panduan Singkat Aktivasi Perangkat Fisik:
        </h3>
        <ol style="margin: 0; padding-left: 20px; font-size: 13.5px; color: #475569; line-height: 1.7;">
          <li>Setelah unit box tiba, hubungkan catu daya 12V DC (aki kapal) atau nyalakan sakelar internal baterai.</li>
          <li>Perhatikan layar <strong>LCD 1602</strong> di panel depan box. Layar akan menampilkan <strong>Device ID</strong> (contoh: <code>TBX-9F8A21</code>) dan <strong>6-Digit PIN</strong> pairing.</li>
          <li>Buka menu <strong>Pengaturan &gt; Tambah Perangkat</strong> di dashboard akun Anda, masukkan Device ID dan 6-Digit PIN tersebut untuk menghubungkan palka secara instan.</li>
          <li>Sensor digital stainless steel siap dimasukkan ke sela es palka untuk memantau suhu dan kesegaran ikan.</li>
        </ol>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 32px 0 16px;">
        <a href="https://ice-tembox.vercel.app/dashboard#/transaksi" style="display: inline-block; background-color: #0284C7; color: #FFFFFF; font-size: 14px; font-weight: 700; text-decoration: none; padding: 13px 28px; border-radius: 9999px;">
          Buka Riwayat Pembelian di Dashboard &rarr;
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #F1F5F9; border-top: 1px solid #E2E8F0; padding: 20px 32px; font-size: 12px; color: #64748B; text-align: center;">
      <p style="margin: 0 0 4px;">&copy; 2026 TEMBOX — Cold-Chain IoT Monitoring. Hak Cipta Dilindungi.</p>
      <p style="margin: 0;">Butuh bantuan teknis? Hubungi tim support kami via WhatsApp atau email support@ice-tembox.id</p>
    </div>

  </div>
</body>
</html>
  `.trim();
}
