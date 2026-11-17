'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  Info,
  Clock,
  ArrowRight,
  Filter,
  VolumeX,
  Trash2,
  Cpu,
  RefreshCw
} from './Icons';
import {
  fetchHeaderNotifications,
  markAllHeaderNotificationsRead,
  clearReadNotifications,
  HeaderNotificationItem
} from '../../lib/services/dashboardService';
import { getSupabaseClient } from '../../modules/supabase/supabaseClient';

interface NotifikasiViewProps {
  onNavigateTab?: (tab: string) => void;
}

interface DeviceOption {
  id: string;
  name: string;
  code: string;
}

export default function NotifikasiView({ onNavigateTab }: NotifikasiViewProps) {
  const [notifications, setNotifications] = useState<HeaderNotificationItem[]>([]);
  const [devices, setDevices] = useState<DeviceOption[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'warning' | 'system'>('all');
  const [selectedDevice, setSelectedDevice] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Load devices
  const loadDevices = useCallback(async () => {
    try {
      const res = await fetch('/api/iot/devices');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.devices)) {
          setDevices(
            data.devices.map((d: any) => ({
              id: d.id,
              name: d.device_name || d.device_code || d.id,
              code: d.device_code || d.id
            }))
          );
        }
      }
    } catch {
      // fallback silent
    }
  }, []);

  // Load notifications
  const loadNotifications = useCallback(async () => {
    try {
      const items = await fetchHeaderNotifications();
      setNotifications(items);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDevices();
    loadNotifications();

    // Listen to window event if topbar bell triggers updates
    const handleRefresh = () => {
      loadNotifications();
    };
    window.addEventListener('tembox:notifications-updated', handleRefresh);

    // Supabase Realtime subscription on notifications table
    let channel: any = null;
    let supabase: any = null;
    try {
      supabase = getSupabaseClient();
      channel = supabase
        .channel('notifikasi-view-channel')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'notifications' },
          () => {
            loadNotifications();
          }
        )
        .subscribe();
    } catch (err) {
      console.warn('Realtime subscription not active:', err);
    }

    return () => {
      window.removeEventListener('tembox:notifications-updated', handleRefresh);
      if (supabase && channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [loadDevices, loadNotifications]);

  // Tab counts
  const counts = useMemo(() => {
    const unread = notifications.filter(n => n.unread).length;
    const warning = notifications.filter(n => n.severity === 'critical' || n.severity === 'warning').length;
    const system = notifications.filter(n => n.category === 'system' || n.severity === 'info').length;
    return {
      all: notifications.length,
      unread,
      warning,
      system
    };
  }, [notifications]);

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter(item => {
      // Tab filter
      if (activeTab === 'unread' && !item.unread) return false;
      if (activeTab === 'warning' && item.severity !== 'critical' && item.severity !== 'warning') return false;
      if (activeTab === 'system' && item.category !== 'system' && item.severity !== 'info') return false;

      // Device filter
      if (selectedDevice !== 'all') {
        const matchId = item.deviceId === selectedDevice;
        const matchName = item.deviceName?.toLowerCase() === selectedDevice.toLowerCase();
        if (!matchId && !matchName) return false;
      }

      return true;
    });
  }, [notifications, activeTab, selectedDevice]);

  // Grouping by Date (Hari Ini vs Sebelumnya)
  const groupedNotifications = useMemo(() => {
    const today = new Date().toDateString();
    const todayGroup: HeaderNotificationItem[] = [];
    const earlierGroup: HeaderNotificationItem[] = [];

    filteredNotifications.forEach(item => {
      const itemDate = item.createdAt ? new Date(item.createdAt).toDateString() : today;
      if (itemDate === today) {
        todayGroup.push(item);
      } else {
        earlierGroup.push(item);
      }
    });

    return {
      today: todayGroup,
      earlier: earlierGroup
    };
  }, [filteredNotifications]);

  // Actions
  const handleMarkAllRead = async () => {
    const success = await markAllHeaderNotificationsRead();
    if (success) {
      setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
      window.dispatchEvent(new CustomEvent('tembox:notifications-updated'));
    }
  };

  const handleClearRead = async () => {
    const success = await clearReadNotifications();
    if (success) {
      setNotifications(prev => prev.filter(n => n.unread));
      window.dispatchEvent(new CustomEvent('tembox:notifications-updated'));
    }
  };

  const handleMuteBuzzer = async (notificationId: string, deviceId?: string | null) => {
    setActionLoadingId(notificationId);
    setActionStatus(null);
    try {
      const res = await fetch('/api/iot/device-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'MUTE_BUZZER',
          deviceId: deviceId || 'DEFAULT'
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionStatus({ message: 'Buzzer perangkat berhasil dimatikan.', type: 'success' });
      } else {
        setActionStatus({ message: data.error || 'Gagal mematikan buzzer.', type: 'error' });
      }
    } catch {
      setActionStatus({ message: 'Terjadi kesalahan jaringan saat mematikan buzzer.', type: 'error' });
    } finally {
      setActionLoadingId(null);
      setTimeout(() => setActionStatus(null), 4000);
    }
  };

  const handleNavigate = (tab: string) => {
    if (onNavigateTab) {
      onNavigateTab(tab);
    } else {
      window.location.hash = `#/${tab}`;
    }
  };

  return (
    <div style={{ padding: '0', background: '#FFFFFF', minHeight: 'calc(100vh - 68px)', width: '100%', maxWidth: '100%', overflowX: 'hidden', boxSizing: 'border-box' }}>
      {/* Action Notification Status Banner */}
      {actionStatus && (
        <div
          style={{
            padding: '10px 16px',
            background: actionStatus.type === 'success' ? '#F0FDF4' : '#FEF2F2',
            borderBottom: `1px solid ${actionStatus.type === 'success' ? '#BBF7D0' : '#FECACA'}`,
            color: actionStatus.type === 'success' ? '#166534' : '#991B1B',
            fontSize: '12px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}
        >
          <span>{actionStatus.message}</span>
          <button
            onClick={() => setActionStatus(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: '13px' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* TOP HEADER CONTROLS STRIP (Hairline divider style) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '12px 16px',
          borderBottom: '1px solid #E2E8F0',
          gap: '12px',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Left Tabs with smooth horizontal touch scroll */}
        <div style={{ width: '100%', maxWidth: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: '2px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', minWidth: 'max-content' }}>
            {[
              { id: 'all', label: 'Semua', count: counts.all },
              { id: 'unread', label: 'Belum Dibaca', count: counts.unread },
              { id: 'warning', label: 'Peringatan', count: counts.warning },
              { id: 'system', label: 'Sistem & Perangkat', count: counts.system }
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    background: isActive ? '#0F172A' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#475569',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: isActive ? 600 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{tab.label}</span>
                  <span
                    style={{
                      background: isActive ? '#1E293B' : '#F1F5F9',
                      color: isActive ? '#94A3B8' : '#64748B',
                      padding: '1px 6px',
                      borderRadius: '10px',
                      fontSize: '10px',
                      fontWeight: 600
                    }}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Controls with responsive wrap */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
          {/* Device Filter Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Filter size={13} color="#64748B" />
            <select
              value={selectedDevice}
              onChange={e => setSelectedDevice(e.target.value)}
              style={{
                fontSize: '11px',
                fontWeight: 500,
                color: '#334155',
                padding: '5px 8px',
                borderRadius: '4px',
                border: '1px solid #CBD5E1',
                background: '#FFFFFF',
                cursor: 'pointer',
                outline: 'none',
                maxWidth: '180px',
              }}
            >
              <option value="all">Semua Perangkat</option>
              {devices.map(d => (
                <option key={d.id} value={d.code}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>

          {/* Mark All Read Button */}
          <button
            onClick={handleMarkAllRead}
            disabled={counts.unread === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              fontSize: '11px',
              fontWeight: 500,
              color: counts.unread > 0 ? '#0284C7' : '#94A3B8',
              background: 'transparent',
              border: '1px solid #E2E8F0',
              borderRadius: '4px',
              cursor: counts.unread > 0 ? 'pointer' : 'default',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
            title="Tandai semua notifikasi sudah dibaca"
          >
            <CheckCheck size={12} />
            <span>Tandai Semua Dibaca</span>
          </button>

          {/* Clear Read Button */}
          <button
            onClick={handleClearRead}
            disabled={notifications.length - counts.unread === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              fontSize: '11px',
              fontWeight: 500,
              color: notifications.length - counts.unread > 0 ? '#64748B' : '#CBD5E1',
              background: 'transparent',
              border: '1px solid #E2E8F0',
              borderRadius: '4px',
              cursor: notifications.length - counts.unread > 0 ? 'pointer' : 'default',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
            title="Hapus notifikasi yang sudah dibaca"
          >
            <Trash2 size={12} />
            <span>Bersihkan Terbaca</span>
          </button>
        </div>
      </div>

      {/* NOTIFICATION FEED */}
      {loading ? (
        <div style={{ padding: '60px 24px', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>
          <RefreshCw size={20} className="animate-spin" style={{ margin: '0 auto 12px', display: 'block' }} />
          Memuat riwayat notifikasi...
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div style={{ padding: '80px 24px', textAlign: 'center' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '24px',
              background: '#F8FAFC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              border: '1px solid #E2E8F0'
            }}
          >
            <Bell size={20} color="#94A3B8" />
          </div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
            Tidak Ada Notifikasi
          </div>
          <p style={{ fontSize: '12px', color: '#64748B', maxWidth: '360px', margin: '0 auto' }}>
            {activeTab === 'unread'
              ? 'Seluruh peringatan dan pemberitahuan sistem telah Anda baca.'
              : 'Belum ada notifikasi atau peringatan yang tercatat untuk filter ini.'}
          </p>
        </div>
      ) : (
        <div>
          {/* Hari Ini Group */}
          {groupedNotifications.today.length > 0 && (
            <div>
              <div
                style={{
                  padding: '10px 24px',
                  background: '#F8FAFC',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#64748B',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  borderBottom: '1px solid #E2E8F0'
                }}
              >
                Hari Ini ({groupedNotifications.today.length})
              </div>
              {groupedNotifications.today.map(item => renderNotificationRow(item))}
            </div>
          )}

          {/* Sebelumnya Group */}
          {groupedNotifications.earlier.length > 0 && (
            <div>
              <div
                style={{
                  padding: '10px 24px',
                  background: '#F8FAFC',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#64748B',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  borderBottom: '1px solid #E2E8F0',
                  borderTop: groupedNotifications.today.length > 0 ? '1px solid #E2E8F0' : 'none'
                }}
              >
                Sebelumnya ({groupedNotifications.earlier.length})
              </div>
              {groupedNotifications.earlier.map(item => renderNotificationRow(item))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  function renderNotificationRow(item: HeaderNotificationItem) {
    const isCritical = item.severity === 'critical';
    const isWarning = item.severity === 'warning';

    const accentColor = isCritical ? '#DC2626' : isWarning ? '#D97706' : '#2563EB';
    const rowBg = item.unread ? '#F8FAFC' : '#FFFFFF';

    // Format WIB time
    const timeDisplay = item.createdAt
      ? new Date(item.createdAt).toLocaleString('id-ID', {
          timeZone: 'Asia/Jakarta',
          hour: '2-digit',
          minute: '2-digit',
          day: 'numeric',
          month: 'short'
        }) + ' WIB'
      : item.time;

    return (
      <div
        key={item.id}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '16px 24px',
          background: rowBg,
          borderBottom: '1px solid #E2E8F0',
          borderLeft: `3px solid ${accentColor}`,
          gap: '16px',
          transition: 'background 0.15s ease'
        }}
      >
        {/* Left Content */}
        <div style={{ flex: 1 }}>
          {/* Line 1: Severity Icon, Title, and Unread Dot */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            {isCritical ? (
              <AlertTriangle size={14} color="#DC2626" />
            ) : isWarning ? (
              <AlertTriangle size={14} color="#D97706" />
            ) : (
              <Info size={14} color="#2563EB" />
            )}

            <span
              style={{
                fontSize: '13px',
                fontWeight: item.unread ? 700 : 500,
                color: item.unread ? '#0F172A' : '#334155'
              }}
            >
              {item.title}
            </span>

            {item.unread && (
              <span
                style={{
                  display: 'inline-block',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#0284C7'
                }}
                title="Belum dibaca"
              />
            )}
          </div>

          {/* Line 2: Message & Trigger Value */}
          <div style={{ fontSize: '12px', color: '#475569', marginBottom: '6px', lineHeight: 1.5 }}>
            {item.message}
            {item.triggerValue && (
              <span style={{ fontWeight: 600, color: '#0F172A', marginLeft: '6px' }}>
                • Trigger: {item.triggerValue}
              </span>
            )}
          </div>

          {/* Line 3: Meta (Device, Time, Delivery Channel) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', fontSize: '11px', color: '#64748B' }}>
            {item.deviceName && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500, color: '#334155' }}>
                <Cpu size={11} color="#64748B" />
                {item.deviceName} {item.placement ? `(${item.placement})` : ''}
              </span>
            )}

            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={11} color="#94A3B8" />
              {timeDisplay}
            </span>

            {item.channelSent && (
              <span style={{ color: '#059669', fontWeight: 500 }}>
                • Terkirim via {item.channelSent}
              </span>
            )}
          </div>
        </div>

        {/* Right Actionable Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Matikan Buzzer (If critical/buzzer action) */}
          {(isCritical || item.actionType === 'mute_buzzer') && (
            <button
              onClick={() => handleMuteBuzzer(item.id, item.deviceId ?? undefined)}
              disabled={actionLoadingId === item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#DC2626',
                background: '#FEF2F2',
                border: '1px solid #FCA5A5',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title="Kirim perintah untuk mematikan alarm buzzer pada perangkat"
            >
              <VolumeX size={12} />
              <span>{actionLoadingId === item.id ? 'Mematikan...' : 'Matikan Buzzer'}</span>
            </button>
          )}

          {/* Panduan Perbaikan (If warning) */}
          {isWarning && (
            <button
              onClick={() => handleNavigate('pengaturan')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 10px',
                fontSize: '11px',
                fontWeight: 500,
                color: '#475569',
                background: '#F8FAFC',
                border: '1px solid #CBD5E1',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              title="Buka panduan perbaikan & SOP perangkat"
            >
              <span>Panduan SOP</span>
              <ArrowRight size={11} />
            </button>
          )}

          {/* Cek Grafik */}
          <button
            onClick={() => handleNavigate('monitoring')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              fontSize: '11px',
              fontWeight: 500,
              color: '#0284C7',
              background: '#F0F9FF',
              border: '1px solid #BAE6FD',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            title="Lihat tren grafik telemetri pada tab Monitoring"
          >
            <span>Cek Grafik</span>
            <ArrowRight size={11} />
          </button>
        </div>
      </div>
    );
  }
}
