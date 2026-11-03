'use client';

import React from 'react';
import Link from 'next/link';

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

interface AuthShellProps {
  children: React.ReactNode;
  brandTagline?: string;
  footerQuote?: string;
}

export const AuthShell: React.FC<AuthShellProps> = ({
  children,
  brandTagline = 'Ekosistem IoT pemantauan suhu palka es dan rantai dingin maritim.',
  footerQuote = '“Ikan tetap segar, nelayan lebih tenang.”',
}) => {
  return (
    <div className="login-view-wrapper" style={{ display: 'flex' }}>
      {/* Persistent Left Hero Pane with Background Video Backdrop */}
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
            opacity: 0.48,
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
          <p className="login-brand-tagline">{brandTagline}</p>
        </div>

        <div className="login-left-footer" style={{ position: 'relative', zIndex: 10 }}>
          {footerQuote}
        </div>
      </div>

      {/* Right Dynamic Auth Form Content */}
      {children}
    </div>
  );
};

export default AuthShell;

