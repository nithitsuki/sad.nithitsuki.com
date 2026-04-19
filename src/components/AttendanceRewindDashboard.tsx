'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { useSubjects } from '@/contexts/SubjectContext';

export function AttendanceRewindDashboard() {
  const { subjects, settings } = useSubjects();

  const subjectMetrics = useMemo(() => {
    return subjects.map((subject) => {
      const total = Math.max(0, subject.total || 0);
      const minRequired = Math.max(0, subject.MinAttendancePercentage || 0);
      const presentRaw = Math.max(0, subject.present || 0);
      const dutyLeave = Math.max(0, subject.dutyLeave || 0);
      const medicalLeave = Math.max(0, subject.medicalLeave || 0);

      // Mirrors SubjectCard behavior: current attendance includes OD.
      const presentWithOD = Math.min(total, presentRaw + dutyLeave);
      const presentWithODAndMedical = Math.min(total, presentWithOD + medicalLeave);

      const attendancePct = total > 0 ? (presentWithOD / total) * 100 : 0;
      const attendanceWithMedicalPct = total > 0 ? (presentWithODAndMedical / total) * 100 : 0;

      const absentCurrent = Math.max(0, total - presentWithOD);
      const absentWithMedical = Math.max(0, total - presentWithODAndMedical);
      const denominator = 100 - minRequired;

      const classesNeededCurrent =
        total > 0 && denominator > 0
          ? Math.max(0, Math.ceil((minRequired * total - 100 * presentWithOD) / denominator))
          : 0;
      const classesNeededWithMedical =
        total > 0 && denominator > 0
          ? Math.max(0, Math.ceil((minRequired * total - 100 * presentWithODAndMedical) / denominator))
          : 0;

      const skippableCurrent =
        total > 0 && minRequired > 0
          ? Math.max(0, Math.floor((presentWithOD * (100 - minRequired)) / minRequired - absentCurrent))
          : 0;
      const skippableWithMedical =
        total > 0 && minRequired > 0
          ? Math.max(0, Math.floor((presentWithODAndMedical * (100 - minRequired)) / minRequired - absentWithMedical))
          : 0;

      const isSafe = attendancePct >= minRequired;
      const displayName = settings.abbreviateNames ? subject.CourseAbbreviation : subject.Course;

      return {
        course: subject.Course,
        name: displayName || subject.Course,
        total,
        minRequired,
        dutyLeave,
        medicalLeave,
        presentWithOD,
        attendancePct,
        attendanceWithMedicalPct,
        classesNeededCurrent,
        classesNeededWithMedical,
        skippableCurrent,
        skippableWithMedical,
        isSafe,
      };
    });
  }, [subjects, settings.abbreviateNames]);

  const overallMetrics = useMemo(() => {
    if (subjectMetrics.length === 0) return null;

    const totalClasses = subjectMetrics.reduce((sum, s) => sum + s.total, 0);
    const currentPresent = subjectMetrics.reduce((sum, s) => sum + s.presentWithOD, 0);
    const presentWithMedical = subjectMetrics.reduce(
      (sum, s) => sum + Math.min(s.total, s.presentWithOD + s.medicalLeave),
      0
    );
    const totalOD = subjectMetrics.reduce((sum, s) => sum + s.dutyLeave, 0);
    const totalMedical = subjectMetrics.reduce((sum, s) => sum + s.medicalLeave, 0);
    const atRiskSubjects = subjectMetrics.filter((s) => s.total > 0 && !s.isSafe).length;
    const rescuedByMedical = subjectMetrics.filter(
      (s) => s.total > 0 && !s.isSafe && s.attendanceWithMedicalPct >= s.minRequired
    ).length;

    return {
      totalClasses,
      currentPresent,
      presentWithMedical,
      totalOD,
      totalMedical,
      currentAverage: totalClasses > 0 ? (currentPresent / totalClasses) * 100 : 0,
      withMedicalAverage: totalClasses > 0 ? (presentWithMedical / totalClasses) * 100 : 0,
      atRiskSubjects,
      rescuedByMedical,
    };
  }, [subjectMetrics]);

  if (!overallMetrics) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-muted-foreground">
        No subjects loaded yet. Add subjects to view analytics.
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl space-y-4 p-2 sm:p-4">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-2xl font-semibold">Your Attendance Rewind</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Current attendance uses <span className="font-medium">Present + OD</span>. Medical leave is shown separately as a projection.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Current Attendance</p>
            <p className="text-3xl font-bold">{overallMetrics.currentAverage.toFixed(2)}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              {overallMetrics.currentPresent} / {overallMetrics.totalClasses}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">With Medical Leave</p>
            <p className="text-3xl font-bold">{overallMetrics.withMedicalAverage.toFixed(2)}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              {overallMetrics.presentWithMedical} / {overallMetrics.totalClasses}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Leaves Tracked</p>
            <p className="text-3xl font-bold">{overallMetrics.totalOD + overallMetrics.totalMedical}</p>
            <p className="text-xs text-muted-foreground mt-1">
              OD {overallMetrics.totalOD} · ML {overallMetrics.totalMedical}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Subjects at Risk</p>
            <p className="text-3xl font-bold">{overallMetrics.atRiskSubjects}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {overallMetrics.rescuedByMedical} become safe with ML
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardTitle className="px-6 pt-6">Per-subject breakdown</CardTitle>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left py-2 pr-3">Subject</th>
                  <th className="text-right py-2 px-2">Total</th>
                  <th className="text-right py-2 px-2">Present</th>
                  <th className="text-right py-2 px-2">OD</th>
                  <th className="text-right py-2 px-2">ML</th>
                  <th className="text-right py-2 px-2">Current %</th>
                  <th className="text-right py-2 px-2">With ML %</th>
                  <th className="text-right py-2 pl-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {subjectMetrics.map((subject) => (
                  <tr key={subject.course} className="border-b last:border-b-0">
                    <td className="py-2 pr-3 font-medium">{subject.name}</td>
                    <td className="py-2 px-2 text-right">{subject.total}</td>
                    <td className="py-2 px-2 text-right">{subject.presentWithOD}</td>
                    <td className="py-2 px-2 text-right">{subject.dutyLeave}</td>
                    <td className="py-2 px-2 text-right">{subject.medicalLeave}</td>
                    <td className="py-2 px-2 text-right">{subject.attendancePct.toFixed(2)}%</td>
                    <td className="py-2 px-2 text-right">{subject.attendanceWithMedicalPct.toFixed(2)}%</td>
                    <td className="py-2 pl-3 text-right">
                      {subject.isSafe ? (
                        <span className="text-green-600">Skip {subject.skippableCurrent}</span>
                      ) : (
                        <span className="text-red-500">Need {subject.classesNeededCurrent}</span>
                      )}
                      {subject.medicalLeave > 0 && (
                        <div className="text-xs text-muted-foreground">
                          ML: {subject.attendanceWithMedicalPct >= subject.minRequired
                            ? `Skip ${subject.skippableWithMedical}`
                            : `Need ${subject.classesNeededWithMedical}`}
                        </div>
                      )}
                    </td>
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
