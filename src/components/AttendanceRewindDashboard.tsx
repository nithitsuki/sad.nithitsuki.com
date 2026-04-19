'use client';

import React, { useMemo } from 'react';
import { Card, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSubjects, type SubjectData } from '@/contexts/SubjectContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ScatterChart, Scatter } from 'recharts';
import { ArrowUpRight, ArrowDownRight, TrendingUp, AlertCircle } from 'lucide-react';

export function AttendanceRewindDashboard() {
  const { subjects, settings } = useSubjects();

  const topPerformers = useMemo(() => {
    return [...subjects]
      .sort((a, b) => {
        const aPerc = a.total > 0 ? (a.present / a.total) * 100 : 0;
        const bPerc = b.total > 0 ? (b.present / b.total) * 100 : 0;
        return bPerc - aPerc;
      })
      .slice(0, 3);
  }, [subjects]);

  const atRiskSubjects = useMemo(() => {
    return subjects.filter(s => {
      const perc = s.total > 0 ? (s.present / s.total) * 100 : 0;
      return perc < 75 && s.total > 0;
    });
  }, [subjects]);

  const attendanceTrend = useMemo(() => {
    return subjects.map((subject, idx) => {
      const percentage = subject.total > 0 ? (subject.present / subject.total) * 100 : 0;
      const name = settings.abbreviateNames ? subject.CourseAbbreviation : subject.Course;
      return {
        name,
        index: idx + 1,
        percentage: parseFloat(percentage.toFixed(1)),
        present: subject.present,
        total: subject.total,
        minRequired: Math.ceil(subject.total * (subject.MinAttendancePercentage / 100)),
        od: subject.dutyLeave || 0,
      };
    });
  }, [subjects, settings.abbreviateNames]);

  const classWiseMetrics = useMemo(() => {
    if (subjects.length === 0) return [];
    
    return subjects.map(subject => {
      const classesNeeded = Math.max(0, Math.ceil((subject.MinAttendancePercentage * subject.total - 100 * subject.present) / (100 - subject.MinAttendancePercentage)));
      const canSkip = Math.floor((subject.present * (100 - subject.MinAttendancePercentage) / subject.MinAttendancePercentage) - (subject.total - subject.present));
      const name = settings.abbreviateNames ? subject.CourseAbbreviation : subject.Course;
      
      return {
        name,
        needed: Math.max(0, classesNeeded),
        canSkip: Math.max(0, canSkip),
        remaining: subject.total - subject.present,
      };
    });
  }, [subjects, settings.abbreviateNames]);

  const overallMetrics = useMemo(() => {
    if (subjects.length === 0) return null;
    
    const totalClasses = subjects.reduce((sum, s) => sum + s.total, 0);
    const totalPresent = subjects.reduce((sum, s) => sum + s.present, 0);
    const totalOD = subjects.reduce((sum, s) => sum + (s.dutyLeave || 0), 0);
    const average = totalClasses > 0 ? (totalPresent / totalClasses) * 100 : 0;
    
    return {
      totalClasses,
      totalPresent,
      totalOD,
      totalAbsent: totalClasses - totalPresent - totalOD,
      average: average.toFixed(1),
      criticalSubjects: atRiskSubjects.length,
      excellentSubjects: topPerformers.filter(s => {
        const perc = s.total > 0 ? (s.present / s.total) * 100 : 0;
        return perc >= 95;
      }).length,
    };
  }, [subjects, atRiskSubjects, topPerformers]);

  if (!overallMetrics) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-gray-500">
        No subjects loaded yet. Add subjects to view analytics.
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 p-4">
      <div>
        <h1 className="text-3xl font-bold mb-1">Your Attendance Rewind</h1>
        <p className="text-gray-500">Comprehensive attendance analytics and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">Overall Attendance</p>
              <p className="text-3xl font-bold text-blue-600">{overallMetrics.average}%</p>
              <p className="text-xs text-gray-400 mt-2">{overallMetrics.totalPresent} / {overallMetrics.totalClasses} classes</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">Excellent Subjects</p>
              <p className="text-3xl font-bold text-green-600">{overallMetrics.excellentSubjects}</p>
              <p className="text-xs text-gray-400 mt-2">With ≥95% attendance</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">At-Risk Subjects</p>
              <p className="text-3xl font-bold text-red-600">{overallMetrics.criticalSubjects}</p>
              <p className="text-xs text-gray-400 mt-2">Below 75% attendance</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">OD/Duty Leaves</p>
              <p className="text-3xl font-bold text-orange-600">{overallMetrics.totalOD}</p>
              <p className="text-xs text-gray-400 mt-2">Total throughout semester</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card>
        <CardTitle className="px-6 pt-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Top Performers
        </CardTitle>
        <CardContent className="pt-4">
          <div className="space-y-3">
            {topPerformers.map((subject, idx) => {
              const percentage = subject.total > 0 ? (subject.present / subject.total) * 100 : 0;
              const name = settings.abbreviateNames ? subject.CourseAbbreviation : subject.Course;
              return (
                <div key={subject.Course} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{name}</p>
                      <p className="text-xs text-gray-500">{subject.present} / {subject.total} classes</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">{percentage.toFixed(1)}%</p>
                    <ArrowUpRight className="w-4 h-4 text-green-600 ml-auto" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* At-Risk Subjects */}
      {atRiskSubjects.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardTitle className="px-6 pt-6 flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            Subjects Needing Attention
          </CardTitle>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {atRiskSubjects.map((subject) => {
                const percentage = subject.total > 0 ? (subject.present / subject.total) * 100 : 0;
                const name = settings.abbreviateNames ? subject.CourseAbbreviation : subject.Course;
                const classesNeeded = Math.ceil((subject.MinAttendancePercentage * subject.total - 100 * subject.present) / (100 - subject.MinAttendancePercentage));
                return (
                  <div key={subject.Course} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                    <div>
                      <p className="font-semibold text-sm">{name}</p>
                      <p className="text-xs text-gray-500">
                        Need {Math.max(0, classesNeeded)} classes to reach {subject.MinAttendancePercentage}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-600">{percentage.toFixed(1)}%</p>
                      <ArrowDownRight className="w-4 h-4 text-red-600 ml-auto" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendance Trend Chart */}
      <Card>
        <CardTitle className="px-6 pt-6">Attendance by Subject</CardTitle>
        <CardContent className="pt-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="percentage" fill="#3b82f6" name="Attendance %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Classes Needed vs Can Skip */}
      <Card>
        <CardTitle className="px-6 pt-6">Classes Analysis</CardTitle>
        <CardContent className="pt-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={classWiseMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="needed" fill="#ef4444" name="Needed to Pass" />
              <Bar dataKey="canSkip" fill="#10b981" name="Can Skip" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
