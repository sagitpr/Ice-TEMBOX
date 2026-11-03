'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, Mail, Lock, ArrowLeft, Check, ShieldCheck } from './Icons';
import OtpInput from './OtpInput';

// Media assets
import heroVideoRaw from '../../src/assets/Video/Nelayan-kapal-Horizontal.mp4';
import heroBoatRaw from '../../src/assets/hero-boat.jpg';

interface StaticAssetLike {
  src?: string;
}

const getSrc = (asset: string | StaticAssetLike | unknown): string => {
  if (typeof asset === 'string') return asset;
  if (asset && typeof asset === 'object' && 'src' in asset) return (asset as StaticAssetLike).src || '';
  return '';
};

const heroVideo = getSrc(heroVideoRaw) || '/Nelayan-kapal-Horizontal.mp4';
const heroBoat = getSrc(heroBoatRaw) || '/hero-boat.jpg';

interface RegisterViewProps {
  onSuccess?: () => void;
  onNavigateLogin?: () => void;
  onBackHome?: () => void;
  hideLeftPane?: boolean;
}

export const RegisterView: React.FC<RegisterViewProps> = ({
  onSuccess,
  onNavigateLogin,
  onBackHome,
  hideLeftPane = false,
}) => {
  // Step 1: 'form' -> Step 2: 'otp' -> Step 3: 'success'
  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [terms, setTerms] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Step 1: Submit Registration Form -> Proceed to OTP
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Password dan Konfirmasi Password tidak cocok!');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password minimal harus 8 karakter!');
      return;
    }

    if (!terms) {
      setErrorMsg('Anda harus menyetujui syarat & ketentuan TEMBOX.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp'); // Automatically advance to 6-digit OTP verification
    }, 500);
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');

    if (otp.length < 6) {
      setOtpError('Masukkan 6 digit kode OTP yang lengkap.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('success'); // Mark account verified & active
    }, 600);
  };

  const rightFormPane = (
    <div className="login-right-pane">
      <div className="login-form-box">
        {/* STEP 1: Registration Input Form */}
        {step === 'form' && (
          <>
            <h2 className="login-title">Buat Akun</h2>
            <p className="login-desc">Mulai menggunakan sistem monitoring TEMBOX.</p>

            {errorMsg && (
              <div
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  marginBottom: '16px',
                  color: '#FCA5A5',
                  fontSize: '13px',
                }}
              >
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmitForm}>
              <div className="form-group">
                <label className="form-label" htmlFor="regFullName">Nama Lengkap</label>
                <div className="input-icon-wrap">
                  <User size={16} className="input-icon" />
                  <input
                    type="text"
                    id="regFullName"
                    className="form-input"
                    placeholder="Nama Lengkap"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="regEmail">Email</label>
                <div className="input-icon-wrap">
                  <Mail size={16} className="input-icon" />
                  <input
                    type="email"
                    id="regEmail"
                    className="form-input"
                    placeholder="alamat@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="regPassword">Password</label>
                <div className="input-icon-wrap">
                  <Lock size={16} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="regPassword"
                    className="form-input"
                    placeholder="Minimal 8 karakter"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? 'Sembunyikan' : 'Lihat'}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="regConfirmPassword">Konfirmasi Password</label>
                <div className="input-icon-wrap">
                  <Lock size={16} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="regConfirmPassword"
                    className="form-input"
                    placeholder="Ulangi password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row-between" style={{ marginBottom: '18px' }}>
                <label className="checkbox-label" style={{ fontSize: '12.5px' }}>
                  <input
                    type="checkbox"
                    id="regTerms"
                    required
                    checked={terms}
                    onChange={(e) => setTerms(e.target.checked)}
                  />
                  <span>Saya menyetujui syarat &amp; ketentuan TEMBOX</span>
                </label>
              </div>

              <button type="submit" className="btn-primary-block" disabled={loading}>
                <span>{loading ? 'Memproses...' : 'Lanjutkan Verifikasi'}</span>
              </button>
            </form>

            <p className="login-footer-text">
              Sudah punya akun?{' '}
              {onNavigateLogin ? (
                <button
                  type="button"
                  onClick={onNavigateLogin}
                  className="auth-switch-link"
                  style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer' }}
                >
                  Masuk
                </button>
              ) : (
                <Link href="/login" className="auth-switch-link">Masuk</Link>
              )}
            </p>
          </>
        )}

        {/* STEP 2: 6-Digit OTP Verification Form */}
        {step === 'otp' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'rgba(2, 132, 199, 0.2)',
                  color: '#38BDF8',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                }}
              >
                <ShieldCheck size={28} />
              </div>
              <h2 className="login-title" style={{ fontSize: '24px' }}>Verifikasi Email</h2>
              <p className="login-desc" style={{ marginBottom: '0' }}>
                Kode OTP 6 digit telah dikirim ke <strong style={{ color: '#7DDCE8' }}>{email}</strong>.
              </p>
            </div>

            <form onSubmit={handleVerifyOtp}>
              <div style={{ marginBottom: '20px' }}>
                <OtpInput
                  value={otp}
                  onChange={(val) => {
                    setOtp(val);
                    setOtpError('');
                  }}
                  error={otpError}
                  onResend={() => {
                    setOtp('');
                    setOtpError('');
                  }}
                />
              </div>

              <button type="submit" className="btn-primary-block" disabled={loading}>
                <span>{loading ? 'Memverifikasi...' : 'Verifikasi & Aktifkan Akun'}</span>
              </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => setStep('form')}
                className="auth-back-link"
              >
                <ArrowLeft size={13} />
                <span>Ubah data pendaftaran</span>
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
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34D399',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                border: '1px solid rgba(52, 211, 153, 0.3)',
              }}
            >
              <Check size={28} />
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
              Akun Berhasil Diaktifkan!
            </h3>
            <p style={{ fontSize: '13.5px', color: '#94A3B8', marginBottom: '24px', lineHeight: 1.5 }}>
              Selamat datang di TEMBOX. Akun Anda siap digunakan untuk memantau data suhu palka secara real-time.
            </p>
            <button
              type="button"
              className="btn-primary-block"
              onClick={() => {
                if (onSuccess) {
                  onSuccess();
                } else {
                  window.location.href = '/dashboard';
                }
              }}
            >
              <span>Lanjut ke Dashboard</span>
            </button>
          </div>
        )}

        {/* Return to Home link */}
        <div style={{ marginTop: '22px', textAlign: 'center' }}>
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
            <Link
              href="/"
              className="auth-back-link"
            >
              <ArrowLeft size={14} />
              <span>Kembali ke TEMBOX</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  if (hideLeftPane) {
    return rightFormPane;
  }

  return (
    <div className="login-view-wrapper">
      {/* Left Hero Pane with Background Video Backdrop */}
      <div className="login-left-pane">
        <video
          className="login-media-backdrop"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={heroBoat}
        >
          <source src={heroVideo} type="video/mp4" />
          <source src="/Nelayan-kapal-Horizontal.mp4" type="video/mp4" />
        </video>
        <div className="login-overlay-gradient" />

        <div className="login-left-content">
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
            Bergabunglah dengan ekosistem pemantauan hasil tangkapan laut modern.
          </p>
        </div>

        <div className="login-left-footer">
          &ldquo;Ikan tetap segar, nelayan lebih tenang.&rdquo;
        </div>
      </div>

      {rightFormPane}
    </div>
  );
};

export default RegisterView;
