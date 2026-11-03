import React from 'react';

export default function LoginLoading() {
  return (
    <div
      className="min-h-screen w-full flex flex-col justify-center items-center px-6 py-12"
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '48px 24px',
        backgroundColor: '#071A27',
      }}
    >
      <div
        className="skeleton-wave"
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '520px',
          borderRadius: '24px',
          border: '1px solid rgba(125, 220, 232, 0.18)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)',
        }}
      />
    </div>
  );
}

