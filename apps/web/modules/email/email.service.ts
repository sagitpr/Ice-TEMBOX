import nodemailer from 'nodemailer';
import { buildOtpVerificationEmail } from './otpEmail.template';
import { buildContactAutoReplyEmail } from './contactAutoReply.template';
import { buildWelcomeEmail } from './welcomeEmail.template';

let mailTransporterInstance: nodemailer.Transporter | null = null;

/**
 * Returns a singleton Nodemailer Transporter instance using strictly server-side SMTP environment variables.
 * Prevents redundant TCP/TLS handshakes and pool exhaustion across requests.
 */
function getMailTransporter(): nodemailer.Transporter {
  if (mailTransporterInstance) {
    return mailTransporterInstance;
  }

  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = process.env.SMTP_USER || 'temboxofficial.id@gmail.com';
  const pass = process.env.SMTP_PASS || '';

  mailTransporterInstance = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  return mailTransporterInstance;
}

export interface SendOtpEmailParams {
  to: string;
  otpCode: string;
  recipientName?: string;
}

/**
 * Dispatches an OTP verification email using the branded HTML template.
 */
export async function sendOtpEmail({ to, otpCode, recipientName }: SendOtpEmailParams) {
  const transporter = getMailTransporter();
  const htmlContent = buildOtpVerificationEmail({ otpCode, recipientName });
  const fromEmail = process.env.SMTP_USER || 'temboxofficial.id@gmail.com';

  const mailOptions = {
    from: `"TEMBOX Security" <${fromEmail}>`,
    to,
    subject: `[${otpCode}] Kode Verifikasi Akun TEMBOX`,
    html: htmlContent,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}

export interface SendContactMessageParams {
  name: string;
  senderContact: string;
  category?: string;
  message: string;
}

/**
 * Sends incoming inquiry from the Contact Form directly to official inbox.
 */
export async function sendContactMessageEmail({
  name,
  senderContact,
  category = 'Konsultasi Perangkat',
  message,
}: SendContactMessageParams) {
  const transporter = getMailTransporter();
  const officialEmail = process.env.SMTP_USER || 'temboxofficial.id@gmail.com';
  const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) + ' WIB';

  const isEmail = senderContact.includes('@');

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pesan Baru - Formulir Kontak TEMBOX</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050a0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #e2e8f0;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #050a0f; padding: 30px 12px;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #0b131b; border: 1px solid #1a2736; border-radius: 14px; overflow: hidden;">
          
          <!-- Header Bar -->
          <tr>
            <td style="background-color: #091017; padding: 20px 24px; border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="left">
                    <span style="font-size: 20px; font-weight: 800; color: #ffffff;">
                      TEMBOX<span style="color: #38bdf8;">.</span>
                    </span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; padding: 4px 10px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #38bdf8; background-color: rgba(56, 189, 248, 0.12); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 9999px;">
                      Pesan Masuk Baru
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 28px 24px; background-color: #0b131b;">
              <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 700; color: #ffffff;">
                Notifikasi Formulir Kontak Web
              </h2>

              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #131d27; border: 1px solid #263545; border-radius: 10px; padding: 16px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; color: #94a3b8; width: 140px;">Pengirim:</td>
                  <td style="padding: 6px 0; font-size: 14px; font-weight: 700; color: #ffffff;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; color: #94a3b8;">Kontak / WhatsApp:</td>
                  <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #38bdf8;">${senderContact}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; color: #94a3b8;">Kategori Kebutuhan:</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #7ddce8;">${category}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; color: #94a3b8;">Waktu Kirim:</td>
                  <td style="padding: 6px 0; font-size: 13px; color: #cbd5e1;">${timestamp}</td>
                </tr>
              </table>

              <div style="margin-bottom: 8px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8;">
                Isi Pesan:
              </div>
              <div style="background-color: #131d27; border-left: 3px solid #38bdf8; border-radius: 0 8px 8px 0; padding: 16px; font-size: 14px; line-height: 1.65; color: #e2e8f0; white-space: pre-wrap;">
${message}
              </div>
            </td>
          </tr>

          <!-- Footer Bar -->
          <tr>
            <td style="background-color: #091017; padding: 18px 24px; border-top: 1px solid rgba(255, 255, 255, 0.08); text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #64748b;">
                Pesan ini dikirim secara otomatis melalui sistem formulir kontak Ice-TEMBOX.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const mailOptions = {
    from: `"TEMBOX Web Contact" <${officialEmail}>`,
    to: officialEmail,
    replyTo: isEmail ? senderContact : undefined,
    subject: `[TEMBOX Contact - ${category}] Pesan Baru dari ${name}`,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}

export interface SendContactAutoReplyParams {
  toEmail: string;
  recipientName: string;
  category?: string;
  message: string;
}

/**
 * Dispatches an automated confirmation email to the user with a copy of their submitted inquiry.
 * Safely wrapped in a try-catch so failures (e.g. bounce/invalid recipient domain) do not break the main workflow.
 */
export async function sendContactAutoReplyEmail({
  toEmail,
  recipientName,
  category = 'Konsultasi Perangkat',
  message,
}: SendContactAutoReplyParams): Promise<boolean> {
  try {
    const transporter = getMailTransporter();
    const fromEmail = process.env.SMTP_USER || 'temboxofficial.id@gmail.com';
    const htmlContent = buildContactAutoReplyEmail({
      recipientName,
      category,
      message,
    });

    const mailOptions = {
      from: `"TEMBOX Support" <${fromEmail}>`,
      to: toEmail,
      subject: `Konfirmasi Penerimaan Pesan - TEMBOX (${category})`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[SMTP] Auto-reply successfully sent to ${toEmail}:`, info?.messageId);
    return true;
  } catch (error) {
    console.error(`[SMTP ERROR] Failed to send auto-reply email to user (${toEmail}):`, error);
    return false;
  }
}

export interface SendWelcomeEmailParams {
  toEmail: string;
  recipientName: string;
  dashboardUrl?: string;
}

/**
 * Dispatches a personalized Welcome & Account Activation email upon successful OTP verification.
 * Safely isolated in a try-catch block so email transport issues never interrupt the user's activation.
 */
export async function sendWelcomeEmail({
  toEmail,
  recipientName,
  dashboardUrl,
}: SendWelcomeEmailParams): Promise<boolean> {
  try {
    const transporter = getMailTransporter();
    const fromEmail = process.env.SMTP_USER || 'temboxofficial.id@gmail.com';
    const htmlContent = buildWelcomeEmail({
      recipientName,
      dashboardUrl,
    });

    const mailOptions = {
      from: `"TEMBOX Support" <${fromEmail}>`,
      to: toEmail,
      subject: `Selamat Datang di TEMBOX - Akun Anda Telah Aktif`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[SMTP] Welcome email successfully sent to ${toEmail}:`, info?.messageId);
    return true;
  } catch (error) {
    console.error(`[SMTP ERROR] Failed to send welcome email to user (${toEmail}):`, error);
    return false;
  }
}
