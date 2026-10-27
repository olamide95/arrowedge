import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Phone } from 'lucide-react';

const PROOF = [
  { value: '9+', label: 'Federal & state institutions served' },
  { value: '6', label: 'Practice areas under one roof' },
  { value: 'FCA', label: 'Chartered leadership' },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink grain">
      {/* The arc motif, lifted from the logo and blown up as architecture.
          Decorative only — hidden from assistive tech. */}
      <svg
        className="pointer-events-none absolute -right-40 -top-32 h-[46rem] w-[46rem] opacity-[0.16] sm:-right-24 lg:right-[-6rem]"
        viewBox="0 0 400 400" fill="none" aria-hidden
      >
        <defs>
          <linearGradient id="arcGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D9C27C" />
            <stop offset="55%" stopColor="#A88A28" />
            <stop offset="100%" stopColor="#6E5A1A" />
          </linearGradient>
        </defs>
        <g stroke="url(#arcGold)" fill="none" strokeLinecap="round">
          <ellipse cx="200" cy="205" rx="150" ry="168" strokeWidth="26" transform="rotate(-24 200 205)" />
          <ellipse cx="200" cy="205" rx="112" ry="128" strokeWidth="17" transform="rotate(-24 200 205)" opacity=".8" />
          <ellipse cx="200" cy="205" rx="74"  ry="88"  strokeWidth="11" transform="rotate(-24 200 205)" opacity=".6" />
          <path d="M292 68l34-20-6 39" strokeWidth="22" />
        </g>
      </svg>

      {/* Warm pool of light behind the headline */}
      <div className="pointer-events-none absolute -left-32 top-1/4 h-[32rem] w-[32rem] rounded-full bg-gold-500/12 blur-[120px]" />

      <div className="container-ae relative grid gap-16 py-20 sm:py-28 lg:grid-cols-12 lg:gap-12 lg:py-36">
        <div className="lg:col-span-7 xl:col-span-6">
          <div data-reveal className="flex items-center gap-3">
            <span className="rule-gold" />
            <span className="eyebrow text-gold-400">Abuja · Established practice</span>
          </div>

          <h1
            data-reveal data-reveal-delay="80"
            className="mt-7 text-[2.6rem] leading-[1.06] tracking-[-0.025em] text-white sm:text-[3.6rem] lg:text-[4.3rem]"
          >
            The complex, made
            <span className="block text-gradient-gold">straightforward.</span>
          </h1>

          <p
            data-reveal data-reveal-delay="160"
            className="mt-7 max-w-xl text-[1.08rem] leading-relaxed text-ink-300 sm:text-[1.15rem]"
          >
            Audit, tax, debt recovery and advisory for Nigerian enterprises and public
            institutions. We do the difficult reading, and hand you a decision you can act on.
          </p>

          <div data-reveal data-reveal-delay="240" className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/contact#book" className="btn btn-gold btn-lg group">
              Book a consultation
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
            <a
              href="tel:+2348035989359"
              className="btn btn-lg border border-ink-600 text-ink-200 hover:border-gold-500 hover:text-gold-300"
            >
              <Phone className="h-4 w-4" strokeWidth={1.8} aria-hidden />
              +234 803 598 9359
            </a>
          </div>

          <dl
            data-reveal data-reveal-delay="320"
            className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-ink-700 pt-8"
          >
            {PROOF.map((p) => (
              <div key={p.label}>
                <dt className="font-display text-3xl text-gold-400 sm:text-4xl">{p.value}</dt>
                <dd className="mt-2 text-[0.78rem] leading-snug text-ink-400">{p.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div data-reveal data-reveal-delay="200" className="lg:col-span-5 xl:col-span-6">
          <div className="relative mx-auto max-w-lg lg:ml-auto lg:mr-0">
            <div className="overflow-hidden rounded-[1.75rem] border border-ink-700 shadow-liftLg">
              <Image
                src="/team/group.jpg"
                alt="The Arrow-Edge Professional Services team"
                width={979} height={653} priority
                sizes="(max-width: 1024px) 90vw, 44vw"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Floating credential card — overlaps the photo to add depth */}
            <div className="absolute -bottom-7 -left-5 w-56 rounded-2xl border border-ink-100 bg-white p-5 shadow-liftLg sm:-left-9">
              <p className="font-mark text-[0.65rem] uppercase tracking-[0.22em] text-gold-600">
                Our commitment
              </p>
              <p className="mt-2.5 font-display text-[1.05rem] leading-snug text-ink">
                Trust, professionalism, results.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gold hairline marking the section edge */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
    </section>
  );
}
