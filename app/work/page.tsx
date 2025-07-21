import { allWorks } from "contentlayer/generated";
import { sortByDate } from "@/utils";
import AppListPortfolio from "@/components/AppListPortfolio";
import AppListPortfolioSmall from "@/components/AppListPortfolioSmall";
import AppLayout from "@/components/AppLayout";

export default function WorkListPage() {
  const works = allWorks;
  return (
    <AppLayout>
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold">Portfolio</h1>
      <p>Selected websites and apps showcase since 2015.</p>
        {works
          .filter((post) => post.feature === true && post.draft !== true)
          .sort(sortByDate)
          .map((post) => (
            <AppListPortfolio key={post.slug} data={post} />
          ))}
      <h2 className="text-2xl font-bold">Side Projects</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {works
        .filter((post) => post.feature !== true && post.draft !== true)
        .sort(sortByDate)
        .map((post) => (
          <AppListPortfolioSmall key={post.slug} data={post}/>
        ))}
        </div>
    </div>
    </AppLayout>
  );
}
