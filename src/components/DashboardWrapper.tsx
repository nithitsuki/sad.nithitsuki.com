'use client'
import { useEffect, ReactNode, useCallback } from 'react';
import { useSubjects } from "@/contexts/SubjectContext";

interface DashboardWrapperProps {
  children: ReactNode;
  isDemo: boolean;
}

export default function DashboardWrapper({ children, isDemo }: DashboardWrapperProps) {
  const { actions, isLoaded, isDemoMode } = useSubjects();

  useEffect(() => {
    // Only set demo mode if we need to and haven't already
    if (isLoaded && isDemo && !isDemoMode) {
      actions.setDemoMode(true);
    }
  }, [isLoaded, isDemo, isDemoMode, actions]);

  return <>{children}</>;
}
