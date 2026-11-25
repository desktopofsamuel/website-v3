import type { Metadata } from "next";
import { allPhotos } from "contentlayer/generated";
import { sortByDate } from "@/utils";
import config from "@/config";
import PageHero from "@/components/PageHero";
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
      <PageHero
        eyebrow="Photography"
        title="Photography"
        description="Inspired by cities and stories within. Collections of travel photographs organized by location."
      >
        <PhotoLayoutSwitch current={layout} />
      </PageHero>

      <PhotoIndexCards photos={photos} layout={layout} />
    </div>
  );
}
