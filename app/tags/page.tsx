import AppLayout from "@/components/AppLayout";
import SidebarSection from "@/components/SidebarSection";
import { Link } from "@/components/AppLink";
import { allTags, filteredPosts } from "@/lib/content";
import type { Metadata } from "next";

const LONGFORM_TAG = "longform";

export const metadata: Metadata = {
  title: "All Topics",
  description:
    "Browse every topic covered on Desktop of Samuel — design, technology, productivity, and more.",
};

export default function TagListPage() {
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
      .filter((t) => t.count > 1)
      .sort((a, b) => b.count - a.count)
      .map((t) => ({ ...t, curated: false })),
  ];

  return (
    <AppLayout>
      {/* Hero */}
      <div className="mx-divider px-overhang pt-16 pb-12 border-b border-border">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6">
          02 — Writing · Topics
        </p>
        <h1 className="font-body font-normal text-6xl md:text-8xl tracking-tighter leading-none text-foreground">
          Topics
        </h1>
        <p className="mt-8 max-w-[55ch] font-body text-base leading-relaxed text-muted-foreground">
          Every topic I&apos;ve written about. Click any pill to see the posts
          tagged under it.
        </p>
      </div>

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
    </AppLayout>
  );
}
