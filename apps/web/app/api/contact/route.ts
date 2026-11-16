import { NextResponse } from 'next/server';
import {
  sendContactMessageEmail,
  sendContactAutoReplyEmail,
} from '../../../modules/email/email.service';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

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

    // 1. Dispatch incoming inquiry to official admin inbox (temboxofficial.id@gmail.com)
    try {
      await sendContactMessageEmail({
        name: userName,
        senderContact: userContact,
        category: userCategory,
        message: userMessage,
      });
    } catch (smtpErr) {
      console.error('[SMTP ERROR] Failed sending notification to admin:', smtpErr);
      return NextResponse.json(
        {
          success: false,
          error: 'Gagal mengirim email melalui server SMTP. Silakan coba sesaat lagi atau hubungi via WhatsApp.',
        },
        { status: 500 }
      );
    }

    // 2. Simple regex check for valid email address in userContact
    let autoReplySent = false;
    const emailMatch = userContact.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
    const userEmail = emailMatch ? emailMatch[0] : null;

    if (userEmail) {
      try {
        autoReplySent = await sendContactAutoReplyEmail({
          toEmail: userEmail,
          recipientName: userName,
          category: userCategory,
          message: userMessage,
        });
      } catch (userErr) {
        console.error('[SMTP ERROR] Failed sending auto-reply to user:', userEmail, userErr);
      }
    }

    // 3. Return structured response after awaiting both dispatches
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
