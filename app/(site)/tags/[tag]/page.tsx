import { Post } from "contentlayer/generated";
import AppListBlogDetail from "@/components/AppListBlogDetail";
import PageHero from "@/components/PageHero";
import SidebarSection from "@/components/SidebarSection";
import { Link } from "@/components/AppLink";
import { allTags, postsWithTag } from "@/lib/content";

// Generate static params for all tag pages
export async function generateStaticParams() {
  return allTags.map((tag) => ({
    tag: tag.path.replace("/tags/", ""),
  }));
}

// Get data for specific tag page
async function getData(tag: string) {
  const posts: Post[] = postsWithTag(tag);
  return {
    posts,
    tag,
  };
}

type Params = { tag: string };

type TagPageProps = {
  params: Promise<Params>;
};

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const { posts } = await getData(tag);

  return (
    <>
      <PageHero
        title={
          <>
            {tag}
            <sup className="ml-3 align-super font-body text-2xl md:text-3xl text-muted-foreground tracking-normal">
              ({posts.length})
            </sup>
          </>
        }
      />
      <SidebarSection
        label="Posts"
        leftAside={
          <Link
            href="/tags"
            className="inline-block font-body text-sm text-foreground border-b border-border hover:border-foreground transition-colors no-underline w-fit"
          >
            ← Back to topics
          </Link>
        }
      >
        <div className="divide-y divide-border/50">
          {posts.map((post: Post) => (
            <AppListBlogDetail key={post.title} data={post} />
          ))}
        </div>
      </SidebarSection>
    </>
  );
}
