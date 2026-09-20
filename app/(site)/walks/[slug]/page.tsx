import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WalkExperience from "@/components/walks/WalkExperience";
import { getPublishedWalk, getPublishedWalks } from "@/lib/walks";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPublishedWalks().map((walk) => ({ slug: walk.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const walk = getPublishedWalk(slug);
  if (!walk) {
    return { title: "Walk not found" };
  }

  return {
    title: `${walk.title} · City Walk`,
    description: walk.description,
    openGraph: {
      title: `${walk.title} · City Walk`,
      description: walk.description,
      images: walk.cover ? [walk.cover] : [],
    },
  };
}

export default async function WalkDetailPage({ params }: Props) {
  const { slug } = await params;
  const walk = getPublishedWalk(slug);
  if (!walk) return notFound();

  return <WalkExperience walk={walk} />;
}
