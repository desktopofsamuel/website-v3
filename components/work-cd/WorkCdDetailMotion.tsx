"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useWorkCd } from "./WorkCdStage";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function bitsOf(panel: HTMLElement) {
  const bits = gsap.utils.toArray<HTMLElement>("[data-typeset]", panel);
  return bits.length ? bits : [panel];
}

function playEnter(panel: HTMLElement) {
  const bits = bitsOf(panel);
  gsap.killTweensOf([panel, ...bits]);
  gsap.set(panel, { clearProps: "transform,opacity,filter,clipPath" });
  gsap.set(panel, { opacity: 1 });

  if (prefersReducedMotion()) {
    gsap.fromTo(bits, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "none" });
    return;
  }

  gsap.fromTo(
    bits,
    { opacity: 0, y: 22, filter: "blur(10px)" },
    {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.68,
      stagger: 0.09,
      ease: "power3.out",
    },
  );
}

function playExit(panel: HTMLElement) {
  const bits = bitsOf(panel);
  gsap.killTweensOf([panel, ...bits]);
  if (prefersReducedMotion()) {
    gsap.to([...bits, panel], { opacity: 0, duration: 0.18, ease: "none" });
    return;
  }
  gsap.to(panel, { opacity: 0, duration: 0.28, ease: "power2.in" });
  gsap.to(bits, {
    opacity: 0,
    y: -16,
    filter: "blur(10px)",
    duration: 0.36,
    stagger: 0.03,
    ease: "power2.in",
  });
}

export default function WorkCdDetailMotion({ children }: { children: ReactNode }) {
  const { returning, typesetReady, setReadAmount } = useWorkCd();
  const rootRef = useRef<HTMLDivElement>(null);
  const entered = useRef(false);
  const setReadAmountRef = useRef(setReadAmount);
  setReadAmountRef.current = setReadAmount;

  useLayoutEffect(() => {
    const panel = rootRef.current?.querySelector<HTMLElement>("[data-detail-panel]");
    if (!panel) return;
    if (returning) {
      if (entered.current) playExit(panel);
      return;
    }
    if (!typesetReady || entered.current) return;
    entered.current = true;
    playEnter(panel);
  }, [returning, typesetReady]);

  useEffect(() => {
    const panel = rootRef.current?.querySelector<HTMLElement>("[data-detail-panel]");
    if (!panel || returning || !typesetReady) return;

    const syncRead = () => {
      const start = 28;
      const span = 200;
      const t = Math.min(1, Math.max(0, (panel.scrollTop - start) / span));
      const amount = t * t * (3 - 2 * t);
      panel.style.setProperty("--work-cd-read", amount.toFixed(3));
      setReadAmountRef.current(amount);
    };

    panel.addEventListener("scroll", syncRead, { passive: true });
    syncRead();
    return () => {
      panel.removeEventListener("scroll", syncRead);
    };
  }, [returning, typesetReady]);

  useEffect(() => {
    return () => setReadAmountRef.current(0);
  }, []);

  return <div ref={rootRef}>{children}</div>;
}
