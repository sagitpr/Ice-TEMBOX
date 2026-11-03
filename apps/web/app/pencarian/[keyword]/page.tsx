import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  resolveSeoTopic,
  COMMODITIES,
  REGIONS,
  FOCUS_TOPICS,
} from '../../lib/seo-data';

interface Props {
  params: Promise<{
    keyword: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = await params;
  const rawKeyword = decodeURIComponent(resolved.keyword || '').replace(/-/g, ' ');
  const topic = resolveSeoTopic(resolved.keyword);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ice-tembox.vercel.app';

  return {
    title: `Pencarian: ${rawKeyword} | TEMBOX IoT`,
    description: `Hasil telusur dan panduan teknis pemantauan suhu palka, rantai dingin, dan teknologi IoT untuk kata kunci: ${rawKeyword}.`,
    alternates: {
      canonical: `${baseUrl}/pencarian/${resolved.keyword}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function SearchKeywordPage({ params }: Props) {
  const resolved = await params;
  const rawKeyword = decodeURIComponent(resolved.keyword || '').replace(/-/g, ' ');
  const topic = resolveSeoTopic(resolved.keyword);

  return (
    <div style={{ backgroundColor: '#071A27', color: '#E2E8F0', minHeight: '100vh' }}>
      {/* Header */}
      <header
        style={{
          background: 'rgba(7, 26, 39, 0.94)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(125, 220, 232, 0.15)',
          padding: '16px 24px',
        }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/">
            <img
              src="/LogoTembox-Horizontal.png"
              alt="TEMBOX"
              width={130}
              height={34}
              style={{ width: '130px', height: '34px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
            />
          </Link>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link href="/" style={{ color: '#CBD5E1', fontSize: '14px', textDecoration: 'none' }}>Beranda</Link>
            <Link href="/about" style={{ color: '#CBD5E1', fontSize: '14px', textDecoration: 'none' }}>About</Link>
            <Link href="/contact" style={{ color: '#7DDCE8', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}>Contact</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ padding: '60px 24px 30px', background: '#092233', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#7DDCE8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            HASIL PENCARIAN &amp; DIREKTORI TOPIK
          </span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: '#FFFFFF', fontWeight: 800, marginTop: '10px', marginBottom: '14px' }}>
            Kata Kunci: &ldquo;{rawKeyword}&rdquo;
          </h1>
          <p style={{ fontSize: '15px', color: '#94A3B8', margin: 0 }}>
            Ditemukan rekomendasi panduan teknis dan sistem IoT pemantauan suhu palka yang relevan:
          </p>
        </div>
      </section>

      {/* Search Result Card */}
      <main style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px' }}>
        <div
          style={{
            background: 'rgba(11, 45, 66, 0.45)',
            border: '1.5px solid rgba(125, 220, 232, 0.3)',
            borderRadius: '16px',
            padding: '30px',
            marginBottom: '32px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#7DDCE8', textTransform: 'uppercase' }}>
                REKOMENDASI UTAMA
              </span>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', margin: '6px 0 0' }}>
                {topic.title}
              </h2>
            </div>
            <span style={{ background: 'rgba(125, 220, 232, 0.15)', color: '#7DDCE8', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
              Suhu: {topic.optimalTemp}
            </span>
          </div>
          <p style={{ fontSize: '14.5px', color: '#CBD5E1', lineHeight: 1.7, marginBottom: '20px' }}>
            {topic.overview}
          </p>
          <Link
            href={`/kategori/${topic.slug}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#0284C7',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '13.5px',
              padding: '10px 20px',
              borderRadius: '8px',
              textDecoration: 'none',
            }}
          >
            <span>Buka Panduan Lengkap</span>
            <span>→</span>
          </Link>
        </div>

        {/* Explore Categories */}
        <div style={{ background: '#092233', borderRadius: '16px', padding: '28px', border: '1px solid rgba(125, 220, 232, 0.18)' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', marginBottom: '14px' }}>
            Telusuri Kategori Terkait Lainnya:
          </h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {FOCUS_TOPICS.map((f) => (
              <Link
                key={f.slug}
                href={`/kategori/${f.slug}`}
                style={{
                  background: 'rgba(7, 26, 39, 0.8)',
                  border: '1px solid rgba(125, 220, 232, 0.25)',
                  color: '#CBD5E1',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                {f.title}
              </Link>
            ))}
            {COMMODITIES.map((c) => (
              <Link
                key={c.slug}
                href={`/kategori/monitoring-suhu-palka-${c.slug}`}
                style={{
                  background: 'rgba(125, 220, 232, 0.08)',
                  border: '1px solid rgba(125, 220, 232, 0.2)',
                  color: '#7DDCE8',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

