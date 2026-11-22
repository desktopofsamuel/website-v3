import type { Metadata } from "next";
import { filteredFeaturedWorks, filteredWorks } from "@/lib/content";
import AppListPortfolio from "@/components/AppListPortfolio";
import AppListPortfolioSmall from "@/components/AppListPortfolioSmall";
import SidebarSection from "@/components/SidebarSection";
// import WorkHero from "@/components/WorkHero"; // hidden until hero assets are ready
import config from "@/config";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Portfolio | Desktop of Samuel",
  description: "Websites & apps portfolio with UI/UX design showcase",
  openGraph: {
    title: "Portfolio | Desktop of Samuel",
    description: "Selected websites and apps showcase since 2015.",
    url: `${config.URL}/work`,
  },
};

export default function WorkListPage() {
  const featured = filteredFeaturedWorks;
  const sideProjects = filteredWorks.filter((post) => post.feature !== true);

  return (
    <>
      {/* <WorkHero />  // hidden until hero assets are ready */}
      <PageHero
        eyebrow="02 — Projects"
        title="Portfolio"
        description="Selected websites and apps showcase since 2015."
      />
      <SidebarSection label="Featured">
        <div className="divide-y divide-border/50">
          {featured.map((post) => (
            <AppListPortfolio key={post.slug} data={post} />
          ))}
        </div>
      </SidebarSection>

      <SidebarSection label="Side Projects">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sideProjects.map((post) => (
            <AppListPortfolioSmall key={post.slug} data={post} />
          ))}
        </div>
      </SidebarSection>
    </>
  );
}
