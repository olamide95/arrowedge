import type { Service } from '@/types';

/**
 * Each service carries deliverables, outcomes and a process. That depth is
 * not decoration: a page that only says "we do tax" ranks for nothing and
 * answers no question a prospective client actually has.
 */
export const SERVICES: Service[] = [
  {
    slug: 'tax',
    title: 'Tax Consultation',
    tagline: 'Pay what you owe. Not a naira more.',
    summary:
      'Expert guidance to optimise financial strategies, maintain full compliance with FIRS ' +
      'and state revenue authorities, and keep tax liability at its lawful minimum.',
    icon: 'receipt',
    deliverables: [
      'Company Income Tax (CIT) computation and filing',
      'Value Added Tax (VAT) registration, returns and reconciliation',
      'Withholding Tax (WHT) administration and credit note recovery',
      'Personal Income Tax and PAYE scheme design',
      'Tertiary Education Tax and NITDA levy computation',
      'Transfer pricing documentation and declarations',
      'Tax Clearance Certificate procurement',
      'Objection and appeal representation before tax authorities',
    ],
    outcomes: [
      'Liability reduced to its lawful minimum through claimable reliefs and capital allowances',
      'Penalty and interest exposure closed before it compounds',
      'Filing calendar met without the last-minute scramble',
      'A defensible position when an assessment is challenged',
    ],
    process: [
      { step: 'Position review', detail: 'We read your last three years of returns and assessments to find what was over-declared, under-claimed or missed entirely.' },
      { step: 'Exposure map', detail: 'Every open liability, penalty risk and unclaimed relief, quantified and ranked by value.' },
      { step: 'Strategy', detail: 'A written plan covering structure, timing and claimable reliefs — with the figures behind each recommendation.' },
      { step: 'Filing and defence', detail: 'We prepare and file, then stand with you through any query, audit or appeal that follows.' },
    ],
  },
  {
    slug: 'audit',
    title: 'Audit & Assurance',
    tagline: 'The numbers, examined properly.',
    summary:
      'Thorough examination of financial records and activities to confirm compliance, ' +
      'surface discrepancies and give boards and regulators a statement they can rely on.',
    icon: 'shield-check',
    deliverables: [
      'Statutory audit and independent auditor&apos;s report',
      'Tax audit defence and back-duty review',
      'Internal audit function design and execution',
      'Forensic audit and fraud investigation',
      'Due diligence for acquisition, investment or divestment',
      'Grant and donor-funded project audit',
      'Systems and internal control evaluation',
      'Management letter with ranked, costed recommendations',
    ],
    outcomes: [
      'An opinion that withstands regulatory and board scrutiny',
      'Control weaknesses identified before they become losses',
      'Clean documentation for lenders, investors and development partners',
      'Findings written in plain language, not audit jargon',
    ],
    process: [
      { step: 'Planning', detail: 'Scope, materiality and risk assessment agreed in writing before any fieldwork begins.' },
      { step: 'Fieldwork', detail: 'Substantive testing and controls walkthroughs, conducted to minimise disruption to your team.' },
      { step: 'Findings', detail: 'Issues raised with you as they are found — no surprises saved for the final report.' },
      { step: 'Report', detail: 'Signed opinion plus a management letter that ranks each recommendation by risk and cost to remedy.' },
    ],
  },
  {
    slug: 'recoveries',
    title: 'Debt Recovery',
    tagline: 'Money owed to you, collected.',
    summary:
      'Professionally and ethically retrieving outstanding debts to restore financial ' +
      'stability — without damaging the commercial relationships worth keeping.',
    icon: 'banknote',
    deliverables: [
      'Debtor ledger reconciliation and ageing analysis',
      'Debtor tracing, asset search and solvency assessment',
      'Structured demand and negotiation',
      'Settlement and instalment agreement drafting',
      'Litigation support and enforcement coordination',
      'Receivables process redesign to stop recurrence',
      'Recovery reporting with full audit trail',
    ],
    outcomes: [
      'Cash recovered that had been written off as unrecoverable',
      'Debtors converted to paying terms rather than lost as customers',
      'A receivables process that stops the next ledger ageing the same way',
      'Every contact documented and defensible',
    ],
    process: [
      { step: 'Ledger review', detail: 'We age and verify the book, then separate what is genuinely collectable from what is not.' },
      { step: 'Trace and assess', detail: 'Debtor located, solvency and asset position established before a single naira is spent chasing.' },
      { step: 'Engage', detail: 'Structured demand, then negotiation. Firm, documented, and never conduct that would embarrass you.' },
      { step: 'Enforce or settle', detail: 'Settlement where it recovers more; enforcement where it does not. The arithmetic decides.' },
    ],
  },
  {
    slug: 'advisory',
    title: 'Business Advisory',
    tagline: 'Strategy you can act on this quarter.',
    summary:
      'Strategic guidance to optimise operations and drive sustainable growth, grounded in ' +
      'your actual numbers rather than generic best practice.',
    icon: 'compass',
    deliverables: [
      'Business and financial modelling',
      'Feasibility studies and investment appraisal',
      'Budgeting, forecasting and variance analysis',
      'Costing systems and margin analysis',
      'Capital raising support and lender documentation',
      'Restructuring and turnaround planning',
      'Board and management reporting design',
      'Succession and continuity planning',
    ],
    outcomes: [
      'Decisions grounded in figures rather than instinct',
      'A plan with owners, dates and measurable checkpoints',
      'Reporting the board actually reads and uses',
      'Early warning on the numbers that matter before they turn',
    ],
    process: [
      { step: 'Diagnostic', detail: 'Where the business actually makes and loses money — often not where management expects.' },
      { step: 'Options', detail: 'Realistic routes forward, each with its cost, timeline and risk stated honestly.' },
      { step: 'Plan', detail: 'The chosen route turned into owners, dates and measurable checkpoints.' },
      { step: 'Support', detail: 'We stay through implementation, because a plan handed over at the door rarely survives contact.' },
    ],
  },
  {
    slug: 'business-support',
    title: 'Business Support Services',
    tagline: 'The back office, handled.',
    summary:
      'Tailored solutions for seamless operations — bookkeeping, payroll, statutory filing ' +
      'and company secretarial work, so your team can stay on the business itself.',
    icon: 'briefcase',
    deliverables: [
      'Bookkeeping and management accounts',
      'Payroll processing and PAYE remittance',
      'Pension, NHF and NSITF compliance',
      'CAC company secretarial services and annual returns',
      'Accounting system setup and migration',
      'Finance staff training and capacity building',
      'Policy and procedure documentation',
    ],
    outcomes: [
      'Books closed on time, every month',
      'Statutory deadlines met without reminders',
      'Clean records when the auditor, the bank or FIRS arrives',
      'Fixed, predictable cost in place of an unpredictable hire',
    ],
    process: [
      { step: 'Handover', detail: 'We take on your existing records as they are, and tell you plainly what state they are in.' },
      { step: 'Setup', detail: 'Chart of accounts, controls and a filing calendar built around your obligations.' },
      { step: 'Run', detail: 'Monthly close, payroll and remittances, delivered to an agreed date each cycle.' },
      { step: 'Report', detail: 'Management accounts with commentary, not just a trial balance over the wall.' },
    ],
  },
  {
    slug: 'risk-management',
    title: 'Risk Management',
    tagline: 'Find it before it finds you.',
    summary:
      'Proactive identification, assessment and mitigation of threats to your business ' +
      'objectives — financial, operational, regulatory and reputational.',
    icon: 'radar',
    deliverables: [
      'Enterprise risk assessment and register',
      'Internal control framework design and testing',
      'Fraud risk assessment and prevention controls',
      'Regulatory compliance review and gap analysis',
      'Business continuity and disaster recovery planning',
      'Whistleblowing and escalation framework',
      'Board-level risk reporting',
    ],
    outcomes: [
      'Risks named, owned and tracked rather than assumed away',
      'Controls that are tested, not merely documented',
      'Regulatory gaps closed before an examiner finds them',
      'A board that can evidence its oversight',
    ],
    process: [
      { step: 'Identify', detail: 'Workshops and document review across every function, not just finance.' },
      { step: 'Assess', detail: 'Each risk scored on likelihood and impact, then ranked against your appetite.' },
      { step: 'Treat', detail: 'Controls designed, assigned to a named owner, and given a review date.' },
      { step: 'Monitor', detail: 'Periodic testing, because an untested control is only an intention.' },
    ],
  },
];

export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);
