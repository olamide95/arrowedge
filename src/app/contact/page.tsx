import type { Metadata } from 'next';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import PageHero from '@/components/site/PageHero';
import { Section, SectionHead } from '@/components/ui/Section';
import ContactForm from '@/components/site/ContactForm';
import BookingForm from '@/components/site/BookingForm';
import Accordion from '@/components/ui/Accordion';
import { FAQS } from '@/lib/data/faqs';
import { pageMetadata, breadcrumbLd, faqLd, SITE } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Contact & Book a Consultation',
  description:
    'Speak to Arrow-Edge Professional Services in Area 3, Abuja. Book a free first ' +
    'consultation on audit, tax, debt recovery or business advisory.',
  path: '/contact',
});

const DETAILS = [
  { Icon: MapPin, label: 'Office', lines: ['Suite 3, Ajami Plaza', 'Behind Abuja University', 'Area 3, Garki, Abuja, FCT'] },
  { Icon: Phone,  label: 'Telephone', lines: ['+234 803 598 9359'], href: 'tel:+2348035989359' },
  { Icon: Mail,   label: 'Email', lines: ['info@arrow-edge.org.ng'], href: 'mailto:info@arrow-edge.org.ng' },
  { Icon: Clock,  label: 'Opening hours', lines: ['Monday – Friday', '08:00 – 18:00'] },
];

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbLd([{ name: 'Contact', path: '/contact' }]),
            faqLd(FAQS),
          ]),
        }}
      />

      <PageHero
        eyebrow="Get in touch"
        title={<>Let us hear the <span className="text-gradient-gold">actual problem</span></>}
        lead="No pitch deck, no discovery call about a discovery call. Tell us what has landed on your desk and we will tell you what it takes to deal with it."
        trail={[{ name: 'Contact', path: '/contact' }]}
      />

      <Section>
        <div className="container-ae grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div data-reveal className="lg:col-span-5">
            <h2 className="text-[1.8rem] leading-snug">Reach the office</h2>
            <p className="mt-4 leading-relaxed text-ink-500">
              We answer the phone during business hours and reply to email within one
              business day.
            </p>

            <dl className="mt-9 space-y-6">
              {DETAILS.map(({ Icon, label, lines, href }) => (
                <div key={label} className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink-50 text-gold-600">
                    <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                  </span>
                  <div>
                    <dt className="font-mark text-[0.66rem] uppercase tracking-[0.22em] text-gold-600">{label}</dt>
                    <dd className="mt-1.5 leading-relaxed text-ink-600">
                      {href ? (
                        <a href={href} className="link-underline hover:text-gold-700">{lines[0]}</a>
                      ) : (
                        lines.map((l) => <span key={l} className="block">{l}</span>)
                      )}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            <a
              href="https://wa.me/2348035989359?text=Hello%20Arrow-Edge%2C%20I%27d%20like%20to%20discuss%20an%20engagement."
              target="_blank" rel="noopener noreferrer"
              className="btn btn-outline btn-lg mt-9 w-full sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.8} aria-hidden />
              Message us on WhatsApp
            </a>

            <div className="mt-9 overflow-hidden rounded-2xl border border-ink-100">
              <iframe
                title="Arrow-Edge Professional Services office location, Area 3 Abuja"
                src="https://www.google.com/maps?q=Area%203%20Garki%20Abuja%20Nigeria&output=embed"
                width="100%" height="280" loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0 }}
              />
            </div>
          </div>

          <div data-reveal data-reveal-delay="120" className="lg:col-span-7">
            <div className="card p-8 sm:p-10">
              <h2 className="text-[1.8rem] leading-snug">Send a message</h2>
              <p className="mt-3 text-ink-500">
                For general enquiries. If you would rather book a slot directly, use the
                form below.
              </p>
              <div className="mt-8"><ContactForm /></div>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="cream" id="book">
        <div className="container-ae grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div data-reveal className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className="rule-gold" />
              <span className="eyebrow">Book a consultation</span>
            </div>
            <h2 className="mt-5 text-[2rem] leading-[1.15] tracking-[-0.02em] sm:text-[2.4rem]">
              Thirty minutes, and you will know where you stand.
            </h2>
            <p className="mt-6 leading-relaxed text-ink-500">
              The first conversation is free. We will ask what has happened, what has been
              filed and what the deadline is — and then tell you honestly whether this is
              something we should take on.
            </p>
            <ul className="mt-8 space-y-3 text-[0.95rem] text-ink-600">
              {[
                'No charge and no obligation',
                'Speak to a partner, not a salesperson',
                'A written scope and fee before any work starts',
                'If we are not right for it, we will say so',
              ].map((l) => (
                <li key={l} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" aria-hidden />
                  {l}
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal data-reveal-delay="120" className="lg:col-span-7">
            <div className="card p-8 sm:p-10"><BookingForm /></div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="container-ae max-w-3xl">
          <SectionHead
            eyebrow="Common questions"
            title={<>Answers before you <span className="text-gradient-gold">ask</span></>}
          />
          <div className="mt-12"><Accordion items={FAQS} /></div>
        </div>
      </Section>
    </>
  );
}
