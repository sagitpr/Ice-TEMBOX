'use client';

import React from 'react';
import Link from 'next/link';
import ReCAPTCHA from 'react-google-recaptcha';
import { User, Mail, Lock, ArrowLeft, CheckCircle } from './Icons';
import OtpInput from './OtpInput';
import { useAuthLogic } from '../../hooks/useAuthLogic';
import AuthBottomWaves from '../../components/ui/AuthBottomWaves';

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
  const {
    registerStep,
    setRegisterStep,
    registerFullName,
    setRegisterFullName,
    registerEmail,
    setRegisterEmail,
    registerPassword,
    setRegisterPassword,
    registerConfirmPassword,
    setRegisterConfirmPassword,
    showRegisterPassword,
    setShowRegisterPassword,
    registerTerms,
    setRegisterTerms,
    registerRecaptchaToken,
    setRegisterRecaptchaToken,
    registerOtp,
    setRegisterOtp,
    registerOtpError,
    registerLoading,
    registerErrorMsg,
    handleRegisterSubmitForm,
    handleVerifyOtp,
    handleResendOtp,
  } = useAuthLogic();

  const onRegisterFormSubmit = (e: React.FormEvent) => {
    handleRegisterSubmitForm(e);
  };

  const onVerifyOtpSubmit = (e: React.FormEvent) => {
    handleVerifyOtp(e, onSuccess);
  };

  const siteKey =
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
    '6LewkCcuAAAAAE8F5Fk7SQ6Gl4xNdHT31yGPAHuR';

  const rightFormPane = (
    <div className="login-right-pane" style={{ background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
      <div className="login-form-box" style={{ position: 'relative', zIndex: 10 }}>
        {/* STEP 1: Registration Form */}
        {registerStep === 'form' && (
          <>
            <h2 className="login-title">Buat Akun</h2>
            <p className="login-desc">Daftar untuk mulai memantau armada &amp; palka TEMBOX.</p>

            {registerErrorMsg && (
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
                {registerErrorMsg}
              </div>
            )}

            <form onSubmit={onRegisterFormSubmit}>
              {/* 1. Nama Lengkap */}
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
                    value={registerFullName}
                    onChange={(e) => setRegisterFullName(e.target.value)}
                  />
                </div>
              </div>

              {/* 2. Alamat Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="regEmail">
                  Alamat Email
                </label>
                <div className="input-icon-wrap">
                  <Mail size={16} className="input-icon" />
                  <input
                    type="email"
                    id="regEmail"
                    className="form-input"
                    placeholder="alamat@email.com"
                    required
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* 3. Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="regPassword">
                  Password
                </label>
                <div className="input-icon-wrap">
                  <Lock size={16} className="input-icon" />
                  <input
                    type={showRegisterPassword ? 'text' : 'password'}
                    id="regPassword"
                    className="form-input"
                    placeholder="Min. 8 karakter (huruf &amp; angka)"
                    required
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    tabIndex={-1}
                  >
                    {showRegisterPassword ? 'Sembunyikan' : 'Lihat'}
                  </button>
                </div>
              </div>

              {/* 4. Konfirmasi Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="regConfirmPassword">
                  Konfirmasi Password
                </label>
                <div className="input-icon-wrap">
                  <Lock size={16} className="input-icon" />
                  <input
                    type={showRegisterPassword ? 'text' : 'password'}
                    id="regConfirmPassword"
                    className="form-input"
                    placeholder="Ulangi password Anda"
                    required
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* 5. Google reCAPTCHA v2 Checkbox Widget */}
              <div style={{ margin: '14px 0 16px', display: 'flex', justifyContent: 'center' }}>
                <ReCAPTCHA
                  sitekey={siteKey}
                  onChange={(token) => setRegisterRecaptchaToken(token || '')}
                  onExpired={() => setRegisterRecaptchaToken('')}
                />
              </div>

              {/* 6. Terms & Conditions */}
              <div className="form-row-actions" style={{ marginBottom: '16px' }}>
                <label className="remember-label">
                  <input
                    type="checkbox"
                    className="remember-checkbox"
                    checked={registerTerms}
                    onChange={(e) => setRegisterTerms(e.target.checked)}
                    required
                  />
                  <span style={{ fontSize: '12px' }}>
                    Saya menyetujui syarat &amp; ketentuan TEMBOX
                  </span>
                </label>
              </div>

              {/* Submit Button (Disabled until reCAPTCHA checked) */}
              <button
                type="submit"
                className="btn-login-submit"
                disabled={registerLoading || !registerRecaptchaToken}
                style={{
                  opacity: registerLoading || !registerRecaptchaToken ? 0.6 : 1,
                  cursor: registerLoading || !registerRecaptchaToken ? 'not-allowed' : 'pointer',
                }}
              >
                {registerLoading ? 'Memproses Pendaftaran...' : 'Daftar Sekarang'}
              </button>
            </form>
          </>
        )}

        {/* STEP 2: 6-Digit Email OTP Verification */}
        {registerStep === 'otp' && (
          <>
            <h2 className="login-title">Verifikasi Email</h2>
            <p className="login-desc">
              Kode OTP 6-digit telah dikirim ke <strong>{registerEmail}</strong>. Masukkan kode tersebut untuk mengaktifkan akun Anda.
            </p>

            {registerOtpError && (
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
                {registerOtpError}
              </div>
            )}

            <form onSubmit={onVerifyOtpSubmit}>
              <div style={{ margin: '20px 0 24px' }}>
                <OtpInput
                  value={registerOtp}
                  onChange={setRegisterOtp}
                  error={registerOtpError}
                  onResend={handleResendOtp}
                />
              </div>

              <button
                type="submit"
                className="btn-login-submit"
                disabled={registerLoading || registerOtp.length < 6}
                style={{
                  opacity: registerLoading || registerOtp.length < 6 ? 0.6 : 1,
                  cursor: registerLoading || registerOtp.length < 6 ? 'not-allowed' : 'pointer',
                }}
              >
                {registerLoading ? 'Memverifikasi...' : 'Verifikasi & Aktifkan Akun'}
              </button>
            </form>

            <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '12.5px', color: '#64748B' }}>
              Tidak menerima kode?{' '}
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={registerLoading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0284C7',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '12.5px',
                }}
              >
                Kirim Ulang OTP
              </button>
              <div style={{ marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setRegisterStep('form')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    fontSize: '12px',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Ubah Alamat Email
                </button>
              </div>
            </div>
          </>
        )}

        {/* STEP 3: Success Screen */}
        {registerStep === 'success' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '50%', backgroundColor: '#F0FDF4', color: '#16A34A', marginBottom: '16px' }}>
              <CheckCircle size={36} color="#16A34A" />
            </div>
            <h2 className="login-title" style={{ marginBottom: '8px' }}>Akun Berhasil Aktif!</h2>
            <p className="login-desc" style={{ marginBottom: '24px' }}>
              Selamat datang di sistem TEMBOX. Anda sedang dialihkan ke dashboard...
            </p>
            <Link href="/dashboard" className="btn-login-submit" style={{ display: 'inline-block', textDecoration: 'none' }}>
              Buka Dashboard
            </Link>
          </div>
        )}

        <p className="auth-switch-text" style={{ marginTop: '20px' }}>
          Sudah punya akun?{' '}
          {onNavigateLogin ? (
            <a
              href="/login"
              onClick={(e) => {
                e.preventDefault();
                onNavigateLogin();
              }}
              className="auth-switch-link"
            >
              Masuk di sini
            </a>
          ) : (
            <Link href="/login" className="auth-switch-link">
              Masuk di sini
            </Link>
          )}
        </p>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          {onBackHome ? (
            <button type="button" onClick={onBackHome} className="auth-back-link">
              <ArrowLeft size={14} />
              <span>Kembali ke Beranda</span>
            </button>
          ) : (
            <Link href="/" className="auth-back-link">
              <ArrowLeft size={14} />
              <span>Kembali ke Beranda</span>
            </Link>
          )}
        </div>
      </div>
      <AuthBottomWaves />
    </div>
  );

  if (hideLeftPane) {
    return rightFormPane;
  }

  return (
    <div className="login-view-wrapper" style={{ display: 'flex' }}>
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
            Sistem IoT monitoring palka ikan &amp; cold-chain maritim cerdas.
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
