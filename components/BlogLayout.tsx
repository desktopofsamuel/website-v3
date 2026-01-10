import { Post } from "contentlayer/generated";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import AppListBlog from "@/components/AppListBlog";
import AppLayout from "@/components/AppLayout";
import { getHeadings } from "../utils/getHeadings";
import ScrollspyNav from "../app/[slug]/ScrollspyNav";
import ScrollToTop from "../app/[slug]/ScrollToTop";
import kebabCase from "lodash.kebabcase";
import MDXContent from "@/components/mdx-components";

interface BlogLayoutProps {
  post: Post;
  relatedPosts: Post[];
}

export default function BlogLayout({ post, relatedPosts }: BlogLayoutProps) {
  const headings = getHeadings(post.body.raw);

  return (
    <AppLayout>
      <div className="min-h-screen">
        {/* Main Content */}
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Article Header */}
          <article className="prose max-w-none">
            <div className="mb-8">
              <div className="inline-block">
                <span className="text-sm font-heading font-medium text-slate-400">
                  {post.category}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-heading leading-tight text-foreground mt-2 mb-4">
                {post.title}
              </h1>
              <p className="text-xl leading-relaxed text-secondarytext mb-6">
                {post.tldr}
              </p>
              <div className="flex items-center font-heading gap-2 text-sm text-gray-500">
                <span>{dayjs(post.date).format("MMMM DD, YYYY")}</span>
                <span>·</span>
                <span>{post.timetoread} min read</span>
              </div>
            </div>

            {/* Cover Image */}
            {post.cover && (
              <div className="mb-8">
                <Image
                  src={post.cover}
                  alt={post.title}
                  width={800}
                  height={400}
                  className="w-full h-auto rounded-lg"
                  priority
                />
              </div>
            )}

            {/* Article Content */}
            <MDXContent code={post.body.code} />

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-8">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${kebabCase(tag)}`}
                  className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </article>

          {/* Table of Contents */}
          {headings.length > 0 && <ScrollspyNav headings={headings} />}

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border ">
              <h2 className="text-2xl font-bold text-foreground font-heading mb-6">Read more</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <AppListBlog key={relatedPost.slug} data={relatedPost} small />
                ))}
              </div>
            </div>
          )}

          {/* Back to Blog */}
          <div className="mt-8 text-center">
            <Link
              href="/blog"
              className="inline-block text-black px-6 py-3 rounded-lg font-medium transition-colors"
            >
              ↖ More articles
            </Link>
          </div>
        </div>
        
        {/* Scroll to Top Button */}
        <ScrollToTop />
      </div>
    </AppLayout>
  );
}