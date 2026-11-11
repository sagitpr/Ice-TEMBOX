'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export const PersistentBackgroundVideo: React.FC = () => {
  const pathname = usePathname() || '/';
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const isAuth =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot-password');

  // Dedicated Hero background video is rendered in App.tsx for Home.
  // Persistent video provides fluid background for auth pages (login, register, forgot-password).
  const isVisible = isAuth;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const syncPlayback = () => {
      if (document.hidden || !isVisible) {
        if (!video.paused) {
          video.pause();
        }
      } else {
        if (video.paused) {
          video.play().catch(() => {
            // Autoplay fallback handled by browser policy
          });
        }
      }
    };

    syncPlayback();
    document.addEventListener('visibilitychange', syncPlayback);

    return () => {
      document.removeEventListener('visibilitychange', syncPlayback);
      if (video && !video.paused) {
        video.pause();
      }
    };
  }, [isVisible]);

  return (
    <div
      id="persistent-video-container"
      aria-hidden="true"
      className="pointer-events-none"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden',
        transition: 'opacity 0.35s ease',
        willChange: 'opacity',
        backgroundColor: '#071A27',
      }}
    >
      <video
        ref={videoRef}
        id="persistent-marine-video"
        autoPlay={isVisible}
        muted
        loop
        playsInline
        preload={isVisible ? 'auto' : 'none'}
        poster="/hero-boat.jpg"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          opacity: 0.45,
          filter: 'saturate(1.2) contrast(1.1)',
          transition: 'opacity 0.3s ease',
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
          background: 'linear-gradient(135deg, rgba(7, 26, 39, 0.88) 0%, rgba(11, 45, 66, 0.8) 100%)',
          transition: 'background 0.35s ease',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default PersistentBackgroundVideo;
