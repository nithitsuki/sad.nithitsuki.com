import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface MyPieChartProps {
    className?: string,
    ClassesOccured: number,
    ClassesAttended: number,
    AttendancePercentageRounded: number
}
export function MyPieChart({
    ClassesOccured,
    ClassesAttended,
    className,
    AttendancePercentageRounded
}: MyPieChartProps) {
    return <ResponsiveContainer width="100%" height="100%" className={className}>
        <PieChart>
            <Pie data={[{
                name: 'ClassesAttended',
                value: ClassesAttended
            }, {
                name: 'Missed',
                value: ClassesOccured - ClassesAttended
            }]} innerRadius={30} outerRadius={50} paddingAngle={0} dataKey="value" startAngle={90} endAngle={-270} labelLine={false} // Hide the default label line
            >
                <Cell key={`cell-attended`} fill="#10B981" /> {
                    /* Green for attended */
                }
                <Cell key={`cell-missed`} fill="#EF4444" /> {
                    /* Red for missed */
                }
            </Pie>
            {
                /* Add text in the center */
            }
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="1rem" fontWeight="regular" fill="var(--foreground)">
                {`${AttendancePercentageRounded}%`}
            </text>
        </PieChart>
    </ResponsiveContainer>;
}
