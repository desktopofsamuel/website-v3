/**
 * Named To-player heads. Edit START/END to assign time to a segment.
 *
 *   extract  EXTRACT_START → EXTRACT_CLEAR   (0.22 → 0.42)  short; spin in plane
 *   spin     SPIN_START = EXTRACT_START      in-plane from the first extract frame
 *   stow     STOW_START → STOW_END           (0.43 → 0.50)  case recedes as zoom starts
 *   seat     SEAT_START → SEAT_END           (0.46 → 0.99)  long zoom into the player
 *   return   RETURN_DURATION                 player → case; skip any spin hold
 *
 * The Tune panel timeline live-overrides these. Copy beats back here to persist.
 * Keep in lockstep with cover-flow-scene.ts. `pnpm lint` runs
 * `scripts/check-work-cd-play.mjs` if the order or scene wiring regresses.
 */
export const PLAYER_ENTER = 0.03;

/** extract: disc out the open case front, one ease-in-out. Short. */
export const EXTRACT_START = 0.22;
export const EXTRACT_HEAD = 0.32;
export const CLEAR_OF_PLAYER = 0.4;
export const CASE_GLASS_HELD = 0.42;
export const EXTRACT_CLEAR = 0.42;

/** stow: case recedes once the disc is clear — gone as zoom starts. */
export const STOW_START = 0.43;
export const STOW_END = 0.5;

/** spin: in-plane with extract, not a later in-place hold. */
export const SPIN_START = 0.22;
/** Kept for Tune/copy-beats; autoplay no longer spends this as a hold. */
export const SPIN_DURATION = 0.28;

/** seat / zoom: lift → player well. Gets the bulk of the flying time. */
export const SEAT_START = 0.46;
export const SEAT_END = 0.99;
/** Autoplay seconds for EXTRACT_START → SEAT_START (extract + in-plane spin). */
export const EXTRACT_FLY_DURATION = 0.28;
/** Autoplay seconds for SEAT_START → 1. Raise this to slow the zoom. */
export const SEAT_DURATION = 1.8;
/**
 * Exit seconds: player well → case. Must skip SPIN_DURATION — reversing the
 * full inbound clock left the spinning disc lagging on the way back to center.
 */
export const RETURN_DURATION = 1;
/** Lid close seconds after the disc is home. Keep equal to scene OPEN_DURATION. */
export const CLOSE_LID_DURATION = 0.72;

/** Detail content may typeset. */
export const CONTENT_HEAD = 0.79;

/** Bump when disc flight math changes so WorkCdStage remounts the empty-deps WebGL scene. */
export const DISC_FLIGHT_REV = 30;

export type PlayBeats = {
  PLAYER_ENTER: number;
  EXTRACT_START: number;
  EXTRACT_HEAD: number;
  CLEAR_OF_PLAYER: number;
  CASE_GLASS_HELD: number;
  EXTRACT_CLEAR: number;
  STOW_START: number;
  STOW_END: number;
  SPIN_START: number;
  SPIN_DURATION: number;
  SEAT_START: number;
  SEAT_END: number;
  EXTRACT_FLY_DURATION: number;
  SEAT_DURATION: number;
  RETURN_DURATION: number;
  CONTENT_HEAD: number;
};

export type PlaySegmentId = "open" | "extract" | "zoom";
export type CloseSegmentId = "return" | "lid";

export const PLAY_SEGMENTS: {
  id: PlaySegmentId;
  label: string;
  hint: string;
  startKey: keyof PlayBeats;
  endKey: keyof PlayBeats;
}[] = [
  {
    id: "open",
    label: "Open",
    hint: "Lid opens, player slides in",
    startKey: "PLAYER_ENTER",
    endKey: "EXTRACT_START",
  },
  {
    id: "extract",
    label: "Extract",
    hint: "Out of the case, spinning in plane",
    startKey: "EXTRACT_START",
    endKey: "SEAT_START",
  },
  {
    id: "zoom",
    label: "Zoom",
    hint: "Fly into the player well",
    startKey: "SEAT_START",
    endKey: "SEAT_END",
  },
];

export function defaultPlayBeats(): PlayBeats {
  return {
    PLAYER_ENTER,
    EXTRACT_START,
    EXTRACT_HEAD,
    CLEAR_OF_PLAYER,
    CASE_GLASS_HELD,
    EXTRACT_CLEAR,
    STOW_START,
    STOW_END,
    SPIN_START,
    SPIN_DURATION,
    SEAT_START,
    SEAT_END,
    EXTRACT_FLY_DURATION,
    SEAT_DURATION,
    RETURN_DURATION,
    CONTENT_HEAD,
  };
}

export function beatsSnippet(beats: PlayBeats) {
  return [
    `export const SPIN_START = ${fmt(beats.SPIN_START)};`,
    `export const SPIN_DURATION = ${fmt(beats.SPIN_DURATION)};`,
    `export const SEAT_START = ${fmt(beats.SEAT_START)};`,
    `export const SEAT_END = ${fmt(beats.SEAT_END)};`,
    `export const EXTRACT_FLY_DURATION = ${fmt(beats.EXTRACT_FLY_DURATION)};`,
    `export const SEAT_DURATION = ${fmt(beats.SEAT_DURATION)};`,
    `export const RETURN_DURATION = ${fmt(beats.RETURN_DURATION)};`,
    `export const STOW_START = ${fmt(beats.STOW_START)};`,
    `export const STOW_END = ${fmt(beats.STOW_END)};`,
  ].join("\n");
}

function fmt(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

export function activePlaySegment(head: number, beats: PlayBeats): PlaySegmentId {
  if (head < beats.EXTRACT_START) return "open";
  if (head < beats.SEAT_START) return "extract";
  return "zoom";
}

export function closeReturnShare(beats: PlayBeats) {
  return (
    beats.RETURN_DURATION /
    Math.max(beats.RETURN_DURATION + CLOSE_LID_DURATION, 1e-6)
  );
}

export const CLOSE_SEGMENTS: {
  id: CloseSegmentId;
  label: string;
  hint: string;
}[] = [
  {
    id: "return",
    label: "Return",
    hint: "Spinning disc flies back to the case",
  },
  {
    id: "lid",
    label: "Lid",
    hint: "Lid closes, player slides out",
  },
];

export function activeCloseSegment(
  progress: number,
  beats: PlayBeats,
): CloseSegmentId {
  return progress < closeReturnShare(beats) ? "return" : "lid";
}

export function validatePlayChoreography(beats: PlayBeats = defaultPlayBeats()) {
  const issues: string[] = [];
  const beat = (ok: boolean, message: string) => {
    if (!ok) issues.push(message);
  };

  beat(
    beats.PLAYER_ENTER > 0 && beats.PLAYER_ENTER < beats.EXTRACT_START,
    `playerEnter (${beats.PLAYER_ENTER}) must sit before extract so the player slides in from off-stage`,
  );
  beat(
    beats.EXTRACT_START === 0.22,
    `extractStart must stay at 0.22 (got ${beats.EXTRACT_START})`,
  );
  beat(
    beats.EXTRACT_CLEAR - beats.EXTRACT_START <= 0.28,
    `extract (${beats.EXTRACT_START} → ${beats.EXTRACT_CLEAR}) must stay short`,
  );
  beat(
    beats.EXTRACT_START < beats.EXTRACT_HEAD && beats.EXTRACT_HEAD < beats.EXTRACT_CLEAR,
    `extractThroughCase (${beats.EXTRACT_HEAD}) must sit between extractStart (${beats.EXTRACT_START}) and extractClear (${beats.EXTRACT_CLEAR})`,
  );
  beat(
    beats.EXTRACT_CLEAR >= beats.CLEAR_OF_PLAYER &&
      beats.CLEAR_OF_PLAYER < beats.SEAT_START,
    `clearOfPlayer (${beats.CLEAR_OF_PLAYER}) must sit in extract, before zoom (${beats.SEAT_START})`,
  );
  beat(
    beats.STOW_START > beats.CASE_GLASS_HELD,
    `stowStart (${beats.STOW_START}) must be after ${beats.CASE_GLASS_HELD} so the case/glass is still present at that head`,
  );
  beat(
    beats.EXTRACT_CLEAR <= beats.STOW_START,
    `case must not stow (${beats.STOW_START}) before the disc has cleared the case (${beats.EXTRACT_CLEAR})`,
  );
  beat(
    beats.SPIN_START === beats.EXTRACT_START,
    `spin (${beats.SPIN_START}) must start with extract (${beats.EXTRACT_START}), in plane`,
  );
  beat(
    beats.SEAT_START > beats.EXTRACT_CLEAR && beats.SEAT_START < beats.SEAT_END,
    `seat (${beats.SEAT_START} → ${beats.SEAT_END}) must start after extractClear (${beats.EXTRACT_CLEAR})`,
  );
  beat(
    beats.SEAT_END - beats.SEAT_START >= 0.4,
    `seat span (${(beats.SEAT_END - beats.SEAT_START).toFixed(2)}) is too short — zoom needs the bulk of the head`,
  );
  beat(
    beats.SEAT_DURATION >= 1.6,
    `SEAT_DURATION (${beats.SEAT_DURATION}s) is too short for the zoom`,
  );
  beat(
    beats.EXTRACT_FLY_DURATION > 0 && beats.EXTRACT_FLY_DURATION <= 0.4,
    `EXTRACT_FLY_DURATION (${beats.EXTRACT_FLY_DURATION}s) must stay a short extract`,
  );
  beat(
    beats.STOW_END >= beats.SEAT_START && beats.STOW_END > beats.STOW_START,
    `stowEnd (${beats.STOW_END}) must meet zoom (${beats.SEAT_START}), not hang until the disc is seated`,
  );
  beat(
    beats.STOW_END < beats.SEAT_END,
    `stowEnd (${beats.STOW_END}) must finish before seatEnd (${beats.SEAT_END}) — the case was staying through the whole zoom`,
  );
  beat(
    beats.RETURN_DURATION >= 0.5 &&
      beats.RETURN_DURATION <= beats.EXTRACT_FLY_DURATION + beats.SEAT_DURATION,
    `return (${beats.RETURN_DURATION}s) must skip the spin hold and not exceed extract+zoom travel`,
  );
  beat(
    beats.CONTENT_HEAD === 0.79,
    `content must reveal at 0.79 (got ${beats.CONTENT_HEAD})`,
  );
  beat(
    CLOSE_LID_DURATION === 0.72,
    `CLOSE_LID_DURATION (${CLOSE_LID_DURATION}) must match scene OPEN_DURATION (0.72)`,
  );

  return issues;
}
