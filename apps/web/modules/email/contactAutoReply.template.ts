export interface ContactAutoReplyEmailOptions {
  recipientName: string;
  category?: string;
  message: string;
  sentAt?: string;
}

/**
 * Builds a cross-client compatible HTML auto-reply email for users submitting the TEMBOX Contact Form.
 * Built with responsive table layouts and inline CSS for full compatibility with
 * Gmail, Apple Mail, Outlook, and Yahoo Mail (ZERO emoji).
 */
export function buildContactAutoReplyEmail({
  recipientName,
  category = 'Konsultasi Perangkat',
  message,
  sentAt,
}: ContactAutoReplyEmailOptions): string {
  const displayName = recipientName ? recipientName.trim() : 'Pengguna TEMBOX';
  const timestamp = sentAt || new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) + ' WIB';

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="id">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>Konfirmasi Pesan Diterima - TEMBOX</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #050a0f; }
    @media screen and (max-width: 620px) {
      .email-container { width: 100% !important; }
      .email-content { padding: 24px 18px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #050a0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <!-- Center Wrapper -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #050a0f; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 30px 12px;">
        <!-- Email Card (Max 600px) -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 600px; background-color: #0b131b; border: 1px solid #1a2736; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 45px rgba(0, 0, 0, 0.65);">
          
          <!-- 1. HEADER TOP BAR (#091017) -->
          <tr>
            <td style="background-color: #091017; padding: 20px 28px; border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="left" valign="middle">
                    <span style="font-size: 22px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff; text-decoration: none;">
                      TEMBOX<span style="color: #38bdf8;">.</span>
                    </span>
                  </td>
                  <td align="right" valign="middle">
                    <span style="display: inline-block; padding: 5px 12px; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #38bdf8; background-color: rgba(56, 189, 248, 0.12); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 9999px;">
                      Pesan Diterima
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 2. KONTEN UTAMA (#0b131b) -->
          <tr>
            <td class="email-content" style="padding: 34px 30px; background-color: #0b131b; color: #e2e8f0;">
              <!-- Sapaan Personal -->
              <h2 style="margin: 0 0 14px 0; font-size: 20px; font-weight: 700; color: #ffffff; line-height: 1.3;">
                Halo, ${displayName}!
              </h2>

              <!-- Paragraf Konfirmasi Penerimaan -->
              <p style="margin: 0 0 20px 0; font-size: 14.5px; line-height: 1.7; color: #94a3b8;">
                Terima kasih telah menghubungi tim <strong style="color: #ffffff;">TEMBOX</strong>. Pesan Anda telah kami terima dan tim teknis/kemitraan kami akan meninjau serta merespons pesan Anda secepatnya (maksimal 1&times;24 jam pada hari kerja).
              </p>

              <!-- KOTAK RINGKASAN PESAN PENGGUNA (#131d27 dengan border #263545) -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 24px 0 24px 0;">
                <tr>
                  <td style="background-color: #131d27; border: 1px solid #263545; border-radius: 12px; padding: 20px;">
                    <div style="font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: #7ddce8; margin-bottom: 12px;">
                      SALINAN PESAN ANDA
                    </div>
                    
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13.5px; line-height: 1.6;">
                      <tr>
                        <td style="padding: 4px 0; color: #94a3b8; width: 130px;" valign="top">Kategori:</td>
                        <td style="padding: 4px 0; color: #ffffff; font-weight: 600;" valign="top">${category}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #94a3b8;" valign="top">Waktu Kirim:</td>
                        <td style="padding: 4px 0; color: #cbd5e1;" valign="top">${timestamp}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0 4px 0; color: #94a3b8;" valign="top" colspan="2">Isi Pesan:</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding: 8px 12px; background-color: #0b131b; border-left: 3px solid #38bdf8; border-radius: 0 6px 6px 0; color: #e2e8f0; font-size: 13.5px; line-height: 1.65; white-space: pre-wrap;">${message}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Kotak Informasi Bantuan Mendesak -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 18px;">
                <tr>
                  <td style="background-color: rgba(56, 189, 248, 0.05); border-left: 3px solid #38bdf8; border-radius: 0 8px 8px 0; padding: 12px 16px;">
                    <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #cbd5e1;">
                      <strong style="color: #38bdf8;">Butuh respon mendesak?</strong> Anda juga dapat menghubungi layanan operasional kami langsung melalui WhatsApp di <a href="https://wa.me/6287833847895" style="color: #7ddce8; font-weight: 700; text-decoration: none;">+62 878-3384-7895</a>.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Penutup -->
              <p style="margin: 24px 0 0 0; font-size: 13px; line-height: 1.6; color: #64748b;">
                Email ini dikirimkan secara otomatis sebagai konfirmasi penerimaan pesan dari sistem formulir kontak Ice-TEMBOX.
              </p>
            </td>
          </tr>

          <!-- 3. FOOTER (#091017) -->
          <tr>
            <td style="background-color: #091017; padding: 26px 28px; border-top: 1px solid rgba(255, 255, 255, 0.08); text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 700; color: #7ddce8; letter-spacing: 0.02em;">
                Fresh Catch, Better Tomorrow.
              </p>
              <p style="margin: 0 0 14px 0; font-size: 11.5px; color: #64748b; line-height: 1.5;">
                Platform Pemantauan Suhu Palka Es &amp; Telemetri Maritim Berbasis IoT
              </p>
              <p style="margin: 0; font-size: 11px; color: #475569;">
                &copy; 2026 TEMBOX. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
