import type { Metadata } from 'next';
import PageHero from '@/components/site/PageHero';
import { Section } from '@/components/ui/Section';
import { pageMetadata, SITE } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Privacy Policy',
  description: 'How Arrow-Edge Professional Services collects, uses and protects your information.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        lead="What we collect, why we collect it, and what we will never do with it."
        trail={[{ name: 'Privacy', path: '/privacy' }]}
      />
      <Section>
        <div className="container-ae max-w-3xl">
          <div className="prose prose-aeprose prose-lg max-w-none">
            <p className="lead">
              Last updated {new Date().toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })}.
            </p>

            <h2>What we collect</h2>
            <p>
              When you submit the contact or booking form we collect the name, email address,
              telephone number, organisation and message you provide. When you subscribe to
              our brief we collect your email address only.
            </p>
            <p>
              Our servers also record the IP address and browser user-agent accompanying a form
              submission. That is retained solely to investigate abuse of the forms, and is never
              used to build a profile of you or shown anywhere in our systems.
            </p>

            <h2>Why we collect it</h2>
            <ul>
              <li>To answer your enquiry and arrange a consultation</li>
              <li>To deliver the newsletter you asked for</li>
              <li>To meet our professional record-keeping obligations</li>
            </ul>
            <p>
              We do not use your details for any purpose you did not ask for, and we do not
              use automated decision-making or profiling.
            </p>

            <h2>What we will never do</h2>
            <p>
              We do not sell your information. We do not rent, trade or share it with third
              parties for their marketing. We do not place advertising cookies on this site.
            </p>

            <h2>Where it is stored</h2>
            <p>
              Form submissions and subscriptions are held in Google Firebase, encrypted in
              transit and at rest. Access is limited to Arrow-Edge personnel who need it to
              respond to you.
            </p>

            <h2>Confidentiality of engagement information</h2>
            <p>
              Information you share with us during an engagement is subject to professional
              confidentiality obligations that extend well beyond this policy. It is covered
              by your engagement letter and, where you prefer, a separate non-disclosure
              agreement.
            </p>

            <h2>How long we keep it</h2>
            <p>
              Enquiries that do not lead to an engagement are deleted after twenty-four months.
              Newsletter subscriptions are kept until you unsubscribe. Engagement records are
              retained for the period our professional and statutory obligations require.
            </p>

            <h2>Your rights</h2>
            <p>
              Under the Nigeria Data Protection Act you may ask us for a copy of the information
              we hold about you, ask us to correct it, or ask us to delete it. Write to{' '}
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a> and we will respond within
              thirty days.
            </p>
            <p>
              You can unsubscribe from the newsletter at any time using the link in any issue,
              or by emailing us.
            </p>

            <h2>Cookies</h2>
            <p>
              This site sets no tracking or advertising cookies. Any cookie present is strictly
              necessary for the site to function.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about this policy go to <a href={`mailto:${SITE.email}`}>{SITE.email}</a>,
              or by post to Suite 3, Ajami Plaza, Behind Abuja University, Area 3, Garki, Abuja.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
