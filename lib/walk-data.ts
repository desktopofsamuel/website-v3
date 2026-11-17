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

export function routeLatLngs(walk: Walk): [number, number][] {
  if (walk.route?.coordinates.length) {
    return walk.route.coordinates.map(([lng, lat]) => [lat, lng]);
  }
  return walk.stops.map((stop) => [stop.lat, stop.lng]);
}
