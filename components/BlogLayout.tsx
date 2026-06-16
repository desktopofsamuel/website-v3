import { Post } from "contentlayer/generated";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import AppListBlog from "@/components/AppListBlog";
import AppNavBar from "@/components/AppNavBar";
import AppFooter from "@/components/AppFooter";
import ScrollspyNav from "../app/[slug]/ScrollspyNav";
import ScrollToTop from "../app/[slug]/ScrollToTop";
import kebabCase from "lodash.kebabcase";
import BlogMDXContent from "@/components/BlogMDXContent";

interface BlogLayoutProps {
  post: Post;
  relatedPosts: Post[];
}

export default function BlogLayout({ post, relatedPosts }: BlogLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppNavBar />

      <main className="flex-1">
        {/* Narrow reading column */}
        <div className="max-w-2xl mx-auto px-6 py-12">
          {/* Cover image */}
          {post.cover && (
            <div className="not-prose block my-8 -mx-8 sm:-mx-16 md:-mx-24">
              <Image
                src={post.cover}
                alt={post.title}
                width={800}
                height={400}
                className="w-full h-auto rounded-md"
                priority
              />
            </div>
          )}

          {/* Article header */}
          <header className="mb-10">
            {post.category && (
              <span className="text-xs font-heading font-medium text-muted-foreground uppercase tracking-widest">
                {post.category}
              </span>
            )}
            <h1 className="text-2xl md:text-3xl font-bold font-heading leading-snug text-foreground mt-2 mb-3">
              {post.title}
            </h1>
            {post.tldr && (
              <p className="text-sm leading-relaxed text-secondarytext mb-4">
                {post.tldr}
              </p>
            )}
            <div className="flex items-center font-heading gap-2 text-xs text-muted-foreground">
              <span>{dayjs(post.date).format("MMMM DD, YYYY")}</span>
              <span>·</span>
              <span>{post.timetoread} min read</span>
            </div>
          </header>

          {/* MDX body */}
          <BlogMDXContent code={post.body.code} />
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-border">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${kebabCase(tag)}`}
                  className="inline-block px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-mono hover:bg-accent transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border">
              <h2 className="text-base font-bold text-foreground font-heading mb-6">Read more</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <AppListBlog key={relatedPost.slug} data={relatedPost} small />
                ))}
              </div>
            </div>
          )}

          {/* Back to blog */}
          <div className="mt-10">
            <Link
              href="/blog"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ↖ More articles
            </Link>
          </div>
        </div>
      </main>

      <AppFooter />

      <ScrollspyNav />
      <ScrollToTop />
    </div>
  );
}