import type { Metadata } from "next";
import WalkChapter from "@/components/walks/WalkChapter";
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
      <header className="px-6 md:px-10 pt-20 md:pt-40 pb-20 md:pb-40">
        <p className="font-eyebrow text-muted-foreground mb-6">
          On foot
        </p>
        <h1 className="font-heading text-4xl md:text-5xl text-foreground max-w-[18ch] text-pretty">
          Cities I&apos;d walk you through.
        </h1>
        <p className="mt-8 max-w-[56ch] font-body text-lg text-muted-foreground text-pretty">
          Not a map, and not every street. A few walks I keep sending people to.
        </p>
      </header>

      {walks.length === 0 ? (
        <p className="px-6 md:px-10 py-10 font-body text-muted-foreground">
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
