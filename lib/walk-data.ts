export type WalkLineString = {
  type: "LineString";
  coordinates: [number, number][];
};

export type WalkStop = {
  id: string;
  title: string;
  description: string;
  illustration: string;
  lat: number;
  lng: number;
  mapsUrl?: string;
};

export type Walk = {
  slug: string;
  title: string;
  description: string;
  cover: string;
  footnote?: string;
  draft?: boolean;
  showRoute?: boolean;
  route?: WalkLineString;
  stops: WalkStop[];
};

export type WalkRecord = Omit<Walk, "slug">;

export function stopMapsUrl(stop: WalkStop): string {
  return stop.mapsUrl ?? `https://www.google.com/maps?q=${stop.lat},${stop.lng}`;
}

const PHOTO_EXT = /\.(jpe?g|png|webp)$/i;

/** Shanghai JPGs stand in until other cities have their own photographs. */
const DUMMY_WALK_PHOTOS = [
  "/static/walks/shanghai/postal-museum.jpg",
  "/static/walks/shanghai/nanjing-road.jpg",
];

export type WalkPhotoLayout = "bleed" | "spread" | "split";

export function walkOwnPhotos(walk: Walk): string[] {
  const fromStops = walk.stops
    .map((stop) => stop.illustration)
    .filter((src) => PHOTO_EXT.test(src));
  if (fromStops.length) return fromStops;
  if (PHOTO_EXT.test(walk.cover)) return [walk.cover];
  return [];
}

export function walkChapterPhotos(
  walk: Walk,
  layout: WalkPhotoLayout,
  cityPhotos: string[] = []
): string[] {
  const own = walkOwnPhotos(walk);
  if (own.length) return own;
  if (cityPhotos.length) {
    if (layout === "spread") return cityPhotos.slice(0, 2);
    return [cityPhotos[0]];
  }
  if (layout === "bleed") return [DUMMY_WALK_PHOTOS[0]];
  if (layout === "split") return [DUMMY_WALK_PHOTOS[1]];
  return DUMMY_WALK_PHOTOS;
}

export function routeLatLngs(walk: Walk): [number, number][] {
  if (walk.route?.coordinates.length) {
    return walk.route.coordinates.map(([lng, lat]) => [lat, lng]);
  }
  return walk.stops.map((stop) => [stop.lat, stop.lng]);
}
