// src/contexts/SubjectContext.tsx
'use client'
import { createContext, useContext, useReducer, useEffect, ReactNode, useMemo } from 'react'
import defaultSubjectsData from "@/../public/default-amrta-cse-sem2.json"

export interface SubjectData {
  Sl_No: string;
  Course: string;
  CourseAbbreviation: string;
  total: number;
  present: number;
  absent: number;
  dutyLeave?: number;
  medicalLeave?: number;
  percentage: number;
  MinAttendancePercentage: number;
  schemaVersion: number;
  daysOfWeek?: string[];
  Notes?: string;
  end_date?: string;
}

interface Settings {
  abbreviateNames: boolean;
  showAddSubjects: boolean;
  titlePayload?: string;
}

interface SubjectState {
  subjects: SubjectData[];
  isDemoMode: boolean;
  settings: Settings;
  isLoaded: boolean;
}

type SubjectAction =
  | { type: 'LOAD_SUBJECTS'; payload: SubjectData[] }
  | { type: 'UPDATE_SUBJECT'; payload: { courseId: string; updates: Partial<SubjectData> } }
  | { type: 'SET_DEMO_MODE'; payload: boolean }
  | { type: 'TOGGLE_ABBREVIATION' }
  | { type: 'SET_SHOW_ADD_SUBJECTS'; payload: boolean }
  | { type: 'SET_TITLE_PAYLOAD'; payload: string | undefined }
  | { type: 'DELETE_ALL_SUBJECTS' }
  | { type: 'SET_LOADED'; payload: boolean }

interface SubjectContextType {
  subjects: SubjectData[]
  isDemoMode: boolean
  settings: Settings
  isLoaded: boolean
  actions: {
    updateSubject: (courseId: string, updates: Partial<SubjectData>) => void
    setDemoMode: (enabled: boolean) => void
    toggleAbbreviation: () => void
    setShowAddSubjects: (show: boolean) => void
    setTitlePayload: (title: string | undefined) => void
    deleteAllSubjects: () => void
  }
}

const initialState: SubjectState = {
  subjects: [],
  isDemoMode: false,
  settings: {
    abbreviateNames: true,
    showAddSubjects: true,
    titlePayload: undefined,
  },
  isLoaded: false,
}

function subjectReducer(state: SubjectState, action: SubjectAction): SubjectState {
  switch (action.type) {
    case 'LOAD_SUBJECTS':
      return {
        ...state,
        subjects: action.payload,
        isLoaded: true,
      }
    
    case 'UPDATE_SUBJECT':
      const { courseId, updates } = action.payload
      const updatedSubjects = state.subjects.map(subject => {
        if (subject.Course === courseId) {
          const updated = { ...subject, ...updates }
          // Recalculate percentage when present/total changes
          if ('present' in updates || 'total' in updates) {
            updated.percentage = updated.total > 0 ? (updated.present / updated.total) * 100 : 0
          }
          return updated
        }
        return subject
      })
      return {
        ...state,
        subjects: updatedSubjects,
      }
    
    case 'SET_DEMO_MODE':
      return {
        ...state,
        isDemoMode: action.payload,
        subjects: action.payload ? defaultSubjectsData as SubjectData[] : [],
      }
    
    case 'TOGGLE_ABBREVIATION':
      return {
        ...state,
        settings: {
          ...state.settings,
          abbreviateNames: !state.settings.abbreviateNames,
        },
      }
    
    case 'SET_SHOW_ADD_SUBJECTS':
      return {
        ...state,
        settings: {
          ...state.settings,
          showAddSubjects: action.payload,
        },
      }
    
    case 'SET_TITLE_PAYLOAD':
      return {
        ...state,
        settings: {
          ...state.settings,
          titlePayload: action.payload,
        },
      }
    
    case 'DELETE_ALL_SUBJECTS':
      return {
        ...state,
        subjects: [],
      }
    
    case 'SET_LOADED':
      return {
        ...state,
        isLoaded: action.payload,
      }
    
    default:
      return state
  }
}

const SubjectContext = createContext<SubjectContextType | null>(null)

export const useSubjects = () => {
  const context = useContext(SubjectContext)
  if (!context) throw new Error('useSubjects must be used within SubjectProvider')
  return context
}

interface SubjectProviderProps {
  children: ReactNode
}

export function SubjectProvider({ children }: SubjectProviderProps) {
  const [state, dispatch] = useReducer(subjectReducer, initialState)

  // Expose functions globally for extension use
  // Extensions can call:
  // window.updateDashboardSettings?.setShowAddSubjects(false) - to hide add subjects button
  // window.updateDashboardSettings?.setTitlePayload("Custom Title") - to set custom title
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // @ts-ignore - Adding to window for extension use
      window.updateDashboardSettings = {
        setShowAddSubjects: (show: boolean) => dispatch({ type: 'SET_SHOW_ADD_SUBJECTS', payload: show }),
        setTitlePayload: (title: string | undefined) => dispatch({ type: 'SET_TITLE_PAYLOAD', payload: title }),
      };
    }
  }, []);

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      // Load subjects
      const savedSubjects = localStorage.getItem("subjectsData")
      if (savedSubjects && savedSubjects !== "[]") {
        const subjects = JSON.parse(savedSubjects) as SubjectData[]
        dispatch({ type: 'LOAD_SUBJECTS', payload: subjects })
      } else {
        dispatch({ type: 'SET_LOADED', payload: true })
      }

      // Load settings
      const savedSettings = localStorage.getItem("appSettings")
      if (savedSettings) {
        const settings = JSON.parse(savedSettings)
        if (typeof settings.abbreviateNames === 'boolean' && !settings.abbreviateNames) {
          dispatch({ type: 'TOGGLE_ABBREVIATION' })
        }
        if (typeof settings.showAddSubjects === 'boolean') {
          dispatch({ type: 'SET_SHOW_ADD_SUBJECTS', payload: settings.showAddSubjects })
        }
        if (typeof settings.titlePayload === 'string') {
          dispatch({ type: 'SET_TITLE_PAYLOAD', payload: settings.titlePayload })
        }
      }
    } catch (error) {
      console.error("Failed to load data from localStorage:", error)
      dispatch({ type: 'SET_LOADED', payload: true })
    }
  }, [])

  // Save subjects to localStorage whenever subjects change
  useEffect(() => {
    if (!state.isLoaded || state.isDemoMode) return

    try {
      localStorage.setItem("subjectsData", JSON.stringify(state.subjects))
      // Dispatch custom event for any components still listening
      window.dispatchEvent(new Event("localDataUpdated"))
    } catch (error) {
      console.error("Failed to save subjects to localStorage:", error)
    }
  }, [state.subjects, state.isLoaded, state.isDemoMode])

  // Save settings to localStorage
  useEffect(() => {
    if (!state.isLoaded) return

    try {
      localStorage.setItem("appSettings", JSON.stringify(state.settings))
    } catch (error) {
      console.error("Failed to save settings to localStorage:", error)
    }
  }, [state.settings, state.isLoaded])

  const actions = useMemo(() => ({
    updateSubject: (courseId: string, updates: Partial<SubjectData>) => {
      dispatch({ type: 'UPDATE_SUBJECT', payload: { courseId, updates } })
    },

    setDemoMode: (enabled: boolean) => {
      dispatch({ type: 'SET_DEMO_MODE', payload: enabled })
    },

    toggleAbbreviation: () => {
      dispatch({ type: 'TOGGLE_ABBREVIATION' })
    },

    setShowAddSubjects: (show: boolean) => {
      dispatch({ type: 'SET_SHOW_ADD_SUBJECTS', payload: show })
    },

    setTitlePayload: (title: string | undefined) => {
      dispatch({ type: 'SET_TITLE_PAYLOAD', payload: title })
    },

    deleteAllSubjects: () => {
      dispatch({ type: 'DELETE_ALL_SUBJECTS' })
      if (typeof window !== 'undefined') {
        localStorage.removeItem("subjectsData")
        window.dispatchEvent(new Event("localDataUpdated"))
      }
    },
  }), []);

  const contextValue: SubjectContextType = {
    subjects: state.subjects,
    isDemoMode: state.isDemoMode,
    settings: state.settings,
    isLoaded: state.isLoaded,
    actions,
  }

  return (
    <SubjectContext.Provider value={contextValue}>
      {children}
    </SubjectContext.Provider>
  )
}