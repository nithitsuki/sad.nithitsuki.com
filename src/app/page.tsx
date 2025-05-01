"use client";
import { useState, useEffect } from "react";
import InputArea from "@/components/InputArea";
import SubjectCard from "@/components/SubjectCard";
import { Button } from "@/components/ui/button";

interface SubjectData {
  subjectName: string;
  ClassesOccurred: number;
  ClassesAttended: number;
  MinAttendancePercentage: number;
  No_ClassesPerWeek: number;
}

export default function Home() {
  const [showInputArea, setShowInputArea] = useState(false);
  const [subjectsData, setSubjectsData] = useState<SubjectData[]>([]);

  const defaultSubjectsData: SubjectData[] = [
    {
      subjectName: "Glimpses of Glorious India",
      ClassesOccurred: 30,
      ClassesAttended: 27,
      MinAttendancePercentage: 75,
      No_ClassesPerWeek: 2,
    },
    {
      subjectName: "Coding Classes",
      ClassesOccurred: 18,
      ClassesAttended: 14,
      MinAttendancePercentage: 75,
      No_ClassesPerWeek: 2,
    },
    {
      subjectName: "Object Oriented Programming",
      ClassesOccurred: 67,
      ClassesAttended: 60,
      MinAttendancePercentage: 75,
      No_ClassesPerWeek: 2,
    },
    {
      subjectName: "User Interface Design",
      ClassesOccurred: 52,
      ClassesAttended: 47,
      MinAttendancePercentage: 75,
      No_ClassesPerWeek: 2,
    },
    {
      subjectName: "Discrete Mathematics",
      ClassesOccurred: 67,
      ClassesAttended: 54,
      MinAttendancePercentage: 75,
      No_ClassesPerWeek: 2,
    },
    {
      subjectName: "Linear Algebra",
      ClassesOccurred: 64,
      ClassesAttended: 51,
      MinAttendancePercentage: 75,
      No_ClassesPerWeek: 2,
    },
    {
      subjectName: "Manufacturing Practice",
      ClassesOccurred: 40,
      ClassesAttended: 30,
      MinAttendancePercentage: 75,
      No_ClassesPerWeek: 2,
    },
    {
      subjectName: "Modern Physics",
      ClassesOccurred: 42,
      ClassesAttended: 34,
      MinAttendancePercentage: 75,
      No_ClassesPerWeek: 2,
    },
  ];

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
    // Listen for storage events (when other components update localStorage)
    window.addEventListener("storage", handleStorageChange);

    // Custom event for components in the same window
    window.addEventListener("localDataUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("localDataUpdated", handleStorageChange);
    };
  }, []);



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
            <label className="text-lg m-3">
              {payload}
            </label>
            <Button onClick={() => setShowInputArea(true)}>
              Add a Subject
            </Button>
          </div>
        )}
      </div>

      {showInputArea && <InputArea onCancel={() => setShowInputArea(false)} />}

      <div
        className="flex flex-wrap gap-4 items-start justify-center mt-5"
        id="subject-cards"
      >
        {subjectsData.map((subject, index) => (
          <SubjectCard
            key={index} // It's better to use a unique ID if available
            subjectName={subject.subjectName}
            ClassesOccurred={subject.ClassesOccurred}
            ClassesAttended={subject.ClassesAttended}
            MinAttendancePercentage={subject.MinAttendancePercentage}
            No_ClassesPerWeek={subject.No_ClassesPerWeek}
          />
        ))}
      </div>
    </div>
  );
}
