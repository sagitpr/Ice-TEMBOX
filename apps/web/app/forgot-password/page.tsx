import React from 'react';
import type { Metadata } from 'next';
import ForgotPasswordView from '../components/ForgotPasswordView';

export const metadata: Metadata = {
  title: 'Lupa Password - TEMBOX',
  description: 'Pulihkan akses akun Anda ke sistem pemantauan telemetri rantai dingin TEMBOX.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
}
