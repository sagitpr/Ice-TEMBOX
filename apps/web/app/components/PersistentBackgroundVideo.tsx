'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export const PersistentBackgroundVideo: React.FC = () => {
  const pathname = usePathname() || '/';

  // Determine which routes utilize the maritime background video
  const isHome = pathname === '/' || pathname === '';
  const isAuth =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot-password');

  // Video is active and visible on Home and Auth pages
  const isVisible = isHome || isAuth;

  return (
    <div
      id="persistent-video-container"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.35s ease',
        willChange: 'opacity',
        backgroundColor: '#071A27',
      }}
    >
      <video
        id="persistent-marine-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/hero-boat.jpg"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: isAuth ? 'center' : '72% 52%',
          opacity: isAuth ? 0.45 : 0.92,
          filter: isAuth
            ? 'saturate(1.2) contrast(1.1)'
            : 'brightness(0.98) contrast(1.0) saturate(1.02)',
          transition: 'opacity 0.3s ease, object-position 0.3s ease',
          willChange: 'transform, opacity',
          transform: 'translateZ(0)',
          pointerEvents: 'none',
        }}
      >
        <source src="/Nelayan-kapal-Horizontal.mp4" type="video/mp4" />
      </video>

      {/* Atmospheric gradient overlay for optimal readability */}
      <div
        id="persistent-video-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          background: isAuth
            ? 'linear-gradient(135deg, rgba(7, 26, 39, 0.88) 0%, rgba(11, 45, 66, 0.8) 100%)'
            : 'linear-gradient(180deg, rgba(11, 45, 66, 0.15) 0%, rgba(11, 45, 66, 0.45) 60%, rgba(7, 26, 39, 0.75) 100%)',
          transition: 'background 0.35s ease',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default PersistentBackgroundVideo;

