import { Metadata } from 'next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BLOG_POSTS } from '@/lib/blogs';

const post = BLOG_POSTS.find((p) => p.slug === 'how-amrita-attendance-system-works');

export const metadata: Metadata = {
  title: post?.title ?? 'How Amrita Attendance System Works',
  description:
    post?.description ??
    'A short guide to how attendance, OD, and medical leave are interpreted in the Amrita attendance dashboard.',
};

export default function HowAmritaAttendanceWorksPage() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-3xl space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{post?.title}</CardTitle>
            <CardDescription>
              Published on{' '}
              {post
                ? new Date(`${post.publishedAt}T00:00:00Z`).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Unknown date'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">Base fields</h2>
              <p>We start with these values from synced subject data:</p>
              <ul className="list-disc pl-6">
                <li>
                  <strong>RealAttendance</strong> = Present
                </li>
                <li>
                  <strong>RealAbsent</strong> = Absent
                </li>
                <li>
                  <strong>ODs</strong> = Duty Leave
                </li>
                <li>
                  <strong>ML</strong> = Medical Leave
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold">Rigid formulas used</h2>
              <ul className="list-disc pl-6">
                <li>
                  <strong>FinalAttendance</strong> = RealAttendance + ODs
                </li>
                <li>
                  <strong>FinalAbsent</strong> = RealAbsent - ODs
                </li>
                <li>
                  <strong>FinalAttendanceWithML</strong> = FinalAttendance + ML
                </li>
                <li>
                  <strong>FinalAbsentWithML</strong> = FinalAbsent - ML
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold">Percentages</h2>
              <ul className="list-disc pl-6">
                <li>
                  <strong>Current %</strong> = FinalAttendance / Total × 100
                </li>
                <li>
                  <strong>Without OD %</strong> = RealAttendance / Total × 100
                </li>
                <li>
                  <strong>With ML %</strong> = FinalAttendanceWithML / Total × 100
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold">Failure counters in YAR</h2>
              <ul className="list-disc pl-6">
                <li>
                  <strong>Would fail without ODs</strong>: subject has OD, current percentage passes minimum, but without OD percentage fails.
                </li>
                <li>
                  <strong>Would fail without ML</strong>: subject has ML, with-ML percentage passes minimum, but current percentage fails.
                </li>
              </ul>
            </section>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
