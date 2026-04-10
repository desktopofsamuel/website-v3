import type { Metadata } from "next";
import { allWorks } from "contentlayer/generated";
import { notFound } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import MDXContent from "@/components/mdx-components";
import NextPrev from "@/components/NextPrev";
import Image from "next/image";
import dayjs from "dayjs";
import CONFIG from "@/../config";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = allWorks.find((p) => p.slug === slug);
  if (!post) return { title: "Work Not Found" };
  return {
    title: `${post.title} | Desktop of Samuel`,
    description: post.description,
    openGraph: {
      title: `${post.title} | Desktop of Samuel`,
      description: post.description,
      url: `${CONFIG.URL}/work/${slug}`,
      images: post.cover ? [post.cover] : [],
    },
  };
}

export async function generateStaticParams() {
  return allWorks.map((post) => ({ slug: post.slug }));
}

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = allWorks.find((post) => post.slug === slug);
  if (!post) return notFound();

  // Only featured, non-draft works for prev/next
  const filteredWorks = allWorks
    .filter((work) => work.feature === true && work.draft !== true)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const currentIndex = filteredWorks.findIndex((p) => p.slug === slug);
  const nextPost = currentIndex < filteredWorks.length - 1 ? filteredWorks[currentIndex + 1] : null;
  const prevPost = currentIndex > 0 ? filteredWorks[currentIndex - 1] : null;

  return (
    <AppLayout>
      <article className="max-w-2xl mx-auto">
        <header className="mb-8 flex flex-col gap-4 items-center">
          <h1 className="font-heading text-4xl font-bold text-center">{post.title}</h1>
          <p className="text-lg text-secondarytexttext text-center">{post.description}</p>
          {post.cover && (
            <div className="w-full my-6 rounded-lg overflow-hidden">
              <Image
                src={post.cover}
                alt={post.title}
                width={1200}
                height={800}
                className="w-full h-auto object-contain rounded-lg"
                priority
              />
            </div>
          )}
        </header>
        <section className="mb-8">
          <MDXContent code={post.body.code} />
        </section>
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="text-secondarytext text-sm mb-1">Role</div>
            <div className="font-heading text-2xl">{post.role}</div>
          </div>
          <div>
            <div className="text-secondarytext text-sm mb-1">Industry</div>
            <div className="font-heading text-2xl">{post.tags?.join(", ")}</div>
          </div>
          {post.year && (
            <div>
              <div className="text-secondarytext text-sm mb-1">Timeframe</div>
              <div className="font-heading text-2xl">{post.year}</div>
            </div>
          )}
          {post.platform && (
            <div>
              <div className="text-secondarytext text-sm mb-1">Platforms</div>
              <div className="font-heading text-2xl">{post.platform}</div>
            </div>
          )}
        </section>
        <div className="text-secondarytext text-sm mt-12 mb-8 text-center">
          Last update on {dayjs(post.date).format("MMM DD, YYYY")}
        </div>
        <NextPrev nextPost={nextPost!} prevPost={prevPost!} />
      </article>
    </AppLayout>
  );
}
