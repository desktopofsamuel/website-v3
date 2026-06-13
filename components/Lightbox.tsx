"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import Image, { StaticImageData } from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export type LightboxItem = {
  src: string | StaticImageData;
  alt: string;
  title?: string;
  subtitle?: string;
};

type LightboxProps = {
  item: LightboxItem | null;
  /** Bounding rect of the trigger element at click time. Enables the zoom-from-origin animation. */
  originRect?: DOMRect | null;
  onClose: () => void;
  /** Provide to render prev/next arrows + enable keyboard ←/→. */
  onNavigate?: (direction: "next" | "prev") => void;
  hasNext?: boolean;
  hasPrev?: boolean;
};

const DIRECTIONS = [
  "fade",
  "scale",
  "zoom",
  "top",
  "bottom",
  "left",
  "right",
] as const;
type Direction = (typeof DIRECTIONS)[number];

function directionFrom(d: Direction): gsap.TweenVars {
  switch (d) {
    case "fade":
      return { opacity: 0 };
    case "scale":
      return { opacity: 0, scale: 0.95, y: 20 };
    case "top":
      return { opacity: 0, y: -80 };
    case "bottom":
      return { opacity: 0, y: 80 };
    case "left":
      return { opacity: 0, x: -80 };
    case "right":
      return { opacity: 0, x: 80 };
    default:
      return { opacity: 0, scale: 0.95, y: 20 };
  }
}

function directionExit(d: Direction): gsap.TweenVars {
  switch (d) {
    case "fade":
      return { opacity: 0 };
    case "scale":
      return { opacity: 0, scale: 0.95, y: 10 };
    case "top":
      return { opacity: 0, y: -40 };
    case "bottom":
      return { opacity: 0, y: 40 };
    case "left":
      return { opacity: 0, x: -40 };
    case "right":
      return { opacity: 0, x: 40 };
    default:
      return { opacity: 0, scale: 0.95, y: 10 };
  }
}

/** FLIP-style: transform that places `panel` over `origin` (translate centers + scale to width). */
function zoomVarsFromOrigin(
  origin: DOMRect,
  natural: DOMRect
): gsap.TweenVars {
  const scale = origin.width / natural.width;
  const x =
    origin.left + origin.width / 2 - (natural.left + natural.width / 2);
  const y =
    origin.top + origin.height / 2 - (natural.top + natural.height / 2);
  return { x, y, scale, opacity: 0 };
}

function entryVars(
  d: Direction,
  origin: DOMRect | null,
  natural: DOMRect | null
): gsap.TweenVars {
  if (d === "zoom" && origin && natural) return zoomVarsFromOrigin(origin, natural);
  return directionFrom(d);
}

function exitVars(
  d: Direction,
  origin: DOMRect | null,
  natural: DOMRect | null
): gsap.TweenVars {
  if (d === "zoom" && origin && natural) return zoomVarsFromOrigin(origin, natural);
  return directionExit(d);
}

const NAV_SLIDE_DISTANCE = 60; // px

export default function Lightbox({
  item,
  originRect,
  onClose,
  onNavigate,
  hasNext = false,
  hasPrev = false,
}: LightboxProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const naturalRectRef = useRef<DOMRect | null>(null);
  const navDirRef = useRef<"next" | "prev" | null>(null);
  const [direction, setDirection] = useState<Direction>("zoom");
  const [speed, setSpeed] = useState(1);
  const [spring, setSpring] = useState(1.7);
  const [delay, setDelay] = useState(0.1);
  const [copied, setCopied] = useState(false);

  // If "zoom" is selected but the caller didn't pass an origin, fall back to "scale"
  const effectiveDirection: Direction =
    direction === "zoom" && !originRect ? "scale" : direction;

  // Spring 0 → power3.out (no overshoot). Spring > 0 → back.out(N) overshoot.
  const entryEase = spring > 0 ? `back.out(${spring})` : "power3.out";

  useGSAP(
    () => {
      if (!item || !overlayRef.current || !panelRef.current) return;

      const navDir = navDirRef.current;
      const isNavigation = navDir !== null;
      navDirRef.current = null;

      // Fresh open: capture the element that previously held focus
      if (!isNavigation) {
        previouslyFocusedRef.current = document.activeElement as HTMLElement;
      }

      // Clear any leftover transform so we measure the natural position
      gsap.set(panelRef.current, { clearProps: "transform,opacity" });
      const natural = panelRef.current.getBoundingClientRect();
      naturalRectRef.current = natural;

      // Overlay fades in only on a fresh open
      if (!isNavigation) {
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3 / speed, ease: "power2.out" }
        );
      }

      // Panel — navigation slides in from opposite side of exit, fresh open uses the chosen direction
      const fromVars: gsap.TweenVars = isNavigation
        ? {
            x: navDir === "next" ? NAV_SLIDE_DISTANCE : -NAV_SLIDE_DISTANCE,
            opacity: 0,
          }
        : entryVars(effectiveDirection, originRect ?? null, natural);

      gsap.fromTo(panelRef.current, fromVars, {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        duration: (isNavigation ? 0.25 : 0.4) / speed,
        delay: isNavigation ? 0 : delay / speed,
        ease: entryEase,
        transformOrigin: "50% 50%",
        onComplete: () => {
          if (!isNavigation) closeButtonRef.current?.focus();
        },
      });
    },
    { dependencies: [item] }
  );

  const close = useCallback(() => {
    if (!overlayRef.current || !panelRef.current) return;
    const natural =
      naturalRectRef.current ?? panelRef.current.getBoundingClientRect();
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.2 / speed,
      ease: "power2.in",
    });
    gsap.to(panelRef.current, {
      ...exitVars(effectiveDirection, originRect ?? null, natural),
      duration: 0.25 / speed,
      ease: "power2.in",
      transformOrigin: "50% 50%",
      onComplete: () => {
        onClose();
        // Return focus to the trigger element
        previouslyFocusedRef.current?.focus();
      },
    });
  }, [onClose, effectiveDirection, originRect, speed]);

  const goNext = useCallback(() => {
    if (!onNavigate || !hasNext || !panelRef.current) return;
    navDirRef.current = "next";
    gsap.killTweensOf(panelRef.current);
    gsap.to(panelRef.current, {
      x: -NAV_SLIDE_DISTANCE,
      opacity: 0,
      duration: 0.2 / speed,
      ease: "power2.in",
      onComplete: () => onNavigate("next"),
    });
  }, [onNavigate, hasNext, speed]);

  const goPrev = useCallback(() => {
    if (!onNavigate || !hasPrev || !panelRef.current) return;
    navDirRef.current = "prev";
    gsap.killTweensOf(panelRef.current);
    gsap.to(panelRef.current, {
      x: NAV_SLIDE_DISTANCE,
      opacity: 0,
      duration: 0.2 / speed,
      ease: "power2.in",
      onComplete: () => onNavigate("prev"),
    });
  }, [onNavigate, hasPrev, speed]);

  const replay = useCallback(() => {
    if (!overlayRef.current || !panelRef.current) return;
    gsap.killTweensOf([overlayRef.current, panelRef.current]);
    gsap.set(panelRef.current, { clearProps: "transform,opacity" });
    const natural = panelRef.current.getBoundingClientRect();
    naturalRectRef.current = natural;
    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 / speed, ease: "power2.out" }
    );
    gsap.fromTo(
      panelRef.current,
      entryVars(effectiveDirection, originRect ?? null, natural),
      {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.4 / speed,
        delay: delay / speed,
        ease: entryEase,
        transformOrigin: "50% 50%",
      }
    );
  }, [effectiveDirection, originRect, speed, spring, delay]);

  // Escape to close + Tab focus trap + arrow keys to navigate
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!item) return;
      if (e.key === "Escape") {
        close();
      } else if (e.key === "Tab") {
        e.preventDefault();
        closeButtonRef.current?.focus();
      } else if (e.key === "ArrowRight" && hasNext) {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft" && hasPrev) {
        e.preventDefault();
        goPrev();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [item, close, hasNext, hasPrev, goNext, goPrev]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = item ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [item]);

  const isDev = process.env.NODE_ENV === "development";

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={item?.title ?? "Photo viewer"}
      aria-hidden={!item ? true : undefined}
      className={`fixed inset-0 z-[2000] flex flex-col items-center justify-center${
        !item ? " pointer-events-none invisible" : ""
      }`}
    >
      {/* Backdrop — click outside to close */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />

      {/* Close button — viewport top-right */}
      <button
        ref={closeButtonRef}
        onClick={close}
        aria-label="Close photo viewer"
        className="absolute top-0 right-0 z-20 w-20 h-20 flex items-center justify-center text-white/70 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden="true"
          focusable="false"
        >
          <line x1="12" y1="12" x2="36" y2="36" />
          <line x1="36" y1="12" x2="12" y2="36" />
        </svg>
      </button>

      {/* Navigation arrows (only when caller provides onNavigate) */}
      {onNavigate && (
        <>
          <button
            onClick={goPrev}
            disabled={!hasPrev}
            aria-label="Previous photo"
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center bg-black/40 text-white/80 backdrop-blur-sm transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ${
              !hasPrev ? "opacity-30 cursor-not-allowed pointer-events-none" : ""
            }`}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={goNext}
            disabled={!hasNext}
            aria-label="Next photo"
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center bg-black/40 text-white/80 backdrop-blur-sm transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ${
              !hasNext ? "opacity-30 cursor-not-allowed pointer-events-none" : ""
            }`}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}

      {/* Photo panel */}
      <div
        ref={panelRef}
        className="relative z-10 w-full max-w-4xl mx-auto px-6 flex flex-col gap-4"
      >
        {item && (
          <Image
            src={item.src}
            alt={item.alt}
            width={1200}
            height={800}
            className="w-full h-auto rounded-md object-contain"
            priority
            {...(typeof item.src !== "string" ? { placeholder: "blur" } : {})}
          />
        )}
        {(item?.title || item?.subtitle) && (
          <div aria-live="polite">
            {item.title && (
              <p className="font-body text-base text-white tracking-tight">
                {item.title}
              </p>
            )}
            {item.subtitle && (
              <p className="font-body text-sm text-white/60">{item.subtitle}</p>
            )}
          </div>
        )}
      </div>

      {/* Dev-only tweak panel */}
      {isDev && item && (
        <div
          className="absolute bottom-4 left-4 z-30 w-56 bg-black/85 text-white p-3 rounded-md flex flex-col gap-3 backdrop-blur-sm border border-white/10 font-mono text-xs"
          onClick={(e) => e.stopPropagation()}
          role="region"
          aria-label="Animation tweaks (development only)"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-white/50">
              Tweaks · dev
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={replay}
                className="text-[10px] uppercase tracking-widest text-white/60 hover:text-white transition-colors"
                aria-label="Replay entry animation"
              >
                ↻ replay
              </button>
              <button
                onClick={() => {
                  const config = {
                    direction: effectiveDirection,
                    speed,
                    spring,
                    delay,
                  };
                  navigator.clipboard.writeText(JSON.stringify(config));
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 1500);
                }}
                className="text-[10px] uppercase tracking-widest text-white/60 hover:text-white transition-colors"
                aria-label="Copy tweak config to clipboard"
                title="Copy as JSON"
              >
                {copied ? "✓ copied" : "⧉ copy"}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-white/60">
              <span>Direction</span>
              {direction === "zoom" && !originRect && (
                <span
                  className="text-[10px] uppercase tracking-widest text-amber-300/80"
                  title="No originRect passed — zoom falls back to scale"
                >
                  no origin
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-1">
              {DIRECTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDirection(d)}
                  className={`px-2 py-1 rounded border transition-colors capitalize ${
                    direction === d
                      ? "bg-white/20 border-white/50 text-white"
                      : "border-white/15 text-white/60 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-white/60">
              <span>Speed</span>
              <span className="text-white">{speed.toFixed(2)}×</span>
            </div>
            <input
              type="range"
              min={0.25}
              max={4}
              step={0.25}
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-full accent-white"
              aria-label="Animation speed"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-white/60">
              <span>Spring</span>
              <span className="text-white">
                {spring === 0 ? "off" : spring.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={5}
              step={0.1}
              value={spring}
              onChange={(e) => setSpring(parseFloat(e.target.value))}
              className="w-full accent-white"
              aria-label="Spring overshoot (back.out)"
            />
            <span className="text-[10px] text-white/40">
              {spring === 0 ? "power3.out" : `back.out(${spring.toFixed(1)})`}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-white/60">
              <span>Photo delay</span>
              <span className="text-white">{delay.toFixed(2)}s</span>
            </div>
            <input
              type="range"
              min={0}
              max={0.5}
              step={0.02}
              value={delay}
              onChange={(e) => setDelay(parseFloat(e.target.value))}
              className="w-full accent-white"
              aria-label="Delay before photo animates in (after overlay)"
            />
            <span className="text-[10px] text-white/40">
              overlay fires immediately, photo waits {delay.toFixed(2)}s
            </span>
          </div>

          <button
            onClick={() => {
              setDirection("zoom");
              setSpeed(1);
              setSpring(1.7);
              setDelay(0.1);
            }}
            className="self-end text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors"
          >
            reset
          </button>
        </div>
      )}
    </div>
  );
}
