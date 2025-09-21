import AppNavBar from "@/components/AppNavBar";
import AppFooter from "@/components/AppFooter";
import { Metadata } from "next";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({
  children,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <AppNavBar />
      <main className="max-w-[1080px] mx-auto px-5">
        {children}
      </main>
      <AppFooter/>
    </div>
  );
} 