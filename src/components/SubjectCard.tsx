import React from 'react';
import { Card, CardTitle } from './ui/card';
import { MyPieChart } from './MyPieChart';
import { set } from 'react-hook-form';

interface SubjectCardProps {
    Sl_No: string;            // Serial number
    Course: string;           // Course name
    total: number;           // localTotal classes occurred
    present: number;         // Classes attended
    absent: number;          // Classes skipped
    // percentage: number;      // Attendance percentage
    isDemoMode: boolean; // Flag to indicate if the card is in demo mode
    MinAttendancePercentage: number;
    No_ClassesPerWeek: number; // Number of classes per week
    UpdateStorageFunction: (Course: string, attribute: string, newValue: number) => void;
}

const deleteSubject = (Course: string) => {
    try {
        const storedSubjects = localStorage.getItem('subjectsData');
        if (storedSubjects) {
            let subjects: SubjectCardProps[] = JSON.parse(storedSubjects);
            // Find the index of the subject to remove
            const indexToRemove = subjects.findIndex(subject => subject.Course === Course);

            // If the subject is found (index is not -1), remove it
            if (indexToRemove > -1) {
                subjects.splice(indexToRemove, 1); // Removes 1 element at indexToRemove
                // Save the updated array back to localStorage
                localStorage.setItem('subjectsData', JSON.stringify(subjects));
            }
        }
        // NOTE: This only removes the item from localStorage.
        // You'll likely need additional logic (e.g., updating state in a parent component)
        // to remove the card from the UI.
        console.log(`Subject "${Course}" removed from localStorage.`);
        // Force a re-render if necessary, e.g., by updating parent state
        window.dispatchEvent(new Event('storage')); // Basic way to notify other parts of the app
    } catch (error) {
        console.error(`Error removing subject "${Course}" from localStorage:`, error);
    }
};

export default function SubjectCard({ Course, No_ClassesPerWeek, isDemoMode, total, absent, present, MinAttendancePercentage, UpdateStorageFunction }: SubjectCardProps) {
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

    const AttendancePercentageRounded = React.useMemo(() =>
        Math.floor(+Attendance),
        [Attendance]
    );

    const calculateColor = (percentage: number, minPercentage: number): string => {
        if (percentage >= 90) {
            // Transition from deep green to less saturated green (100% -> 90%)
            const ratio = (percentage - 90) / 10;
            const red = Math.round(50 * (1 - ratio));
            const green = Math.round(160 + (70 * ratio));
            const blue = Math.round(50 * (1 - ratio));
            return `rgb(${red}, ${green}, ${blue})`;
        } else if (percentage >= 80) {
            // Smoother transition from less saturated green to unsaturated orange (90% -> 80%)
            const ratio = (percentage - 80) / 10;
            // Starting with a less saturated green at 90% (around rgb(50, 160, 50))
            // Moving to an unsaturated orange at 80% (rgb(255, 119, 0))
            const red = Math.round(50 + (205 * (1 - ratio)));
            const green = Math.round(160 - (41 * (1 - ratio)));
            const blue = Math.round(50 - (50 * (1 - ratio)));
            return `rgb(${red}, ${green}, ${blue})`;
        } else if (percentage >= minPercentage) {
            1
            // Transition from unsaturated orange to red (80% -> minPercentage)
            const ratio = (percentage - minPercentage) / (80 - minPercentage);
            const red = 255;
            const green = Math.round(119 * ratio);
            const blue = 0;
            return `rgb(${red}, ${green}, ${blue})`;
        } else {
            // Below minimum attendance - solid red
            return '#FF0000';
        }
    };

    const borderColor = React.useMemo(() =>
        calculateColor(AttendancePercentageRounded, MinAttendancePercentage),
        [AttendancePercentageRounded, MinAttendancePercentage]
    );

console.log({
  label: 'Attendance Check',
  current: `${AttendancePercentageRounded}%`,
  required: `${MinAttendancePercentage}%`,
  isBelowThreshold: AttendancePercentageRounded < MinAttendancePercentage,
  difference: `${(AttendancePercentageRounded - MinAttendancePercentage).toFixed(2)}%`,
  types: {
    current: typeof AttendancePercentageRounded,
    required: typeof MinAttendancePercentage
  }
});
    return (
        <div className='w-auto h-auto sm:w-auto'>
            <Card className=" m-[2px] border-[2px] sm:border-[4px] border-solid sm:m-1 p-0 sm:p-2" style={{ borderColor: `${borderColor}` }}>
                {/* <div className="border border-solid pb-0 pt-1 pl-2 pr-2 rounded"> */}
                <div className="pb-0 pt-1 pl-2 pr-2 rounded">
                    <div className='flex justify-between'>
                        <CardTitle className='mb-2 max-w-[22vw] text-xs sm:text-base sm:max-w-[200px]'>{Course}<span className='hidden sm:inline'> - [{localTotal}]</span>
                            <span className='sm:hidden font-light text-xs sm:text-base'><br className='sm:hidden'></br>[{localPresent} out of {localTotal}]</span></CardTitle>
                        <a onClick={() => alert("Editing Functionality not yet supported")} className="cursor-pointer hidden sm:inline">✎</a>
                    </div>
                    <hr></hr>
                    <div className="sm:hidden w-full bg-gray-200 rounded dark:bg-gray-700">
                        <div
                            className="text-xs font-medium text-white text-center p-0.5 leading-none rounded"
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
                                        <p className="text-sm text-muted-foreground">Skippable Classes:</p>
                                        <svg viewBox="0 0 90 90"> {/* Example dimensions */}
                                            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="90" fontWeight="regular" fill={"#CCCCCC"}>
                                                {`${SkippableClasses}`}
                                            </text>
                                        </svg>
                                    </div>) : (
                                    <div id='Need2pass' className='max-w-[22vw] sm:w-auto'> {/* Text container */}
                                        <p className="text-bold text-regular text-red-500">Needed to Pass:</p>
                                        <svg viewBox="0 0 90 90"> {/* Example dimensions */}
                                            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="90" fontWeight="regular" fill="url(#redToOrangeGradient)">
                                                {`${Math.ceil((MinAttendancePercentage * localTotal - 100 * localPresent) / (100 - MinAttendancePercentage))}!!`}
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
                    <p className="text-red-500 text-center cursor-pointer hidden sm:block" onClick={() => deleteSubject(Course)}>Delete Subject</p>
                    <p className="text-blue-500 text-center cursor-pointer sm:hidden" onClick={() => alert("Editing Functionality not yet supported")}>Edit</p>

                </div>
            </Card>
        </div>
    )
}