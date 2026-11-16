export interface OtpEmailOptions {
  otpCode: string;
  recipientName?: string;
  bannerUrl?: string;
}

/**
 * Builds a cross-client compatible HTML email template for TEMBOX OTP verification.
 * Follows table-based layouts and inline CSS for full compatibility with
 * Gmail, Apple Mail, Outlook, and Yahoo Mail.
 */
export function buildOtpVerificationEmail({
  otpCode,
  recipientName,
  bannerUrl = 'https://ice-tembox.vercel.app/Verifikasi-OTP-TEMBOX.png',
}: OtpEmailOptions): string {
  const displayName = recipientName ? recipientName.trim() : 'Pengguna TEMBOX';

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="id">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>Verifikasi OTP - TEMBOX</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #050a0f; }
    @media screen and (max-width: 620px) {
      .email-container { width: 100% !important; }
      .email-content { padding: 24px 18px !important; }
      .otp-code { font-size: 28px !important; letter-spacing: 6px !important; }
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
                      Account Verification
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 2. BANNER POSTER UTAMA (Full width, seamless no padding) -->
          <tr>
            <td align="center" style="background-color: #071520; padding: 0; line-height: 0;">
              <img
                src="${bannerUrl}"
                alt="Verifikasi OTP TEMBOX - Pantau Kondisi Palka dengan Aman"
                width="600"
                style="width: 100%; max-width: 600px; height: auto; display: block; border: 0; outline: none; text-decoration: none;"
              />
            </td>
          </tr>

          <!-- 3. KONTEN UTAMA (#0b131b) -->
          <tr>
            <td class="email-content" style="padding: 34px 30px; background-color: #0b131b; color: #e2e8f0;">
              <!-- Personal Greeting -->
              <h2 style="margin: 0 0 14px 0; font-size: 20px; font-weight: 700; color: #ffffff; line-height: 1.3;">
                Halo, ${displayName}!
              </h2>

              <!-- Intro Paragraph -->
              <p style="margin: 0 0 20px 0; font-size: 14.5px; line-height: 1.7; color: #94a3b8;">
                Terima kasih telah mendaftar di platform pemantauan rantai dingin maritim <strong style="color: #ffffff;">TEMBOX</strong>. Untuk menyelesaikan proses otentikasi akun Anda, silakan gunakan kode verifikasi One-Time Password (OTP) berikut:
              </p>

              <!-- KOTAK KODE OTP (#131d27 dengan border #263545) -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 26px 0 24px 0;">
                <tr>
                  <td align="center" style="background-color: #131d27; border: 1px solid #263545; border-radius: 12px; padding: 24px 20px;">
                    <div style="font-size: 11px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: #94a3b8; margin-bottom: 8px;">
                      KODE VERIFIKASI OTP
                    </div>
                    <div class="otp-code" style="font-family: 'Courier New', Courier, monospace, sans-serif; font-size: 34px; font-weight: 800; letter-spacing: 10px; color: #38bdf8; padding: 6px 0 10px 0; user-select: all;">
                      ${otpCode}
                    </div>
                    <div style="font-size: 12.5px; color: #64748b; line-height: 1.5;">
                      Masukkan kode pada halaman verifikasi TEMBOX.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Security Notice / Expiry Box -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 18px;">
                <tr>
                  <td style="background-color: rgba(56, 189, 248, 0.05); border-left: 3px solid #38bdf8; border-radius: 0 8px 8px 0; padding: 12px 16px;">
                    <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #cbd5e1;">
                      <strong style="color: #38bdf8;">Penting:</strong> Kode ini hanya berlaku selama <strong style="color: #ffffff;">5 menit</strong>. Jangan berikan kode OTP ini kepada siapapun demi menjaga keamanan data armada dan perangkat IoT Anda.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Disclaimer -->
              <p style="margin: 24px 0 0 0; font-size: 12.5px; line-height: 1.6; color: #64748b;">
                Jika Anda tidak merasa melakukan pendaftaran akun di TEMBOX, Anda dapat mengabaikan email ini dengan aman.
              </p>
            </td>
          </tr>

          <!-- 4. FOOTER (#091017) -->
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
