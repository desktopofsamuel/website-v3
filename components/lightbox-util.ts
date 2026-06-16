import type { StaticImageData } from "next/image";
import type gsap from "gsap";

export type LightboxItem = {
  src: string | StaticImageData;
  alt: string;
  title?: string;
  subtitle?: string;
};

export const DIRECTIONS = [
  "fade",
  "scale",
  "zoom",
  "top",
  "bottom",
  "left",
  "right",
] as const;
export type Direction = (typeof DIRECTIONS)[number];

export type LightboxConfig = {
  direction: Direction;
  speed: number;
  spring: number;
  delay: number;
};

export const DEFAULT_CONFIG: LightboxConfig = {
  direction: "zoom",
  speed: 1,
  spring: 2,
  delay: 0.16,
};

/** Horizontal slide distance used between items on prev/next navigation. */
export const NAV_SLIDE_DISTANCE = 60;

export function directionFrom(d: Direction): gsap.TweenVars {
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

export function directionExit(d: Direction): gsap.TweenVars {
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
export function zoomVarsFromOrigin(
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

export function entryVars(
  d: Direction,
  origin: DOMRect | null,
  natural: DOMRect | null
): gsap.TweenVars {
  if (d === "zoom" && origin && natural) return zoomVarsFromOrigin(origin, natural);
  return directionFrom(d);
}

export function exitVars(
  d: Direction,
  origin: DOMRect | null,
  natural: DOMRect | null
): gsap.TweenVars {
  if (d === "zoom" && origin && natural) return zoomVarsFromOrigin(origin, natural);
  return directionExit(d);
}
