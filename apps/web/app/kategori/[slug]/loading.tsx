import React from 'react';

export default function KategoriLoading() {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center px-6 py-16 animate-pulse"
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
          className="h-4 w-40 bg-slate-800/60 rounded mb-8"
          style={{
            height: '16px',
            width: '160px',
            backgroundColor: 'rgba(30, 41, 59, 0.6)',
            borderRadius: '6px',
            marginBottom: '32px',
          }}
        />

        {/* Skeleton Badge */}
        <div
          className="h-6 w-32 bg-slate-800/60 rounded-full mb-4"
          style={{
            height: '24px',
            width: '128px',
            backgroundColor: 'rgba(30, 41, 59, 0.6)',
            borderRadius: '9999px',
            marginBottom: '16px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        />

        {/* Skeleton Judul Kategori */}
        <div
          className="h-10 w-3/4 max-w-xl bg-slate-800/80 rounded-xl mb-4"
          style={{
            height: '40px',
            width: '75%',
            maxWidth: '576px',
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            borderRadius: '12px',
            marginBottom: '16px',
          }}
        />

        {/* Skeleton Ringkasan Paragraf */}
        <div
          className="h-4 w-full bg-slate-800/50 rounded mb-2"
          style={{
            height: '16px',
            width: '100%',
            backgroundColor: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '6px',
            marginBottom: '8px',
          }}
        />
        <div
          className="h-4 w-5/6 bg-slate-800/50 rounded mb-10"
          style={{
            height: '16px',
            width: '83.33%',
            backgroundColor: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '6px',
            marginBottom: '40px',
          }}
        />

        {/* Skeleton Dua Kartu Fitur (Conventional vs TEMBOX) */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-10"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            width: '100%',
            marginBottom: '40px',
          }}
        >
          <div
            className="h-48 bg-slate-800/40 border border-slate-700/30 rounded-2xl p-6"
            style={{
              height: '192px',
              backgroundColor: 'rgba(30, 41, 59, 0.4)',
              border: '1px solid rgba(51, 65, 85, 0.3)',
              borderRadius: '16px',
              padding: '24px',
            }}
          />
          <div
            className="h-48 bg-slate-800/40 border border-slate-700/30 rounded-2xl p-6"
            style={{
              height: '192px',
              backgroundColor: 'rgba(30, 41, 59, 0.4)',
              border: '1px solid rgba(51, 65, 85, 0.3)',
              borderRadius: '16px',
              padding: '24px',
            }}
          />
        </div>

        {/* Skeleton Tags / Commodities */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[80, 96, 72, 110, 88].map((w, i) => (
            <div
              key={i}
              className="h-7 bg-slate-800/50 rounded-lg"
              style={{
                height: '28px',
                width: `${w}px`,
                backgroundColor: 'rgba(30, 41, 59, 0.5)',
                borderRadius: '8px',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

