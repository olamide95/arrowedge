import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="relative grid min-h-[70vh] place-items-center overflow-hidden bg-ink grain px-5 py-24">
      <svg className="pointer-events-none absolute -right-32 -top-20 h-[34rem] w-[34rem] opacity-[0.12]" viewBox="0 0 400 400" fill="none" aria-hidden>
        <g stroke="#A88A28" fill="none" strokeLinecap="round">
          <ellipse cx="200" cy="205" rx="150" ry="168" strokeWidth="26" transform="rotate(-24 200 205)" />
          <ellipse cx="200" cy="205" rx="100" ry="116" strokeWidth="15" transform="rotate(-24 200 205)" opacity=".7" />
        </g>
      </svg>

      <div className="relative max-w-lg text-center">
        <p className="font-display text-[5rem] leading-none text-gold-500 sm:text-[7rem]">404</p>
        <h1 className="mt-4 text-[1.9rem] leading-snug text-white sm:text-[2.3rem]">
          That page is not on the books.
        </h1>
        <p className="mt-5 leading-relaxed text-ink-300">
          The link may be out of date, or the page may have moved. Let us get you back
          to something useful.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn btn-gold btn-lg">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to home
          </Link>
          <Link href="/blog" className="btn btn-lg border border-ink-600 text-ink-200 hover:border-gold-500 hover:text-gold-300">
            <Search className="h-4 w-4" aria-hidden /> Browse insights
          </Link>
        </div>
      </div>
    </section>
  );
}
