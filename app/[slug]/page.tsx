import { allPosts, Post } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import BlogLayout from "@/components/BlogLayout";
import PageLayout from "@/components/PageLayout";

type Props = {
  params: Promise<{ slug: string }>;
};

// Generate metadata for each post
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = allPosts.find((post) => post.slug === slug);

  if (!post || post.draft) {
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

// Generate static params for all posts (excluding drafts)
export async function generateStaticParams() {
  return allPosts
    .filter((post) => !post.draft)
    .map((post) => ({
      slug: post.slug,
    }));
}

// Get data for the specific post
async function getData(slug: string) {
  const post = allPosts.find((post) => post.slug === slug);

  if (!post || post.draft) {
    notFound();
  }

  // Only get related posts for blog posts (not pages)
  let relatedPosts: Post[] = [];
  
  if (!post.page) {
    // Get up to 2 posts that share the same tag as the current post
    relatedPosts = allPosts
      .filter((p) => {
        const hasSharedTag = p.tags.some((tag) => post.tags.includes(tag));
        return hasSharedTag && p.slug !== post.slug && !p.page && !p.draft; // Exclude pages and drafts from related posts
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
        .filter((p) => p.category === post.category && p.slug !== post.slug && !p.page && !p.draft)
        .slice(0, 2);
    }
  }

  return {
    post,
    relatedPosts,
  };
}

export default async function SinglePostPage({ params }: Props) {
  const { slug } = await params;
  const { post, relatedPosts } = await getData(slug);

  // Use PageLayout if post.page is true, otherwise use BlogLayout
  if (post.page) {
    return <PageLayout post={post} />;
  }

  return <BlogLayout post={post} relatedPosts={relatedPosts} />;
}