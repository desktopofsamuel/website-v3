"use client";

import { useState, useEffect, useMemo } from "react";

const BASE_HELLO_MESSAGES = [
  "This is Samuel Wong",
  "Crafting bespoke experiences",
];

const NOW_PLAYING_POLL_MS = 30_000;
const MESSAGE_ROTATE_MS = 3_000;

type NowPlaying = { title: string; artist: string } | null;

type NavTickerProps = {
  /** Current temperature in Hong Kong (°C). Inlined into the rotation when present. */
  temperature?: number | null;
};

export default function NavTicker({ temperature }: NavTickerProps) {
  const [nowPlaying, setNowPlaying] = useState<NowPlaying>(null);
  const [messageIndex, setMessageIndex] = useState(0);

  // Poll /api/currently-playing periodically — the API route is no-cache so each
  // call is fresh. Updates `nowPlaying` state and re-derives the rotation list.
  useEffect(() => {
    let cancelled = false;

    const tick = async () => {
      try {
        const res = await fetch("/api/currently-playing", {
          cache: "no-store",
        });
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as {
          isPlaying?: boolean;
          title?: string;
          artist?: string;
        };
        if (cancelled) return;
        if (data.isPlaying && data.title && data.artist) {
          setNowPlaying({ title: data.title, artist: data.artist });
        } else {
          setNowPlaying(null);
        }
      } catch {
        if (!cancelled) setNowPlaying(null);
      }
    };

    tick();
    const pollId = window.setInterval(tick, NOW_PLAYING_POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(pollId);
    };
  }, []);

  const messages = useMemo(() => {
    const next = [...BASE_HELLO_MESSAGES];
    if (typeof temperature === "number") {
      next.splice(1, 0, `It's ${temperature}° in Hong Kong today`);
    }
    if (nowPlaying) {
      next.push(
        `Samuel is listening to ${nowPlaying.title} by ${nowPlaying.artist}`
      );
    }
    return next;
  }, [temperature, nowPlaying]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setMessageIndex((i) => (i + 1) % messages.length);
    }, MESSAGE_ROTATE_MS);
    return () => window.clearInterval(id);
  }, [messages.length]);

  // Clamp the rendered index in case messages.length shrank between renders
  const safeIndex = messageIndex % messages.length;

  return (
    <div
      className="hidden md:flex items-center gap-2 text-foreground"
      aria-live="polite"
    >
      <div className="wave-line h-3 w-32 lg:w-48" aria-hidden="true" />
      <svg
        width="14"
        height="10"
        viewBox="0 0 14 10"
        fill="none"
        aria-hidden="true"
        className="-ml-1 shrink-0"
      >
        <path
          d="M0 5 L12 5 M8.5 1.5 L12 5 L8.5 8.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        key={safeIndex}
        className="message-rotate font-body text-base leading-none text-muted-foreground whitespace-nowrap"
      >
        {messages[safeIndex]}
      </span>
    </div>
  );
}
