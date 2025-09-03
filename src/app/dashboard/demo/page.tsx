import { Title } from './../../../components/Title';
import { BackgroundGrid } from './../../../components/BackgroundGrid';
import Footer from "@/components/Footer";
import DashboardClient from "@/components/DashboardClient";
import { SubjectProvider } from "@/contexts/SubjectContext";
import DynamicTitle from "./../../../components/DynamicTitle";
import DashboardWrapper from "@/components/DashboardWrapper";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Demo Dashboard - Attendance Tracker',
  description: 'Try out the attendance tracker with sample data.',
};

export default function DemoPage() {
  return (
    <SubjectProvider>
      <DashboardWrapper isDemo={true}>
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
