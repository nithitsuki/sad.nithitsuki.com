'use client'
import { useSubjects } from "@/contexts/SubjectContext";
import { Title } from "./Title";

export default function DynamicTitle() {
  const { settings, isLoaded } = useSubjects();
  
  if (!isLoaded) {
    return <Title title="Attendance Dashboard" />;
  }
  
  const title = settings.titlePayload || "Attendance Dashboard";
  return <Title title={title} />;
}
