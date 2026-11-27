import * as THREE from "three";
import type { DummyAlbum } from "@/lib/work-cd/albums";
import {
  VECTOR_PRINT_PREFIX,
  DISC_RING_INNER,
  detachVectorPrint,
  discPaperFrame,
  discRingGeometry,
  insertUnderGlass,
  isDiscHub,
  mixHex,
  thinBoxFrame,
  type PaperFrame,
  type VectorHosts,
} from "./jewel-case-vector";

export const CANVAS_PRINT_SIZE = 2048;
export const COVER_PRINT_SIZE = 4096;
export const COVER_SOURCE_MIN = 1024;
export const COVER_SOURCE_SCALE = 2;
export const INSERT_INSET = 0.99;
const FONT_STACK = '"Mackinac", Georgia, "Times New Roman", serif';
const coverImageCache = new Map<string, Promise<THREE.Texture>>();

function mix(a: string, b: string, t: number) {
  return mixHex(a, b, t);
}

export async function readyFonts() {
  if (typeof document === "undefined" || !document.fonts?.load) return;
  await Promise.all([
    document.fonts.load(`600 300px ${FONT_STACK}`),
    document.fonts.load(`400 120px ${FONT_STACK}`),
    document.fonts.load(`600 128px ${FONT_STACK}`),
    document.fonts.load(`400 48px ${FONT_STACK}`),
  ]).catch(() => undefined);
}

function makeCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create a 2D canvas.");
  return { canvas, ctx };
}

export function paintCoverCanvas(album: DummyAlbum) {
  const size = COVER_PRINT_SIZE;
  const { canvas, ctx } = makeCanvas(size, size);
  ctx.fillStyle = album.a;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = album.b;
  ctx.beginPath();
  ctx.arc(size * 0.78, size * 0.22, size * 0.34, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = mix(album.a, album.b, 0.35);
  ctx.fillRect(0, size * 0.62, size, size * 0.38);
  ctx.fillStyle = album.ink;
  ctx.textBaseline = "top";
  ctx.font = `600 ${Math.round(size * 0.072)}px ${FONT_STACK}`;
  ctx.fillText(album.title, size * 0.07, size * 0.68);
  ctx.font = `400 ${Math.round(size * 0.028)}px ${FONT_STACK}`;
  ctx.fillText(`${album.sub}  ·  ${album.year}`, size * 0.07, size * 0.78);
  ctx.font = `400 ${Math.round(size * 0.018)}px ${FONT_STACK}`;
  ctx.fillText("DESKTOP OF SAMUEL", size * 0.07, size * 0.86);
  return canvas;
}

export function paintBackCanvas(album: DummyAlbum) {
  const w = CANVAS_PRINT_SIZE;
  const h = Math.round(CANVAS_PRINT_SIZE * 0.85);
  const { canvas, ctx } = makeCanvas(w, h);
  ctx.fillStyle = album.a;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = album.b;
  ctx.fillRect(0, 0, w, Math.round(h * 0.018));
  ctx.fillRect(0, h - Math.round(h * 0.018), w, Math.round(h * 0.018));
  ctx.fillStyle = album.ink;
  ctx.textBaseline = "top";
  ctx.font = `600 ${Math.round(w * 0.048)}px ${FONT_STACK}`;
  ctx.fillText(album.title, w * 0.072, h * 0.12);
  ctx.font = `400 ${Math.round(w * 0.024)}px ${FONT_STACK}`;
  ctx.fillText(`${album.sub}  ·  ${album.year}`, w * 0.072, h * 0.2);
  ctx.font = `400 ${Math.round(w * 0.022)}px ${FONT_STACK}`;
  album.tracks.forEach((track, i) => {
    const n = String(i + 1).padStart(2, "0");
    ctx.fillText(`${n}   ${track}`, w * 0.072, h * 0.32 + i * h * 0.08);
  });
  ctx.font = `400 ${Math.round(w * 0.016)}px ${FONT_STACK}`;
  ctx.fillText("DESKTOP OF SAMUEL", w * 0.072, h * 0.88);
  return canvas;
}

export function paintDiscCanvas(album: DummyAlbum) {
  const size = CANVAS_PRINT_SIZE;
  const { canvas, ctx } = makeCanvas(size, size);
  const cx = size / 2;
  const cy = size / 2;
  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.47, 0, Math.PI * 2);
  ctx.arc(cx, cy, size * 0.47 * DISC_RING_INNER, 0, Math.PI * 2, true);
  ctx.clip();
  ctx.fillStyle = album.a;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = album.b;
  ctx.beginPath();
  ctx.arc(size * 0.62, size * 0.36, size * 0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = album.ink;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `600 ${Math.round(size * 0.048)}px ${FONT_STACK}`;
  ctx.fillText(album.title, cx, cy + size * 0.22);
  ctx.font = `400 ${Math.round(size * 0.022)}px ${FONT_STACK}`;
  ctx.fillText(`${album.sub}  ·  ${album.year}`, cx, cy + size * 0.29);
  ctx.font = `400 ${Math.round(size * 0.014)}px ${FONT_STACK}`;
  ctx.fillText("DESKTOP OF SAMUEL", cx, cy + size * 0.35);
  ctx.restore();
  return canvas;
}

export function canvasTexture(canvas: HTMLCanvasElement, anisotropy: number) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.generateMipmaps = false;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = anisotropy;
  tex.needsUpdate = true;
  return tex;
}

export function isSharedCoverTexture(tex: THREE.Texture | null | undefined) {
  return tex?.userData.sharedCover === true;
}

function coverTextureSize(srcW: number, srcH: number) {
  const src = Math.max(srcW, srcH, COVER_SOURCE_MIN);
  return Math.max(COVER_PRINT_SIZE, src * COVER_SOURCE_SCALE);
}

function loadCoverImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Could not load cover ${url}`));
    img.src = url;
  });
}

function upsampleCoverImage(img: HTMLImageElement) {
  const size = coverTextureSize(img.naturalWidth, img.naturalHeight);
  const { canvas, ctx } = makeCanvas(size, size);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, size, size);
  return { canvas, size, source: Math.max(img.naturalWidth, img.naturalHeight) };
}

export async function albumCoverTexture(album: DummyAlbum, anisotropy: number) {
  if (!album.coverUrl) return canvasTexture(paintCoverCanvas(album), anisotropy);
  let pending = coverImageCache.get(album.coverUrl);
  if (!pending) {
    pending = loadCoverImage(album.coverUrl).then((img) => {
      const { canvas, size, source } = upsampleCoverImage(img);
      const tex = canvasTexture(canvas, anisotropy);
      tex.userData.sharedCover = true;
      tex.userData.sourceSize = source;
      tex.userData.textureSize = size;
      return tex;
    });
    coverImageCache.set(album.coverUrl, pending);
  }
  const tex = await pending;
  tex.anisotropy = Math.max(tex.anisotropy, anisotropy);
  return tex;
}

function attachTextureCard(
  mesh: THREE.Mesh,
  frame: PaperFrame,
  texture: THREE.Texture | null,
  kind: string,
  inset: number,
  options: { transparent?: boolean; side?: THREE.Side; color?: string } = {},
) {
  const transparent = options.transparent ?? false;
  const side = options.side ?? THREE.FrontSide;
  const existing = mesh.getObjectByName(`${VECTOR_PRINT_PREFIX}-${kind}`);
  if (existing) {
    mesh.remove(existing);
    existing.traverse((obj) => {
      if (!(obj as THREE.Mesh).isMesh) return;
      const mat = (obj as THREE.Mesh).material;
      const single = Array.isArray(mat) ? mat[0] : mat;
      if (
        single instanceof THREE.MeshStandardMaterial ||
        single instanceof THREE.MeshPhysicalMaterial
      ) {
        if (single.map && !isSharedCoverTexture(single.map)) single.map.dispose();
        single.dispose();
      } else if (single) {
        single.dispose();
      }
      (obj as THREE.Mesh).geometry.dispose();
    });
  }
  const fitW = kind.startsWith("disc") ? Math.min(frame.width, frame.height) : frame.width * inset;
  const fitH = kind.startsWith("disc") ? fitW : frame.height * inset;
  const mat = new THREE.MeshStandardMaterial({
    map: texture,
    color: options.color ?? "#ffffff",
    roughness: 0.88,
    metalness: 0,
    transparent,
    alphaTest: transparent ? 0.08 : 0,
    polygonOffset: true,
    polygonOffsetFactor: -4,
    polygonOffsetUnits: -4,
    side,
    toneMapped: true,
  });
  const plane = new THREE.Mesh(
    kind.startsWith("disc") ? discRingGeometry(1) : new THREE.PlaneGeometry(1, 1),
    mat,
  );
  const rotateCover = kind === "cover";
  plane.scale.set(rotateCover ? fitH : fitW, rotateCover ? fitW : fitH, 1);
  const overlay = new THREE.Group();
  overlay.name = `${VECTOR_PRINT_PREFIX}-${kind}`;
  overlay.add(plane);
  overlay.position.copy(frame.center);
  overlay.quaternion.setFromRotationMatrix(
    new THREE.Matrix4().makeBasis(frame.tangent, frame.bitangent, frame.normal),
  );
  if (rotateCover) overlay.rotateZ(-Math.PI / 2);
  const isInsert = kind === "cover" || kind === "paper";
  overlay.renderOrder = isInsert ? 0 : 2;
  plane.renderOrder = isInsert ? 0 : 2;
  if (isInsert) {
    mat.polygonOffset = false;
    mat.depthWrite = true;
    mat.transparent = false;
    mat.alphaTest = 0;
  }
  mesh.add(overlay);
}

export async function applyPlanarCanvasAlbum(
  hosts: VectorHosts,
  album: DummyAlbum,
  anisotropy: number,
) {
  await readyFonts();
  const { lid, tray, glass, discs } = hosts;
  const primaryDisc = discs[0] ?? null;
  const coverTex = await albumCoverTexture(album, anisotropy);
  const backTex = canvasTexture(paintBackCanvas(album), anisotropy);
  const discTex = canvasTexture(paintDiscCanvas(album), anisotropy);
  const insert = insertUnderGlass(glass, lid, tray, primaryDisc);

  if (insert) {
    detachVectorPrint(insert.host);
    if (insert.pane !== insert.host) detachVectorPrint(insert.pane);
    if (lid && lid !== insert.host) detachVectorPrint(lid);
    attachTextureCard(insert.host, insert.cover, coverTex, "cover", INSERT_INSET, {
      side: THREE.FrontSide,
    });
    attachTextureCard(insert.host, insert.paper, null, "paper", INSERT_INSET, {
      side: THREE.FrontSide,
      color: insert.paperColor,
    });
  }
  if (tray) {
    detachVectorPrint(tray);
    attachTextureCard(
      tray,
      thinBoxFrame(tray, primaryDisc ?? lid, true, 0.00028),
      backTex,
      "back",
      0.88,
      { side: THREE.FrontSide },
    );
  }
  for (const disc of discs) {
    detachVectorPrint(disc);
    if (isDiscHub(disc, discs)) continue;
    attachTextureCard(disc, discPaperFrame(disc), discTex, "disc", 1, {
      transparent: true,
      side: THREE.FrontSide,
    });
  }
}

