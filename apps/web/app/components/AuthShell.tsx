'use client';

import React from 'react';
import Link from 'next/link';

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
      {/* Persistent Left Hero Pane: Video powered by PersistentBackgroundVideo in RootLayout */}
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
