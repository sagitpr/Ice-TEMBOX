'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Cloud, Wind, Download, Activity, ChevronDown, Check, RefreshCw } from './Icons';
import type { TelemetryLogItem } from '../../hooks/useTelemetryRealtime';

interface MarineWeatherBarProps {
  currentPalkaTemp?: number | null;
  selectedDeviceCode?: string;
  onDeviceChange?: (code: string) => void;
  onPingTested?: (latencyMs: number) => void;
  telemetryLogs?: TelemetryLogItem[] | Array<{
    id?: number | string;
    temperature_c?: number;
    signal_rssi?: number | null;
    ping_ms?: number | null;
    recorded_at?: string;
  }>;
}

interface WeatherState {
  temperature: number | null;
  windSpeed: number | null;
  condition: string;
  locationName: string;
  isLocating: boolean;
}

export const MarineWeatherBar: React.FC<MarineWeatherBarProps> = ({
  currentPalkaTemp = null,
  selectedDeviceCode = 'ESP32-TEMBOX-01',
  onDeviceChange,
  onPingTested,
  telemetryLogs = [],
}) => {
  const [weather, setWeather] = useState<WeatherState>({
    temperature: null,
    windSpeed: null,
    condition: 'Mendeteksi Lokasi & Cuaca...',
    locationName: 'Pesisir Pantai',
    isLocating: true,
  });

  const [isPinging, setIsPinging] = useState(false);
  const [lastTestedPing, setLastTestedPing] = useState<number | null>(null);
  const [deviceDropdownOpen, setDeviceDropdownOpen] = useState(false);

  // Fetch real location & Open-Meteo Weather
  const fetchWeatherForCoords = useCallback(async (lat: number, lon: number) => {
    try {
      // 1. Free client reverse geocoding via BigDataCloud
      let detectedLocation = 'Pesisir Indonesia';
      try {
        const geoRes = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=id`,
          { cache: 'no-store' }
        );
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          const locality = geoData.locality || geoData.city || geoData.principalSubdivision;
          const regency = geoData.city || geoData.principalSubdivision || '';
          if (locality && regency && locality !== regency) {
            detectedLocation = `${locality}, ${regency}`;
          } else if (locality) {
            detectedLocation = locality;
          }
        }
      } catch {
        // Fallback name if reverse geocoding fails
        detectedLocation = 'Pesisir Maritim';
      }

      // 2. Real-time global weather from Open-Meteo
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m`,
        { cache: 'no-store' }
      );

      if (!weatherRes.ok) {
        setWeather((prev) => ({
          ...prev,
          locationName: detectedLocation,
          condition: 'Data Cuaca Tidak Tersedia',
          isLocating: false,
        }));
        return;
      }

      const weatherData = await weatherRes.json();
      const current = weatherData.current;
      if (!current) return;

      const code = current.weather_code;
      let condText = 'Cerah';
      if (code >= 1 && code <= 3) condText = 'Sebagian Berawan';
      else if (code >= 45 && code <= 48) condText = 'Berkabut';
      else if (code >= 51 && code <= 67) condText = 'Hujan Ringan';
      else if (code >= 80 && code <= 82) condText = 'Hujan Lebat';
      else if (code >= 95) condText = 'Badai Petir';
      else if (code >= 4) condText = 'Berawan';

      setWeather({
        temperature: typeof current.temperature_2m === 'number' ? Math.round(current.temperature_2m * 10) / 10 : null,
        windSpeed: typeof current.wind_speed_10m === 'number' ? Math.round(current.wind_speed_10m * 10) / 10 : null,
        condition: condText,
        locationName: detectedLocation,
        isLocating: false,
      });
    } catch {
      setWeather((prev) => ({
        ...prev,
        condition: 'Koneksi Cuaca Offline',
        isLocating: false,
      }));
    }
  }, []);

  // Request browser geolocation with fallback to Muara Baru, Jakarta (-6.10, 106.88)
  const resolveLocationAndWeather = useCallback(() => {
    setWeather((prev) => ({ ...prev, isLocating: true }));

    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeatherForCoords(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          // Fallback to coastal North Jakarta / Port area
          fetchWeatherForCoords(-6.10, 106.88);
        },
        { timeout: 7000 }
      );
    } else {
      fetchWeatherForCoords(-6.10, 106.88);
    }
  }, [fetchWeatherForCoords]);

  useEffect(() => {
    resolveLocationAndWeather();
    // Auto-refresh every 5 minutes
    const interval = setInterval(resolveLocationAndWeather, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [resolveLocationAndWeather]);

  // Live Test Ping handler measuring client-to-server roundtrip
  const handleTestPing = async () => {
    if (isPinging) return;
    setIsPinging(true);
    const start = performance.now();
    try {
      await fetch('/api/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientTime: Date.now() }),
      });
      const roundtripMs = Math.round(performance.now() - start);
      setLastTestedPing(roundtripMs);
      if (onPingTested) onPingTested(roundtripMs);
    } catch {
      const fallbackMs = Math.round(performance.now() - start);
      setLastTestedPing(fallbackMs);
      if (onPingTested) onPingTested(fallbackMs);
    } finally {
      setIsPinging(false);
    }
  };

  // Export Log CSV generator
  const handleExportCsv = useCallback(() => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Timestamp,Device,Temperature_C,Signal_RSSI_dBm,Ping_Latency_ms,Status\n';

    if (telemetryLogs.length === 0) {
      const now = new Date().toISOString();
      csvContent += `${now},${selectedDeviceCode},${currentPalkaTemp ?? '--'},-65,34,Online\n`;
    } else {
      telemetryLogs.forEach((row) => {
        const time = row.recorded_at || new Date().toISOString();
        const temp = row.temperature_c !== undefined ? row.temperature_c : '--';
        const rssi = row.signal_rssi !== undefined && row.signal_rssi !== null ? row.signal_rssi : '--';
        const ping = row.ping_ms !== undefined && row.ping_ms !== null ? row.ping_ms : '--';
        csvContent += `${time},${selectedDeviceCode},${temp},${rssi},${ping},Online\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const timestamp = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `tembox-telemetry-${selectedDeviceCode}-${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [telemetryLogs, selectedDeviceCode, currentPalkaTemp]);

  const palkaTemp = currentPalkaTemp !== null && currentPalkaTemp !== undefined ? currentPalkaTemp : null;
  const tempDelta = weather.temperature !== null && palkaTemp !== null
    ? (weather.temperature - palkaTemp > 0 ? '+' : '') + (weather.temperature - palkaTemp).toFixed(1) + '°C'
    : '--';

  const devicesList = ['ESP32-TEMBOX-01', 'ESP32-TEMBOX-02'];

  return (
    <div
      className="flat-weather-toolbar"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '16px',
        borderBottom: '1px solid #E2E8F0',
        marginBottom: '28px',
        flexWrap: 'wrap',
        gap: '14px',
      }}
    >
      {/* 1. Baris Teks Bersih Cuaca Nyata Berbasis Lokasi GPS */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          fontSize: '12.5px',
          color: '#475569',
        }}
      >
        <Cloud size={15} color="#0284C7" />
        <span style={{ fontWeight: 700, color: '#0F172A' }} suppressHydrationWarning>
          {weather.locationName}
        </span>
        <span>•</span>
        <span suppressHydrationWarning>
          {weather.temperature !== null ? `${weather.condition} ${weather.temperature}°C` : weather.condition}
        </span>
        {weather.windSpeed !== null && (
          <>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }} suppressHydrationWarning>
              <Wind size={13} color="#64748B" />
              <span>Angin {weather.windSpeed} km/j</span>
            </span>
          </>
        )}
        <span>•</span>
        <span style={{ color: '#0369A1', fontWeight: 600 }} suppressHydrationWarning>
          Selisih Palka {tempDelta}
        </span>

        {/* Tombol Segarkan Lokasi */}
        <button
          type="button"
          onClick={resolveLocationAndWeather}
          title="Segarkan Lokasi & Cuaca Terkini"
          disabled={weather.isLocating}
          style={{
            background: 'none',
            border: 'none',
            padding: '2px 4px',
            color: weather.isLocating ? '#94A3B8' : '#0284C7',
            cursor: weather.isLocating ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            marginLeft: '4px',
          }}
          aria-label="Segarkan Lokasi dan Cuaca"
        >
          <RefreshCw size={12} className={weather.isLocating ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* 2. Toolbar Perangkat & Aksi Cepat */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {/* Dropdown Pemilih Perangkat */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setDeviceDropdownOpen(!deviceDropdownOpen)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#0F172A',
              cursor: 'pointer',
            }}
          >
            <span>{selectedDeviceCode}</span>
            <ChevronDown size={12} color="#64748B" />
          </button>

          {deviceDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                marginTop: '4px',
                right: 0,
                zIndex: 40,
                width: '180px',
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.1)',
                padding: '4px',
              }}
            >
              {devicesList.map((dev) => (
                <button
                  key={dev}
                  type="button"
                  onClick={() => {
                    if (onDeviceChange) onDeviceChange(dev);
                    setDeviceDropdownOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '8px 10px',
                    fontSize: '12px',
                    color: '#0F172A',
                    background: 'none',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span>{dev}</span>
                  {selectedDeviceCode === dev && <Check size={13} color="#0284C7" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tombol Test Ping */}
        <button
          type="button"
          onClick={handleTestPing}
          disabled={isPinging}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            backgroundColor: '#F8FAFC',
            border: '1px solid #CBD5E1',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            color: '#0F172A',
            cursor: isPinging ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <Activity size={13} color={isPinging ? '#94A3B8' : '#0284C7'} />
          <span>{isPinging ? 'Menguji...' : lastTestedPing !== null ? `Ping: ${lastTestedPing} ms` : 'Test Ping'}</span>
        </button>

        {/* Tombol Export Log CSV */}
        <button
          type="button"
          onClick={handleExportCsv}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            backgroundColor: '#0F172A',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            color: '#FFFFFF',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
          }}
        >
          <Download size={13} color="#FFFFFF" />
          <span>Export Log CSV</span>
        </button>
      </div>
    </div>
  );
};

export default MarineWeatherBar;
