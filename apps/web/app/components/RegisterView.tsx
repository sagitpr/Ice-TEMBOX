'use client';

import React from 'react';
import Link from 'next/link';
import { User, Mail, Lock, ArrowLeft, CheckCircle, ShieldCheck } from './Icons';
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
    googleToken,
    googleEmail,
    registerFullName,
    setRegisterFullName,
    registerPassword,
    setRegisterPassword,
    registerConfirmPassword,
    setRegisterConfirmPassword,
    showRegisterPassword,
    setShowRegisterPassword,
    registerTerms,
    setRegisterTerms,
    registerLoading,
    registerErrorMsg,
    handleInitiateGoogleVerification,
    handleRegisterSubmit,
  } = useAuthLogic();

  const onSubmitStep2 = (e: React.FormEvent) => {
    handleRegisterSubmit(e, onSuccess);
  };

  const rightFormPane = (
    <div className="login-right-pane" style={{ background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
      <div className="login-form-box" style={{ position: 'relative', zIndex: 10 }}>
        {/* Error Banner */}
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

        {/* STEP 1: Verify Google Identity First */}
        {!googleToken ? (
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '9999px', background: '#F0F9FF', border: '1px solid #BAE6FD', color: '#0284C7', fontSize: '11px', fontWeight: 700, marginBottom: '12px' }}>
              <ShieldCheck size={14} color="#0284C7" />
              <span>Langkah 1 dari 2 &bull; Verifikasi Identitas</span>
            </div>

            <h2 className="login-title">Daftar Akun Baru</h2>
            <p className="login-desc" style={{ marginBottom: '20px' }}>
              Verifikasi kepemilikan akun Google Anda untuk mengikat identitas resmi armada sebelum membuat password.
            </p>

            <button
              type="button"
              onClick={handleInitiateGoogleVerification}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '12px 18px',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #CBD5E1',
                color: '#0F172A',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z" />
                <path fill="#FBBC05" d="M5.28 14.27a7.18 7.18 0 0 1 0-4.54V6.58H1.25a11.98 11.98 0 0 0 0 10.84l4.03-3.15Z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
              </svg>
              <span>Verifikasi Email Google Anda</span>
            </button>

            <div style={{ marginTop: '16px', padding: '12px', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: '11.5px', color: '#64748B', lineHeight: 1.5 }}>
              <strong>Mengapa verifikasi Google?</strong> Verifikasi menjamin validitas identitas pemilik armada. Setelah terikat, Anda dapat login harian murni dengan Email & Password tanpa login pihak ketiga.
            </div>
          </div>
        ) : (
          /* STEP 2: Create Password with Locked Google Email */
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '9999px', background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#166534', fontSize: '11px', fontWeight: 700, marginBottom: '12px' }}>
              <CheckCircle size={14} color="#16A34A" />
              <span>Langkah 2 dari 2 &bull; Buat Password Aplikasi</span>
            </div>

            <h2 className="login-title">Lengkapi Pendaftaran</h2>
            <p className="login-desc" style={{ marginBottom: '16px' }}>
              Email Google Anda telah terverifikasi. Tentukan nama dan password login aplikasi Anda.
            </p>

            {/* Google Verified Card */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#16A34A" />
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#14532D', display: 'block' }}>
                    Google Terverifikasi
                  </span>
                  <span style={{ fontSize: '11.5px', color: '#166534', fontFamily: 'monospace' }}>
                    {googleEmail}
                  </span>
                </div>
              </div>
              <span style={{ fontSize: '10.5px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: '#DCFCE7', color: '#15803D' }}>
                Terkunci
              </span>
            </div>

            <form onSubmit={onSubmitStep2}>
              {/* Locked Email Input */}
              <div className="form-group">
                <label className="form-label" htmlFor="regEmail">
                  Email Akun (Terkunci)
                </label>
                <div className="input-icon-wrap">
                  <Mail size={16} className="input-icon" />
                  <input
                    type="email"
                    id="regEmail"
                    className="form-input"
                    value={googleEmail}
                    readOnly
                    disabled
                    style={{ backgroundColor: '#F8FAFC', color: '#64748B', cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              {/* Full Name */}
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
                    placeholder="Nama Lengkap Pemilik / Operator"
                    required
                    value={registerFullName}
                    onChange={(e) => setRegisterFullName(e.target.value)}
                  />
                </div>
              </div>

              {/* New Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="regPassword">
                  Password Aplikasi
                </label>
                <div className="input-icon-wrap">
                  <Lock size={16} className="input-icon" />
                  <input
                    type={showRegisterPassword ? 'text' : 'password'}
                    id="regPassword"
                    className="form-input"
                    placeholder="Min. 8 karakter (huruf & angka)"
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

              {/* Confirm Password */}
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
                    placeholder="Ulangi password aplikasi"
                    required
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
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

              <button type="submit" className="btn-login-submit" disabled={registerLoading}>
                {registerLoading ? 'Mendaftarkan Akun...' : 'Selesaikan Pendaftaran & Buat Akun'}
              </button>
            </form>
          </div>
        )}

        <p className="auth-switch-text" style={{ marginTop: '20px' }}>
          Sudah punya akun terdaftar?{' '}
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
