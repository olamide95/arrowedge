import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, ArrowUpRight } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import Newsletter from './Newsletter';
import { SERVICES } from '@/lib/data/services';

const QUICK = [
  { href: '/about', label: 'About the firm' },
  { href: '/team', label: 'Our people' },
  { href: '/projects', label: 'Engagements' },
  { href: '/blog', label: 'Insights' },
  { href: '/contact', label: 'Contact' },
  { href: '/contact#book', label: 'Book a consultation' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="grain bg-ink text-ink-300">
      <div className="container-ae">
        <div className="grid gap-12 border-b border-ink-700 py-16 lg:grid-cols-12 lg:gap-8 lg:py-20">
          <div className="lg:col-span-4">
            <Logo invert />
            <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed text-ink-400">
              Chartered audit, tax advisory, debt recovery and business advisory for
              Nigerian enterprises and public institutions. Based in Abuja, engaged nationally.
            </p>
            <address className="mt-7 space-y-3.5 not-italic text-[0.9rem]">
              <p className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" strokeWidth={1.6} aria-hidden />
                <span>Suite 3, Ajami Plaza, Behind Abuja University,<br />Area 3, Garki, Abuja, FCT</span>
              </p>
              <p className="flex gap-3">
                <Phone className="h-4 w-4 shrink-0 text-gold-500" strokeWidth={1.6} aria-hidden />
                <a href="tel:+2348035989359" className="link-underline hover:text-gold-300">+234 803 598 9359</a>
              </p>
              <p className="flex gap-3">
                <Mail className="h-4 w-4 shrink-0 text-gold-500" strokeWidth={1.6} aria-hidden />
                <a href="mailto:info@arrow-edge.org.ng" className="link-underline hover:text-gold-300">info@arrow-edge.org.ng</a>
              </p>
              <p className="flex gap-3">
                <Clock className="h-4 w-4 shrink-0 text-gold-500" strokeWidth={1.6} aria-hidden />
                <span>Monday – Friday, 08:00 – 18:00</span>
              </p>
            </address>
          </div>

          <div className="lg:col-span-2">
            <h2 className="font-mark text-[0.72rem] uppercase tracking-[0.25em] text-gold-400">Services</h2>
            <ul className="mt-5 space-y-2.5 text-[0.9rem]">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="link-underline hover:text-gold-300">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="font-mark text-[0.72rem] uppercase tracking-[0.25em] text-gold-400">Quick links</h2>
            <ul className="mt-5 space-y-2.5 text-[0.9rem]">
              {QUICK.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link-underline hover:text-gold-300">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h2 className="font-mark text-[0.72rem] uppercase tracking-[0.25em] text-gold-400">
              The Arrow-Edge Brief
            </h2>
            <p className="mt-5 text-[0.9rem] leading-relaxed text-ink-400">
              Plain-English notes on tax deadlines, regulatory change and what it means
              for Nigerian businesses.
            </p>
            <div className="mt-5"><Newsletter tone="ink" /></div>

            <Link
              href="/contact#book"
              className="group mt-8 inline-flex items-center gap-2 text-[0.9rem] font-medium text-gold-300"
            >
              Start a conversation
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 py-7 text-[0.8rem] text-ink-500 sm:flex-row">
          <p>© {year} Arrow-Edge Professional Services. All rights reserved.</p>
          <nav aria-label="Legal" className="flex gap-6">
            <Link href="/privacy" className="hover:text-gold-300">Privacy</Link>
            <Link href="/terms" className="hover:text-gold-300">Terms</Link>
            <Link href="/sitemap.xml" className="hover:text-gold-300">Sitemap</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
