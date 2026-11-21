import type { Photo } from "contentlayer/generated";
import type { Walk } from "@/lib/walk-data";
import { parseGridItemsFromMdx } from "@/lib/photo-mdx-parser";

export type RecsPhoto = Pick<Photo, "slug" | "title" | "cover"> & {
  path?: string | null;
  tags?: string[] | null;
  body?: { raw: string };
  _raw?: { flattenedPath?: string };
};

export type WalkWithPhotos = {
  walk: Walk;
  cityPhotos: RecsPhoto[];
  cityPhotoSrcs: string[];
};

function fold(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function cityKeys(walk: Walk): string[] {
  const title = fold(walk.title);
  const slug = fold(walk.slug.replace(/-/g, " "));
  const compact = title.replace(/ /g, "");
  return [...new Set([title, slug, compact].filter((key) => key.length >= 3))];
}

function photoHaystack(photo: RecsPhoto): string {
  return fold(
    [
      photo.title,
      photo.slug.replace(/-/g, " "),
      photo.path ?? "",
      ...(photo.tags ?? []),
      photo._raw?.flattenedPath?.replace(/[-_/]/g, " ") ?? "",
    ].join(" ")
  );
}

export function photoMatchesWalk(photo: RecsPhoto, walk: Walk): boolean {
  const hay = ` ${photoHaystack(photo)} `;
  const compactHay = hay.replace(/ /g, "");
  return cityKeys(walk).some((key) => {
    if (hay.includes(` ${key} `)) return true;
    const compact = key.replace(/ /g, "");
    return compact.length >= 4 && compactHay.includes(compact);
  });
}

function chapterSrcs(photos: RecsPhoto[]): string[] {
  const srcs: string[] = [];
  for (const photo of photos) {
    if (photo.cover && !srcs.includes(photo.cover)) srcs.push(photo.cover);
    const raw = photo.body?.raw;
    if (!raw) continue;
    for (const item of parseGridItemsFromMdx(raw)) {
      if (item.src && !srcs.includes(item.src)) srcs.push(item.src);
    }
  }
  return srcs;
}

export function pairWalksWithPhotos(
  walks: Walk[],
  photos: RecsPhoto[]
): { chapters: WalkWithPhotos[]; leftoverPhotos: RecsPhoto[] } {
  const used = new Set<string>();
  const chapters = walks.map((walk) => {
    const cityPhotos = photos.filter(
      (photo) => !used.has(photo.slug) && photoMatchesWalk(photo, walk)
    );
    cityPhotos.forEach((photo) => used.add(photo.slug));
    return {
      walk,
      cityPhotos,
      cityPhotoSrcs: chapterSrcs(cityPhotos),
    };
  });

  return {
    chapters,
    leftoverPhotos: photos.filter((photo) => !used.has(photo.slug)),
  };
}
