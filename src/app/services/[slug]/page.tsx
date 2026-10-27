import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Check, ArrowRight, ArrowUpRight } from 'lucide-react';
import PageHero from '@/components/site/PageHero';
import { Section } from '@/components/ui/Section';
import ServiceIcon from '@/components/ui/ServiceIcon';
import CtaBand from '@/components/home/CtaBand';
import { SERVICES, getService } from '@/lib/data/services';
import { pageMetadata, breadcrumbLd, serviceLd } from '@/lib/seo';

type Params = { params: Promise<{ slug: string }> };

// Six known services: pre-render them all at build time.
export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return pageMetadata({ title: 'Service not found', description: '', path: `/services/${slug}`, noIndex: true });

  return pageMetadata({
    title: service.title,
    description: service.summary,
    path: `/services/${service.slug}`,
    keywords: [service.title, ...service.deliverables.slice(0, 4)],
  });
}

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const others = SERVICES.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbLd([
              { name: 'Services', path: '/services' },
              { name: service.title, path: `/services/${service.slug}` },
            ]),
            serviceLd(service),
          ]),
        }}
      />

      <PageHero
        eyebrow={service.tagline}
        title={service.title}
        lead={service.summary}
        trail={[
          { name: 'Services', path: '/services' },
          { name: service.title, path: `/services/${service.slug}` },
        ]}
      />

      <Section>
        <div className="container-ae grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div data-reveal>
              <div className="flex items-center gap-3">
                <span className="rule-gold" />
                <span className="eyebrow">What this covers</span>
              </div>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {service.deliverables.map((d) => (
                  <li key={d} className="flex gap-3 rounded-xl border border-ink-100 bg-white p-4 text-[0.9rem] leading-snug text-ink-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" strokeWidth={2.2} aria-hidden />
                    <span dangerouslySetInnerHTML={{ __html: d }} />
                  </li>
                ))}
              </ul>
            </div>

            <div data-reveal data-reveal-delay="100" className="mt-14">
              <div className="flex items-center gap-3">
                <span className="rule-gold" />
                <span className="eyebrow">How the engagement runs</span>
              </div>
              <ol className="mt-7 space-y-5">
                {service.process.map((p, i) => (
                  <li key={p.step} className="flex gap-5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink font-display text-[0.95rem] text-gold-400">
                      {i + 1}
                    </span>
                    <div className="pt-1.5">
                      <h3 className="text-[1.08rem]">{p.step}</h3>
                      <p className="mt-1.5 leading-relaxed text-ink-500">{p.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div data-reveal data-reveal-delay="120" className="sticky top-28 space-y-5">
              <div className="rounded-2xl bg-ink p-8 text-ink-300 grain">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold-500 text-ink">
                  <ServiceIcon name={service.icon} className="h-6 w-6" />
                </span>
                <h2 className="mt-6 font-display text-[1.35rem] text-white">What you end up with</h2>
                <ul className="mt-5 space-y-3.5">
                  {service.outcomes.map((o) => (
                    <li key={o} className="flex gap-3 text-[0.9rem] leading-relaxed">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" strokeWidth={2.2} aria-hidden />
                      {o}
                    </li>
                  ))}
                </ul>
                <Link href="/contact#book" className="btn btn-gold btn-md group mt-8 w-full">
                  Discuss this service
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </Link>
              </div>

              <div className="card p-7">
                <p className="font-mark text-[0.66rem] uppercase tracking-[0.24em] text-gold-600">
                  Also relevant
                </p>
                <ul className="mt-4 space-y-1">
                  {others.map((o) => (
                    <li key={o.slug}>
                      <Link
                        href={`/services/${o.slug}`}
                        className="group flex items-center justify-between gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-ink-50"
                      >
                        <span>
                          <span className="block text-[0.92rem] font-medium text-ink group-hover:text-gold-700">{o.title}</span>
                          <span className="mt-0.5 block text-[0.78rem] text-ink-400">{o.tagline}</span>
                        </span>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-300 transition-all group-hover:text-gold-600" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
