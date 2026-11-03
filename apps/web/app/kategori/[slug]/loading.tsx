import React from 'react';

export default function KategoriLoading() {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center px-6 py-16"
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '64px 24px',
        backgroundColor: '#071A27',
      }}
    >
      <div style={{ width: '100%', maxWidth: '896px' }}>
        {/* Skeleton Breadcrumb */}
        <div
          className="skeleton-wave"
          style={{
            height: '16px',
            width: '160px',
            borderRadius: '6px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        />

        {/* Skeleton Badge */}
        <div
          className="skeleton-wave"
          style={{
            height: '24px',
            width: '130px',
            borderRadius: '9999px',
            marginBottom: '16px',
            border: '1px solid rgba(125, 220, 232, 0.2)',
          }}
        />

        {/* Skeleton Judul Kategori */}
        <div
          className="skeleton-wave"
          style={{
            height: '42px',
            width: '80%',
            maxWidth: '560px',
            borderRadius: '12px',
            marginBottom: '16px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        />

        {/* Skeleton Ringkasan Paragraf */}
        <div
          className="skeleton-wave"
          style={{
            height: '16px',
            width: '100%',
            borderRadius: '6px',
            marginBottom: '10px',
            border: '1px solid rgba(255, 255, 255, 0.03)',
          }}
        />
        <div
          className="skeleton-wave"
          style={{
            height: '16px',
            width: '85%',
            borderRadius: '6px',
            marginBottom: '40px',
            border: '1px solid rgba(255, 255, 255, 0.03)',
          }}
        />

        {/* Skeleton Dua Kartu Fitur (Conventional vs TEMBOX) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            width: '100%',
            marginBottom: '40px',
          }}
        >
          <div
            className="skeleton-wave"
            style={{
              height: '192px',
              borderRadius: '16px',
              border: '1px solid rgba(125, 220, 232, 0.12)',
              padding: '24px',
            }}
          />
          <div
            className="skeleton-wave"
            style={{
              height: '192px',
              borderRadius: '16px',
              border: '1px solid rgba(125, 220, 232, 0.12)',
              padding: '24px',
            }}
          />
        </div>

        {/* Skeleton Tags / Komoditas */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[80, 96, 72, 110, 88].map((w, i) => (
            <div
              key={i}
              className="skeleton-wave"
              style={{
                height: '28px',
                width: `${w}px`,
                borderRadius: '8px',
                border: '1px solid rgba(125, 220, 232, 0.15)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
