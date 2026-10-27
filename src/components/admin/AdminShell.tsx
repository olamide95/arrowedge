'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, FileText, Inbox, CalendarCheck, Users, LogOut,
  Menu, X, ExternalLink, ShieldAlert, Loader2,
} from 'lucide-react';
import { useAuth } from './AuthProvider';
import Logo from '@/components/ui/Logo';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/admin',             label: 'Overview',    Icon: LayoutDashboard, exact: true },
  { href: '/admin/posts',       label: 'Articles',    Icon: FileText },
  { href: '/admin/messages',    label: 'Messages',    Icon: Inbox },
  { href: '/admin/bookings',    label: 'Bookings',    Icon: CalendarCheck },
  { href: '/admin/subscribers', label: 'Subscribers', Icon: Users },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading, signOut } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // The login page renders on its own, without the shell around it.
  if (pathname === '/admin/login') return <>{children}</>;

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink-50">
        <Loader2 className="h-7 w-7 animate-spin text-gold-500" aria-hidden />
        <span className="sr-only">Checking your access…</span>
      </div>
    );
  }

  if (!user) return null; // AuthProvider is already redirecting

  // Signed in, but not on the allow-list.
  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink-50 px-6">
        <div className="max-w-md rounded-2xl border border-ink-100 bg-white p-10 text-center shadow-lift">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-50 text-red-600">
            <ShieldAlert className="h-7 w-7" strokeWidth={1.6} aria-hidden />
          </span>
          <h1 className="mt-6 text-[1.4rem]">Not authorised</h1>
          <p className="mt-3 leading-relaxed text-ink-500">
            You are signed in as <span className="font-medium text-ink">{user.email}</span>,
            but that account has not been granted dashboard access.
          </p>
          <p className="mt-3 text-[0.84rem] text-ink-400">
            An existing administrator can grant it by adding a document at
            <code className="mx-1 rounded bg-ink-50 px-1.5 py-0.5 text-[0.78rem]">admins/{user.uid}</code>
            in Firestore.
          </p>
          <button type="button" onClick={signOut} className="btn btn-outline btn-md mt-7">
            Sign out
          </button>
        </div>
      </div>
    );
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-ink transition-transform duration-300 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-20 items-center justify-between px-6">
          <Logo invert className="[&_img]:w-[150px]" />
          <button
            type="button" onClick={() => setOpen(false)} aria-label="Close menu"
            className="grid h-9 w-9 place-items-center rounded-lg text-ink-400 hover:bg-ink-800 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav aria-label="Dashboard" className="flex-1 space-y-1 px-4 py-6">
          {NAV.map(({ href, label, Icon, exact }) => (
            <Link
              key={href} href={href} onClick={() => setOpen(false)}
              aria-current={isActive(href, exact) ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-[0.9rem] transition-colors',
                isActive(href, exact)
                  ? 'bg-gold-500 text-ink'
                  : 'text-ink-300 hover:bg-ink-800 hover:text-white',
              )}
            >
              <Icon className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.6} aria-hidden />
              {label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-ink-700 p-4">
          <Link
            href="/" target="_blank"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-[0.86rem] text-ink-300 transition-colors hover:bg-ink-800 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" strokeWidth={1.6} aria-hidden />
            View live site
          </Link>
          <div className="mt-2 rounded-xl bg-ink-800 p-4">
            <p className="truncate text-[0.8rem] text-white">{user.email}</p>
            <button
              type="button" onClick={signOut}
              className="mt-3 flex items-center gap-2 text-[0.8rem] text-ink-400 transition-colors hover:text-gold-400"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden /> Sign out
            </button>
          </div>
        </div>
      </aside>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm lg:hidden"
          aria-hidden
        />
      )}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-ink-100 bg-white/85 px-5 backdrop-blur-xl sm:px-8">
          <button
            type="button" onClick={() => setOpen(true)} aria-label="Open menu"
            className="grid h-10 w-10 place-items-center rounded-lg border border-ink-200 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="font-display text-xl text-ink">
            {NAV.find((n) => isActive(n.href, n.exact))?.label ?? 'Dashboard'}
          </h1>
        </header>

        <main className="px-5 py-8 sm:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
