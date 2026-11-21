"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { annotate } from "rough-notation";

type AnnotationType =
  | "underline"
  | "box"
  | "circle"
  | "highlight"
  | "strike-through"
  | "crossed-off"
  | "bracket";

type AnnotatedTextProps = {
  children: ReactNode;
  type?: AnnotationType;
  color?: string;
  className?: string;
  /** Handpicked uses 800ms after the text is 50% in view. */
  delay?: number;
  /** Sticky footers sit in the viewport the whole time — wait until the page end instead. */
  trigger?: "in-view" | "page-end";
  strokeWidth?: number;
  padding?: number;
};

export default function AnnotatedText({
  children,
  type = "underline",
  color = "currentColor",
  className,
  delay = 800,
  trigger = "in-view",
  strokeWidth = 3,
  padding = 2,
}: AnnotatedTextProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timeoutId: number | undefined;
    let observer: IntersectionObserver | undefined;
    let detachPageEnd: (() => void) | undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const annotation = annotate(el, {
      type,
      color,
      animate: !reduceMotion,
      animationDuration: 800,
      strokeWidth,
      padding,
      iterations: 2,
    });

    const show = () => {
      annotation.show();
    };

    if (reduceMotion) {
      show();
      return () => {
        annotation.remove();
      };
    }

    if (trigger === "page-end") {
      const onScroll = () => {
        const doc = document.documentElement;
        const remaining =
          doc.scrollHeight - (window.scrollY + window.innerHeight);
        if (remaining > 96) return;
        window.removeEventListener("scroll", onScroll);
        timeoutId = window.setTimeout(show, delay);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      detachPageEnd = () => window.removeEventListener("scroll", onScroll);
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            timeoutId = window.setTimeout(show, delay);
            observer?.unobserve(entry.target);
          }
        },
        { rootMargin: "0px", threshold: 0.5 },
      );
      observer.observe(el);
    }

    return () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      observer?.disconnect();
      detachPageEnd?.();
      annotation.remove();
    };
  }, [type, color, delay, trigger, strokeWidth, padding]);

  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  );
}
