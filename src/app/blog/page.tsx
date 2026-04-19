import Link from 'next/link';
import { Metadata } from 'next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BLOG_POSTS } from '@/lib/blogs';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Product notes, formulas, and implementation details.',
};

export default function BlogIndexPage() {
  const posts = [...BLOG_POSTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-3xl space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Blog</CardTitle>
            <CardDescription>Notes and explainers for dashboard behavior.</CardDescription>
          </CardHeader>
        </Card>

        {posts.map((post) => (
          <Card key={post.slug}>
            <CardHeader>
              <CardTitle>
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </CardTitle>
              <CardDescription>
                {new Date(`${post.publishedAt}T00:00:00Z`).toLocaleDateString('en-GB', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}{' '}
                · 4 min read
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{post.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
