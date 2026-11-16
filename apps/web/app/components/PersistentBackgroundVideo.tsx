'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export const PersistentBackgroundVideo: React.FC = () => {
  const pathname = usePathname() || '/';
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [canLoadVideo, setCanLoadVideo] = useState(false);

  const isAuth =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot-password');

  // Dedicated Hero background video is rendered in App.tsx for Home.
  // Persistent video provides fluid background for auth pages (login, register, forgot-password).
  const isVisible = isAuth;

  // Defer video loading & respect Data-Saver mode
  useEffect(() => {
    if (!isVisible || typeof window === 'undefined') return;

    const nav = navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } };
    const isSaveData = nav?.connection?.saveData === true;
    const isSlow = nav?.connection?.effectiveType === '2g' || nav?.connection?.effectiveType === 'slow-2g';
    if (isSaveData || isSlow) {
      return; // Never load heavy video on data-saver or 2g connections
    }

    const timer = setTimeout(() => {
      setCanLoadVideo(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [isVisible]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !canLoadVideo) return;

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
  }, [isVisible, canLoadVideo]);

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
        preload="none"
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
        {canLoadVideo && <source src="/Nelayan-kapal-Horizontal.mp4" type="video/mp4" />}
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
