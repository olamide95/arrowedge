export type PostStatus = 'draft' | 'published';

export interface Post {
  id: string;
  /** URL segment. Immutable once published — changing it breaks inbound links. */
  slug: string;
  title: string;
  /** Shown on cards and used as the meta description when seoDescription is blank. */
  excerpt: string;
  /** Markdown. Stored as written so it stays portable and diffable. */
  content: string;
  coverImage: string | null;
  coverAlt: string;
  category: string;
  tags: string[];
  author: { name: string; role: string; avatar: string | null };
  status: PostStatus;
  featured: boolean;
  /** Epoch ms. Null while a draft. */
  publishedAt: number | null;
  updatedAt: number;
  createdAt: number;
  readingMinutes: number;
  seo: { title: string; description: string; keywords: string[]; noIndex: boolean };
}

export type PostInput = Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'readingMinutes'>;

export interface Category { id: string; slug: string; name: string; description: string }

export interface Message {
  id: string; name: string; email: string; phone: string;
  subject: string; message: string; createdAt: number; read: boolean;
}

export interface Booking {
  id: string; name: string; email: string; phone: string; company: string;
  service: string; preferredDate: string; notes: string;
  createdAt: number; status: 'new' | 'contacted' | 'scheduled' | 'closed';
}

export interface Subscriber { id: string; email: string; createdAt: number; active: boolean }

export interface Service {
  slug: string; title: string; tagline: string; summary: string;
  icon: string; deliverables: string[]; outcomes: string[];
  process: { step: string; detail: string }[];
}

export interface TeamMember {
  name: string; role: string; photo: string | null;
  credentials?: string; focus?: string; linkedin?: string;
}
