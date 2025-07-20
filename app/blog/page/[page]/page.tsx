import AppLayout from "@/components/AppLayout";
import AppListBlog from "@/components/AppListBlog";
import AppLink from "@/components/AppLink";
import { allPosts, Post } from "contentlayer/generated";
import { sortByDate } from "@/utils";
import { Metadata } from "next";
import { POSTS_PER_PAGE } from "@/config";

type Props = {
  params: { page: string };
};

// Generate metadata for each page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = parseInt(params.page);
  const numPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  
  return {
    title: `All blog posts - ${page} of ${numPages}`,
    description: `Page ${page} of ${numPages} - Browse all blog posts about design, technology, and productivity.`,
  };
}

// Generate static params for all pages
export async function generateStaticParams() {
  const numPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  
  return Array.from({ length: numPages }, (_, i) => ({
    page: (i + 1).toString(),
  }));
}

// Get data for the specific page
async function getData(page: number) {
  const pageIndex = page - 1;
  const posts = allPosts
    .sort(sortByDate)
    .slice(pageIndex * POSTS_PER_PAGE, (pageIndex + 1) * POSTS_PER_PAGE);
  const numPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

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
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
          marginBottom: "48px"
        }}>
          {posts.map((post) => (
            <AppListBlog key={post.slug} data={post} />
          ))}
        </div>

        {/* Pagination */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "16px",
          marginTop: "48px"
        }}>
          {/* Previous Page */}
          {currentPage > 1 && (
            <AppLink 
              href={`/blog/page/${currentPage - 1}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "12px 16px",
                background: "#f1f3f4",
                color: "#333",
                textDecoration: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                transition: "background-color 0.2s ease"
              }}
            >
              ← Previous
            </AppLink>
          )}

          {/* Page Numbers */}
          <div style={{
            display: "flex",
            gap: "8px"
          }}>
            {Array.from({ length: numPages }, (_, i) => {
              const pageNum = i + 1;
              const isCurrentPage = pageNum === currentPage;
              
              return (
                <AppLink
                  key={pageNum}
                  href={`/blog/page/${pageNum}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40px",
                    height: "40px",
                    background: isCurrentPage ? "#0070f3" : "#f1f3f4",
                    color: isCurrentPage ? "white" : "#333",
                    textDecoration: "none",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    transition: "background-color 0.2s ease"
                  }}
                >
                  {pageNum}
                </AppLink>
              );
            })}
          </div>

          {/* Next Page */}
          {currentPage < numPages && (
            <AppLink 
              href={`/blog/page/${currentPage + 1}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "12px 16px",
                background: "#f1f3f4",
                color: "#333",
                textDecoration: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                transition: "background-color 0.2s ease"
              }}
            >
              Next →
            </AppLink>
          )}
        </div>

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