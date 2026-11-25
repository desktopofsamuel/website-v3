import type { Metadata } from "next";
import { allPhotos } from "contentlayer/generated";
import WalkChapter from "@/components/walks/WalkChapter";
import { PhotoIndexCards } from "@/components/photo/PhotoIndexCards";
import PageHero from "@/components/PageHero";
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
      <PageHero
        eyebrow="Recs"
        title="Cities I'd walk you through."
        description="Walks I keep sending people to. If I have a photo set from that city, it sits with the walk. Everything else is below."
      />

      {chapters.length === 0 ? (
        <p className="px-page py-10 font-body text-muted-foreground">
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
        <section>
          <header className="mx-divider px-overhang pt-16 pb-12 border-b border-border">
            <p className="font-eyebrow text-muted-foreground mb-6">
              Photographs
            </p>
            <h2 className="font-heading text-4xl md:text-5xl text-foreground">
              Cities I haven&apos;t walked you through yet.
            </h2>
          </header>
          <PhotoIndexCards photos={leftoverPhotos} layout="spine" />
        </section>
      ) : null}
    </div>
  );
}
