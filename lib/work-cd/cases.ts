import type { DummyAlbum } from "@/lib/work-cd/albums";
import { DUMMY_ALBUMS } from "@/lib/work-cd/albums";

export type WorkCaseItem = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  album: DummyAlbum;
};

const ALBUM_BY_SLUG: Record<string, DummyAlbum["id"]> = {
  "web-3-design-pal": "joysip",
  hsbc: "hsbc",
  "hyperair-fx": "fx",
  "building-hong-kongs-first-water-dispenser-map": "wff",
  "okx-shark-fin": "okx",
};

export function albumForWork(
  work: { slug: string; title: string; subtitle: string; year: string },
  index: number,
): DummyAlbum {
  const id = ALBUM_BY_SLUG[work.slug];
  const mapped = DUMMY_ALBUMS.find((album) => album.id === id);
  if (mapped) return mapped;
  const palette = DUMMY_ALBUMS[index % DUMMY_ALBUMS.length];
  return {
    id: work.slug,
    title: work.subtitle || work.title,
    sub: work.year,
    year: work.year.slice(0, 4),
    a: palette.a,
    b: palette.b,
    ink: palette.ink,
    tracks: palette.tracks,
  };
}
