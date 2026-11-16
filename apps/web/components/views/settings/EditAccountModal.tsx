'use client';

import React from 'react';
import { X } from '../../../app/components/Icons';

interface EditAccountModalProps {
  accountModalOpen: boolean;
  setAccountModalOpen: (open: boolean) => void;
  editName: string;
  setEditName: (val: string) => void;
  editEmail: string;
  setEditEmail: (val: string) => void;
  accountFormError: string;
  savingAccount: boolean;
  handleSaveAccount: (e: React.FormEvent) => void;
}

export const EditAccountModal: React.FC<EditAccountModalProps> = ({
  accountModalOpen,
  setAccountModalOpen,
  editName,
  setEditName,
  editEmail,
  setEditEmail,
  accountFormError,
  savingAccount,
  handleSaveAccount,
}) => {
  return (
    <div
      role="dialog"
      aria-modal={accountModalOpen}
      aria-hidden={!accountModalOpen}
      className={accountModalOpen ? '' : 'pointer-events-none'}
      onClick={() => accountModalOpen && setAccountModalOpen(false)}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(7, 26, 39, 0.55)',
        backdropFilter: accountModalOpen ? 'blur(8px)' : 'none',
        WebkitBackdropFilter: accountModalOpen ? 'blur(8px)' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        opacity: accountModalOpen ? 1 : 0,
        visibility: accountModalOpen ? 'visible' : 'hidden',
        pointerEvents: accountModalOpen ? 'auto' : 'none',
        transition: 'opacity 0.22s ease, visibility 0.22s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2EDF4',
          borderRadius: '18px',
          maxWidth: '440px',
          width: '100%',
          padding: '28px',
          boxShadow: '0 24px 55px rgba(11, 45, 66, 0.22)',
          transform: accountModalOpen ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(10px)',
          transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', color: '#0284C7', textTransform: 'uppercase' }}>
              PROFIL PENGGUNA
            </span>
            <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#0B2D42', margin: '4px 0 0 0' }}>
              Ubah Informasi Akun
            </h3>
          </div>
          <button
            type="button"
            aria-label="Tutup modal edit profil"
            onClick={() => setAccountModalOpen(false)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#F1F5F9',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSaveAccount} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label htmlFor="editAccountName" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Nama Lengkap
            </label>
            <input
              id="editAccountName"
              type="text"
              placeholder="Nama lengkap Anda"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                fontSize: '14px',
                color: '#0F172A',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label htmlFor="editAccountEmail" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Alamat Email
            </label>
            <input
              id="editAccountEmail"
              type="email"
              placeholder="email@domain.com"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                fontSize: '14px',
                color: '#0F172A',
                outline: 'none',
              }}
            />
          </div>

          {accountFormError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: '12.5px', padding: '10px 12px', borderRadius: '8px' }}>
              {accountFormError}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <button type="button" className="btn-secondary" onClick={() => setAccountModalOpen(false)}>
              Batal
            </button>
            <button
              type="submit"
              disabled={savingAccount}
              style={{
                background: '#0284C7',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '13.5px',
                padding: '9px 20px',
                borderRadius: '8px',
                opacity: savingAccount ? 0.7 : 1,
              }}
            >
              {savingAccount ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAccountModal;
