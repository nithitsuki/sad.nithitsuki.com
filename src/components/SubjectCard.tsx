import React from 'react';
import { Card, CardTitle } from './ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { number } from 'zod';

interface SubjectCardProps {
    subjectName: string;
    No_ClassesPerWeek: number;
    ClassesOccurred: number;
    ClassesAttended: number;
    MinAttendancePercentage: number;
}
export default function SubjectCard({ subjectName, No_ClassesPerWeek, ClassesOccurred, ClassesAttended, MinAttendancePercentage }: SubjectCardProps) {
    const Attendance = ((ClassesAttended / ClassesOccurred) * 100).toFixed(2);
    const ClassesSkipped = ClassesOccurred - ClassesAttended;
    const SkippableClasses = (ClassesAttended * (100 - MinAttendancePercentage) / MinAttendancePercentage) - ClassesSkipped;
    const attendanceNum = Math.floor(+Attendance); // Convert Attendance string to number and floor it
    const borderColor =
        attendanceNum >= MinAttendancePercentage + 10 ? '#22C55ECC' : // Green with 80% opacity
        attendanceNum >= MinAttendancePercentage ? '#F97316CC' : // Orange with 80% opacity
        attendanceNum >= MinAttendancePercentage - 10 ? '#EF4444CC' : '#B91C1CCC'; // Dark Red with 80% opacity

    return(
        <div>
                <Card className="m-2 p-4" style={{ border: `5px solid ${borderColor}` }}>
                    <CardTitle>{subjectName}</CardTitle>
                    <div className="flex flex-col gap-2">
                        <p>Classes Occurred: {ClassesOccurred}</p>
                        <p>Classes Attended: {ClassesAttended}</p>
                        <p>How many You have skipped: {ClassesSkipped}</p>
                        <p>How many more you can skip: {Math.floor(SkippableClasses)}</p>
                        <div style={{ width: 120, height: 120 }}>
                            <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                data={[
                                    { name: 'ClassesAttended', value: ClassesAttended },
                                    { name: 'Missed', value: ClassesOccurred - ClassesAttended },
                                ]}
                                innerRadius={30}
                                outerRadius={50}
                                paddingAngle={0}
                                dataKey="value"
                                startAngle={90}
                                endAngle={-270}
                                labelLine={false} // Hide the default label line
                                >
                                    <Cell key={`cell-attended`} fill="#10B981" /> {/* Green for attended */}
                                    <Cell key={`cell-missed`} fill="#EF4444" /> {/* Red for missed */}
                                </Pie>
                                {/* Add text in the center */}
                                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="1rem" fontWeight="regular" fill="var(--foreground)">
                                    {`${Attendance}%`}
                                </text>
                            </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Card>
        </div>
 )
}