'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Box,
  ArrowRight,
  X,
} from './Icons';

interface OrderItem {
  id?: string;
  name: string;
  quantity: number;
  price: number;
  variant?: string;
}

interface OrderRecord {
  id: string;
  order_code: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone?: string;
  shipping_address?: {
    fullName?: string;
    phone?: string;
    streetAddress?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    harborOrTpi?: string;
  };
  items: OrderItem[];
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'cancelled' | 'expired';
  payment_method?: string;
  paid_at?: string;
  created_at: string;
}

export const RiwayatPembelianView: React.FC = () => {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json().catch(() => ({}));
      if (res.ok && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const totalPaidOrders = orders.filter((o) => o.payment_status === 'paid').length;
  const totalUnits = orders
    .filter((o) => o.payment_status === 'paid')
    .reduce((acc, o) => acc + (o.items || []).reduce((s, it) => s + (Number(it.quantity) || 1), 0), 0);
  const totalExpenditure = orders
    .filter((o) => o.payment_status === 'paid')
    .reduce((acc, o) => acc + Number(o.total_amount || 0), 0);

  const formatRupiah = (val: number) => {
    return 'Rp ' + Number(val || 0).toLocaleString('id-ID');
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 700,
              backgroundColor: '#F0FDF4',
              color: '#16A34A',
              border: '1px solid #BBF7D0',
            }}
          >
            <CheckCircle size={12} color="#16A34A" />
            Lunas
          </span>
        );
      case 'pending':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 700,
              backgroundColor: '#FFFBEB',
              color: '#D97706',
              border: '1px solid #FDE68A',
            }}
          >
            <Clock size={12} color="#D97706" />
            Menunggu Pembayaran
          </span>
        );
      default:
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 700,
              backgroundColor: '#FEF2F2',
              color: '#DC2626',
              border: '1px solid #FECACA',
            }}
          >
            <AlertTriangle size={12} color="#DC2626" />
            Batal / Gagal
          </span>
        );
    }
  };

  return (
    <div style={{ width: '100%', boxSizing: 'border-box' }}>
      {/* Header Title & Actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderBottom: '1px solid #E2E8F0',
          paddingBottom: '20px',
          marginBottom: '24px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>
            Riwayat Pembelian Unit
          </h2>
          <p style={{ fontSize: '13.5px', color: '#64748B', margin: 0 }}>
            Daftar pesanan hardware IoT TEMBOX, invoice pembayaran, dan rincian aktivasi armada palka Anda.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={fetchOrders}
            disabled={loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              color: '#475569',
              fontSize: '13px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Segarkan</span>
          </button>
          <Link
            href="/market"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: '#0284C7',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            <span>+ Pesan Unit Baru</span>
          </Link>
        </div>
      </div>

      {/* Summary KPI Strip - Clean Hairline Dividers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          borderBottom: '1px solid #E2E8F0',
          paddingBottom: '24px',
          marginBottom: '24px',
        }}
      >
        <div style={{ borderRight: '1px solid #E2E8F0', paddingRight: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Pesanan Berhasil
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
            {totalPaidOrders}
          </div>
        </div>
        <div style={{ borderRight: '1px solid #E2E8F0', paddingRight: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Unit IoT Aktif
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0284C7', marginTop: '4px' }}>
            {totalUnits} Unit
          </div>
        </div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Investasi Rantai Dingin
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#15803D', marginTop: '4px' }}>
            {formatRupiah(totalExpenditure)}
          </div>
        </div>
      </div>

      {/* Orders List / Table */}
      {loading ? (
        <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748B', fontSize: '14px' }}>
          Memuat riwayat transaksi...
        </div>
      ) : orders.length === 0 ? (
        /* Empty State (No dummy data) */
        <div
          style={{
            padding: '56px 24px',
            textAlign: 'center',
            backgroundColor: '#F8FAFC',
            border: '1px dashed #CBD5E1',
            borderRadius: '12px',
          }}
        >
          <Box size={40} color="#94A3B8" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px 0' }}>
            Belum Ada Transaksi Pembelian
          </h3>
          <p style={{ fontSize: '13.5px', color: '#64748B', maxWidth: '440px', margin: '0 auto 20px', lineHeight: 1.6 }}>
            Pesanan unit IoT TEMBOX yang Anda beli melalui katalog produk akan tercatat secara otomatis di sini lengkap dengan nomor invoice dan panduan pairing.
          </p>
          <Link
            href="/market"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 20px',
              borderRadius: '9999px',
              backgroundColor: '#0284C7',
              color: '#FFFFFF',
              fontSize: '13.5px',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            <span>Lihat Katalog Produk &rarr;</span>
          </Link>
        </div>
      ) : (
        /* Orders Hairline Table */
        <div style={{ overflowX: 'auto', border: '1px solid #E2E8F0', borderRadius: '10px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '12px 18px', fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  No. Invoice
                </th>
                <th style={{ padding: '12px 18px', fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  Tanggal
                </th>
                <th style={{ padding: '12px 18px', fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  Rincian Unit
                </th>
                <th style={{ padding: '12px 18px', fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  Total
                </th>
                <th style={{ padding: '12px 18px', fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  Status
                </th>
                <th style={{ padding: '12px 18px', fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', textAlign: 'right' }}>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord, idx) => {
                const totalUnitsCount = (ord.items || []).reduce(
                  (sum, it) => sum + (Number(it.quantity) || 1),
                  0
                );
                return (
                  <tr
                    key={ord.id || ord.order_code || idx}
                    style={{
                      borderBottom: idx < orders.length - 1 ? '1px solid #E2E8F0' : 'none',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <td style={{ padding: '14px 18px', fontSize: '13px', fontWeight: 700, color: '#0F172A', fontFamily: 'monospace' }}>
                      {ord.order_code}
                    </td>
                    <td style={{ padding: '14px 18px', fontSize: '13px', color: '#64748B' }}>
                      {formatDate(ord.created_at)}
                    </td>
                    <td style={{ padding: '14px 18px', fontSize: '13px', color: '#0F172A' }}>
                      <div>
                        {(ord.items || []).map((it, i) => (
                          <div key={i} style={{ fontSize: '13px', fontWeight: 600 }}>
                            {it.name} <span style={{ color: '#0284C7', fontWeight: 700 }}>({it.quantity}x)</span>
                          </div>
                        ))}
                        {ord.shipping_address?.city && (
                          <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                            Tujuan: {ord.shipping_address.city}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px', fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>
                      {formatRupiah(ord.total_amount)}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      {getStatusBadge(ord.payment_status)}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(ord)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid #E2E8F0',
                          backgroundColor: '#F8FAFC',
                          color: '#0284C7',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Detail &amp; Panduan
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Detail Modal / Activation Guide */}
      {selectedOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
            boxSizing: 'border-box',
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              maxWidth: '560px',
              width: '100%',
              padding: '28px',
              boxSizing: 'border-box',
              border: '1px solid #E2E8F0',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px', marginBottom: '18px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>
                  Rincian Pesanan #{selectedOrder.order_code}
                </h3>
                <span style={{ fontSize: '12px', color: '#64748B' }}>
                  Dipesan pada {formatDate(selectedOrder.created_at)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#64748B' }}>Status Pembayaran:</span>
                <div>{getStatusBadge(selectedOrder.payment_status)}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#64748B' }}>Nama Penerima:</span>
                <strong>{selectedOrder.buyer_name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#64748B' }}>Nomor Telepon:</span>
                <span>{selectedOrder.buyer_phone || '-'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ color: '#64748B' }}>Total Pembayaran:</span>
                <strong style={{ color: '#0284C7', fontSize: '15px' }}>
                  {formatRupiah(selectedOrder.total_amount)}
                </strong>
              </div>

              {/* Items List */}
              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '12px', marginBottom: '16px' }}>
                <span style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Unit yang Dipesan:
                </span>
                {(selectedOrder.items || []).map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                    <span>{it.name} ({it.quantity}x)</span>
                    <span>Rp {Number(it.price * it.quantity).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>

              {/* Activation Instructions */}
              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '14px', marginBottom: '20px' }}>
                <strong style={{ display: 'block', color: '#071A27', marginBottom: '6px', fontSize: '13px' }}>
                  Panduan Menghubungkan Box ke Akun:
                </strong>
                <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', color: '#475569', lineHeight: 1.6 }}>
                  <li>Nyalakan unit box fisik TEMBOX dengan aki kapal 12V DC.</li>
                  <li>Lihat <strong>Device ID</strong> dan <strong>6-Digit PIN</strong> di layar LCD 1602 box.</li>
                  <li>Masuk ke menu <strong>Pengaturan &gt; Tambah Perangkat</strong> di akun ini dan masukkan kode tersebut.</li>
                </ol>
              </div>

              <div style={{ textAlign: 'right' }}>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiwayatPembelianView;
