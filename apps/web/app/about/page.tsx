import React from 'react';
import type { Metadata } from 'next';
import AboutView from '../components/AboutView';

export const metadata: Metadata = {
  title: 'Tentang TEMBOX - Merevolusi Rantai Pasok Maritim Melalui Kecerdasan IoT',
  description: 'Mengenal sistem retrofit IoT cold-chain Ice-TEMBOX, arsitektur perangkat keras cerdas, dan profil pengembang Sagit Faturrakhman.',
};

export default function AboutPage() {
  return <AboutView />;
}

