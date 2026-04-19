import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface MyPieChartProps {
    className?: string,
    total: number,
    present: number,
    dutyLeave?: number,
    showODPercentage?: boolean,
    backgroundColor?: string,
    AttendancePercentageRounded: number
}
export function MyPieChart({
    total,
    present,
    dutyLeave = 0,
    showODPercentage = false,
    className,
    backgroundColor,
    AttendancePercentageRounded
}: MyPieChartProps) {
    if(backgroundColor === "") { backgroundColor = "#10B981"; }
    const safeTotal = Math.max(0, total)
    const safePresent = Math.min(Math.max(0, present), safeTotal)
    const safeDuty = showODPercentage ? Math.min(Math.max(0, dutyLeave), safePresent) : 0
    const regularPresent = safePresent - safeDuty
    const missed = safeTotal - safePresent
    const pieData = [
        { name: "present", value: regularPresent },
        ...(safeDuty > 0 ? [{ name: "od", value: safeDuty }] : []),
        { name: "missed", value: missed },
    ]

    return <ResponsiveContainer width="100%" height="100%" className={className}>
        <PieChart>
            <Pie data={pieData} innerRadius={30} outerRadius={50} paddingAngle={0} dataKey="value" startAngle={90} endAngle={-270} labelLine={false}
            >
                {pieData.map((item) => (
                    <Cell
                        key={`cell-${item.name}`}
                        fill={item.name === "missed" ? "#00000000" : backgroundColor}
                        fillOpacity={item.name === "od" ? 0.55 : 1}
                    />
                ))}
            </Pie>
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="1rem" fontWeight="regular" fill="var(--foreground)">
                {`${AttendancePercentageRounded}%`}
            </text>
        </PieChart>
    </ResponsiveContainer>;
}
