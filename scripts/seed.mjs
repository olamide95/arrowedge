/**
 * Seeds Firestore with three starter Insights posts and bootstraps an admin.
 *
 *   npm run seed
 *
 * Reads credentials from .env.local (the script is invoked with
 * --env-file=.env.local by the npm script, so no dotenv dependency).
 *
 * Safe to re-run: posts are written by slug, so a second run overwrites the
 * seeded three and leaves anything you have written yourself alone.
 *
 * To make yourself an admin, create the user in Firebase Console → Auth, then:
 *   SEED_ADMIN_UID=<the uid> SEED_ADMIN_EMAIL=<you@domain> npm run seed
 */
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;

if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
  console.error(
    '\n  Missing service-account credentials.\n' +
      '  Copy .env.local.example to .env.local and fill in FIREBASE_PROJECT_ID,\n' +
      '  FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY from a service-account key.\n',
  );
  process.exit(1);
}

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

const posts = [
  {
    slug: 'finance-act-2026-what-changed-for-nigerian-companies',
    title: 'Finance Act 2026: what actually changed for Nigerian companies',
    category: 'Tax',
    excerpt:
      'Nine amendments matter in practice. We work through each one, what it does to your effective rate, and the filings that need to change before your next return.',
    author: 'Arrow-Edge Tax Practice',
    readingMinutes: 9,
    tags: ['Finance Act', 'Companies Income Tax', 'Compliance'],
    status: 'published',
    featured: true,
    content: `Every Finance Act arrives with more commentary than substance. This one is
no different — but a handful of its provisions do change the arithmetic for
ordinary Nigerian companies, and a few change the paperwork even where the
arithmetic stays put.

## The amendments that move numbers

### Minimum tax

The computation has been simplified, and the exemption threshold raised. For a
company in a loss year with meaningful turnover, this is the single largest
change in the Act: where minimum tax previously bit at the higher of four bases,
it now applies on one.

Work through a loss year under both regimes before you assume the new position
is better. For asset-heavy companies with modest turnover it generally is. For
trading companies with thin margins and high turnover it can go the other way.

### Capital allowances on qualifying expenditure

The restriction on claiming allowances against non-related income has been
tightened. In practice this means a company with a single trade is unaffected,
and a company with investment income alongside its trade will find a portion of
its allowances ring-fenced.

### Withholding tax on construction

Rates on construction contracts have been revised, and — more importantly — the
definition of what constitutes construction for withholding purposes has been
widened to capture certain installation and commissioning work previously
treated as a service.

If you engage contractors, your procurement templates almost certainly deduct at
the old rate for the newly captured categories. That exposes you, not the
contractor, to the shortfall plus interest.

## The amendments that move paperwork

Three changes carry no rate impact but do require a change in filing practice:

1. **Transfer pricing declarations** are now due with the income tax return
   rather than separately, which brings the deadline forward for most companies.
2. **Returns for companies in liquidation** must now be filed for the period to
   the date of the winding-up order, not the accounting year end.
3. **Electronic filing** is mandatory above a turnover threshold; paper filings
   above it are treated as not filed, which is a materially different outcome
   from late filing.

## What to do before your next return

Reconcile your current-year computation under both the old and new provisions.
Where the Act improves your position, the saving only materialises if the
computation is prepared on the new basis — the FIRS will not restate it for you.
Where it worsens your position, you want to know before the assessment, not after.

Second, review your withholding schedule against the revised construction
definitions. This is the provision most likely to produce an unwelcome
reconciliation two years from now.

If you would like us to run your current computation both ways, that is a short
piece of work and we are happy to do it.`,
  },
  {
    slug: 'what-auditors-look-for-in-your-fixed-asset-register',
    title: 'What auditors actually look for in your fixed asset register',
    category: 'Audit',
    excerpt:
      'The register is where more audit queries originate than any other schedule. Six checks you can run yourself before we arrive, and why each one matters.',
    author: 'Arrow-Edge Audit Practice',
    readingMinutes: 7,
    tags: ['Audit', 'Fixed Assets', 'Year End'],
    status: 'published',
    featured: false,
    content: `A fixed asset register is a simple document that goes wrong in predictable
ways. Of the queries we raise in a typical first-year audit, a disproportionate
number trace back to this one schedule — not because the numbers are wrong, but
because the register cannot demonstrate that they are right.

Here is what we test, and what you can check yourself first.

## 1. Does the register reconcile to the ledger?

Start here, because nothing else matters if this fails. Cost and accumulated
depreciation per the register must agree to the trial balance, line by line, by
class. A difference of any size needs explaining, and "rounding" is not an
explanation at the class level.

## 2. Are additions supported?

For each addition above your testing threshold we expect an invoice, evidence of
payment, and evidence that the asset exists. The third is the one most often
missing. A capitalised cost with no asset behind it is the classic route to an
overstated balance sheet.

## 3. Is the capitalisation boundary applied consistently?

Your policy sets a threshold. The register should show no items below it, and the
repairs account should show no items above it that look like assets. Both
directions of error occur, and the second is more common: a replacement engine
expensed because it arrived on a maintenance invoice.

## 4. Do the useful lives still make sense?

Lives set at acquisition are rarely revisited. We look for assets fully
depreciated but still in use — which suggests lives are too short — and assets
carrying substantial value well past their practical life, which suggests the
opposite. Neither is fatal; both need a considered answer.

## 5. Have disposals been removed?

Both cost and accumulated depreciation. A disposal that removes only the cost
leaves a credit balance in accumulated depreciation that persists for years and
quietly understates the depreciation charge.

## 6. Can someone walk you to the assets?

We will select items and ask to see them. Where assets are at multiple sites,
the register needs a location field that is maintained. Where they are with
employees — laptops, phones, vehicles — it needs a custodian field.

## Before we arrive

Run the reconciliation in point one and resolve any difference. Pull the
supporting file for your ten largest additions. Walk your own register for a
sample of items and confirm you can find them.

An afternoon of this work saves several days of queries, and it changes the tone
of the audit from investigation to confirmation.`,
  },
  {
    slug: 'choosing-a-business-structure-in-nigeria',
    title: 'Choosing a business structure in Nigeria: a practical comparison',
    category: 'Advisory',
    excerpt:
      'Business name, limited company, limited by guarantee or partnership — the real differences in liability, tax and credibility, without the textbook framing.',
    author: 'Arrow-Edge Advisory',
    readingMinutes: 8,
    tags: ['Company Registration', 'CAC', 'Structure'],
    status: 'published',
    featured: false,
    content: `Most people asking this question have already been told the textbook answer
and found it unhelpful, because it compares the structures on dimensions that do
not matter to them. Here is the comparison on the dimensions that do.

## The four structures in practice

**Business name registration** is a register entry, not an entity. You and the
business are the same person in law. It is quick, inexpensive, and adequate for a
sole trader with no employees and no meaningful contract risk.

**Private company limited by shares** is a separate legal person. Your liability
stops at your unpaid share capital. This is the right answer for the large
majority of commercial ventures, and the question is usually when to incorporate
rather than whether.

**Company limited by guarantee** has no share capital and distributes no profit.
It is the vehicle for non-profit activity, and it requires the Attorney-General's
consent — which adds months, not weeks.

**Limited partnership and LLP** suit professional practices and joint ventures
where partners want pass-through treatment with some liability protection.

## Liability: the difference that actually bites

With a business name, a judgment against the business is a judgment against you,
enforceable against your house and your personal accounts. With a limited
company, it is enforceable against the company's assets.

That distinction is worth more than it sounds, and it is worth most precisely
when things go badly — which is when you cannot retrospectively incorporate.

The protection is not absolute. It falls away where you have given a personal
guarantee, where you have traded while insolvent, and where you have not kept
company and personal money apart. The last is the common failure: a company
account used as a personal wallet invites a court to treat the separation as
fiction.

## Tax: not the deciding factor people expect

A business name's profits are taxed as your personal income, at graduated rates
to 24 per cent. A company pays companies income tax — 0 per cent below the small
company turnover threshold, 20 per cent for medium companies, 30 per cent above.

Below the small company threshold, a company can be the lower-tax option, which
surprises people who assume incorporation costs more. Above it, the comparison
turns on whether you draw the profit or retain it, and on whether you can take
part of your return as salary.

Do the arithmetic on your own numbers. The general answer is not reliable.

## Credibility and access

This is the dimension clients raise last and feel first. Corporate customers
often require an incorporated supplier. Banks lend to companies on terms they
will not offer a business name. Investors cannot take equity in a register entry.

If your plans include any of these, incorporate now rather than converting later
— conversion means a new entity, new contracts, new bank accounts and, often, a
new tax identification number.

## A reasonable default

For a commercial venture with employees, contracts or growth ambitions: a private
company limited by shares. For a one-person service business with modest turnover
and little contract exposure: a business name, with incorporation planned for the
point where any of liability, lending or corporate customers becomes relevant.

We handle both registrations, and we would rather talk through your particulars
than have you pick from a list.`,
  },
];

async function run() {
  const batch = db.batch();

  for (const post of posts) {
    const ref = db.collection('posts').doc(post.slug);
    batch.set(
      ref,
      {
        ...post,
        coverImage: null,
        publishedAt: FieldValue.serverTimestamp(),
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
  }

  await batch.commit();
  console.log(`  ✓ seeded ${posts.length} posts`);

  const uid = process.env.SEED_ADMIN_UID;
  if (uid) {
    await db
      .collection('admins')
      .doc(uid)
      .set(
        {
          email: process.env.SEED_ADMIN_EMAIL ?? null,
          createdAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    console.log(`  ✓ admins/${uid} created — that account can now sign in at /admin`);
  } else {
    console.log(
      '  · no SEED_ADMIN_UID given, so no admin was created.\n' +
        '    Create the user in Firebase Console → Authentication, copy its UID, then:\n' +
        '    SEED_ADMIN_UID=<uid> SEED_ADMIN_EMAIL=<email> npm run seed',
    );
  }
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('\n  Seed failed:', err.message, '\n');
    process.exit(1);
  });
