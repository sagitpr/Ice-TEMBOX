import React from 'react';

export default function AboutLoading() {
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
      <div style={{ width: '100%', maxWidth: '920px' }}>
        {/* Eyebrow */}
        <div
          className="skeleton-wave"
          style={{
            height: '20px',
            width: '140px',
            borderRadius: '9999px',
            marginBottom: '20px',
            border: '1px solid rgba(125, 220, 232, 0.2)',
          }}
        />

        {/* Hero Title */}
        <div
          className="skeleton-wave"
          style={{
            height: '48px',
            width: '85%',
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
            width: '95%',
            borderRadius: '6px',
            marginBottom: '12px',
          }}
        />
        <div
          className="skeleton-wave"
          style={{
            height: '18px',
            width: '75%',
            borderRadius: '6px',
            marginBottom: '48px',
          }}
        />

        {/* Profile Card Skeleton */}
        <div
          className="skeleton-wave"
          style={{
            height: '340px',
            width: '100%',
            borderRadius: '20px',
            border: '1px solid rgba(125, 220, 232, 0.15)',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.3)',
          }}
        />
      </div>
    </div>
  );
}

