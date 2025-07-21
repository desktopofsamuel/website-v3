import { allPosts, Post } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import AppListBlog from "@/components/AppListBlog";
import AppLayout from "@/components/AppLayout";
import { getHeadings } from "../../utils/getHeadings";
import ScrollspyNav from "./ScrollspyNav";
import ScrollToTop from "./ScrollToTop";
import slugger from "github-slugger";
import kebabCase from "lodash.kebabcase";
import { POSTS_PER_PAGE } from "@/config";
import MDXContent from "@/components/mdx-components";

type Props = {
  params: Promise<{ slug: string }>;
};

// Generate metadata for each post
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = allPosts.find((post) => post.slug === slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested post could not be found.",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: ["Samuel W."],
      images: post.cover ? [post.cover] : [],
    },
  };
}

// Generate static params for all posts
export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }));
}

// Get data for the specific post
async function getData(slug: string) {
  const post = allPosts.find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  // Get up to 2 posts that share the same tag as the current post
  let relatedPosts = allPosts
    .filter((p) => {
      const hasSharedTag = p.tags.some((tag) => post.tags.includes(tag));
      return hasSharedTag && p.slug !== post.slug;
    })
    .sort((a, b) => {
      // Sort related posts by the order of the tags in the current post
      const aIndex = post.tags.findIndex((tag) => a.tags.includes(tag));
      const bIndex = post.tags.findIndex((tag) => b.tags.includes(tag));
      return aIndex - bIndex;
    })
    .slice(0, 2);

  // If no related posts found, then find posts in the same category
  if (relatedPosts.length === 0) {
    relatedPosts = allPosts
      .filter((p) => p.category === post.category && p.slug !== post.slug)
      .slice(0, 2);
  }

  return {
    post,
    relatedPosts,
  };
}

export default async function SinglePostPage({ params }: Props) {
  const { slug } = await params;
  const { post, relatedPosts } = await getData(slug);
  const headings = getHeadings(post.body.raw);

  return (
    <AppLayout>
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Article Header */}
        <article className="prose prose-lg max-w-none">
          <div className="mb-8">
            <div className="inline-block">
              <span className="text-sm font-medium text-blue-600">
                {post.category}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mt-2 mb-4">
              {post.title}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              {post.tldr}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500 border-t border-gray-200 pt-4">
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
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Read more</h2>
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
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Back to Blog
          </Link>
        </div>
      </div>
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
    </AppLayout>
  );
}
