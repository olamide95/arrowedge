/** Engagements as listed on the current site, grouped for the filter. */
export const ENGAGEMENTS = [
  { name: 'Central Bank of Nigeria',                                  type: 'Training', sector: 'Public' },
  { name: 'Borno State Internal Revenue Service',                     type: 'Audit',    sector: 'Public' },
  { name: 'National Productivity Centre',                             type: 'Audit',    sector: 'Public' },
  { name: 'Debt Management Office, Bauchi State',                     type: 'Audit',    sector: 'Public' },
  { name: 'Jos Metropolitan Development Board',                       type: 'Audit',    sector: 'Public' },
  { name: 'Inspired Technologies Ltd',                                type: 'Audit',    sector: 'Private' },
  { name: 'Blue Camel Energy Ltd',                                    type: 'Audit',    sector: 'Private' },
  { name: 'Strom Infrastructure Investment & Management Ltd',         type: 'Audit',    sector: 'Private' },
  { name: 'Dextra Projects Ltd',                                      type: 'Audit',    sector: 'Private' },
] as const;

export const ENGAGEMENT_TYPES = ['All', 'Audit', 'Training'] as const;
