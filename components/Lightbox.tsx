"use client";

import { useRef, useEffect, useCallback } from "react";
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
  onClose: () => void;
};

export default function Lightbox({ item, onClose }: LightboxProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (!item || !overlayRef.current || !panelRef.current) return;
      // Store the element that had focus before opening
      previouslyFocusedRef.current = document.activeElement as HTMLElement;
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        {
          opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power3.out",
          onComplete: () => closeButtonRef.current?.focus(),
        }
      );
    },
    { dependencies: [item] }
  );

  const close = useCallback(() => {
    if (!overlayRef.current || !panelRef.current) return;
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, ease: "power2.in" });
    gsap.to(panelRef.current, {
      opacity: 0,
      scale: 0.95,
      y: 10,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        onClose();
        // Return focus to the trigger element
        previouslyFocusedRef.current?.focus();
      },
    });
  }, [onClose]);

  // Escape to close + Tab focus trap (close button is the only focusable element)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!item) return;
      if (e.key === "Escape") {
        close();
      } else if (e.key === "Tab") {
        e.preventDefault();
        closeButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [item, close]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = item ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [item]);

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
    </div>
  );
}
