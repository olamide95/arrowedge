import type { Metadata } from 'next';
import PageHero from '@/components/site/PageHero';
import { Section } from '@/components/ui/Section';
import { pageMetadata, SITE } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Terms of Use',
  description: 'Terms governing the use of the Arrow-Edge Professional Services website.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Use"
        lead="The terms on which this website is made available."
        trail={[{ name: 'Terms', path: '/terms' }]}
      />
      <Section>
        <div className="container-ae max-w-3xl">
          <div className="prose prose-aeprose prose-lg max-w-none">
            <p className="lead">
              Last updated {new Date().toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })}.
            </p>

            <h2>Information, not advice</h2>
            <p>
              Everything on this site — including the articles published under Insights — is
              general information about audit, tax and business matters in Nigeria. It is not
              professional advice, and it is not a substitute for it.
            </p>
            <p>
              Tax and regulatory positions turn on facts specific to each organisation, and
              they change. Do not act on anything here without taking advice on your own
              circumstances. No client relationship is created by reading this site or by
              submitting a form on it.
            </p>

            <h2>When an engagement begins</h2>
            <p>
              A professional relationship with Arrow-Edge begins only when both parties have
              signed an engagement letter setting out the scope, the fee and the respective
              responsibilities. Until then, no obligation arises on either side.
            </p>

            <h2>Accuracy</h2>
            <p>
              We take care that the information here is correct at the time of writing, and we
              date our articles so you can judge how current they are. We do not warrant that
              it remains accurate as legislation and regulatory practice change.
            </p>

            <h2>Our content</h2>
            <p>
              The text, design, logo and graphics on this site belong to Arrow-Edge Professional
              Services. You are welcome to read, print and share our articles for your own
              reference, and to quote from them with attribution and a link. Republishing them
              in full, or using our name or logo commercially, requires our written permission.
            </p>

            <h2>External links</h2>
            <p>
              Where we link to another site we do so because we think it is useful. We do not
              control those sites and are not responsible for their content or their privacy
              practices.
            </p>

            <h2>Liability</h2>
            <p>
              To the extent the law allows, we accept no liability for loss arising from
              reliance on this website&apos;s general information. Liability in respect of a
              signed engagement is governed by that engagement letter, not by these terms.
            </p>

            <h2>Governing law</h2>
            <p>
              These terms are governed by the laws of the Federal Republic of Nigeria, and are
              subject to the jurisdiction of its courts.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about these terms go to <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
