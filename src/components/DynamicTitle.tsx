'use client'
import { useSubjects } from "@/contexts/SubjectContext";
import { Title } from "./Title";

export default function DynamicTitle() {
  const { settings, isLoaded } = useSubjects();
  
  if (!isLoaded) {
    return <Title title="Attendance Dashboard" />;
  }
  
  if (settings.titlePayload) {
    return <div dangerouslySetInnerHTML={{ __html: settings.titlePayload }} />;
  }
  return <Title title="Attendance Dashboard" />;
}
