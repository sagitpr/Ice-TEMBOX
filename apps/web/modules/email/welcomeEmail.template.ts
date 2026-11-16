export interface WelcomeEmailOptions {
  recipientName: string;
  dashboardUrl?: string;
  bannerUrl?: string;
}

/**
 * Builds a cross-client compatible HTML email template for TEMBOX Welcome & Account Activation.
 * Uses 100% table-based layouts and inline CSS for Gmail, Apple Mail, Outlook, and Yahoo Mail compatibility.
 * Strictly adheres to TEMBOX maritime dark-mode design system with zero emojis.
 */
export function buildWelcomeEmail({
  recipientName,
  dashboardUrl = 'https://ice-tembox.vercel.app/dashboard',
  bannerUrl,
}: WelcomeEmailOptions): string {
  const displayName = recipientName ? recipientName.trim() : 'Pengguna TEMBOX';

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ice-tembox.vercel.app';
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const resolvedBannerUrl = bannerUrl || `${cleanBaseUrl}/Selamat-datang-tembox.jpg`;
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
  <!-- Center Wrapper -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #050a0f; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 30px 12px;">
        <!-- Email Container (Max 600px) -->
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
                      Account Verified
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 2. BANNER POSTER UTAMA (Full width, seamless no side padding) -->
          <tr>
            <td align="center" style="background-color: #071520; padding: 0; line-height: 0;">
              <img
                src="${resolvedBannerUrl}"
                alt="Selamat Datang di TEMBOX - Sistem Monitoring Suhu Palka Kapal"
                width="600"
                style="width: 100%; max-width: 600px; height: auto; display: block; border: 0; outline: none; text-decoration: none;"
              />
            </td>
          </tr>

          <!-- 3. KONTEN UTAMA (#0b131b) -->
          <tr>
            <td class="email-content" style="padding: 36px 30px; background-color: #0b131b; color: #e2e8f0;">
              <!-- Sapaan Personal -->
              <h2 style="margin: 0 0 14px 0; font-size: 22px; font-weight: 800; color: #ffffff; line-height: 1.3; letter-spacing: -0.02em;">
                Selamat Datang di TEMBOX, ${displayName}!
              </h2>

              <!-- Penjelasan Aktivasi Akun -->
              <p style="margin: 0 0 18px 0; font-size: 14.5px; line-height: 1.75; color: #94a3b8;">
                Akun Anda telah berhasil diverifikasi dan aktif. Anda kini dapat mengakses ekosistem pemantauan rantai dingin maritim cerdas <strong style="color: #ffffff;">TEMBOX</strong> secara penuh.
              </p>

              <!-- Feature Highlights Box -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #131d27; border: 1px solid #263545; border-radius: 12px; padding: 20px; margin: 22px 0 28px 0;">
                <tr>
                  <td style="padding-bottom: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
                    <div style="font-size: 13.5px; font-weight: 700; color: #38bdf8; margin-bottom: 3px;">
                      Monitoring Suhu Palka Real-Time
                    </div>
                    <div style="font-size: 12.5px; line-height: 1.6; color: #94a3b8;">
                      Pantau stabilitas suhu palka kapal dan boks penyimpanan ikan dengan sensor presisi tinggi untuk mencegah pencairan es sebelum bersandar.
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 12px;">
                    <div style="font-size: 13.5px; font-weight: 700; color: #38bdf8; margin-bottom: 3px;">
                      Katalog Resmi &amp; Pengadaan Armada
                    </div>
                    <div style="font-size: 12.5px; line-height: 1.6; color: #94a3b8;">
                      Pesan unit hardware cerdas TEMBOX siap pasang langsung dari katalog resmi dengan proteksi pembayaran aman dan garansi maritim.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Tombol CTA Utama (Pill Biru #0284c7) -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 30px 0 10px 0;">
                <tr>
                  <td align="center">
                    <a
                      href="${resolvedDashboardUrl}"
                      target="_blank"
                      class="cta-btn"
                      style="display: inline-block; background-color: #0284c7; color: #ffffff; font-size: 14.5px; font-weight: 700; text-decoration: none; padding: 14px 34px; border-radius: 9999px; text-align: center; box-shadow: 0 4px 18px rgba(2, 132, 199, 0.35); transition: background-color 0.2s ease;"
                    >
                      Buka Dashboard Monitoring
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Notice info -->
              <p style="margin: 24px 0 0 0; font-size: 12px; line-height: 1.6; color: #64748b; text-align: center;">
                Jika tombol di atas tidak berfungsi, salin dan buka tautan berikut di peramban Anda:<br />
                <a href="${resolvedDashboardUrl}" style="color: #38bdf8; word-break: break-all; text-decoration: underline;">
                  ${resolvedDashboardUrl}
                </a>
              </p>
            </td>
          </tr>

          <!-- 4. FOOTER (#091017) -->
          <tr>
            <td style="background-color: #091017; padding: 24px 28px; border-top: 1px solid rgba(255, 255, 255, 0.08); text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12.5px; font-weight: 700; letter-spacing: 0.04em; color: #cbd5e1;">
                Fresh Catch, Better Tomorrow.
              </p>
              <p style="margin: 0; font-size: 11.5px; color: #64748b;">
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
