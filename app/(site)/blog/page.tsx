import { Link } from "@/components/AppLink";
import AppListBlog from "@/components/AppListBlog";
import AppListBlogDetail from "@/components/AppListBlogDetail";
import SidebarSection from "@/components/SidebarSection";
import PageHero from "@/components/PageHero";
import { allTags, filteredPosts } from "@/lib/content";
import { sortByDate } from "@/utils";
import config from "@/config";

const LONGFORM_TAG = "longform";

export default function BlogPage() {
  const featured = filteredPosts
    .filter((p) => p.feature === true)
    .sort(sortByDate);

  const latest = filteredPosts
    .filter((p) => p.feature !== true)
    .sort(sortByDate)
    .slice(0, config.POSTS_PER_PAGE);

  const longformCount = filteredPosts.reduce(
    (acc, p) => acc + (p.tags.includes(LONGFORM_TAG) ? 1 : 0),
    0
  );

  const topicPills = [
    {
      name: "Long form",
      path: `/tags/${LONGFORM_TAG}`,
      count: longformCount,
      curated: true,
    },
    ...allTags
      .filter((t) => t.name !== LONGFORM_TAG)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map((t) => ({ ...t, curated: false })),
  ];

  return (
    <>
      <PageHero
        eyebrow="02 — Writing"
        title={
          <>
            Notes on
            <br />
            Design &amp;
            <br />
            Technology
          </>
        }
        description="A collection of posts on design process, technology, and productivity."
      />

      {/* Featured */}
      <SidebarSection label="Featured">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featured.map((post) => (
            <AppListBlog key={post.slug} data={post} hideDate />
          ))}
        </div>
      </SidebarSection>

      {/* Latest */}
      <SidebarSection label="Latest">
        <div className="divide-y divide-border/50">
          {latest.map((post) => (
            <AppListBlogDetail key={post.slug} data={post} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href="/blog/page/2"
            className="inline-flex items-center font-body text-sm text-foreground border-b border-border hover:border-foreground transition-colors no-underline"
          >
            View more →
          </Link>
        </div>
      </SidebarSection>

      {/* Topics */}
      <SidebarSection
        label="Topics"
        leftAside={
          <Link
            href="/tags"
            className="inline-block font-body text-sm text-foreground border-b border-border hover:border-foreground transition-colors no-underline w-fit"
          >
            See all topics →
          </Link>
        }
      >
        <div className="flex flex-wrap gap-3 items-center">
          {topicPills.map((pill) => (
            <Link
              key={pill.path}
              href={pill.path}
              className={`inline-flex items-baseline gap-2 no-underline rounded-full border px-6 py-3 font-body text-2xl md:text-3xl tracking-tight transition-colors ${
                pill.curated
                  ? "border-foreground text-foreground hover:bg-foreground hover:text-background"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {pill.curated && <span aria-hidden="true">✦</span>}
              <span>{pill.name}</span>
              <span
                className={
                  pill.curated
                    ? "text-sm opacity-70"
                    : "text-sm text-muted-foreground"
                }
              >
                {pill.count}
              </span>
            </Link>
          ))}
        </div>
      </SidebarSection>
    </>
  );
}
