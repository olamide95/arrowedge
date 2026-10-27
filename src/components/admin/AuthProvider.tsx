'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, signOut as fbSignOut, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/client';

type AuthState = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthState>({
  user: null, isAdmin: false, loading: true, signOut: async () => {},
});

export const useAuth = () => useContext(Ctx);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);

      if (!u) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // Being signed in is not the same as being an admin. Authorisation is a
      // document in /admins that only the console can create, so a user who
      // signs up cannot grant themselves access. The same check is enforced
      // in the Firestore rules — this one only decides what the UI shows.
      try {
        const snap = await getDoc(doc(db, 'admins', u.uid));
        setIsAdmin(snap.exists());
      } catch {
        setIsAdmin(false);
      }
      setLoading(false);
    });
  }, []);

  // Push unauthenticated visitors out of the dashboard once we know.
  useEffect(() => {
    if (loading) return;
    const onLogin = pathname === '/admin/login';
    if (!user && !onLogin) router.replace('/admin/login');
    if (user && isAdmin && onLogin) router.replace('/admin');
  }, [loading, user, isAdmin, pathname, router]);

  async function signOut() {
    await fbSignOut(auth);
    router.replace('/admin/login');
  }

  return <Ctx.Provider value={{ user, isAdmin, loading, signOut }}>{children}</Ctx.Provider>;
}
