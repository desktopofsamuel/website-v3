#!/usr/bin/env node
/**
 * Lint contracts for /dev/work-cd play choreography.
 * Catches the regressions from the cover-flow session: case glass dropping
 * too early, disc lerping through the player, player popping in at dock,
 * content waiting past 0.79, and the power cable showing during the slide.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const CHOREOGRAPHY = "lib/work-cd/play-choreography.ts";
const SCENE = "components/work-cd/cover-flow-scene.ts";
const PLAYER = "components/work-cd/muji-player.ts";
const STAGE = "components/work-cd/WorkCdStage.tsx";

function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) {
    throw new Error(`missing ${rel}`);
  }
  return fs.readFileSync(full, "utf8");
}

function exportedNums(src) {
  const out = {};
  for (const match of src.matchAll(/^export const ([A-Z][A-Z0-9_]*) = ([0-9]*\.?[0-9]+);/gm)) {
    out[match[1]] = Number(match[2]);
  }
  return out;
}

function functionBody(src, name) {
  const start = src.search(new RegExp(`function ${name}\\s*\\(`));
  if (start < 0) return "";
  const brace = src.indexOf("{", start);
  if (brace < 0) return "";
  let depth = 0;
  for (let i = brace; i < src.length; i++) {
    const ch = src[i];
    if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) return src.slice(brace, i + 1);
    }
  }
  return src.slice(brace);
}

function fail(issues) {
  process.stderr.write(
    `work-cd play choreography check failed:\n${issues.map((item) => `  - ${item}`).join("\n")}\n`,
  );
  process.exit(1);
}

const issues = [];
const choreography = read(CHOREOGRAPHY);
const scene = read(SCENE);
const player = read(PLAYER);
const stage = read(STAGE);
const beats = exportedNums(choreography);

function beat(ok, message) {
  if (!ok) issues.push(message);
}

beat(beats.PLAYER_ENTER === 0.03, `PLAYER_ENTER must be 0.03 (got ${beats.PLAYER_ENTER})`);
beat(beats.EXTRACT_START === 0.22, `EXTRACT_START must be 0.22 (got ${beats.EXTRACT_START})`);
beat(
  beats.EXTRACT_CLEAR - beats.EXTRACT_START <= 0.28,
  `extract (${beats.EXTRACT_START} → ${beats.EXTRACT_CLEAR}) must stay short`,
);
beat(
  beats.EXTRACT_START < beats.EXTRACT_HEAD && beats.EXTRACT_HEAD < beats.EXTRACT_CLEAR,
  `EXTRACT_HEAD (${beats.EXTRACT_HEAD}) must sit between EXTRACT_START (${beats.EXTRACT_START}) and EXTRACT_CLEAR (${beats.EXTRACT_CLEAR})`,
);
beat(
  beats.EXTRACT_CLEAR >= beats.CLEAR_OF_PLAYER &&
    beats.CLEAR_OF_PLAYER < beats.SEAT_START,
  `CLEAR_OF_PLAYER (${beats.CLEAR_OF_PLAYER}) must sit in extract, before zoom (${beats.SEAT_START})`,
);
beat(
  beats.STOW_START > beats.CASE_GLASS_HELD,
  `STOW_START (${beats.STOW_START}) must be after CASE_GLASS_HELD (${beats.CASE_GLASS_HELD}) so the case/glass is still on through extract`,
);
beat(
  beats.EXTRACT_CLEAR <= beats.STOW_START,
  `case must not stow (${beats.STOW_START}) before the disc has cleared the case (${beats.EXTRACT_CLEAR})`,
);
beat(
  beats.SPIN_START === beats.EXTRACT_START,
  `SPIN_START (${beats.SPIN_START}) must equal EXTRACT_START (${beats.EXTRACT_START}) so spin begins with extract, in plane`,
);
beat(
  beats.SEAT_START > beats.EXTRACT_CLEAR && beats.SEAT_START < beats.SEAT_END,
  `SEAT_START (${beats.SEAT_START}) must sit after extractClear (${beats.EXTRACT_CLEAR})`,
);
beat(
  beats.SEAT_END - beats.SEAT_START >= 0.4,
  `seat span (${beats.SEAT_END - beats.SEAT_START}) is too short — zoom needs the bulk of the head`,
);
beat(
  beats.SEAT_DURATION >= 1.6,
  `SEAT_DURATION (${beats.SEAT_DURATION}s) must be at least 1.6s so zoom gets the time`,
);
beat(
  beats.EXTRACT_FLY_DURATION > 0 && beats.EXTRACT_FLY_DURATION <= 0.4,
  `EXTRACT_FLY_DURATION (${beats.EXTRACT_FLY_DURATION}s) must stay a short extract`,
);
beat(
  beats.RETURN_DURATION >= 0.5 &&
    beats.RETURN_DURATION <= beats.EXTRACT_FLY_DURATION + beats.SEAT_DURATION,
  `RETURN_DURATION (${beats.RETURN_DURATION}s) must skip the spin hold and not exceed extract+zoom travel`,
);
beat(
  beats.STOW_END >= beats.SEAT_START && beats.STOW_END > beats.STOW_START,
  `STOW_END (${beats.STOW_END}) must meet zoom (${beats.SEAT_START}), not hang until the disc is seated`,
);
beat(
  beats.STOW_END < beats.SEAT_END,
  `STOW_END (${beats.STOW_END}) must finish before SEAT_END (${beats.SEAT_END}) — the case was staying through the whole zoom`,
);
beat(beats.CONTENT_HEAD === 0.79, `CONTENT_HEAD must be 0.79 (got ${beats.CONTENT_HEAD})`);

beat(
  scene.includes('from "@/lib/work-cd/play-choreography"'),
  `${SCENE} must import play-choreography so beat numbers stay in one place`,
);

const keepCase = functionBody(scene, "keepCase") || scene;
beat(
  /playHead\(\)\s*<\s*STOW_START/.test(scene) &&
    !/phase === "flying" && playHead\(\) < EXTRACT_CLEAR/.test(scene),
  "keepCase while flying must hold until STOW_START, not EXTRACT_CLEAR (case was disappearing at 0.72)",
);
beat(
  /smoothstep\(playHead\(\),\s*STOW_START,\s*STOW_END\)/.test(scene),
  "stowGate must ease STOW_START → STOW_END so the case recedes on its own beats",
);
beat(
  !/isFocusPlay \? STOW_START : EXTRACT_CLEAR/.test(scene),
  "neighbor discs must stow on the same long curve, not from EXTRACT_CLEAR",
);

const fadeSlot = functionBody(scene, "fadeSlot");
beat(Boolean(fadeSlot), "fadeSlot must exist");
if (fadeSlot) {
  const transmissiveFade = fadeSlot.match(/else if \(transmissive\) \{([\s\S]*?)\n        \}/);
  const body = transmissiveFade?.[1] ?? "";
  beat(
    /transmission = base\.transmission/.test(body) && !/transmission = 0/.test(body),
    "fadeSlot must keep glass transmission while the case is still visible (disc hub was filling in)",
  );
}

beat(
  /function resolveDiscCollision/.test(scene) &&
    /resolveDiscCollision\(\s*out,\s*playerHit/.test(scene),
  "disc flight must resolve the disc sphere against the player box (0.69 overlap)",
);
beat(
  /function keepInComposition/.test(scene),
  "disc flight must keep the disc in composition through 0.77–0.80",
);
beat(
  !/function gapFlightPoint/.test(scene) && !/keepInFrontOf\(/.test(scene),
  "do not cruise to a player-side gap or pull toward camera (that threw the disc off-frame at 0.77)",
);
beat(
  /function playExtract/.test(scene) &&
    /easeInOutCubic/.test(functionBody(scene, "playExtract")) &&
    /EXTRACT_START/.test(functionBody(scene, "playExtract")) &&
    /EXTRACT_CLEAR/.test(functionBody(scene, "playExtract")),
  "extract must be one ease-in-out from EXTRACT_START to EXTRACT_CLEAR",
);
beat(
  /playExtract\(head\)/.test(functionBody(scene, "discFlightPoint")),
  "discFlightPoint must use playExtract (start→end keyframe), not a slow mid-span smoothstep",
);
beat(
  /u < EXTRACT_START/.test(functionBody(scene, "applyPlayProgress")),
  "scrub must begin flying at EXTRACT_START (0.22), not wait for OPEN_DURATION (~0.44)",
);
beat(
  /EXTRACT_START/.test(functionBody(scene, "playHead")),
  "autoplay playHead must map opening to EXTRACT_START so 0.22 is the extract keyframe",
);
beat(
  /function playSeat/.test(scene) &&
    /SEAT_START/.test(functionBody(scene, "playSeat")) &&
    /SEAT_END/.test(functionBody(scene, "playSeat")) &&
    /easeSmooth/.test(functionBody(scene, "playSeat")),
  "seat must ease SEAT_START → SEAT_END (assign heads there, seconds on SEAT_DURATION)",
);
beat(
  /function playSpin/.test(scene) &&
    /SPIN_START/.test(functionBody(scene, "playSpin")),
  "spin must be its own curve from SPIN_START, not tied to the zoom/seat travel",
);
beat(
  /EXTRACT_FLY_DURATION/.test(functionBody(scene, "playHead")) &&
    /SEAT_START/.test(functionBody(scene, "playHead")) &&
    /SEAT_DURATION/.test(functionBody(scene, "playHead")) &&
    !/SPIN_DURATION/.test(functionBody(scene, "playHead")),
  "autoplay must map extract onto EXTRACT_FLY_DURATION then zoom onto SEAT_DURATION — no in-place spin hold",
);
beat(
  /SEAT_START/.test(functionBody(scene, "applyPlayProgress")) &&
    /EXTRACT_FLY_DURATION/.test(functionBody(scene, "applyPlayProgress")) &&
    /SEAT_DURATION/.test(functionBody(scene, "applyPlayProgress")) &&
    !/SPIN_DURATION/.test(functionBody(scene, "applyPlayProgress")),
  "scrub must map extract then zoom onto their own durations, not a spin hold",
);
beat(
  /FLY_DURATION = EXTRACT_FLY_DURATION \+ SEAT_DURATION/.test(scene) &&
    !/FLY_DURATION = EXTRACT_FLY_DURATION \+ SPIN_DURATION \+ SEAT_DURATION/.test(scene),
  "FLY_DURATION must be extract + zoom only so autoplay does not pause to spin in place",
);
beat(
  /playSeat\(head\)/.test(functionBody(scene, "discFlightPoint")),
  "discFlightPoint must use playSeat for lift→player",
);
beat(
  !/if \(seat <= 0\)/.test(functionBody(scene, "discFlightPoint")),
  "do not hold-then-launch with a travel value that is already large at 0.82",
);
beat(
  /\.project\(camera\)/.test(functionBody(scene, "discFlightPoint")) &&
    /viewTmp\.lerp\(flightTmp,\s*travel\)/.test(scene) &&
    /\.unproject\(camera\)/.test(functionBody(scene, "discFlightPoint")),
  "seat must lerp lift→dock in screen space so the seat span does not jump on screen",
);
beat(
  stage.includes("DISC_FLIGHT_REV"),
  "WorkCdStage must remount WebGL when DISC_FLIGHT_REV changes",
);
beat(
  /playSeat\(playHead\(\)\)/.test(scene) && /spinAngle\(playHead\(\)\)/.test(scene),
  "position uses playSeat (zoom); rotation uses spinAngle/playSpin so spin can start with extract",
);
beat(
  /WorkCdPlayTimeline/.test(stage) || /WorkCdPlayTimeline/.test(read("components/work-cd/WorkCdIndex.tsx")),
  "Tune panel must expose a play timeline so keyframes are editable without hunting constants",
);
beat(
  beats.CLOSE_LID_DURATION === 0.72 ||
    /export const CLOSE_LID_DURATION = 0\.72/.test(choreography),
  "CLOSE_LID_DURATION must be 0.72 to match scene OPEN_DURATION",
);
beat(
  /function setCloseProgress/.test(scene) &&
    /!play\.held/.test(scene) &&
    /closeProgress/.test(read("components/work-cd/WorkCdPlayTimeline.tsx")),
  "Tune panel must expose a close bar that scrubs setCloseProgress without auto-finishing held eject",
);
beat(
  !/u <= 0\.001[\s\S]{0,240}ensureHeldSeated/.test(functionBody(scene, "setCloseProgress")),
  "setCloseProgress(0) must not beginPlay/seat the disc — that emptied the case on Extract",
);
beat(
  /play\.phase === "flying" && play\.seated/.test(scene),
  "flying scrub must unseat so discFlightPoint is not applied in spindle-local space",
);
beat(
  /hoverIndex === slot\.index/.test(scene) &&
    /!isFront/.test(scene) &&
    /X_AXIS/.test(scene) &&
    /stacked/.test(functionBody(scene, "hitCaseIndex")),
  "hover lift/tilt must apply to every non-front case in overview and cover flow, not only prev/next",
);
beat(
  /rerollShopHover/.test(scene) &&
    /Math\.random\(\)/.test(functionBody(scene, "rerollShopHover")) &&
    /span \* 0\.1/.test(scene) &&
    /0\.16 \+ toFocus/.test(scene) &&
    /shopHoverLift/.test(scene) &&
    /shopHoverPush/.test(scene) &&
    /Z_AXIS/.test(scene) &&
    /Neighbor lift/.test(read("components/work-cd/WorkCdIndex.tsx")) &&
    /Neighbor push/.test(read("components/work-cd/WorkCdIndex.tsx")),
  "slides 1–10 neighbor hover lift/push must be Tune-panel scaled; tilt still rerolls on each new hover",
);
beat(
  !/\bCRUISE_HEAD\b/.test(choreography) && !/\bplayTravel\b/.test(scene),
  "seat segment is SEAT_START/SEAT_END + playSeat, not CRUISE_HEAD/playTravel",
);
beat(
  /phase === "returning"[\s\S]{0,240}RETURN_DURATION/.test(scene) &&
    !/clock \/ FLY_DURATION, 1/.test(scene),
  "eject return must use RETURN_DURATION, not FLY_DURATION (that included the in-place spin hold)",
);
beat(
  /phase === "returning"[\s\S]*play\.spin \+= SPIN_SPEED/.test(scene) &&
    /rotateOnAxis\(localSpinAxis,\s*play\.spin\)/.test(scene),
  "returning disc must keep accumulating play.spin — slerp-then-dt froze the spin so it lagged home",
);
beat(
  /function nextAlignedSpin/.test(scene) &&
    /spinRest/.test(functionBody(scene, "poseReturning")) &&
    /easeOutCubic\(land\)/.test(functionBody(scene, "poseReturning")),
  "return must ease play.spin onto a 2π rest so restoreMeshes does not flicker the print",
);
beat(
  /play\.phase === "spinning" && play\.seated/.test(scene) &&
    /rotateOnAxis\(localSpinAxis,\s*SPIN_SPEED \* dt\)/.test(scene) &&
    !/play\.clock \/ 0\.5/.test(scene),
  "seated player disc must keep spinning after the inbound transition",
);
beat(
  /const keepCase =[\s\S]{0,280}playHead\(\) < STOW_START/.test(scene) &&
    !/const keepCase =[\s\S]{0,280}play\.phase === "returning"/.test(scene),
  "keepCase must not un-stow the case at eject start — the case was beating the disc back to center",
);
beat(
  /applyStandPose\(slot\)/.test(functionBody(scene, "beginFly")),
  "beginFly must stand the case (qStand) before capturing the disc — refresh left it lying flat",
);
beat(
  /function applyStandPose/.test(scene) &&
    /qStand/.test(functionBody(scene, "applyStandPose")),
  "cases must get qStand on first pose, not wait for a later tick after refresh",
);
beat(
  /localSpinAxis\.copy\(face\)/.test(functionBody(scene, "beginFly")),
  "beginFly must capture the disc face as localSpinAxis so spin stays a circle",
);
beat(
  /rotateOnAxis\(localSpinAxis,\s*play\.spin\)/.test(scene) &&
    !/rotateOnWorldAxis\(play\.spinAxis,\s*play\.spin\)/.test(scene),
  "disc must spin with rotateOnAxis(localSpinAxis), not world spindle/camera axis (that tumbled)",
);

const posePlayer = functionBody(scene, "posePlayer");
beat(Boolean(posePlayer), "posePlayer must exist");
if (posePlayer) {
  beat(
    /restX - travel/.test(posePlayer) && /PLAYER_ENTER|0\.03/.test(posePlayer),
    "posePlayer must slide in from far left starting at PLAYER_ENTER (0.03 popped at the dock)",
  );
}

const reveal = functionBody(scene, "maybeRevealContent");
beat(
  reveal.includes("CONTENT_HEAD"),
  "maybeRevealContent must fire at CONTENT_HEAD (0.79), not after an extra spin delay",
);

beat(
  /Component_3282/.test(player) && /visible = false/.test(player),
  "muji-player must hide the power cable (Component_3282) during the slide",
);

beat(
  !/TYPESET_AFTER_SPIN_MS/.test(stage),
  "WorkCdStage must not wait TYPESET_AFTER_SPIN_MS; content is allowed at play 0.79",
);

if (issues.length) fail(issues);
process.stdout.write("work-cd play choreography check ok\n");
