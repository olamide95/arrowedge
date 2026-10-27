import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

// The page itself is a client component for the filter, so its metadata lives
// here — a 'use client' module cannot export `metadata`.
export const metadata: Metadata = pageMetadata({
  title: 'Engagements',
  description:
    'Organisations that have engaged Arrow-Edge Professional Services, including the ' +
    'Central Bank of Nigeria, Borno State Internal Revenue Service and the National ' +
    'Productivity Centre.',
  path: '/projects',
});

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
