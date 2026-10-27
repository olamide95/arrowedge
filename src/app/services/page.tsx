import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import PageHero from '@/components/site/PageHero';
import { Section } from '@/components/ui/Section';
import ServiceIcon from '@/components/ui/ServiceIcon';
import CtaBand from '@/components/home/CtaBand';
import { SERVICES } from '@/lib/data/services';
import { pageMetadata, breadcrumbLd, serviceLd } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Our Services',
  description:
    'Tax consultation, audit and assurance, debt recovery, business advisory, business ' +
    'support and risk management — delivered by chartered professionals in Abuja.',
  path: '/services',
  keywords: ['tax consultation Nigeria', 'audit services Abuja', 'debt recovery', 'business advisory Nigeria'],
});

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbLd([{ name: 'Services', path: '/services' }]),
            ...SERVICES.map(serviceLd),
          ]),
        }}
      />

      <PageHero
        eyebrow="Our services"
        title={<>Six practices, under <span className="text-gradient-gold">one roof</span></>}
        lead="Most problems that reach us do not arrive neatly labelled. Keeping these capabilities together means you are not repeating your story to a third firm."
        trail={[{ name: 'Services', path: '/services' }]}
      />

      <Section tone="cream">
        <div className="container-ae space-y-6">
          {SERVICES.map((s, i) => (
            <article
              key={s.slug}
              data-reveal data-reveal-delay={i * 60}
              className="card card-hover grid gap-8 p-8 lg:grid-cols-12 lg:p-10"
            >
              <div className="lg:col-span-4">
                <span className="grid h-14 w-14 place-items-center rounded-xl bg-ink text-gold-400">
                  <ServiceIcon name={s.icon} className="h-6 w-6" />
                </span>
                <h2 className="mt-6 text-[1.6rem] leading-snug">{s.title}</h2>
                <p className="mt-2 text-[0.85rem] font-medium tracking-wide text-gold-600">{s.tagline}</p>
                <p className="mt-4 leading-relaxed text-ink-500">{s.summary}</p>
                <Link
                  href={`/services/${s.slug}`}
                  className="group mt-6 inline-flex items-center gap-1.5 text-[0.88rem] font-medium text-ink hover:text-gold-700"
                >
                  Full detail
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                </Link>
              </div>

              <div className="lg:col-span-8">
                <p className="font-mark text-[0.66rem] uppercase tracking-[0.24em] text-gold-600">
                  What this covers
                </p>
                <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {s.deliverables.map((d) => (
                    <li key={d} className="flex gap-2.5 text-[0.9rem] leading-snug text-ink-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" strokeWidth={2.2} aria-hidden />
                      <span dangerouslySetInnerHTML={{ __html: d }} />
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
