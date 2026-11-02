'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, ArrowLeft, Check } from './Icons';

interface RegisterViewProps {
  onSuccess?: () => void;
  onNavigateLogin?: () => void;
  onBackHome?: () => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({
  onSuccess,
  onNavigateLogin,
  onBackHome,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Password dan Konfirmasi Password tidak cocok!');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSuccess(true);
    }, 400);
  };

  return (
    <div className="login-view-wrapper" style={{ display: 'flex' }}>
      {/* Left Hero Pane */}
      <div className="login-left-pane">
        <video
          className="login-media-backdrop"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="/src/assets/Video/Nelayan-kapal-Horizontal.mp4" type="video/mp4" />
        </video>
        <div className="login-overlay-gradient" />

        <div className="login-left-content">
          <span style={{
            fontWeight: 800,
            fontSize: '26px',
            letterSpacing: '-0.5px',
            color: '#FFFFFF',
            display: 'block',
            marginBottom: '6px'
          }}>
            TEMBOX<span style={{ color: '#7DDCE8' }}>.</span>
          </span>
          <p className="login-brand-tagline">
            Pantau kondisi penyimpanan ikan Anda secara real-time.
          </p>
        </div>

        <div className="login-left-footer">
          &ldquo;Ikan tetap segar, nelayan lebih tenang.&rdquo;
        </div>
      </div>

      {/* Right Form Pane */}
      <div className="login-right-pane">
        <div className="login-form-box">
          {isSuccess ? (
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
                Akun siap digunakan
              </h3>
              <p style={{ fontSize: '13.5px', color: '#64748B', marginBottom: '24px' }}>
                Silakan masuk untuk melanjutkan ke dashboard.
              </p>
              <button
                type="button"
                className="btn-primary-block"
                onClick={() => {
                  if (onNavigateLogin) onNavigateLogin();
                  else window.location.href = '/login';
                }}
              >
                <span>Masuk ke TEMBOX</span>
              </button>
            </div>
          ) : (
            <>
              <h2 className="login-title">Buat Akun</h2>
              <p className="login-desc">Mulai menggunakan sistem monitoring TEMBOX.</p>

              <form onSubmit={handleSubmit}>
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
                    <input
                      type="email"
                      id="regEmail"
                      className="form-input"
                      placeholder="alamat@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ paddingLeft: '14px' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="regPassword">Password</label>
                  <div className="input-icon-wrap">
                    <input
                      type="password"
                      id="regPassword"
                      className="form-input"
                      placeholder="Minimal 8 karakter"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ paddingLeft: '14px' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="regConfirmPassword">Konfirmasi Password</label>
                  <div className="input-icon-wrap">
                    <input
                      type="password"
                      id="regConfirmPassword"
                      className="form-input"
                      placeholder="Ulangi password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{ paddingLeft: '14px' }}
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
                  <span>{loading ? 'Memproses...' : 'Buat Akun'}</span>
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
                  <Link href="/login" className="form-link">Masuk</Link>
                )}
              </p>

              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                {onBackHome ? (
                  <button
                    type="button"
                    onClick={onBackHome}
                    style={{
                      fontSize: '12.5px',
                      color: '#64748B',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <ArrowLeft size={14} />
                    <span>Kembali ke TEMBOX</span>
                  </button>
                ) : (
                  <Link
                    href="/"
                    style={{
                      fontSize: '12.5px',
                      color: '#64748B',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <ArrowLeft size={14} />
                    <span>Kembali ke TEMBOX</span>
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterView;

