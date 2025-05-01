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

const deleteSubject = (subjectName: string) => {
    try {
        const storedSubjects = localStorage.getItem('subjectsData');
        if (storedSubjects) {
            let subjects: SubjectCardProps[] = JSON.parse(storedSubjects);
            // Find the index of the subject to remove
            const indexToRemove = subjects.findIndex(subject => subject.subjectName === subjectName);

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
        console.log(`Subject "${subjectName}" removed from localStorage.`);
        // Force a re-render if necessary, e.g., by updating parent state
        window.dispatchEvent(new Event('storage')); // Basic way to notify other parts of the app
    } catch (error) {
        console.error(`Error removing subject "${subjectName}" from localStorage:`, error);
    }
};

export default function SubjectCard({ subjectName, No_ClassesPerWeek, ClassesOccurred, ClassesAttended, MinAttendancePercentage }: SubjectCardProps) {
    const Attendance = ((ClassesAttended / ClassesOccurred) * 100).toFixed(2);
    const ClassesSkipped = ClassesOccurred - ClassesAttended;
    const SkippableClasses = Math.floor((ClassesAttended * (100 - MinAttendancePercentage) / MinAttendancePercentage) - ClassesSkipped);
    const AttendancePercentageRounded = Math.floor(+Attendance); // Convert Attendance string to number and floor it
    const borderColor =
        AttendancePercentageRounded >= MinAttendancePercentage + 10 ? '#22C55ECC' : // Green with 80% opacity
        AttendancePercentageRounded >= MinAttendancePercentage ? '#F97316CC' : // Orange with 80% opacity
        AttendancePercentageRounded >= MinAttendancePercentage - 10 ? '#EF4444CC' : '#B91C1CCC'; // Dark Red with 80% opacity

    return(
        <div>
                <Card className="m-2 p-4" style={{ border: `5px solid ${borderColor}` }}>
                    {/* <div className="border border-solid pb-0 pt-1 pl-2 pr-2 rounded"> */}
                    <div className="pb-0 pt-1 pl-2 pr-2 rounded">
                    <CardTitle className='mb-2'>{subjectName}</CardTitle>
                    <hr></hr>
                    <div className="flex flex-col gap-2">
                        <p>Classes Occurred: {ClassesOccurred}</p>
                        <p>Classes Attended: {ClassesAttended}</p>
                        <p>How many You have skipped: {ClassesSkipped}</p>
                        <p>How many more you can skip: {Math.floor(SkippableClasses)}</p>
                        <div>
                            <div className="flex items-center gap-4"> {/* Flex container */}
                                <div style={{ width: 120, height: 120 }}> {/* Chart container */}
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
                                                {`${AttendancePercentageRounded}%`}
                                            </text>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div> {/* Text container */}
                                    <p className="text-sm text-muted-foreground">Skippable Classes:</p>
                                    
                                    <svg  viewBox="0 0 90 90"> {/* Example dimensions */}
                                        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="5rem" fontWeight="regular" fill="var(--foreground)">
                                                    {`${SkippableClasses}`}
                                        </text>
                                    </svg>
                                </div>
                            </div>
                            <hr></hr>
                            <p className="text-red-500 text-center cursor-pointer" onClick={() => deleteSubject(subjectName)}>Delete Subject</p>
                            </div>
                        </div>
                    </div>
                </Card>
        </div>
 )
}