import fs from "fs";
import path from "path";
import type { Walk, WalkRecord, WalkLineString, WalkStop } from "@/lib/walk-data";

export type { Walk, WalkLineString, WalkRecord, WalkStop } from "@/lib/walk-data";
export { routeLatLngs, stopMapsUrl } from "@/lib/walk-data";

const WALKS_DIR = path.join(process.cwd(), "content/walks");

function isLineString(value: unknown): value is WalkLineString {
  if (!value || typeof value !== "object") return false;
  const line = value as WalkLineString;
  return (
    line.type === "LineString" &&
    Array.isArray(line.coordinates) &&
    line.coordinates.every(
      (pair) =>
        Array.isArray(pair) &&
        pair.length === 2 &&
        typeof pair[0] === "number" &&
        typeof pair[1] === "number"
    )
  );
}

function isStop(value: unknown): value is WalkStop {
  if (!value || typeof value !== "object") return false;
  const stop = value as WalkStop;
  return (
    typeof stop.id === "string" &&
    typeof stop.title === "string" &&
    typeof stop.description === "string" &&
    typeof stop.illustration === "string" &&
    typeof stop.lat === "number" &&
    typeof stop.lng === "number" &&
    (stop.mapsUrl === undefined || typeof stop.mapsUrl === "string")
  );
}

function parseWalk(slug: string, raw: unknown): Walk | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as WalkRecord;
  if (
    typeof record.title !== "string" ||
    typeof record.description !== "string" ||
    typeof record.cover !== "string" ||
    !Array.isArray(record.stops) ||
    record.stops.length === 0 ||
    !record.stops.every(isStop)
  ) {
    return null;
  }

  return {
    slug,
    title: record.title,
    description: record.description,
    cover: record.cover,
    footnote: typeof record.footnote === "string" ? record.footnote : undefined,
    draft: record.draft === true,
    showRoute: record.showRoute !== false,
    route: isLineString(record.route) ? record.route : undefined,
    stops: record.stops,
  };
}

export function getWalkSlugs(): string[] {
  if (!fs.existsSync(WALKS_DIR)) return [];
  return fs
    .readdirSync(WALKS_DIR)
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.replace(/\.json$/, ""));
}

export function getWalk(slug: string): Walk | null {
  const filePath = path.join(WALKS_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return parseWalk(slug, raw);
}

export function getPublishedWalks(): Walk[] {
  return getWalkSlugs()
    .map((slug) => getWalk(slug))
    .filter((walk): walk is Walk => walk !== null && walk.draft !== true)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getPublishedWalk(slug: string): Walk | null {
  const walk = getWalk(slug);
  if (!walk || walk.draft) return null;
  return walk;
}
