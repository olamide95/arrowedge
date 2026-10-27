import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter, Cinzel } from 'next/font/google';
import './globals.css';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import WhatsAppFab from '@/components/site/WhatsAppFab';
import Reveal from '@/components/ui/Reveal';
import { SITE, organizationLd } from '@/lib/seo';

// Self-hosted by next/font at build time: no render-blocking request to
// Google, no layout shift, and nothing leaks to a third party on page load.
const display = Playfair_Display({
  subsets: ['latin'], display: 'swap', variable: '--font-display', weight: ['400', '500', '600', '700'],
});
const sans = Inter({
  subsets: ['latin'], display: 'swap', variable: '--font-sans',
});
// Cinzel is Trajan-derived — the same lineage as the ARROW-EDGE wordmark, so
// eyebrow labels echo the logo instead of competing with it.
const mark = Cinzel({
  subsets: ['latin'], display: 'swap', variable: '--font-mark', weight: ['400', '600'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'Arrow-Edge Professional Services | Audit, Tax & Advisory in Abuja',
    template: '%s | Arrow-Edge Professional Services',
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    'audit firm Abuja', 'tax consultant Nigeria', 'chartered accountants Abuja',
    'debt recovery Nigeria', 'FIRS tax audit', 'statutory audit Nigeria',
    'business advisory Abuja', 'risk management Nigeria', 'tax clearance certificate',
  ],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  formatDetection: { telephone: true, address: true, email: true },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website', locale: SITE.locale, url: SITE.url, siteName: SITE.name,
    title: 'Arrow-Edge Professional Services | Audit, Tax & Advisory in Abuja',
    description: SITE.description,
    images: [{ url: '/brand/og-default.png', width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: { card: 'summary_large_image' },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: { icon: '/favicon.svg', apple: '/brand/logo.png' },
};

export const viewport: Viewport = {
  themeColor: '#A88A28',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG" className={`${display.variable} ${sans.variable} ${mark.variable}`}>
      <body>
        {/* Organization data sits in the root so it is present on every page —
            search engines build the knowledge panel from whichever page they
            happen to crawl first. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }}
        />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-5 focus:top-5 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>

        <Header />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppFab />
        <Reveal />
      </body>
    </html>
  );
}
