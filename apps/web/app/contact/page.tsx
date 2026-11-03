import React from 'react';
import type { Metadata } from 'next';
import ContactView from '../components/ContactView';

export const metadata: Metadata = {
  title: 'Hubungi Tim TEMBOX - Solusi Rantai Dingin IoT Maritim',
  description: 'Terhubung dengan tim TEMBOX untuk konsultasi perangkat IoT, kerja sama strategis, atau dukungan teknis rantai dingin perikanan.',
};

export default function ContactPage() {
  return <ContactView />;
}

