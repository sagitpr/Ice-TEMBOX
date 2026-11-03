'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, ArrowLeft } from './Icons';

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

interface LoginViewProps {
  onSuccess?: () => void;
  onNavigateRegister?: () => void;
  onNavigateForgotPassword?: () => void;
  onBackHome?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onSuccess,
  onNavigateRegister,
  onNavigateForgotPassword,
  onBackHome,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (onSuccess) {
        onSuccess();
      } else {
        window.location.href = '/dashboard';
      }
    }, 400);
  };

  return (
    <div className="login-view-wrapper" style={{ display: 'flex' }}>
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
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.45,
            filter: 'saturate(1.2) contrast(1.1)',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          <source src={heroVideo} type="video/mp4" />
          <source src="/Nelayan-kapal-Horizontal.mp4" type="video/mp4" />
        </video>
        <div
          className="login-overlay-gradient"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        <div className="login-left-content" style={{ position: 'relative', zIndex: 10 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{
              fontWeight: 800,
              fontSize: '26px',
              letterSpacing: '-0.5px',
              color: '#FFFFFF',
              display: 'block',
              marginBottom: '6px',
              cursor: 'pointer'
            }}>
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

      {/* Right Form Pane */}
      <div className="login-right-pane">
        <div className="login-form-box">
          <h2 className="login-title">Selamat Datang</h2>
          <p className="login-desc">Masuk untuk melanjutkan ke sistem TEMBOX.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="loginEmail">Email / Username</label>
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
              <label className="form-label" htmlFor="loginPassword">Password</label>
              <div className="input-icon-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="loginPassword"
                  className="form-input"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '14px' }}
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

            <div className="form-row-between">
              <label className="checkbox-label">
                <input type="checkbox" id="rememberMe" />
                <span>Ingat saya</span>
              </label>
              <span
                className="form-link"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  if (onNavigateForgotPassword) {
                    onNavigateForgotPassword();
                  } else {
                    window.location.hash = '#/forgot-password';
                  }
                }}
              >
                Lupa password?
              </span>
            </div>

            <button type="submit" className="btn-primary-block" disabled={loading}>
              <span>{loading ? 'Memproses...' : 'Masuk'}</span>
            </button>
          </form>

          <p className="login-footer-text">
            Belum punya akun?{' '}
            {onNavigateRegister ? (
              <button
                type="button"
                onClick={onNavigateRegister}
                className="form-link"
                style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer' }}
              >
                Daftar
              </button>
            ) : (
              <Link href="/register" className="form-link">Daftar</Link>
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
        </div>
      </div>
    </div>
  );
};

export default LoginView;
