'use client';

import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw } from './Icons';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (val: string) => void;
  onComplete?: (val: string) => void;
  error?: string;
  onResend?: () => void;
  resendCountdown?: number;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value,
  onChange,
  onComplete,
  error = '',
  onResend,
  resendCountdown = 60,
}) => {
  const [countdown, setCountdown] = useState(resendCountdown);
  const [canResend, setCanResend] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Split value into array of characters
  const digits = Array.from({ length }, (_, i) => value[i] || '');

  // Handle countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResendClick = () => {
    if (!canResend) return;
    setCountdown(resendCountdown);
    setCanResend(false);
    if (onResend) onResend();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newDigits = [...digits];
      if (newDigits[index]) {
        newDigits[index] = '';
      } else if (index > 0) {
        newDigits[index - 1] = '';
        inputsRef.current[index - 1]?.focus();
      }
      const newVal = newDigits.join('');
      onChange(newVal);
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    if (!rawVal) return;

    const char = rawVal[rawVal.length - 1]; // take last entered digit
    const newDigits = [...digits];
    newDigits[index] = char;
    const newVal = newDigits.join('').slice(0, length);
    onChange(newVal);

    // Auto advance to next input
    if (index < length - 1 && char) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newVal.length === length && onComplete) {
      onComplete(newVal);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasteData) return;

    onChange(pasteData);
    const targetIdx = Math.min(pasteData.length, length - 1);
    inputsRef.current[targetIdx]?.focus();

    if (pasteData.length === length && onComplete) {
      onComplete(pasteData);
    }
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* 6 Digit Inputs Box Row */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '360px',
          marginBottom: '10px',
        }}
      >
        {Array.from({ length }).map((_, idx) => (
          <input
            key={idx}
            ref={(el) => {
              inputsRef.current[idx] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]*"
            maxLength={1}
            value={digits[idx] || ''}
            onChange={(e) => handleChange(idx, e)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            style={{
              width: '46px',
              height: '52px',
              fontSize: '22px',
              fontWeight: 700,
              textAlign: 'center',
              borderRadius: '10px',
              border: error
                ? '2px solid #EF4444'
                : digits[idx]
                ? '2px solid #38BDF8'
                : '1px solid rgba(125, 220, 232, 0.3)',
              background: 'rgba(7, 26, 39, 0.85)',
              color: '#FFFFFF',
              outline: 'none',
              boxShadow: digits[idx] ? '0 0 0 3px rgba(56, 189, 248, 0.2)' : 'none',
              transition: 'all 0.15s ease',
            }}
          />
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px', textAlign: 'center' }}>
          {error}
        </p>
      )}

      {/* Resend OTP Bar with countdown */}
      <div
        style={{
          marginTop: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          fontSize: '12.5px',
          color: '#94A3B8',
        }}
      >
        <span>Belum menerima kode?</span>
        {canResend ? (
          <button
            type="button"
            onClick={handleResendClick}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              color: '#38BDF8',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <RefreshCw size={12} />
            <span>Kirim ulang OTP</span>
          </button>
        ) : (
          <span style={{ color: '#64748B', fontWeight: 600 }}>
            Kirim ulang ({countdown}s)
          </span>
        )}
      </div>
    </div>
  );
};

export default OtpInput;
