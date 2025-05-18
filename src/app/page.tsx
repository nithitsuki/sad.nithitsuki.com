"use client";
import { useState, useEffect } from "react";
import InputArea from "@/components/InputArea";
import SubjectCard from "@/components/SubjectCard";
import { Button } from "@/components/ui/button";
import defaultSubjectsData from "@/../public/default-amrta-cse-sem2.json" assert { type: "json" };
import Navbar from "@/components/Navbar";

interface SubjectData {
  Course: string;
  Sl_No: string;
  absent: string;
  dutyLeave: string;
  faculty: string;
  medical: string;
  percentage: string;
  present: string;
  total: string;
}

export default function Home() {
  const [showInputArea, setShowInputArea] = useState(false);
  const [subjectsData, setSubjectsData] = useState<SubjectData[]>([]);


  // Import default subjects data
  useEffect(() => {
    const savedSubjects = localStorage.getItem("subjectsData");
    if (savedSubjects && savedSubjects !== "[]") {
      setSubjectsData(JSON.parse(savedSubjects));
    }
    // else {
    //   setSubjectsData(defaultSubjectsData);
    //   localStorage.setItem("subjectsData", JSON.stringify(defaultSubjectsData));
    // }
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
  const updateSubjectAttribute = (Course: string, attribute: string, newValue: number) => {
    const updatedSubjects = subjectsData.map(subject => {
      if (subject.Course === Course) {
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
    <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#4A0C23] to-[#D00846]">
      {/* <Navbar>
      <Button onClick={() => setShowInputArea(true)} className="m-[6px] bg-gray-400">
        Add a Subject
      </Button>
      <label>rn, {subjectsData.length} subjects</label>
      </Navbar> */}
      
      <div className="flex flex-col items-center">
      <h1 className="p-0 m-0">Student Attendance Dashboard</h1>
      </div>
      {/* 
      <div className="flex flex-wrap gap-4 items-start justify-center mt-5">
      {!showInputArea && (
        <div>
        <p className="text-lg m-0 text-center">
          {payload}
        </p>
        <br></br>
        <div className="flex justify-center">
          <Button onClick={() => setShowInputArea(true)} className="mt-2">
          Add a Subject
          </Button>
        </div>
        </div>
      )}
      </div> */}

      {showInputArea && <InputArea onCancel={() => setShowInputArea(false)} />}

      <div
      className="flex flex-wrap gap-0 sm:gap-4 m-0 sm:mt-5 items-start justify-center "
      id="subject-cards"
      >
      <br className="m-2 sm:hidden"></br>
      {subjectsData.map((subject,index) => (
        <SubjectCard
          key={index} // Use Sl_No or Course as a unique key
          Course={subject.Course}
          Sl_No={subject.Sl_No}
          present={parseInt(subject.present, 10) || 0}
          absent={parseInt(subject.absent, 10) || 0}
          dutyLeave={parseInt(subject.dutyLeave, 10) || 0}
          medical={parseInt(subject.medical, 10) || 0}
          total={parseInt(subject.total, 10) || 0}
          percentage={subject.percentage}
          faculty={subject.faculty}
          // MinAttendancePercentage and No_ClassesPerWeek are required by SubjectCardProps.
          // Consider adding them to your SubjectData interface and state.
          MinAttendancePercentage={(subject as any).MinAttendancePercentage || 75} // Defaulting to 75%
          No_ClassesPerWeek={(subject as any).No_ClassesPerWeek || 4} // Defaulting to 4 classes
          UpdateStorageFunction={(courseName: string, attribute: string, newValue: number) => updateSubjectAttribute(courseName, attribute, newValue)}
        />
      ))}
      </div>
    </div>
  );
}