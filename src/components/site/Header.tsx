'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { SERVICES } from '@/lib/data/services';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services', mega: true },
  { href: '/projects', label: 'Engagements' },
  { href: '/blog', label: 'Insights' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close everything on navigation — otherwise the menu stays open over the
  // page you just moved to.
  useEffect(() => { setMobileOpen(false); setServicesOpen(false); }, [pathname]);

  // Lock the body while the mobile sheet is open, so the page behind it does
  // not scroll under your finger.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMobileOpen(false); setServicesOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      {/* Utility strip — hidden once scrolling starts so the header slims down */}
      <div
        className={cn(
          'hidden overflow-hidden bg-ink text-ink-300 transition-all duration-500 lg:block',
          scrolled ? 'h-0 opacity-0' : 'h-10 opacity-100',
        )}
      >
        <div className="container-ae flex h-10 items-center justify-between text-[0.78rem]">
          <p className="tracking-wide">
            Suite 3, Ajami Plaza, Area 3, Abuja
            <span className="mx-3 text-ink-600">|</span>
            Mon – Fri, 08:00 – 18:00
          </p>
          <div className="flex items-center gap-5">
            <a href="mailto:info@arrow-edge.org.ng" className="link-underline hover:text-gold-300">
              info@arrow-edge.org.ng
            </a>
            <a href="tel:+2348035989359" className="flex items-center gap-2 font-medium text-gold-300">
              <Phone className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
              +234 803 598 9359
            </a>
          </div>
        </div>
      </div>

      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-500',
          scrolled
            ? 'border-b border-ink-100 bg-white/85 shadow-lift backdrop-blur-xl'
            : 'bg-white',
        )}
      >
        <div className="container-ae flex h-20 items-center justify-between gap-6 lg:h-24">
          <Logo priority />

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) =>
              item.mega ? (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <Link
                    href={item.href}
                    aria-expanded={servicesOpen}
                    className={cn(
                      'flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[0.9rem] transition-colors',
                      isActive(item.href) ? 'text-gold-700' : 'text-ink-600 hover:text-ink',
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn('h-3.5 w-3.5 transition-transform', servicesOpen && 'rotate-180')}
                      strokeWidth={2} aria-hidden
                    />
                  </Link>

                  <div
                    className={cn(
                      'absolute left-1/2 top-full w-[34rem] -translate-x-1/2 pt-3 transition-all duration-300',
                      servicesOpen
                        ? 'pointer-events-auto translate-y-0 opacity-100'
                        : 'pointer-events-none -translate-y-1 opacity-0',
                    )}
                  >
                    <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white p-2 shadow-liftLg">
                      <div className="grid grid-cols-2 gap-1">
                        {SERVICES.map((s) => (
                          <Link
                            key={s.slug}
                            href={`/services/${s.slug}`}
                            className="group rounded-xl p-3.5 transition-colors hover:bg-ink-50"
                          >
                            <span className="block text-[0.9rem] font-medium text-ink group-hover:text-gold-700">
                              {s.title}
                            </span>
                            <span className="mt-1 block text-[0.78rem] leading-snug text-ink-400">
                              {s.tagline}
                            </span>
                          </Link>
                        ))}
                      </div>
                      <Link
                        href="/services"
                        className="mt-1 block rounded-xl bg-ink-50 px-4 py-3 text-center text-[0.82rem] font-medium text-gold-700 transition-colors hover:bg-gold-50"
                      >
                        View all services →
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'rounded-full px-4 py-2.5 text-[0.9rem] transition-colors',
                    isActive(item.href) ? 'text-gold-700' : 'text-ink-600 hover:text-ink',
                  )}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/contact#book" className="btn btn-gold btn-md hidden sm:inline-flex">
              Book a consultation
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="grid h-11 w-11 place-items-center rounded-full border border-ink-200 text-ink lg:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sheet */}
      <div
        className={cn(
          'fixed inset-0 z-40 lg:hidden',
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        aria-hidden={!mobileOpen}
      >
        <div
          onClick={() => setMobileOpen(false)}
          className={cn(
            'absolute inset-0 bg-ink/45 backdrop-blur-sm transition-opacity duration-400',
            mobileOpen ? 'opacity-100' : 'opacity-0',
          )}
        />
        <nav
          aria-label="Mobile"
          className={cn(
            'absolute right-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-white px-6 pb-10 pt-28 transition-transform duration-400 ease-out',
            mobileOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <ul className="space-y-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'block rounded-xl px-4 py-3.5 font-display text-xl transition-colors',
                    isActive(item.href) ? 'bg-gold-50 text-gold-700' : 'text-ink hover:bg-ink-50',
                  )}
                >
                  {item.label}
                </Link>
                {item.mega && (
                  <ul className="mb-2 ml-4 mt-1 space-y-0.5 border-l border-ink-100 pl-4">
                    {SERVICES.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/services/${s.slug}`}
                          className="block py-2 text-[0.88rem] text-ink-500 hover:text-gold-700"
                        >
                          {s.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <Link href="/contact#book" className="btn btn-gold btn-lg mt-8 w-full">
            Book a consultation
          </Link>

          <div className="mt-8 space-y-2 border-t border-ink-100 pt-6 text-[0.86rem] text-ink-500">
            <a href="tel:+2348035989359" className="block hover:text-gold-700">+234 803 598 9359</a>
            <a href="mailto:info@arrow-edge.org.ng" className="block hover:text-gold-700">info@arrow-edge.org.ng</a>
            <p className="pt-2 leading-relaxed">Suite 3, Ajami Plaza,<br />Behind Abuja University, Area 3, Abuja</p>
          </div>
        </nav>
      </div>
    </>
  );
}
