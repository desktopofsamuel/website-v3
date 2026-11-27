"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "@/components/AppLink";
import { Button } from "@/components/ui/button";
import EyebrowLabel from "@/components/EyebrowLabel";
import { useWorkCd } from "./WorkCdStage";
import WorkCdPlayTimeline from "./WorkCdPlayTimeline";

gsap.registerPlugin(useGSAP);

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  digits = 2,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  digits?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block text-[0.65rem] tracking-wide text-white/55 uppercase">
      <span className="flex justify-between gap-2 font-medium">
        {label}
        <span className="tabular-nums text-white/80">{value.toFixed(digits)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-1 w-full accent-white"
      />
    </label>
  );
}

export default function WorkCdIndex() {
  const {
    slide,
    lastSlide,
    isOverview,
    focused,
    focusedTune,
    playing,
    camera,
    shopHover,
    glass,
    goRelative,
    playLearnMore,
    playProgress,
    setPlayProgress,
    closeProgress,
    setCloseProgress,
    playBeats,
    setPlayBeats,
    resetPlayBeats,
    setHover,
    patchTune,
    resetFocused,
    setCamera,
    setShopHover,
    setGlass,
  } = useWorkCd();
  const [tuneOpen, setTuneOpen] = useState(false);
  const copyRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = copyRef.current;
      if (!el) return;
      const bits = gsap.utils.toArray<HTMLElement>(":scope > *", el);
      const targets = bits.length ? bits : [el];
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(targets, { opacity: playing ? 0 : 1 });
        return;
      }
      if (playing) {
        gsap.to(targets, {
          opacity: 0,
          y: -14,
          filter: "blur(7px)",
          duration: 0.36,
          stagger: 0.04,
          ease: "power2.in",
        });
        return;
      }
      gsap.fromTo(
        targets,
        { opacity: 0, y: 16, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.55,
          stagger: 0.06,
          ease: "power2.out",
        },
      );
    },
    { dependencies: [playing] },
  );

  return (
    <>
      <div className="pointer-events-none absolute top-4 left-3 z-40 lg:hidden">
        <button
          type="button"
          className="pointer-events-auto rounded-full bg-black/70 px-3 py-1.5 text-[0.65rem] tracking-wide text-white/80 uppercase backdrop-blur-sm"
          onClick={() => setTuneOpen((open) => !open)}
        >
          {tuneOpen ? "Close tune" : "Tune"}
        </button>
      </div>
      <aside
        className={`pointer-events-auto absolute top-4 left-4 z-40 max-h-[min(78dvh,46rem)] w-[min(20rem,calc(100%-2rem))] overflow-y-auto rounded-xl bg-black/70 p-3 text-white shadow-lg backdrop-blur-sm lg:block ${
          tuneOpen ? "block" : "hidden"
        }`}
      >
        <p className="text-[0.65rem] tracking-wide text-white/50 uppercase">
          Tune {isOverview ? "overview camera" : `slide ${slide} album`}
        </p>
        {focusedTune ? (
          <div className="mt-2 flex flex-col gap-2">
            <SliderRow
              label="Album X"
              value={focusedTune.x}
              min={-0.35}
              max={0.35}
              step={0.002}
              onChange={(x) => patchTune(slide - 1, { x })}
            />
            <SliderRow
              label="Album Y"
              value={focusedTune.y}
              min={-0.2}
              max={0.35}
              step={0.002}
              onChange={(y) => patchTune(slide - 1, { y })}
            />
            <SliderRow
              label="Album Z"
              value={focusedTune.z}
              min={-1.2}
              max={1.2}
              step={0.002}
              onChange={(z) => patchTune(slide - 1, { z })}
            />
            <SliderRow
              label="Open"
              value={focusedTune.open}
              min={0}
              max={1}
              step={0.001}
              onChange={(open) => patchTune(slide - 1, { open })}
            />
            <p className="mt-1 text-[0.65rem] tracking-wide text-white/50 uppercase">
              Neighbor hover
            </p>
            <SliderRow
              label="Neighbor lift"
              value={shopHover.lift}
              min={0}
              max={1.2}
              step={0.01}
              onChange={(lift) => setShopHover((h) => ({ ...h, lift }))}
            />
            <SliderRow
              label="Neighbor push"
              value={shopHover.push}
              min={0}
              max={1.2}
              step={0.01}
              onChange={(push) => setShopHover((h) => ({ ...h, push }))}
            />
            <WorkCdPlayTimeline
              progress={playProgress}
              onProgress={setPlayProgress}
              closeProgress={closeProgress}
              onCloseProgress={setCloseProgress}
              beats={playBeats}
              onBeats={setPlayBeats}
              onReset={resetPlayBeats}
            />
            <button
              type="button"
              onClick={resetFocused}
              className="self-start text-[0.65rem] text-white/60 underline underline-offset-2"
            >
              Reset this album
            </button>
          </div>
        ) : (
          <p className="mt-2 text-xs text-white/70">
            Go to a case to pose it. Camera handles below still apply here.
          </p>
        )}
        <div className="mt-3 flex flex-col gap-2 border-t border-white/15 pt-3">
          <SliderRow
            label="Transition"
            value={camera.lerp}
            min={0.015}
            max={0.16}
            step={0.001}
            onChange={(lerp) => setCamera((c) => ({ ...c, lerp }))}
          />
          <SliderRow
            label="Camera distance"
            value={camera.distance}
            min={0.55}
            max={1.8}
            step={0.01}
            onChange={(distance) => setCamera((c) => ({ ...c, distance }))}
          />
          <SliderRow
            label="Camera height"
            value={camera.height}
            min={0.45}
            max={1.8}
            step={0.01}
            onChange={(height) => setCamera((c) => ({ ...c, height }))}
          />
        </div>
        <div className="mt-3 flex flex-col gap-2 border-t border-white/15 pt-3">
          <p className="text-[0.65rem] tracking-wide text-white/50 uppercase">
            Lid transmission
          </p>
          <SliderRow
            label="Buffer blur"
            value={glass.blur}
            min={0}
            max={2}
            step={0.01}
            onChange={(blur) => setGlass((g) => ({ ...g, blur }))}
          />
          <SliderRow
            label="Glass roughness"
            value={glass.roughness}
            min={0}
            max={0.2}
            step={0.001}
            digits={3}
            onChange={(roughness) => setGlass((g) => ({ ...g, roughness }))}
          />
          <SliderRow
            label="Glass thickness"
            value={glass.thickness}
            min={0}
            max={0.02}
            step={0.0001}
            digits={4}
            onChange={(thickness) => setGlass((g) => ({ ...g, thickness }))}
          />
          <SliderRow
            label="Glass IOR"
            value={glass.ior}
            min={1}
            max={1.8}
            step={0.01}
            onChange={(ior) => setGlass((g) => ({ ...g, ior }))}
          />
        </div>
      </aside>
      <aside
        ref={copyRef}
        className={`work-cd-copy absolute inset-x-3 top-3 z-30 flex max-h-[min(46dvh,26rem)] flex-col justify-center gap-4 overflow-y-auto rounded-2xl bg-[#efece6]/90 p-5 shadow-lg backdrop-blur-md lg:inset-x-auto lg:top-0 lg:right-0 lg:bottom-[30dvh] lg:max-h-none lg:w-[min(26rem,38vw)] lg:rounded-none lg:border-l lg:border-neutral-200/80 lg:bg-[#efece6]/80 lg:px-10 lg:py-8 lg:shadow-none ${
          playing ? "pointer-events-none" : "pointer-events-auto"
        }`}
      >
        {isOverview || !focused ? (
          <>
            <p className="text-[0.7rem] tracking-wide text-neutral-400 uppercase">
              Overview
            </p>
            <div className="flex flex-col items-start gap-3">
              <h1 className="font-heading text-2xl text-balance lg:text-4xl">
                All works
              </h1>
              <p className="font-body text-sm text-neutral-600 lg:text-base">
                Cases in a grid. Scroll to pull one into a stack; previous and
                next stay in view.
              </p>
            </div>
          </>
        ) : (
          <>
            <p className="text-[0.7rem] tracking-wide text-neutral-400 uppercase">
              {slide} / {lastSlide}
            </p>
            <div className="flex flex-col items-start gap-3">
              <EyebrowLabel color={focused.color}>{focused.subtitle}</EyebrowLabel>
              <h1 className="font-heading text-2xl text-balance lg:text-4xl">
                {focused.title}
              </h1>
              <p className="font-body text-sm text-neutral-600 lg:text-base">
                {focused.description}
              </p>
              <Button
                type="button"
                title={playing ? "Disc is playing" : "Open the case"}
                onClick={playLearnMore}
                onPointerEnter={() => setHover(true)}
                onPointerLeave={() => setHover(false)}
                onFocus={() => setHover(true)}
                onBlur={() => setHover(false)}
              >
                {playing ? "Playing" : "Learn more"}
              </Button>
            </div>
          </>
        )}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={slide === 0}
            onClick={() => goRelative(-1)}
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={slide === lastSlide}
            onClick={() => goRelative(1)}
          >
            Next
          </Button>
        </div>
        <p className="hidden text-xs text-neutral-400 lg:block">
          Hover a case for a pointer. Click a case or Learn more to play.{" "}
          <Link href="/work-3d-preview" className="underline underline-offset-2">
            Jewel case studio
          </Link>
          {" · "}
          <Link href="/work" className="underline underline-offset-2">
            /work
          </Link>{" "}
          is unchanged.
        </p>
      </aside>
    </>
  );
}
