'use client'
import { useState } from "react"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import InputArea from "@/components/InputArea"
import SubjectDisplayArea from "@/components/SubjectDisplayArea"
import { useSubjects } from "@/contexts/SubjectContext"

export default function DashboardClient() {
  const [showInputArea, setShowInputArea] = useState(false)
  const { subjects, isDemoMode, isLoaded, settings, actions } = useSubjects()

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <div id="main_content" className="flex flex-wrap gap-4 items-start justify-center">
      {!showInputArea && (
        <div>
          <p className="text-lg m-0 text-center">
            {subjects.length === 0 && (
              <>
                Looks like you haven't added any subjects.
                <br />
                There is currently no support to add subjects manually{" "}
                <br className=""></br>
                please contact me if you're interested in it.
              </>
            )}
          </p>

          {subjects.length === 0 && (
            <div className="text-center mt-4">
              <br />
              <span className="text-pink-600">Amrita Student?</span> Check out my{" "}
              <Link className="font-medium text-blue-600 dark:text-sky-400 hover:underline" href="/amrita">
                automating extension!
              </Link>
              <br />
              <br />
              Wanna try out{" "}
              <button 
                onClick={() => actions.setDemoMode(true)} 
                className="font-medium text-blue-600 dark:text-sky-400 hover:underline"
              >
                a demo?
              </button>
            </div>
          )}
        </div>
      )}

      {showInputArea && <InputArea onCancel={() => setShowInputArea(false)} />}
      
      {subjects.length > 0 && <SubjectDisplayArea />}
    </div>
    </>
  )
}
