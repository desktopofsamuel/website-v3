import type { Metadata } from "next";
import { allWorks } from "contentlayer/generated";
import { sortByDate } from "@/utils";
import AppListPortfolio from "@/components/AppListPortfolio";
import AppListPortfolioSmall from "@/components/AppListPortfolioSmall";
import AppLayout from "@/components/AppLayout";
import SidebarSection from "@/components/SidebarSection";
import WorkHero from "@/components/WorkHero";
import config from "@/../config";

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
  const works = allWorks;
  const featured = works.filter((post) => post.feature === true && post.draft !== true).sort(sortByDate);
  const sideProjects = works.filter((post) => post.feature !== true && post.draft !== true).sort(sortByDate);

  return (
    <AppLayout>
      <WorkHero />

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
    </AppLayout>
  );
}
