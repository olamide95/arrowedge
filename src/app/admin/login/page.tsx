'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Loader2, LogIn, AlertCircle } from 'lucide-react';
import { auth } from '@/lib/firebase/client';
import Logo from '@/components/ui/Logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // AuthProvider sees the state change and routes to /admin.
    } catch (err: any) {
      // Firebase distinguishes "no such user" from "wrong password", which
      // tells an attacker which emails are registered. One message for both.
      const code = err?.code ?? '';
      setError(
        code === 'auth/too-many-requests'
          ? 'Too many attempts. Wait a few minutes and try again.'
          : 'Those details were not recognised.',
      );
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-ink grain px-5 py-16">
      <svg className="pointer-events-none absolute -right-28 -top-20 h-[32rem] w-[32rem] opacity-[0.1]" viewBox="0 0 400 400" fill="none" aria-hidden>
        <g stroke="#A88A28" fill="none" strokeLinecap="round">
          <ellipse cx="200" cy="205" rx="150" ry="168" strokeWidth="26" transform="rotate(-24 200 205)" />
          <ellipse cx="200" cy="205" rx="100" ry="116" strokeWidth="15" transform="rotate(-24 200 205)" opacity=".7" />
        </g>
      </svg>

      <div className="relative w-full max-w-md">
        <div className="flex justify-center"><Logo invert /></div>

        <div className="mt-10 rounded-2xl bg-white p-8 shadow-liftLg sm:p-10">
          <h1 className="text-[1.5rem]">Dashboard sign-in</h1>
          <p className="mt-2 text-[0.9rem] text-ink-500">
            For Arrow-Edge staff. Articles, messages and bookings live here.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="label">Email</label>
              <input
                id="email" type="email" required autoComplete="email"
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="field" placeholder="you@arrow-edge.org.ng"
              />
            </div>
            <div>
              <label htmlFor="password" className="label">Password</label>
              <input
                id="password" type="password" required autoComplete="current-password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="field" placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-[0.86rem] text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden /> {error}
              </p>
            )}

            <button type="submit" disabled={busy} className="btn btn-primary btn-lg w-full">
              {busy
                ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Signing in…</>
                : <><LogIn className="h-4 w-4" aria-hidden /> Sign in</>}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[0.8rem] text-ink-500">
          Accounts are created by an administrator in the Firebase console.
        </p>
      </div>
    </div>
  );
}
