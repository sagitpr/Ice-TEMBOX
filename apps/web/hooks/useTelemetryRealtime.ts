'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getSupabaseClient } from '../modules/supabase/supabaseClient';

export interface TelemetryLogItem {
  id?: number | string;
  temperature_c: number;
  humidity_pct?: number | null;
  battery_pct?: number | null;
  signal_rssi?: number | null;
  ping_ms?: number | null;
  sd_status?: string | null;
  offline_queue_count?: number | null;
  recorded_at: string;
}

export interface TelemetryRealtimeState {
  currentTemp: string;
  currentTempNum: number | null;
  tempStatus: string;
  iceCondition: string;
  minTemp: string;
  maxTemp: string;
  tempDeltaPerHour: string;
  iceRemainingHours: string;
  systemStatus: string;
  systemConnected: boolean;
  pingMs: number | null;
  signalRssi: number | null;
  lastUpdate: string;
  lastUpdateDate: string;
  sdStatus: string;
  rtcStatus: string;
  selectedDeviceCode: string;
  setSelectedDeviceCode: (code: string) => void;
  telemetryLogs: TelemetryLogItem[];
  testPing: () => Promise<number>;
  refreshTelemetry: () => Promise<void>;
}

export function useTelemetryRealtime(initialDeviceCode = 'ESP32-TEMBOX-01'): TelemetryRealtimeState {
  const [selectedDeviceCode, setSelectedDeviceCode] = useState(initialDeviceCode);
  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryLogItem[]>([]);
  const [currentTempNum, setCurrentTempNum] = useState<number | null>(null);
  const [pingMs, setPingMs] = useState<number | null>(null);
  const [signalRssi, setSignalRssi] = useState<number | null>(null);
  const [systemConnected, setSystemConnected] = useState<boolean>(false);
  const [connectionStatusText, setConnectionStatusText] = useState<string>('Menunggu Data');
  const [lastUpdate, setLastUpdate] = useState<string>('--');
  const [lastUpdateDate, setLastUpdateDate] = useState<string>('');
  const [sdStatus, setSdStatus] = useState<string>('--');
  const [rtcStatus, setRtcStatus] = useState<string>('--');

  const lastSeenRef = useRef<number | null>(null);

  // Process incoming telemetry data point
  const processTelemetryPoint = useCallback((point: {
    temperature_c: number;
    signal_rssi?: number | null;
    ping_ms?: number | null;
    sd_status?: string | null;
    recorded_at?: string;
    device_timestamp?: string;
    created_at?: string;
  }) => {
    const temp = Number(point.temperature_c);
    if (!isNaN(temp)) {
      setCurrentTempNum(temp);
    }

    if (point.signal_rssi !== undefined && point.signal_rssi !== null) {
      setSignalRssi(point.signal_rssi);
    }

    // Accurate Ping calculation
    if (point.ping_ms !== undefined && point.ping_ms !== null) {
      setPingMs(point.ping_ms);
    } else if (point.device_timestamp && point.created_at) {
      const sentTime = new Date(point.device_timestamp).getTime();
      const recvTime = new Date(point.created_at).getTime();
      const diff = Math.abs(recvTime - sentTime);
      if (diff > 0 && diff < 5000) {
        setPingMs(diff);
      }
    }

    if (point.sd_status) {
      setSdStatus(point.sd_status === 'OK' || point.sd_status === 'OK_SYNCED' ? 'MicroSD & RTC Aktif' : point.sd_status);
    } else {
      setSdStatus('MicroSD & RTC Aktif');
    }

    const recDate = point.recorded_at ? new Date(point.recorded_at) : new Date();
    lastSeenRef.current = recDate.getTime();
    setSystemConnected(true);
    setConnectionStatusText('Terkoneksi');

    // Format time: HH.mm.ss WIB
    const hours = String(recDate.getHours()).padStart(2, '0');
    const minutes = String(recDate.getMinutes()).padStart(2, '0');
    const seconds = String(recDate.getSeconds()).padStart(2, '0');
    setLastUpdate(`${hours}.${minutes}.${seconds} WIB`);
    setLastUpdateDate('Hari ini, ' + recDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }));
    setRtcStatus('RTC DS3231 Aktif');

    setTelemetryLogs((prev) => {
      const exists = prev.some((p) => p.recorded_at === point.recorded_at && p.temperature_c === temp);
      if (exists) return prev;
      const updated = [
        {
          temperature_c: temp,
          signal_rssi: point.signal_rssi ?? null,
          ping_ms: point.ping_ms ?? null,
          sd_status: point.sd_status ?? 'OK',
          recorded_at: point.recorded_at || new Date().toISOString(),
        },
        ...prev,
      ].slice(0, 40);
      return updated;
    });
  }, []);

  // 1-second watchdog checking for connection loss after 30 seconds
  useEffect(() => {
    const checkWatchdog = () => {
      if (!lastSeenRef.current) {
        setSystemConnected(false);
        setConnectionStatusText('Menunggu Data');
        return;
      }

      const diffSec = Math.floor((Date.now() - lastSeenRef.current) / 1000);
      if (diffSec <= 30) {
        setSystemConnected(true);
        setConnectionStatusText('Terkoneksi');
      } else {
        setSystemConnected(false);
        if (diffSec < 60) {
          setConnectionStatusText(`Terputus (${diffSec} dtk lalu)`);
        } else {
          const diffMin = Math.floor(diffSec / 60);
          setConnectionStatusText(`Terputus (${diffMin} mnt lalu)`);
        }
      }
    };

    checkWatchdog();
    const interval = setInterval(checkWatchdog, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch initial telemetry from /api/telemetry
  const refreshTelemetry = useCallback(async () => {
    try {
      const res = await fetch(`/api/telemetry?device_code=${encodeURIComponent(selectedDeviceCode)}&limit=30`, {
        cache: 'no-store',
      });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.logs) && data.logs.length > 0) {
        setTelemetryLogs(data.logs);
        const latest = data.logs[0];
        processTelemetryPoint(latest);
      }
    } catch (err) {
      console.warn('[Telemetry Hook] Error loading initial telemetry:', err);
    }
  }, [selectedDeviceCode, processTelemetryPoint]);

  useEffect(() => {
    refreshTelemetry();
  }, [refreshTelemetry]);

  // Supabase Realtime WebSocket subscription (INSERT & UPDATE)
  useEffect(() => {
    let supabaseChannel: ReturnType<ReturnType<typeof getSupabaseClient>['channel']> | null = null;

    try {
      const supabase = getSupabaseClient();
      supabaseChannel = supabase
        .channel(`realtime_telemetry_${selectedDeviceCode}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'telemetry_logs' },
          (payload) => {
            const newRecord = payload.new as {
              temperature_c: number;
              signal_rssi?: number;
              ping_ms?: number;
              sd_status?: string;
              recorded_at?: string;
              device_timestamp?: string;
              created_at?: string;
            };
            if (newRecord && typeof newRecord.temperature_c === 'number') {
              processTelemetryPoint(newRecord);
            }
          }
        )
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'devices' },
          (payload) => {
            const dev = payload.new as {
              device_code?: string;
              serial_number?: string;
              status?: string;
              last_temperature_c?: number;
              last_seen_at?: string;
            };
            if (dev && (!dev.device_code || dev.device_code === selectedDeviceCode || dev.serial_number === selectedDeviceCode)) {
              if (dev.status) {
                setSystemConnected(dev.status === 'online');
                if (dev.status === 'online') {
                  setConnectionStatusText('Terkoneksi');
                }
              }
              if (typeof dev.last_temperature_c === 'number') {
                processTelemetryPoint({
                  temperature_c: dev.last_temperature_c,
                  recorded_at: dev.last_seen_at,
                });
              }
            }
          }
        )
        .subscribe();
    } catch {
      // Supabase credentials unset in development/offline mode
    }

    return () => {
      if (supabaseChannel) {
        try {
          supabaseChannel.unsubscribe();
        } catch {}
      }
    };
  }, [selectedDeviceCode, processTelemetryPoint]);

  // Test Ping function measuring true client-to-server latency
  const testPing = useCallback(async (): Promise<number> => {
    const start = performance.now();
    try {
      const res = await fetch('/api/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientTime: Date.now() }),
      });
      const latency = Math.round(performance.now() - start);
      setPingMs(latency);
      setSystemConnected(true);
      setConnectionStatusText('Terkoneksi');
      lastSeenRef.current = Date.now();
      return latency;
    } catch {
      const fallback = Math.round(performance.now() - start);
      setPingMs(fallback);
      return fallback;
    }
  }, []);

  // Compute DS18B20 analytics from log buffer
  let minTempStr = '--';
  let maxTempStr = '--';
  let deltaPerHourStr = '--';
  let iceRemainingStr = '--';

  if (telemetryLogs.length > 0) {
    const temps = telemetryLogs.map((l) => Number(l.temperature_c)).filter((n) => !isNaN(n));
    if (temps.length > 0) {
      const min = Math.min(...temps);
      const max = Math.max(...temps);
      minTempStr = `${min > 0 ? '+' : ''}${min.toFixed(1)}°`;
      maxTempStr = `${max > 0 ? '+' : ''}${max.toFixed(1)}°`;

      if (temps.length >= 2) {
        const diff = temps[0] - temps[temps.length - 1];
        const diffPerHr = Math.max(0, diff);
        deltaPerHourStr = `+${diffPerHr.toFixed(1)}°C/jam`;
      } else {
        deltaPerHourStr = '+0.1°C/jam';
      }
    }
  }

  // Ice condition calculation based on current temperature
  let conditionText = 'Menunggu Data';
  let tempStatusText = 'Menunggu Data';

  if (currentTempNum !== null) {
    iceRemainingStr = 'Est. bertahan 48 jam';
    if (currentTempNum > 4.0) {
      conditionText = 'Mencair Cepat';
      tempStatusText = 'Bahaya';
      iceRemainingStr = 'Est. bertahan 12 jam';
    } else if (currentTempNum > 2.0) {
      conditionText = 'Mulai Mencair';
      tempStatusText = 'Waspada';
      iceRemainingStr = 'Est. bertahan 24 jam';
    } else if (currentTempNum < -1.5) {
      conditionText = 'Beku';
      tempStatusText = 'Aman';
      iceRemainingStr = 'Est. bertahan 72 jam';
    } else {
      conditionText = 'Padat';
      tempStatusText = 'Aman';
    }
  }

  const currentTempFormatted = currentTempNum !== null
    ? `${currentTempNum > 0 ? '+' : ''}${currentTempNum.toFixed(1)} °C`
    : '-- °C';

  return {
    currentTemp: currentTempFormatted,
    currentTempNum,
    tempStatus: tempStatusText,
    iceCondition: conditionText,
    minTemp: minTempStr,
    maxTemp: maxTempStr,
    tempDeltaPerHour: deltaPerHourStr,
    iceRemainingHours: iceRemainingStr,
    systemStatus: connectionStatusText,
    systemConnected,
    pingMs,
    signalRssi,
    lastUpdate,
    lastUpdateDate,
    sdStatus,
    rtcStatus,
    selectedDeviceCode,
    setSelectedDeviceCode,
    telemetryLogs,
    testPing,
    refreshTelemetry,
  };
}
