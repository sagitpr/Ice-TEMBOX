import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  resolveSeoTopic,
  PRIMARY_TOPICS,
  COMMODITIES,
  FOCUS_TOPICS,
} from '../../lib/seo-data';

interface Props {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Next.js App Router dynamic params
export const dynamicParams = true;

export async function generateStaticParams() {
  return PRIMARY_TOPICS.map((topic) => ({
    slug: topic.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const topic = resolveSeoTopic(resolvedParams.slug);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ice-tembox.vercel.app';
  const url = `${baseUrl}/kategori/${topic.slug}`;

  return {
    title: topic.title,
    description: topic.metaDescription,
    keywords: topic.targetKeywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      locale: 'id_ID',
      url,
      title: `${topic.title} | TEMBOX`,
      description: topic.metaDescription,
      siteName: 'TEMBOX',
      images: [
        {
          url: '/Penangkap-ikan.jpg',
          width: 1200,
          height: 630,
          alt: topic.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${topic.title} | TEMBOX`,
      description: topic.metaDescription,
      images: ['/Penangkap-ikan.jpg'],
    },
  };
}

export default async function KategoriPage({ params }: Props) {
  const resolvedParams = await params;
  const topic = resolveSeoTopic(resolvedParams.slug);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ice-tembox.vercel.app';
  const currentUrl = `${baseUrl}/kategori/${topic.slug}`;

  // Structured Data (JSON-LD)
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Beranda',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Kategori Solusi',
        item: `${baseUrl}/kategori/monitoring-suhu-palka-ikan`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: topic.title,
        item: currentUrl,
      },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: topic.title,
    description: topic.metaDescription,
    image: `${baseUrl}/Penangkap-ikan.jpg`,
    author: {
      '@type': 'Person',
      name: 'Sagit Faturrakhman',
    },
    publisher: {
      '@type': 'Organization',
      name: 'TEMBOX',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/LogoTembox-Horizontal.png`,
      },
    },
    mainEntityOfPage: currentUrl,
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: topic.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  // Related Topics for SEO Crawling
  const relatedTopics = PRIMARY_TOPICS.filter((t) => t.slug !== topic.slug).slice(0, 4);

  return (
    <div style={{ backgroundColor: '#071A27', color: '#E2E8F0', minHeight: '100vh' }}>
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Navigation Header */}
      <header
        style={{
          background: 'rgba(7, 26, 39, 0.94)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(125, 220, 232, 0.15)',
          padding: '16px 24px',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="/LogoTembox-Horizontal.png"
              alt="TEMBOX"
              width={140}
              height={36}
              style={{
                width: '140px',
                height: '36px',
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)',
              }}
            />
          </Link>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link href="/" style={{ color: '#CBD5E1', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
              Beranda
            </Link>
            <Link href="/about" style={{ color: '#CBD5E1', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
              About
            </Link>
            <Link href="/contact" style={{ color: '#7DDCE8', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}>
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div style={{ background: '#092233', borderBottom: '1px solid rgba(125, 220, 232, 0.1)', padding: '12px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', fontSize: '13px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Beranda</Link>
          <span>/</span>
          <span style={{ color: '#7DDCE8' }}>Kategori Solusi</span>
          <span>/</span>
          <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{topic.title}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section
        style={{
          padding: '60px 24px 40px',
          background: 'linear-gradient(180deg, #092233 0%, #071A27 100%)',
          borderBottom: '1px solid rgba(125, 220, 232, 0.12)',
        }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(125, 220, 232, 0.12)', border: '1px solid rgba(125, 220, 232, 0.3)', padding: '4px 14px', borderRadius: '30px', marginBottom: '18px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#7DDCE8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {topic.category}
            </span>
          </div>
          <h1
            style={{
              fontSize: 'clamp(2rem, 3.6vw, 3.2rem)',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.22,
              marginBottom: '16px',
            }}
          >
            {topic.title}
          </h1>
          <p
            style={{
              fontSize: '16.5px',
              lineHeight: 1.7,
              color: '#CBD5E1',
              maxWidth: '820px',
              margin: '0 auto 28px',
            }}
          >
            {topic.subtitle}
          </p>

          {/* Quick Metrics Badges */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(11, 45, 66, 0.65)', border: '1px solid rgba(125, 220, 232, 0.25)', borderRadius: '12px', padding: '12px 20px', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block' }}>
                Suhu Penyimpanan Optimal
              </span>
              <strong style={{ fontSize: '18px', color: '#7DDCE8', fontWeight: 800 }}>
                {topic.optimalTemp}
              </strong>
            </div>
            <div style={{ background: 'rgba(11, 45, 66, 0.65)', border: '1px solid rgba(125, 220, 232, 0.25)', borderRadius: '12px', padding: '12px 20px', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block' }}>
                Ketahanan Kesegaran
              </span>
              <strong style={{ fontSize: '18px', color: '#FFFFFF', fontWeight: 800 }}>
                {topic.maxStorageDays}
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 24px' }}>
        {/* Overview & Context */}
        <div style={{ background: 'rgba(11, 45, 66, 0.45)', border: '1px solid rgba(125, 220, 232, 0.2)', borderRadius: '18px', padding: '36px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', marginBottom: '14px' }}>
            Ringkasan &amp; Latar Belakang
          </h2>
          <p style={{ fontSize: '15.5px', lineHeight: 1.8, color: '#CBD5E1', marginBottom: '18px' }}>
            {topic.overview}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '24px' }}>
            <div style={{ background: 'rgba(7, 26, 39, 0.75)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '12px', padding: '20px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#F87171', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                TANTANGAN KONVENSIONAL
              </span>
              <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#E2E8F0', marginTop: '8px', margin: 0 }}>
                {topic.challenge}
              </p>
            </div>
            <div style={{ background: 'rgba(7, 26, 39, 0.75)', border: '1px solid rgba(125, 220, 232, 0.3)', borderRadius: '12px', padding: '20px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#7DDCE8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                SOLUSI TERINTEGRASI TEMBOX
              </span>
              <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#E2E8F0', marginTop: '8px', margin: 0 }}>
                {topic.solution}
              </p>
            </div>
          </div>
        </div>

        {/* Key Features Grid */}
        <div style={{ marginBottom: '50px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', marginBottom: '20px' }}>
            Fitur Unggulan Sistem
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {topic.keyFeatures.map((feat, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(11, 45, 66, 0.45)',
                  border: '1px solid rgba(125, 220, 232, 0.18)',
                  borderRadius: '14px',
                  padding: '24px',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#7DDCE8', marginBottom: '8px', textTransform: 'uppercase' }}>
                  MODUL 0{idx + 1}
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: '13.5px', color: '#94A3B8', lineHeight: 1.65, margin: 0 }}>
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div style={{ marginBottom: '50px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', marginBottom: '20px' }}>
            Pertanyaan Umum (FAQ)
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {topic.faqs.map((faq, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(11, 45, 66, 0.45)',
                  border: '1px solid rgba(125, 220, 232, 0.2)',
                  borderRadius: '12px',
                  padding: '22px 26px',
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#7DDCE8', marginBottom: '8px' }}>
                  {faq.question}
                </h3>
                <p style={{ fontSize: '14px', color: '#CBD5E1', lineHeight: 1.7, margin: 0 }}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Internal Linking SEO Grid: Related Categories */}
        <div style={{ background: '#092233', border: '1px solid rgba(125, 220, 232, 0.18)', borderRadius: '18px', padding: '32px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
            Eksplorasi Topik &amp; Kategori Rantai Dingin Terkait
          </h2>
          <p style={{ fontSize: '13.5px', color: '#94A3B8', marginBottom: '20px' }}>
            Telusuri panduan teknis dan spesifikasi pemantauan palka untuk komoditas serta armada lainnya:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {relatedTopics.map((rel) => (
              <Link
                key={rel.slug}
                href={`/kategori/${rel.slug}`}
                style={{
                  background: 'rgba(7, 26, 39, 0.8)',
                  border: '1px solid rgba(125, 220, 232, 0.2)',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  display: 'block',
                  transition: 'border-color 0.2s ease',
                }}
              >
                <span style={{ color: '#7DDCE8', display: 'block', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>
                  {rel.category}
                </span>
                {rel.title}
              </Link>
            ))}
          </div>

          {/* Quick Commodity Cloud */}
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
              Komoditas Perikanan Populer:
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {COMMODITIES.map((c) => (
                <Link
                  key={c.slug}
                  href={`/kategori/monitoring-suhu-palka-${c.slug}`}
                  style={{
                    background: 'rgba(125, 220, 232, 0.08)',
                    border: '1px solid rgba(125, 220, 232, 0.2)',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    color: '#CBD5E1',
                    textDecoration: 'none',
                  }}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Consultation */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0B2D42 0%, #071A27 100%)',
            border: '1.5px solid #0284C7',
            borderRadius: '18px',
            padding: '36px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '10px' }}>
            Konsultasikan Kebutuhan Palka Armada Anda
          </h2>
          <p style={{ fontSize: '14.5px', color: '#CBD5E1', maxWidth: '640px', margin: '0 auto 22px', lineHeight: 1.65 }}>
            Dapatkan rekomendasi retrofit alat pemantau suhu TEMBOX yang tepat untuk kotak coolbox atau palka kapal nelayan Anda.
          </p>
          <Link
            href="/contact"
            style={{
              display: 'inline-block',
              background: '#0284C7',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '14.5px',
              padding: '13px 32px',
              borderRadius: '10px',
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)',
            }}
          >
            Hubungi Tim Teknis TEMBOX
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ background: '#051420', borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          <img
            src="/LogoTembox-Horizontal.png"
            alt="TEMBOX"
            width={120}
            height={30}
            style={{ width: '120px', height: '30px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
          />
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
            © 2025 TEMBOX — Maritime IoT Cold Chain System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

