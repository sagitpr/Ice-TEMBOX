'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowLeft, Check, KeyRound } from './Icons';
import OtpInput from './OtpInput';
import AuthBottomWaves from '../../components/ui/AuthBottomWaves';

interface ForgotPasswordViewProps {
  onSuccess?: () => void;
  onNavigateLogin?: () => void;
  onBackHome?: () => void;
  hideLeftPane?: boolean;
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({
  onSuccess,
  onNavigateLogin,
  onBackHome,
  hideLeftPane = false,
}) => {
  const router = useRouter();
  // Step 1: 'email' -> Step 2: 'reset' -> Step 3: 'success'
  const [step, setStep] = useState<'email' | 'reset' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Step 1: Submit email to request OTP via API
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Masukkan alamat email yang valid.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.success === false) {
        throw new Error(data.error || data.message || `Gagal mengirim OTP (Status ${res.status})`);
      }

      // Only advance to step 'reset' after email is verified as successfully dispatched
      setStep('reset');
      setSuccessMsg(data.message || `Kode OTP 6 digit telah dikirim ke ${cleanEmail}.`);
    } catch (err: unknown) {
      console.error('[Forgot Password Request Error]:', err);
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan jaringan saat mengirim kode verifikasi.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP handler for OTP input screen
  const handleResendOtp = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setOtp('');
    setOtpError('');
    setResending(true);

    const cleanEmail = email.trim().toLowerCase();
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          purpose: 'reset_password',
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.success === false) {
        throw new Error(data.error || data.message || `Gagal mengirim ulang OTP (Status ${res.status})`);
      }

      setSuccessMsg(data.message || 'Kode OTP baru telah berhasil dikirim ke email Anda.');
    } catch (err: unknown) {
      console.error('[Resend OTP Error]:', err);
      const msg = err instanceof Error ? err.message : 'Gagal mengirim ulang kode OTP.';
      setErrorMsg(msg);
    } finally {
      setResending(false);
    }
  };

  // Step 2: Submit OTP and new password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setOtpError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    if (cleanOtp.length < 6) {
      setOtpError('Masukkan 6 digit kode OTP yang lengkap.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg('Password baru minimal harus 8 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Password baru dan konfirmasi password tidak cocok.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          otpCode: cleanOtp,
          newPassword,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.success === false) {
        if (data.remainingAttempts !== undefined) {
          setOtpError(data.error || 'Kode OTP tidak valid.');
        }
        throw new Error(data.error || data.message || `Gagal memperbarui password (Status ${res.status})`);
      }

      setStep('success');
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: unknown) {
      console.error('[Reset Password Error]:', err);
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan saat memproses reset password.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const rightFormPane = (
    <div className="login-right-pane" style={{ background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
      <div className="login-form-box" style={{ position: 'relative', zIndex: 10 }}>
        {/* STEP 1: Enter Email */}
        {step === 'email' && (
          <>
            <h2 className="login-title">Lupa Password?</h2>
            <p className="login-desc">
              Masukkan email akun Anda. Kami akan mengirimkan 6 digit kode OTP untuk verifikasi reset password.
            </p>

            {errorMsg && (
              <div
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  marginBottom: '16px',
                  color: '#B91C1C',
                  fontSize: '13px',
                  lineHeight: 1.4,
                }}
              >
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleRequestOtp}>
              <div className="form-group">
                <label className="form-label" htmlFor="forgotEmail">
                  Alamat Email Terdaftar
                </label>
                <div className="input-icon-wrap">
                  <Mail size={16} className="input-icon" />
                  <input
                    type="email"
                    id="forgotEmail"
                    className="form-input"
                    placeholder="nama@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary-block" disabled={loading} style={{ marginTop: '8px' }}>
                <span>{loading ? 'Mengirim Kode OTP...' : 'Kirim Kode Verifikasi'}</span>
              </button>
            </form>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              {onNavigateLogin ? (
                <button
                  type="button"
                  onClick={onNavigateLogin}
                  style={{
                    fontSize: '13px',
                    color: '#0284C7',
                    background: 'none',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <ArrowLeft size={14} />
                  <span>Kembali ke Halaman Masuk</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  style={{
                    fontSize: '13px',
                    color: '#0284C7',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <ArrowLeft size={14} />
                  <span>Kembali ke Halaman Masuk</span>
                </Link>
              )}
            </div>
          </>
        )}

        {/* STEP 2: Enter OTP & New Password */}
        {step === 'reset' && (
          <>
            <h2 className="login-title">Verifikasi &amp; Reset</h2>
            <p className="login-desc" style={{ marginBottom: '16px' }}>
              Kode 6 digit telah dikirim ke <strong style={{ color: '#0B2D42' }}>{email}</strong>.
            </p>

            {successMsg && (
              <div
                style={{
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  marginBottom: '16px',
                  color: '#15803D',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Check size={16} color="#15803D" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  marginBottom: '16px',
                  color: '#B91C1C',
                  fontSize: '13px',
                  lineHeight: 1.4,
                }}
              >
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleResetPassword}>
              {/* 6-Digit OTP Input */}
              <div style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ display: 'block', textAlign: 'center', marginBottom: '10px' }}>
                  Masukkan 6 Digit Kode OTP
                </label>
                <OtpInput
                  value={otp}
                  onChange={(val) => {
                    setOtp(val);
                    setOtpError('');
                  }}
                  error={otpError}
                  onResend={handleResendOtp}
                />
              </div>

              {/* New Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="resetNewPassword">
                  Password Baru
                </label>
                <div className="input-icon-wrap">
                  <Lock size={16} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="resetNewPassword"
                    className="form-input"
                    placeholder="Minimal 8 karakter"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label="Toggle password visibility"
                  >
                    <span style={{ fontSize: '11px', color: '#64748B' }}>
                      {showPassword ? 'Sembunyikan' : 'Lihat'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="resetConfirmPassword">
                  Konfirmasi Password Baru
                </label>
                <div className="input-icon-wrap">
                  <Lock size={16} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="resetConfirmPassword"
                    className="form-input"
                    placeholder="Ulangi password baru"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary-block"
                disabled={loading || resending}
                style={{ marginTop: '12px' }}
              >
                <span>{loading ? 'Menyimpan Password...' : 'Simpan Password Baru'}</span>
              </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setErrorMsg('');
                  setSuccessMsg('');
                  setOtp('');
                  setOtpError('');
                }}
                style={{
                  fontSize: '12.5px',
                  color: '#64748B',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <ArrowLeft size={13} />
                <span>Ubah alamat email</span>
              </button>
            </div>
          </>
        )}

        {/* STEP 3: Success Confirmation */}
        {step === 'success' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div
              style={{
                width: '58px',
                height: '58px',
                borderRadius: '50%',
                background: '#EAF8FF',
                color: '#0284C7',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <Check size={28} />
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-ocean)', marginBottom: '8px' }}>
              Password Berhasil Diubah!
            </h3>
            <p style={{ fontSize: '13.5px', color: '#64748B', marginBottom: '24px', lineHeight: 1.5 }}>
              Kata sandi baru Anda telah aktif. Silakan masuk kembali dengan password yang baru.
            </p>
            <button
              type="button"
              className="btn-primary-block"
              onClick={() => {
                if (onNavigateLogin) {
                  onNavigateLogin();
                } else {
                  router.push('/login');
                }
              }}
            >
              <span>Masuk Sekarang</span>
            </button>
          </div>
        )}

        {/* Return to Home link */}
        {step !== 'success' && (
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            {onBackHome ? (
              <button
                type="button"
                onClick={onBackHome}
                className="auth-back-link"
              >
                <ArrowLeft size={14} />
                <span>Kembali ke TEMBOX</span>
              </button>
            ) : (
              <Link href="/" className="auth-back-link">
                <ArrowLeft size={14} />
                <span>Kembali ke TEMBOX</span>
              </Link>
            )}
          </div>
        )}
      </div>
      <AuthBottomWaves />
    </div>
  );

  if (hideLeftPane) {
    return rightFormPane;
  }

  return (
    <div className="login-view-wrapper" style={{ display: 'flex' }}>
      {/* Left Hero Pane: video is powered seamlessly by PersistentBackgroundVideo */}
      <div
        className="login-left-pane"
        style={{
          background: 'transparent',
          position: 'relative',
        }}
      >
        <div className="login-left-content" style={{ position: 'relative', zIndex: 10 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span
              style={{
                fontWeight: 800,
                fontSize: '26px',
                letterSpacing: '-0.5px',
                color: '#FFFFFF',
                display: 'block',
                marginBottom: '6px',
                cursor: 'pointer',
              }}
            >
              TEMBOX<span style={{ color: '#7DDCE8' }}>.</span>
            </span>
          </Link>
          <p className="login-brand-tagline">
            Pulihkan akses ke sistem pemantauan rantai dingin Anda dengan aman.
          </p>
        </div>

        <div className="login-left-footer" style={{ position: 'relative', zIndex: 10 }}>
          &ldquo;Keamanan data dan stabilitas pemantauan Anda adalah prioritas kami.&rdquo;
        </div>
      </div>

      {rightFormPane}
    </div>
  );
};

export default ForgotPasswordView;
