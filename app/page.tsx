import AppLayout from "@/components/AppLayout";
import Head from "next/head";
import AppListBlog from "@/components/AppListBlog";
import AppListPortfolio from "@/components/AppListPortfolio";
import AppCardBook from "@/components/AppCardBook";
import AppCardCurrentlyPlaying from "@/components/AppCardCurrentlyPlaying";
import AppCardMusic from "@/components/AppCardMusic";
import AppCardFilms from "@/components/AppCardFilms";
import AppLink from "@/components/AppLink";
import { ArrowRight } from "lucide-react";
import PhotoScrollGallery from "@/components/PhotoScrollGallery";
import { filteredPosts, filteredFeaturedWorks, filteredPhotos } from "@/lib/content";

export default function IndexPage() {
  // Get data directly in server component
  const posts = filteredPosts.slice(0, 4);
  const works = filteredFeaturedWorks.slice(0, 3);
  const photos = filteredPhotos.slice(0, 8);

  return (
    <AppLayout>
      <Head>
        <meta
          name="follow.it-verification-code"
          content="aYHmMlGswgxauPT7REPs"
        />
      </Head>

      {/* Hero Section */}
      <section className="h-screen place-content-center">
      <div className="flex flex-col md:flex-row justify-between items-baseline">
        <h1 className="text-4xl md:text-6xl font-bold font-heading tracking-tight leading-tight mb-6">
          Desktop of Samuel
        </h1>
      </div>
      <p className="text-muted-foreground text-lg leading-relaxed mb-10">
        Full-stack UI/UX designer crafting websites & mobile applications with
        bespoke experience.
      </p>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <AppCardBook />
        <AppCardMusic />
        <AppCardCurrentlyPlaying />
        <AppCardFilms />
      </div>
      </section>

      {/* Portfolio Section */}
      <div className="border-t border-muted pt-12 mt-12">
        <h2 className="text-2xl md:text-3xl font-bold font-heading leading-tight mb-4">
          Interaction and Experience Design
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-8 max-w-prose">
          Extensive experience delivering products in corporations and start-ups
        </p>

        <AppLink href="/work" className="btn btn-primary mb-8">
          View Process
        </AppLink>
        {works.map((post) => (
          <AppListPortfolio key={post.slug} data={post} />
        ))}
      </div>

      {/* Blog Section */}
      <div className="border-t border-muted pt-12 mt-12">
        <h2 className="text-2xl md:text-3xl font-bold font-heading leading-tight mb-4">
          Notes on Design & Technology
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-8 max-w-prose">
          I write about design, technology and productivity.
        </p>
        <AppLink href="/blog" className="btn btn-primary mb-8">
          Read my blog
        </AppLink>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {posts.map((post) => (
            <AppListBlog key={post.slug} data={post} />
          ))}
        </div>
      </div>

      {/* Tools Section
      <div className="border-t border-muted pt-12 mt-12">
        <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-4">
          Tools & Resources
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-8 max-w-prose">
          Best resources and tools I have been using. Guide on getting started
          in design & code.
        </p>
        <AppLink href="/resources" className="btn btn-primary mb-8">
          My awesome setup
        </AppLink>
      </div> */}

      {/* Photo Gallery Section */}
      <div className="border-t border-muted pt-12 mt-12 relative w-full overflow-hidden">
        <h2 className="text-2xl md:text-3xl font-bold font-heading leading-tight mb-4">
          Through the lens
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-8 max-w-prose">
          Sets of photos according to cities that I have visited.
        </p>
        <AppLink
          href="/photo"
          className="btn btn-primary mb-6 inline-flex items-center gap-2"
        >
          View all journeys
        </AppLink>
        <div className="rounded-xl overflow-hidden shadow-lg">
          <PhotoScrollGallery photos={photos} />
        </div>
      </div>
    </AppLayout>
  );
}
