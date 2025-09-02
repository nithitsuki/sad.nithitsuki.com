import HeroPage from "@/components/HeroPage";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Attendance Dashboard - Track Your Class Attendance',
  description: 'A simple, elegant dashboard to monitor your class attendance, calculate required classes, and never miss your minimum attendance again.',
  keywords: 'attendance, dashboard, class tracker, education, student tools',
};

export default function Home() {
  return <HeroPage />;
}
