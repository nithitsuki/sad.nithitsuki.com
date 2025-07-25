import React from 'react';
import { Card, CardTitle } from './ui/card';
import { MyPieChart } from './MyPieChart';

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import InfoPopup from './popups/InfoPopup';
import EditPopup from './popups/EditPopup';

interface SubjectCardProps {
    Sl_No: string;            // Serial number
    Course: string;           // Course name
    CourseAbbreviated: string;           // Course name+
    isAbbreviated: boolean; // Flag to indicate if the course name is abbreviated
    total: number;           // localTotal classes occurred
    present: number;         // Classes attended
    absent: number;          // Classes skipped
    // percentage: number;      // Attendance percentage
    isDemoMode: boolean; // Flag to indicate if the card is in demo mode
    MinAttendancePercentage: number;
    daysOfWeek: string[]; // Array of days of the week the course is held
    Notes: string;
    UpdateStorageFunction: (Course: string, attribute: string, newValue: number) => void;
}



export default function SubjectCard({ Sl_No, Course, CourseAbbreviated, isAbbreviated, daysOfWeek, isDemoMode, total, absent, present, MinAttendancePercentage, UpdateStorageFunction, Notes }: SubjectCardProps) {
    let [localTotal, setLocalTotal] = React.useState(total);
    let [localPresent, setLocalPresent] = React.useState(present);
    let [localAbsent, setLocalAbsent] = React.useState(absent);

    const Attendance = React.useMemo(() =>
        ((localPresent / localTotal) * 100).toFixed(2),
        [localPresent, localTotal]
    );

    const SkippableClasses = React.useMemo(() =>
        Math.floor((localPresent * (100 - MinAttendancePercentage) / MinAttendancePercentage) - localAbsent),
        [localPresent, MinAttendancePercentage, localAbsent]
    );
    const ClassesNeeded = React.useMemo(() =>
        Math.ceil((MinAttendancePercentage * localTotal - 100 * localPresent) / (100 - MinAttendancePercentage)),
        [localPresent, localTotal, MinAttendancePercentage]
    );
    const AttendancePercentageRounded = React.useMemo(() =>
        Math.floor(+Attendance),
        [Attendance]
    );

    // Uses OKLCH for perceptually uniform color transitions
    const calculateColor = (percentage: number, minPercentage: number): string => {
        if (percentage >= 90) {
            // Dark green to lighter green
            const lightness = 0.5 + 0.2 * ((percentage - 90) / 10); // 0.5 to 0.7
            return `oklch(${lightness} 0.18 140)`;
        } else if (percentage >= 80) {
            // Green to orange
            const ratio = (percentage - 80) / 10;
            const lightness = 0.6 - 0.1 * (1 - ratio); // 0.5 to 0.6
            const chroma = 0.18 + 0.07 * (1 - ratio); // 0.18 to 0.25
            const hue = 140 - 85 * (1 - ratio); // 140 (green) to 55 (orange)
            return `oklch(${lightness} ${chroma} ${hue})`;
        } else if (percentage >= minPercentage) {
            // Orange to red transition starting from minimum percentage
            const ratio = (percentage - minPercentage) / (80 - minPercentage);
            const lightness = 0.55 - 0.05 * (1 - ratio); // 0.5 to 0.55
            const chroma = 0.25 + 0.05 * (1 - ratio); // 0.25 to 0.3
            const hue = 55 - 35 * ratio; // 55 (orange) to 20 (red) - fixed ratio direction
            return `oklch(${lightness} ${chroma} ${hue})`;
        } else {
            // Deep red - gets darker the lower the percentage
            const belowMin = Math.max(0, minPercentage - percentage);
            const darkeningFactor = Math.min(belowMin / 20, 1); // Darken based on how far below minimum
            const lightness = 0.5 - 0.2 * darkeningFactor; // 0.5 to 0.3
            const chroma = 0.3 + 0.1 * darkeningFactor; // 0.3 to 0.4 for more saturation
            return `oklch(${lightness} ${chroma} 20)`;
        }
    };

    const borderColor = React.useMemo(() =>
        calculateColor(AttendancePercentageRounded, MinAttendancePercentage),
        [AttendancePercentageRounded, MinAttendancePercentage]
    );

    // console.log({
    //   label: 'Attendance Check',
    //   current: `${AttendancePercentageRounded}%`,
    //   required: `${MinAttendancePercentage}%`,
    //   isBelowThreshold: AttendancePercentageRounded < MinAttendancePercentage,
    //   difference: `${(AttendancePercentageRounded - MinAttendancePercentage).toFixed(2)}%`,
    //   types: {
    //     current: typeof AttendancePercentageRounded,
    //     required: typeof MinAttendancePercentage
    //   }
    // });
    return (
        <div className='w-auto h-auto sm:w-auto'>
            <Card className=" m-[2px] mb-4 border-[0.1px] sm:border-[4px] border-solid sm:m-1 p-0 sm:p-2 backdrop-blur-[1.5px]" style={{ borderColor: `${borderColor}` }}>
                {/* <div className="border border-solid pb-0 pt-1 pl-2 pr-2 rounded"> */}
                <div className="pb-0 pt-1 pl-2 pr-2 rounded">
                    <div className='flex justify-center'>
                        <CardTitle className='mb-2 max-w-[22vw] text-xs sm:text-base sm:max-w-[200px] text-center'>{isAbbreviated ? CourseAbbreviated : Course}<span className='hidden sm:inline'> - [{localTotal}]</span>
                            <span className='sm:hidden font-light text-xs sm:text-base'><br className='sm:hidden'></br>[{localPresent} out of {localTotal}]</span></CardTitle>
                    </div>
                    {/* <hr></hr> */}
                    <div className="sm:hidden w-full rounded bg-(--input)">
                        <div
                            className="text-xs font-medium text-center p-0.5 leading-none rounded"
                            style={{ width: `${AttendancePercentageRounded}%`, backgroundColor: `${borderColor}` }}
                        >
                            {AttendancePercentageRounded}%
                        </div>
                    </div>
                    <div className="flex flex-row justify-between sm:flex-col gap-2">
                        <div className="hidden sm:inline" id='textinfo'>

                            <p>Classes Attended:  <br className='sm:hidden' />
                                <input
                                    type="number"
                                    value={localPresent}
                                    disabled={isDemoMode}
                                    className="w-16 inline-block bg-background border rounded px-2 py-1"
                                    onChange={(e) => {
                                        const newPresent = parseInt(e.target.value) || 0;
                                        const newTotal = localAbsent + newPresent;
                                        setLocalPresent(newPresent);
                                        setLocalTotal(newTotal);
                                        UpdateStorageFunction(Course, "present", newPresent);
                                        UpdateStorageFunction(Course, "total", newTotal);
                                    }}
                                    onClick={(e) => e.stopPropagation()} // Prevent card expansion when clicking input
                                /></p>
                            <br className='sm:hidden' />
                            <p>You have skipped:<br className='sm:hidden' />
                                <input
                                    type="number"
                                    value={localAbsent}
                                    disabled={isDemoMode}
                                    className="w-16 inline-block bg-background border rounded px-2 py-1"
                                    onChange={(e) => {
                                        const newAbsent = parseInt(e.target.value) || 0;
                                        const newTotal = newAbsent + localPresent;
                                        setLocalAbsent(newAbsent);
                                        setLocalTotal(newTotal);
                                        UpdateStorageFunction(Course, "absent", newAbsent);
                                        UpdateStorageFunction(Course, "total", newTotal);
                                    }}
                                    onClick={(e) => e.stopPropagation()} // Prevent card expansion when clicking input
                                /></p>
                        </div>
                        <div className="flex items-center gap-4" id='PieChart_n_SkippableClasses'> {/* Flex container */}
                            <div className='hidden sm:block w-30 h-30 sm:w-[120] sm:h-[120] m-0 p-0'> {/* Chart container */}
                                <MyPieChart
                                    className="hidden sm:block"
                                    total={localTotal}
                                    present={localPresent}
                                    AttendancePercentageRounded={AttendancePercentageRounded}
                                    backgroundColor={borderColor}
                                />
                            </div>
                            <div className='flex-row w-max'>

                                {AttendancePercentageRounded >= MinAttendancePercentage ? (
                                    <div id='SkippableClasses' className='max-w-[22vw] sm:w-auto'> {/* Text container */}
                                        <p className="text-sm text-foreground text-center">Skippable</p>
                                        <svg viewBox="0 0 100 100" className='w-24 h-22'>
                                            <text x={SkippableClasses > 9 ? "40%" : "50%"} y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="100" fontWeight="regular" fill={"var(--foreground)"} letterSpacing={SkippableClasses > 9 ? "-13" : "0"}>
                                                {`${SkippableClasses}`}
                                            </text>
                                        </svg>
                                    </div>) : (
                                    <div id='Need2pass' className='max-w-[22vw] sm:w-auto'> {/* Text container */}
                                        <p className="text-bold text-regular text-red-400 text-center">Needed</p>
                                        <svg viewBox="0 0 100 100" className='w-22 h-22'>
                                            <text x={ClassesNeeded > 9 ? "60%" : "50%"} y="50%" textAnchor="middle" dominantBaseline="middle" fontSize={ClassesNeeded > 9 ? "80" : "100"} fontWeight="regular" fill="url(#redToOrangeGradient)">
                                                {`${ClassesNeeded}!!`}
                                            </text>
                                            <defs>
                                                <linearGradient id="redToOrangeGradient" x1="20%" y1="20%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#FF0000" />
                                                    <stop offset="100%" stopColor="#FF7700" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>

                        <hr></hr>
                        {/* </div> */}
                    </div>
                    <div className="flex justify-center items-center gap-2">
                        <InfoPopup Course={Course} MinAttendancePercentage={MinAttendancePercentage} localTotal={localTotal} localPresent={localPresent} localAbsent={localAbsent} SkippableClasses={SkippableClasses} AttendancePercentageRounded={AttendancePercentageRounded} borderColor={borderColor} Notes={Notes} daysOfWeek={daysOfWeek}></InfoPopup>
                        <p>|</p>
                        <EditPopup Sl_No={Sl_No} CourseAbbreviation={CourseAbbreviated} Course={Course} MinAttendancePercentage={MinAttendancePercentage} localTotal={localTotal} localPresent={localPresent} localAbsent={localAbsent} SkippableClasses={SkippableClasses} AttendancePercentageRounded={AttendancePercentageRounded} borderColor={borderColor}></EditPopup>
                    </div>
                </div>
            </Card>
        </div>
    )
}