// Global extensions for window object
declare global {
  interface Window {
    updateDashboardSettings?: {
      setShowAddSubjects: (show: boolean) => void;
      setTitlePayload: (title: string | undefined) => void;
    };
  }
}

export {};
