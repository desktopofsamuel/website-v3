import { Post } from "contentlayer/generated";
import dayjs from "dayjs";
import Image from "next/image";
import AppLayout from "@/components/AppLayout";
import MDXContent from "@/components/mdx-components";
import { getHeadings } from "../utils/getHeadings";
import ScrollspyNav from "../app/[slug]/ScrollspyNav";

interface PageLayoutProps {
  post: Post;
}

export default function PageLayout({ post }: PageLayoutProps) {
  const headings = getHeadings(post.body.raw);

  return (
    <AppLayout>
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Page Header - Simplified compared to blog layout */}
          <header className="my-8 text-center">
            <h1 className="mb-4 text-4xl md:text-6xl font-bold leading-tight font-heading">
              {post.title}
            </h1>

            {post.tldr && (
              <p className="text-lg text-secondarytext leading-normal">
                {post.tldr}
              </p>
            )}
          </header>

          {/* Page Content */}
          <div className="prose prose-lg">
            <MDXContent code={post.body.code} />
          </div>

          {/* Table of Contents */}
          {headings.length > 0 && <ScrollspyNav headings={headings} />}

          {/* Optional footer info for pages */}
          {post.date && (
            <div className="mt-12 pt-8 border-t border-gray-200 text-sm font-heading text-secondarytext">
              Last updated on {dayjs(post.date).format("MMMM DD, YYYY")}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
