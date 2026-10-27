import type { Metadata } from 'next';
import type { Post } from '@/types';

export const SITE = {
  name: 'Arrow-Edge Professional Services',
  shortName: 'Arrow-Edge',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://arrow-edge.org.ng',
  description:
    'Chartered audit, tax advisory, debt recovery and business advisory for ' +
    'Nigerian enterprises and public institutions. Abuja-based, nationally engaged.',
  locale: 'en_NG',
  phone: '+2348035989359',
  email: 'info@arrow-edge.org.ng',
  address: {
    street: 'Suite 3, Ajami Plaza, Behind Abuja University',
    locality: 'Area 3, Garki',
    region: 'FCT',
    country: 'NG',
  },
  hours: 'Mo-Fr 08:00-18:00',
} as const;

export function pageMetadata(opts: {
  title: string; description: string; path: string;
  image?: string; noIndex?: boolean; keywords?: string[];
}): Metadata {
  const url = `${SITE.url}${opts.path}`;
  const image = opts.image ?? `${SITE.url}/brand/og-default.png`;
  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords,
    // Canonical on every page: without it, the same article reachable via a
    // category path or a tracking parameter splits its own ranking signal.
    alternates: { canonical: url },
    robots: opts.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: 'website', url, siteName: SITE.name, locale: SITE.locale,
      title: opts.title, description: opts.description,
      images: [{ url: image, width: 1200, height: 630, alt: opts.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title, description: opts.description, images: [image],
    },
  };
}

export function postMetadata(post: Post): Metadata {
  const url = `${SITE.url}/blog/${post.slug}`;
  const image = post.coverImage ?? `${SITE.url}/brand/og-default.png`;
  return {
    title: post.seo.title || post.title,
    description: post.seo.description || post.excerpt,
    keywords: post.seo.keywords.length ? post.seo.keywords : post.tags,
    authors: [{ name: post.author.name }],
    alternates: { canonical: url },
    robots: post.seo.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: 'article', url, siteName: SITE.name, locale: SITE.locale,
      title: post.seo.title || post.title,
      description: post.seo.description || post.excerpt,
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      modifiedTime: new Date(post.updatedAt).toISOString(),
      authors: [post.author.name],
      tags: post.tags,
      images: [{ url: image, width: 1200, height: 630, alt: post.coverAlt || post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo.title || post.title,
      description: post.seo.description || post.excerpt,
      images: [image],
    },
  };
}

/* ── JSON-LD ───────────────────────────────────────────────────────────────
   Structured data is what earns the rich result in search: the firm's details
   in a knowledge panel, the article's byline and date under its headline, and
   the breadcrumb trail above it. Without it Google has to infer all of that
   from the prose, and usually doesn't.                                      */

export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['ProfessionalService', 'AccountingService'],
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    alternateName: SITE.shortName,
    url: SITE.url,
    logo: `${SITE.url}/brand/logo.png`,
    image: `${SITE.url}/brand/logo.png`,
    description: SITE.description,
    telephone: SITE.phone,
    email: SITE.email,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
    openingHours: SITE.hours,
    areaServed: { '@type': 'Country', name: 'Nigeria' },
    knowsAbout: [
      'Tax consultation', 'Tax audit', 'Statutory audit', 'Debt recovery',
      'Business advisory', 'Risk management', 'Internal control',
    ],
  };
}

export function articleLd(post: Post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${SITE.url}/blog/${post.slug}/#article`,
    headline: post.title,
    description: post.seo.description || post.excerpt,
    image: post.coverImage ? [post.coverImage] : [`${SITE.url}/brand/og-default.png`],
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    dateModified: new Date(post.updatedAt).toISOString(),
    author: { '@type': 'Person', name: post.author.name, jobTitle: post.author.role },
    publisher: { '@id': `${SITE.url}/#organization` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE.url}/blog/${post.slug}` },
    keywords: post.tags.join(', '),
    articleSection: post.category,
    wordCount: post.content.split(/\s+/).filter(Boolean).length,
    inLanguage: 'en-NG',
  };
}

export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.path}`,
    })),
  };
}

export function faqLd(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

export function serviceLd(s: { title: string; summary: string; slug: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.title,
    description: s.summary,
    url: `${SITE.url}/services/${s.slug}`,
    provider: { '@id': `${SITE.url}/#organization` },
    areaServed: { '@type': 'Country', name: 'Nigeria' },
  };
}
