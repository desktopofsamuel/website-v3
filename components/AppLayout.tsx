import AppNavBar from "@/components/AppNavBar";
import FooterReveal from "@/components/FooterReveal";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <FooterReveal>
      <AppNavBar />
      <main className="w-full">{children}</main>
    </FooterReveal>
  );
}
