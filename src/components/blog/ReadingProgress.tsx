'use client';

import { useEffect, useState } from 'react';

/** Thin gold bar showing how far through the article the reader is. */
export default function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setPct(max <= 0 ? 0 : Math.min(100, (window.scrollY / max) * 100));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent"
      role="progressbar"
      aria-label="Article reading progress"
      aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}
    >
      <div
        className="h-full bg-gold-sheen transition-[width] duration-150 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
