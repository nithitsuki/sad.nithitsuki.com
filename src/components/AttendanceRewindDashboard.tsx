'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { useSubjects } from '@/contexts/SubjectContext';

type SubjectMetric = {
  course: string;
  name: string;
  total: number;
  minRequired: number;
  presentRaw: number;
  dutyLeave: number;
  medicalLeave: number;
  presentWithOD: number;
  currentPct: number;
  withoutODPct: number;
  withMLPct: number;
  skippedIncludingOD: number;
  wouldFailWithoutOD: boolean;
  wouldFailWithoutMedical: boolean;
};

export function AttendanceRewindDashboard() {
  const { subjects, settings } = useSubjects();

  const metrics = useMemo<SubjectMetric[]>(() => {
    return subjects.map((subject) => {
      const total = Math.max(0, subject.total || 0);
      const minRequired = Math.max(0, subject.MinAttendancePercentage || 0);
      const presentRaw = Math.max(0, subject.present || 0);
      const dutyLeave = Math.max(0, subject.dutyLeave || 0);
      const medicalLeave = Math.max(0, subject.medicalLeave || 0);

      const presentWithOD = Math.min(total, presentRaw + dutyLeave);
      const presentWithODAndML = Math.min(total, presentWithOD + medicalLeave);

      const currentPct = total > 0 ? (presentWithOD / total) * 100 : 0;
      const withoutODPct = total > 0 ? (presentRaw / total) * 100 : 0;
      const withMLPct = total > 0 ? (presentWithODAndML / total) * 100 : 0;
      const skippedIncludingOD = Math.max(0, total - presentRaw);

      const wouldFailWithoutOD = dutyLeave > 0 && currentPct >= minRequired && withoutODPct < minRequired;
      const wouldFailWithoutMedical = medicalLeave > 0 && withMLPct >= minRequired && currentPct < minRequired;

      return {
        course: subject.Course,
        name: settings.abbreviateNames ? subject.CourseAbbreviation : subject.Course,
        total,
        minRequired,
        presentRaw,
        dutyLeave,
        medicalLeave,
        presentWithOD,
        currentPct,
        withoutODPct,
        withMLPct,
        skippedIncludingOD,
        wouldFailWithoutOD,
        wouldFailWithoutMedical,
      };
    });
  }, [subjects, settings.abbreviateNames]);

  const hasAnyOD = useMemo(() => metrics.some((s) => s.dutyLeave > 0), [metrics]);
  const hasAnyML = useMemo(() => metrics.some((s) => s.medicalLeave > 0), [metrics]);

  const rewind = useMemo(() => {
    if (metrics.length === 0) return null;

    const sortedBySkippedDesc = [...metrics].sort((a, b) => b.skippedIncludingOD - a.skippedIncludingOD);
    const sortedBySkippedAsc = [...metrics].sort((a, b) => a.skippedIncludingOD - b.skippedIncludingOD);

    const mostSkipped = sortedBySkippedDesc[0];
    const barelySkipped = sortedBySkippedAsc[0];

    const totalSkipped = metrics.reduce((sum, s) => sum + s.skippedIncludingOD, 0);
    const totalAttended = metrics.reduce((sum, s) => sum + s.presentRaw, 0);
    const odSavedSubjects = metrics.filter((s) => s.wouldFailWithoutOD).length;
    const medicalSavedSubjects = metrics.filter((s) => s.wouldFailWithoutMedical).length;

    return {
      mostSkipped,
      barelySkipped,
      totalSkipped,
      totalSkippedMinutes: totalSkipped * 50,
      totalAttended,
      odSavedSubjects,
      medicalSavedSubjects,
    };
  }, [metrics]);

  if (!rewind) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-muted-foreground">
        No subjects loaded yet. Add subjects to view your rewind.
      </div>
    );
  }

  return (
    <div className="w-full p-0">
      <Card className="m-2 sm:m-3">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-semibold">Your Attendance Rewind</h2>
          <p className="text-sm text-muted-foreground mt-1">
            A quick look at how this semester really went.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 px-2 sm:px-3">
        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-muted-foreground">Most skipped subject</p>
            <p className="text-xl font-semibold mt-1">{rewind.mostSkipped.name}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {rewind.mostSkipped.skippedIncludingOD} skipped classes (OD included)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-muted-foreground">Barely skipped subject</p>
            <p className="text-xl font-semibold mt-1">{rewind.barelySkipped.name}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {rewind.barelySkipped.skippedIncludingOD} skipped classes (OD included)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-muted-foreground">Total classes skipped</p>
            <p className="text-xl font-semibold mt-1">{rewind.totalSkipped}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {rewind.totalSkippedMinutes} minutes ({(rewind.totalSkippedMinutes / 60).toFixed(1)} hours)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-muted-foreground">Total classes attended</p>
            <p className="text-xl font-semibold mt-1">{rewind.totalAttended}</p>
            <p className="text-sm text-muted-foreground mt-1">Physical attendance count</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-muted-foreground">Would fail without OD</p>
            <p className="text-xl font-semibold mt-1">{rewind.odSavedSubjects}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {hasAnyOD ? 'Subjects saved by OD' : 'No OD records found'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-muted-foreground">Would fail without medical leave</p>
            <p className="text-xl font-semibold mt-1">{rewind.medicalSavedSubjects}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {hasAnyML ? 'Subjects saved by medical leave' : 'No medical leave records found'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="m-2 sm:m-3">
        <CardTitle className="px-6 pt-6">Per-subject breakdown</CardTitle>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left py-2 pr-3">Subject</th>
                  <th className="text-right py-2 px-2">Total</th>
                  <th className="text-right py-2 px-2">Attended</th>
                  <th className="text-right py-2 px-2">Skipped (OD incl.)</th>
                  <th className="text-right py-2 px-2">Current %</th>
                  {hasAnyOD && <th className="text-right py-2 px-2">Without OD %</th>}
                  {hasAnyML && <th className="text-right py-2 px-2">With ML %</th>}
                </tr>
              </thead>
              <tbody>
                {metrics.map((subject) => (
                  <tr key={subject.course} className="border-b last:border-b-0">
                    <td className="py-2 pr-3 font-medium">{subject.name || subject.course}</td>
                    <td className="py-2 px-2 text-right">{subject.total}</td>
                    <td className="py-2 px-2 text-right">{subject.presentRaw}</td>
                    <td className="py-2 px-2 text-right">{subject.skippedIncludingOD}</td>
                    <td className="py-2 px-2 text-right">{subject.currentPct.toFixed(2)}%</td>
                    {hasAnyOD && <td className="py-2 px-2 text-right">{subject.withoutODPct.toFixed(2)}%</td>}
                    {hasAnyML && <td className="py-2 px-2 text-right">{subject.withMLPct.toFixed(2)}%</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
