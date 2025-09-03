import { Title } from './../../components/Title';
import { BackgroundGrid } from './../../components/BackgroundGrid';
import Footer from "@/components/Footer";
import DashboardClient from "@/components/DashboardClient";
import { SubjectProvider } from "@/contexts/SubjectContext";
import DynamicTitle from "./../../components/DynamicTitle";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Attendance Tracker',
  description: 'Track your attendance, view statistics, and manage your subjects.',
};

export default function Dashboard() {
  return (
    <SubjectProvider>
      <div>
        <div className="min-h-screen">
          <BackgroundGrid />
          <DynamicTitle />
          <DashboardClient />
        </div>
        <Footer />
      </div>
    </SubjectProvider>
  );
}
