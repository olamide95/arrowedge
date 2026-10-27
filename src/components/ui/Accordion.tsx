'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-ink-100 border-y border-ink-100">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} data-reveal data-reveal-delay={i * 60}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                className="group flex w-full items-start justify-between gap-6 py-6 text-left"
              >
                <span className={cn(
                  'font-display text-lg leading-snug transition-colors sm:text-xl',
                  isOpen ? 'text-gold-700' : 'text-ink group-hover:text-gold-700',
                )}>
                  {item.q}
                </span>
                <Plus
                  className={cn(
                    'mt-1 h-5 w-5 shrink-0 text-gold-500 transition-transform duration-300',
                    isOpen && 'rotate-45',
                  )}
                  strokeWidth={1.5} aria-hidden
                />
              </button>
            </h3>
            {/* Grid-rows trick animates to the content's natural height — a
                fixed max-height would clip long answers or lag on short ones. */}
            <div
              id={`faq-panel-${i}`}
              className={cn(
                'grid transition-all duration-400 ease-out',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="overflow-hidden">
                <p className="pb-7 pr-12 leading-relaxed text-ink-500">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
