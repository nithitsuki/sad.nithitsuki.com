import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface MyPieChartProps {
    className?: string,
    total: number,
    present: number,
    backgroundColor?: string,
    AttendancePercentageRounded: number
}
export function MyPieChart({
    total,
    present,
    className,
    backgroundColor,
    AttendancePercentageRounded
}: MyPieChartProps) {
    if(backgroundColor === "") { backgroundColor = "#10B981"; }
    return <ResponsiveContainer width="100%" height="100%" className={className}>
        <PieChart>
            <Pie data={[{
                name: 'present',
                value: present
            }, {
                name: 'Missed',
                value: total - present
            }]} innerRadius={30} outerRadius={50} paddingAngle={0} dataKey="value" startAngle={90} endAngle={-270} labelLine={false} // Hide the default label line
            >
                <Cell key={`cell-attended`} fill={backgroundColor} /> {
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
