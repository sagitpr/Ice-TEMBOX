import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        padding: '24px',
        textAlign: 'center',
        fontFamily: 'var(--font-sans, sans-serif)',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '28px',
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          fontSize: '24px',
          fontWeight: 800,
          color: '#0284C7',
        }}
      >
        404
      </div>
      <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', margin: '0 0 8px 0' }}>
        Halaman Tidak Ditemukan
      </h1>
      <p style={{ fontSize: '13px', color: '#64748B', maxWidth: '380px', margin: '0 0 24px 0', lineHeight: 1.5 }}>
        Halaman yang Anda tuju tidak ditemukan atau URL mungkin telah diperbarui. Silakan kembali ke dashboard utama.
      </p>
      <Link
        href="/dashboard"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '8px 18px',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: 600,
          textDecoration: 'none',
          transition: 'background-color 0.15s ease',
        }}
      >
        Kembali ke Dashboard
      </Link>
    </div>
  );
}
