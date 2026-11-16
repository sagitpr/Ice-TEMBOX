'use client';

import React, { useState, useEffect } from 'react';
import AboutHeader from '../../components/views/about/AboutHeader';
import AboutHero from '../../components/views/about/AboutHero';
import AboutVision from '../../components/views/about/AboutVision';
import AboutIndustryChallenge from '../../components/views/about/AboutIndustryChallenge';
import AboutArchitecture from '../../components/views/about/AboutArchitecture';
import AboutTechStack from '../../components/views/about/AboutTechStack';
import AboutDeveloper from '../../components/views/about/AboutDeveloper';
import AboutFooter from '../../components/views/about/AboutFooter';

export const AboutView: React.FC<{ onNavigate?: (view: string) => void }> = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="tembox-app" style={{ backgroundColor: '#FFFFFF', color: '#0F172A', minHeight: '100vh' }}>
      <AboutHeader
        scrolled={scrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <AboutHero />
      <AboutVision />
      <AboutIndustryChallenge />
      <AboutArchitecture />
      <AboutTechStack />
      <AboutDeveloper />
      <AboutFooter />
    </div>
  );
};

export default AboutView;
