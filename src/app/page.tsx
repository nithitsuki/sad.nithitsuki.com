"use client";
import { useState } from "react";
import InputArea from "@/components/InputArea";
import SubjectCard from "@/components/SubjectCard";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [showInputArea, setShowInputArea] = useState(false);

  return (
    <div>
      <div className="flex flex-col items-center"><h1>Student Attendance Dashboard</h1></div>
      <div className="flex flex-wrap gap-4 items-start justify-center mt-5">
      {!showInputArea && (
        <div>
        <label className="text-lg m-3">Looks like you dont have any subjects, add one now!: </label>
        <Button onClick={() => setShowInputArea(true)}>
          Add a Subject
        </Button>
        </div>
      )}
      </div>
      
      {showInputArea && <InputArea onCancel={() => setShowInputArea(false)}/>}
      <div className="flex flex-wrap gap-4 items-start justify-center mt-5">
        <SubjectCard subjectName="Mathematics" No_ClassesPerWeek={3} ClassesOccurred={10} ClassesAttended={8} MinAttendancePercentage={75}/>
        <SubjectCard subjectName="Physics" No_ClassesPerWeek={2} ClassesOccurred={10} ClassesAttended={6}     MinAttendancePercentage={75}/>
        <SubjectCard subjectName="Chemistry" No_ClassesPerWeek={4} ClassesOccurred={10} ClassesAttended={9}   MinAttendancePercentage={75}/>
        <SubjectCard subjectName="Biology" No_ClassesPerWeek={2} ClassesOccurred={10} ClassesAttended={7}     MinAttendancePercentage={75}/>
    </div>

    </div>
  );
}
