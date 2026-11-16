'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { buildOtpVerificationEmail } from '../../modules/email/otpEmail.template';

export default function PreviewEmailPage() {
  const [otpCode, setOtpCode] = useState('849201');
  const [recipientName, setRecipientName] = useState('Budi Santoso');
  const [useLocalBanner, setUseLocalBanner] = useState(true);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);

  const bannerUrl = useLocalBanner
    ? '/Verifikasi-OTP-TEMBOX.png'
    : 'https://ice-tembox.vercel.app/Verifikasi-OTP-TEMBOX.png';

  const emailHtml = useMemo(() => {
    return buildOtpVerificationEmail({
      otpCode,
      recipientName,
      bannerUrl,
    });
  }, [otpCode, recipientName, bannerUrl]);

  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(emailHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050a0f', color: '#e2e8f0', display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar Controls */}
      <header
        style={{
          backgroundColor: '#091017',
          borderBottom: '1px solid #1a2736',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            href="/"
            style={{
              textDecoration: 'none',
              fontSize: '18px',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.5px',
            }}
          >
            TEMBOX<span style={{ color: '#38bdf8' }}>.</span>
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#38bdf8' }}>
            Pratinjau Template Email OTP
          </span>
        </div>

        {/* Interactive Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {/* OTP Code input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label htmlFor="otp-input" style={{ fontSize: '12px', color: '#94a3b8' }}>
              OTP:
            </label>
            <input
              id="otp-input"
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              style={{
                width: '80px',
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid #263545',
                backgroundColor: '#131d27',
                color: '#38bdf8',
                fontWeight: 800,
                fontSize: '13px',
                letterSpacing: '1px',
                textAlign: 'center',
                outline: 'none',
              }}
            />
          </div>

          {/* Recipient Name input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label htmlFor="name-input" style={{ fontSize: '12px', color: '#94a3b8' }}>
              Nama:
            </label>
            <input
              id="name-input"
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              style={{
                width: '130px',
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid #263545',
                backgroundColor: '#131d27',
                color: '#ffffff',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          {/* Toggle Banner Source */}
          <button
            type="button"
            onClick={() => setUseLocalBanner(!useLocalBanner)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #263545',
              backgroundColor: useLocalBanner ? 'rgba(56, 189, 248, 0.15)' : '#131d27',
              color: useLocalBanner ? '#38bdf8' : '#94a3b8',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Banner: {useLocalBanner ? 'Lokal (/Verifikasi...)' : 'Production (ice-tembox...)'}
          </button>

          {/* Preview Viewport Switcher */}
          <div style={{ display: 'flex', borderRadius: '6px', overflow: 'hidden', border: '1px solid #263545' }}>
            <button
              type="button"
              onClick={() => setPreviewMode('desktop')}
              style={{
                padding: '6px 12px',
                border: 'none',
                backgroundColor: previewMode === 'desktop' ? '#0284c7' : '#131d27',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Desktop (640px)
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode('mobile')}
              style={{
                padding: '6px 12px',
                border: 'none',
                backgroundColor: previewMode === 'mobile' ? '#0284c7' : '#131d27',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Mobile (380px)
            </button>
          </div>

          {/* Copy HTML Button */}
          <button
            type="button"
            onClick={handleCopyHtml}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: copied ? '#10b981' : '#38bdf8',
              color: '#050a0f',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
          >
            {copied ? 'Tersalin!' : 'Salin HTML'}
          </button>
        </div>
      </header>

      {/* Main Preview Area */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '30px 16px',
          overflowY: 'auto',
          backgroundColor: '#050a0f',
        }}
      >
        <div
          style={{
            width: previewMode === 'desktop' ? '640px' : '380px',
            transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid #1a2736',
          }}
        >
          <iframe
            title="Pratinjau Email OTP"
            srcDoc={emailHtml}
            style={{
              width: '100%',
              minHeight: '880px',
              border: 'none',
              display: 'block',
              backgroundColor: '#050a0f',
            }}
          />
        </div>
      </main>
    </div>
  );
}
