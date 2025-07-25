import AppLayout from "@/components/AppLayout";
import AppListBlog from "@/components/AppListBlog";
import AppLink from "@/components/AppLink";
import Pagination from "@/components/AppPagination";
import { Post } from "contentlayer/generated";
import { filteredPosts } from "@/lib/content";
import { sortByDate } from "@/utils";
import { Metadata } from "next";
import { POSTS_PER_PAGE } from "@/config";

type Props = {
  params: Promise<{ page: string }>;
};

// Generate metadata for each page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params;
  const pageNum = parseInt(page);
  const numPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  
  return {
    title: `All blog posts - ${pageNum} of ${numPages}`,
    description: `Page ${pageNum} of ${numPages} - Browse all blog posts about design, technology, and productivity.`,
  };
}

// Generate static params for all pages
export async function generateStaticParams() {
  const numPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  
  return Array.from({ length: numPages }, (_, i) => ({
    page: (i + 1).toString(),
  }));
}

// Get data for the specific page
async function getData(page: number) {
  const pageIndex = page - 1;
  const posts = filteredPosts
    .sort(sortByDate)
    .slice(pageIndex * POSTS_PER_PAGE, (pageIndex + 1) * POSTS_PER_PAGE);
  const numPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  return {
    posts,
    numPages,
    currentPage: page,
  };
}

export default async function BlogPaginatedPage({ params }: Props) {
  const { page } = await params;
  const pageNum = parseInt(page);
  const { posts, numPages, currentPage } = await getData(pageNum);

  return (
    <AppLayout>
      <div style={{ 
        padding: "32px 0",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "32px"
        }}>
          <h1 style={{
            fontSize: "48px",
            fontWeight: "bold",
            margin: "0 0 16px 0",
            lineHeight: "1.2"
          }}>
            All blog posts - {currentPage} of {numPages}
          </h1>
          <p style={{
            fontSize: "18px",
            color: "#666",
            margin: 0,
            lineHeight: "1.6"
          }}>
            Browse all posts about design, technology, and productivity.
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post) => (
            <AppListBlog key={post.slug} data={post} />
          ))}
        </div>

        {/* Pagination */}
        <Pagination numPages={numPages} currentPage={currentPage} />

        {/* Back to Blog */}
        <div style={{
          textAlign: "center",
          marginTop: "32px"
        }}>
          <AppLink 
            href="/blog"
            style={{
              display: "inline-block",
              background: "#0070f3",
              color: "white",
              padding: "12px 24px",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "bold"
            }}
          >
            Back to Blog
          </AppLink>
        </div>
      </div>
    </AppLayout>
  );
} 