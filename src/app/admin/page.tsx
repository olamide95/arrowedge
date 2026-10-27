'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import {
  FileText, Inbox, CalendarCheck, Users, PenSquare, ArrowRight, Loader2,
} from 'lucide-react';
import { db } from '@/lib/firebase/client';
import { formatDate } from '@/lib/utils';

type Stats = {
  published: number; drafts: number; messages: number;
  unread: number; bookings: number; newBookings: number; subscribers: number;
};

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [posts, messages, bookings, subs, latest] = await Promise.all([
          getDocs(collection(db, 'posts')),
          getDocs(collection(db, 'messages')),
          getDocs(collection(db, 'bookings')),
          getDocs(collection(db, 'subscribers')),
          getDocs(query(collection(db, 'posts'), orderBy('updatedAt', 'desc'), limit(5))),
        ]);

        const postDocs = posts.docs.map((d) => d.data());
        setStats({
          published: postDocs.filter((p) => p.status === 'published').length,
          drafts: postDocs.filter((p) => p.status !== 'published').length,
          messages: messages.size,
          unread: messages.docs.filter((d) => !d.data().read).length,
          bookings: bookings.size,
          newBookings: bookings.docs.filter((d) => d.data().status === 'new').length,
          subscribers: subs.docs.filter((d) => d.data().active !== false).length,
        });
        setRecent(latest.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        setError((err as Error).message);
      }
    })();
  }, []);

  if (error) {
    return (
      <p className="rounded-xl bg-red-50 px-5 py-4 text-[0.9rem] text-red-700">
        Could not load the dashboard: {error}
      </p>
    );
  }

  if (!stats) {
    return (
      <div className="grid place-items-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-gold-500" aria-hidden />
      </div>
    );
  }

  const CARDS = [
    { label: 'Published articles', value: stats.published, sub: `${stats.drafts} in draft`,        href: '/admin/posts',       Icon: FileText },
    { label: 'Messages',           value: stats.messages,  sub: `${stats.unread} unread`,          href: '/admin/messages',    Icon: Inbox },
    { label: 'Bookings',           value: stats.bookings,  sub: `${stats.newBookings} awaiting`,   href: '/admin/bookings',    Icon: CalendarCheck },
    { label: 'Subscribers',        value: stats.subscribers, sub: 'on the brief',                  href: '/admin/subscribers', Icon: Users },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-ink">Welcome back</h2>
          <p className="mt-1 text-[0.9rem] text-ink-500">Here is where things stand today.</p>
        </div>
        <Link href="/admin/posts/new" className="btn btn-gold btn-md">
          <PenSquare className="h-4 w-4" aria-hidden /> Write an article
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {CARDS.map(({ label, value, sub, href, Icon }) => (
          <Link key={label} href={href} className="card card-hover group p-6">
            <div className="flex items-start justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink-50 text-gold-600 transition-colors group-hover:bg-ink group-hover:text-gold-400">
                <Icon className="h-5 w-5" strokeWidth={1.6} aria-hidden />
              </span>
              <ArrowRight className="h-4 w-4 text-ink-300 transition-all group-hover:translate-x-0.5 group-hover:text-gold-600" aria-hidden />
            </div>
            <p className="mt-5 font-display text-[2.2rem] leading-none text-ink">{value}</p>
            <p className="mt-2 text-[0.88rem] font-medium text-ink-600">{label}</p>
            <p className="mt-0.5 text-[0.78rem] text-ink-400">{sub}</p>
          </Link>
        ))}
      </div>

      <div className="card p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <h3 className="text-[1.15rem]">Recently edited</h3>
          <Link href="/admin/posts" className="text-[0.85rem] text-gold-700 hover:underline">
            All articles
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-ink-200 py-14 text-center">
            <p className="text-ink-500">No articles yet.</p>
            <Link href="/admin/posts/new" className="btn btn-outline btn-md mt-5">
              Write the first one
            </Link>
          </div>
        ) : (
          <ul className="mt-5 divide-y divide-ink-100">
            {recent.map((p) => (
              <li key={p.id}>
                <Link href={`/admin/posts/${p.id}`} className="flex items-center justify-between gap-4 py-4 transition-colors hover:text-gold-700">
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-ink">{p.title || 'Untitled'}</span>
                    <span className="mt-0.5 block text-[0.78rem] text-ink-400">
                      {p.category ?? 'Uncategorised'} · updated {formatDate(p.updatedAt)}
                    </span>
                  </span>
                  <span className={
                    p.status === 'published'
                      ? 'shrink-0 rounded-full bg-green-50 px-3 py-1 text-[0.72rem] font-medium text-green-700'
                      : 'shrink-0 rounded-full bg-ink-100 px-3 py-1 text-[0.72rem] font-medium text-ink-500'
                  }>
                    {p.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
