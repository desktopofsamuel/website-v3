"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import type { WorkCaseItem } from "@/lib/work-cd/cases";
import {
  defaultPlayBeats,
  DISC_FLIGHT_REV,
  type PlayBeats,
} from "@/lib/work-cd/play-choreography";
import { workCdSlugFromPath } from "@/lib/work-cd/path";
import { DEFAULT_GLASS_TUNE, type GlassTune } from "./jewel-case-art";
import {
  DEFAULT_CAMERA_TUNE,
  DEFAULT_SHOP_HOVER,
  defaultTune,
  type CameraTune,
  type CaseTune,
  type CoverFlowHandle,
  type ShopHoverTune,
} from "./cover-flow-scene";

type WorkCdStageValue = {
  items: WorkCaseItem[];
  slide: number;
  lastSlide: number;
  isOverview: boolean;
  focused: WorkCaseItem | null;
  focusedTune: CaseTune | null;
  playing: boolean;
  sceneReady: boolean;
  status: string;
  routeSlug: string | null;
  camera: CameraTune;
  shopHover: ShopHoverTune;
  glass: GlassTune;
  goToSlide: (index: number) => void;
  goRelative: (delta: number) => void;
  playLearnMore: () => void;
  playProgress: number;
  setPlayProgress: (progress: number) => void;
  closeProgress: number;
  setCloseProgress: (progress: number) => void;
  playBeats: PlayBeats;
  setPlayBeats: (patch: Partial<PlayBeats>) => void;
  resetPlayBeats: () => void;
  setReadAmount: (amount: number) => void;
  eject: () => void;
  setHover: (hovering: boolean) => void;
  patchTune: (index: number, patch: Partial<CaseTune>) => void;
  resetFocused: () => void;
  setCamera: Dispatch<SetStateAction<CameraTune>>;
  setShopHover: Dispatch<SetStateAction<ShopHoverTune>>;
  setGlass: Dispatch<SetStateAction<GlassTune>>;
  returning: boolean;
  typesetReady: boolean;
};

const WorkCdContext = createContext<WorkCdStageValue | null>(null);

export function useWorkCd() {
  const value = useContext(WorkCdContext);
  if (!value) {
    throw new Error("useWorkCd must be used inside WorkCdStage");
  }
  return value;
}

type WorkCdStageProps = {
  items: WorkCaseItem[];
  children: ReactNode;
};

export default function WorkCdStage({ items, children }: WorkCdStageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<CoverFlowHandle | null>(null);
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const slideRef = useRef(0);
  const playingRef = useRef(false);
  const hadPlayedRef = useRef(false);
  const pendingNavRef = useRef<number | null>(null);
  const navigatingRef = useRef<string | null>(null);
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;
  const router = useRouter();
  const routeSlug = workCdSlugFromPath(pathname);
  const routeSlugRef = useRef(routeSlug);
  routeSlugRef.current = routeSlug;

  const [slide, setSlide] = useState(0);
  const [sceneReady, setSceneReady] = useState(false);
  const [status, setStatus] = useState("Loading cases…");
  const [tunes, setTunes] = useState<CaseTune[]>(() =>
    items.map((_, i) => defaultTune(i)),
  );
  const [camera, setCamera] = useState<CameraTune>(DEFAULT_CAMERA_TUNE);
  const [shopHover, setShopHover] = useState<ShopHoverTune>(DEFAULT_SHOP_HOVER);
  const [glass, setGlass] = useState<GlassTune>(DEFAULT_GLASS_TUNE);
  const [returning, setReturning] = useState(false);
  const returningRef = useRef(false);
  returningRef.current = returning;
  const [playing, setPlaying] = useState(false);
  playingRef.current = playing;
  const [typesetReady, setTypesetReady] = useState(false);
  const [veilOn, setVeilOn] = useState(false);
  const [playerPeek, setPlayerPeek] = useState(false);
  const [playProgress, setPlayProgressState] = useState(0);
  const [closeProgress, setCloseProgressState] = useState(0);
  const [playBeats, setPlayBeatsState] = useState<PlayBeats>(defaultPlayBeats);

  const lastSlide = items.length;
  const isOverview = slide === 0;
  const focused = isOverview ? null : items[slide - 1];
  const focusedTune = isOverview ? null : tunes[slide - 1];

  function navigateTo(href: string) {
    if (pathnameRef.current === href || navigatingRef.current === href) return;
    navigatingRef.current = href;
    router.push(href, { scroll: false });
  }
  const navigateToRef = useRef(navigateTo);
  navigateToRef.current = navigateTo;

  useEffect(() => {
    navigatingRef.current = null;
  }, [pathname]);

  function goToSlide(index: number) {
    const next = Math.max(0, Math.min(index, lastSlide));
    if (playingRef.current) {
      pendingNavRef.current = next;
      handleRef.current?.setSlide(next);
      return;
    }
    pendingNavRef.current = null;
    slideRef.current = next;
    setSlide(next);
    handleRef.current?.setSlide(next);
  }

  function goRelative(delta: number) {
    const base =
      playingRef.current && pendingNavRef.current !== null
        ? pendingNavRef.current
        : slideRef.current;
    goToSlide(base + delta);
  }

  function playLearnMore() {
    setPlayProgressState(0);
    setCloseProgressState(0);
    handleRef.current?.playLearnMore();
  }

  function setPlayProgress(progress: number) {
    setPlayProgressState(progress);
    setCloseProgressState(0);
    handleRef.current?.setPlayProgress(progress);
  }

  function setCloseProgress(progress: number) {
    setCloseProgressState(progress);
    if (progress > 0.001) setPlayProgressState(1);
    handleRef.current?.setCloseProgress?.(progress);
  }

  function setPlayBeats(patch: Partial<PlayBeats>) {
    setPlayBeatsState((prev) => {
      const next = { ...prev, ...patch };
      handleRef.current?.setPlayBeats(next);
      return next;
    });
  }

  function resetPlayBeats() {
    const next = defaultPlayBeats();
    setPlayBeatsState(next);
    handleRef.current?.setPlayBeats(next);
  }

  function setReadAmount(amount: number) {
    handleRef.current?.setReadAmount?.(amount);
  }

  function eject() {
    if (returningRef.current) return;
    returningRef.current = true;
    setPlayerPeek(false);
    handleRef.current?.setPlayerPeek?.(false);
    setReturning(true);
    handleRef.current?.eject();
  }

  function setHover(hovering: boolean) {
    handleRef.current?.setHover(hovering);
  }

  function patchTune(index: number, patch: Partial<CaseTune>) {
    setTunes((prev) => {
      const next = prev.map((tune, i) =>
        i === index ? { ...tune, ...patch } : tune,
      );
      handleRef.current?.setTune(index, next[index]);
      return next;
    });
  }

  function resetFocused() {
    if (isOverview) return;
    patchTune(slide - 1, defaultTune(slide - 1));
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || itemsRef.current.length === 0) return;
    let cancelled = false;
    let handle: CoverFlowHandle | null = null;
    const list = itemsRef.current;
    playingRef.current = false;
    hadPlayedRef.current = false;
    setPlaying(false);

    import("./cover-flow-scene").then(({ mountCoverFlow }) => {
      if (cancelled) return;
      handle = mountCoverFlow(canvas, {
        items: list.map((item) => ({ slug: item.slug, album: item.album })),
        slide: 0,
        tunes: list.map((_, i) => defaultTune(i)),
        camera: DEFAULT_CAMERA_TUNE,
        onSlide: (index) => {
          slideRef.current = index;
          pendingNavRef.current = null;
          setSlide(index);
          setPlaying(false);
        },
        onStatus: setStatus,
        onPlaying: (next) => {
          playingRef.current = next;
          if (next) hadPlayedRef.current = true;
          setPlaying(next);
        },
        onPhase: (phase) => {
          if (phase !== "spinning") {
            setTypesetReady(false);
            setVeilOn(false);
            return;
          }
          const item = itemsRef.current[slideRef.current - 1];
          if (!item) return;
          setVeilOn(true);
          navigateToRef.current(`/dev/work-cd/${item.slug}`);
        },
      });
      handleRef.current = handle;
      setSceneReady(true);
    });

    return () => {
      cancelled = true;
      setTypesetReady(false);
      setVeilOn(false);
      setSceneReady(false);
      handle?.dispose();
      handleRef.current = null;
    };
    // Persist the WebGL context across index ↔ detail. Remount when disc
    // flight math changes — Fast Refresh does not rebuild the empty-deps scene.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DISC_FLIGHT_REV]);

  useEffect(() => {
    if (!veilOn || !routeSlug || returning) return;
    setTypesetReady(true);
  }, [veilOn, routeSlug, returning]);

  useEffect(() => {
    handleRef.current?.setCameraTune(camera);
  }, [camera]);

  useEffect(() => {
    handleRef.current?.setShopHoverTune(shopHover);
  }, [shopHover, sceneReady]);

  useEffect(() => {
    handleRef.current?.setGlassTune(glass);
  }, [glass, sceneReady]);

  useEffect(() => {
    handleRef.current?.setPlayBeats(playBeats);
  }, [playBeats, sceneReady]);

  useEffect(() => {
    if (!sceneReady) return;
    if (!routeSlug) {
      if (playingRef.current) handleRef.current?.eject();
      return;
    }
    if (playingRef.current) return;
    const index = items.findIndex((item) => item.slug === routeSlug);
    if (index < 0) return;
    slideRef.current = index + 1;
    setSlide(index + 1);
    handleRef.current?.setSlide(index + 1, { immediate: true });
    handleRef.current?.playLearnMore({ instant: true });
  }, [sceneReady, routeSlug, items]);

  useEffect(() => {
    if (playing) {
      hadPlayedRef.current = true;
      returningRef.current = false;
      setReturning(false);
      return;
    }
    if (!hadPlayedRef.current) return;
    hadPlayedRef.current = false;
    returningRef.current = false;
    setReturning(false);
    if (routeSlugRef.current) navigateToRef.current("/dev/work-cd");
  }, [playing]);

  useEffect(() => {
    setPlayProgressState(0);
    setCloseProgressState(0);
    handleRef.current?.setPlayProgress(0);
    handleRef.current?.setCloseProgress?.(0);
  }, [slide]);

  useEffect(() => {
    if (routeSlug) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        goRelative(1);
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        goRelative(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [routeSlug, lastSlide]);

  const value = useMemo<WorkCdStageValue>(
    () => ({
      items,
      slide,
      lastSlide,
      isOverview,
      focused: focused ?? null,
      focusedTune: focusedTune ?? null,
      playing,
      sceneReady,
      status,
      routeSlug,
      camera,
      shopHover,
      glass,
      goToSlide,
      goRelative,
      playLearnMore,
      playProgress,
      setPlayProgress,
      closeProgress,
      setCloseProgress,
      playBeats,
      setPlayBeats,
      resetPlayBeats,
      setReadAmount,
      eject,
      setHover,
      patchTune,
      resetFocused,
      setCamera,
      setShopHover,
      setGlass,
      returning,
      typesetReady,
    }),
    [
      items,
      slide,
      lastSlide,
      isOverview,
      focused,
      focusedTune,
      playing,
      sceneReady,
      status,
      routeSlug,
      camera,
      shopHover,
      glass,
      returning,
      typesetReady,
      playProgress,
      closeProgress,
      playBeats,
    ],
  );

  return (
    <WorkCdContext.Provider value={value}>
      <div
        className="work-cd-shell relative h-dvh w-full overflow-hidden bg-[#efece6] text-neutral-900"
        data-typeset-ready={typesetReady ? "true" : "false"}
        data-player-peek={playerPeek ? "true" : "false"}
        data-returning={returning ? "true" : "false"}
      >
        <canvas
          ref={canvasRef}
          className={`work-cd-stage absolute inset-0 z-20 block h-full w-full ${
            routeSlug ? "pointer-events-none" : ""
          }`}
        />
        <div
          aria-hidden
          className={`work-cd-veil pointer-events-none absolute inset-0 z-[8] ${
            veilOn && !returning ? "work-cd-veil-on" : ""
          } ${returning ? "work-cd-veil-out" : ""}`}
        />
        <p className="sr-only">{status}</p>
        {children}
        {playing && typesetReady && !returning ? (
          <>
            <button
              type="button"
              className="work-cd-player-peek"
              aria-label="Eject disc"
              onPointerEnter={() => {
                setPlayerPeek(true);
                handleRef.current?.setPlayerPeek?.(true);
              }}
              onPointerLeave={() => {
                setPlayerPeek(false);
                handleRef.current?.setPlayerPeek?.(false);
              }}
              onClick={eject}
            />
            <div className="pointer-events-none absolute inset-x-0 top-5 z-30 flex justify-center">
              <button
                type="button"
                className="work-cd-eject pointer-events-auto rounded-full bg-black/80 px-6 py-2.5 font-heading text-sm text-white shadow-lg backdrop-blur-sm hover:bg-black"
                onClick={eject}
              >
                Eject
              </button>
            </div>
          </>
        ) : null}
      </div>
    </WorkCdContext.Provider>
  );
}
