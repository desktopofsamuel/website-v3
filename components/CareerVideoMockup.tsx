"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import MacBookMockup from "../public/about/Apple MacBook Air Space Grey.png";

const MOCKUP_WIDTH = 3560;
const MOCKUP_HEIGHT = 2200;
const DEV_TWEAK_KEY = "career-video-mockup-tweak";
const isDev = process.env.NODE_ENV === "development";

// Transparent screen hole measured from the mockup PNG.
const SCREEN_INSET = {
  top: 8.09090909090909,
  left: 12.022471910112358,
  right: 12.05056179775281,
  bottom: 9.045454545454545,
};

const SCREEN_WIDTH = 100 - SCREEN_INSET.left - SCREEN_INSET.right;
const SCREEN_HEIGHT = 100 - SCREEN_INSET.top - SCREEN_INSET.bottom;
// Top screen corners on the MacBook mockup; bottom stays square.
const SCREEN_TOP_RADIUS = "1.25%";

type VideoTweak = {
  scale: number;
  offsetX: number;
  offsetY: number;
};

const DEFAULT_TWEAK: VideoTweak = {
  scale: 1,
  offsetX: 0,
  offsetY: 0,
};

function loadTweak(): VideoTweak {
  if (!isDev || typeof window === "undefined") return DEFAULT_TWEAK;

  try {
    const stored = localStorage.getItem(DEV_TWEAK_KEY);
    if (!stored) return DEFAULT_TWEAK;
    return { ...DEFAULT_TWEAK, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_TWEAK;
  }
}

function saveTweak(tweak: VideoTweak) {
  if (!isDev || typeof window === "undefined") return;
  localStorage.setItem(DEV_TWEAK_KEY, JSON.stringify(tweak));
}

type CareerVideoMockupProps = {
  src: string;
  alt: string;
  caption: string;
};

export default function CareerVideoMockup({
  src,
  alt,
  caption,
}: CareerVideoMockupProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [tweak, setTweak] = useState<VideoTweak>(DEFAULT_TWEAK);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    setTweak(loadTweak());
  }, []);

  useEffect(() => {
    saveTweak(tweak);
  }, [tweak]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPlayback = () => {
      if (media.matches) {
        video.pause();
      } else {
        void video.play().catch(() => {});
      }
    };

    syncPlayback();
    media.addEventListener("change", syncPlayback);
    return () => media.removeEventListener("change", syncPlayback);
  }, []);

  const updateTweak = (patch: Partial<VideoTweak>) => {
    setTweak((current) => ({ ...current, ...patch }));
  };

  const copyTweak = async () => {
    const payload = JSON.stringify(tweak, null, 2);
    await navigator.clipboard.writeText(payload);
  };

  return (
    <>
      <div className="group relative aspect-square min-w-0 overflow-hidden rounded-sm border border-border bg-black">
        <div
          className="absolute inset-x-0 top-1/2 w-full -translate-y-1/2"
          style={{ aspectRatio: `${MOCKUP_WIDTH} / ${MOCKUP_HEIGHT}` }}
        >
          <div
            className="absolute z-0 overflow-hidden"
            style={{
              top: `${SCREEN_INSET.top}%`,
              left: `${SCREEN_INSET.left}%`,
              width: `${SCREEN_WIDTH}%`,
              height: `${SCREEN_HEIGHT}%`,
              borderTopLeftRadius: SCREEN_TOP_RADIUS,
              borderTopRightRadius: SCREEN_TOP_RADIUS,
            }}
          >
            <video
              ref={videoRef}
              src={src}
              autoPlay
              muted
              loop
              playsInline
              aria-label={alt}
              className="size-full object-cover object-center"
              style={{
                transform: `translate(${tweak.offsetX}%, ${tweak.offsetY}%) scale(${tweak.scale})`,
                transformOrigin: "center center",
                borderTopLeftRadius: SCREEN_TOP_RADIUS,
                borderTopRightRadius: SCREEN_TOP_RADIUS,
              }}
            />
          </div>
          <Image
            src={MacBookMockup}
            alt=""
            fill
            sizes="(max-width: 768px) 33vw, 33vw"
            className="pointer-events-none relative z-10 object-fill"
            aria-hidden
            priority
          />
        </div>
        <span className="absolute top-2 right-2 z-20 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-foreground bg-background/25 backdrop-blur-md rounded-sm opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          {caption}
        </span>
      </div>

      {isDev && (
        <div className="fixed bottom-4 right-4 z-[9999] w-64 rounded-md border border-border bg-background/95 p-3 font-mono text-[11px] shadow-lg backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setPanelOpen((open) => !open)}
            className="flex w-full items-center justify-between text-left text-foreground"
          >
            <span>Video mockup tweak</span>
            <span>{panelOpen ? "−" : "+"}</span>
          </button>

          {panelOpen && (
            <div className="mt-3 space-y-3 text-muted-foreground">
              <label className="block">
                <span className="mb-1 flex justify-between">
                  <span>Scale</span>
                  <span>{tweak.scale.toFixed(2)}</span>
                </span>
                <input
                  type="range"
                  min={0.5}
                  max={2}
                  step={0.01}
                  value={tweak.scale}
                  onChange={(e) =>
                    updateTweak({ scale: Number(e.target.value) })
                  }
                  className="w-full accent-foreground"
                />
              </label>

              <label className="block">
                <span className="mb-1 flex justify-between">
                  <span>Offset X (%)</span>
                  <span>{tweak.offsetX.toFixed(1)}</span>
                </span>
                <input
                  type="range"
                  min={-20}
                  max={20}
                  step={0.1}
                  value={tweak.offsetX}
                  onChange={(e) =>
                    updateTweak({ offsetX: Number(e.target.value) })
                  }
                  className="w-full accent-foreground"
                />
              </label>

              <label className="block">
                <span className="mb-1 flex justify-between">
                  <span>Offset Y (%)</span>
                  <span>{tweak.offsetY.toFixed(1)}</span>
                </span>
                <input
                  type="range"
                  min={-20}
                  max={20}
                  step={0.1}
                  value={tweak.offsetY}
                  onChange={(e) =>
                    updateTweak({ offsetY: Number(e.target.value) })
                  }
                  className="w-full accent-foreground"
                />
              </label>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTweak(DEFAULT_TWEAK)}
                  className="rounded-sm border border-border px-2 py-1 text-foreground hover:border-foreground"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => void copyTweak()}
                  className="rounded-sm border border-border px-2 py-1 text-foreground hover:border-foreground"
                >
                  Copy JSON
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
