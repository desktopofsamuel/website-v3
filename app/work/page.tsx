import { allWorks } from "contentlayer/generated";
import { sortByDate } from "@/utils";
import AppListPortfolio from "@/components/AppListPortfolio";
import AppListPortfolioSmall from "@/components/AppListPortfolioSmall";
import AppLayout from "@/components/AppLayout";

export default function WorkListPage() {
  const works = allWorks;
  return (
    <AppLayout>
      <div className="py-8">
        <h1 className="mb-4 text-4xl md:text-6xl font-bold leading-tight font-heading">
          Portfolio
        </h1>
        <p className="text-lg text-secondarytext leading-normal">
          Selected websites and apps showcase since 2015.
        </p>
      </div>

      {works
        .filter((post) => post.feature === true && post.draft !== true)
        .sort(sortByDate)
        .map((post) => (
          <AppListPortfolio key={post.slug} data={post} />
        ))}
      <h2 className="text-sm uppercase tracking-wide font-heading font-semibold text-secondarytext">
        Side Projects
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {works
          .filter((post) => post.feature !== true && post.draft !== true)
          .sort(sortByDate)
          .map((post) => (
            <AppListPortfolioSmall key={post.slug} data={post} />
          ))}
      </div>
    </AppLayout>
  );
}
