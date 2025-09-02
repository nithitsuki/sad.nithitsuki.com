import React from 'react';
import { Card, CardTitle } from './ui/card';
import { MyPieChart } from './MyPieChart';
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import InfoPopup from './popups/InfoPopup';
import EditPopup from './popups/EditPopup';
import { useSubjects, type SubjectData } from "@/contexts/SubjectContext";

interface SubjectCardProps {
    subject: SubjectData;
}

export default function SubjectCard({ subject }: SubjectCardProps) {
    const { isDemoMode, settings, actions } = useSubjects();
    
    let [localTotal, setLocalTotal] = React.useState(subject.total);
    let [localPresent, setLocalPresent] = React.useState(subject.present);
    let [localAbsent, setLocalAbsent] = React.useState(subject.absent);

    // Update local state when subject prop changes
    React.useEffect(() => {
        setLocalTotal(subject.total);
        setLocalPresent(subject.present);
        setLocalAbsent(subject.absent);
    }, [subject.total, subject.present, subject.absent]);

    const Attendance = React.useMemo(() =>
        ((localPresent / localTotal) * 100).toFixed(2),
        [localPresent, localTotal]
    );

    const SkippableClasses = React.useMemo(() =>
        Math.floor((localPresent * (100 - subject.MinAttendancePercentage) / subject.MinAttendancePercentage) - localAbsent),
        [localPresent, subject.MinAttendancePercentage, localAbsent]
    );
    
    const ClassesNeeded = React.useMemo(() =>
        Math.ceil((subject.MinAttendancePercentage * localTotal - 100 * localPresent) / (100 - subject.MinAttendancePercentage)),
        [localPresent, localTotal, subject.MinAttendancePercentage]
    );
    
    const AttendancePercentageRounded = React.useMemo(() =>
        Math.floor(+Attendance),
        [Attendance]
    );

    // Uses OKLCH for perceptually uniform color transitions
    const calculateColor = (percentage: number, minPercentage: number): string => {
        if (percentage >= 90) {
            // Dark green to lighter green
            const lightness = 0.5 + 0.1 * ((percentage - 90) / 10); // 0.5 to 0.7
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
        calculateColor(AttendancePercentageRounded, subject.MinAttendancePercentage),
        [AttendancePercentageRounded, subject.MinAttendancePercentage]
    );

    const updateSubjectAttribute = (attribute: string, newValue: number) => {
        actions.updateSubject(subject.Course, { [attribute]: newValue });
    };

    return (
        <div className='w-auto h-auto sm:w-auto'>
            <Card className=" m-[2px] mb-4 border-[0.1px] sm:border-[0.4px] border-solid sm:m-1 p-0 sm:p-2 backdrop-blur-[1.5px]" style={{ borderColor: `${borderColor}` }}>
                <div className="pb-0 pt-1 pl-2 pr-2 rounded">
                    <div className='flex justify-center'>
                        <CardTitle className='mb-2 max-w-[22vw] text-xs sm:text-base sm:max-w-[200px] text-center'>
                            {settings.abbreviateNames ? subject.CourseAbbreviation : subject.Course}
                            <span className='hidden sm:inline'> - [{localTotal}]</span>
                            <span className='sm:hidden font-light text-xs sm:text-base'>
                                <br className='sm:hidden'></br>[{localPresent} out of {localTotal}]
                            </span>
                        </CardTitle>
                    </div>
                    <div className="sm:hidden w-full rounded bg-(--input)">
                        <div
                            className="text-xs font-medium text-center p-0.5 leading-none rounded text-white"
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
                                        updateSubjectAttribute("present", newPresent);
                                        updateSubjectAttribute("total", newTotal);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
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
                                        updateSubjectAttribute("absent", newAbsent);
                                        updateSubjectAttribute("total", newTotal);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                /></p>
                        </div>
                        <div className="flex items-center gap-4" id='PieChart_n_SkippableClasses'>
                            <div className='hidden sm:flex w-[120px] h-[120px] items-center justify-center'>
                                <MyPieChart
                                    total={localTotal}
                                    present={localPresent}
                                    AttendancePercentageRounded={AttendancePercentageRounded}
                                    backgroundColor={borderColor}
                                />
                            </div>
                            <div className='flex-row w-max'>
                                {AttendancePercentageRounded >= subject.MinAttendancePercentage ? (
                                    <div id='SkippableClasses' className='max-w-[22vw] sm:w-auto'>
                                        <p className="text-sm text-foreground text-center">Skippable</p>
                                        <svg viewBox="0 0 100 100" className='w-24 h-22'>
                                            <text x={SkippableClasses > 9 ? "40%" : "50%"} y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="100" fontWeight="regular" fill={"var(--foreground)"} letterSpacing={SkippableClasses > 9 ? "-13" : "0"}>
                                                {`${SkippableClasses}`}
                                            </text>
                                        </svg>
                                    </div>) : (
                                    <div id='Need2pass' className='max-w-[22vw] sm:w-auto'>
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
                    </div>
                    <div className="flex justify-center items-center gap-2">
                        <InfoPopup 
                            Course={subject.Course} 
                            MinAttendancePercentage={subject.MinAttendancePercentage} 
                            localTotal={localTotal} 
                            localPresent={localPresent} 
                            localAbsent={localAbsent} 
                            SkippableClasses={SkippableClasses} 
                            AttendancePercentageRounded={AttendancePercentageRounded} 
                            borderColor={borderColor} 
                            Notes={subject.Notes || ""} 
                            daysOfWeek={subject.daysOfWeek || []}
                        />
                        <p>|</p>
                        <EditPopup 
                            Sl_No={subject.Sl_No} 
                            CourseAbbreviation={subject.CourseAbbreviation} 
                            Course={subject.Course} 
                            MinAttendancePercentage={subject.MinAttendancePercentage} 
                            localTotal={localTotal} 
                            localPresent={localPresent} 
                            localAbsent={localAbsent} 
                            SkippableClasses={SkippableClasses} 
                            AttendancePercentageRounded={AttendancePercentageRounded} 
                            borderColor={borderColor}
                        />
                    </div>
                </div>
            </Card>
        </div>
    )
}