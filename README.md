# Arrow-Edge Professional Services

The firm's website and publishing dashboard. Next.js 15 (App Router) on Firebase
App Hosting, with Firestore for content and form submissions, Storage for
images, and Auth for the dashboard.

---

## What is in here

| Path | What it is |
| --- | --- |
| `src/app/(public pages)` | Home, About, Services, Team, Projects, Contact, Insights |
| `src/app/blog` | The Insights index and individual articles |
| `src/app/admin` | The dashboard — write posts, read enquiries, export subscribers |
| `src/app/api` | Contact, booking and newsletter endpoints |
| `src/components` | `site/` chrome, `home/` sections, `blog/`, `admin/`, `ui/` primitives |
| `src/lib/firebase` | `client.ts` (browser) and `admin.ts` (server, service account) |
| `src/lib/posts.ts` | Every Firestore read for posts, server-side only |
| `src/lib/seo.ts` | Metadata helpers and JSON-LD builders |
| `src/lib/data` | Services, team, FAQs, clients — plain TypeScript, edit directly |
| `scripts/seed.mjs` | Three starter articles, and admin bootstrap |

Articles are stored as Markdown in Firestore and rendered on the server. That
keeps them portable (they are plain text you can move anywhere), reviewable, and
indexable — the HTML search engines see is the finished article, not a shell that
fills in later.

---

## Running it locally

### 1. Install

```bash
npm install
```

### 2. Create the Firebase project

In the [Firebase console](https://console.firebase.google.com):

1. **Create a project** — name it `arrow-edge` or similar.
2. **Build → Firestore Database → Create database.** Start in *production mode*;
   the rules in this repo replace the defaults in step 5.
3. **Build → Storage → Get started.** Same — production mode.
4. **Build → Authentication → Get started → Email/Password.** Enable it. Leave
   "Email link" off.
5. **Project settings → General → Your apps → Web (`</>`).** Register an app and
   copy the config values.

### 3. Create a service account

**Project settings → Service accounts → Generate new private key.** This
downloads a JSON file. You need three values from it: `project_id`,
`client_email` and `private_key`.

Keep this file out of the repository. It grants full access to your project.

### 4. Environment variables

```bash
cp .env.local.example .env.local
```

Fill it in. The `NEXT_PUBLIC_` values come from step 2.5 and are safe in the
browser — they identify the project, they do not authorise anything. The three
unprefixed values come from the service-account JSON and must never be given a
`NEXT_PUBLIC_` prefix; doing so ships your private key to every visitor.

The private key contains newlines. Paste it on one line with `\n` where the
newlines were, wrapped in double quotes:

```
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n"
```

### 5. Publish the security rules

```bash
npm i -g firebase-tools
firebase login
firebase use --add            # select the project you created
firebase deploy --only firestore:rules,firestore:indexes,storage
```

Do this before the first run. Until the rules are published, Firestore is using
its own defaults and the dashboard will be refused.

### 6. Seed and create your admin

```bash
npm run seed
```

That writes three starter articles. To give yourself dashboard access:

1. **Authentication → Users → Add user.** Set an email and password.
2. Copy the **User UID** shown in the list.
3. Run:

```bash
SEED_ADMIN_UID=<the uid> SEED_ADMIN_EMAIL=<the email> npm run seed
```

Admin access is a document at `admins/{uid}`. The rules make that collection
unwritable from the client, so nobody can promote themselves — you add
administrators here or in the console, and nowhere else.

### 7. Run

```bash
npm run dev
```

The site is at `http://localhost:3000`, the dashboard at `/admin`.

---

## Deploying

Firebase App Hosting builds from a Git repository and serves the app
server-rendered.

```bash
firebase experiments:enable webframeworks   # if not already on
firebase init hosting                        # choose App Hosting, connect the repo
```

Then, in the console under **App Hosting → your backend → Settings → Environment**,
add every variable from `.env.local`. The three server-only ones should be stored
as **secrets**, not plain variables — App Hosting puts those in Secret Manager
and they stay out of the build log.

Push to the connected branch and it builds and releases. Publishing an article
does not require a rebuild: posts are read per request, so a post goes live the
moment you save it — the article page is rendered per request, and the Insights listing picks it up within a minute.

### Custom domain

**App Hosting → Add custom domain.** Point `arrow-edge.org.ng` and
`www.arrow-edge.org.ng` at the records Firebase gives you. Then change
`SITE.url` in `src/lib/seo.ts` — it is the base for every canonical URL, the
sitemap and the JSON-LD, so a stale value there is the one SEO mistake that
affects every page at once.

---

## Using the dashboard

**Insights → New post.** Title, excerpt, category, cover image, body in
Markdown. Save as a draft as often as you like; drafts are unreachable by URL,
including by guessing the slug. Publish when ready.

The slug is generated from the title and locks the first time you publish, so an
article's URL never changes under an existing link. The editor shows you how the
page will look in search results as you type.

**Messages** and **Consultations** are the two public forms. Mark items handled
so the queue stays meaningful.

**Subscribers** exports to CSV for whatever you send the brief with.

### Writing posts

Markdown, with the usual `##` headings, `**bold**`, lists, links and blockquotes.
Two conventions worth knowing:

- The first paragraph sets the tone — it is also what appears in the article
  listing if you leave the excerpt blank, so write the excerpt yourself.
- `##` headings become the table of contents on the article page. Use them.

---

## Two things to settle before going live

**Team photographs.** `src/lib/data/team.ts` carries a warning at the top. Only
the Principal Partner is confidently matched to his portrait — he is seated
centre-front in the group photograph. The other three portraits arrived without
names, and are assigned in the order the team was listed, which is a guess.
Check them against the people and correct the `photo` fields.

**Testimonials.** `src/lib/data/testimonials.ts` is deliberately empty, every
entry `published: false`. The section hides itself until there is something real
in it. Writing testimonials that no client said would be a professional-conduct
problem for an accounting firm, so these need to be collected and attributed, or
left out.

---

## Notes on a few decisions

**Server-rendered, not statically exported.** A static build would be marginally
faster and would mean republishing the whole site every time an article is
posted. Server rendering keeps publishing instant and keeps the article HTML
complete for crawlers.

**Markdown, not a rich-text editor.** Rich-text editors store their own HTML,
which drifts from whatever you migrate to next and is awkward to diff. Markdown
is text; it survives.

**`server-only` on `admin.ts` and `posts.ts`.** Those modules hold the service
account and the unfiltered queries. The import makes a build fail rather than
quietly bundle them into a client component.

**Form endpoints carry a honeypot field and per-IP rate limiting.** The rate
limiting is in-process, so it resets when an instance recycles — enough for
casual abuse, not a substitute for App Check if the forms are targeted.
# arrowedge
