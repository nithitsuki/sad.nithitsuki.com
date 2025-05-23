"use client";
import { useState, useEffect, use } from "react";
// Custom Shadcn UI components
import InputArea from "@/components/InputArea";
import SubjectCard from "@/components/SubjectCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Custom components
import { Title } from './../components/Title';
import SubjectDisplayArea from './../components/SubjectDisplayArea';
import { BackgroundGrid } from './../components/BackgroundGrid';
import Footer from "@/components/Footer";
import defaultSubjectsData from "@/../public/default-amrta-cse-sem2.json" assert { type: "json" };
interface SubjectData {
  Course: string;
  Sl_No: string;
  CourseAbbreviation: string;
  total: number;
  present: number;
  absent: number;
  MinAttendancePercentage: number;
}

export default function Home() {
  const [showInputArea, setShowInputArea] = useState(false);
  const [subjectsData, setSubjectsData] = useState<SubjectData[]>([]);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Load subjects data from localStorage or use demo data
  useEffect(() => {
    if (isDemoMode) {
      setSubjectsData(defaultSubjectsData as SubjectData[]);
    } else {
      const savedSubjects = localStorage.getItem("subjectsData");
      if (savedSubjects && savedSubjects !== "[]") {
        try {
          setSubjectsData(JSON.parse(savedSubjects));
        } catch (error) {
          console.error("Failed to parse subjects data:", error);
          setSubjectsData([]);
        }
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
    <div>
    <div className="min-h-screen">
      {/* <div > */}
      <BackgroundGrid     />
      <Title title="Attendance Dashboard" />

      <div className="flex flex-wrap gap-4 items-start justify-center mt-5">
        {!showInputArea && (
          <div>
            <p className="text-lg m-0 text-center">
              {subjectsData.length === 0 ?
                (<>Looks like you haven't added any subjects.
                  <br />You can track attendance manually by clicking  <br className="sm:hidden"></br>"Add a Subject" to add one.
                </>)
                : subjectsData.length === 1 ?
                  (<>You have {subjectsData.length} subject.<br className="sm:hidden"></br> Click on "Add a Subject" to add more.</>)
                  : (<>You have {subjectsData.length} subjects.<br className="sm:hidden"></br> Click on "Add a Subject" to add more.</>)}
            </p>
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
                  <Button onClick={() => {/**setShowInputArea(true) */ alert("Undergoing bug fixes\n Thank you for your patience!")}} className="mt-2">
                    Add a Subject
                  </Button>
                </div>
              </>
            )}

            {subjectsData.length === 0 ? (<>
              <div className="text-center mt-4">
                <br />
                <span className="text-pink-600">Amrita Student?</span> Try my <a className="font-medium text-blue-600 dark:text-sky-400 hover:underline" href="https://github.com/nithitsuki/attendance-grabber">automating extension!</a>
                <br />
                <br />Wanna try out <a href="#" onClick={() => { setIsDemoMode(true); }} className="font-medium text-blue-600 dark:text-sky-400 hover:underline">a demo?</a>
              </div>
            </>) : (<></>)
            }

          </div>
        )}
      </div>

      {showInputArea && <InputArea onCancel={() => setShowInputArea(false)} />}
      {subjectsData.length != 0 ? (
        <><SubjectDisplayArea   subjectsData={subjectsData} updateSubjectAttribute={updateSubjectAttribute}  /></>)
        : (<></>)}
    </div>
      <Footer />
    </div>
  );
}
