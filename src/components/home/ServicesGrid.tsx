import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Section, SectionHead } from '@/components/ui/Section';
import ServiceIcon from '@/components/ui/ServiceIcon';
import { SERVICES } from '@/lib/data/services';

export default function ServicesGrid() {
  return (
    <Section tone="cream" id="services">
      <div className="container-ae">
        <SectionHead
          eyebrow="What we do"
          title={<>Six practices. <span className="text-gradient-gold">One standard.</span></>}
          lead="Whether it is an assessment you need to defend, a ledger you need collected or a set of books you need signed, the work lands with people who have done it before."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              data-reveal data-reveal-delay={i * 70}
              className="card card-hover group relative flex flex-col overflow-hidden p-8"
            >
              {/* Gold wash that rises on hover */}
              <span className="pointer-events-none absolute inset-x-0 bottom-0 h-0 bg-gradient-to-t from-gold-50 to-transparent transition-all duration-500 group-hover:h-full" />

              <span className="relative grid h-14 w-14 place-items-center rounded-xl bg-ink text-gold-400 transition-colors duration-500 group-hover:bg-gold-500 group-hover:text-ink">
                <ServiceIcon name={s.icon} className="h-6 w-6" />
              </span>

              <h3 className="relative mt-7 text-[1.3rem] leading-snug">{s.title}</h3>
              <p className="relative mt-2 text-[0.82rem] font-medium tracking-wide text-gold-600">
                {s.tagline}
              </p>
              <p className="relative mt-4 flex-1 text-[0.93rem] leading-relaxed text-ink-500">
                {s.summary}
              </p>

              <span className="relative mt-7 inline-flex items-center gap-1.5 text-[0.85rem] font-medium text-ink group-hover:text-gold-700">
                Explore this service
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </Section>
  );
}
