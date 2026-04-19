import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How Amrita Attendance System Works',
  description: 'A short guide to how attendance, OD, and medical leave are interpreted in the Amrita attendance dashboard.',
};

export default function HowAmritaAttendanceWorksPage() {
  return (
    <main className="min-h-screen px-4 py-10 sm:px-6">
      <article className="mx-auto w-full max-w-3xl rounded-lg border bg-background/70 p-6 sm:p-8">
        <h1 className="text-3xl font-semibold">How Amrita Attendance System Works</h1>
        <p className="mt-3 text-muted-foreground">
          This note explains exactly how attendance numbers are interpreted in this app.
        </p>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">Base fields</h2>
          <p>
            We start with these values from synced subject data:
          </p>
          <ul className="list-disc pl-6">
            <li><strong>RealAttendance</strong> = Present</li>
            <li><strong>RealAbsent</strong> = Absent</li>
            <li><strong>ODs</strong> = Duty Leave</li>
            <li><strong>ML</strong> = Medical Leave</li>
          </ul>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">Rigid formulas used</h2>
          <ul className="list-disc pl-6">
            <li><strong>FinalAttendance</strong> = RealAttendance + ODs</li>
            <li><strong>FinalAbsent</strong> = RealAbsent - ODs</li>
            <li><strong>FinalAttendanceWithML</strong> = FinalAttendance + ML</li>
            <li><strong>FinalAbsentWithML</strong> = FinalAbsent - ML</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Values are clamped to valid ranges in UI (no negative absent, no attendance above total).
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">Percentages</h2>
          <ul className="list-disc pl-6">
            <li><strong>Current %</strong> = FinalAttendance / Total × 100</li>
            <li><strong>Without OD %</strong> = RealAttendance / Total × 100</li>
            <li><strong>With ML %</strong> = FinalAttendanceWithML / Total × 100</li>
          </ul>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">Failure counters used in YAR</h2>
          <ul className="list-disc pl-6">
            <li>
              <strong>Would fail without ODs</strong>: subject has OD, current percentage passes minimum, but without OD percentage fails.
            </li>
            <li>
              <strong>Would fail without ML</strong>: subject has ML, with-ML percentage passes minimum, but current percentage fails.
            </li>
          </ul>
        </section>
      </article>
    </main>
  );
}
