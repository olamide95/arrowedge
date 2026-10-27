import type { TeamMember } from '@/types';

/**
 * ⚠️  PHOTO ATTRIBUTION — PLEASE VERIFY BEFORE GOING LIVE
 *
 * Only the Principal Partner is confidently matched: he is seated centre-front
 * in the group photograph, which is where the principal conventionally sits.
 *
 * The other three portraits were supplied without names attached. They are
 * assigned here in the order the team was listed, which is a guess. Putting
 * the wrong face against a colleague's name on a live professional-services
 * site is the kind of error clients notice, so confirm each one and swap the
 * `photo` paths below as needed. Members without a portrait render a tasteful
 * monogram instead — no placeholder stock faces.
 */
export const TEAM: TeamMember[] = [
  {
    name: 'Gideon Olajide Oloniyo',
    role: 'Principal Partner',
    photo: '/team/partner-1.png',
    credentials: 'FCA, FCTI',
    focus: 'Audit & assurance, regulatory engagement',
  },
  {
    name: 'Ekundayo Egunjobi',
    role: 'Partner',
    photo: '/team/partner-2.png', // ← verify
    focus: 'Tax advisory & revenue authority practice',
  },
  {
    name: 'Shola Jemisetemi',
    role: 'Partner',
    photo: '/team/partner-3.png', // ← verify
    focus: 'Business advisory & restructuring',
  },
  {
    name: 'Augustine Itsuekhai',
    role: 'Senior Manager',
    photo: '/team/partner-4.png', // ← verify
    focus: 'Statutory audit & internal control',
  },
  { name: 'Chidi Collins',     role: 'Manager',           photo: null, focus: 'Debt recovery & receivables' },
  { name: 'Precious Irabor',   role: 'Senior Associate',  photo: null, focus: 'Tax compliance & filing' },
  { name: 'Tayyib Abbas Umar', role: 'Senior Associate',  photo: null, focus: 'Risk & assurance' },
  { name: 'Augustina Ameh',    role: 'Associate',         photo: null, focus: 'Business support services' },
];
