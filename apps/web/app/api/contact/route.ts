import { NextResponse } from 'next/server';
import {
  sendContactMessageEmail,
  sendContactAutoReplyEmail,
} from '../../../modules/email/email.service';
import { verifyRecaptchaToken } from '../../../modules/security/recaptcha.service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    // 0. Anti-bot validation via Google reCAPTCHA v3 (safe bypass if RECAPTCHA_SECRET_KEY unset)
    const recaptchaToken = body.recaptchaToken;
    const recaptchaCheck = await verifyRecaptchaToken(recaptchaToken, 'contact_form');
    if (!recaptchaCheck.success) {
      return NextResponse.json(
        { success: false, error: recaptchaCheck.error || 'Verifikasi keamanan reCAPTCHA gagal.' },
        { status: 403 }
      );
    }

    // Support flexible property names from frontend
    const userName = (body.fullName || body.name || '').trim();
    const userContact = (
      body.contactInfo ||
      body.senderContact ||
      body.contact ||
      body.email ||
      ''
    ).trim();
    const userCategory = (body.category || 'Konsultasi Perangkat').trim();
    const userMessage = (body.message || '').trim();

    // Validate inputs
    if (!userName || !userContact || !userMessage) {
      return NextResponse.json(
        { error: 'Nama lengkap, kontak, dan isi pesan wajib diisi.' },
        { status: 400 }
      );
    }

    // Check for valid email address in user inputs (body.email, senderContact, or contactInfo)
    const rawEmailCandidate = (body.email || userContact).trim();
    const emailMatch = rawEmailCandidate.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
    const userEmail = emailMatch ? emailMatch[0] : (rawEmailCandidate.includes('@') ? rawEmailCandidate : null);

    // Parallel dispatch: execute admin notification & user auto-reply concurrently (eliminates waterfall latency)
    const adminMailPromise = sendContactMessageEmail({
      name: userName,
      senderContact: userContact,
      category: userCategory,
      message: userMessage,
    });

    const userAutoReplyPromise = userEmail
      ? sendContactAutoReplyEmail({
          toEmail: userEmail,
          recipientName: userName,
          category: userCategory,
          message: userMessage,
        })
      : Promise.resolve(false);

    const [adminResult, userResult] = await Promise.allSettled([adminMailPromise, userAutoReplyPromise]);

    if (adminResult.status === 'rejected') {
      console.error('[SMTP ERROR] Failed sending notification to admin:', adminResult.reason);
      return NextResponse.json(
        {
          success: false,
          error: 'Gagal mengirim email melalui server SMTP. Silakan coba sesaat lagi atau hubungi via WhatsApp.',
        },
        { status: 500 }
      );
    }

    const autoReplySent = userResult.status === 'fulfilled' && Boolean(userResult.value);

    // Return structured response
    return NextResponse.json({
      success: true,
      autoReplySent,
      message: 'Pesan terkirim. Silakan periksa kotak masuk email Anda.',
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Terjadi kegagalan server saat memproses pesan.';
    console.error('[API Contact Error]:', error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
