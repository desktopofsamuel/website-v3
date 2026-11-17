"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "@/components/AppLink";
import WalkMedia from "@/components/walks/WalkMedia";
import WalkMap from "@/components/walks/WalkMap";
import type { Walk } from "@/lib/walk-data";
import { stopMapsUrl } from "@/lib/walk-data";

type WalkExperienceProps = {
  walk: Walk;
};

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsDesktop(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return isDesktop;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return reduced;
}

function useDarkClass() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setDark(root.classList.contains("dark"));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return dark;
}

export default function WalkExperience({ walk }: WalkExperienceProps) {
  const isDesktop = useIsDesktop();
  const reduceMotion = usePrefersReducedMotion();
  const dark = useDarkClass();
  const listRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const [activeStopId, setActiveStopId] = useState<string | null>(null);

  useEffect(() => {
    setActiveStopId(isDesktop ? null : walk.stops[0]?.id ?? null);
  }, [isDesktop, walk.slug, walk.stops]);

  useEffect(() => {
    if (!isDesktop) return;
    const root = listRef.current;
    if (!root) return;

    const nodes = walk.stops
      .map((stop) => root.querySelector<HTMLElement>(`#${CSS.escape(stop.id)}`))
      .filter((node): node is HTMLElement => Boolean(node));

    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setActiveStopId(visible.target.id);
        }
      },
      { root, rootMargin: "-35% 0px -45% 0px", threshold: [0.15, 0.4, 0.7] }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [isDesktop, walk.stops]);

  const scrollToStop = useCallback(
    (stopId: string) => {
      setActiveStopId(stopId);
      const behavior = reduceMotion ? "auto" : "smooth";

      if (isDesktop) {
        listRef.current
          ?.querySelector<HTMLElement>(`#${CSS.escape(stopId)}`)
          ?.scrollIntoView({ behavior, block: "center" });
        return;
      }

      const card = deckRef.current?.querySelector<HTMLElement>(
        `[data-stop="${CSS.escape(stopId)}"]`
      );
      card?.scrollIntoView({ behavior, inline: "center", block: "nearest" });
    },
    [isDesktop, reduceMotion]
  );

  const onDeckScroll = useCallback(() => {
    const deck = deckRef.current;
    if (!deck) return;
    const cards = Array.from(deck.querySelectorAll<HTMLElement>("[data-stop]"));
    if (!cards.length) return;
    const midpoint = deck.scrollLeft + deck.clientWidth / 2;
    let nearest = cards[0];
    let distance = Infinity;
    for (const card of cards) {
      const center = card.offsetLeft + card.offsetWidth / 2;
      const next = Math.abs(center - midpoint);
      if (next < distance) {
        distance = next;
        nearest = card;
      }
    }
    const id = nearest.dataset.stop;
    if (id) setActiveStopId(id);
  }, []);

  const mapsLabel = "Open in Maps";

  const stopList = useMemo(
    () =>
      walk.stops.map((stop, index) => (
        <article
          key={stop.id}
          id={stop.id}
          className="scroll-mt-8 py-10 border-t border-border first:border-t-0"
        >
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Stop {index + 1}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="space-y-3 flex-1 min-w-0">
              <h2 className="font-body text-2xl tracking-tight text-foreground">
                {stop.title}
              </h2>
              <p className="font-body text-base leading-relaxed text-muted-foreground">
                {stop.description}
              </p>
              <Link
                href={stopMapsUrl(stop)}
                target="_blank"
                className="inline-flex items-center gap-2 font-body text-sm text-foreground no-underline border-b border-transparent hover:border-foreground"
              >
                → {mapsLabel}
              </Link>
            </div>
            <div className="w-full sm:w-44 shrink-0 aspect-square bg-lift border border-border">
              <WalkMedia
                src={stop.illustration}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </article>
      )),
    [mapsLabel, walk.stops]
  );

  return (
    <div className="relative md:grid md:grid-cols-2 md:h-[calc(100dvh-7.75rem)]">
      <div
        ref={listRef}
        className="relative z-10 hidden md:block overflow-y-auto px-page py-12 bg-background"
      >
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6">
          05 — Walks
        </p>
        <h1 className="font-body font-normal text-5xl lg:text-7xl tracking-tighter leading-none text-foreground">
          {walk.title}
        </h1>
        <p className="mt-6 max-w-[42ch] font-body text-base leading-relaxed text-muted-foreground">
          {walk.description}
        </p>
        <div className="mt-12">{stopList}</div>
        {walk.footnote && (
          <p className="mt-12 font-body text-sm leading-relaxed text-muted-foreground">
            {walk.footnote}
          </p>
        )}
      </div>

      <div className="max-md:fixed max-md:inset-0 z-0 relative h-[40vh] md:h-full">
        <div className="absolute inset-0 bg-lift">
          <WalkMap
            walk={walk}
            activeStopId={activeStopId}
            dark={dark}
            isDesktop={isDesktop}
            reduceMotion={reduceMotion}
            onMarkerClick={scrollToStop}
          />
        </div>
      </div>

      <div className="md:hidden relative z-10 min-h-[60vh] pointer-events-none">
        <div className="px-page pt-8">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3 pointer-events-auto">
            05 — Walks
          </p>
          <h1 className="font-body font-normal text-5xl tracking-tighter leading-none text-foreground pointer-events-auto drop-shadow-sm">
            {walk.title}
          </h1>
        </div>

        <div
          ref={deckRef}
          onScroll={onDeckScroll}
          className="pointer-events-auto absolute inset-x-0 bottom-0 flex gap-4 overflow-x-auto snap-x snap-mandatory px-page pb-8 pt-4"
        >
          {walk.stops.map((stop, index) => (
            <article
              key={stop.id}
              data-stop={stop.id}
              className="snap-center shrink-0 w-[min(85vw,22rem)] bg-background/95 backdrop-blur-sm border border-border p-5"
            >
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
                Stop {index + 1}
              </p>
              <div className="aspect-square w-full bg-lift mb-4">
                <WalkMedia
                  src={stop.illustration}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <h2 className="font-body text-xl tracking-tight text-foreground">
                {stop.title}
              </h2>
              <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">
                {stop.description}
              </p>
              <Link
                href={stopMapsUrl(stop)}
                target="_blank"
                className="mt-4 inline-flex items-center gap-2 font-body text-sm text-foreground no-underline border-b border-transparent hover:border-foreground"
              >
                → {mapsLabel}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
