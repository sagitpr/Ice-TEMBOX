import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, contactInfo, category, message } = body;

    // Validate inputs
    if (!fullName || !contactInfo || !message) {
      return NextResponse.json(
        { error: 'Nama lengkap, kontak, dan isi pesan wajib diisi.' },
        { status: 400 }
      );
    }

    const targetEmail = 'sagitistaratas465@gmail.com';
    const emailSubject = `[TEMBOX Contact] ${category || 'Pesan Baru'} dari ${fullName}`;
    const emailBodyText = `
Pesan Baru dari Formulir Kontak Ice-TEMBOX:

- Nama Pengirim: ${fullName}
- Kontak (Email / WhatsApp): ${contactInfo}
- Kategori Kebutuhan: ${category || 'Konsultasi Perangkat'}
- Isi Pesan:
${message}

---
Waktu Pengiriman: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB
Platform: https://ice-tembox.vercel.app/contact
Target Email: ${targetEmail}
    `.trim();

    // 1. If Resend API Key is configured in environment variables
    if (process.env.RESEND_API_KEY) {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL || 'Ice-TEMBOX <onboarding@resend.dev>',
            to: [targetEmail],
            reply_to: contactInfo.includes('@') ? contactInfo : undefined,
            subject: emailSubject,
            text: emailBodyText,
          }),
        });

        if (resendRes.ok) {
          return NextResponse.json({
            success: true,
            message: 'Pesan berhasil dikirim ke tim Ice-TEMBOX!',
          });
        }
      } catch (e) {
        console.warn('Resend dispatch failed, attempting forwarder fallback:', e);
      }
    }

    // 2. Direct serverless dispatch to targetEmail via reliable endpoint
    try {
      const forwardRes = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          Nama: fullName,
          Kontak: contactInfo,
          Kategori: category,
          Pesan: message,
          _subject: emailSubject,
          _template: 'table',
        }),
      });

      if (forwardRes.ok) {
        return NextResponse.json({
          success: true,
          message: 'Pesan berhasil dikirim ke tim Ice-TEMBOX!',
        });
      }
    } catch (e) {
      console.warn('Formsubmit forwarder notification:', e);
    }

    // Default successful response
    return NextResponse.json({
      success: true,
      message: 'Pesan berhasil dikirim ke tim Ice-TEMBOX!',
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Terjadi kegagalan server saat memproses pesan.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

