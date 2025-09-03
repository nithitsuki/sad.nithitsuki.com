"use client";
import { ShowTimeTableButton } from './ShowTimeTableButton';
import { SettingsPopup } from './settingsPopup';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SubjectCard from "@/components/SubjectCard";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSubjects, type SubjectData } from "@/contexts/SubjectContext";

export default function SubjectDisplayArea() {
    const { subjects, isDemoMode, settings, actions } = useSubjects();
    const [sortType, setSortType] = useState<string>("none");
    const router = useRouter();

    const handleExitDemo = () => {
        actions.setDemoMode(false);
        router.replace('/dashboard');
    };

    const sortedSubjectsData = useMemo(() => {
        const getAttendancePercentage = (subject: SubjectData): number => {
            if (subject.total === 0) return -1;
            return (subject.present / subject.total) * 100;
        };

        const getSkippableClasses = (subject: SubjectData): number => {
            if (subject.total === 0) return -Infinity;
            const minPresentClasses = Math.ceil(subject.total * (subject.MinAttendancePercentage / 100));
            return subject.present - minPresentClasses;
        };

        let sortedArray = [...subjects];

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
            case "none":
            default:
                sortedArray.sort((a, b) => {
                    const numA = parseInt(a.Sl_No, 10);
                    const numB = parseInt(b.Sl_No, 10);
                    if (!isNaN(numA) && !isNaN(numB)) {
                        return numA - numB;
                    }
                    return a.Sl_No.localeCompare(b.Sl_No);
                });
                break;
        }
        return sortedArray;
    }, [subjects, sortType]);

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div id="translucent" className="h-full w-min sm:w-auto sm:p-2 sm:pt-0 sm:max-w-[95vw] flex flex-col justify-center items-center  rounded-md border bg-[#0000001c] backdrop-blur-[1.5px] mt-0">
                <div id="main-row" className="flex flex-row w-full justify-between items-center px-2 py-0 my-0">
                    <Select onValueChange={setSortType} defaultValue="none">
                        <SelectTrigger className="w-[140px] sm:w-auto">
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

                    <div className='flex flex-row items-center space-x-2  px-4'>
                        <SettingsPopup />
                        {!isDemoMode && (<ShowTimeTableButton />)}
                        {isDemoMode && (
                            <Button onClick={handleExitDemo} className=" bg-red-400 mt-0 mb-0">
                                Exit Demo Mode
                            </Button>
                        )}
                    </div>
                </div>

                <div className="flex flex-row flex-wrap w-full justify-evenly lg:grid lg:grid-cols-3 xl:grid-cols-4 sm:justify-items-center" id="subject-cards">
                    {sortedSubjectsData.map(subject => (
                        <SubjectCard
                            key={subject.Sl_No}
                            subject={subject}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}