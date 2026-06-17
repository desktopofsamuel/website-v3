"use client";
import React, { useLayoutEffect, useRef } from "react";
import AppFooter from "@/components/AppFooter";

type FooterRevealProps = {
  children: React.ReactNode;
};

export default function FooterReveal({ children }: FooterRevealProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const lastHeightRef = useRef(0);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const footer = footerRef.current;
    if (!wrapper || !footer) return;

    const measure = () => {
      const height = footer.offsetHeight;
      if (height === lastHeightRef.current) return;

      lastHeightRef.current = height;
      wrapper.style.marginBottom = `${height}px`;

      if (height > 0) {
        footer.style.visibility = "visible";
      }
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(footer);
    window.addEventListener("resize", measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <>
      <div
        ref={wrapperRef}
        className="relative z-10 min-h-screen bg-background"
        style={{ overflow: "clip" }}
      >
        {children}
      </div>
      <div
        ref={footerRef}
        className="invisible fixed bottom-0 left-0 z-0 w-full overflow-hidden rounded-t-2xl"
        aria-hidden="false"
      >
        <AppFooter />
      </div>
    </>
  );
}
