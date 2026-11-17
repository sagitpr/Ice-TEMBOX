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
  currentTempNum: number;
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
  const [currentTempNum, setCurrentTempNum] = useState<number>(-0.4);
  const [pingMs, setPingMs] = useState<number | null>(34);
  const [signalRssi, setSignalRssi] = useState<number | null>(-64);
  const [systemConnected, setSystemConnected] = useState<boolean>(true);
  const [lastUpdate, setLastUpdate] = useState<string>('Memuat...');
  const [lastUpdateDate, setLastUpdateDate] = useState<string>('');
  const [sdStatus, setSdStatus] = useState<string>('SD Aktif • Tersinkron');
  const [rtcStatus, setRtcStatus] = useState<string>('RTC DS3231 Sinkron');

  const logsRef = useRef<TelemetryLogItem[]>([]);
  logsRef.current = telemetryLogs;

  // Process incoming telemetry data point
  const processTelemetryPoint = useCallback((point: {
    temperature_c: number;
    signal_rssi?: number | null;
    ping_ms?: number | null;
    sd_status?: string | null;
    recorded_at?: string;
  }) => {
    const temp = Number(point.temperature_c);
    setCurrentTempNum(temp);

    if (point.signal_rssi !== undefined && point.signal_rssi !== null) {
      setSignalRssi(point.signal_rssi);
    }
    if (point.ping_ms !== undefined && point.ping_ms !== null) {
      setPingMs(point.ping_ms);
    }
    if (point.sd_status) {
      setSdStatus(point.sd_status === 'OK' ? 'SD Aktif • Tersinkron' : point.sd_status);
    }

    const recDate = point.recorded_at ? new Date(point.recorded_at) : new Date();
    const timeStr = recDate.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }) + ' WIB';
    setLastUpdate(timeStr);
    setLastUpdateDate('Hari ini, ' + recDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }));
    setSystemConnected(true);
    setRtcStatus('RTC DS3231 Sinkron');

    setTelemetryLogs((prev) => {
      const exists = prev.some((p) => p.recorded_at === point.recorded_at && p.temperature_c === temp);
      if (exists) return prev;
      const updated = [
        {
          temperature_c: temp,
          signal_rssi: point.signal_rssi ?? -65,
          ping_ms: point.ping_ms ?? 34,
          sd_status: point.sd_status ?? 'OK',
          recorded_at: point.recorded_at || new Date().toISOString(),
        },
        ...prev,
      ].slice(0, 40);
      return updated;
    });
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
      } else {
        // Fallback default snapshot
        const now = new Date();
        setLastUpdate(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB');
        setLastUpdateDate('Hari ini, ' + now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }));
      }
    } catch (err) {
      console.warn('[Telemetry Hook] Error loading initial telemetry:', err);
    }
  }, [selectedDeviceCode, processTelemetryPoint]);

  useEffect(() => {
    refreshTelemetry();
  }, [refreshTelemetry]);

  // Supabase Realtime channel subscription
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
              status?: string;
              last_temperature_c?: number;
              last_seen_at?: string;
            };
            if (dev && (!dev.device_code || dev.device_code === selectedDeviceCode)) {
              if (dev.status) setSystemConnected(dev.status === 'online');
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

  // Test Ping function
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
      return latency;
    } catch {
      const fallback = Math.round(performance.now() - start);
      setPingMs(fallback);
      return fallback;
    }
  }, []);

  // Compute DS18B20 analytics from log buffer
  let minTempStr = '-0.8°C';
  let maxTempStr = '+0.2°C';
  let deltaPerHourStr = '+0.1°C/jam';
  let iceRemainingStr = 'Est. 48 jam';

  if (telemetryLogs.length > 0) {
    const temps = telemetryLogs.map((l) => Number(l.temperature_c)).filter((n) => !isNaN(n));
    if (temps.length > 0) {
      const min = Math.min(...temps);
      const max = Math.max(...temps);
      minTempStr = `${min > 0 ? '+' : ''}${min.toFixed(1)}°C`;
      maxTempStr = `${max > 0 ? '+' : ''}${max.toFixed(1)}°C`;

      if (temps.length >= 2) {
        const diff = temps[0] - temps[temps.length - 1];
        const diffPerHr = Math.max(0, diff);
        deltaPerHourStr = `+${diffPerHr.toFixed(1)}°C/jam`;
      }
    }
  }

  // Ice condition calculation based on current temperature
  let conditionText = 'Padat & Optimal';
  let tempStatusText = 'Aman (-1°C s/d 2°C)';
  if (currentTempNum > 2.0) {
    conditionText = 'Mencair Cepat';
    tempStatusText = 'Kritis (> +2°C)';
    iceRemainingStr = 'Est. 12 jam';
  } else if (currentTempNum > 0.5) {
    conditionText = 'Mencair Bertahap';
    tempStatusText = 'Waspada (> 0.5°C)';
    iceRemainingStr = 'Est. 24 jam';
  } else if (currentTempNum < -1.5) {
    conditionText = 'Beku Sempurna';
    tempStatusText = 'Sangat Dingin';
    iceRemainingStr = 'Est. 72 jam';
  }

  const currentTempFormatted = `${currentTempNum > 0 ? '+' : ''}${currentTempNum.toFixed(1)} °C`;

  return {
    currentTemp: currentTempFormatted,
    currentTempNum,
    tempStatus: tempStatusText,
    iceCondition: conditionText,
    minTemp: minTempStr,
    maxTemp: maxTempStr,
    tempDeltaPerHour: deltaPerHourStr,
    iceRemainingHours: iceRemainingStr,
    systemStatus: systemConnected ? 'Terkoneksi' : 'Belum Terhubung',
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
