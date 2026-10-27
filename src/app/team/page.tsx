import type { Metadata } from 'next';
import Image from 'next/image';
import PageHero from '@/components/site/PageHero';
import { Section } from '@/components/ui/Section';
import Monogram from '@/components/ui/Monogram';
import CtaBand from '@/components/home/CtaBand';
import { TEAM } from '@/lib/data/team';
import { pageMetadata, breadcrumbLd, SITE } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Our People',
  description:
    'Meet the chartered professionals behind Arrow-Edge Professional Services — ' +
    'audit, tax, advisory and recovery specialists based in Abuja.',
  path: '/team',
});

export default function TeamPage() {
  const peopleLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: TEAM.map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Person',
        name: m.name,
        jobTitle: m.role,
        worksFor: { '@id': `${SITE.url}/#organization` },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbLd([{ name: 'Our People', path: '/team' }]), peopleLd]),
        }}
      />

      <PageHero
        eyebrow="Our people"
        title={<>The names on <span className="text-gradient-gold">your file</span></>}
        lead="A partner stays with your engagement from scoping through to delivery. You will not be introduced to one team and handed to another."
        trail={[{ name: 'Our People', path: '/team' }]}
      />

      <Section tone="cream">
        <div className="container-ae">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((m, i) => (
              <article
                key={m.name}
                data-reveal data-reveal-delay={(i % 4) * 80}
                className="group overflow-hidden rounded-2xl bg-white shadow-lift transition-all duration-500 hover:-translate-y-1.5 hover:shadow-liftLg"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-ink-100">
                  {m.photo ? (
                    <Image
                      src={m.photo} alt={`${m.name}, ${m.role}`} fill
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 23vw"
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <Monogram name={m.name} className="h-full w-full" />
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-[1.05rem] leading-snug">{m.name}</h2>
                  <p className="mt-1.5 text-[0.8rem] font-medium tracking-wide text-gold-600">
                    {m.role}
                    {m.credentials && <span className="text-ink-400"> · {m.credentials}</span>}
                  </p>
                  {m.focus && (
                    <p className="mt-3 border-t border-ink-100 pt-3 text-[0.84rem] leading-relaxed text-ink-500">
                      {m.focus}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div data-reveal className="mt-14 overflow-hidden rounded-2xl shadow-liftLg">
            <Image
              src="/team/group.jpg" alt="The Arrow-Edge Professional Services team"
              width={979} height={653} sizes="(max-width: 1280px) 94vw, 78rem"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
