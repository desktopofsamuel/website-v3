"use client";

import { useRef, useState } from "react";
import LightboxCore, {
  type LightboxCoreHandle,
  type LightboxCoreProps,
} from "@/components/LightboxCore";
import {
  DEFAULT_CONFIG,
  DIRECTIONS,
  type Direction,
} from "@/components/lightbox-util";

export default function LightboxDebug(props: LightboxCoreProps) {
  const coreRef = useRef<LightboxCoreHandle>(null);
  const [direction, setDirection] = useState<Direction>(DEFAULT_CONFIG.direction);
  const [speed, setSpeed] = useState(DEFAULT_CONFIG.speed);
  const [spring, setSpring] = useState(DEFAULT_CONFIG.spring);
  const [delay, setDelay] = useState(DEFAULT_CONFIG.delay);
  const [copied, setCopied] = useState(false);

  const effectiveDirection: Direction =
    direction === "zoom" && !props.originRect ? "scale" : direction;

  return (
    <>
      <LightboxCore
        ref={coreRef}
        {...props}
        config={{ direction, speed, spring, delay }}
      />

      {props.item && (
        <div
          className="fixed bottom-4 left-4 z-[2001] w-56 bg-black/85 text-white p-3 rounded-md flex flex-col gap-3 backdrop-blur-sm border border-white/10 font-mono text-xs"
          onClick={(e) => e.stopPropagation()}
          role="region"
          aria-label="Animation tweaks (development only)"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-white/50">
              Tweaks · dev
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => coreRef.current?.replay()}
                className="text-[10px] uppercase tracking-widest text-white/60 hover:text-white transition-colors"
                aria-label="Replay entry animation"
              >
                ↻ replay
              </button>
              <button
                onClick={() => {
                  const config = {
                    direction: effectiveDirection,
                    speed,
                    spring,
                    delay,
                  };
                  navigator.clipboard.writeText(JSON.stringify(config));
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 1500);
                }}
                className="text-[10px] uppercase tracking-widest text-white/60 hover:text-white transition-colors"
                aria-label="Copy tweak config to clipboard"
                title="Copy as JSON"
              >
                {copied ? "✓ copied" : "⧉ copy"}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-white/60">
              <span>Direction</span>
              {direction === "zoom" && !props.originRect && (
                <span
                  className="text-[10px] uppercase tracking-widest text-amber-300/80"
                  title="No originRect passed — zoom falls back to scale"
                >
                  no origin
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-1">
              {DIRECTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDirection(d)}
                  className={`px-2 py-1 rounded border transition-colors capitalize ${
                    direction === d
                      ? "bg-white/20 border-white/50 text-white"
                      : "border-white/15 text-white/60 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-white/60">
              <span>Speed</span>
              <span className="text-white">{speed.toFixed(2)}×</span>
            </div>
            <input
              type="range"
              min={0.25}
              max={4}
              step={0.25}
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-full accent-white"
              aria-label="Animation speed"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-white/60">
              <span>Spring</span>
              <span className="text-white">
                {spring === 0 ? "off" : spring.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={5}
              step={0.1}
              value={spring}
              onChange={(e) => setSpring(parseFloat(e.target.value))}
              className="w-full accent-white"
              aria-label="Spring overshoot (back.out)"
            />
            <span className="text-[10px] text-white/40">
              {spring === 0 ? "power3.out" : `back.out(${spring.toFixed(1)})`}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-white/60">
              <span>Photo delay</span>
              <span className="text-white">{delay.toFixed(2)}s</span>
            </div>
            <input
              type="range"
              min={0}
              max={0.5}
              step={0.02}
              value={delay}
              onChange={(e) => setDelay(parseFloat(e.target.value))}
              className="w-full accent-white"
              aria-label="Delay before photo animates in (after overlay)"
            />
            <span className="text-[10px] text-white/40">
              overlay fires immediately, photo waits {delay.toFixed(2)}s
            </span>
          </div>

          <button
            onClick={() => {
              setDirection(DEFAULT_CONFIG.direction);
              setSpeed(DEFAULT_CONFIG.speed);
              setSpring(DEFAULT_CONFIG.spring);
              setDelay(DEFAULT_CONFIG.delay);
            }}
            className="self-end text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors"
          >
            reset
          </button>
        </div>
      )}
    </>
  );
}
