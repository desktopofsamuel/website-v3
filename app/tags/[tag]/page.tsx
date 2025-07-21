import { Post } from "contentlayer/generated";
import AppLayout from "@/components/AppLayout";
import AppListBlogDetail from "@/components/AppListBlogDetail";
import { allTags, postsWithTag } from "@/lib/content";

// Generate static params for all tag pages
export async function generateStaticParams() {
  return allTags.map((tag) => ({
    tag: tag.path.replace('/tags/', '')
  }));
}

// Get data for specific tag page
async function getData(tag: string) {
  const posts: Post[] = postsWithTag(tag);
  return {
    posts,
    tag
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
    <AppLayout>
      <div className="mt-36">
        <div className="flex gap-2">
          <h1 className="font-heading text-5xl font-bold">{tag}</h1>
          <span className="text-md font-heading">({posts.length})</span>
        </div>
      </div>
      {posts?.map((post: Post) => (
        <AppListBlogDetail key={post.title} data={post} />
      ))}
    </AppLayout>
  );
}
