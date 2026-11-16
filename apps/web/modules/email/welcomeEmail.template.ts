export interface WelcomeEmailOptions {
  recipientName: string;
  dashboardUrl?: string;
  bannerUrl?: string;
}

/**
 * Builds a clean, cross-client compatible HTML email template for TEMBOX Welcome & Account Activation.
 * Features a full-width header poster banner, clean typography, thin line dividers,
 * and zero boxy nested structures.
 */
export function buildWelcomeEmail({
  recipientName,
  dashboardUrl = 'https://ice-tembox.vercel.app/dashboard',
  bannerUrl = 'https://ice-tembox.vercel.app/Selamat-datang-tembox.jpg',
}: WelcomeEmailOptions): string {
  const displayName = recipientName && recipientName.trim() ? recipientName.trim() : 'Pengguna TEMBOX';
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ice-tembox.vercel.app';
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const resolvedDashboardUrl = dashboardUrl || `${cleanBaseUrl}/dashboard`;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="id">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>Selamat Datang di TEMBOX</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #050a0f; }
    @media screen and (max-width: 620px) {
      .email-container { width: 100% !important; }
      .email-content { padding: 26px 20px !important; }
      .cta-btn { display: block !important; width: 100% !important; box-sizing: border-box !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #050a0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <!-- Outer Center Wrapper -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #050a0f; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 30px 12px;">
        
        <!-- Main Email Card (Max 600px, Clean Dark Theme) -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 600px; background-color: #0b131b; border: 1px solid #1a2736; border-radius: 14px; overflow: hidden; box-shadow: 0 20px 45px rgba(0, 0, 0, 0.65);">
          
          <!-- 1. TOP HEADER BRAND BAR -->
          <tr>
            <td style="background-color: #091017; padding: 18px 28px; border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="left" valign="middle">
                    <span style="font-size: 20px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff; text-decoration: none;">
                      TEMBOX<span style="color: #38bdf8;">.</span>
                    </span>
                  </td>
                  <td align="right" valign="middle">
                    <span style="display: inline-block; padding: 4px 10px; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #38bdf8; background-color: rgba(56, 189, 248, 0.12); border: 1px solid rgba(56, 189, 248, 0.28); border-radius: 9999px;">
                      Akun Aktif
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 2. FULL WIDTH POSTER BANNER -->
          <tr>
            <td align="center" style="background-color: #071520; padding: 0; line-height: 0;">
              <img
                src="${bannerUrl}"
                alt="Selamat Datang di TEMBOX"
                width="600"
                style="display: block; width: 100%; max-width: 600px; height: auto; border: 0; outline: none; text-decoration: none;"
              />
            </td>
          </tr>

          <!-- 3. CLEAN INNER CONTENT -->
          <tr>
            <td class="email-content" style="padding: 32px 28px; background-color: #0b131b; color: #e2e8f0;">
              
              <!-- Sapaan Personal -->
              <h2 style="margin: 0 0 14px 0; font-size: 20px; font-weight: 700; color: #ffffff; line-height: 1.3;">
                Selamat Datang di TEMBOX, ${displayName}!
              </h2>

              <!-- Pengantar Singkat 2 Baris -->
              <p style="margin: 0 0 24px 0; font-size: 14.5px; line-height: 1.7; color: #94a3b8;">
                Akun Anda telah berhasil diverifikasi dan kini aktif. Anda siap memantau stabilitas suhu palka es armada kapal dan menjaga kualitas tangkapan laut secara real-time.
              </p>

              <!-- DETAIL STATUS DENGAN GARIS PEMISAH TIPIS -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 0 0 26px 0;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.08); font-size: 13.5px; color: #64748b; width: 130px;" valign="top">
                    Status Akun
                  </td>
                  <td style="padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.08); font-size: 13.5px; font-weight: 700; color: #38bdf8;" valign="top">
                    Aktif &amp; Terverifikasi
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.08); font-size: 13.5px; color: #64748b;" valign="top">
                    Akses Layanan
                  </td>
                  <td style="padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.08); font-size: 13.5px; color: #cbd5e1;" valign="top">
                    Monitoring Suhu Palka &amp; Telemetri IoT
                  </td>
                </tr>
              </table>

              <!-- Keterangan Lanjutan -->
              <p style="margin: 0 0 26px 0; font-size: 13px; line-height: 1.6; color: #64748b;">
                Silakan akses dashboard monitoring Anda untuk mengelola armada kapal dan menghubungkan perangkat sensor palka.
              </p>

              <!-- Tombol CTA Utama -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 0 0 8px 0;">
                <tr>
                  <td align="center">
                    <a
                      href="${resolvedDashboardUrl}"
                      target="_blank"
                      class="cta-btn"
                      style="display: inline-block; background-color: #0284c7; color: #ffffff; font-size: 14.5px; font-weight: 700; text-decoration: none; padding: 13px 34px; border-radius: 8px; text-align: center;"
                    >
                      Buka Dashboard Monitoring
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- 4. FOOTER BERSIH -->
          <tr>
            <td style="background-color: #091017; padding: 24px 28px; border-top: 1px solid rgba(255, 255, 255, 0.08); text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12.5px; font-weight: 700; color: #7ddce8; letter-spacing: 0.02em;">
                Fresh Catch, Better Tomorrow.
              </p>
              <p style="margin: 0 0 10px 0; font-size: 11.5px; color: #64748b; line-height: 1.5;">
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
