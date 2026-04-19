'use client';

import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useSubjects } from '@/contexts/SubjectContext';

type SubjectMetric = {
  course: string;
  name: string;
  total: number;
  minRequired: number;
  realAttendance: number;
  realAbsent: number;
  od: number;
  ml: number;
  finalAttendance: number;
  finalAbsent: number;
  finalAttendanceWithML: number;
  finalAbsentWithML: number;
  finalPct: number;
  withoutODPct: number;
  withMLPct: number;
  wouldFailWithoutOD: boolean;
  wouldFailWithoutML: boolean;
};

const toPct = (numerator: number, denominator: number) =>
  denominator > 0 ? (numerator / denominator) * 100 : 0;

export function AttendanceRewindDashboard() {
  const { subjects, settings } = useSubjects();

  const metrics = useMemo<SubjectMetric[]>(() => {
    return subjects.map((subject) => {
      const total = Math.max(0, subject.total || 0);
      const minRequired = Math.max(0, subject.MinAttendancePercentage || 0);

      const realAttendance = Math.max(0, subject.present || 0);
      const realAbsentFromSource =
        Number.isFinite(subject.absent) ? subject.absent : total - realAttendance;
      const realAbsent = Math.max(0, realAbsentFromSource);
      const od = Math.max(0, subject.dutyLeave || 0);
      const ml = Math.max(0, subject.medicalLeave || 0);

      // Rigid model:
      // FinalAttendance = RealAttendance + ODs
      // FinalAbsent = RealAbsent - ODs
      // FinalAttendanceWithML = FinalAttendance + ML
      // FinalAbsentWithML = FinalAbsent - ML
      const finalAttendance = Math.min(total, Math.max(0, realAttendance + od));
      const finalAbsent = Math.max(0, realAbsent - od);
      const finalAttendanceWithML = Math.min(total, Math.max(0, finalAttendance + ml));
      const finalAbsentWithML = Math.max(0, finalAbsent - ml);

      const finalPct = toPct(finalAttendance, total);
      const withoutODPct = toPct(realAttendance, total);
      const withMLPct = toPct(finalAttendanceWithML, total);

      const wouldFailWithoutOD =
        od > 0 && finalPct >= minRequired && withoutODPct < minRequired;
      const wouldFailWithoutML =
        ml > 0 && withMLPct >= minRequired && finalPct < minRequired;

      return {
        course: subject.Course,
        name:
          (settings.abbreviateNames
            ? subject.CourseAbbreviation
            : subject.Course) || subject.Course,
        total,
        minRequired,
        realAttendance,
        realAbsent,
        od,
        ml,
        finalAttendance,
        finalAbsent,
        finalAttendanceWithML,
        finalAbsentWithML,
        finalPct,
        withoutODPct,
        withMLPct,
        wouldFailWithoutOD,
        wouldFailWithoutML,
      };
    });
  }, [subjects, settings.abbreviateNames]);

  const hasAnyOD = useMemo(() => metrics.some((s) => s.od > 0), [metrics]);
  const hasAnyML = useMemo(() => metrics.some((s) => s.ml > 0), [metrics]);

  const rewind = useMemo(() => {
    if (metrics.length === 0) return null;

    const bySkippedDesc = [...metrics].sort((a, b) => b.finalAbsent - a.finalAbsent);
    const bySkippedAsc = [...metrics].sort((a, b) => a.finalAbsent - b.finalAbsent);

    const mostSkipped = bySkippedDesc[0];
    const barelySkipped = bySkippedAsc[0];
    const totalSkipped = metrics.reduce((sum, s) => sum + s.finalAbsent, 0);
    const totalAttended = metrics.reduce((sum, s) => sum + s.finalAttendance, 0);
    const totalClasses = metrics.reduce((sum, s) => sum + s.total, 0);

    return {
      mostSkipped,
      barelySkipped,
      totalSkipped,
      totalSkippedMinutes: totalSkipped * 50,
      totalAttended,
      totalAttendedMinutes: totalAttended * 50,
      totalClasses,
      totalAttendancePct: toPct(totalAttended, totalClasses),
      failWithoutODCount: metrics.filter((s) => s.wouldFailWithoutOD).length,
      failWithoutMLCount: metrics.filter((s) => s.wouldFailWithoutML).length,
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
    <div className="w-full space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Your Attendance Rewind</CardTitle>
          <CardDescription>
            Based on FinalAttendance/FinalAbsent with OD and medical adjustments.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="space-y-1">
            <p className="text-sm text-muted-foreground">Most skipped subject</p>
            <p className="text-xl font-semibold">{rewind.mostSkipped.name}</p>
            <p className="text-sm text-muted-foreground">
              {rewind.mostSkipped.finalAbsent} skipped classes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1">
            <p className="text-sm text-muted-foreground">Barely skipped subject</p>
            <p className="text-xl font-semibold">{rewind.barelySkipped.name}</p>
            <p className="text-sm text-muted-foreground">
              {rewind.barelySkipped.finalAbsent} skipped classes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1">
            <p className="text-sm text-muted-foreground">Total classes skipped</p>
            <p className="text-xl font-semibold">{rewind.totalSkipped}</p>
            <p className="text-sm text-muted-foreground">
              {rewind.totalSkippedMinutes} minutes ({(rewind.totalSkippedMinutes / 60).toFixed(1)} hours)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1">
            <p className="text-sm text-muted-foreground">Total classes attended</p>
            <p className="text-xl font-semibold">{rewind.totalAttended}</p>
            <p className="text-sm text-muted-foreground">
              {rewind.totalAttendedMinutes} minutes ({(rewind.totalAttendedMinutes / 60).toFixed(1)} hours)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1">
            <p className="text-sm text-muted-foreground">Would fail without ODs</p>
            <p className="text-xl font-semibold">{rewind.failWithoutODCount}</p>
            <p className="text-sm text-muted-foreground">
              {hasAnyOD ? 'Subjects saved by OD' : 'No OD records found'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1">
            <p className="text-sm text-muted-foreground">Would fail without medical leave</p>
            <p className="text-xl font-semibold">{rewind.failWithoutMLCount}</p>
            <p className="text-sm text-muted-foreground">
              {hasAnyML ? 'Subjects saved by ML' : 'No medical leave records found'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Per-subject breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left py-2 pr-3">Subject</th>
                  <th className="text-right py-2 px-2">Total</th>
                  <th className="text-right py-2 px-2">Final Attendance</th>
                  <th className="text-right py-2 px-2">Final Absent</th>
                  <th className="text-right py-2 px-2">Current %</th>
                  {hasAnyOD && <th className="text-right py-2 px-2">Without OD %</th>}
                  {hasAnyML && <th className="text-right py-2 px-2">With ML %</th>}
                </tr>
              </thead>
              <tbody>
                {metrics.map((subject) => (
                  <tr key={subject.course} className="border-b last:border-b-0">
                    <td className="py-2 pr-3 font-medium">{subject.name}</td>
                    <td className="py-2 px-2 text-right">{subject.total}</td>
                    <td className="py-2 px-2 text-right">{subject.finalAttendance}</td>
                    <td className="py-2 px-2 text-right">{subject.finalAbsent}</td>
                    <td className="py-2 px-2 text-right">{subject.finalPct.toFixed(2)}%</td>
                    {hasAnyOD && <td className="py-2 px-2 text-right">{subject.withoutODPct.toFixed(2)}%</td>}
                    {hasAnyML && <td className="py-2 px-2 text-right">{subject.withMLPct.toFixed(2)}%</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="border-t justify-between">
          <span className="text-sm text-muted-foreground">Total attendance percentage</span>
          <span className="font-semibold">{rewind.totalAttendancePct.toFixed(2)}%</span>
        </CardFooter>
      </Card>
    </div>
  );
}
