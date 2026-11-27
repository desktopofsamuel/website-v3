"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import {
  activeCloseSegment,
  activePlaySegment,
  beatsSnippet,
  closeReturnShare,
  CLOSE_SEGMENTS,
  PLAY_SEGMENTS,
  type PlayBeats,
} from "@/lib/work-cd/play-choreography";

type Props = {
  progress: number;
  onProgress: (value: number) => void;
  closeProgress: number;
  onCloseProgress: (value: number) => void;
  beats: PlayBeats;
  onBeats: (patch: Partial<PlayBeats>) => void;
  onReset: () => void;
};

const SEGMENT_CLASS: Record<string, string> = {
  open: "bg-white/25",
  extract: "bg-sky-400/80",
  zoom: "bg-violet-400/90",
};

const CLOSE_CLASS: Record<string, string> = {
  return: "bg-rose-400/80",
  lid: "bg-orange-300/80",
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function headFromClientX(track: HTMLElement, clientX: number) {
  const rect = track.getBoundingClientRect();
  if (rect.width <= 0) return 0;
  return clamp((clientX - rect.left) / rect.width, 0, 1);
}

export default function WorkCdPlayTimeline({
  progress,
  onProgress,
  closeProgress,
  onCloseProgress,
  beats,
  onBeats,
  onReset,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const closeTrackRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const now = activePlaySegment(progress, beats);
  const closeNow = activeCloseSegment(closeProgress, beats);
  const returnShare = closeReturnShare(beats);

  function jump(head: number) {
    onProgress(clamp(head, 0, 1));
  }

  function onTrackPointer(event: ReactPointerEvent<HTMLDivElement>) {
    const track = trackRef.current;
    if (!track) return;
    track.setPointerCapture(event.pointerId);
    jump(headFromClientX(track, event.clientX));
  }

  function onTrackMove(event: ReactPointerEvent<HTMLDivElement>) {
    const track = trackRef.current;
    if (!track || !track.hasPointerCapture(event.pointerId)) return;
    jump(headFromClientX(track, event.clientX));
  }

  function jumpClose(head: number) {
    onCloseProgress(clamp(head, 0, 1));
  }

  function onCloseTrackPointer(event: ReactPointerEvent<HTMLDivElement>) {
    const track = closeTrackRef.current;
    if (!track) return;
    track.setPointerCapture(event.pointerId);
    jumpClose(headFromClientX(track, event.clientX));
  }

  function onCloseTrackMove(event: ReactPointerEvent<HTMLDivElement>) {
    const track = closeTrackRef.current;
    if (!track || !track.hasPointerCapture(event.pointerId)) return;
    jumpClose(headFromClientX(track, event.clientX));
  }

  function dragBound(
    event: ReactPointerEvent<HTMLButtonElement>,
    key: "SEAT_START" | "SEAT_END",
  ) {
    event.preventDefault();
    event.stopPropagation();
    const track = trackRef.current;
    if (!track) return;
    const min =
      key === "SEAT_START" ? beats.EXTRACT_CLEAR + 0.02 : beats.SEAT_START + 0.4;
    const max = key === "SEAT_START" ? beats.SEAT_END - 0.4 : 1;
    const move = (clientX: number) => {
      const next = Number(clamp(headFromClientX(track, clientX), min, max).toFixed(3));
      onBeats({ [key]: next });
      onProgress(next);
    };
    move(event.clientX);
    const onMove = (ev: PointerEvent) => move(ev.clientX);
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  async function copyBeats() {
    await navigator.clipboard.writeText(beatsSnippet(beats));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="mt-2 flex flex-col gap-2 border-t border-white/15 pt-2">
      <p className="text-[0.65rem] tracking-wide text-white/50 uppercase">
        Play timeline
        <span className="ml-2 normal-case tracking-normal text-white/80">
          {PLAY_SEGMENTS.find((segment) => segment.id === now)?.label ?? now}
        </span>
      </p>
      <p className="text-[0.65rem] leading-snug text-white/45">
        Click the play bar to scrub inbound. The close bar previews eject:
        return to the case, then the lid.
      </p>
      <div
        ref={trackRef}
        role="slider"
        aria-label="Playhead"
        aria-valuemin={0}
        aria-valuemax={1}
        aria-valuenow={Number(progress.toFixed(3))}
        tabIndex={0}
        className="relative h-8 cursor-ew-resize overflow-hidden rounded-md bg-black/40"
        onPointerDown={onTrackPointer}
        onPointerMove={onTrackMove}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") jump(progress + 0.01);
          if (event.key === "ArrowLeft") jump(progress - 0.01);
        }}
      >
        {PLAY_SEGMENTS.map((segment) => {
          const start = beats[segment.startKey];
          const end = beats[segment.endKey];
          return (
            <div
              key={segment.id}
              className={`absolute top-0 h-full ${SEGMENT_CLASS[segment.id] ?? "bg-white/20"}`}
              style={{
                left: `${start * 100}%`,
                width: `${Math.max(end - start, 0) * 100}%`,
              }}
              title={`${segment.label} ${start.toFixed(2)}–${end.toFixed(2)}`}
            />
          );
        })}
        <span
          className="pointer-events-none absolute top-0 z-10 h-full w-0.5 bg-white shadow"
          style={{ left: `${progress * 100}%` }}
        />
        {(
          [
            ["SEAT_START", beats.SEAT_START, "Zoom"],
            ["SEAT_END", beats.SEAT_END, "End"],
          ] as const
        ).map(([key, head, label]) => (
          <button
            key={key}
            type="button"
            aria-label={`Move ${label} keyframe`}
            className="absolute top-0 z-20 h-full w-2 -translate-x-1/2 cursor-ew-resize bg-white/0"
            style={{ left: `${head * 100}%` }}
            onPointerDown={(event) => dragBound(event, key)}
          >
            <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-white" />
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1">
        {PLAY_SEGMENTS.map((segment) => (
          <button
            key={segment.id}
            type="button"
            title={segment.hint}
            className={`rounded px-1.5 py-0.5 text-[0.6rem] uppercase tracking-wide ${
              now === segment.id ? "bg-white text-black" : "bg-white/15 text-white/80"
            }`}
            onClick={() => jump(beats[segment.startKey])}
          >
            {segment.label} {beats[segment.startKey].toFixed(2)}
          </button>
        ))}
      </div>
      <label className="block text-[0.65rem] tracking-wide text-white/55 uppercase">
        <span className="flex justify-between gap-2 font-medium">
          Playhead
          <span className="tabular-nums text-white/80">{progress.toFixed(2)}</span>
        </span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={progress}
          onChange={(event) => onProgress(Number(event.target.value))}
          className="mt-1 w-full accent-white"
        />
      </label>
      <label className="block text-[0.65rem] tracking-wide text-white/55 uppercase">
        <span className="flex justify-between gap-2 font-medium">
          Extract seconds
          <span className="tabular-nums text-white/80">
            {beats.EXTRACT_FLY_DURATION.toFixed(2)}s
          </span>
        </span>
        <input
          type="range"
          min={0.15}
          max={0.4}
          step={0.01}
          value={beats.EXTRACT_FLY_DURATION}
          onChange={(event) =>
            onBeats({ EXTRACT_FLY_DURATION: Number(event.target.value) })
          }
          className="mt-1 w-full accent-white"
        />
      </label>
      <label className="block text-[0.65rem] tracking-wide text-white/55 uppercase">
        <span className="flex justify-between gap-2 font-medium">
          Zoom seconds
          <span className="tabular-nums text-white/80">
            {beats.SEAT_DURATION.toFixed(2)}s
          </span>
        </span>
        <input
          type="range"
          min={1.6}
          max={3}
          step={0.05}
          value={beats.SEAT_DURATION}
          onChange={(event) => onBeats({ SEAT_DURATION: Number(event.target.value) })}
          className="mt-1 w-full accent-white"
        />
      </label>
      <p className="text-[0.65rem] tracking-wide text-white/50 uppercase">
        Close timeline
        <span className="ml-2 normal-case tracking-normal text-white/80">
          {CLOSE_SEGMENTS.find((segment) => segment.id === closeNow)?.label ?? closeNow}
        </span>
      </p>
      <div
        ref={closeTrackRef}
        role="slider"
        aria-label="Close playhead"
        aria-valuemin={0}
        aria-valuemax={1}
        aria-valuenow={Number(closeProgress.toFixed(3))}
        tabIndex={0}
        className="relative h-8 cursor-ew-resize overflow-hidden rounded-md bg-black/40"
        onPointerDown={onCloseTrackPointer}
        onPointerMove={onCloseTrackMove}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") jumpClose(closeProgress + 0.01);
          if (event.key === "ArrowLeft") jumpClose(closeProgress - 0.01);
        }}
      >
        <div
          className={`absolute top-0 h-full ${CLOSE_CLASS.return}`}
          style={{ left: "0%", width: `${returnShare * 100}%` }}
          title={`Return 0.00–${returnShare.toFixed(2)}`}
        />
        <div
          className={`absolute top-0 h-full ${CLOSE_CLASS.lid}`}
          style={{
            left: `${returnShare * 100}%`,
            width: `${(1 - returnShare) * 100}%`,
          }}
          title={`Lid ${returnShare.toFixed(2)}–1.00`}
        />
        <span
          className="pointer-events-none absolute top-0 z-10 h-full w-0.5 bg-white shadow"
          style={{ left: `${closeProgress * 100}%` }}
        />
      </div>
      <div className="flex flex-wrap gap-1">
        {CLOSE_SEGMENTS.map((segment) => {
          const head = segment.id === "return" ? 0 : returnShare;
          return (
            <button
              key={segment.id}
              type="button"
              title={segment.hint}
              className={`rounded px-1.5 py-0.5 text-[0.6rem] uppercase tracking-wide ${
                closeNow === segment.id && closeProgress > 0.001
                  ? "bg-white text-black"
                  : "bg-white/15 text-white/80"
              }`}
              onClick={() => jumpClose(head)}
            >
              {segment.label} {head.toFixed(2)}
            </button>
          );
        })}
      </div>
      <label className="block text-[0.65rem] tracking-wide text-white/55 uppercase">
        <span className="flex justify-between gap-2 font-medium">
          Close playhead
          <span className="tabular-nums text-white/80">
            {closeProgress.toFixed(2)}
          </span>
        </span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={closeProgress}
          onChange={(event) => onCloseProgress(Number(event.target.value))}
          className="mt-1 w-full accent-white"
        />
      </label>
      <label className="block text-[0.65rem] tracking-wide text-white/55 uppercase">
        <span className="flex justify-between gap-2 font-medium">
          Close seconds
          <span className="tabular-nums text-white/80">
            {beats.RETURN_DURATION.toFixed(2)}s
          </span>
        </span>
        <input
          type="range"
          min={0.5}
          max={1.7}
          step={0.05}
          value={beats.RETURN_DURATION}
          onChange={(event) =>
            onBeats({ RETURN_DURATION: Number(event.target.value) })
          }
          className="mt-1 w-full accent-white"
        />
      </label>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={copyBeats}
          className="text-[0.65rem] text-white/60 underline underline-offset-2"
        >
          {copied ? "Copied" : "Copy beats"}
        </button>
        <button
          type="button"
          onClick={() => {
            onProgress(0);
            onCloseProgress(0);
            onReset();
          }}
          className="text-[0.65rem] text-white/60 underline underline-offset-2"
        >
          Reset timeline
        </button>
      </div>
    </div>
  );
}
