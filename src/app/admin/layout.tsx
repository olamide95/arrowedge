import type { Metadata } from 'next';
import AuthProvider from '@/components/admin/AuthProvider';
import AdminShell from '@/components/admin/AdminShell';

export const metadata: Metadata = {
  title: 'Dashboard',
  // The dashboard must never be indexed, whatever robots.txt says.
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
