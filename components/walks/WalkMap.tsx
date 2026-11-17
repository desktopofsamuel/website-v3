"use client";

import { useEffect, useRef } from "react";
import type { Walk } from "@/lib/walk-data";
import { routeLatLngs } from "@/lib/walk-data";

const OSM_TILES = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const STOP_ZOOM = 16;

type WalkMapProps = {
  walk: Walk;
  activeStopId: string | null;
  dark: boolean;
  isDesktop: boolean;
  reduceMotion: boolean;
  onMarkerClick: (stopId: string) => void;
};

export default function WalkMap({
  walk,
  activeStopId,
  dark,
  isDesktop,
  reduceMotion,
  onMarkerClick,
}: WalkMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markersRef = useRef<import("leaflet").Marker[]>([]);
  const lineRef = useRef<import("leaflet").Polyline | null>(null);
  const onMarkerClickRef = useRef(onMarkerClick);
  onMarkerClickRef.current = onMarkerClick;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let cancelled = false;

    void import("leaflet").then((mod) => {
      const L = (mod as { default?: typeof import("leaflet") }).default ?? mod;
      if (cancelled || !containerRef.current || mapRef.current) return;

      const first = walk.stops[0];
      if (!first) return;

      const map = L.map(containerRef.current, {
        scrollWheelZoom: isDesktop,
        zoomControl: isDesktop,
        attributionControl: true,
      }).setView([first.lat, first.lng], 13);

      mapRef.current = map;

      L.tileLayer(OSM_TILES, {
        attribution: ATTRIBUTION,
        maxZoom: 19,
      }).addTo(map);

      const line = routeLatLngs(walk);
      if (walk.showRoute !== false && line.length > 1) {
        lineRef.current = L.polyline(line, {
          color: dark ? "#ffffff" : "#111111",
          weight: 3,
          opacity: 0.75,
        }).addTo(map);
      }

      markersRef.current = walk.stops.map((stop, index) => {
        const marker = L.marker([stop.lat, stop.lng], {
          icon: pinIcon(L, index, stop.id === activeStopId),
        }).addTo(map);
        marker.on("click", () => onMarkerClickRef.current(stop.id));
        return marker;
      });

      if (isDesktop) {
        const bounds = L.latLngBounds(
          walk.stops.map((stop) => [stop.lat, stop.lng] as [number, number])
        );
        line.forEach((point) => bounds.extend(point));
        map.fitBounds(bounds, { padding: [48, 48], maxZoom: 16, animate: false });
      } else {
        map.setView([first.lat, first.lng], STOP_ZOOM, { animate: false });
      }

      requestAnimationFrame(() => map.invalidateSize());
    }).catch((error: unknown) => {
      if (containerRef.current) {
        containerRef.current.textContent =
          error instanceof Error ? error.message : "Map failed to load";
      }
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      lineRef.current = null;
      markersRef.current = [];
    };
    // Recreate when the walk or breakpoint changes; camera updates are below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walk.slug, isDesktop]);

  useEffect(() => {
    lineRef.current?.setStyle({ color: dark ? "#ffffff" : "#111111" });
  }, [dark]);

  useEffect(() => {
    void import("leaflet").then((mod) => {
      const L = (mod as { default?: typeof import("leaflet") }).default ?? mod;
      markersRef.current.forEach((marker, index) => {
        const stop = walk.stops[index];
        if (!stop) return;
        marker.setIcon(pinIcon(L, index, stop.id === activeStopId));
      });
    });
  }, [activeStopId, walk.stops]);

  useEffect(() => {
    const map = mapRef.current;
    const stop = walk.stops.find((item) => item.id === activeStopId);
    if (!map || !stop) return;
    if (reduceMotion) {
      map.setView([stop.lat, stop.lng], STOP_ZOOM, { animate: false });
      return;
    }
    map.flyTo([stop.lat, stop.lng], STOP_ZOOM, { duration: 0.75 });
  }, [activeStopId, reduceMotion, walk.stops]);

  return <div ref={containerRef} className="walk-map h-full w-full" />;
}

function pinIcon(
  L: typeof import("leaflet"),
  index: number,
  active: boolean
) {
  return L.divIcon({
    className: "walk-pin-wrap",
    html: `<div class="walk-pin${active ? " walk-pin-active" : ""}">${index + 1}</div>`,
    iconSize: active ? [34, 34] : [28, 28],
    iconAnchor: active ? [17, 17] : [14, 14],
  });
}
