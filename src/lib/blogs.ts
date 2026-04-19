export type BlogMeta = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
};

export const BLOG_POSTS: BlogMeta[] = [
  {
    slug: 'how-amrita-attendance-system-works',
    title: 'How Amrita Attendance System Works',
    description:
      'How attendance, OD, and medical leave are interpreted in this dashboard.',
    publishedAt: '2026-04-19',
  },
];
