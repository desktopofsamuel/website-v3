import type { Metadata } from "next";
import WalkChapter from "@/components/walks/WalkChapter";
import PageHero from "@/components/PageHero";
import type { WalkPhotoLayout } from "@/lib/walk-data";
import { getPublishedWalks } from "@/lib/walks";
import config from "@/config";

export const metadata: Metadata = {
  title: "Walks",
  description:
    "On foot, a little picky. Cities I’ve spent time in — the streets I’d send you down first.",
  openGraph: {
    title: "Walks",
    description:
      "On foot, a little picky. Cities I’ve spent time in — the streets I’d send you down first.",
    url: `${config.URL}/walks`,
  },
};

const CHAPTER_LAYOUT: WalkPhotoLayout[] = ["bleed", "spread", "split"];

export default function WalksPage() {
  const walks = getPublishedWalks();

  return (
    <div className="overflow-x-hidden">
      <PageHero
        eyebrow="On foot"
        title="Cities I'd walk you through."
        description="Not a map, and not every street. A few walks I keep sending people to."
      />

      {walks.length === 0 ? (
        <p className="px-page py-10 font-body text-muted-foreground">
          Walks are on the way.
        </p>
      ) : (
        walks.map((walk, index) => (
          <WalkChapter
            key={walk.slug}
            walk={walk}
            layout={CHAPTER_LAYOUT[index] ?? "bleed"}
          />
        ))
      )}
    </div>
  );
}
