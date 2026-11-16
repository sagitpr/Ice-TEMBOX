'use client';

import React from 'react';
import { FAQS } from '../../../hooks/useContactLogic';

interface ContactFAQProps {
  openFAQ: number | null;
  onToggleFAQ: (index: number) => void;
}

export const ContactFAQ: React.FC<ContactFAQProps> = ({ openFAQ, onToggleFAQ }) => {
  return (
    <section
      style={{
        padding: '80px 0 96px 0',
        background: '#051420',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ marginBottom: '44px' }}>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#7DDCE8',
              marginBottom: '8px',
            }}
          >
            DUKUNGAN INSTAN
          </p>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 2.8vw, 2.3rem)',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.25,
            }}
          >
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <p style={{ fontSize: '14.5px', color: '#94A3B8', marginTop: '10px', marginBottom: 0 }}>
            Jawaban ringkas seputar spesifikasi teknis, mekanisme pemasangan, dan operasional TEMBOX.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          {FAQS.map((faq, index) => {
            const isOpen = openFAQ === index;
            return (
              <div
                key={index}
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <button
                  type="button"
                  onClick={() => onToggleFAQ(index)}
                  style={{
                    width: '100%',
                    padding: '22px 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: isOpen ? '#7DDCE8' : '#FFFFFF',
                    fontSize: '16px',
                    fontWeight: 700,
                    gap: '16px',
                    transition: 'color 0.2s ease',
                  }}
                >
                  <span>{faq.question}</span>
                  <span
                    style={{
                      fontSize: '20px',
                      color: isOpen ? '#7DDCE8' : '#64748B',
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s ease, color 0.2s ease',
                      flexShrink: 0,
                    }}
                  >
                    +
                  </span>
                </button>

                {isOpen && (
                  <div
                    style={{
                      paddingBottom: '24px',
                      fontSize: '14.5px',
                      lineHeight: 1.75,
                      color: '#CBD5E1',
                    }}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ContactFAQ;
