'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useSettingsLogic } from '../../hooks/useSettingsLogic';
import SettingsStatusBanner from '../../components/views/settings/SettingsStatusBanner';
import SettingsDevices from '../../components/views/settings/SettingsDevices';
import SettingsAccount from '../../components/views/settings/SettingsAccount';
import SettingsNotificationSync from '../../components/views/settings/SettingsNotificationSync';
import SettingsSystemInfo from '../../components/views/settings/SettingsSystemInfo';
import SettingsToast from '../../components/views/settings/SettingsToast';

// Lazy load heavy interactive modals (slashes initial settings JavaScript bundle)
const AddDeviceModal = dynamic(() => import('../../components/views/settings/AddDeviceModal'), { ssr: false });
const DeviceDetailModal = dynamic(() => import('../../components/views/settings/DeviceDetailModal'), { ssr: false });
const EditAccountModal = dynamic(() => import('../../components/views/settings/EditAccountModal'), { ssr: false });

export const PengaturanView: React.FC = () => {
  const {
    // Entities
    devices,
    account,
    notifSettings,

    // Modal Visibilities
    addModalOpen,
    setAddModalOpen,
    detailModalOpen,
    setDetailModalOpen,
    accountModalOpen,
    setAccountModalOpen,

    // Add Device State & Handlers
    newDeviceName,
    setNewDeviceName,
    newDeviceIp,
    setNewDeviceIp,
    newDevicePlacement,
    setNewDevicePlacement,
    addFormError,
    savingDevice,
    handleOpenAddModal,
    handleSaveDevice,

    // Device Detail State & Handlers
    selectedDevice,
    pinging,
    restarting,
    detailActionFeedback,
    handleOpenDetailModal,
    handlePingDevice,
    handleRestartTelemetry,

    // Account Edit State & Handlers
    editName,
    setEditName,
    editEmail,
    setEditEmail,
    accountFormError,
    savingAccount,
    handleOpenAccountModal,
    handleSaveAccount,

    // Toggle Settings
    handleToggleSetting,

    // Toast
    toast,
    setToast,
  } = useSettingsLogic();

  return (
    <section className="app-page active" id="page-pengaturan">
      {/* 1. Status Banner */}
      <SettingsStatusBanner deviceCount={devices.length} />

      {/* 2. Device Management */}
      <SettingsDevices
        devices={devices}
        onOpenAddModal={handleOpenAddModal}
        onOpenDetailModal={handleOpenDetailModal}
      />

      {/* 3. Account Profile */}
      <SettingsAccount
        account={account}
        onOpenAccountModal={handleOpenAccountModal}
      />

      {/* 4. Notification & Sync Switches */}
      <SettingsNotificationSync
        notifSettings={notifSettings}
        onToggleSetting={handleToggleSetting}
      />

      {/* 5. System Info */}
      <SettingsSystemInfo />

      {/* MODAL 1: Add Device */}
      <AddDeviceModal
        addModalOpen={addModalOpen}
        setAddModalOpen={setAddModalOpen}
        newDeviceName={newDeviceName}
        setNewDeviceName={setNewDeviceName}
        newDeviceIp={newDeviceIp}
        setNewDeviceIp={setNewDeviceIp}
        newDevicePlacement={newDevicePlacement}
        setNewDevicePlacement={setNewDevicePlacement}
        addFormError={addFormError}
        savingDevice={savingDevice}
        handleSaveDevice={handleSaveDevice}
      />

      {/* MODAL 2: Technical Detail */}
      <DeviceDetailModal
        detailModalOpen={detailModalOpen}
        setDetailModalOpen={setDetailModalOpen}
        selectedDevice={selectedDevice}
        detailActionFeedback={detailActionFeedback}
        pinging={pinging}
        restarting={restarting}
        handlePingDevice={handlePingDevice}
        handleRestartTelemetry={handleRestartTelemetry}
      />

      {/* MODAL 3: Edit Profile */}
      <EditAccountModal
        accountModalOpen={accountModalOpen}
        setAccountModalOpen={setAccountModalOpen}
        editName={editName}
        setEditName={setEditName}
        editEmail={editEmail}
        setEditEmail={setEditEmail}
        accountFormError={accountFormError}
        savingAccount={savingAccount}
        handleSaveAccount={handleSaveAccount}
      />

      {/* FLOATING TOAST */}
      <SettingsToast toast={toast} onClose={() => setToast(null)} />
    </section>
  );
};

export default PengaturanView;
