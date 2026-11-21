import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
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
    title: `${walk.title} · Walks`,
    description: walk.description,
  };
}

export default async function WalkDetailPage({ params }: Props) {
  const { slug } = await params;
  const walk = getPublishedWalk(slug);
  if (!walk) return notFound();

  redirect(`/walks#${slug}`);
}
