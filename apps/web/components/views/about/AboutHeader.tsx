'use client';

import React from 'react';
import { Header, PublicSiteHeader } from '../../../app/components/Header';

export interface AboutHeaderProps {
  scrolled?: boolean;
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AboutHeader: React.FC<AboutHeaderProps> = () => {
  return <PublicSiteHeader />;
};

export default AboutHeader;
