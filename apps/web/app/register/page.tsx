import React from 'react';
import type { Metadata } from 'next';
import RegisterView from '../components/RegisterView';

export const metadata: Metadata = {
  title: 'Daftar Akun Baru - TEMBOX',
  description: 'Daftar akun baru untuk mulai memantau armada dan palka ikan dengan sistem IoT TEMBOX.',
};

export default function RegisterPage() {
  return <RegisterView />;
}
