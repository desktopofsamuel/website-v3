import AppListBlogDetail from "@/components/AppListBlogDetail";
import { Link } from "@/components/AppLink";
import Pagination from "@/components/AppPagination";
import PageHero from "@/components/PageHero";
import SidebarSection from "@/components/SidebarSection";
import { filteredPosts } from "@/lib/content";
import { sortByDate } from "@/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { POSTS_PER_PAGE } from "@/config";

export const dynamicParams = false;

type Props = {
  params: Promise<{ page: string }>;
};

function assertValidBlogPageParam(page: string): number {
  if (!/^\d+$/.test(page)) notFound();
  const pageNum = parseInt(page, 10);
  const numPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  if (numPages === 0 || pageNum < 1 || pageNum > numPages) notFound();
  return pageNum;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params;
  const pageNum = assertValidBlogPageParam(page);
  const numPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  return {
    title: `All blog posts — ${pageNum} of ${numPages}`,
    description: `Page ${pageNum} of ${numPages} — every post on design, technology, and productivity.`,
  };
}

export async function generateStaticParams() {
  const numPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  return Array.from({ length: numPages }, (_, i) => ({
    page: (i + 1).toString(),
  }));
}

async function getData(page: number) {
  const pageIndex = page - 1;
  const posts = filteredPosts
    .sort(sortByDate)
    .slice(pageIndex * POSTS_PER_PAGE, (pageIndex + 1) * POSTS_PER_PAGE);
  const numPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  return { posts, numPages, currentPage: page };
}

export default async function BlogPaginatedPage({ params }: Props) {
  const { page } = await params;
  const pageNum = assertValidBlogPageParam(page);
  const { posts, numPages, currentPage } = await getData(pageNum);

  return (
    <>
      <PageHero
        eyebrow={`02 — Writing · Page ${currentPage} of ${numPages}`}
        title="All posts"
        description="Browse every post on design, technology, and productivity."
      />
      <SidebarSection
        label="Posts"
        leftAside={
          <Link
            href="/blog"
            className="inline-block font-body text-sm text-foreground border-b border-border hover:border-foreground transition-colors no-underline w-fit"
          >
            ← Back to blog
          </Link>
        }
      >
        <div className="divide-y divide-border/50">
          {posts.map((post) => (
            <AppListBlogDetail key={post.slug} data={post} />
          ))}
        </div>
        <div className="mt-12">
          <Pagination numPages={numPages} currentPage={currentPage} />
        </div>
      </SidebarSection>
    </>
  );
}
