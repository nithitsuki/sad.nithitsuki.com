import React from 'react';
import { Card, CardTitle } from './ui/card';
import { MyPieChart } from './MyPieChart';

interface SubjectCardProps {
    Course: string;            // Course code and name
    Sl_No?: string;            // Serial number
    present: number;           // Classes attended
    absent: number;            // Classes skipped
    dutyLeave: number;         // Duty leave count
    medical: number;           // Medical leave count
    total: number;             // Total classes occurred
    percentage: string;        // Attendance percentage
    faculty?: string;          // Faculty name
    No_ClassesPerWeek: number; // Number of classes per week
    MinAttendancePercentage: number;
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

export default function SubjectCard({ Course, No_ClassesPerWeek, absent, total, MinAttendancePercentage, UpdateStorageFunction }: SubjectCardProps) {
    const ClassesAttended = React.useMemo(() => total - absent, [total, absent]);
    const ClassesOccured = total;

    const Attendance = React.useMemo(() =>
        ((ClassesAttended / ClassesOccured) * 100).toFixed(2),
        [ClassesAttended, ClassesOccured]
    );

    const SkippableClasses = React.useMemo(() =>
        Math.floor((ClassesAttended * (100 - MinAttendancePercentage) / MinAttendancePercentage) - absent),
        [ClassesAttended, MinAttendancePercentage, absent]
    );

    const AttendancePercentageRounded = React.useMemo(() =>
        Math.floor(+Attendance),
        [Attendance]
    );

    const borderColor = React.useMemo(() =>
        AttendancePercentageRounded >= MinAttendancePercentage + 10 ? '#22C55ECC' : // Green with 80% opacity
            AttendancePercentageRounded >= MinAttendancePercentage ? '#F97316CC' : // Orange with 80% opacity
                AttendancePercentageRounded >= MinAttendancePercentage - 10 ? '#EF4444CC' : '#B91C1CCC', // Dark Red with 80% opacity
        [AttendancePercentageRounded, MinAttendancePercentage]
    );

    return (
        <div className='w-auto h-auto sm:w-auto'>
            <Card className=" m-[2px] border-[2px] sm:border-[4px] border-solid sm:m-2 p-0 sm:p-4" style={{ borderColor: `${borderColor}` }}>
                {/* <div className="border border-solid pb-0 pt-1 pl-2 pr-2 rounded"> */}
                <div className="pb-0 pt-1 pl-2 pr-2 rounded">
                    <div className='flex justify-between'>
                        <CardTitle className='mb-2 sm:max-w-[200px]'>{Course}<span className='hidden sm:inline'> - [{ClassesOccured}]</span>
                        <span className='sm:hidden font-light'><br className='sm:hidden'></br>[{ClassesAttended} out of {ClassesOccured}]</span></CardTitle>
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
                                    value={ClassesAttended}
                                    className="w-16 inline-block bg-background border rounded px-2 py-1"
                                    onChange={(e) => {
                                        const newValue = parseInt(e.target.value) || 0;

                                        UpdateStorageFunction(Course, "ClassesOccured", ClassesOccured + 1);
                                        UpdateStorageFunction(Course, "ClassesAttended", newValue);
                                        console.log("Updated attendance:", newValue);
                                    }}
                                    onClick={(e) => e.stopPropagation()} // Prevent card expansion when clicking input
                                /></p>
                            <br className='sm:hidden' />
                            <p>You have skipped:<br className='sm:hidden' />
                                <input
                                    type="number"
                                    value={absent}
                                    className="w-16 inline-block bg-background border rounded px-2 py-1"
                                    onChange={(e) => {
                                        const newValue = parseInt(e.target.value) || 0;

                                        UpdateStorageFunction(Course, "ClassesOccured", ClassesOccured + 1);
                                        UpdateStorageFunction(Course, "absent", newValue);
                                        console.log("Updated skipped classes:", newValue);
                                    }}
                                    onClick={(e) => e.stopPropagation()} // Prevent card expansion when clicking input
                                /></p>
                        </div>
                        <div className="flex items-center gap-4" id='PieChart_n_SkippableClasses'> {/* Flex container */}
                            <div className='hidden sm:block w-30 h-30 sm:w-[120] sm:h-[120] m-0 p-0'> {/* Chart container */}
                                <MyPieChart
                                    className="hidden sm:block"
                                    ClassesOccured={ClassesOccured}
                                    ClassesAttended={ClassesAttended}
                                    AttendancePercentageRounded={AttendancePercentageRounded}
                                />
                            </div>
                            <div className='flex-row w-max'>


                                <div id='SkippableClasses' className='max-w-[22vw] sm:w-auto'> {/* Text container */}
                                    <p className="text-sm text-muted-foreground">Skippable Classes:</p>
                                    <svg viewBox="0 0 90 90"> {/* Example dimensions */}
                                        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="90" fontWeight="regular" fill="var(--foreground)">
                                            {`${SkippableClasses}`}
                                        </text>
                                    </svg>
                                </div>
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