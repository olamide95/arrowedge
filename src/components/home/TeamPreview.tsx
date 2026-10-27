import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Section, SectionHead } from '@/components/ui/Section';
import Monogram from '@/components/ui/Monogram';
import { TEAM } from '@/lib/data/team';

export default function TeamPreview() {
  const featured = TEAM.slice(0, 4);

  return (
    <Section tone="cream">
      <div className="container-ae">
        <SectionHead
          eyebrow="Our people"
          title={<>The names on <span className="text-gradient-gold">your file</span></>}
          lead="Engagements here are led by the people you meet at the outset — not transferred to a team you never see."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((m, i) => (
            <article
              key={m.name}
              data-reveal data-reveal-delay={i * 80}
              className="group overflow-hidden rounded-2xl bg-white shadow-lift transition-all duration-500 hover:-translate-y-1.5 hover:shadow-liftLg"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-ink-100">
                {m.photo ? (
                  <Image
                    src={m.photo}
                    alt={`${m.name}, ${m.role}`}
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 23vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <Monogram name={m.name} className="h-full w-full" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                {m.focus && (
                  <p className="absolute bottom-4 left-5 right-5 translate-y-3 text-[0.8rem] leading-snug text-ink-100 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    {m.focus}
                  </p>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-[1.05rem] leading-snug">{m.name}</h3>
                <p className="mt-1.5 text-[0.8rem] font-medium tracking-wide text-gold-600">
                  {m.role}
                  {m.credentials && <span className="text-ink-400"> · {m.credentials}</span>}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div data-reveal className="mt-12 text-center">
          <Link href="/team" className="btn btn-outline btn-lg group">
            Meet the full team
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </div>
      </div>
    </Section>
  );
}
