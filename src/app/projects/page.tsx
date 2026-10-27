'use client';

import { useState } from 'react';
import { Building2, Landmark } from 'lucide-react';
import PageHero from '@/components/site/PageHero';
import { Section } from '@/components/ui/Section';
import CtaBand from '@/components/home/CtaBand';
import { ENGAGEMENTS, ENGAGEMENT_TYPES } from '@/lib/data/clients';
import { cn } from '@/lib/utils';

export default function ProjectsPage() {
  const [filter, setFilter] = useState<string>('All');
  const visible = ENGAGEMENTS.filter((e) => filter === 'All' || e.type === filter);

  return (
    <>
      <PageHero
        eyebrow="Engagements"
        title={<>Work we have been <span className="text-gradient-gold">trusted with</span></>}
        lead="Federal institutions, state revenue authorities and private enterprise. A selection of the organisations that have engaged the firm."
        trail={[{ name: 'Engagements', path: '/projects' }]}
      />

      <Section tone="cream">
        <div className="container-ae">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter engagements">
            {ENGAGEMENT_TYPES.map((t) => (
              <button
                key={t} type="button" role="tab" aria-selected={filter === t}
                onClick={() => setFilter(t)}
                className={cn(
                  'rounded-full px-5 py-2.5 text-[0.85rem] transition-all duration-300',
                  filter === t
                    ? 'bg-ink text-white shadow-lift'
                    : 'border border-ink-200 bg-white text-ink-500 hover:border-gold-300 hover:text-gold-700',
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((e, i) => (
              <article
                key={e.name}
                data-reveal data-reveal-delay={(i % 3) * 80}
                className="card card-hover group flex flex-col p-7"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-ink-50 text-gold-600 transition-colors duration-500 group-hover:bg-ink group-hover:text-gold-400">
                  {e.sector === 'Public'
                    ? <Landmark className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                    : <Building2 className="h-5 w-5" strokeWidth={1.5} aria-hidden />}
                </span>
                <h2 className="mt-6 flex-1 text-[1.12rem] leading-snug">{e.name}</h2>
                <div className="mt-5 flex items-center gap-2 border-t border-ink-100 pt-4">
                  <span className="rounded-full bg-gold-50 px-3 py-1 text-[0.72rem] font-medium text-gold-700">
                    {e.type}
                  </span>
                  <span className="text-[0.72rem] text-ink-400">{e.sector} sector</span>
                </div>
              </article>
            ))}
          </div>

          <p data-reveal className="mt-12 max-w-2xl text-[0.88rem] leading-relaxed text-ink-400">
            Engagement details beyond the client name are held in confidence. Where a
            prospective client needs a reference, we will arrange one directly with the
            relevant organisation&apos;s permission.
          </p>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
