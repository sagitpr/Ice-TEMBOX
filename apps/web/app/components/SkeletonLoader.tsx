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
  type?: 'metrics' | 'chart' | 'boxes' | 'custom';
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
      <div className="metrics-row" aria-busy="true" aria-label="Memuat data metrik">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="metric-card skeleton-container"
            style={{
              position: 'relative',
              overflow: 'hidden',
              minHeight: '140px',
              backgroundColor: '#F8FAFC',
              borderColor: '#E2EDF4',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* Shimmer Sweep Effect */}
            <div className="skeleton-shimmer" />

            {/* Pulsing Ice-TEMBOX Logo */}
            <div className="skeleton-logo-pulse">
              <IceTemboxLogoSvg size={36} />
              <div
                style={{
                  height: '8px',
                  width: '64px',
                  borderRadius: '4px',
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
      <div className="boxes-cards-grid" aria-busy="true" aria-label="Memuat data boks">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="box-temp-card skeleton-container"
            style={{
              position: 'relative',
              overflow: 'hidden',
              minHeight: '110px',
              backgroundColor: '#F8FAFC',
              borderColor: '#E2EDF4',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div className="skeleton-shimmer" />
            <div className="skeleton-logo-pulse">
              <IceTemboxLogoSvg size={30} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div
        className="dashboard-panel-card skeleton-container"
        style={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: height || '340px',
          backgroundColor: '#F8FAFC',
          borderColor: '#E2EDF4',
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
          <IceTemboxLogoSvg size={44} />
          <span
            style={{
              fontSize: '12px',
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

