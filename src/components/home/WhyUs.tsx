import Image from 'next/image';
import { Award, Users, FileCheck, Timer } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import Counter from '@/components/ui/Counter';

const PILLARS = [
  { icon: Award,     title: 'Chartered and accountable', body: 'Led by chartered professionals working to ICAN and CITN standards. Every opinion carries a name behind it.' },
  { icon: Users,     title: 'Partner-led engagements',   body: 'A partner stays on your file from scoping through delivery. You will not be handed to a junior after the pitch.' },
  { icon: FileCheck, title: 'Findings you can act on',   body: 'Reports written in plain language, with each recommendation ranked by risk and cost to remedy.' },
  { icon: Timer,     title: 'Deadlines treated as real', body: 'Filing windows and objection periods do not move. We plan backwards from them, so you are never filing in the last hour.' },
];

const STATS = [
  { to: 9,  suffix: '+', label: 'Institutions and companies served' },
  { to: 6,  suffix: '',  label: 'Practice areas in-house' },
  { to: 36, suffix: '',  label: 'States within reach' },
  { to: 100, suffix: '%', label: 'Engagements partner-supervised' },
];

export default function WhyUs() {
  return (
    <Section>
      <div className="container-ae grid gap-16 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <div data-reveal className="flex items-center gap-3">
            <span className="rule-gold" />
            <span className="eyebrow">Why Arrow-Edge</span>
          </div>
          <h2 data-reveal data-reveal-delay="60" className="mt-5 text-[2rem] leading-[1.12] tracking-[-0.02em] sm:text-[2.6rem]">
            Expertise is the baseline.
            <span className="block text-gradient-gold">Judgement is the difference.</span>
          </h2>
          <p data-reveal data-reveal-delay="120" className="mt-6 leading-relaxed text-ink-500">
            Plenty of firms can produce a compliant set of accounts. Fewer will tell you
            which number in them is the one to worry about. We take the view that an
            engagement has only gone well if you finish it better informed than you started.
          </p>

          <div data-reveal data-reveal-delay="180" className="relative mt-10 overflow-hidden rounded-2xl">
            <Image
              src="/img/accounting-desk.jpg"
              alt="Reconciliation work in progress at Arrow-Edge"
              width={612} height={408}
              sizes="(max-width: 1024px) 90vw, 36vw"
              className="h-64 w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
            <p className="absolute bottom-5 left-6 right-6 font-display text-lg leading-snug text-white">
              “Trust, professionalism, and results.”
            </p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="grid gap-5 sm:grid-cols-2">
            {PILLARS.map((p, i) => (
              <div
                key={p.title}
                data-reveal data-reveal-delay={i * 80}
                className="group rounded-2xl border border-ink-100 bg-ink-50/60 p-7 transition-all duration-500 hover:border-gold-200 hover:bg-white hover:shadow-lift"
              >
                <p.icon className="h-7 w-7 text-gold-500 transition-transform duration-500 group-hover:scale-110" strokeWidth={1.4} aria-hidden />
                <h3 className="mt-5 text-[1.12rem] leading-snug">{p.title}</h3>
                <p className="mt-2.5 text-[0.9rem] leading-relaxed text-ink-500">{p.body}</p>
              </div>
            ))}
          </div>

          <dl data-reveal className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-ink-100 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white px-5 py-7 text-center">
                <dt className="font-display text-[2.1rem] text-ink">
                  <Counter to={s.to} suffix={s.suffix} />
                </dt>
                <dd className="mt-2 text-[0.74rem] leading-snug text-ink-400">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
