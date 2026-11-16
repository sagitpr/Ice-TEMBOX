import React from 'react';
import Link from 'next/link';

const logoHorizontal = '/LogoTembox-Horizontal.png';

export const AboutFooter: React.FC = () => {
  return (
    <footer
      className="site-footer"
      style={{
        background: '#071A27',
        color: '#E2E8F0',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <img
              src={logoHorizontal}
              alt="TEMBOX"
              className="footer-logo-img"
              width={130}
              height={34}
              loading="lazy"
              decoding="async"
              style={{ width: '130px', height: '34px', objectFit: 'contain' }}
            />
            <p className="footer-tagline" style={{ color: '#94A3B8' }}>
              Fresh Catch, Better Tomorrow.
            </p>
          </div>

          <div className="footer-nav">
            <Link href="/contact" className="footer-link" style={{ color: '#CBD5E1' }}>
              Contact
            </Link>
            <Link href="/about" className="footer-link" style={{ color: '#7DDCE8' }}>
              About
            </Link>
          </div>

          <div className="footer-socials">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="social-icon-btn"
              aria-label="Instagram"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="social-icon-btn"
              aria-label="YouTube"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="social-icon-btn"
              aria-label="LinkedIn"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-bottom" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <p style={{ color: '#64748B' }}>© 2025 TEMBOX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default AboutFooter;
