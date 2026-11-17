import React from 'react';
import { User } from '../../../app/components/Icons';
import type { UserAccount } from '../../../lib/services/dashboardService';

interface SettingsAccountProps {
  account: UserAccount;
  onOpenAccountModal: () => void;
}

export const SettingsAccount: React.FC<SettingsAccountProps> = ({
  account,
  onOpenAccountModal,
}) => {
  return (
    <div
      className="settings-section-flat"
      style={{
        borderBottom: '1px solid #E2E8F0',
        paddingBottom: '28px',
        marginBottom: '28px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <User size={20} color="#0284C7" />
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Akun
          </h3>
          <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0 0' }}>
            Kelola informasi profil pengguna Anda.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: '#0284C7',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '15px',
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            <User size={18} />
          </div>
          <div>
            <div id="settingsAccountName" style={{ fontWeight: 700, color: '#0F172A', fontSize: '15px' }}>
              {account.fullName}
            </div>
            <div id="settingsAccountEmail" style={{ fontSize: '12.5px', color: '#64748B', marginTop: '2px' }}>
              {account.email}
            </div>
          </div>
        </div>
        <button
          type="button"
          className="btn-secondary"
          onClick={onOpenAccountModal}
        >
          Ubah
        </button>
      </div>
    </div>
  );
};

export default SettingsAccount;
