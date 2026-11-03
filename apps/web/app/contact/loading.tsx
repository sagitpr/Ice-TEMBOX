import React from 'react';

export default function ContactLoading() {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center px-6 py-24"
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '120px 24px 64px 24px',
        backgroundColor: '#071A27',
      }}
    >
      <div style={{ width: '100%', maxWidth: '860px' }}>
        {/* Eyebrow */}
        <div
          className="skeleton-wave"
          style={{
            height: '20px',
            width: '120px',
            borderRadius: '9999px',
            marginBottom: '20px',
            border: '1px solid rgba(125, 220, 232, 0.2)',
          }}
        />

        {/* Title */}
        <div
          className="skeleton-wave"
          style={{
            height: '44px',
            width: '70%',
            borderRadius: '12px',
            marginBottom: '20px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        />

        {/* Subtitle */}
        <div
          className="skeleton-wave"
          style={{
            height: '18px',
            width: '88%',
            borderRadius: '6px',
            marginBottom: '44px',
          }}
        />

        {/* Contact Form Box Skeleton */}
        <div
          className="skeleton-wave"
          style={{
            height: '420px',
            width: '100%',
            borderRadius: '24px',
            border: '1px solid rgba(125, 220, 232, 0.15)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
          }}
        />
      </div>
    </div>
  );
}

