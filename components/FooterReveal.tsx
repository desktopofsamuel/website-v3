"use client";
import React, { useEffect, useRef } from "react";
import AppFooter from "@/components/AppFooter";

type FooterRevealProps = {
  children: React.ReactNode;
};

export default function FooterReveal({ children }: FooterRevealProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const footer = footerRef.current;
    if (!wrapper || !footer) return;

    const measure = () => {
      wrapper.style.marginBottom = `${footer.offsetHeight}px`;
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
        className="relative z-10 bg-background rounded-b-2xl min-h-screen"
        style={{ overflow: "clip" }}
      >
        {children}
      </div>
      <div
        ref={footerRef}
        className="fixed bottom-0 left-0 w-full z-0"
        aria-hidden="false"
      >
        <AppFooter />
      </div>
    </>
  );
}
