"use client";

/**
 * Public entry for the Lightbox.
 *
 * In production: re-exports `LightboxCore` directly — no tweak `useState`, no
 * dev panel JSX, no extra bundle weight.
 *
 * In development: re-exports `LightboxDebug`, which wraps `LightboxCore` and
 * mounts the animation tweak panel (direction / speed / spring / delay /
 * replay / copy).
 *
 * The ternary is evaluated at module load with `process.env.NODE_ENV` inlined
 * by the bundler — production builds tree-shake the `LightboxDebug` import.
 */

import LightboxCore from "@/components/LightboxCore";
import LightboxDebug from "@/components/LightboxDebug";

const Lightbox =
  process.env.NODE_ENV === "development" ? LightboxDebug : LightboxCore;

export default Lightbox;
export type { LightboxItem } from "@/components/lightbox-util";
