import AppLink from "@/components/AppLink";
import AppListBlog from "@/components/AppListBlog";
import AppListBlogDetail from "@/components/AppListBlogDetail";
import AppLayout from "@/components/AppLayout";
import { allPosts, Post } from "contentlayer/generated";
import { sortByDate } from "@/utils";
import { Button } from "@/components/ui/button"

// This would be the equivalent of getStaticProps in App Router
async function getData() {
  return {
    posts: allPosts,
  };
}

export default async function BlogPage() {
  const { posts } = await getData();

  return (
    <AppLayout>
      <div className="py-8 font-body">
        {/* Header Section */}
        <div className="mb-8 flex flex-col">
          <h1 className="mb-4 text-6xl font-bold leading-tight font-heading">
            Blog
          </h1>
          <p className="text-lg text-secondarytext leading-normal">
            A collection of posts I wrote about design process, technology and productivity.
          </p>
        </div>

        {/* Featured Posts Section */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-secondarytext font-heading">
            Featured posts
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts
              .filter((post) => post.feature === true)
              .sort(sortByDate)
              .map((post) => (
                <AppListBlog key={post.slug} data={post} />
              ))}
          </div>
        </section>

        {/* All Posts Section */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-secondarytext font-heading">
            All posts
          </h2>
          
          <div className="flex flex-col space-y-8">
            {posts
              .filter((post) => post.feature !== true)
              .sort(sortByDate)
              .slice(0, 6)
              .map((post) => (
                <AppListBlogDetail key={post.slug} data={post} />
              ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild>
            <AppLink 
              href="/blog/page/2" 
              >
              View More
            </AppLink></Button>
          </div>
        </section>
      </div>
    </AppLayout>
  );
} 