import { Title } from './../../components/Title';
import { BackgroundGrid } from './../../components/BackgroundGrid';
import Footer from "@/components/Footer";
import DashboardClient from "@/components/DashboardClient";
import { SubjectProvider } from "@/contexts/SubjectContext";
import DynamicTitle from "./../../components/DynamicTitle";
import DashboardWrapper from "@/components/DashboardWrapper";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Attendance Tracker',
  description: 'Track your attendance, view statistics, and manage your subjects.',
};

export default function Dashboard({
  searchParams,
}: {
  searchParams: { demo?: string }
}) {
  const isDemo = searchParams.demo === 'true';

  return (
    <SubjectProvider>
      <DashboardWrapper isDemo={isDemo}>
        <div>
          <div className="min-h-screen">
            <BackgroundGrid />
            <DynamicTitle />
            <DashboardClient />
          </div>
          <Footer />
        </div>
      </DashboardWrapper>
    </SubjectProvider>
  );
}
