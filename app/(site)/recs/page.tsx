import type { Metadata } from "next";
import { allPhotos } from "contentlayer/generated";
import WalkChapter from "@/components/walks/WalkChapter";
import { PhotoIndexCards } from "@/components/photo/PhotoIndexCards";
import type { WalkPhotoLayout } from "@/lib/walk-data";
import { pairWalksWithPhotos } from "@/lib/recs";
import { getPublishedWalks } from "@/lib/walks";
import { sortByDate } from "@/utils";
import config from "@/config";

export const metadata: Metadata = {
  title: "Recs",
  description:
    "Walks through cities I’d send you down first, with photographs from the same streets when I have them.",
  openGraph: {
    title: "Recs",
    description:
      "Walks through cities I’d send you down first, with photographs from the same streets when I have them.",
    url: `${config.URL}/recs`,
  },
};

const CHAPTER_LAYOUT: WalkPhotoLayout[] = ["bleed", "spread", "split"];

export default function RecsPage() {
  const walks = getPublishedWalks();
  const photos = allPhotos.filter((photo) => !photo.draft).sort(sortByDate);
  const { chapters, leftoverPhotos } = pairWalksWithPhotos(walks, photos);

  return (
    <div className="overflow-x-hidden">
      <header className="px-6 md:px-10 pt-20 md:pt-40 pb-20 md:pb-40">
        <p className="font-eyebrow text-muted-foreground mb-6">
          Recs
        </p>
        <h1 className="font-heading text-4xl md:text-5xl text-foreground max-w-[18ch] text-pretty">
          Cities I&apos;d walk you through.
        </h1>
        <p className="mt-8 max-w-[56ch] font-body text-lg text-muted-foreground text-pretty">
          Walks I keep sending people to. If I have a photo set from that city,
          it sits with the walk. Everything else is below.
        </p>
      </header>

      {chapters.length === 0 ? (
        <p className="px-6 md:px-10 py-10 font-body text-muted-foreground">
          Walks are on the way.
        </p>
      ) : (
        chapters.map(({ walk, cityPhotoSrcs }, index) => (
          <WalkChapter
            key={walk.slug}
            walk={walk}
            layout={CHAPTER_LAYOUT[index] ?? "bleed"}
            cityPhotos={cityPhotoSrcs}
          />
        ))
      )}

      {leftoverPhotos.length > 0 ? (
        <section className="border-t border-border">
          <header className="px-6 md:px-10 pt-20 md:pt-40 pb-10 md:pb-16">
            <p className="font-eyebrow text-muted-foreground mb-6">
              Photographs
            </p>
            <h2 className="font-heading text-4xl md:text-5xl text-foreground max-w-[18ch] text-pretty">
              Cities I haven&apos;t walked you through yet.
            </h2>
          </header>
          <PhotoIndexCards photos={leftoverPhotos} layout="spine" />
        </section>
      ) : null}
    </div>
  );
}
