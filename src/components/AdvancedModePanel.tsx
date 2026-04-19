'use client';

import React, { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSubjects, type SubjectData } from '@/contexts/SubjectContext';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function AdvancedModePanel() {
  const { subjects, settings } = useSubjects();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'weekly' | 'stats'>('calendar');

  const weekDays = useMemo(() => {
    if (!selectedDate) return [];
    const start = startOfWeek(selectedDate, { weekStartsOn: 0 });
    const end = endOfWeek(selectedDate, { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [selectedDate]);

  const attendanceStats = useMemo(() => {
    if (subjects.length === 0) return [];
    
    return subjects.map(subject => {
      const totalClasses = subject.total || 0;
      const presentClasses = subject.present || 0;
      const percentage = totalClasses > 0 ? ((presentClasses / totalClasses) * 100).toFixed(1) : 0;
      
      return {
        name: settings.abbreviateNames ? subject.CourseAbbreviation : subject.Course,
        percentage: parseFloat(percentage as string),
        present: presentClasses,
        total: totalClasses,
      };
    });
  }, [subjects, settings.abbreviateNames]);

  const attendanceDistribution = useMemo(() => {
    if (subjects.length === 0) return [];
    
    const criticalCount = subjects.filter(s => {
      const pct = s.total > 0 ? (s.present / s.total) * 100 : 0;
      return pct < 75;
    }).length;
    
    const warningCount = subjects.filter(s => {
      const pct = s.total > 0 ? (s.present / s.total) * 100 : 0;
      return pct >= 75 && pct < 85;
    }).length;
    
    const goodCount = subjects.length - criticalCount - warningCount;
    
    return [
      { name: 'Good (≥85%)', value: goodCount, color: '#10b981' },
      { name: 'Warning (75-85%)', value: warningCount, color: '#f59e0b' },
      { name: 'Critical (<75%)', value: criticalCount, color: '#ef4444' },
    ];
  }, [subjects]);

  const overallStats = useMemo(() => {
    if (subjects.length === 0) return null;
    
    const totalClasses = subjects.reduce((sum, s) => sum + (s.total || 0), 0);
    const totalPresent = subjects.reduce((sum, s) => sum + (s.present || 0), 0);
    const totalOD = subjects.reduce((sum, s) => sum + (s.dutyLeave || 0), 0);
    const overallPercentage = totalClasses > 0 ? ((totalPresent / totalClasses) * 100).toFixed(2) : 0;
    
    return { totalClasses, totalPresent, totalOD, overallPercentage };
  }, [subjects]);

  return (
    <div className="w-full space-y-4 p-4">
      <div className="flex gap-2 justify-center flex-wrap">
        <Button 
          variant={viewMode === 'calendar' ? 'default' : 'outline'}
          onClick={() => setViewMode('calendar')}
        >
          Calendar
        </Button>
        <Button 
          variant={viewMode === 'weekly' ? 'default' : 'outline'}
          onClick={() => setViewMode('weekly')}
        >
          Weekly View
        </Button>
        <Button 
          variant={viewMode === 'stats' ? 'default' : 'outline'}
          onClick={() => setViewMode('stats')}
        >
          Statistics
        </Button>
      </div>

      {viewMode === 'calendar' && (
        <div className="flex flex-col items-center gap-4">
          <Card className="w-full max-w-sm">
            <CardContent className="pt-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-lg"
              />
            </CardContent>
          </Card>
          {selectedDate && (
            <Card className="w-full">
              <CardTitle className="text-center py-4">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </CardTitle>
            </Card>
          )}
        </div>
      )}

      {viewMode === 'weekly' && (
        <Card className="w-full">
          <CardTitle className="px-6 pt-6">Week Overview</CardTitle>
          <CardContent className="pt-4">
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map(day => (
                <div 
                  key={day.toISOString()} 
                  className={`p-3 rounded text-center border ${
                    selectedDate && format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                      ? 'bg-blue-500 text-white'
                      : 'border-gray-300'
                  }`}
                >
                  <div className="text-xs font-semibold">{format(day, 'EEE')}</div>
                  <div className="text-sm">{format(day, 'd')}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === 'stats' && overallStats && (
        <div className="space-y-4 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Overall Attendance</p>
                  <p className="text-2xl font-bold text-blue-600">{overallStats.overallPercentage}%</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Total Classes</p>
                  <p className="text-2xl font-bold">{overallStats.totalClasses}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Classes Attended</p>
                  <p className="text-2xl font-bold text-green-600">{overallStats.totalPresent}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500">OD/Duty Leaves</p>
                  <p className="text-2xl font-bold text-orange-600">{overallStats.totalOD}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardTitle className="px-6 pt-6">Subject Attendance</CardTitle>
              <CardContent className="pt-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={attendanceStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="percentage" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardTitle className="px-6 pt-6">Attendance Distribution</CardTitle>
              <CardContent className="pt-4 flex justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={attendanceDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {attendanceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
