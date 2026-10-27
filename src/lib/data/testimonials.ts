/**
 * ⚠️  PLACEHOLDER — REPLACE WITH REAL, ATTRIBUTED QUOTES BEFORE LAUNCH.
 *
 * These are left deliberately generic and unattributed rather than invented
 * with plausible names and job titles. A fabricated testimonial on an
 * accounting firm's site is a professional-conduct problem, not a design
 * placeholder — so nothing here pretends to be a real client.
 *
 * Replace each entry with a genuine quote you have written permission to use.
 * The section hides itself automatically while `published` is false on all of
 * them, so the page looks finished either way.
 */
export const TESTIMONIALS = [
  { quote: '', author: '', role: '', organisation: '', published: false },
  { quote: '', author: '', role: '', organisation: '', published: false },
  { quote: '', author: '', role: '', organisation: '', published: false },
];

export const publishedTestimonials = () => TESTIMONIALS.filter((t) => t.published && t.quote);
