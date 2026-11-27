import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import type { DummyAlbum } from "@/lib/work-cd/albums";
import {
  applyAlbum,
  applyGlassTune,
  centerAtOrigin,
  cloneCaseWithMaterials,
  collectArt,
  disposeIfCanvas,
  disposeVectorPrints,
  emptyArt,
  ensureArtFont,
  isMesh,
  JEWEL_CASE_GLB_URL,
  poseCaseLid,
  prepareCaseMeshes,
  type CaseArt,
  type GlassTune,
} from "./jewel-case-art";
import { discPaperFrame, isDiscHub, VECTOR_PRINT_PREFIX } from "./jewel-case-vector";
import { mountMujiPlayer, MUJI_PLAYER_GLB_URL, type MujiPlayer } from "./muji-player";
import {
  CONTENT_HEAD,
  EXTRACT_CLEAR,
  EXTRACT_FLY_DURATION as EXTRACT_FLY_DURATION_DEFAULT,
  EXTRACT_START,
  PLAYER_ENTER,
  RETURN_DURATION as RETURN_DURATION_DEFAULT,
  SEAT_DURATION as SEAT_DURATION_DEFAULT,
  SEAT_END as SEAT_END_DEFAULT,
  SEAT_START as SEAT_START_DEFAULT,
  SPIN_START as SPIN_START_DEFAULT,
  STOW_END,
  STOW_START,
  type PlayBeats,
  validatePlayChoreography,
} from "@/lib/work-cd/play-choreography";

export { DEFAULT_GLASS_TUNE } from "./jewel-case-art";
export type { GlassTune };

const DRACO_DECODER_URL =
  "https://www.gstatic.com/draco/versioned/decoders/1.5.7/";

const Y_AXIS = new THREE.Vector3(0, 1, 0);
const X_AXIS = new THREE.Vector3(1, 0, 0);
const Z_AXIS = new THREE.Vector3(0, 0, 1);

export type CoverFlowCase = {
  slug: string;
  album: DummyAlbum;
};

export type CaseTune = {
  x: number;
  y: number;
  z: number;
  open: number;
};

export type CameraTune = {
  distance: number;
  height: number;
  lerp: number;
};

export const DEFAULT_CAMERA_TUNE: CameraTune = {
  distance: 0.55,
  height: 1,
  lerp: 0.11,
};

export type ShopHoverTune = {
  lift: number;
  push: number;
};

/** 1 = previous stacked pop. Default is more micro; Tune panel live-scales slides 1–10 neighbors. */
export const DEFAULT_SHOP_HOVER: ShopHoverTune = {
  lift: 0.25,
  push: 0.25,
};
const OVERVIEW_HOVER_LIFT = 0.3;
const OVERVIEW_HOVER_PUSH = 0.3;

export const REST_OPEN = 0.04;
export const HOVER_OPEN = 0.11;
export const PLAY_OPEN = 0.41;

const OPEN_DURATION = 0.72;
let EXTRACT_FLY_DURATION = EXTRACT_FLY_DURATION_DEFAULT;
let SPIN_START = SPIN_START_DEFAULT;
let SEAT_START = SEAT_START_DEFAULT;
let SEAT_END = SEAT_END_DEFAULT;
let SEAT_DURATION = SEAT_DURATION_DEFAULT;
let RETURN_DURATION = RETURN_DURATION_DEFAULT;
let FLY_DURATION = EXTRACT_FLY_DURATION + SEAT_DURATION;
const SPIN_SPEED = 22;
const SPIN_TAU = Math.PI * 2;

function nextAlignedSpin(spin: number) {
  const turns = spin / SPIN_TAU;
  const frac = turns - Math.floor(turns);
  if (frac < 0.05) return Math.floor(turns) * SPIN_TAU;
  return Math.ceil(turns) * SPIN_TAU;
}
const DOCK_SCREEN_FRAC = 0.08;
const DOCK_READ_SCREEN_FRAC = 0.07;
const BOTTOM_VIEW_FRAC = 0.12;
const BOTTOM_READ_VIEW_FRAC = 0.1;
const SIDE_VIEW_FRAC = 0.13;
const SIDE_READ_VIEW_FRAC = 0.11;
const SIDE_Y_FRAC = 0.02;
const DISC_RADIUS_MUL = 0.3;
const WIDE_MIN = 1200;

export type PlayPhase = "opening" | "flying" | "spinning" | "returning" | "closing";

export type CoverFlowHandle = {
  setSlide: (index: number, opts?: { immediate?: boolean }) => void;
  setTune: (itemIndex: number, tune: CaseTune) => void;
  setCameraTune: (tune: CameraTune) => void;
  setShopHoverTune: (tune: ShopHoverTune) => void;
  setGlassTune: (tune: GlassTune) => void;
  setHover: (hovering: boolean) => void;
  playLearnMore: (opts?: { instant?: boolean }) => void;
  setPlayProgress: (progress: number) => void;
  setCloseProgress: (progress: number) => void;
  setPlayBeats: (beats: Partial<PlayBeats>) => void;
  setReadAmount: (amount: number) => void;
  setPlayerPeek: (peeking: boolean) => void;
  eject: () => void;
  dispose: () => void;
};

export type MountCoverFlowOptions = {
  items: CoverFlowCase[];
  slide: number;
  tunes: CaseTune[];
  camera: CameraTune;
  onSlide: (index: number) => void;
  onStatus: (status: string) => void;
  onPlaying?: (playing: boolean) => void;
  onPhase?: (phase: PlayPhase | null) => void;
};

type DiscHome = {
  mesh: THREE.Object3D;
  parent: THREE.Object3D;
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  scale: THREE.Vector3;
};

type PlaySession = {
  slotIndex: number;
  phase: PlayPhase;
  clock: number;
  open: number;
  openStart: number;
  fly: number;
  spin: number;
  discD: number;
  closeTarget: number;
  pendingSlide: number | null;
  rig: THREE.Group | null;
  homes: DiscHome[];
  fromPos: THREE.Vector3;
  fromQuat: THREE.Quaternion;
  toQuat: THREE.Quaternion;
  ejectFromPos: THREE.Vector3;
  ejectFromQuat: THREE.Quaternion;
  ejectSpin: number;
  spinRest: number;
  spinLandFrom: number;
  face: THREE.Vector3;
  spinAxis: THREE.Vector3;
  held: boolean;
  seated: boolean;
  head: number;
  contentShown: boolean;
};

type Slot = {
  pivot: THREE.Group;
  stand: THREE.Group;
  art: CaseArt;
  index: number;
  size: THREE.Vector3;
  scatter: Scatter;
  mixer: THREE.AnimationMixer | null;
  action: THREE.AnimationAction | null;
  clip: THREE.AnimationClip | null;
  tune: CaseTune;
  stow: number;
  hover: number;
  hoverRx: number;
  hoverRy: number;
  hoverRz: number;
};

function hash(i: number) {
  const n = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return n - Math.floor(n);
}

export function defaultTune(_i: number): CaseTune {
  return {
    x: 0,
    y: 0,
    z: 0,
    open: REST_OPEN,
  };
}

type Scatter = { x: number; y: number; z: number; yaw: number; open: number };

function shopRowCounts(count: number) {
  const rows = count <= 4 ? 1 : count <= 8 ? 2 : 3;
  const counts: number[] = [];
  let remaining = count;
  for (let r = 0; r < rows; r++) {
    const n = r === rows - 1 ? remaining : Math.ceil(remaining / (rows - r));
    counts.push(n);
    remaining -= n;
  }
  return counts;
}

function layoutShop(count: number, width: number, height: number) {
  const rowCounts = shopRowCounts(count);
  const rows = rowCounts.length;
  const gapX = width * 0.64;
  const gapY = height * 0.92;
  const scatters: Scatter[] = [];
  let i = 0;
  for (let r = 0; r < rows; r++) {
    const cols = rowCounts[r];
    const shelfY = (rows - 1 - r) * gapY;
    for (let c = 0; c < cols; c++) {
      scatters.push({
        x: (c - (cols - 1) / 2) * gapX + (hash(i + 2) - 0.5) * width * 0.08,
        y: shelfY + height * 0.5 + (hash(i + 7) - 0.5) * height * 0.02,
        z: (rows - 1 - r) * width * 0.05 + (hash(i + 5) - 0.18) * width * 0.28,
        yaw: (hash(i + 11) - 0.5) * 0.06,
        open: 0.012 + hash(i + 17) * 0.02,
      });
      i += 1;
    }
  }
  return { scatters, rowCounts, gapX, gapY, w: width, h: height };
}

function flowFor(offset: number, size: THREE.Vector3) {
  const w = Math.max(size.x, size.z);
  const mag = Math.abs(offset);
  const sign = Math.sign(offset);
  const along = Math.sin(Math.min(mag, 1) * Math.PI * 0.5);
  return {
    x: sign * (along * w * 0.76 + Math.max(mag - 1, 0) * w * 0.58),
    y: size.z * 0.5,
    z: -mag * w * 0.36 + sign * along * w * 0.08,
    yaw: -sign * Math.min(mag, 1) * 0.5 - sign * Math.max(mag - 1, 0) * 0.08,
  };
}

export function mountCoverFlow(
  canvas: HTMLCanvasElement,
  options: MountCoverFlowOptions,
): CoverFlowHandle {
  const choreographyIssues = validatePlayChoreography();
  if (choreographyIssues.length) {
    throw new Error(`work-cd play choreography:\n${choreographyIssues.join("\n")}`);
  }
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.setClearColor(0xefece6, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = false;

  const scene = new THREE.Scene();
  scene.background = null;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 1;

  const camera = new THREE.PerspectiveCamera(
    32,
    Math.max(canvas.clientWidth, 1) / Math.max(canvas.clientHeight, 1),
    0.01,
    40,
  );

  const key = new THREE.DirectionalLight(0xffe4c4, 1.85);
  key.position.set(-0.55, 0.7, 0.85);
  scene.add(key);
  scene.add(new THREE.AmbientLight(0xfff1e0, 0.28));
  const rim = new THREE.DirectionalLight(0xffd7a8, 0.45);
  rim.position.set(0.55, 0.2, 0.35);
  scene.add(rim);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(4.2, 4.2),
    new THREE.MeshStandardMaterial({ color: 0x6e4f32, roughness: 0.94 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.02;
  ground.visible = false;
  scene.add(ground);

  let disposed = false;
  let raf = 0;
  const lastSlide = options.items.length;
  let targetSlide = THREE.MathUtils.clamp(options.slide, 0, lastSlide);
  let currentSlide = targetSlide;
  let slideFrom = targetSlide;
  let slideT = 1;
  let lerpSpeed = options.camera.lerp;
  let distMul = options.camera.distance;
  let heightMul = options.camera.height;
  let shopHoverLift = DEFAULT_SHOP_HOVER.lift;
  let shopHoverPush = DEFAULT_SHOP_HOVER.push;
  const slots: Slot[] = [];
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const look = new THREE.Vector3();
  let shopReady = false;
  const overviewPos = new THREE.Vector3(0.04, 0.72, 0.16);
  const overviewLook = new THREE.Vector3(0, 0.04, 0);
  const focusPos = new THREE.Vector3(0.06, 0.12, 0.32);
  const focusLook = new THREE.Vector3(0, 0.07, 0);
  const camTarget = new THREE.Vector3();
  const lookTarget = new THREE.Vector3();
  const qStand = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(Math.PI / 2, 0, 0),
  );
  const qYaw = new THREE.Quaternion();
  const qNow = new THREE.Quaternion();
  const posNow = new THREE.Vector3();
  const overviewAt = new THREE.Vector3();
  const flowAt = new THREE.Vector3();
  const dockAt = new THREE.Vector3();
  const camDir = new THREE.Vector3();
  const faceNow = new THREE.Vector3();
  const qAlign = new THREE.Quaternion();
  const playerSlide = new THREE.Vector3();
  const playerRight = new THREE.Vector3();
  const qTilt = new THREE.Quaternion();
  const liftPos = new THREE.Vector3();
  const extractDir = new THREE.Vector3();
  const flightTmp = new THREE.Vector3();
  const viewTmp = new THREE.Vector3();
  const pushDir = new THREE.Vector3();
  const caseBox = new THREE.Box3();
  const playerBox = new THREE.Box3();
  const discSphere = new THREE.Sphere();
  const localSpinAxis = new THREE.Vector3(0, 0, 1);
  const invWorld = new THREE.Matrix4();
  let cdPlayer: MujiPlayer | null = null;
  let playerAppear = 0;
  let readAmount = 0;
  let readAmountTarget = 0;
  let sideAmt = 0;
  let playerPeekAmt = 0;
  let playerPeekTarget = 0;
  let hoverCanvas = false;
  let hoverButton = false;
  let hoverAmt = 0;
  let hoverIndex: number | null = null;
  let play: PlaySession | null = null;
  let queuedPlay: { instant: boolean; held?: boolean } | null = null;
  let pendingClose: number | null = null;
  let lastTs = performance.now();

  function clampSlide(index: number) {
    return THREE.MathUtils.clamp(index, 0, lastSlide);
  }

  function easeSmooth(t: number) {
    const u = THREE.MathUtils.clamp(t, 0, 1);
    return u * u * (3 - 2 * u);
  }

  function easeInOutCubic(t: number) {
    const u = THREE.MathUtils.clamp(t, 0, 1);
    return u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2;
  }

  function easeOutCubic(t: number) {
    const u = 1 - THREE.MathUtils.clamp(t, 0, 1);
    return 1 - u * u * u;
  }

  function slideDuration() {
    const t = THREE.MathUtils.inverseLerp(0.012, 0.2, lerpSpeed);
    return THREE.MathUtils.lerp(0.4, 0.16, THREE.MathUtils.clamp(t, 0, 1));
  }

  function beginSlideTo(next: number, immediate = false) {
    const clamped = clampSlide(next);
    if (immediate) {
      targetSlide = clamped;
      currentSlide = clamped;
      slideFrom = clamped;
      slideT = 1;
      return;
    }
    if (clamped === targetSlide) return;
    slideFrom = currentSlide;
    slideT = 0;
    targetSlide = clamped;
  }

  function restOpenFor(slot: Slot) {
    const toFocus = THREE.MathUtils.smoothstep(currentSlide, 0, 1);
    const rest = THREE.MathUtils.lerp(slot.scatter.open, slot.tune.open, toFocus);
    if (slot.index !== targetSlide - 1) return rest;
    return THREE.MathUtils.lerp(rest, Math.max(rest, HOVER_OPEN), hoverAmt);
  }

  function restoreMeshes() {
    if (!play?.rig) return;
    for (const home of play.homes) {
      home.parent.attach(home.mesh);
      home.mesh.position.copy(home.position);
      home.mesh.quaternion.copy(home.quaternion);
      home.mesh.scale.copy(home.scale);
    }
    play.rig.removeFromParent();
    play.rig = null;
    play.homes = [];
    play.seated = false;
  }

  function restorePlay() {
    if (!play) return;
    restoreMeshes();
    play = null;
    readAmountTarget = 0;
    readAmount = 0;
    playerPeekTarget = 0;
    options.onPlaying?.(false);
    options.onPhase?.(null);
  }

  function emitPhase(phase: PlayPhase | null) {
    if (play?.held) return;
    options.onPhase?.(phase);
  }

  function poseLid(slot: Slot, open: number) {
    if (!slot.mixer || !slot.action || !slot.clip) return;
    slot.action.time = open * slot.clip.duration;
    slot.mixer.update(0);
  }

  function applyStandPose(slot: Slot) {
    const focusedIndex = Math.max(currentSlide - 1, 0);
    const offset = slot.index - focusedIndex;
    const flow = flowFor(offset, slot.size);
    const toFocus = THREE.MathUtils.smoothstep(currentSlide, 0, 1);
    const yaw = THREE.MathUtils.lerp(slot.scatter.yaw, flow.yaw, toFocus);
    qYaw.setFromAxisAngle(Y_AXIS, yaw);
    qNow.multiplyQuaternions(qYaw, qStand);
    slot.stand.quaternion.copy(qNow);
    slot.stand.updateMatrixWorld(true);
  }

  function applyPlayProgress(progress: number) {
    if (!play) return;
    const slot = slots[play.slotIndex];
    const u = THREE.MathUtils.clamp(progress, 0, 1);
    play.head = u;
    if (u < EXTRACT_START) {
      if (play.rig) restoreMeshes();
      play.phase = "opening";
      play.clock =
        EXTRACT_START <= 0 ? 0 : (u / EXTRACT_START) * OPEN_DURATION;
      play.fly = 0;
      play.open = THREE.MathUtils.lerp(
        play.openStart,
        PLAY_OPEN,
        easeSmooth(EXTRACT_START <= 0 ? 1 : u / EXTRACT_START),
      );
      if (slot) poseLid(slot, play.open);
      return;
    }
    play.open = PLAY_OPEN;
    if (slot) poseLid(slot, PLAY_OPEN);
    if (play.seated) unseatDisc();
    if (!play.rig && slot) beginFly(slot);
    if (u < SEAT_START) {
      const t =
        (u - EXTRACT_START) / Math.max(SEAT_START - EXTRACT_START, 1e-6);
      play.clock = t * EXTRACT_FLY_DURATION;
    } else {
      const t = (u - SEAT_START) / Math.max(1 - SEAT_START, 1e-6);
      play.clock = EXTRACT_FLY_DURATION + t * SEAT_DURATION;
    }
    play.fly = easeSmooth(
      Math.min(play.clock / Math.max(FLY_DURATION, 1e-6), 1),
    );
    if (u >= 0.999) {
      play.phase = "spinning";
      if (play.rig && !play.seated) enterSpinning();
    } else {
      play.phase = "flying";
    }
  }

  function setPlayProgress(progress: number) {
    if (targetSlide <= 0) return;
    const u = THREE.MathUtils.clamp(progress, 0, 1);
    if (u <= 0.001) {
      if (play) restorePlay();
      playerAppear = 0;
      posePlayer(0);
      return;
    }
    if (
      play &&
      (play.phase === "returning" || play.phase === "closing")
    ) {
      restorePlay();
    }
    if (play && !play.held) restorePlay();
    if (!play) beginPlay(false, true);
    if (!play) return;
    play.held = true;
    applyPlayProgress(u);
  }

  function armEjectFromDock() {
    if (!play?.rig) return;
    if (play.rig.parent && play.rig.parent !== scene) scene.attach(play.rig);
    play.seated = false;
    if (cdPlayer) cdPlayer.spindle.getWorldPosition(dockAt);
    else dockPosition(dockAt, play.discD, discViewFrac());
    dockFacing(play, play.toQuat);
    play.ejectFromPos.copy(dockAt);
    play.ejectFromQuat.copy(play.toQuat);
    play.ejectSpin = play.spin;
    play.spinRest = -1;
  }

  function poseReturning(dt: number) {
    if (!play?.rig || play.phase !== "returning") return;
    if (play.rig.parent && play.rig.parent !== scene) {
      scene.attach(play.rig);
      play.seated = false;
    }
    const dur = Math.max(RETURN_DURATION, 1e-6);
    const u = THREE.MathUtils.clamp(play.clock / dur, 0, 1);
    const leave = easeOutCubic(u);
    const seatShare =
      SEAT_DURATION / Math.max(SEAT_DURATION + EXTRACT_FLY_DURATION, 1e-6);
    towardCamera(extractDir.copy(play.face));
    const radius = play.discD * 0.52;
    const outOfCase = Math.min(
      play.discD * 1.18,
      Math.max(
        play.discD * 1.05,
        clearanceAlong(play.fromPos, extractDir, playCaseBox(), radius) +
          radius * 0.08,
      ),
    );
    liftPos.copy(play.fromPos).addScaledVector(extractDir, outOfCase);
    if (u < seatShare) {
      const t = easeOutCubic(u / Math.max(seatShare, 1e-6));
      camera.updateMatrixWorld();
      viewTmp.copy(play.ejectFromPos).project(camera);
      flightTmp.copy(liftPos).project(camera);
      if (
        Number.isFinite(viewTmp.x) &&
        Number.isFinite(flightTmp.x) &&
        Number.isFinite(viewTmp.z) &&
        Number.isFinite(flightTmp.z)
      ) {
        viewTmp.lerp(flightTmp, t);
        play.rig.position.copy(viewTmp).unproject(camera);
      } else {
        play.rig.position.lerpVectors(play.ejectFromPos, liftPos, t);
      }
    } else {
      const t = easeInOutCubic((u - seatShare) / Math.max(1 - seatShare, 1e-6));
      play.rig.position.lerpVectors(liftPos, play.fromPos, t);
    }
    keepInComposition(play.rig.position, radius, 0.82);
    const land = THREE.MathUtils.smoothstep(u, 0.58, 1);
    if (land <= 0) {
      play.spinRest = -1;
      if (!play.held && dt > 0) play.spin += SPIN_SPEED * dt;
    } else {
      if (play.spinRest < 0) {
        play.spinRest = nextAlignedSpin(play.spin);
        play.ejectSpin = play.spin;
      }
      play.spin = THREE.MathUtils.lerp(
        play.ejectSpin,
        play.spinRest,
        easeOutCubic(land),
      );
    }
    play.rig.quaternion.slerpQuaternions(
      play.ejectFromQuat,
      play.fromQuat,
      leave,
    );
    play.rig.rotateOnAxis(localSpinAxis, play.spin);
    if (play.clock >= dur && !play.held) {
      restoreMeshes();
      play.phase = "closing";
      play.clock = 0;
      play.openStart = play.open;
      emitPhase("closing");
    }
  }

  function ensureHeldSeated() {
    if (targetSlide <= 0) return false;
    if (play && !play.held) restorePlay();
    if (play && (play.phase === "returning" || play.phase === "closing")) {
      play.held = true;
      return true;
    }
    if (!play) beginPlay(true, true);
    if (!play) return false;
    play.held = true;
    if (!play.rig) {
      const slot = slots[play.slotIndex];
      if (slot) applyPlayProgress(1);
    }
    if (play.rig && play.phase !== "spinning") {
      applyPlayProgress(1);
      if (play.rig && !play.seated) enterSpinning();
    }
    return Boolean(play);
  }

  function setCloseProgress(progress: number) {
    if (targetSlide <= 0) return;
    const u = THREE.MathUtils.clamp(progress, 0, 1);
    pendingClose = u > 0.001 ? u : null;
    if (u <= 0.001) {
      if (
        play?.held &&
        (play.phase === "returning" || play.phase === "closing")
      ) {
        if (play.rig && play.seated) unseatDisc();
        applyPlayProgress(1);
        if (play.rig && !play.seated) enterSpinning();
      }
      return;
    }
    if (!ensureHeldSeated()) return;
    if (!play) return;
    const slot = slots[play.slotIndex];
    play.closeTarget = slot ? restOpenFor(slot) : REST_OPEN;
    const retDur = Math.max(RETURN_DURATION, 1e-6);
    const lidDur = OPEN_DURATION;
    const returnShare = retDur / (retDur + lidDur);
    if (u < returnShare) {
      if (!play.rig && slot) beginFly(slot);
      if (play.phase !== "returning") armEjectFromDock();
      play.phase = "returning";
      play.clock = (u / Math.max(returnShare, 1e-6)) * retDur;
      play.open = PLAY_OPEN;
      if (slot) poseLid(slot, PLAY_OPEN);
      poseReturning(0);
      return;
    }
    if (play.rig) restoreMeshes();
    play.phase = "closing";
    play.clock =
      ((u - returnShare) / Math.max(1 - returnShare, 1e-6)) * lidDur;
    play.openStart = PLAY_OPEN;
    play.open = THREE.MathUtils.lerp(
      PLAY_OPEN,
      play.closeTarget,
      easeSmooth(Math.min(play.clock / lidDur, 1)),
    );
    if (slot) poseLid(slot, play.open);
  }

  function enterSpinning() {
    if (!play) return;
    play.phase = "spinning";
    play.clock = 0;
    play.fly = 1;
    play.head = 1;
    play.spinRest = -1;
    maybeRevealContent(1);
    seatDisc();
  }

  function beginPlay(instant: boolean, held = false) {
    if (play) return;
    if (targetSlide <= 0) return;
    const slot = slots[targetSlide - 1];
    if (!slot) {
      queuedPlay = { instant, held };
      return;
    }
    queuedPlay = null;
    const toFocus = THREE.MathUtils.smoothstep(currentSlide, 0, 1);
    const start = visualOpen(slot, toFocus);
    play = {
      slotIndex: slot.index,
      phase: "opening",
      clock: 0,
      open: start,
      openStart: start,
      fly: 0,
      spin: 0,
      discD: slot.size.x,
      closeTarget: REST_OPEN,
      pendingSlide: null,
      rig: null,
      homes: [],
      fromPos: new THREE.Vector3(),
      fromQuat: new THREE.Quaternion(),
      toQuat: new THREE.Quaternion(),
      ejectFromPos: new THREE.Vector3(),
      ejectFromQuat: new THREE.Quaternion(),
      ejectSpin: 0,
      spinRest: -1,
      spinLandFrom: 0,
      face: new THREE.Vector3(0, 0, 1),
      spinAxis: new THREE.Vector3(0, 0, 1),
      held: held,
      seated: false,
      head: instant ? 1 : 0,
      contentShown: false,
    };
    if (!held) {
      options.onPlaying?.(true);
      emitPhase("opening");
      setCaseCursor(null);
    }
    if (!instant) return;
    play.open = PLAY_OPEN;
    play.openStart = PLAY_OPEN;
    if (slot.mixer && slot.action && slot.clip) {
      slot.action.time = PLAY_OPEN * slot.clip.duration;
      slot.mixer.update(0);
    }
    playerAppear = 1;
    posePlayer(1);
    beginFly(slot);
    if (!play.rig || play.phase === "spinning") return;
    if (cdPlayer) cdPlayer.spindle.getWorldPosition(dockAt);
    else dockPosition(dockAt, play.discD, discViewFrac());
    dockFacing(play, play.toQuat);
    play.rig.position.copy(dockAt);
    play.rig.quaternion.copy(play.toQuat);
    enterSpinning();
  }

  function finishPlay() {
    if (!play) return;
    const pending = play.pendingSlide;
    restorePlay();
    if (pending === null) return;
    const next = clampSlide(pending);
    if (next === targetSlide) return;
    beginSlideTo(next);
    options.onSlide(next);
  }

  function beginEject(pendingSlide?: number) {
    if (!play) return;
    if (play.held) {
      restorePlay();
      if (pendingSlide !== undefined && pendingSlide !== targetSlide) {
        beginSlideTo(clampSlide(pendingSlide));
        options.onSlide(targetSlide);
      }
      return;
    }
    if (pendingSlide !== undefined) play.pendingSlide = pendingSlide;
    if (play.phase === "returning" || play.phase === "closing") return;
    const slot = slots[play.slotIndex];
    play.closeTarget = slot ? restOpenFor(slot) : REST_OPEN;
    if (play.phase === "opening" || !play.rig) {
      play.phase = "closing";
      play.clock = 0;
      play.openStart = play.open;
      emitPhase("closing");
      return;
    }
    unseatDisc();
    play.ejectFromPos.copy(play.rig.position);
    play.ejectFromQuat.copy(play.rig.quaternion);
    qAlign.setFromAxisAngle(localSpinAxis, -play.spin);
    play.ejectFromQuat.multiply(qAlign);
    play.ejectSpin = play.spin;
    play.spinRest = -1;
    play.phase = "returning";
    play.clock = 0;
    emitPhase("returning");
  }

  function playerViewFrac() {
    const bottom = THREE.MathUtils.lerp(BOTTOM_VIEW_FRAC, BOTTOM_READ_VIEW_FRAC, readAmount);
    const side = THREE.MathUtils.lerp(SIDE_VIEW_FRAC, SIDE_READ_VIEW_FRAC, readAmount);
    return THREE.MathUtils.lerp(bottom, side, sideAmt);
  }

  function discViewFrac() {
    return THREE.MathUtils.lerp(DOCK_SCREEN_FRAC, DOCK_READ_SCREEN_FRAC, readAmount);
  }

  function isWideSide() {
    return canvas.clientWidth >= WIDE_MIN;
  }

  function bottomYFrac(viewFrac: number, peek: number) {
    const discR = viewFrac * DISC_RADIUS_MUL;
    // Keep ≥60% of the disc above the bottom edge at rest.
    const rest = 0.5 - 0.55 * discR;
    return THREE.MathUtils.lerp(rest, rest - discR * 1.15, peek);
  }

  function sideXFrac(_viewFrac: number, peek: number) {
    const rest = -0.5;
    const nudge = 20 / Math.max(canvas.clientWidth, 1);
    return rest + nudge * peek;
  }

  function seatDisc() {
    if (!play?.rig || !cdPlayer || play.seated) return;
    cdPlayer.spindle.updateWorldMatrix(true, false);
    cdPlayer.spindle.getWorldPosition(dockAt);
    dockFacing(play, play.toQuat);
    play.rig.position.copy(dockAt);
    play.rig.quaternion.copy(play.toQuat);
    play.rig.rotateOnAxis(localSpinAxis, play.spin);
    cdPlayer.spindle.attach(play.rig);
    play.seated = true;
  }

  function unseatDisc() {
    if (!play?.rig || !play.seated) return;
    scene.attach(play.rig);
    play.seated = false;
  }

  function dockPosition(
    out: THREE.Vector3,
    objectD: number,
    viewFrac = DOCK_SCREEN_FRAC,
    yFrac = 0.36,
    xFrac = 0,
  ) {
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const dist = Math.max(
      (objectD / viewFrac) / (2 * Math.tan(vFov / 2)),
      0.22,
    );
    const viewH = 2 * Math.tan(vFov / 2) * dist;
    const viewW = viewH * camera.aspect;
    out.set(viewW * xFrac, -viewH * yFrac, -dist);
    camera.updateMatrixWorld();
    camera.localToWorld(out);
  }

  function dockFacing(session: PlaySession, target: THREE.Quaternion) {
    if (cdPlayer) {
      cdPlayer.spindle.updateWorldMatrix(true, false);
      faceNow.set(0, 0, 1).transformDirection(cdPlayer.spindle.matrixWorld).normalize();
      qAlign.setFromUnitVectors(session.face, faceNow);
      target.copy(session.fromQuat).premultiply(qAlign);
      session.spinAxis.copy(faceNow).negate();
      return;
    }
    camera.getWorldDirection(camDir);
    faceNow.copy(camDir).negate();
    qAlign.setFromUnitVectors(session.face, faceNow);
    target.copy(session.fromQuat).premultiply(qAlign);
    session.spinAxis.copy(camDir);
  }

  function playHead() {
    if (!play) return 0;
    if (play.held) return play.head;
    if (play.phase === "opening") {
      return (
        EXTRACT_START * THREE.MathUtils.clamp(play.clock / OPEN_DURATION, 0, 1)
      );
    }
    if (play.phase === "flying") {
      const clock = Math.max(play.clock, 0);
      if (clock < EXTRACT_FLY_DURATION) {
        const t =
          EXTRACT_FLY_DURATION <= 0 ? 1 : clock / EXTRACT_FLY_DURATION;
        return THREE.MathUtils.lerp(
          EXTRACT_START,
          SEAT_START,
          THREE.MathUtils.clamp(t, 0, 1),
        );
      }
      const t =
        SEAT_DURATION <= 0
          ? 1
          : (clock - EXTRACT_FLY_DURATION) / SEAT_DURATION;
      return THREE.MathUtils.lerp(
        SEAT_START,
        1,
        THREE.MathUtils.clamp(t, 0, 1),
      );
    }
    if (play.phase === "spinning") return 1;
    if (play.phase === "returning") {
      const dur = Math.max(RETURN_DURATION, 1e-6);
      const u = THREE.MathUtils.clamp(play.clock / dur, 0, 1);
      const seatShare =
        SEAT_DURATION / Math.max(SEAT_DURATION + EXTRACT_FLY_DURATION, 1e-6);
      if (u < seatShare) {
        return THREE.MathUtils.lerp(1, SEAT_START, u / Math.max(seatShare, 1e-6));
      }
      return THREE.MathUtils.lerp(
        SEAT_START,
        EXTRACT_START,
        (u - seatShare) / Math.max(1 - seatShare, 1e-6),
      );
    }
    return 0;
  }

  function maybeRevealContent(head: number) {
    if (!play || play.held || play.contentShown) return;
    if (head < CONTENT_HEAD) return;
    play.contentShown = true;
    options.onPhase?.("spinning");
  }

  function posePlayer(appear: number) {
    if (!cdPlayer) return;
    cdPlayer.root.visible = appear > 0.012;
    if (appear <= 0.012) return;
    const arrive = THREE.MathUtils.smoothstep(appear, PLAYER_ENTER, CONTENT_HEAD);
    const travel = 1 - arrive;
    const peek = playerPeekAmt * arrive;
    const restFrac = playerViewFrac();
    const viewFrac = THREE.MathUtils.lerp(restFrac * 2.4, restFrac, arrive);
    const restX = THREE.MathUtils.lerp(0, sideXFrac(restFrac, peek), sideAmt);
    const restY = THREE.MathUtils.lerp(bottomYFrac(restFrac, peek), SIDE_Y_FRAC, sideAmt);
    const xFrac = restX - travel * THREE.MathUtils.lerp(0.58, 0.14, sideAmt);
    dockPosition(dockAt, cdPlayer.bodyD, viewFrac, restY, xFrac);
    camera.updateMatrixWorld();
    playerRight.set(1, 0, 0).transformDirection(camera.matrixWorld).normalize();
    camera.getWorldDirection(camDir);
    const pitch = travel * 0.12 + peek * THREE.MathUtils.lerp(0.22, 0.14, sideAmt);
    const yaw =
      travel * 0.26 -
      peek * THREE.MathUtils.lerp(0.08, 0.1, sideAmt) +
      sideAmt * 0.08;
    qTilt.setFromAxisAngle(playerRight, pitch);
    cdPlayer.root.quaternion.copy(camera.quaternion).multiply(qTilt);
    qTilt.setFromAxisAngle(camera.up, yaw);
    cdPlayer.root.quaternion.multiply(qTilt);
    cdPlayer.root.position.copy(dockAt);
    playerSlide.copy(camDir).multiplyScalar(
      travel * cdPlayer.bodyD * 0.1 -
        peek * cdPlayer.bodyD * THREE.MathUtils.lerp(0.16, 0.08, sideAmt),
    );
    cdPlayer.root.position.add(playerSlide);
    cdPlayer.root.updateMatrixWorld(true);
  }

  function fadeSlot(slot: Slot, amount: number) {
    // Recede first. Do not leave the transmission pass while the case is still
    // in front of the disc hole — that reads as the hole filling in.
    const fade = 1 - THREE.MathUtils.smoothstep(amount, 0.52, 0.92);
    slot.pivot.traverse((obj) => {
      if (!isMesh(obj)) return;
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      for (const mat of mats) {
        if (!mat) continue;
        if (!mat.userData.fadeBase) {
          mat.userData.fadeBase = {
            opacity: mat.opacity,
            transparent: mat.transparent,
            depthWrite: mat.depthWrite,
            transmission:
              "transmission" in mat
                ? (mat as THREE.MeshPhysicalMaterial).transmission
                : 0,
          };
        }
        const base = mat.userData.fadeBase as {
          opacity: number;
          transparent: boolean;
          depthWrite: boolean;
          transmission: number;
        };
        const transmissive = base.transmission > 0.01;
        const keepLook = transmissive ? fade > 0.08 : fade >= 0.995;
        if (keepLook) {
          mat.opacity = base.opacity;
          mat.transparent = base.transparent;
          mat.depthWrite = base.depthWrite;
          if ("transmission" in mat) {
            (mat as THREE.MeshPhysicalMaterial).transmission = base.transmission;
          }
        } else if (transmissive) {
          mat.transparent = true;
          mat.opacity = base.opacity * (fade / 0.08);
          mat.depthWrite = false;
          (mat as THREE.MeshPhysicalMaterial).transmission = base.transmission;
        } else {
          mat.opacity = base.opacity * fade;
          mat.transparent = true;
          mat.depthWrite = fade > 0.65;
        }
        mat.needsUpdate = true;
      }
    });
    slot.pivot.visible = fade > 0.02;
  }

  function worldBox(obj: THREE.Object3D, out: THREE.Box3) {
    obj.updateWorldMatrix(true, true);
    return out.setFromObject(obj);
  }

  function playCaseBox() {
    caseBox.makeEmpty();
    if (!play) return caseBox;
    const slot = slots[play.slotIndex];
    if (!slot) return caseBox;
    return worldBox(slot.pivot, caseBox);
  }

  function playPlayerBox() {
    playerBox.makeEmpty();
    if (!cdPlayer) return playerBox;
    return worldBox(cdPlayer.root, playerBox);
  }

  function sphereHitsBox(center: THREE.Vector3, radius: number, box: THREE.Box3) {
    if (box.isEmpty() || radius <= 0) return false;
    discSphere.center.copy(center);
    discSphere.radius = radius;
    return box.intersectsSphere(discSphere);
  }

  function clearanceAlong(
    origin: THREE.Vector3,
    dir: THREE.Vector3,
    box: THREE.Box3,
    radius: number,
  ) {
    if (box.isEmpty()) return 0;
    const span = box.getSize(flightTmp).length() + radius * 2 + 0.08;
    let lo = 0;
    let hi = span;
    for (let i = 0; i < 14; i++) {
      const mid = (lo + hi) * 0.5;
      flightTmp.copy(origin).addScaledVector(dir, mid);
      if (sphereHitsBox(flightTmp, radius, box)) lo = mid;
      else hi = mid;
    }
    return hi;
  }

  function towardCamera(dir: THREE.Vector3) {
    camera.getWorldDirection(camDir);
    dir.normalize();
    if (dir.dot(camDir) > 0) dir.negate();
    return dir;
  }

  function playExtract(head: number) {
    const span = EXTRACT_CLEAR - EXTRACT_START;
    const t = span <= 0 ? 1 : THREE.MathUtils.clamp((head - EXTRACT_START) / span, 0, 1);
    return easeInOutCubic(t);
  }

  function playSeat(head: number) {
    const span = SEAT_END - SEAT_START;
    const t = span <= 0 ? 1 : THREE.MathUtils.clamp((head - SEAT_START) / span, 0, 1);
    return easeSmooth(t);
  }

  function playSpin(head: number) {
    const span = 1 - SPIN_START;
    return span <= 0 ? 1 : THREE.MathUtils.clamp((head - SPIN_START) / span, 0, 1);
  }

  function spinAngle(head: number) {
    return playSpin(head) * SPIN_SPEED * (EXTRACT_FLY_DURATION + SEAT_DURATION);
  }

  function setPlayBeats(patch: Partial<PlayBeats>) {
    if (patch.SPIN_START != null) SPIN_START = patch.SPIN_START;
    if (patch.SEAT_START != null) SEAT_START = patch.SEAT_START;
    if (patch.SEAT_END != null) SEAT_END = patch.SEAT_END;
    if (patch.SEAT_DURATION != null) SEAT_DURATION = patch.SEAT_DURATION;
    if (patch.EXTRACT_FLY_DURATION != null) {
      EXTRACT_FLY_DURATION = patch.EXTRACT_FLY_DURATION;
    }
    if (patch.RETURN_DURATION != null) RETURN_DURATION = patch.RETURN_DURATION;
    FLY_DURATION = EXTRACT_FLY_DURATION + SEAT_DURATION;
    if (play?.held) applyPlayProgress(play.head);
  }

  function keepInComposition(point: THREE.Vector3, radius: number, edge: number) {
    camera.updateMatrixWorld();
    viewTmp.copy(point).project(camera);
    if (
      !Number.isFinite(viewTmp.x) ||
      !Number.isFinite(viewTmp.y) ||
      !Number.isFinite(viewTmp.z)
    ) {
      point.copy(liftPos);
      return;
    }
    const pad = THREE.MathUtils.clamp(radius * 0.04, 0.02, 0.08);
    viewTmp.x = THREE.MathUtils.clamp(viewTmp.x, -edge + pad, edge - pad);
    viewTmp.y = THREE.MathUtils.clamp(viewTmp.y, -edge + pad, edge - pad);
    viewTmp.unproject(camera);
    point.copy(viewTmp);
  }

  function resolveDiscCollision(
    point: THREE.Vector3,
    box: THREE.Box3,
    radius: number,
    preferDir: THREE.Vector3,
  ) {
    if (!sphereHitsBox(point, radius, box)) return;
    box.getCenter(flightTmp);
    pushDir.copy(point).sub(flightTmp);
    camera.getWorldDirection(camDir);
    pushDir.addScaledVector(camDir, -pushDir.dot(camDir));
    if (pushDir.lengthSq() < 1e-8) pushDir.copy(preferDir);
    pushDir.normalize();
    point.addScaledVector(
      pushDir,
      clearanceAlong(point, pushDir, box, radius) + radius * 0.08,
    );
  }

  function discFlightPoint(out: THREE.Vector3, from: THREE.Vector3, discD: number) {
    const head = playHead();
    const extract = playExtract(head);
    const travel = playSeat(head);
    const radius = discD * 0.52;
    camera.getWorldDirection(camDir);
    towardCamera(extractDir.copy(play?.face ?? camDir));
    const caseHit = playCaseBox();
    const playerHit = playPlayerBox();
    const outOfCase = Math.min(
      discD * 1.18,
      Math.max(
        discD * 1.05,
        clearanceAlong(from, extractDir, caseHit, radius) + radius * 0.08,
      ),
    );
    liftPos.copy(from).addScaledVector(extractDir, outOfCase);
    out.lerpVectors(from, liftPos, extract);
    if (travel <= 0) return;

    camera.updateMatrixWorld();
    viewTmp.copy(liftPos).project(camera);
    flightTmp.copy(dockAt).project(camera);
    if (
      !Number.isFinite(viewTmp.x) ||
      !Number.isFinite(flightTmp.x) ||
      !Number.isFinite(viewTmp.z) ||
      !Number.isFinite(flightTmp.z)
    ) {
      return;
    }
    const liftZ = viewTmp.z;
    viewTmp.lerp(flightTmp, travel);
    viewTmp.z = THREE.MathUtils.lerp(
      liftZ,
      flightTmp.z,
      THREE.MathUtils.smoothstep(travel, 0.28, 1),
    );
    out.copy(viewTmp).unproject(camera);
    if (travel > 0.55 && travel < 0.9) {
      resolveDiscCollision(out, playerHit, radius, extractDir);
    }
    if (travel > 0.2 && travel < 0.92) {
      keepInComposition(out, radius, THREE.MathUtils.lerp(0.7, 1.2, travel));
    }
  }

  function beginFly(slot: Slot) {
    if (!play) return;
    applyStandPose(slot);
    const allDiscs = slot.art.discMeshes.length
      ? slot.art.discMeshes
      : slot.art.discMesh
        ? [slot.art.discMesh]
        : [];
    const labeled = allDiscs.filter((mesh) =>
      mesh.getObjectByName(`${VECTOR_PRINT_PREFIX}-disc`),
    );
    const hubs = allDiscs.filter((mesh) => isDiscHub(mesh, allDiscs));
    const discs = labeled.length ? [...new Set([...labeled, ...hubs])] : allDiscs;
    if (discs.length === 0) {
      enterSpinning();
      return;
    }
    const box = new THREE.Box3();
    for (const mesh of discs) box.expandByObject(mesh);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const discD = Math.max(size.x, size.y, size.z);
    const rig = new THREE.Group();
    rig.position.copy(center);
    scene.add(rig);
    const homes: DiscHome[] = [];
    for (const mesh of discs) {
      if (!mesh.parent) continue;
      homes.push({
        mesh,
        parent: mesh.parent,
        position: mesh.position.clone(),
        quaternion: mesh.quaternion.clone(),
        scale: mesh.scale.clone(),
      });
      mesh.visible = true;
      mesh.frustumCulled = false;
      mesh.traverse((obj) => {
        obj.visible = true;
        obj.frustumCulled = false;
      });
      rig.attach(mesh);
    }
    rig.frustumCulled = false;
    const printed =
      discs.find((mesh) => mesh.getObjectByName(`${VECTOR_PRINT_PREFIX}-disc`)) ??
      slot.art.discMesh ??
      discs[0];
    const overlay = printed.getObjectByName(`${VECTOR_PRINT_PREFIX}-disc`);
    const face = new THREE.Vector3(0, 0, 1);
    if (overlay) {
      overlay.updateWorldMatrix(true, false);
      face.transformDirection(overlay.matrixWorld).normalize();
    } else {
      printed.updateWorldMatrix(true, false);
      face.copy(discPaperFrame(printed).normal).transformDirection(printed.matrixWorld).normalize();
    }
    if (face.lengthSq() < 0.01) face.set(0, 0, 1);
    camera.getWorldDirection(camDir);
    if (face.dot(camDir) > 0) face.negate();
    play.rig = rig;
    play.homes = homes;
    play.fromPos = center.clone();
    play.fromQuat = rig.quaternion.clone();
    play.face = face;
    play.discD = discD;
    dockFacing(play, play.toQuat);
    rig.updateMatrixWorld(true);
    invWorld.copy(rig.matrixWorld).invert();
    localSpinAxis.copy(face).transformDirection(invWorld).normalize();
    if (localSpinAxis.lengthSq() < 0.01) localSpinAxis.set(0, 0, 1);
    play.spinAxis.copy(localSpinAxis);
    play.phase = "flying";
    play.clock = 0;
    play.fly = 0;
    emitPhase("flying");
  }

  function visualOpen(slot: Slot, toFocus: number) {
    if (play && play.slotIndex === slot.index) return play.open;
    const rest = THREE.MathUtils.lerp(slot.scatter.open, slot.tune.open, toFocus);
    if (slot.index !== targetSlide - 1) return rest;
    return THREE.MathUtils.lerp(rest, Math.max(rest, HOVER_OPEN), hoverAmt);
  }

  function coverIndexOf(obj: THREE.Object3D | null) {
    let current: THREE.Object3D | null = obj;
    while (current) {
      const index = current.userData.coverIndex;
      if (typeof index === "number") return index;
      current = current.parent;
    }
    return null;
  }

  function hitCaseIndex() {
    if (play || slots.length === 0) return null;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(
      slots.map((slot) => slot.pivot),
      true,
    );
    const indices: number[] = [];
    for (const hit of hits) {
      const index = coverIndexOf(hit.object);
      if (index === null || indices.includes(index)) continue;
      indices.push(index);
    }
    if (indices.length === 0) return null;
    const focused = targetSlide > 0 ? targetSlide - 1 : null;
    if (focused !== null) {
      const stacked = indices.find((index) => index !== focused);
      if (stacked !== undefined) return stacked;
    }
    return indices[0];
  }

  function rerollShopHover(slot: Slot) {
    slot.hoverRx = -0.07 - Math.random() * 0.09;
    slot.hoverRy = (Math.random() - 0.5) * 0.2;
    slot.hoverRz = (Math.random() - 0.5) * 0.08;
  }

  function setCaseCursor(index: number | null) {
    const next = play ? null : index;
    if (next !== hoverIndex && next !== null) {
      const slot = slots[next];
      const isFront = targetSlide > 0 && next === targetSlide - 1;
      if (slot && !isFront) rerollShopHover(slot);
    }
    hoverIndex = next;
    hoverCanvas = index !== null && index === targetSlide - 1;
    canvas.style.cursor = index !== null ? "pointer" : "";
  }

  function pointerNdc(event: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function setSlide(index: number, announce = true) {
    const next = clampSlide(Math.round(index));
    if (play) {
      beginEject(next === targetSlide ? undefined : next);
      return;
    }
    if (next === targetSlide) return;
    beginSlideTo(next);
    if (announce) options.onSlide(next);
  }

  function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width === 0 || height === 0) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas.parentElement ?? canvas);

  let dragStartX = 0;
  let dragging = false;
  let moved = false;
  let wheelAccum = 0;

  function onPointerDown(event: PointerEvent) {
    dragging = true;
    moved = false;
    dragStartX = event.clientX;
    canvas.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent) {
    pointerNdc(event);
    if (!dragging) setCaseCursor(hitCaseIndex());
    if (!dragging) return;
    const dx = event.clientX - dragStartX;
    if (Math.abs(dx) > 48) {
      moved = true;
      setSlide(targetSlide + (dx < 0 ? 1 : -1));
      dragStartX = event.clientX;
    }
  }

  function onPointerLeave() {
    setCaseCursor(null);
  }

  function onPointerUp(event: PointerEvent) {
    if (!dragging) return;
    dragging = false;
    canvas.releasePointerCapture(event.pointerId);
    if (moved || play) return;
    pointerNdc(event);
    const index = hitCaseIndex();
    setCaseCursor(index);
    if (index === null) return;
    if (targetSlide !== index + 1) setSlide(index + 1);
    beginPlay(false);
  }

  function onWheel(event: WheelEvent) {
    event.preventDefault();
    wheelAccum += event.deltaY;
    if (wheelAccum > 90) {
      setSlide(targetSlide + 1);
      wheelAccum = 0;
    } else if (wheelAccum < -90) {
      setSlide(targetSlide - 1);
      wheelAccum = 0;
    }
  }

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);
  canvas.addEventListener("pointerleave", onPointerLeave);
  canvas.addEventListener("wheel", onWheel, { passive: false });

  const draco = new DRACOLoader();
  draco.setDecoderPath(DRACO_DECODER_URL);
  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);

  void (async () => {
    try {
      const [gltf, playerGltf] = await Promise.all([
        loader.loadAsync(JEWEL_CASE_GLB_URL),
        loader.loadAsync(MUJI_PLAYER_GLB_URL).catch((err) => {
          console.error(err);
          return null;
        }),
      ]);
      if (disposed) return;
      const font = await ensureArtFont();
      if (disposed) return;
      if (playerGltf) cdPlayer = mountMujiPlayer(scene, playerGltf.scene);
      const template = gltf.scene;
      prepareCaseMeshes(template, false, renderer.capabilities.getMaxAnisotropy());
      const clip = gltf.animations[0];
      const count = options.items.length;
      let size = new THREE.Vector3(0.14, 0.01, 0.125);
      const probe = cloneCaseWithMaterials(template);
      const probeClip = clip?.clone();
      poseCaseLid(probe, probeClip, 0);
      centerAtOrigin(probe);
      probe.quaternion.copy(qStand);
      probe.updateMatrixWorld(true);
      const standing = new THREE.Box3().setFromObject(probe).getSize(new THREE.Vector3());
      const standW = standing.x;
      const standH = standW * 0.86;
      const shop = layoutShop(count, standW, standH);

      for (const [index, item] of options.items.entries()) {
        const root = cloneCaseWithMaterials(template);
        const instanceClip = clip?.clone();
        const posed = poseCaseLid(root, instanceClip, 0);
        const measured = centerAtOrigin(root);
        if (index === 0) size = measured;
        const scatter = shop.scatters[index] ?? shop.scatters[0];
        if (posed && instanceClip) {
          posed.action.time = scatter.open * instanceClip.duration;
          posed.mixer.update(0);
        }
        const art = collectArt(root, emptyArt());
        await applyAlbum(art, item.album, font, "d", renderer.capabilities.getMaxAnisotropy());

        const stand = new THREE.Group();
        stand.add(root);
        const pivot = new THREE.Group();
        pivot.userData.coverIndex = index;
        pivot.add(stand);
        pivot.position.set(scatter.x, scatter.y, scatter.z);
        stand.quaternion.copy(qStand);
        stand.updateMatrixWorld(true);
        scene.add(pivot);

        slots.push({
          pivot,
          stand,
          art,
          index,
          size,
          scatter,
          mixer: posed?.mixer ?? null,
          action: posed?.action ?? null,
          clip: posed?.clip ?? null,
          tune: { ...(options.tunes[index] ?? defaultTune(index)) },
          stow: 0,
          hover: 0,
          hoverRx: -0.12,
          hoverRy: 0,
          hoverRz: 0,
        });
      }

      if (slots[0]) {
        const w = size.x;
        const h = size.z;
        const xs = shop.scatters.map((s) => s.x);
        const ys = shop.scatters.map((s) => s.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        const spanX = maxX - minX + standW * 0.35;
        const spanY = maxY - minY + standH * 0.35;
        overviewLook.set((minX + maxX) * 0.5, (minY + maxY) * 0.48, 0);
        const aspect =
          Math.max(canvas.clientWidth, 1) / Math.max(canvas.clientHeight, 1);
        const vFov = THREE.MathUtils.degToRad(camera.fov);
        const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
        const dist = Math.max(
          (spanY * 0.56) / Math.tan(vFov / 2),
          (spanX * 0.56) / Math.tan(hFov / 2),
          w * 4.4,
        );
        overviewPos.set(overviewLook.x - spanX * 0.03, overviewLook.y, dist);
        focusPos.set(w * 0.2, h * 0.58, w * 6.4);
        focusLook.set(0, h * 0.48, 0);
        camera.near = Math.max(h * 0.15, 0.03);
        camera.far = Math.max(dist * 8, 16);
        camera.updateProjectionMatrix();
        camera.position.copy(overviewPos);
        camera.lookAt(overviewLook);
        look.copy(overviewLook);
        shopReady = true;
        for (const slot of slots) applyStandPose(slot);
        if (queuedPlay) {
          const { instant, held } = queuedPlay;
          queuedPlay = null;
          beginPlay(instant, held);
          if (pendingClose != null) setCloseProgress(pendingClose);
        }
      }

      options.onStatus(
        "Cases in a grid, then a stacked Cover Flow. Tune with the handles.",
      );
    } catch (err) {
      options.onStatus("Could not load the GLB.");
      console.error(err);
    }
  })();

  function tick(now = performance.now()) {
    if (disposed) return;
    const dt = Math.min(0.05, (now - lastTs) / 1000);
    lastTs = now;
    if (!shopReady) {
      for (const slot of slots) applyStandPose(slot);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
      return;
    }
    if (slideT < 1) {
      slideT = Math.min(1, slideT + dt / slideDuration());
      currentSlide = THREE.MathUtils.lerp(slideFrom, targetSlide, easeInOutCubic(slideT));
      if (slideT >= 1) currentSlide = targetSlide;
    } else {
      currentSlide = targetSlide;
    }
    const toFocus = THREE.MathUtils.smoothstep(currentSlide, 0, 1);
    const hoverWanted =
      (hoverCanvas || hoverButton) && targetSlide > 0 && play === null;
    hoverAmt += ((hoverWanted ? 1 : 0) - hoverAmt) * Math.min(1, 1 - Math.exp(-dt * 14));
    if (play && !play.held) {
      play.clock += dt;
      if (play.phase === "opening") {
        const u = easeSmooth(play.clock / OPEN_DURATION);
        play.open = THREE.MathUtils.lerp(play.openStart, PLAY_OPEN, u);
        if (play.clock >= OPEN_DURATION) play.open = PLAY_OPEN;
      } else if (play.phase === "flying") {
        play.fly = easeSmooth(play.clock / FLY_DURATION);
        if (play.clock >= FLY_DURATION) {
          enterSpinning();
        }
      } else if (play.phase === "closing") {
        const u = easeSmooth(Math.min(play.clock / OPEN_DURATION, 1));
        play.open = THREE.MathUtils.lerp(play.openStart, play.closeTarget, u);
      }
      play.head = playHead();
      maybeRevealContent(play.head);
    }
    let playerWanted = 0;
    if (play) {
      if (play.phase === "closing") {
        playerWanted = 1 - easeSmooth(Math.min(play.clock / OPEN_DURATION, 1));
      } else if (play.phase === "returning") {
        playerWanted = 1;
      } else {
        playerWanted = playHead();
      }
    }
    playerAppear = playerWanted;
    const arc = Math.sin(toFocus * Math.PI) * (slots[0]?.size.z ?? 0.12) * 1.15;
    camTarget.x = THREE.MathUtils.lerp(
      overviewPos.x,
      focusPos.x * (0.65 + distMul * 0.35),
      toFocus,
    );
    camTarget.y = THREE.MathUtils.lerp(overviewPos.y, focusPos.y * heightMul, toFocus) + arc;
    camTarget.z = THREE.MathUtils.lerp(overviewPos.z, focusPos.z * distMul, toFocus);
    lookTarget.lerpVectors(overviewLook, focusLook, toFocus);
    if (toFocus < 0.02 || slideT < 1) {
      camera.position.copy(camTarget);
      look.copy(lookTarget);
    } else {
      camera.position.lerp(camTarget, 1 - Math.exp(-dt * 18));
      look.lerp(lookTarget, 1 - Math.exp(-dt * 18));
    }
    camera.lookAt(look);
    readAmount +=
      (readAmountTarget - readAmount) * Math.min(1, 1 - Math.exp(-dt * 8));
    sideAmt +=
      ((isWideSide() ? 1 : 0) - sideAmt) * Math.min(1, 1 - Math.exp(-dt * 8));
    playerPeekAmt +=
      (playerPeekTarget - playerPeekAmt) * Math.min(1, 1 - Math.exp(-dt * 7));
    posePlayer(playerAppear);

    const focusedIndex = Math.max(currentSlide - 1, 0);

    for (const slot of slots) {
      const offset = slot.index - focusedIndex;
      const flow = flowFor(offset, slot.size);
      overviewAt.set(slot.scatter.x, slot.scatter.y, slot.scatter.z);
      flowAt.set(flow.x, flow.y, flow.z);
      posNow.lerpVectors(overviewAt, flowAt, toFocus);
      posNow.x += slot.tune.x;
      posNow.y += slot.tune.y;
      posNow.z += slot.tune.z;

      const isFront = targetSlide > 0 && slot.index === targetSlide - 1;
      const shopHoverWanted =
        !play && hoverIndex === slot.index && !isFront ? 1 : 0;
      slot.hover +=
        (shopHoverWanted - slot.hover) * Math.min(1, 1 - Math.exp(-dt * 12));
      const pop = slot.hover;
      const neighborLift = THREE.MathUtils.lerp(
        OVERVIEW_HOVER_LIFT,
        shopHoverLift,
        toFocus,
      );
      const neighborPush = THREE.MathUtils.lerp(
        OVERVIEW_HOVER_PUSH,
        shopHoverPush,
        toFocus,
      );
      if (pop > 0.001) {
        const span = Math.max(slot.size.x, slot.size.z);
        posNow.y += pop * (span * 0.1 + 0.008) * neighborLift;
        posNow.z += pop * span * (0.16 + toFocus * 0.14) * neighborPush;
      }

      const yaw = THREE.MathUtils.lerp(slot.scatter.yaw, flow.yaw, toFocus);
      const faceYaw = pop > 0.001 ? slot.hoverRy * pop * neighborLift : 0;
      const unwind = pop * toFocus * -yaw * 0.45 * neighborLift;
      qYaw.setFromAxisAngle(Y_AXIS, yaw + faceYaw + unwind);
      qNow.multiplyQuaternions(qYaw, qStand);
      if (pop > 0.001) {
        qTilt.setFromAxisAngle(X_AXIS, pop * slot.hoverRx * neighborLift);
        qNow.premultiply(qTilt);
        qTilt.setFromAxisAngle(Z_AXIS, pop * slot.hoverRz * neighborLift);
        qNow.premultiply(qTilt);
      }
      slot.stand.quaternion.copy(qNow);

      const open = visualOpen(slot, toFocus);
      const freezeLid =
        play &&
        play.slotIndex === slot.index &&
        play.phase !== "opening" &&
        play.phase !== "closing";
      if (slot.mixer && slot.action && slot.clip && !freezeLid) {
        slot.action.time = open * slot.clip.duration;
        slot.mixer.update(0);
      }
      const isFocusPlay = Boolean(play && play.slotIndex === slot.index);
      const keepCase =
        play &&
        play.slotIndex === slot.index &&
        (play.phase === "opening" ||
          play.phase === "closing" ||
          (play.phase === "flying" && playHead() < STOW_START));
      const returnU =
        play?.phase === "returning"
          ? THREE.MathUtils.clamp(
              play.clock / Math.max(RETURN_DURATION, 1e-6),
              0,
              1,
            )
          : 0;
      const stowGate = !play
        ? 0
        : play.phase === "closing"
          ? 0
          : play.phase === "returning"
            ? 1 - THREE.MathUtils.smoothstep(returnU, 0.5, 0.88)
            : THREE.MathUtils.smoothstep(playHead(), STOW_START, STOW_END);
      const stowWanted = play && !keepCase ? stowGate : 0;
      if (play?.held) {
        slot.stow = stowWanted;
      } else {
        slot.stow +=
          (stowWanted - slot.stow) * Math.min(1, 1 - Math.exp(-dt * 8));
      }
      if (slot.stow > 0.001) {
        const recede = slot.stow * slot.stow;
        if (isFocusPlay) {
          camera.getWorldDirection(camDir);
          posNow.addScaledVector(camDir, recede * (slot.size.z * 3.4 + 0.28));
        } else {
          posNow.y -= recede * (slot.size.y * 3.2 + 0.42);
          posNow.z -= recede * slot.size.z * 0.4;
        }
      }
      slot.pivot.position.copy(posNow);
      fadeSlot(slot, slot.stow);
    }
    if (play?.phase === "opening" && !play.held && play.clock >= OPEN_DURATION) {
      const slot = slots[play.slotIndex];
      if (slot) beginFly(slot);
    }
    if (
      play?.phase === "closing" &&
      play.clock >= OPEN_DURATION &&
      !play.held
    ) {
      finishPlay();
    }
    if (play?.rig && play.phase === "returning") {
      poseReturning(dt);
    } else if (play?.rig && (play.phase === "flying" || play.phase === "spinning")) {
      if (play.phase === "flying" && play.seated) unseatDisc();
      if (play.phase === "spinning" && play.seated) {
        if (!play.held) {
          play.rig.rotateOnAxis(localSpinAxis, SPIN_SPEED * dt);
          play.spin += SPIN_SPEED * dt;
        }
      } else {
        if (cdPlayer) cdPlayer.spindle.getWorldPosition(dockAt);
        else dockPosition(dockAt, play.discD, discViewFrac());
        dockFacing(play, play.toQuat);
        if (play.phase === "flying") {
          play.spin = spinAngle(playHead());
          discFlightPoint(play.rig.position, play.fromPos, play.discD);
          play.rig.quaternion.slerpQuaternions(
            play.fromQuat,
            play.toQuat,
            THREE.MathUtils.smoothstep(playSeat(playHead()), 0.22, 1),
          );
        } else {
          if (!play.held) {
            play.spin += SPIN_SPEED * dt;
          }
          play.rig.position.copy(dockAt);
          play.rig.quaternion.copy(play.toQuat);
        }
        play.rig.rotateOnAxis(localSpinAxis, play.spin);
      }
    }
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  }
  tick();
  resize();

  return {
    setSlide: (index, opts) => {
      const next = clampSlide(Math.round(index));
      if (play) {
        beginEject(next === targetSlide ? undefined : next);
        return;
      }
      beginSlideTo(next, opts?.immediate);
    },
    setTune: (itemIndex, tune) => {
      const slot = slots[itemIndex];
      if (!slot) return;
      slot.tune.x = tune.x;
      slot.tune.y = tune.y;
      slot.tune.z = tune.z;
      slot.tune.open = tune.open;
    },
    setCameraTune: (tune) => {
      distMul = tune.distance;
      heightMul = tune.height;
      lerpSpeed = THREE.MathUtils.clamp(tune.lerp, 0.012, 0.2);
    },
    setShopHoverTune: (tune) => {
      shopHoverLift = THREE.MathUtils.clamp(tune.lift, 0, 1.5);
      shopHoverPush = THREE.MathUtils.clamp(tune.push, 0, 1.5);
    },
    setGlassTune: (tune) => {
      applyGlassTune(scene, tune);
    },
    setHover: (hovering) => {
      hoverButton = hovering;
    },
    playLearnMore: (opts) => {
      if (play?.held) restorePlay();
      beginPlay(Boolean(opts?.instant));
    },
    setPlayProgress,
    setCloseProgress,
    setPlayBeats,
    setReadAmount: (amount) => {
      readAmountTarget = THREE.MathUtils.clamp(amount, 0, 1);
    },
    setPlayerPeek: (peeking) => {
      playerPeekTarget = peeking ? 1 : 0;
    },
    eject: () => {
      if (!play) {
        options.onPlaying?.(false);
        options.onPhase?.(null);
        return;
      }
      beginEject();
    },
    dispose: () => {
      disposed = true;
      restorePlay();
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      canvas.style.cursor = "";
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("wheel", onWheel);
      draco.dispose();
      pmrem.dispose();
      for (const slot of slots) {
        disposeVectorPrints(slot.art);
        disposeIfCanvas(
          slot.art.front?.map === slot.art.frontSource ? null : slot.art.front?.map,
        );
        disposeIfCanvas(
          slot.art.back?.map === slot.art.backSource ? null : slot.art.back?.map,
        );
        disposeIfCanvas(
          slot.art.disc?.map === slot.art.discSource ? null : slot.art.disc?.map,
        );
      }
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse((obj) => {
        if (!isMesh(obj)) return;
        geometries.add(obj.geometry);
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        for (const mat of mats) materials.add(mat);
      });
      for (const geometry of geometries) geometry.dispose();
      for (const material of materials) material.dispose();
      renderer.dispose();
    },
  };
}
