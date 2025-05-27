"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SubjectCard from "@/components/SubjectCard"; // Assuming SubjectCard is in this path
import React, { useState, useMemo } from "react";

interface SubjectData {
    Course: string;
    Sl_No: string;
    CourseAbbreviation: string;
    total: number;
    present: number;
    absent: number;
    MinAttendancePercentage: number;
}

interface SubjectDisplayAreaProps {
    subjectsData: SubjectData[];
    isDemoMode: boolean; // Added to match the original code
    setIsDemoMode: (value: boolean) => void; // Added to match the original code
    updateSubjectAttribute: (Course: string, attribute: string, newValue: number) => void;
}


export default function SubjectDisplayArea({ subjectsData, updateSubjectAttribute, setIsDemoMode, isDemoMode }: SubjectDisplayAreaProps) {
    const [abbreviateNames, setAbbreviateNames] = useState(true);
    const [sortType, setSortType] = useState<string>("none"); // State for current sort type

    const sortedSubjectsData = useMemo(() => {
        const getAttendancePercentage = (subject: SubjectData): number => {
            if (subject.total === 0) return -1; // Treat 0 total as lowest attendance to sort consistently
            return (subject.present / subject.total) * 100;
        };

        const getSkippableClasses = (subject: SubjectData): number => {
            if (subject.total === 0) return -Infinity; // Subjects with no classes are least "skippable"
            // Minimum classes to be present
            const minPresentClasses = Math.ceil(subject.total * (subject.MinAttendancePercentage / 100));
            // How many classes one can skip. Negative means deficit.
            return subject.present - minPresentClasses;
        };

        let sortedArray = [...subjectsData]; // Create a mutable copy to sort

        switch (sortType) {
            case "name":
                sortedArray.sort((a, b) => a.Course.localeCompare(b.Course));
                break;
            case "attendance-asc":
                sortedArray.sort((a, b) => getAttendancePercentage(a) - getAttendancePercentage(b));
                break;
            case "attendance-desc":
                sortedArray.sort((a, b) => getAttendancePercentage(b) - getAttendancePercentage(a));
                break;
            case "skippable-desc":
                sortedArray.sort((a, b) => getSkippableClasses(b) - getSkippableClasses(a));
                break;
            case "skippable-asc":
                sortedArray.sort((a, b) => getSkippableClasses(a) - getSkippableClasses(b));
                break;
            case "none": // Default sort by Sl_No
            default:
                sortedArray.sort((a, b) => {
                    const numA = parseInt(a.Sl_No, 10);
                    const numB = parseInt(b.Sl_No, 10);
                    // If both are valid numbers, sort numerically
                    if (!isNaN(numA) && !isNaN(numB)) {
                        return numA - numB;
                    }
                    // Otherwise, fall back to string comparison
                    return a.Sl_No.localeCompare(b.Sl_No);
                });
                break;
        }
        return sortedArray;
    }, [subjectsData, sortType]);

    return (
        <div className="flex justify-center w-full">
            <div id="translucent" className="h-full w-auto sm:max-w-[95vw] flex flex-col justify-center items-center bg-zinc-950/5 rounded-md border backdrop-blur-[0.5px] mt-2">
<div id="main-row" className="flex flex-row w-full justify-between items-center p-4">

                
                <div id="selectors" className="mt-2 mb-2 flex flex-wrap">
                    <Select onValueChange={setSortType} defaultValue="none">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Sl.No (default)</SelectItem>
                            <SelectItem value="name">Course Name</SelectItem>
                            <SelectItem value="attendance-asc">Attendance (Low to High)</SelectItem>
                            <SelectItem value="attendance-desc">Attendance (High to Low)</SelectItem>
                            <SelectItem value="skippable-desc">Skippable Classes (High to Low)</SelectItem>
                            <SelectItem value="skippable-asc">Skippable Classes (Low to High)</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="flex items-center space-x-2 mx-4 mt-0 mb-0">
                        <Label htmlFor="abbr">Abbreviate</Label>
                        <Switch id="abbr" checked={abbreviateNames} onCheckedChange={setAbbreviateNames} />
                    </div>
                </div>

                                    <div className="flex justify-center">
                  <Button onClick={() => setIsDemoMode(false)} className=" bg-red-400 mt-0 mb-4 sm:mb-0">
                    Exit Demo Mode
                  </Button>
                </div>
</div>

                <div className="flex flex-row flex-wrap w-full justify-center sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:justify-items-center" id="subject-cards">
                    {sortedSubjectsData.map(subject => (
                        <SubjectCard 
                            key={subject.Sl_No}
                            Sl_No={subject.Sl_No}
                            Course={abbreviateNames ? subject.CourseAbbreviation : subject.Course}
                            present={subject.present}
                            absent={subject.absent}
                            total={subject.total}
                            isDemoMode={isDemoMode}
                            MinAttendancePercentage={subject.MinAttendancePercentage}
                            No_ClassesPerWeek={(subject as any).No_ClassesPerWeek || 4}
                            UpdateStorageFunction={updateSubjectAttribute}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}