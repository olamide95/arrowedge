import { Section, SectionHead } from '@/components/ui/Section';

const STEPS = [
  { n: '01', title: 'We listen first',      body: 'A conversation about what is actually happening — the assessment that arrived, the ledger that will not clear, the board that wants assurance. No pitch deck.' },
  { n: '02', title: 'We scope in writing',  body: 'What we will do, what it costs, what we need from you and when it will be finished. Agreed before any work begins, so there are no surprises on the invoice.' },
  { n: '03', title: 'We do the work',       body: 'Partner-supervised throughout. Issues are raised with you as they surface rather than saved for a final report you cannot react to.' },
  { n: '04', title: 'We stay afterwards',   body: 'Findings handed over with the reasoning intact, and we remain reachable when the regulator, the lender or the board asks a follow-up question.' },
];

export default function Approach() {
  return (
    <Section tone="ink">
      <div className="container-ae">
        <SectionHead
          tone="ink"
          eyebrow="How we work"
          title={<>Four steps, and no <span className="text-gradient-gold">mystery</span> in any of them.</>}
          lead="Professional services go wrong in predictable ways: unclear scope, silence mid-engagement, a report nobody can use. We have built the process around avoiding each of those."
        />

        <ol className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-ink-700 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li
              key={s.n}
              data-reveal data-reveal-delay={i * 90}
              className="group relative bg-ink p-8 transition-colors duration-500 hover:bg-ink-800"
            >
              <span className="font-display text-[2.6rem] leading-none text-ink-700 transition-colors duration-500 group-hover:text-gold-500">
                {s.n}
              </span>
              <h3 className="mt-5 text-[1.15rem] text-white">{s.title}</h3>
              <p className="mt-3 text-[0.89rem] leading-relaxed text-ink-400">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
