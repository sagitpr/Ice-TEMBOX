'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, ArrowLeft, Check, ShieldCheck } from './Icons';
import OtpInput from './OtpInput';

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
  const router = useRouter();
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
      setStep('otp');
    }, 400);
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
      setStep('success');
    }, 500);
  };

  const rightFormPane = (
    <div className="login-right-pane" style={{ background: '#FFFFFF' }}>
      <div className="login-form-box">
        {/* STEP 1: Registration Input Form */}
        {step === 'form' && (
          <>
            <h2 className="login-title">Buat Akun</h2>
            <p className="login-desc">Mulai menggunakan sistem monitoring TEMBOX.</p>

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
                }}
              >
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmitForm}>
              <div className="form-group">
                <label className="form-label" htmlFor="regFullName">
                  Nama Lengkap
                </label>
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
                <label className="form-label" htmlFor="regEmail">
                  Email
                </label>
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
                <label className="form-label" htmlFor="regPassword">
                  Password
                </label>
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
                    className="input-toggle-pwd"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    <span style={{ fontSize: '11px', color: '#64748B' }}>
                      {showPassword ? 'Hide' : 'Show'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="regConfirmPassword">
                  Konfirmasi Password
                </label>
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
                <label className="checkbox-label" style={{ fontSize: '12px' }}>
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
                  className="form-link"
                  style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer' }}
                >
                  Masuk
                </button>
              ) : (
                <Link href="/login" className="form-link">
                  Masuk
                </Link>
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
                  background: '#EAF8FF',
                  color: '#0284C7',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                }}
              >
                <ShieldCheck size={28} />
              </div>
              <h2 className="login-title" style={{ fontSize: '24px' }}>
                Verifikasi Email
              </h2>
              <p className="login-desc" style={{ marginBottom: '0' }}>
                Kode OTP 6 digit telah dikirim ke{' '}
                <strong style={{ color: '#0B2D42' }}>{email}</strong>.
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
                <span>{loading ? 'Memverifikasi...' : 'Verifikasi &amp; Aktifkan Akun'}</span>
              </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => setStep('form')}
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
            <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-ocean)', marginBottom: '6px' }}>
              Akun Berhasil Diaktifkan!
            </h3>
            <p style={{ fontSize: '13.5px', color: '#64748B', marginBottom: '24px' }}>
              Selamat datang di TEMBOX. Akun Anda siap digunakan untuk memantau data suhu palka secara real-time.
            </p>
            <button
              type="button"
              className="btn-primary-block"
              onClick={() => {
                if (onSuccess) {
                  onSuccess();
                } else {
                  router.push('/dashboard');
                }
              }}
            >
              <span>Lanjut ke Dashboard</span>
            </button>
          </div>
        )}

        {/* Return to Home link */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
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
      </div>
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
            Bergabunglah dengan ekosistem pemantauan hasil tangkapan laut modern.
          </p>
        </div>

        <div className="login-left-footer" style={{ position: 'relative', zIndex: 10 }}>
          &ldquo;Ikan tetap segar, nelayan lebih tenang.&rdquo;
        </div>
      </div>

      {rightFormPane}
    </div>
  );
};

export default RegisterView;
