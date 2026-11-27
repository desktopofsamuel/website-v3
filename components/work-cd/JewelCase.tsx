"use client";

import { useEffect, useRef, useState } from "react";
import Link from "@/components/AppLink";
import { DUMMY_ALBUMS } from "@/lib/work-cd/albums";
import { DEFAULT_GLASS_TUNE, type GlassTune } from "./jewel-case-art";
import type { JewelCaseHandle } from "./jewel-case-scene";

export default function JewelCase() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<JewelCaseHandle | null>(null);
  const albumIndexRef = useRef(0);
  const openRef = useRef(0.18);
  const spinningRef = useRef(false);
  const [albumIndex, setAlbumIndex] = useState(0);
  const [open, setOpen] = useState(0.18);
  const [spinning, setSpinning] = useState(false);
  const [glass, setGlass] = useState<GlassTune>(DEFAULT_GLASS_TUNE);
  const [status, setStatus] = useState("Loading model…");
  openRef.current = open;
  spinningRef.current = spinning;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let cancelled = false;
    let handle: JewelCaseHandle | null = null;

    import("./jewel-case-scene").then(({ mountJewelCase }) => {
      if (cancelled) return;
      handle = mountJewelCase(canvas, {
        album: DUMMY_ALBUMS[albumIndexRef.current],
        open: openRef.current,
        spinning: spinningRef.current,
        onStatus: setStatus,
        printMode: "d",
      });
      handle.setAlbum(DUMMY_ALBUMS[albumIndexRef.current]);
      handle.setOpen(openRef.current);
      handle.setSpinning(spinningRef.current);
      handleRef.current = handle;
    });

    return () => {
      cancelled = true;
      document.body.style.overflow = previousOverflow;
      handle?.dispose();
      handleRef.current = null;
    };
    // Scene mounts once. Album, lid, and spin go through the handle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    handleRef.current?.setGlassTune(glass);
  }, [glass]);

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
      <aside className="absolute top-4 left-4 z-10 w-[min(20rem,calc(100vw-2rem))] rounded-xl bg-black/70 p-4 text-white shadow-lg backdrop-blur-sm">
        <p className="text-[0.7rem] tracking-wide text-white/55 uppercase">
          Hidden study · /work-3d-preview
        </p>
        <h1 className="font-heading mt-1 text-lg">Photoreal jewel case</h1>
        <p className="mt-2 text-sm text-white/80">
          Dummy booklet, disc, and back cover on the photoreal mesh.{" "}
          <Link href="/dev/work-cd/demo" className="underline decoration-white/40 underline-offset-2">
            Print demos A–D
          </Link>
          {" · "}
          <Link href="/dev/work-cd" className="underline decoration-white/40 underline-offset-2">
            Cover Flow index
          </Link>
          {" · "}
          <Link href="/work" className="underline decoration-white/40 underline-offset-2">
            /work
          </Link>{" "}
          is unchanged.
        </p>
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
        <p className="mt-3 text-[0.65rem] tracking-wide text-white/50 uppercase">
          Lid transmission
        </p>
        <label className="mt-1 block text-xs text-white/70">
          Buffer blur {glass.blur.toFixed(2)}
          <input
            type="range"
            min={0}
            max={2}
            step={0.01}
            value={glass.blur}
            onChange={(event) =>
              setGlass((g) => ({ ...g, blur: Number(event.target.value) }))
            }
            className="mt-1 w-full"
          />
        </label>
        <label className="mt-2 block text-xs text-white/70">
          Glass roughness {glass.roughness.toFixed(3)}
          <input
            type="range"
            min={0}
            max={0.2}
            step={0.001}
            value={glass.roughness}
            onChange={(event) =>
              setGlass((g) => ({ ...g, roughness: Number(event.target.value) }))
            }
            className="mt-1 w-full"
          />
        </label>
        <label className="mt-2 block text-xs text-white/70">
          Glass thickness {glass.thickness.toFixed(4)}
          <input
            type="range"
            min={0}
            max={0.02}
            step={0.0001}
            value={glass.thickness}
            onChange={(event) =>
              setGlass((g) => ({ ...g, thickness: Number(event.target.value) }))
            }
            className="mt-1 w-full"
          />
        </label>
        <label className="mt-2 block text-xs text-white/70">
          Glass IOR {glass.ior.toFixed(2)}
          <input
            type="range"
            min={1}
            max={1.8}
            step={0.01}
            value={glass.ior}
            onChange={(event) =>
              setGlass((g) => ({ ...g, ior: Number(event.target.value) }))
            }
            className="mt-1 w-full"
          />
        </label>
        <label className="mt-2 flex items-center gap-2 text-xs text-white/80">
          <input
            type="checkbox"
            checked={spinning}
            onChange={(event) => setSpinning(event.target.checked)}
          />
          Spin the disc
        </label>
      </aside>
      <p className="pointer-events-none absolute right-4 bottom-4 text-xs text-black/45">
        Q or R switches album. Drag to orbit.
      </p>
    </div>
  );
}
