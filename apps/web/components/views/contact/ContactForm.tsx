'use client';

import React from 'react';
import { CATEGORY_OPTIONS } from '../../../hooks/useContactLogic';

interface ContactFormProps {
  fullName: string;
  setFullName: (val: string) => void;
  contactInfo: string;
  setContactInfo: (val: string) => void;
  category: string;
  categoryModalOpen: boolean;
  setCategoryModalOpen: (val: boolean) => void;
  message: string;
  setMessage: (val: string) => void;
  submitting: boolean;
  errorMessage: string;
  handleSubmit: (e: React.FormEvent) => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  fullName,
  setFullName,
  contactInfo,
  setContactInfo,
  category,
  categoryModalOpen,
  setCategoryModalOpen,
  message,
  setMessage,
  submitting,
  errorMessage,
  handleSubmit,
}) => {
  const currentBadge =
    CATEGORY_OPTIONS.find((c) => c.id === category)?.badge || 'Pilihan';

  return (
    <div>
      <div
        style={{
          paddingBottom: '20px',
          marginBottom: '28px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <p
          style={{
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#7DDCE8',
            marginBottom: '6px',
          }}
        >
          FORMULIR INTERAKTIF
        </p>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>
          Kirimkan Pesan Anda
        </h2>
        <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
          Isi formulir di bawah ini. Tim teknis dan kemitraan kami akan menindaklanjuti pesan Anda secara langsung.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: '#E2E8F0',
              marginBottom: '8px',
            }}
          >
            Nama Lengkap <span style={{ color: '#7DDCE8' }}>*</span>
          </label>
          <input
            id="fullName"
            type="text"
            required
            placeholder="Contoh: Budi Santoso"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '10px',
              padding: '13px 16px',
              color: '#FFFFFF',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s ease, background-color 0.2s ease',
            }}
          />
        </div>

        {/* Email / WhatsApp */}
        <div>
          <label
            htmlFor="contactInfo"
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: '#E2E8F0',
              marginBottom: '8px',
            }}
          >
            Email atau Nomor WhatsApp <span style={{ color: '#7DDCE8' }}>*</span>
          </label>
          <input
            id="contactInfo"
            type="text"
            required
            placeholder="Contoh: budi@gmail.com / 081234567890"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '10px',
              padding: '13px 16px',
              color: '#FFFFFF',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s ease, background-color 0.2s ease',
            }}
          />
        </div>

        {/* Category Selection */}
        <div>
          <label
            id="category-label"
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: '#E2E8F0',
              marginBottom: '8px',
            }}
          >
            Kategori Kebutuhan
          </label>
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={categoryModalOpen}
            onClick={() => setCategoryModalOpen(true)}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '10px',
              padding: '13px 16px',
              color: '#FFFFFF',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'border-color 0.2s ease, background 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontWeight: 600, color: '#FFFFFF' }}>{category}</span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: 'rgba(125, 220, 232, 0.12)',
                  color: '#7DDCE8',
                }}
              >
                {currentBadge}
              </span>
            </div>
            <span style={{ fontSize: '12px', color: '#7DDCE8' }}>▼</span>
          </button>
        </div>

        {/* Message Textarea */}
        <div>
          <label
            htmlFor="message"
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: '#E2E8F0',
              marginBottom: '8px',
            }}
          >
            Pesan atau Kebutuhan Spesifik <span style={{ color: '#7DDCE8' }}>*</span>
          </label>
          <textarea
            id="message"
            required
            rows={5}
            placeholder="Jelaskan kebutuhan armada kapal, pertanyaan telemetri palka, atau topik kerja sama yang ingin didiskusikan..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '10px',
              padding: '14px 16px',
              color: '#FFFFFF',
              fontSize: '14px',
              lineHeight: 1.6,
              outline: 'none',
              resize: 'vertical',
            }}
          />
        </div>

        {/* Error Notification Alert */}
        {errorMessage && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: '10px',
              padding: '12px 16px',
              color: '#FCA5A5',
              fontSize: '13.5px',
              lineHeight: 1.5,
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          style={{
            background: '#0284C7',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '15px',
            padding: '14px 24px',
            borderRadius: '10px',
            border: 'none',
            cursor: submitting ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
            transition: 'background-color 0.2s ease, opacity 0.2s ease',
            opacity: submitting ? 0.75 : 1,
            alignSelf: 'flex-start',
            minWidth: '220px',
          }}
          onMouseEnter={(e) => {
            if (!submitting) e.currentTarget.style.backgroundColor = '#0369A1';
          }}
          onMouseLeave={(e) => {
            if (!submitting) e.currentTarget.style.backgroundColor = '#0284C7';
          }}
        >
          {submitting ? 'Mengirim...' : 'Kirim Pesan Sekarang'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
