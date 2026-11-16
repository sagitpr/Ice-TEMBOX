'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PublicHeader } from '../../components/ui/PublicHeader';
import { useCheckoutLogic } from '../../modules/market/useCheckoutLogic';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const requestedProduct = searchParams.get('product') || 'pro';

  const {
    product,
    setSelectedProductId,
    quantity,
    setQuantity,
    shippingAddress,
    updateAddressField,
    shippingCost,
    calculatingShipping,
    subtotal,
    totalAmount,
    submittingOrder,
    orderError,
    authChecking,
    isLoggedIn,
    handlePlaceOrder,
  } = useCheckoutLogic(requestedProduct);

  const formatRupiah = (val: number) => {
    return 'Rp ' + val.toLocaleString('id-ID');
  };

  if (authChecking || !isLoggedIn) {
    return (
      <div style={{ backgroundColor: '#071A27', color: '#E2E8F0', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <PublicHeader />
        <main style={{ padding: '80px 20px', textAlign: 'center', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ maxWidth: '420px', padding: '32px 24px', background: '#0B2D42', borderRadius: '16px', border: '1px solid rgba(125, 220, 232, 0.25)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
              Memeriksa Sesi Pengguna
            </h2>
            <p style={{ fontSize: '13.5px', color: '#94A3B8', margin: 0, lineHeight: 1.6 }}>
              Mengalihkan ke halaman masuk untuk memverifikasi akun Anda...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#071A27', color: '#E2E8F0', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Consistent Public Header */}
      <PublicHeader />

      {/* Main Checkout Area - Open 2-column layout */}
      <main style={{ padding: '48px 20px 88px 20px', flex: 1 }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          {/* Header Title */}
          <div style={{ marginBottom: '36px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '20px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 8px 0' }}>
              Checkout Pesanan
            </h1>
            <p style={{ fontSize: '14.5px', color: '#94A3B8', margin: 0 }}>
              Konfirmasi data armada kapal Anda dan lanjutkan ke portal pembayaran aman DOKU Checkout.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
              alignItems: 'start',
            }}
          >
            {/* Left Column: Form Pengiriman & Pembayaran DOKU */}
            <div>
              <form onSubmit={handlePlaceOrder} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
                {/* 1. Pilih Varian */}
                <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '28px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7DDCE8', marginBottom: '14px' }}>
                    1. Varian Perangkat
                  </label>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {(['mini', 'pro', 'enterprise'] as const).map((vId) => {
                      const isSel = product.id === vId;
                      return (
                        <button
                          key={vId}
                          type="button"
                          onClick={() => setSelectedProductId(vId)}
                          style={{
                            padding: '10px 18px',
                            borderRadius: '10px',
                            border: isSel ? '1.5px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.12)',
                            backgroundColor: isSel ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                            color: isSel ? '#38BDF8' : '#CBD5E1',
                            fontWeight: isSel ? 700 : 500,
                            fontSize: '13.5px',
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          TEMBOX {vId}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Informasi Pengiriman */}
                <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7DDCE8', margin: 0 }}>
                    2. Data Pengiriman
                  </label>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                      Nama Penerima <span style={{ color: '#38BDF8' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      placeholder="Nama lengkap penerima / pemilik armada"
                      value={shippingAddress.fullName}
                      onChange={(e) => updateAddressField('fullName', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        backgroundColor: '#071A27',
                        color: '#FFFFFF',
                        fontSize: '13.5px',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                        Nomor WhatsApp <span style={{ color: '#38BDF8' }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        autoComplete="off"
                        placeholder="Contoh: 081234567890"
                        value={shippingAddress.phone}
                        onChange={(e) => updateAddressField('phone', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          backgroundColor: '#071A27',
                          color: '#FFFFFF',
                          fontSize: '13.5px',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                        Kota / Pelabuhan <span style={{ color: '#38BDF8' }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        autoComplete="off"
                        placeholder="Contoh: Tasikmalaya / Cilacap"
                        value={shippingAddress.city}
                        onChange={(e) => updateAddressField('city', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          backgroundColor: '#071A27',
                          color: '#FFFFFF',
                          fontSize: '13.5px',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                      Alamat Lengkap <span style={{ color: '#38BDF8' }}>*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      autoComplete="off"
                      placeholder="Nama jalan, nomor rumah, atau dermaga TPI tempat bersandar kapal..."
                      value={shippingAddress.streetAddress}
                      onChange={(e) => updateAddressField('streetAddress', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        backgroundColor: '#071A27',
                        color: '#FFFFFF',
                        fontSize: '13.5px',
                        outline: 'none',
                        resize: 'vertical',
                      }}
                    />
                  </div>
                </div>

                {/* 3. Metode Pembayaran DOKU Gateway */}
                <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '28px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7DDCE8', marginBottom: '16px' }}>
                    3. Saluran Pembayaran Resmi
                  </label>

                  <div
                    style={{
                      backgroundColor: 'rgba(11, 45, 66, 0.25)',
                      borderRadius: '14px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontSize: '14.5px', fontWeight: 700, color: '#FFFFFF' }}>
                        DOKU Checkout Gateway
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#38BDF8', backgroundColor: 'rgba(56, 189, 248, 0.12)', padding: '3px 8px', borderRadius: '6px' }}>
                        Terverifikasi Otomatis
                      </span>
                    </div>

                    <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.6, margin: '0 0 14px 0' }}>
                      Pilih metode pembayaran favorit Anda di halaman pembayaran DOKU: QRIS (GoPay, OVO, Dana, ShopeePay), Virtual Account Bank (BCA, BRI, Mandiri, BNI, Permata), atau Kartu.
                    </p>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {['QRIS Instan', 'BCA VA', 'BRI VA', 'Mandiri VA', 'BNI VA', 'Kartu Debit/Kredit'].map((channel) => (
                        <span
                          key={channel}
                          style={{
                            fontSize: '11.5px',
                            color: '#CBD5E1',
                            backgroundColor: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            padding: '4px 10px',
                            borderRadius: '6px',
                          }}
                        >
                          {channel}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {orderError && (
                  <div
                    style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      color: '#FCA5A5',
                      fontSize: '13.5px',
                    }}
                  >
                    {orderError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submittingOrder}
                  style={{
                    backgroundColor: '#0284C7',
                    color: '#FFFFFF',
                    fontSize: '15.5px',
                    fontWeight: 700,
                    padding: '15px 28px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: submittingOrder ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
                    opacity: submittingOrder ? 0.75 : 1,
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!submittingOrder) e.currentTarget.style.backgroundColor = '#0369A1';
                  }}
                  onMouseLeave={(e) => {
                    if (!submittingOrder) e.currentTarget.style.backgroundColor = '#0284C7';
                  }}
                >
                  {submittingOrder ? 'Menghubungkan ke DOKU Payment...' : 'Lanjut ke Pembayaran →'}
                </button>
              </form>
            </div>

            {/* Right Column: Ringkasan Pesanan (Simplified Open Summary) */}
            <div
              style={{
                position: 'sticky',
                top: '90px',
                padding: '24px 0',
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 20px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
                Ringkasan Pesanan
              </h3>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  width={72}
                  height={60}
                  style={{ width: '72px', height: '60px', objectFit: 'contain' }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                    {product.name}
                  </h4>
                  <p style={{ fontSize: '13px', color: '#7DDCE8', margin: '3px 0 0 0', fontWeight: 600 }}>
                    {formatRupiah(product.price)} / unit
                  </p>
                </div>
              </div>

              {/* Quantity Changer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  marginBottom: '20px',
                }}
              >
                <span style={{ fontSize: '13.5px', color: '#CBD5E1' }}>Jumlah Unit</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      fontSize: '16px',
                      cursor: 'pointer',
                    }}
                  >
                    -
                  </button>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', minWidth: '24px', textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      fontSize: '16px',
                      cursor: 'pointer',
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Cost Calculations */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: '#94A3B8' }}>
                  <span>Subtotal ({quantity} unit)</span>
                  <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{formatRupiah(subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: '#94A3B8' }}>
                  <span>Ongkos Kirim</span>
                  <span style={{ color: '#FFFFFF', fontWeight: 600 }}>
                    {calculatingShipping ? 'Menghitung...' : formatRupiah(shippingCost)}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '16px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    paddingTop: '14px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <span>Total</span>
                  <span style={{ color: '#38BDF8' }}>{formatRupiah(totalAmount)}</span>
                </div>
              </div>

              <p style={{ fontSize: '12.5px', color: '#94A3B8', lineHeight: 1.5, margin: 0 }}>
                Setelah menekan tombol Lanjut ke Pembayaran, Anda akan dialihkan secara aman ke halaman DOKU Checkout untuk menyelesaikan transaksi.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', color: '#94A3B8' }}>Memuat halaman checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
