import type { Metadata } from "next";
import { allPhotos } from "contentlayer/generated";
import { sortByDate } from "@/utils";
import config from "@/config";
import {
  PhotoIndexCards,
  PhotoLayoutSwitch,
  parsePhotoCardLayout,
} from "@/components/photo/PhotoIndexCards";

export const metadata: Metadata = {
  title: "Photography | Desktop of Samuel",
  description:
    "Travel photography from cities around the world. Sets of photos organized by location.",
  openGraph: {
    title: "Photography | Desktop of Samuel",
    description:
      "Travel photography from cities around the world. Sets of photos organized by location.",
    url: `${config.URL}/photo`,
  },
};

export default async function PhotoListPage({
  searchParams,
}: {
  searchParams: Promise<{ layout?: string }>;
}) {
  const { layout: layoutParam } = await searchParams;
  const layout = parsePhotoCardLayout(layoutParam);
  const photos = allPhotos.filter((p) => !p.draft).sort(sortByDate);

  return (
    <div className="overflow-x-hidden">
      <header className="px-6 md:px-10 pt-20 md:pt-40 pb-10 md:pb-16">
        <p className="font-eyebrow text-muted-foreground mb-6">
          Photography
        </p>
        <h1 className="font-heading text-4xl md:text-5xl text-foreground">
          Photography
        </h1>
        <p className="mt-8 max-w-[55ch] font-body text-lg text-muted-foreground">
          Inspired by cities and stories within. Collections of travel
          photographs organized by location.
        </p>
        <PhotoLayoutSwitch current={layout} />
      </header>

      <PhotoIndexCards photos={photos} layout={layout} />
    </div>
  );
}
