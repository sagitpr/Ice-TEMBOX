'use client';

import React from 'react';
import Link from 'next/link';
import { User, Lock, ArrowLeft } from './Icons';
import { useAuthLogic } from '../../hooks/useAuthLogic';
import AuthBottomWaves from '../../components/ui/AuthBottomWaves';

interface LoginViewProps {
  onSuccess?: () => void;
  onNavigateRegister?: () => void;
  onNavigateForgotPassword?: () => void;
  onBackHome?: () => void;
  hideLeftPane?: boolean;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onSuccess,
  onNavigateRegister,
  onNavigateForgotPassword,
  onBackHome,
  hideLeftPane = false,
}) => {
  const {
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    showLoginPassword,
    setShowLoginPassword,
    rememberMe,
    setRememberMe,
    loginLoading,
    handleLoginSubmit,
  } = useAuthLogic();

  const onSubmit = (e: React.FormEvent) => {
    handleLoginSubmit(e, onSuccess);
  };

  const rightFormPane = (
    <div className="login-right-pane" style={{ background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
      <div className="login-form-box" style={{ position: 'relative', zIndex: 10 }}>
        <h2 className="login-title">Selamat Datang</h2>
        <p className="login-desc">Masuk untuk melanjutkan ke sistem TEMBOX.</p>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="loginEmail">
              Email / Username
            </label>
            <div className="input-icon-wrap">
              <User size={16} className="input-icon" />
              <input
                type="text"
                id="loginEmail"
                className="form-input"
                placeholder="Email / Username"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="loginPassword">
              Password
            </label>
            <div className="input-icon-wrap">
              <Lock size={16} className="input-icon" />
              <input
                type={showLoginPassword ? 'text' : 'password'}
                id="loginPassword"
                className="form-input"
                placeholder="Password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
                tabIndex={-1}
              >
                {showLoginPassword ? 'Sembunyikan' : 'Lihat'}
              </button>
            </div>
          </div>

          <div className="form-row-actions">
            <label className="remember-label">
              <input
                type="checkbox"
                className="remember-checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Ingat saya</span>
            </label>
            {onNavigateForgotPassword ? (
              <a
                href="/forgot-password"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateForgotPassword();
                }}
                className="forgot-link"
              >
                Lupa password?
              </a>
            ) : (
              <Link href="/forgot-password" className="forgot-link">
                Lupa password?
              </Link>
            )}
          </div>

          <button type="submit" className="btn-login-submit" disabled={loginLoading}>
            {loginLoading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className="auth-switch-text">
          Belum punya akun?{' '}
          {onNavigateRegister ? (
            <a
              href="/register"
              onClick={(e) => {
                e.preventDefault();
                onNavigateRegister();
              }}
              className="auth-switch-link"
            >
              Daftar sekarang
            </a>
          ) : (
            <Link href="/register" className="auth-switch-link">
              Daftar sekarang
            </Link>
          )}
        </p>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          {onBackHome ? (
            <button
              type="button"
              onClick={onBackHome}
              className="auth-back-link"
            >
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
            Pantau kondisi penyimpanan ikan Anda secara real-time.
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

export default LoginView;
