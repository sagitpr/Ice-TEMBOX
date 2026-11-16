import React from 'react';

interface AuthBottomWavesProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Layered maritime wave SVG decoration for Auth pages (Login, Register, OTP, Forgot Password).
 * Styled with soft sky-blue, bright cyan, and deep navy waves mirroring the TEMBOX poster.
 */
export const AuthBottomWaves: React.FC<AuthBottomWavesProps> = ({ className = '', style }) => {
  return (
    <div
      aria-hidden="true"
      className={`auth-bottom-waves ${className}`}
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '100%',
        height: '140px',
        pointerEvents: 'none',
        userSelect: 'none',
        overflow: 'hidden',
        zIndex: 0,
        lineHeight: 0,
        ...style,
      }}
    >
      <svg
        viewBox="0 0 1200 240"
        preserveAspectRatio="none"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      >
        {/* Layer 1: Back / Top Wave (Soft Sky Blue with ~45% opacity) */}
        <path
          d="M0,160 C240,210 440,110 720,150 C960,185 1100,100 1200,60 L1200,240 L0,240 Z"
          fill="#7DD3FC"
          fillOpacity="0.45"
        />

        {/* Layer 2: Middle Wave (Bright Cyan with ~75% opacity) */}
        <path
          d="M0,195 C280,230 520,160 820,190 C1020,210 1120,155 1200,115 L1200,240 L0,240 Z"
          fill="#38BDF8"
          fillOpacity="0.75"
        />

        {/* Layer 3: Front / Bottom Wave (Solid Deep Maritime Navy) */}
        <path
          d="M0,225 C320,245 600,195 900,218 C1060,230 1140,190 1200,165 L1200,240 L0,240 Z"
          fill="#072538"
        />
      </svg>
    </div>
  );
};

export default AuthBottomWaves;
