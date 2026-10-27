import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';

export default function CtaBand() {
  return (
    <section className="relative overflow-hidden bg-gold-sheen">
      {/* Repeating arc watermark, faint, drawn from the logo */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.1]" aria-hidden>
        <defs>
          <pattern id="arcs" width="150" height="150" patternUnits="userSpaceOnUse">
            <ellipse cx="75" cy="75" rx="58" ry="66" fill="none" stroke="#12110D" strokeWidth="9" transform="rotate(-24 75 75)" />
            <ellipse cx="75" cy="75" rx="32" ry="38" fill="none" stroke="#12110D" strokeWidth="5" transform="rotate(-24 75 75)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#arcs)" />
      </svg>

      <div className="container-ae relative py-20 text-center sm:py-24">
        <h2 data-reveal className="mx-auto max-w-3xl text-[2rem] leading-[1.1] tracking-[-0.02em] text-ink sm:text-[2.9rem]">
          Tell us what is keeping you up, and we will tell you what it takes to fix it.
        </h2>
        <p data-reveal data-reveal-delay="80" className="mx-auto mt-6 max-w-xl text-[1.02rem] leading-relaxed text-ink-700">
          A first conversation costs nothing and commits you to nothing. If we are not
          the right firm for the matter, we will say so and point you somewhere better.
        </p>
        <div data-reveal data-reveal-delay="160" className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/contact#book" className="btn btn-primary btn-lg group">
            Book a consultation
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
          <a href="tel:+2348035989359" className="btn btn-lg border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-white">
            <Phone className="h-4 w-4" strokeWidth={1.8} aria-hidden />
            Call the office
          </a>
        </div>
      </div>
    </section>
  );
}
