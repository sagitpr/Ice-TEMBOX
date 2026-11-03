import React from 'react';

export default function Loading() {
  return (
    <div
      className="min-h-screen w-full flex flex-col justify-center items-center px-6 py-20"
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '80px 24px',
        backgroundColor: '#071A27',
      }}
    >
      {/* Skeleton Header / Badge */}
      <div
        className="skeleton-wave"
        style={{
          height: '24px',
          width: '192px',
          borderRadius: '9999px',
          marginBottom: '24px',
          border: '1px solid rgba(125, 220, 232, 0.15)',
        }}
      />

      {/* Skeleton Judul Utama Baris 1 */}
      <div
        className="skeleton-wave"
        style={{
          height: '46px',
          width: '85%',
          maxWidth: '680px',
          borderRadius: '12px',
          marginBottom: '16px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      />

      {/* Skeleton Judul Utama Baris 2 */}
      <div
        className="skeleton-wave"
        style={{
          height: '46px',
          width: '60%',
          maxWidth: '480px',
          borderRadius: '12px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      />

      {/* Skeleton Deskripsi Paragraf Baris 1 */}
      <div
        className="skeleton-wave"
        style={{
          height: '16px',
          width: '92%',
          maxWidth: '540px',
          borderRadius: '6px',
          marginBottom: '10px',
          border: '1px solid rgba(255, 255, 255, 0.03)',
        }}
      />

      {/* Skeleton Deskripsi Paragraf Baris 2 */}
      <div
        className="skeleton-wave"
        style={{
          height: '16px',
          width: '78%',
          maxWidth: '460px',
          borderRadius: '6px',
          marginBottom: '44px',
          border: '1px solid rgba(255, 255, 255, 0.03)',
        }}
      />

      {/* Skeleton Grid Kartu Konten */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          width: '100%',
          maxWidth: '896px',
        }}
      >
        <div
          className="skeleton-wave"
          style={{
            height: '180px',
            borderRadius: '18px',
            border: '1px solid rgba(125, 220, 232, 0.12)',
            padding: '24px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
          }}
        />
        <div
          className="skeleton-wave"
          style={{
            height: '180px',
            borderRadius: '18px',
            border: '1px solid rgba(125, 220, 232, 0.12)',
            padding: '24px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
          }}
        />
      </div>
    </div>
  );
}
