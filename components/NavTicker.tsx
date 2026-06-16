"use client";

import { useState, useEffect, useMemo } from "react";

const BASE_HELLO_MESSAGES = [
  "Hello! My name is Samuel",
  "Welcome to my corner of the internet",
  "Designer, builder, occasional writer",
  "Crafting bespoke experiences since 2015",
];

const NOW_PLAYING_POLL_MS = 30_000;
const HK_TIME_POLL_MS = 30_000;
const MESSAGE_ROTATE_MS = 3_000;

type NowPlaying = { title: string; artist: string } | null;

/** Hong Kong wall time + 24h hour for time-of-day-aware copy. */
function getHongKongTime(date: Date): { display: string; hour24: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Hong_Kong",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(date);
  let hours = "";
  let minutes = "";
  let dayPeriod = "";
  for (const p of parts) {
    if (p.type === "hour") hours = p.value.padStart(2, "0");
    else if (p.type === "minute") minutes = p.value;
    else if (p.type === "dayPeriod") dayPeriod = p.value.toLowerCase();
  }
  const hour24Str = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Hong_Kong",
    hour: "2-digit",
    hour12: false,
  }).format(date);
  return {
    display: `${hours}:${minutes}${dayPeriod}`,
    hour24: parseInt(hour24Str, 10),
  };
}

/** Time-of-day flavour text wrapped around the HK time. */
function timeMessage(display: string, hour24: number): string {
  if (hour24 < 5) return `Burning the midnight oil — ${display} in Hong Kong`;
  if (hour24 < 9) return `Early bird hours — ${display} in Hong Kong`;
  if (hour24 < 12) return `Morning in Hong Kong — ${display}`;
  if (hour24 < 14) return `Lunch o'clock in Hong Kong — ${display}`;
  if (hour24 < 17) return `Afternoon in Hong Kong — ${display}`;
  if (hour24 < 20) return `Evening in Hong Kong — ${display}`;
  if (hour24 < 23) return `Winding down in Hong Kong — ${display}`;
  return `Late night in Hong Kong — ${display}`;
}

/** Weather commentary scaled by how warm it is. */
function temperatureMessage(temp: number): string {
  if (temp < 10) return `A freezing ${temp}° in Hong Kong today`;
  if (temp < 18) return `${temp}° in Hong Kong — pleasant weather`;
  if (temp < 25) return `A comfy ${temp}° in Hong Kong today`;
  if (temp < 30) return `It's steamy ${temp}° in Hong Kong`;
  return `${temp}° and steamy in Hong Kong — staying inside`;
}

type NavTickerProps = {
  /** Current temperature in Hong Kong (°C). Inlined into the rotation when present. */
  temperature?: number | null;
};

export default function NavTicker({ temperature }: NavTickerProps) {
  const [nowPlaying, setNowPlaying] = useState<NowPlaying>(null);
  // `null` on first render so SSR and client agree; set on mount.
  const [hkTime, setHkTime] = useState<{
    display: string;
    hour24: number;
  } | null>(null);
  const [messageIndex, setMessageIndex] = useState(0);

  // Hong Kong wall time — recomputes every 30s on the client.
  useEffect(() => {
    const update = () => setHkTime(getHongKongTime(new Date()));
    update();
    const id = window.setInterval(update, HK_TIME_POLL_MS);
    return () => window.clearInterval(id);
  }, []);

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
    let insertIdx = 1;
    if (typeof temperature === "number") {
      next.splice(insertIdx++, 0, temperatureMessage(temperature));
    }
    if (hkTime) {
      next.splice(insertIdx++, 0, timeMessage(hkTime.display, hkTime.hour24));
    }
    if (nowPlaying) {
      next.push(
        `On Samuel's headphones — ${nowPlaying.title} by ${nowPlaying.artist}`
      );
    }
    return next;
  }, [temperature, hkTime, nowPlaying]);

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
      className="hidden min-w-0 flex-1 items-baseline justify-end gap-2 text-foreground md:flex md:flex-none md:justify-start"
      aria-live="polite"
    >
      <div className="wave-line hidden h-3 w-32 md:block lg:w-48" aria-hidden="true" />
      <svg
        width="14"
        height="10"
        viewBox="0 0 14 10"
        fill="none"
        aria-hidden="true"
        className="-ml-1 hidden shrink-0 md:block"
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
        className="message-rotate truncate font-body text-sm leading-snug text-muted-foreground md:text-base md:whitespace-nowrap"
      >
        {messages[safeIndex]}
      </span>
    </div>
  );
}
