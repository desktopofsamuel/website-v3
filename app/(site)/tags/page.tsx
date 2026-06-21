import SidebarSection from "@/components/SidebarSection";
import PageHero from "@/components/PageHero";
import { Link } from "@/components/AppLink";
import { allTags, countPostsWithTag } from "@/lib/content";
import type { Metadata } from "next";

const LONGFORM_TAG = "longform";

export const metadata: Metadata = {
  title: "All Topics",
  description:
    "Browse every topic covered on Desktop of Samuel — design, technology, productivity, and more.",
};

export default function TagListPage() {
  const longformCount = countPostsWithTag(LONGFORM_TAG);

  const topicPills = [
    {
      name: "Long form",
      path: `/tags/${LONGFORM_TAG}`,
      count: longformCount,
      curated: true,
    },
    ...allTags
      .filter((t) => t.path !== `/tags/${LONGFORM_TAG}`)
      .filter((t) => t.count > 1)
      .sort((a, b) => b.count - a.count)
      .map((t) => ({ ...t, curated: false })),
  ];

  return (
    <>
      <PageHero
        eyebrow="02 — Writing · Topics"
        title="Topics"
        description="Every topic I've written about. Click any pill to see the posts tagged under it."
      />

      {/* Topics */}
      <SidebarSection
        label="Topics"
        leftAside={
          <Link
            href="/blog"
            className="inline-block font-body text-sm text-foreground border-b border-border hover:border-foreground transition-colors no-underline w-fit"
          >
            ← Back to blog
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
