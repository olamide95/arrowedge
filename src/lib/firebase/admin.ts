import 'server-only';

import { cert, getApp, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

/**
 * Server-side Firebase, used by React Server Components to read posts.
 *
 * This is what makes the blog genuinely indexable: Google receives finished
 * HTML with the article in it, rather than an empty shell that fetches from
 * Firestore after hydration.
 *
 * `server-only` above makes the build fail loudly if this file is ever
 * imported into a client component — which would otherwise ship the service
 * account key to the browser.
 */
function initAdmin(): App {
  if (getApps().length) return getApp();

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Stored with literal \n escapes in .env, which must become real newlines.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Firebase Admin is not configured. Set FIREBASE_PROJECT_ID, ' +
        'FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in .env.local.',
    );
  }

  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

let cached: Firestore | null = null;

/** Firestore handle, created on first real use. */
export function getAdminDb(): Firestore {
  if (!cached) cached = getFirestore(initAdmin());
  return cached;
}

/**
 * Initialisation is deferred to the first property access rather than done at
 * import time. That matters during a build: Next collects page data by
 * importing every route, and an unconfigured project would otherwise throw
 * before any caller's try/catch could see it, failing the whole build. This
 * way the throw lands inside the query, where `safeQuery` in `lib/posts.ts`
 * turns it into an empty result and the rest of the site still renders.
 */
export const adminDb: Firestore = new Proxy({} as Firestore, {
  get(_target, prop, receiver) {
    const db = getAdminDb();
    const value = Reflect.get(db as object, prop, receiver);
    return typeof value === 'function' ? value.bind(db) : value;
  },
  has(_target, prop) {
    return Reflect.has(getAdminDb() as object, prop);
  },
});
