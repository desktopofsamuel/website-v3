import type { Metadata } from "next";
import { allWorks } from "contentlayer/generated";
import { notFound } from "next/navigation";
import WorkCdArticle from "@/components/work-cd/WorkCdArticle";
import WorkCdDetailMotion from "@/components/work-cd/WorkCdDetailMotion";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = allWorks.find((item) => item.slug === slug);
  if (!post || post.draft) return { title: "Work Not Found", robots: { index: false, follow: false } };
  return {
    title: post.title,
    description: post.description,
    robots: { index: false, follow: false },
  };
}

export function generateStaticParams() {
  return allWorks.filter((post) => !post.draft).map((post) => ({ slug: post.slug }));
}

export default async function WorkCdDetailPage({ params }: Props) {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const { slug } = await params;
  const post = allWorks.find((item) => item.slug === slug);
  if (!post || post.draft) return notFound();

  return (
    <WorkCdDetailMotion>
      <WorkCdArticle
        title={post.title}
        description={post.description}
        cover={post.cover}
        role={post.role}
        tags={post.tags}
        year={post.year}
        platform={post.platform}
        date={post.date}
        code={post.body.code}
      />
    </WorkCdDetailMotion>
  );
}
