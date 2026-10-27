'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

/** Sticky outline that highlights the heading currently in view. */
export default function TableOfContents({
  items,
}: { items: { id: string; text: string; level: 2 | 3 }[] }) {
  const [active, setActive] = useState<string>(items[0]?.id ?? '');

  useEffect(() => {
    if (!items.length) return;
    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => !!el);

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // Top-weighted band: a heading counts as "current" once it reaches the
      // upper third, which is where the eye actually is while reading.
      { rootMargin: '-90px 0px -66% 0px', threshold: 0 },
    );

    headings.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [items]);

  if (items.length < 3) return null; // not worth the furniture on a short piece

  return (
    <nav aria-label="On this page" className="sticky top-28">
      <p className="font-mark text-[0.68rem] uppercase tracking-[0.24em] text-gold-600">On this page</p>
      <ul className="mt-4 space-y-1 border-l border-ink-100">
        {items.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              className={cn(
                '-ml-px block border-l-2 py-1.5 text-[0.84rem] leading-snug transition-colors',
                i.level === 3 ? 'pl-7' : 'pl-4',
                active === i.id
                  ? 'border-gold-500 text-gold-700'
                  : 'border-transparent text-ink-400 hover:text-ink',
              )}
            >
              {i.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
