'use client';

import React from 'react';
import { CATEGORY_OPTIONS } from '../../../hooks/useContactLogic';

interface ContactCategoryModalProps {
  categoryModalOpen: boolean;
  setCategoryModalOpen: (open: boolean) => void;
  category: string;
  handleSelectCategory: (id: string) => void;
}

export const ContactCategoryModal: React.FC<ContactCategoryModalProps> = ({
  categoryModalOpen,
  setCategoryModalOpen,
  category,
  handleSelectCategory,
}) => {
  return (
    <div
      role="dialog"
      aria-modal={categoryModalOpen}
      aria-hidden={!categoryModalOpen}
      onClick={() => categoryModalOpen && setCategoryModalOpen(false)}
      className={categoryModalOpen ? '' : 'pointer-events-none'}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(5, 20, 32, 0.78)',
        backdropFilter: categoryModalOpen ? 'blur(8px)' : 'none',
        WebkitBackdropFilter: categoryModalOpen ? 'blur(8px)' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        opacity: categoryModalOpen ? 1 : 0,
        visibility: categoryModalOpen ? 'visible' : 'hidden',
        pointerEvents: categoryModalOpen ? 'auto' : 'none',
        transition: 'opacity 0.2s ease, visibility 0.2s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#0B2D42',
          border: '1px solid rgba(125, 220, 232, 0.35)',
          borderRadius: '20px',
          maxWidth: '560px',
          width: '100%',
          padding: '32px 28px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.55)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '22px' }}>
          <div>
            <p
              style={{
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#7DDCE8',
                marginBottom: '4px',
              }}
            >
              PILIHAN KATEGORI
            </p>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Pilih Kategori Kebutuhan
            </h3>
            <p style={{ fontSize: '13.5px', color: '#94A3B8', marginTop: '6px', marginBottom: 0 }}>
              Tentukan topik konsultasi atau layanan yang paling sesuai dengan keperluan Anda.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCategoryModalOpen(false)}
            aria-label="Tutup Jendela Kategori"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#CBD5E1',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '15px',
              lineHeight: 1,
              flexShrink: 0,
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
            }}
          >
            ✕
          </button>
        </div>

        {/* Category Options List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {CATEGORY_OPTIONS.map((opt) => {
            const isSelected = category === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectCategory(opt.id)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: isSelected ? 'rgba(125, 220, 232, 0.12)' : 'rgba(7, 26, 39, 0.65)',
                  border: isSelected ? '1.5px solid #7DDCE8' : '1px solid rgba(125, 220, 232, 0.2)',
                  borderRadius: '14px',
                  padding: '16px 18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'rgba(125, 220, 232, 0.45)';
                    e.currentTarget.style.backgroundColor = 'rgba(7, 26, 39, 0.9)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'rgba(125, 220, 232, 0.2)';
                    e.currentTarget.style.backgroundColor = 'rgba(7, 26, 39, 0.65)';
                  }
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>
                      {opt.title}
                    </span>
                    <span
                      style={{
                        fontSize: '10.5px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: isSelected ? 'rgba(125, 220, 232, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                        color: isSelected ? '#7DDCE8' : '#94A3B8',
                        letterSpacing: '0.03em',
                      }}
                    >
                      {opt.badge}
                    </span>
                  </div>
                  <p style={{ fontSize: '12.5px', color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>
                    {opt.description}
                  </p>
                </div>

                {/* Radio / Check indicator */}
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    border: isSelected ? '2px solid #7DDCE8' : '2px solid rgba(255, 255, 255, 0.3)',
                    background: isSelected ? '#7DDCE8' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {isSelected && (
                    <span style={{ color: '#071A27', fontSize: '13px', fontWeight: 900, lineHeight: 1 }}>
                      ✓
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ContactCategoryModal;
