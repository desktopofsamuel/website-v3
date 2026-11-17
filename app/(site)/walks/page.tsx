import type { Metadata } from "next";
import Link from "@/components/AppLink";
import PageHero from "@/components/PageHero";
import WalkMedia from "@/components/walks/WalkMedia";
import { getPublishedWalks } from "@/lib/walks";
import config from "@/config";

export const metadata: Metadata = {
  title: "City Walk",
  description:
    "A collection of walks through cities I’ve spent time in.",
  openGraph: {
    title: "City Walk",
    description: "A collection of walks through cities I’ve spent time in.",
    url: `${config.URL}/walks`,
  },
};

export default function WalksPage() {
  const walks = getPublishedWalks();

  return (
    <>
      <PageHero
        eyebrow="05 — Walks"
        title="City Walk"
        description="A collection of walks through cities I’ve spent time in."
      />

      <div className="mx-divider px-overhang py-16 border-b border-border">
        {walks.length === 0 ? (
          <p className="font-body text-muted-foreground">Walks are on the way.</p>
        ) : (
          <div className="-mx-overhang px-overhang flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2">
            {walks.map((walk) => (
              <Link
                key={walk.slug}
                href={`/walks/${walk.slug}`}
                className="group snap-start shrink-0 w-[min(72vw,18rem)] no-underline text-inherit"
              >
                <p className="font-body text-sm mb-3 text-foreground">{walk.title}</p>
                <div className="aspect-square w-full bg-lift border border-border overflow-hidden">
                  <WalkMedia
                    src={walk.cover}
                    alt=""
                    className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-80"
                  />
                </div>
                <p className="mt-4 font-body text-sm text-foreground">
                  → Let’s walk
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
