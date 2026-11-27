"use client";

import { useEffect, useRef, useState } from "react";
import Link from "@/components/AppLink";
import { DUMMY_ALBUMS } from "@/lib/work-cd/albums";
import { PRINT_DEMOS, printDemoById, type PrintDemoId } from "@/lib/work-cd/print-demo";
import type { JewelCaseHandle } from "./jewel-case-scene";

export default function PrintDemo({ mode }: { mode: PrintDemoId }) {
  const demo = printDemoById(mode);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<JewelCaseHandle | null>(null);
  const albumIndexRef = useRef(0);
  const openRef = useRef(0.18);
  const spinningRef = useRef(false);
  const [albumIndex, setAlbumIndex] = useState(0);
  const [open, setOpen] = useState(0.18);
  const [spinning, setSpinning] = useState(false);
  const [status, setStatus] = useState("Loading…");
  openRef.current = open;
  spinningRef.current = spinning;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let cancelled = false;
    let handle: JewelCaseHandle | null = null;

    const mount = async () => {
      if (mode === "b") {
        const { mountCoverPlanes } = await import("./cover-plane-scene");
        if (cancelled) return;
        handle = mountCoverPlanes(canvas, {
          album: DUMMY_ALBUMS[albumIndexRef.current],
          open: openRef.current,
          spinning: spinningRef.current,
          onStatus: setStatus,
        });
      } else {
        const { mountJewelCase } = await import("./jewel-case-scene");
        if (cancelled) return;
        handle = mountJewelCase(canvas, {
          album: DUMMY_ALBUMS[albumIndexRef.current],
          open: openRef.current,
          spinning: spinningRef.current,
          onStatus: setStatus,
          printMode: mode,
        });
      }
      handle.setAlbum(DUMMY_ALBUMS[albumIndexRef.current]);
      handle.setOpen(openRef.current);
      handle.setSpinning(spinningRef.current);
      handleRef.current = handle;
    };

    void mount();

    return () => {
      cancelled = true;
      document.body.style.overflow = previousOverflow;
      handle?.dispose();
      handleRef.current = null;
    };
  }, [mode]);

  useEffect(() => {
    albumIndexRef.current = albumIndex;
    handleRef.current?.setAlbum(DUMMY_ALBUMS[albumIndex]);
  }, [albumIndex]);

  useEffect(() => {
    handleRef.current?.setOpen(open);
  }, [open]);

  useEffect(() => {
    handleRef.current?.setSpinning(spinning);
  }, [spinning]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "q" || event.key === "Q") {
        setAlbumIndex((i) => (i + DUMMY_ALBUMS.length - 1) % DUMMY_ALBUMS.length);
      } else if (event.key === "r" || event.key === "R") {
        setAlbumIndex((i) => (i + 1) % DUMMY_ALBUMS.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative h-dvh w-full bg-[#efece6]">
      <canvas ref={canvasRef} className="block h-full w-full" />
      <aside className="absolute top-4 left-4 z-10 w-[min(22rem,calc(100vw-2rem))] rounded-xl bg-black/70 p-4 text-white shadow-lg backdrop-blur-sm">
        <p className="text-[0.7rem] tracking-wide text-white/55 uppercase">
          Print demo · {demo.letter}
        </p>
        <h1 className="font-heading mt-1 text-lg">{demo.title}</h1>
        <p className="mt-2 text-sm text-white/80">{demo.blurb}</p>
        <p className="mt-2 text-xs text-white/60">{demo.zoom}</p>
        <nav className="mt-3 flex flex-wrap gap-1.5" aria-label="Print demos">
          {PRINT_DEMOS.map((item) => (
            <Link
              key={item.id}
              href={`/dev/work-cd/demo/${item.id}`}
              aria-current={item.id === mode ? "page" : undefined}
              className="rounded-full border border-white/20 px-2.5 py-1 text-xs text-white/85 aria-[current=page]:border-transparent aria-[current=page]:bg-white aria-[current=page]:text-black"
            >
              {item.letter}
            </Link>
          ))}
          <Link
            href="/dev/work-cd/demo"
            className="rounded-full border border-white/20 px-2.5 py-1 text-xs text-white/55"
          >
            All
          </Link>
        </nav>
        <p className="mt-2 text-xs text-amber-200/90" role="status">
          {status}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {DUMMY_ALBUMS.map((album, i) => (
            <button
              key={album.id}
              type="button"
              aria-pressed={i === albumIndex}
              onClick={() => setAlbumIndex(i)}
              className="rounded-full border border-white/20 px-2.5 py-1 text-xs text-white/85 aria-pressed:border-transparent aria-pressed:bg-white aria-pressed:text-black"
            >
              {album.title}
            </button>
          ))}
        </div>
        <label className="mt-3 block text-xs text-white/70">
          Open / reveal
          <input
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={open}
            onChange={(event) => setOpen(Number(event.target.value))}
            className="mt-1 w-full"
          />
        </label>
        <label className="mt-2 flex items-center gap-2 text-xs text-white/80">
          <input
            type="checkbox"
            checked={spinning}
            onChange={(event) => setSpinning(event.currentTarget.checked)}
          />
          Spin the disc
        </label>
      </aside>
      <p className="pointer-events-none absolute right-4 bottom-4 text-xs text-black/45">
        Scroll to zoom. Drag to orbit. Q / R switches album.
      </p>
    </div>
  );
}
