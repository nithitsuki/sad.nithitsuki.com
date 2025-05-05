"use client";
import { useState, useEffect } from "react";
import InputArea from "@/components/InputArea";
import SubjectCard from "@/components/SubjectCard";
import { Button } from "@/components/ui/button";
import defaultSubjectsData from "@/../public/default-amrta-cse-sem2.json" assert { type: "json" };

interface SubjectData {
  subjectName: string;
  ClassesAttended: number;
  ClassesSkipped: number;
  MinAttendancePercentage: number;
  No_ClassesPerWeek: number;
}

export default function Home() {
  const [showInputArea, setShowInputArea] = useState(false);
  const [subjectsData, setSubjectsData] = useState<SubjectData[]>([]);


  // Import default subjects data
  useEffect(() => {
    const savedSubjects = localStorage.getItem("subjectsData");
    if (savedSubjects && savedSubjects !== "[]") {
      setSubjectsData(JSON.parse(savedSubjects));
    } else {
      setSubjectsData(defaultSubjectsData);
      localStorage.setItem("subjectsData", JSON.stringify(defaultSubjectsData));
    }
  }, []);


  // Update localStorage whenever subjectsData changes
  useEffect(() => {
    const handleStorageChange = () => {
      const savedSubjects = localStorage.getItem("subjectsData");
      if (savedSubjects) {
        setSubjectsData(JSON.parse(savedSubjects));
      }
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("localDataUpdated", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("localDataUpdated", handleStorageChange);
    };
  }, []);


  // Function to update a specific subject attribute
  const updateSubjectAttribute = (subjectName: string, attribute: string, newValue: number) => {
    const updatedSubjects = subjectsData.map(subject => {
      if (subject.subjectName === subjectName) {
        return { ...subject, [attribute]: newValue };
      }
      return subject;
    });
    setSubjectsData(updatedSubjects);
    localStorage.setItem("subjectsData", JSON.stringify(updatedSubjects));
    window.dispatchEvent(new Event("localDataUpdated"));
  };

  let payload = 'default payload';
  if (subjectsData.length === 0) {
    payload = `You have no subjects. Click on "Add a Subject" to add one.`;
  } else if (subjectsData.length === 1) {
    payload = `You have ${subjectsData.length} subject. Click on "Add a Subject" to add more.`;
  } 
  else {
    payload = `You have ${subjectsData.length} subjects. Click on "Add a Subject" to add more.`;
  }

  
  return (
    <div>
      <div className="flex flex-col items-center">
        <h1>Student Attendance Dashboard</h1>
      </div>
      
      <div className="flex flex-wrap gap-4 items-start justify-center mt-5">
        {!showInputArea && (
          <div>
            <label className="text-lg ">
              {payload}
            </label>
            <br></br>
            <div className="flex justify-center">
              <Button onClick={() => setShowInputArea(true)} className="mt-2">
              Add a Subject
              </Button>
            </div>
          </div>
        )}
      </div>

      {showInputArea && <InputArea onCancel={() => setShowInputArea(false)} />}

      <div
        className="flex flex-wrap gap-0 sm:gap-4 m-0 sm:mt-5 items-start justify-center "
        id="subject-cards"
      >
        <br className="m-2 sm:hidden"></br>
        {subjectsData.map((subject, index) => (
          <SubjectCard
            key={index} // It's better to use a unique ID if available
            subjectName={subject.subjectName}
            ClassesSkipped={subject.ClassesSkipped}
            ClassesAttended={subject.ClassesAttended}
            MinAttendancePercentage={subject.MinAttendancePercentage}
            No_ClassesPerWeek={subject.No_ClassesPerWeek}
            UpdateStorageFunction={(subjectName: string, attribute: string, newValue: number) => updateSubjectAttribute(subjectName, attribute, newValue)}
          />
        ))}
      </div>
    </div>
  );
}