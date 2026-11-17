'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Cloud, Wind, Download, Activity, ChevronDown, Check, RefreshCw, AlertTriangle } from './Icons';
import type { TelemetryLogItem } from '../../hooks/useTelemetryRealtime';

interface MarineWeatherBarProps {
  currentPalkaTemp?: number | null;
  selectedDeviceCode?: string | null;
  devicesList?: Array<{ code: string; name: string }>;
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
  lat: number | null;
  lon: number | null;
}

export const MarineWeatherBar: React.FC<MarineWeatherBarProps> = ({
  currentPalkaTemp = null,
  selectedDeviceCode = null,
  devicesList = [],
  onDeviceChange,
  onPingTested,
  telemetryLogs = [],
}) => {
  // Geolocation & Weather State
  const [geoStatus, setGeoStatus] = useState<
    'prompt' | 'requesting' | 'granted' | 'denied' | 'insecure' | 'unsupported'
  >('prompt');
  const [geoErrorMessage, setGeoErrorMessage] = useState<string>('');

  const [weather, setWeather] = useState<WeatherState>({
    temperature: null,
    windSpeed: null,
    condition: '',
    locationName: '',
    lat: null,
    lon: null,
  });

  const [isLocating, setIsLocating] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [lastTestedPing, setLastTestedPing] = useState<number | null>(null);
  const [deviceDropdownOpen, setDeviceDropdownOpen] = useState(false);

  // Check if connection is insecure HTTP on remote IP (browser blocks navigator.geolocation)
  const checkSecureContext = () => {
    if (typeof window === 'undefined') return true;
    if (window.isSecureContext) return true;
    const host = window.location.hostname;
    return host === 'localhost' || host === '127.0.0.1';
  };

  // Instant hydration from localStorage cache (0 ms load)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('tembox_last_weather');
      if (raw) {
        const cached = JSON.parse(raw);
        if (cached && typeof cached.lat === 'number' && typeof cached.lon === 'number') {
          setWeather({
            temperature: typeof cached.temperature === 'number' ? cached.temperature : null,
            windSpeed: typeof cached.windSpeed === 'number' ? cached.windSpeed : null,
            condition: cached.condition || 'Cerah',
            locationName: cached.locationName || `Koordinat ${cached.lat.toFixed(2)}°, ${cached.lon.toFixed(2)}°`,
            lat: cached.lat,
            lon: cached.lon,
          });
          setGeoStatus('granted');
        }
      }
    } catch {}
  }, []);

  // Fetch real location & Open-Meteo Weather in parallel with 5-second abort controller
  const fetchWeatherForCoords = useCallback(async (lat: number, lon: number) => {
    setIsLocating(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      // Run BigDataCloud reverse geocode and Open-Meteo weather concurrently
      const geoPromise = fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=id`,
        { signal: controller.signal, cache: 'no-store' }
      )
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null);

      const weatherPromise = fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m`,
        { signal: controller.signal, cache: 'no-store' }
      )
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null);

      const [geoData, weatherData] = await Promise.all([geoPromise, weatherPromise]);
      clearTimeout(timeoutId);

      // 1. Parse location name
      let detectedLocation = `Koordinat ${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
      if (geoData) {
        const locality = geoData.locality || geoData.city || geoData.principalSubdivision;
        const regency = geoData.city || geoData.principalSubdivision || '';
        if (locality && regency && locality !== regency) {
          detectedLocation = `${locality}, ${regency}`;
        } else if (locality) {
          detectedLocation = locality;
        }
      }

      // 2. Parse weather condition
      const current = weatherData?.current;
      let condText = 'Cerah';
      if (current && typeof current.weather_code === 'number') {
        const code = current.weather_code;
        if (code >= 1 && code <= 3) condText = 'Sebagian Berawan';
        else if (code >= 45 && code <= 48) condText = 'Berkabut';
        else if (code >= 51 && code <= 67) condText = 'Hujan Ringan';
        else if (code >= 80 && code <= 82) condText = 'Hujan Lebat';
        else if (code >= 95) condText = 'Badai Petir';
        else if (code >= 4) condText = 'Berawan';
      }

      const tempVal =
        current && typeof current.temperature_2m === 'number'
          ? Math.round(current.temperature_2m * 10) / 10
          : null;
      const windVal =
        current && typeof current.wind_speed_10m === 'number'
          ? Math.round(current.wind_speed_10m * 10) / 10
          : null;

      const newWeatherState: WeatherState = {
        temperature: tempVal,
        windSpeed: windVal,
        condition: condText,
        locationName: detectedLocation,
        lat,
        lon,
      };

      setWeather(newWeatherState);
      setGeoStatus('granted');

      // Persist in localStorage for instant 0 ms hydration on next visit
      try {
        localStorage.setItem(
          'tembox_last_weather',
          JSON.stringify({
            ...newWeatherState,
            updatedAt: Date.now(),
          })
        );
      } catch {}
    } catch {
      setWeather((prev) => ({
        ...prev,
        condition: prev.condition || 'Koneksi Cuaca Offline',
      }));
    } finally {
      setIsLocating(false);
    }
  }, []);

  // Accelerated browser geolocation trigger (< 500 ms using network triangulation)
  const requestLocation = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (!('geolocation' in navigator)) {
      setGeoStatus('unsupported');
      setGeoErrorMessage('Browser tidak mendukung geolokasi GPS.');
      return;
    }

    if (!checkSecureContext()) {
      setGeoStatus('insecure');
      setGeoErrorMessage('Akses lokasi membutuhkan koneksi aman HTTPS atau localhost:3000.');
      return;
    }

    setGeoStatus('requesting');
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchWeatherForCoords(latitude, longitude);
      },
      (err) => {
        setIsLocating(false);
        setGeoStatus('prompt');
        if (err.code === 1) {
          // PERMISSION_DENIED
          setGeoErrorMessage('Izin lokasi belum diberikan.');
        } else if (err.code === 2) {
          // POSITION_UNAVAILABLE
          setGeoErrorMessage('Sinyal lokasi GPS perangkat tidak tersedia.');
        } else {
          // TIMEOUT
          setGeoErrorMessage('Batas waktu izin lokasi tercapai.');
        }
      },
      {
        enableHighAccuracy: false, // Fast network triangulation, avoids satellite lock delays
        timeout: 5000,             // Max 5s wait time
        maximumAge: 300000,        // Accept cached position within 5 minutes
      }
    );
  }, [fetchWeatherForCoords]);

  // Request location on mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  // Periodic weather refresh if coordinates already granted
  useEffect(() => {
    if (weather.lat !== null && weather.lon !== null) {
      const interval = setInterval(() => {
        fetchWeatherForCoords(weather.lat!, weather.lon!);
      }, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [weather.lat, weather.lon, fetchWeatherForCoords]);

  // Live Test Ping handler measuring client-to-server roundtrip
  const handleTestPing = async () => {
    if (isPinging || !selectedDeviceCode) return;
    setIsPinging(true);
    const start = performance.now();
    try {
      await fetch('/api/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientTime: Date.now(), deviceCode: selectedDeviceCode }),
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
    if (!selectedDeviceCode || telemetryLogs.length === 0) return;

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Timestamp,Device,Temperature_C,Signal_RSSI_dBm,Ping_Latency_ms,Status\n';

    telemetryLogs.forEach((row) => {
      const time = row.recorded_at || new Date().toISOString();
      const temp = row.temperature_c !== undefined ? row.temperature_c : '--';
      const rssi = row.signal_rssi !== undefined && row.signal_rssi !== null ? row.signal_rssi : '--';
      const ping = row.ping_ms !== undefined && row.ping_ms !== null ? row.ping_ms : '--';
      csvContent += `${time},${selectedDeviceCode},${temp},${rssi},${ping},Online\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const timestamp = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `tembox-telemetry-${selectedDeviceCode}-${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [telemetryLogs, selectedDeviceCode]);

  const palkaTemp = currentPalkaTemp !== null && currentPalkaTemp !== undefined ? currentPalkaTemp : null;
  const tempDelta = weather.temperature !== null && palkaTemp !== null
    ? (weather.temperature - palkaTemp > 0 ? '+' : '') + (weather.temperature - palkaTemp).toFixed(1) + '°C'
    : '--';

  const hasDevice = Boolean(selectedDeviceCode && devicesList.length > 0);

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
      {/* 1. Baris Teks Cuaca: Meminta Izin Lokasi GPS Asli Tanpa Fallback */}
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

        {geoStatus === 'granted' && weather.locationName ? (
          <>
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

            <button
              type="button"
              onClick={requestLocation}
              title="Segarkan Lokasi & Cuaca Terkini"
              disabled={isLocating}
              style={{
                background: 'none',
                border: 'none',
                padding: '2px 4px',
                color: isLocating ? '#94A3B8' : '#0284C7',
                cursor: isLocating ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                marginLeft: '4px',
              }}
              aria-label="Segarkan Lokasi dan Cuaca"
            >
              <RefreshCw size={12} className={isLocating ? 'animate-spin' : ''} />
            </button>
          </>
        ) : geoStatus === 'insecure' ? (
          <span style={{ color: '#D97706', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={13} color="#D97706" />
            <span>Izinkan akses lokasi untuk menampilkan cuaca daerah Anda (Gunakan HTTPS atau localhost:3000)</span>
          </span>
        ) : (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ color: '#64748B' }}>
              {geoErrorMessage || 'Izinkan akses lokasi untuk menampilkan cuaca daerah Anda'}
            </span>
            <button
              type="button"
              onClick={requestLocation}
              disabled={isLocating}
              style={{
                padding: '4px 10px',
                fontSize: '11.5px',
                fontWeight: 600,
                color: '#0284C7',
                backgroundColor: '#EFF6FF',
                border: '1px solid #BAE6FD',
                borderRadius: '6px',
                cursor: isLocating ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                whiteSpace: 'nowrap',
              }}
            >
              {isLocating && <RefreshCw size={11} className="animate-spin" />}
              <span>{isLocating ? 'Memeriksa Lokasi...' : 'Klik untuk Izinkan Lokasi'}</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Toolbar Perangkat & Aksi Cepat (Nonaktif & Bersih Saat Belum Ada Perangkat) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {hasDevice ? (
          /* Dropdown Pemilih Perangkat Aktif */
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
                  width: '200px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.1)',
                  padding: '4px',
                }}
              >
                {devicesList.map((dev) => (
                  <button
                    key={dev.code}
                    type="button"
                    onClick={() => {
                      if (onDeviceChange) onDeviceChange(dev.code);
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
                      background: selectedDeviceCode === dev.code ? '#F0F9FF' : 'none',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span>{dev.name || dev.code}</span>
                    {selectedDeviceCode === dev.code && <Check size={13} color="#0284C7" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Keadaan Bersih: Belum Ada Perangkat Terhubung */
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#64748B' }}>
              Belum ada perangkat terhubung
            </span>
          </div>
        )}

        {/* Tombol Test Ping (Hanya aktif saat ada perangkat) */}
        <button
          type="button"
          onClick={handleTestPing}
          disabled={!hasDevice || isPinging}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            color: hasDevice ? '#334155' : '#94A3B8',
            cursor: hasDevice && !isPinging ? 'pointer' : 'not-allowed',
            opacity: hasDevice ? 1 : 0.6,
          }}
          title={hasDevice ? 'Uji Latensi Ping ESP32' : 'Daftarkan perangkat untuk menguji ping'}
        >
          <Activity size={13} color={hasDevice ? '#0284C7' : '#94A3B8'} />
          <span>
            {isPinging
              ? 'Testing...'
              : lastTestedPing !== null
                ? `${lastTestedPing} ms`
                : 'Test Ping'}
          </span>
        </button>

        {/* Tombol Export Log CSV (Hanya aktif saat ada perangkat dan log) */}
        <button
          type="button"
          onClick={handleExportCsv}
          disabled={!hasDevice || telemetryLogs.length === 0}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            backgroundColor: hasDevice && telemetryLogs.length > 0 ? '#0F172A' : '#F1F5F9',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            color: hasDevice && telemetryLogs.length > 0 ? '#FFFFFF' : '#94A3B8',
            cursor: hasDevice && telemetryLogs.length > 0 ? 'pointer' : 'not-allowed',
          }}
          title={hasDevice && telemetryLogs.length > 0 ? 'Unduh Data Telemetri CSV' : 'Belum ada log telemetri untuk diunduh'}
        >
          <Download size={13} color={hasDevice && telemetryLogs.length > 0 ? '#FFFFFF' : '#94A3B8'} />
          <span>Export Log CSV</span>
        </button>
      </div>
    </div>
  );
};

export default MarineWeatherBar;
