import type { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import TrustBar from '@/components/home/TrustBar';
import ServicesGrid from '@/components/home/ServicesGrid';
import WhyUs from '@/components/home/WhyUs';
import Approach from '@/components/home/Approach';
import TeamPreview from '@/components/home/TeamPreview';
import InsightsPreview from '@/components/home/InsightsPreview';
import CtaBand from '@/components/home/CtaBand';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Audit, Tax & Advisory in Abuja',
  description:
    'Arrow-Edge Professional Services delivers chartered audit, tax consultation, ' +
    'debt recovery and business advisory to Nigerian enterprises and public institutions. ' +
    'Based in Area 3, Abuja.',
  path: '/',
  keywords: ['audit firm Abuja', 'tax consultant Nigeria', 'chartered accountants Abuja', 'debt recovery Nigeria'],
});

// Revalidate hourly so a newly published post reaches the homepage without a
// deploy, while most visitors still get a cached page.
export const revalidate = 600;

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ServicesGrid />
      <WhyUs />
      <Approach />
      <TeamPreview />
      <InsightsPreview />
      <CtaBand />
    </>
  );
}
