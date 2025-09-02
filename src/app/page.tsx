import { Title } from './../components/Title';
import { BackgroundGrid } from './../components/BackgroundGrid';
import Footer from "@/components/Footer";
import DashboardClient from "@/components/DashboardClient";
import { SubjectProvider } from "@/contexts/SubjectContext";
import DynamicTitle from "./../components/DynamicTitle";

export default function Home() {
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
