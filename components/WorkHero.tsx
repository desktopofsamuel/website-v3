"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { InertiaPlugin } from "gsap/InertiaPlugin";

gsap.registerPlugin(useGSAP, InertiaPlugin);

const MEDIA_COUNT = 12;

function canUseInertiaEffect() {
  if (typeof window === "undefined") return false;

  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function WorkHero() {
  const rootRef = useRef<HTMLElement>(null);
  const deltaRef = useRef({ x: 0, y: 0 });
  const oldPosRef = useRef({ x: 0, y: 0 });

  useGSAP(
    (_, contextSafe) => {
      const root = rootRef.current;
      if (!root || !canUseInertiaEffect() || !contextSafe) return;

      const onMouseMove = contextSafe((event: MouseEvent) => {
        deltaRef.current.x = event.clientX - oldPosRef.current.x;
        deltaRef.current.y = event.clientY - oldPosRef.current.y;
        oldPosRef.current.x = event.clientX;
        oldPosRef.current.y = event.clientY;
      });

      root.addEventListener("mousemove", onMouseMove);

      const mediaEls = root.querySelectorAll<HTMLElement>("[data-work-hero-media]");
      const cleanups: Array<() => void> = [];

      mediaEls.forEach((mediaEl) => {
        const onMouseEnter = contextSafe(() => {
          mediaEl.style.zIndex = "10";

          const image = mediaEl.querySelector<HTMLElement>("[data-work-hero-image]");
          if (!image) return;

          const tl = gsap.timeline({
            onComplete: () => {
              mediaEl.style.zIndex = "";
              tl.kill();
            },
          });

          tl.timeScale(1.2);
          tl.to(image, {
            inertia: {
              x: {
                velocity: deltaRef.current.x * 30,
                end: 0,
              },
              y: {
                velocity: deltaRef.current.y * 30,
                end: 0,
              },
            },
          });
          tl.fromTo(
            image,
            { rotate: 0 },
            {
              duration: 0.4,
              rotate: (Math.random() - 0.5) * 30,
              yoyo: true,
              repeat: 1,
              ease: "power1.inOut",
            },
            "<"
          );
        });

        const onMouseLeave = () => {
          mediaEl.style.zIndex = "";
        };

        mediaEl.addEventListener("mouseenter", onMouseEnter);
        mediaEl.addEventListener("mouseleave", onMouseLeave);
        cleanups.push(() => {
          mediaEl.removeEventListener("mouseenter", onMouseEnter);
          mediaEl.removeEventListener("mouseleave", onMouseLeave);
        });
      });

      return () => {
        root.removeEventListener("mousemove", onMouseMove);
        cleanups.forEach((cleanup) => cleanup());
      };
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      className="relative left-1/2 grid min-h-[100dvh] w-screen -translate-x-1/2 place-items-center overflow-hidden"
      aria-label="Portfolio hero"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 px-5 pt-20 text-center md:pt-28">
        <h1 className="font-heading text-4xl font-bold leading-tight md:text-6xl">
          Portfolio
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-secondarytext">
          Selected websites and apps showcase since 2015.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-[2vw] px-5 md:gap-[1vw]">
        {Array.from({ length: MEDIA_COUNT }, (_, index) => (
          <div
            key={index}
            data-work-hero-media
            className="relative cursor-pointer"
          >
            <div
              data-work-hero-image
              className="aspect-square w-[18vw] min-w-[52px] rounded-[4%] border border-border bg-muted will-change-transform pointer-events-none md:w-[11vw] md:min-w-0"
              aria-hidden
            />
          </div>
        ))}
      </div>
    </section>
  );
}
