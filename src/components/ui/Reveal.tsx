'use client';

import { useEffect } from 'react';

/**
 * Adds `.in` to any [data-reveal] element as it enters the viewport.
 *
 * Mounted once at the root rather than wrapping each element in its own
 * observer component — one IntersectionObserver for the whole page instead of
 * dozens, and markup that stays plain HTML.
 */
export default function Reveal() {
  useEffect(() => {
    // Marks the document as JS-capable. The CSS only hides elements under
    // `html.js`, so without JS nothing is ever stuck invisible.
    document.documentElement.classList.add('js');

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nodes = document.querySelectorAll<HTMLElement>('[data-reveal]');

    if (reduce) {
      nodes.forEach((n) => n.classList.add('in'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const delay = Number(el.dataset.revealDelay ?? 0);
          window.setTimeout(() => el.classList.add('in'), delay);
          io.unobserve(el);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return null;
}
