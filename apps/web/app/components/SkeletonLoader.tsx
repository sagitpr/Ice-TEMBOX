'use client';

import React from 'react';

// Crisp inline Ice-TEMBOX Logo for zero-CLS shimmering transitions
export const IceTemboxLogoSvg: React.FC<{ size?: number; className?: string }> = ({
  size = 40,
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: 'block' }}
  >
    <rect width="64" height="64" rx="16" fill="#0B2D42" />
    {/* Fish upper curve */}
    <path
      d="M14 32C18 24 28 20 40 26C35 29 30 33 24 35C19 36 16 34 14 32Z"
      fill="#FFFFFF"
    />
    {/* Dynamic ice wave */}
    <path
      d="M17 34C24 33 30 30 36 27C38 31 35 37 28 40C22 42 18 38 17 34Z"
      fill="#7DDCE8"
    />
    {/* Tail fins */}
    <path d="M39 26C43 23 48 24 51 27C47 29 44 29 41 28Z" fill="#7DDCE8" />
    <path d="M38 29C42 32 46 35 49 39C46 38 42 36 39 33Z" fill="#7DDCE8" />
    {/* Eye */}
    <circle cx="21" cy="27" r="2.2" fill="#0B2D42" />
  </svg>
);

interface SkeletonProps {
  type?: 'metrics' | 'chart' | 'boxes' | 'table' | 'custom';
  height?: number | string;
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({
  type = 'metrics',
  height,
  count = 4,
}) => {
  if (type === 'metrics') {
    return (
      <div
        className="metrics-row flat-metrics-row"
        aria-busy="true"
        aria-label="Memuat data metrik"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          borderBottom: '1px solid #E2E8F0',
          width: '100%',
          backgroundColor: '#FFFFFF',
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`metric-card metric-item-flat skeleton-container ${i === 3 ? 'metric-item-last' : ''}`}
            style={{
              position: 'relative',
              overflow: 'hidden',
              minHeight: '130px',
              backgroundColor: '#FAFCFE',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              borderRight: i === 3 ? 'none' : '1px solid #E2E8F0',
            }}
          >
            {/* Shimmer Sweep Effect */}
            <div className="skeleton-shimmer" />

            {/* Pulsing Ice-TEMBOX Logo */}
            <div className="skeleton-logo-pulse">
              <IceTemboxLogoSvg size={32} />
              <div
                style={{
                  height: '6px',
                  width: '56px',
                  borderRadius: '3px',
                  background: '#E2E8F0',
                  marginTop: '6px',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'boxes') {
    return (
      <div className="boxes-cards-grid flat-boxes-row" aria-busy="true" aria-label="Memuat data boks">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`box-temp-card flat-box-item skeleton-container ${i === 3 ? 'flat-box-last' : ''}`}
            style={{
              position: 'relative',
              overflow: 'hidden',
              minHeight: '100px',
              backgroundColor: '#FAFCFE',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div className="skeleton-shimmer" />
            <div className="skeleton-logo-pulse">
              <IceTemboxLogoSvg size={28} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div
        className="flat-section skeleton-container"
        style={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: height || '320px',
          backgroundColor: '#FAFCFE',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
        aria-busy="true"
        aria-label="Memuat data grafik"
      >
        <div className="skeleton-shimmer" />
        <div className="skeleton-logo-pulse">
          <IceTemboxLogoSvg size={40} />
          <span
            style={{
              fontSize: '11.5px',
              fontWeight: 600,
              color: '#94A3B8',
              letterSpacing: '0.5px',
              marginTop: '8px',
            }}
          >
            MEMUAT DATA TEMBOX...
          </span>
        </div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div
        className="flat-section skeleton-container"
        style={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: height || '260px',
          backgroundColor: '#FAFCFE',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
        aria-busy="true"
        aria-label="Memuat data tabel"
      >
        <div className="skeleton-shimmer" />
        <div className="skeleton-logo-pulse">
          <IceTemboxLogoSvg size={40} />
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#94A3B8',
              letterSpacing: '0.5px',
              marginTop: '8px',
            }}
          >
            MEMUAT DATA...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="skeleton-container"
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: height || '120px',
        backgroundColor: '#F8FAFC',
        borderRadius: '14px',
        border: '1px solid #E2EDF4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-busy="true"
    >
      <div className="skeleton-shimmer" />
      <div className="skeleton-logo-pulse">
        <IceTemboxLogoSvg size={36} />
      </div>
    </div>
  );
};

export default SkeletonLoader;
