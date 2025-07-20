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
    <>
      <AppNavBar />
      <main style={{ maxWidth: "1080px", margin: "0 auto", padding: "0 20px" }}>
        {children}
      </main>
      <AppFooter/>
    </>
  );
} 