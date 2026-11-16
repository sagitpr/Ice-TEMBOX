'use client';

import React from 'react';
import { useContactLogic } from '../../hooks/useContactLogic';
import ContactHeader from '../../components/views/contact/ContactHeader';
import ContactHero from '../../components/views/contact/ContactHero';
import ContactForm from '../../components/views/contact/ContactForm';
import ContactInfo from '../../components/views/contact/ContactInfo';
import ContactFAQ from '../../components/views/contact/ContactFAQ';
import ContactCategoryModal from '../../components/views/contact/ContactCategoryModal';
import ContactFooter from '../../components/views/contact/ContactFooter';

export const ContactView: React.FC = () => {
  const {
    // Form state & handlers
    fullName,
    setFullName,
    contactInfo,
    setContactInfo,
    category,
    message,
    setMessage,
    submitting,
    errorMessage,
    handleSubmit,

    // Category modal
    categoryModalOpen,
    setCategoryModalOpen,
    handleSelectCategory,

    // Toast
    toastOpen,
    setToastOpen,

    // FAQ
    openFAQ,
    handleToggleFAQ,

    // Header nav
    scrolled,
    mobileMenuOpen,
    setMobileMenuOpen,
  } = useContactLogic();

  return (
    <div className="tembox-app" style={{ backgroundColor: '#071A27', color: '#E2E8F0', minHeight: '100vh' }}>
      {/* 1. STICKY HEADER */}
      <ContactHeader
        scrolled={scrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* 2. HERO SECTION */}
      <ContactHero />

      {/* 3. MAIN SECTION: Two-Column Form & Info */}
      <section style={{ padding: '72px 0 88px 0', backgroundColor: '#071A27' }}>
        <div className="container" style={{ maxWidth: '1140px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '64px',
              alignItems: 'start',
            }}
          >
            <ContactForm
              fullName={fullName}
              setFullName={setFullName}
              contactInfo={contactInfo}
              setContactInfo={setContactInfo}
              category={category}
              categoryModalOpen={categoryModalOpen}
              setCategoryModalOpen={setCategoryModalOpen}
              message={message}
              setMessage={setMessage}
              submitting={submitting}
              errorMessage={errorMessage}
              handleSubmit={handleSubmit}
            />

            <ContactInfo />
          </div>
        </div>
      </section>

      {/* 4. FAQ ACCORDION */}
      <ContactFAQ openFAQ={openFAQ} onToggleFAQ={handleToggleFAQ} />

      {/* 5. FOOTER */}
      <ContactFooter />

      {/* 7. CATEGORY MODAL */}
      <ContactCategoryModal
        categoryModalOpen={categoryModalOpen}
        setCategoryModalOpen={setCategoryModalOpen}
        category={category}
        handleSelectCategory={handleSelectCategory}
      />
    </div>
  );
};

export default ContactView;
