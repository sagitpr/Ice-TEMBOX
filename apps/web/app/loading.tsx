import React from 'react';

export default function Loading() {
  return (
    <div
      className="min-h-screen w-full flex flex-col justify-center items-center px-6 py-20 animate-pulse"
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '80px 24px',
        backgroundColor: 'rgba(7, 26, 39, 0.95)',
      }}
    >
      {/* Skeleton Header / Badge */}
      <div
        className="h-6 w-48 bg-slate-800/60 rounded-full mb-6"
        style={{
          height: '24px',
          width: '192px',
          backgroundColor: 'rgba(30, 41, 59, 0.6)',
          borderRadius: '9999px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      />

      {/* Skeleton Judul Utama */}
      <div
        className="h-12 w-3/4 max-w-2xl bg-slate-800/80 rounded-xl mb-4"
        style={{
          height: '48px',
          width: '75%',
          maxWidth: '672px',
          backgroundColor: 'rgba(30, 41, 59, 0.8)',
          borderRadius: '12px',
          marginBottom: '16px',
        }}
      />
      <div
        className="h-12 w-1/2 max-w-xl bg-slate-800/80 rounded-xl mb-8"
        style={{
          height: '48px',
          width: '50%',
          maxWidth: '576px',
          backgroundColor: 'rgba(30, 41, 59, 0.8)',
          borderRadius: '12px',
          marginBottom: '32px',
        }}
      />

      {/* Skeleton Deskripsi Paragraf */}
      <div
        className="h-4 w-full max-w-lg bg-slate-800/50 rounded mb-2"
        style={{
          height: '16px',
          width: '100%',
          maxWidth: '512px',
          backgroundColor: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '6px',
          marginBottom: '8px',
        }}
      />
      <div
        className="h-4 w-5/6 max-w-md bg-slate-800/50 rounded mb-10"
        style={{
          height: '16px',
          width: '83.33%',
          maxWidth: '448px',
          backgroundColor: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '6px',
          marginBottom: '40px',
        }}
      />

      {/* Skeleton Grid Kartu Konten */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          width: '100%',
          maxWidth: '896px',
        }}
      >
        <div
          className="h-44 bg-slate-800/40 border border-slate-700/30 rounded-2xl p-6"
          style={{
            height: '176px',
            backgroundColor: 'rgba(30, 41, 59, 0.4)',
            border: '1px solid rgba(51, 65, 85, 0.3)',
            borderRadius: '16px',
            padding: '24px',
          }}
        />
        <div
          className="h-44 bg-slate-800/40 border border-slate-700/30 rounded-2xl p-6"
          style={{
            height: '176px',
            backgroundColor: 'rgba(30, 41, 59, 0.4)',
            border: '1px solid rgba(51, 65, 85, 0.3)',
            borderRadius: '16px',
            padding: '24px',
          }}
        />
      </div>
    </div>
  );
}

