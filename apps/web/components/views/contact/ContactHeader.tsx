'use client';

import React from 'react';
import { Header, PublicSiteHeader } from '../../../app/components/Header';

export interface ContactHeaderProps {
  scrolled?: boolean;
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ContactHeader: React.FC<ContactHeaderProps> = () => {
  return <PublicSiteHeader />;
};

export default ContactHeader;
