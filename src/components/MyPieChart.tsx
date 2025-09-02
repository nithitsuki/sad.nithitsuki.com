import React from "react";
import { PieChart, Pie, Cell } from 'recharts';

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
    if (backgroundColor === "") { backgroundColor = "#10B981"; }
    
    // Ensure we have valid data
    const validTotal = Math.max(total, 0);
    const validPresent = Math.max(Math.min(present, validTotal), 0);
    const missed = validTotal - validPresent;
    
    return (
        <PieChart width={120} height={120} className={className}>
            <Pie 
                data={[{
                    name: 'present',
                    value: validPresent || 1 // Ensure at least 1 to avoid division by zero
                }, {
                    name: 'Missed',
                    value: missed || 0
                }]} 
                cx={60}
                cy={60}
                innerRadius={30} 
                outerRadius={50} 
                paddingAngle={0} 
                dataKey="value" 
                startAngle={90} 
                endAngle={-270} 
                labelLine={false}
            >
                <Cell key={`cell-attended`} fill={backgroundColor} />
                <Cell key={`cell-missed`} fill="#00000000" />
            </Pie>
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="1rem" fontWeight="regular" fill="var(--foreground)">
                {`${AttendancePercentageRounded}%`}
            </text>
        </PieChart>
    );
}