import React from 'react';
import type { Metadata } from 'next';
import LoginView from '../components/LoginView';

export const metadata: Metadata = {
  title: 'Masuk ke Sistem - TEMBOX',
  description: 'Masuk ke akun Anda untuk memantau data suhu palka dan rantai dingin maritim TEMBOX secara real-time.',
};

export default function LoginPage() {
  return <LoginView />;
}
