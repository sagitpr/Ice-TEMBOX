export interface WelcomeEmailOptions {
  recipientName: string;
  dashboardUrl?: string;
  bannerUrl?: string;
}

/**
 * Builds a maritime-minimalist HTML email template for TEMBOX Welcome & Account Activation.
 * Follows table-based layouts and inline CSS with a strict 3-color palette
 * (White #FFFFFF, Deep Navy #0F172A, Ocean Blue #0284C7).
 * Zero raw <svg> tags and zero emojis for rock-solid Gmail and Outlook deliverability.
 */
export function buildWelcomeEmail({
  recipientName,
  dashboardUrl = 'https://ice-tembox.vercel.app/dashboard',
}: WelcomeEmailOptions): string {
  const displayName = recipientName && recipientName.trim() ? recipientName.trim() : 'Pengguna TEMBOX';
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ice-tembox.vercel.app';
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const resolvedDashboardUrl = dashboardUrl || `${cleanBaseUrl}/dashboard`;
  const portalUrl = cleanBaseUrl;
  const waUrl = 'https://wa.me/6287833847895';
  const igUrl = 'https://instagram.com';

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
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #F1F5F9; }
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .stack-column { display: block !important; width: 100% !important; max-width: 100% !important; box-sizing: border-box !important; }
      .stack-spacing { padding-top: 20px !important; padding-left: 0 !important; }
      .mobile-padding { padding: 18px 16px !important; }
      .mobile-btn { display: block !important; width: 100% !important; box-sizing: border-box !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <!-- Outer Center Wrapper -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F1F5F9; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 28px 12px;">
        
        <!-- Main Email Card (Max 600px, White, Clean Border) -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 600px; background-color: #FFFFFF; border: 1.5px solid #CBD5E1; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08);">
          
          <!-- BAGIAN 1: TOP HEADER -->
          <tr>
            <td style="padding: 18px 24px; border-bottom: 1px solid #E2E8F0; background-color: #FFFFFF;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="left" valign="middle">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td valign="middle" style="padding-right: 10px;">
                          <span style="font-size: 20px; font-weight: 800; letter-spacing: -0.5px; color: #0F172A; text-decoration: none;">
                            TEMBOX<span style="color: #0284C7;">.</span>
                          </span>
                        </td>
                        <td valign="middle">
                          <span style="display: inline-block; padding: 2px 8px; font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #0284C7; background-color: #F0F9FF; border: 1px solid #BAE6FD; border-radius: 9999px;">
                            Akun Aktif
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" valign="middle">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right: 8px;">
                          <a href="${portalUrl}" target="_blank" style="display: inline-block; padding: 4px 10px; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 11px; font-weight: 600; color: #0F172A; text-decoration: none; background-color: #FFFFFF;">
                            Buka Portal
                          </a>
                        </td>
                        <td style="padding-right: 4px;">
                          <a href="${portalUrl}" target="_blank" style="display: inline-block; padding: 3px 6px; border: 1px solid #CBD5E1; border-radius: 4px; font-size: 10px; font-weight: 700; color: #64748B; text-decoration: none; background-color: #F8FAFC;">
                            Web
                          </a>
                        </td>
                        <td style="padding-right: 4px;">
                          <a href="${igUrl}" target="_blank" style="display: inline-block; padding: 3px 6px; border: 1px solid #CBD5E1; border-radius: 4px; font-size: 10px; font-weight: 700; color: #64748B; text-decoration: none; background-color: #F8FAFC;">
                            IG
                          </a>
                        </td>
                        <td>
                          <a href="${waUrl}" target="_blank" style="display: inline-block; padding: 3px 6px; border: 1px solid #CBD5E1; border-radius: 4px; font-size: 10px; font-weight: 700; color: #64748B; text-decoration: none; background-color: #F8FAFC;">
                            WA
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BAGIAN 2: HERO HEADLINE BANNER -->
          <tr>
            <td style="padding: 20px 24px 0 24px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 22px 20px; text-align: center;">
                <tr>
                  <td align="center">
                    <!-- Subtle Maritime Geometric Line Accent -->
                    <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 10px;">
                      <tr>
                        <td width="28" height="2" style="background-color: #0284C7; font-size: 0; line-height: 0;">&nbsp;</td>
                        <td width="6" height="2" style="background-color: transparent; font-size: 0; line-height: 0;">&nbsp;</td>
                        <td width="6" height="6" style="background-color: #0F172A; border-radius: 50%; font-size: 0; line-height: 0;">&nbsp;</td>
                        <td width="6" height="2" style="background-color: transparent; font-size: 0; line-height: 0;">&nbsp;</td>
                        <td width="28" height="2" style="background-color: #0284C7; font-size: 0; line-height: 0;">&nbsp;</td>
                      </tr>
                    </table>
                    <h1 style="margin: 0 0 6px 0; font-size: 19px; font-weight: 800; color: #0F172A; line-height: 1.35; letter-spacing: -0.02em;">
                      Selamat Datang di Ekosistem Rantai Dingin TEMBOX!
                    </h1>
                    <p style="margin: 0; font-size: 13px; color: #64748B; line-height: 1.5;">
                      Akun Anda telah aktif secara resmi untuk memantau integritas suhu palka kapal dan boks ikan.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BAGIAN 3: ASYMMETRIC 2-COLUMN CONTENT -->
          <tr>
            <td style="padding: 24px;" class="mobile-padding">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <!-- Left Column (58%): Sapaan & Fitur Unggulan -->
                  <td width="58%" class="stack-column" valign="top" style="padding-right: 14px;">
                    <h2 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 700; color: #0F172A;">
                      Halo, ${displayName}!
                    </h2>
                    <p style="margin: 0 0 16px 0; font-size: 13.5px; line-height: 1.6; color: #334155;">
                      Selamat bergabung! Akun Anda kini memiliki akses penuh ke platform pemantauan maritim cerdas. Berikut panduan langkah awal Anda:
                    </p>
                    
                    <!-- 3 Numbered Steps -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="24" valign="top" style="padding-bottom: 10px;">
                          <div style="width: 20px; height: 20px; border-radius: 50%; background-color: #0284C7; color: #FFFFFF; font-size: 11px; font-weight: 700; text-align: center; line-height: 20px;">
                            1
                          </div>
                        </td>
                        <td valign="top" style="padding-left: 8px; padding-bottom: 10px; font-size: 12.5px; line-height: 1.5; color: #334155;">
                          Akses dashboard operasional untuk melengkapi profil armada kapal Anda.
                        </td>
                      </tr>
                      <tr>
                        <td width="24" valign="top" style="padding-bottom: 10px;">
                          <div style="width: 20px; height: 20px; border-radius: 50%; background-color: #0284C7; color: #FFFFFF; font-size: 11px; font-weight: 700; text-align: center; line-height: 20px;">
                            2
                          </div>
                        </td>
                        <td valign="top" style="padding-left: 8px; padding-bottom: 10px; font-size: 12.5px; line-height: 1.5; color: #334155;">
                          Hubungkan sensor telemetri IoT palka es untuk pemantauan suhu otomatis.
                        </td>
                      </tr>
                      <tr>
                        <td width="24" valign="top">
                          <div style="width: 20px; height: 20px; border-radius: 50%; background-color: #0284C7; color: #FFFFFF; font-size: 11px; font-weight: 700; text-align: center; line-height: 20px;">
                            3
                          </div>
                        </td>
                        <td valign="top" style="padding-left: 8px; font-size: 12.5px; line-height: 1.5; color: #334155;">
                          Pantau stabilitas es dan kualitas tangkapan laut secara real-time dari mana saja.
                        </td>
                      </tr>
                    </table>
                  </td>

                  <!-- Right Column (42%): Focus Card Status Akun -->
                  <td width="42%" class="stack-column stack-spacing" valign="middle">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F0F9FF; border: 1.5px solid #0284C7; border-radius: 10px; padding: 18px 14px; text-align: center;">
                      <tr>
                        <td align="center">
                          <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: #0284C7; margin-bottom: 6px;">
                            STATUS IDENTITAS AKUN
                          </div>
                          <div style="font-size: 16px; font-weight: 800; color: #0F172A; padding: 4px 0;">
                            TERVERIFIKASI RESMI
                          </div>
                          <div style="margin-top: 8px;">
                            <span style="display: inline-block; background-color: #0284C7; color: #FFFFFF; font-size: 10.5px; font-weight: 700; padding: 3px 10px; border-radius: 9999px;">
                              Mitra / Pengguna Aktif
                            </span>
                          </div>
                          <div style="font-size: 11px; color: #64748B; margin-top: 8px; line-height: 1.4;">
                            Proteksi Rantai Dingin Aktif
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BAGIAN 4: PRIMARY CTA BUTTON -->
          <tr>
            <td align="center" style="padding: 0 24px 26px 24px;">
              <a
                href="${resolvedDashboardUrl}"
                target="_blank"
                class="mobile-btn"
                style="display: inline-block; background-color: #0F172A; color: #FFFFFF; font-size: 14px; font-weight: 700; text-decoration: none; padding: 13px 28px; border-radius: 8px; text-align: center; box-shadow: 0 4px 14px rgba(15, 23, 42, 0.2);"
              >
                Masuk ke Dashboard Monitoring
              </a>
              <div style="margin-top: 12px; font-size: 11.5px; color: #64748B;">
                Atau buka melalui peramban Anda: <a href="${resolvedDashboardUrl}" style="color: #0284C7; text-decoration: underline;">${resolvedDashboardUrl}</a>
              </div>
            </td>
          </tr>

          <!-- BAGIAN 5: FOOTER & CLOSING -->
          <tr>
            <td style="background-color: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 22px 24px; text-align: center;">
              <p style="margin: 0 0 4px 0; font-size: 12.5px; color: #64748B;">
                Salam hangat dari tim laut kami,
              </p>
              <p style="margin: 0 0 12px 0; font-size: 13.5px; font-weight: 700; color: #0F172A;">
                Tim Operasional &amp; Dukungan TEMBOX
              </p>
              <p style="margin: 0 0 14px 0; font-size: 11.5px; color: #64748B; line-height: 1.5;">
                Platform Pemantauan Suhu Palka Es &amp; Telemetri Maritim Berbasis IoT<br />
                <a href="${portalUrl}" target="_blank" style="color: #0284C7; text-decoration: none; font-weight: 600;">
                  ice-tembox.vercel.app
                </a>
              </p>
              <p style="margin: 0; font-size: 11px; color: #94A3B8;">
                &copy; 2026 TEMBOX. Seluruh hak cipta dilindungi undang-undang.
              </p>
            </td>
          </tr>

          <!-- PURE CSS BOTTOM MARITIME WAVE SILHOUETTE BAR (No SVG, No External Image) -->
          <tr>
            <td style="padding: 0; line-height: 0; font-size: 0; background-color: #F8FAFC;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="line-height: 0; font-size: 0; border-collapse: collapse;">
                <tr>
                  <td width="12%" height="7" style="background-color: #0284C7; border-top-left-radius: 5px; border-top-right-radius: 5px;">&nbsp;</td>
                  <td width="4%" height="3" style="background-color: transparent;">&nbsp;</td>
                  <td width="18%" height="11" style="background-color: #0F172A; border-top-left-radius: 7px; border-top-right-radius: 7px;">&nbsp;</td>
                  <td width="4%" height="4" style="background-color: transparent;">&nbsp;</td>
                  <td width="26%" height="14" style="background-color: #0284C7; border-top-left-radius: 9px; border-top-right-radius: 9px;">&nbsp;</td>
                  <td width="4%" height="5" style="background-color: transparent;">&nbsp;</td>
                  <td width="20%" height="10" style="background-color: #0F172A; border-top-left-radius: 6px; border-top-right-radius: 6px;">&nbsp;</td>
                  <td width="12%" height="8" style="background-color: #0284C7; border-top-left-radius: 5px; border-top-right-radius: 5px;">&nbsp;</td>
                </tr>
                <tr>
                  <td colspan="8" height="4" style="background-color: #0F172A;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
