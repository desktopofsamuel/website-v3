import { allPhotos } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import dayjs from "dayjs";
import AppLayout from "@/components/AppLayout";
import PhotoPostGallery from "@/components/PhotoPostGallery";
import type { LightboxItem } from "@/components/Lightbox";

type Props = {
  params: Promise<{ slug: string }>;
};

// Generate metadata for each photo
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = allPhotos.find((post) => post.slug === slug);

  if (!post || post.draft) {
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
  return allPhotos
    .filter((post) => !post.draft)
    .map((post) => ({ slug: post.slug }));
}

/** Extract every markdown image (![alt](src)) from the raw body, in document order. */
function extractImages(raw: string): LightboxItem[] {
  const matches = [...raw.matchAll(/!\[([^\]]*)\]\(([^)\s]+)/g)];
  return matches.map((m) => ({ src: m[2].trim(), alt: m[1].trim() }));
}

export default async function SinglePhotoPage({ params }: Props) {
  const { slug } = await params;
  const post = allPhotos.find((post) => post.slug === slug);

  if (!post || post.draft) {
    notFound();
  }

  const items = extractImages(post.body.raw);

  return (
    <AppLayout>
      <article className="max-w-4xl mx-auto px-page py-12">
        <header className="mb-10 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
            {dayjs(post.date).format("MMM D, YYYY")}
          </p>
          <h1 className="font-body font-normal text-4xl md:text-6xl tracking-tighter leading-none text-foreground">
            {post.title}
          </h1>
        </header>

        <section>
          <PhotoPostGallery items={items} code={post.body.code} />
        </section>
      </article>
    </AppLayout>
  );
}
