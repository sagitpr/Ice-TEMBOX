'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Lock, ArrowLeft } from './Icons';

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
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const submitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (submitTimerRef.current) clearTimeout(submitTimerRef.current);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (submitTimerRef.current) clearTimeout(submitTimerRef.current);
    submitTimerRef.current = setTimeout(() => {
      setLoading(false);
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/dashboard');
      }
    }, 350);
  };

  const rightFormPane = (
    <div className="login-right-pane" style={{ background: '#FFFFFF' }}>
      <div className="login-form-box">
        <h2 className="login-title">Selamat Datang</h2>
        <p className="login-desc">Masuk untuk melanjutkan ke sistem TEMBOX.</p>

        <form onSubmit={handleSubmit}>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                type={showPassword ? 'text' : 'password'}
                id="loginPassword"
                className="form-input"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? 'Sembunyikan' : 'Lihat'}
              </button>
            </div>
          </div>

          <div className="form-row-actions">
            <label className="remember-label">
              <input type="checkbox" className="remember-checkbox" />
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

          <button type="submit" className="btn-login-submit" disabled={loading}>
            {loading ? 'Memproses...' : 'Masuk'}
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
