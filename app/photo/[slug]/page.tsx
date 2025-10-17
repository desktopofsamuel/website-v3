import { allPhotos } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import dayjs from "dayjs";
import AppLayout from "@/components/AppLayout";
import MDXContent from "@/components/mdx-components";

type Props = {
  params: Promise<{ slug: string }>;
};

// Generate metadata for each photo
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = allPhotos.find((post) => post.slug === slug);

  if (!post) {
    return {
      title: "Photo Not Found",
      description: "The requested photo could not be found.",
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

// Generate static params for all photos
export async function generateStaticParams() {
  return allPhotos.map((post) => ({
    slug: post.slug,
  }));
}


export default async function SinglePhotoPage({ params }: Props) {
  const { slug } = await params;
  const post = allPhotos.find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <AppLayout>
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="font-heading text-4xl font-bold mb-4">{post.title}</h1>
          <p className="text-sm text-secondarytext">
            {dayjs(post.date).format("MMM DD, YYYY")}
          </p>
        </header>

        {/* Photo Content */}
        <section className="mb-8">
          <MDXContent code={post.body.code} />
        </section>
      </article>
    </AppLayout>
  );
}