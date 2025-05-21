"use client";
import { useState, useEffect, use } from "react";
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
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Import default subjects data
  useEffect(() => {
    const savedSubjects = localStorage.getItem("subjectsData");
    if(isDemoMode) {
      setSubjectsData(defaultSubjectsData as SubjectData[]);
    }
    else if (savedSubjects && savedSubjects !== "[]") {
      setSubjectsData(JSON.parse(savedSubjects));
    }
  }, [isDemoMode]);

  useEffect(() => {
    if(!isDemoMode) {
      const savedSubjects = localStorage.getItem("subjectsData");
      if (savedSubjects && savedSubjects !== "[]") {
        setSubjectsData(JSON.parse(savedSubjects));
      } else {
        setSubjectsData([]);
      }
    }
  }, [isDemoMode]);

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

  
  return (
    <div className="min-h-screen">
      {/* <div > */}
        <div className="fixed z-[-1] size-full bg-[#111111] min-h-screen">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>
        {/* <Navbar>
      <Button onClick={() => setShowInputArea(true)} className="m-[6px] bg-gray-400">
        Add a Subject
      </Button>
      <label>rn, {subjectsData.length} subjects</label>
      </Navbar> */}
      
      <div className="flex flex-col items-center">
      <h1 className="p-0 m-0 mt-2">Student Attendance Dashboard</h1>
      </div>
      
      <div className="flex flex-wrap gap-4 items-start justify-center mt-5">
      {!showInputArea && (
        <div>
        <p className="text-lg m-0 text-center">
            {subjectsData.length === 0 ? 
            (<>Looks like you haven't added any subjects. 
            <br/>You can track attendance manually by clicking  <br className="sm:hidden"></br>"Add a Subject" to add one.

            </>)
            : subjectsData.length === 1 ?
            (<>You have {subjectsData.length} subject.<br className="sm:hidden"></br> Click on "Add a Subject" to add more.</>)
            : (<>You have {subjectsData.length} subjects.<br className="sm:hidden"></br> Click on "Add a Subject" to add more.</>)}
        </p>
        <br></br>
            {isDemoMode ? (
              <>
              <div className="flex justify-center">
                <Button onClick={() => setIsDemoMode(false)} className=" bg-red-400 mt-0 mb-4 sm:mb-0">
                Exit Demo Mode
                </Button>
              </div>
              </>
            ) : (
              <>
              <div className="flex justify-center">
                <Button onClick={() => setShowInputArea(true)} className="mt-2">
                Add a Subject
                </Button>
              </div>
              </>
            )}
            {subjectsData.length === 0 ? (<>
            <div className="text-center mt-4">
            <br/>
            <span className="text-pink-600">Amrita Student?</span> Try my <a className="font-medium text-blue-600 dark:text-sky-400 hover:underline" href="https://github.com/nithitsuki/attendance-grabber">automating extension!</a>
            <br/>
            <br/>Wanna try out <a href="#" onClick={() => {setIsDemoMode(true);}} className="font-medium text-blue-600 dark:text-sky-400 hover:underline">a demo?</a>
            </div>
            </>) : (<></>)
          }
        </div>
      )}
      </div>

      {showInputArea && <InputArea onCancel={() => setShowInputArea(false)} />}

      <div
      className="flex flex-wrap gap-0 sm:gap-4 m-0 sm:mt-5 items-stretch justify-center "
      id="subject-cards"
      >
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