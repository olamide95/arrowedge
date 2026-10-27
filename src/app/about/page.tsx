import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Target, Eye, Gem, ArrowRight } from 'lucide-react';
import PageHero from '@/components/site/PageHero';
import { Section, SectionHead } from '@/components/ui/Section';
import Approach from '@/components/home/Approach';
import CtaBand from '@/components/home/CtaBand';
import Counter from '@/components/ui/Counter';
import { pageMetadata, breadcrumbLd } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'About the Firm',
  description:
    'Arrow-Edge Professional Services is an Abuja-based practice delivering audit, tax, ' +
    'debt recovery and advisory to Nigerian enterprises and public institutions.',
  path: '/about',
});

const VALUES = [
  { icon: Gem,    title: 'Integrity',   body: 'We will tell you what the numbers say, including when it is not what you hoped. An opinion worth having is one that could have gone the other way.' },
  { icon: Target, title: 'Precision',   body: 'Materiality is a judgement, not an excuse. The detail gets checked because that is where the exposure usually sits.' },
  { icon: Eye,    title: 'Clarity',     body: 'Our reports are written to be understood by the people who must act on them, not to demonstrate how much we know.' },
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([{ name: 'About', path: '/about' }])) }}
      />

      <PageHero
        eyebrow="About us"
        title={<>A practice built on doing the <span className="text-gradient-gold">difficult reading</span></>}
        lead="Arrow-Edge Professional Services is your go-to for audits, tax matters and debt recovery. We simplify the complex and keep your financial matters in expert hands."
        trail={[{ name: 'About', path: '/about' }]}
      />

      <Section>
        <div className="container-ae grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div data-reveal className="lg:col-span-7">
            <h2 className="text-[1.9rem] leading-[1.15] tracking-[-0.02em] sm:text-[2.3rem]">
              We exist because financial compliance in Nigeria is harder than it should be.
            </h2>
            <div className="mt-7 space-y-5 text-[1.02rem] leading-relaxed text-ink-500">
              <p>
                Rules change mid-year. Assessments arrive without explanation. A ledger that
                looked healthy turns out to be carrying three years of uncollectable debt. For
                most businesses, none of this is their core competence — and it should not
                have to be.
              </p>
              <p>
                At Arrow-Edge we take those burdens on. Whether it is navigating an audit,
                improving your tax position or recovering money owed to you, the work is
                handled by people who have done it many times before, for organisations
                ranging from federal institutions to owner-managed companies.
              </p>
              <p>
                We are deliberately a generalist practice across six disciplines rather than a
                specialist in one. Most of what reaches us does not arrive neatly labelled: a
                tax problem turns out to be a bookkeeping problem, and a recovery matter turns
                out to be a contract one. Keeping those capabilities in the same building means
                you are not repeating your story to a third firm.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/services" className="btn btn-primary btn-lg group">
                What we do
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
              <Link href="/team" className="btn btn-outline btn-lg">Meet the team</Link>
            </div>
          </div>

          <div data-reveal data-reveal-delay="120" className="lg:col-span-5">
            <div className="overflow-hidden rounded-2xl shadow-liftLg">
              <Image
                src="/team/group.jpg" alt="The Arrow-Edge team"
                width={979} height={653}
                sizes="(max-width: 1024px) 92vw, 40vw"
                className="h-full w-full object-cover"
              />
            </div>
            <dl className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-2xl bg-ink-100">
              {[
                { to: 9, suffix: '+', label: 'Institutions served' },
                { to: 6, suffix: '',  label: 'Practice areas' },
                { to: 8, suffix: '',  label: 'Professionals' },
              ].map((s) => (
                <div key={s.label} className="bg-white px-3 py-6 text-center">
                  <dt className="font-display text-2xl text-ink"><Counter to={s.to} suffix={s.suffix} /></dt>
                  <dd className="mt-1.5 text-[0.7rem] leading-snug text-ink-400">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      <Section tone="cream">
        <div className="container-ae">
          <SectionHead
            eyebrow="What we stand for"
            title={<>Three things we will not <span className="text-gradient-gold">trade away</span></>}
          />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <div key={v.title} data-reveal data-reveal-delay={i * 90} className="card p-8">
                <span className="grid h-13 w-13 place-items-center rounded-xl bg-ink text-gold-400" style={{ height: '3.25rem', width: '3.25rem' }}>
                  <v.icon className="h-6 w-6" strokeWidth={1.4} aria-hidden />
                </span>
                <h3 className="mt-6 text-[1.25rem]">{v.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-500">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Approach />
      <CtaBand />
    </>
  );
}
