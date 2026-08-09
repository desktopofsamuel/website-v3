"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TbMenu2 } from "react-icons/tb";
import NavLinks from "@/components/NavLinks";
import SocialLinks from "@/components/SocialLinks";
import ThemeToggle from "@/components/ThemeToggle";

gsap.registerPlugin(useGSAP);

const BG_DURATION = 0.55 * 0.7;
const ITEM_DURATION = 0.22;
const ITEM_STAGGER_OPEN = 0.08;
const ITEM_STAGGER_CLOSE = 0.04;
const ITEM_OFFSET = -16;
const SEQUENCE_OVERLAP = 0.05;
const BG_EASE = "power3.inOut";

const menuToggleClass =
  "inline-flex h-6 w-6 items-center justify-center text-2xl cursor-pointer select-none text-foreground";

export default function MobileMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const playOpenRef = useRef<(() => void) | null>(null);
  const playCloseRef = useRef<(() => void) | null>(null);

  const getMenuItems = () => {
    if (!contentRef.current) return [];
    return gsap.utils.toArray<HTMLElement>("[data-menu-item]", contentRef.current);
  };

  useGSAP(
    (_, contextSafe) => {
      if (!contextSafe) return;

      gsap.set(overlayRef.current, { visibility: "hidden", pointerEvents: "none" });
      gsap.set(bgRef.current, { clipPath: "inset(0 0 100% 0)" });
      gsap.set(getMenuItems(), { opacity: 0, y: ITEM_OFFSET });

      playOpenRef.current = contextSafe(() => {
        timelineRef.current?.kill();
        const items = getMenuItems();

        gsap.set(overlayRef.current, { visibility: "visible", pointerEvents: "auto" });
        gsap.set(bgRef.current, { clipPath: "inset(0 0 100% 0)" });
        gsap.set(items, { opacity: 0, y: ITEM_OFFSET });

        timelineRef.current = gsap.timeline();
        timelineRef.current
          .to(bgRef.current, {
            clipPath: "inset(0 0 0 0)",
            duration: BG_DURATION,
            ease: BG_EASE,
          })
          .to(
            items,
            {
              opacity: 1,
              y: 0,
              duration: ITEM_DURATION,
              stagger: ITEM_STAGGER_OPEN,
              ease: "power2.out",
            },
            `-=${SEQUENCE_OVERLAP}`
          );
      });

      playCloseRef.current = contextSafe(() => {
        timelineRef.current?.kill();
        const items = getMenuItems();

        timelineRef.current = gsap.timeline({
          onComplete: () => {
            gsap.set(overlayRef.current, { visibility: "hidden", pointerEvents: "none" });
            setIsActive(false);
          },
        });

        timelineRef.current
          .to(items, {
            opacity: 0,
            y: ITEM_OFFSET,
            duration: ITEM_DURATION,
            stagger: ITEM_STAGGER_CLOSE,
            ease: "power2.in",
          })
          .to(
            bgRef.current,
            {
              clipPath: "inset(0 0 100% 0)",
              duration: BG_DURATION,
              ease: BG_EASE,
            },
            `-=${SEQUENCE_OVERLAP}`
          );
      });
    },
    { scope: overlayRef }
  );

  const open = () => {
    setIsActive(true);
    setIsOpen(true);
    playOpenRef.current?.();
  };

  const close = () => {
    setIsOpen(false);
    playCloseRef.current?.();
  };

  useEffect(() => {
    if (!isOpen) return;
    setIsOpen(false);
    playCloseRef.current?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close only when route changes
  }, [pathname]);

  useEffect(() => {
    if (!isActive) return;

    const prevOverflow = document.body.style.overflow;
    const prevTouch = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.touchAction = prevTouch;
    };
  }, [isActive]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        playCloseRef.current?.();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <div className="relative z-[1001] flex shrink-0 items-center md:hidden">
      {!isOpen ? (
        <button type="button" onClick={open} className={menuToggleClass} aria-label="Open menu">
          <TbMenu2 />
        </button>
      ) : (
        <button
          type="button"
          onClick={close}
          className={`relative z-[1001] ${menuToggleClass}`}
          aria-label="Close menu"
        >
          ✕
        </button>
      )}

      <div
        ref={overlayRef}
        className="fixed inset-0 z-[1000] flex flex-col invisible pointer-events-none"
        aria-hidden={!isOpen}
      >
        <div ref={bgRef} className="absolute inset-0 bg-background" aria-hidden />
        <div ref={contentRef} className="relative flex flex-1 flex-col px-8 pb-8 pt-8">
          <nav className="flex flex-1 flex-col gap-y-16 font-body w-full">
            <NavLinks variant="mobile" onItemClick={close} />
            <div data-menu-item>
              <ThemeToggle variant="labeled" />
            </div>
          </nav>
          <div className="w-full pt-8" data-menu-item>
            <SocialLinks variant="mobile" />
          </div>
        </div>
      </div>
    </div>
  );
}
