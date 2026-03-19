'use client'
import Link from 'next/link'
import SubjectDisplayArea from "@/components/SubjectDisplayArea"
import { useSubjects } from "@/contexts/SubjectContext"

export default function DashboardClient() {
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
        {subjects.length === 0 && (
          <div className="text-lg m-0 text-center w-full max-w-2xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <p>Looks like you haven't synced any subjects.</p>
              <div className="text-center">
                <p className="mb-2">
                  <span className="font-semibold text-[var(--color-primary)]">Please use the browser extension</span> to sync your attendance:
                </p>
                <Link 
                  className="inline-flex items-center px-4 py-2 mt-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity" 
                  href="/amrita"
                >
                  Get the Extension
                </Link>
              </div>
              <div className="mt-8 pt-4 border-t border-[var(--color-border)] w-full">
                <p className="text-sm text-[var(--color-text-secondary)] mb-2">Want to see how it looks?</p>
                <button 
                  onClick={() => actions.setDemoMode(true)} 
                  className="font-medium text-blue-600 dark:text-sky-400 hover:underline"
                >
                  Try the Demo
                </button>
              </div>
            </div>
          </div>
        )}

      {subjects.length > 0 && <SubjectDisplayArea />}
    </div>
    </>
  )
}
