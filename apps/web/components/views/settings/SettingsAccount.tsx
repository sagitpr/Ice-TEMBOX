import React from 'react';
import { User } from '../../app/components/Icons';
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
    <div className="settings-section-card">
      <div className="settings-section-header">
        <div className="settings-icon-wrap">
          <User size={18} color="#0284C7" />
        </div>
        <div>
          <h3 className="settings-section-title">Akun</h3>
          <p className="settings-section-desc">Kelola informasi profil pengguna Anda.</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="topbar-avatar" style={{ width: '44px', height: '44px', fontSize: '16px', flexShrink: 0 }}>
            <User size={20} />
          </div>
          <div>
            <div id="settingsAccountName" style={{ fontWeight: 700, color: 'var(--color-ocean)', fontSize: '15px' }}>
              {account.fullName}
            </div>
            <div id="settingsAccountEmail" style={{ fontSize: '12.5px', color: '#64748B' }}>
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
