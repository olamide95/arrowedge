import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

/** Shared masthead for inner pages, with the breadcrumb trail. */
export default function PageHero({
  eyebrow, title, lead, trail = [],
}: {
  eyebrow: string; title: React.ReactNode; lead?: string;
  trail?: { name: string; path: string }[];
}) {
  return (
    <section className="relative overflow-hidden bg-ink grain">
      <svg
        className="pointer-events-none absolute -right-24 -top-24 h-[30rem] w-[30rem] opacity-[0.13]"
        viewBox="0 0 400 400" fill="none" aria-hidden
      >
        <g stroke="#A88A28" fill="none" strokeLinecap="round">
          <ellipse cx="200" cy="205" rx="150" ry="168" strokeWidth="26" transform="rotate(-24 200 205)" />
          <ellipse cx="200" cy="205" rx="100" ry="116" strokeWidth="15" transform="rotate(-24 200 205)" opacity=".7" />
        </g>
      </svg>
      <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-gold-500/10 blur-[100px]" />

      <div className="container-ae relative py-16 sm:py-20 lg:py-24">
        {trail.length > 0 && (
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-[0.8rem] text-ink-400">
              <li><Link href="/" className="hover:text-gold-300">Home</Link></li>
              {trail.map((t, i) => (
                <li key={t.path} className="flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5 text-ink-600" aria-hidden />
                  {i === trail.length - 1
                    ? <span className="text-gold-400" aria-current="page">{t.name}</span>
                    : <Link href={t.path} className="hover:text-gold-300">{t.name}</Link>}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="mt-7 flex items-center gap-3">
          <span className="rule-gold" />
          <span className="eyebrow text-gold-400">{eyebrow}</span>
        </div>

        <h1 className="mt-5 max-w-3xl text-[2.3rem] leading-[1.08] tracking-[-0.025em] text-white sm:text-[3.1rem] lg:text-[3.5rem]">
          {title}
        </h1>

        {lead && (
          <p className="mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-ink-300">{lead}</p>
        )}
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-500/45 to-transparent" />
    </section>
  );
}
