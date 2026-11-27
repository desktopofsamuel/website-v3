import * as THREE from "three";
import { Font, FontLoader } from "three/addons/loaders/FontLoader.js";
import type { DummyAlbum } from "@/lib/work-cd/albums";

function isMesh(obj: THREE.Object3D): obj is THREE.Mesh {
  return (obj as THREE.Mesh).isMesh === true;
}

export const VECTOR_FONT_URL = "/dev/work-cd/helvetiker_regular.typeface.json";
export const VECTOR_PRINT_PREFIX = "vector-print";

let fontPromise: Promise<Font> | null = null;

export function ensureArtFont() {
  fontPromise ??= new FontLoader().loadAsync(VECTOR_FONT_URL);
  return fontPromise;
}

const DISC_SEGMENTS = 192;
const PRINT_CURVE_SEGMENTS = 48;
/** Inner hole as a fraction of disc radius — stacking ring, like the back. */
export const DISC_RING_INNER = 0.34;

function paperMat(color: THREE.Color | string, opacity = 1) {
  const mapped = color instanceof THREE.Color ? color : new THREE.Color(color);
  return new THREE.MeshStandardMaterial({
    color: mapped,
    roughness: 0.88,
    metalness: 0,
    transparent: opacity < 0.999,
    opacity,
    side: THREE.FrontSide,
    polygonOffset: true,
    polygonOffsetFactor: -4,
    polygonOffsetUnits: -4,
    depthWrite: opacity > 0.95,
    toneMapped: true,
    dithering: false,
  });
}

export function disposePrintObject(root: THREE.Object3D) {
  root.traverse((obj) => {
    if (!isMesh(obj)) return;
    obj.geometry.dispose();
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const mat of mats) {
      const mapped = mat as THREE.MeshStandardMaterial;
      if (mapped.map && (mapped.map as THREE.CanvasTexture).isCanvasTexture) {
        mapped.map.dispose();
      }
      mat.dispose();
    }
  });
}

export function detachVectorPrint(mesh: THREE.Mesh | null | undefined) {
  if (!mesh) return;
  const stale = mesh.children.filter((child) => child.name.startsWith(VECTOR_PRINT_PREFIX));
  for (const old of stale) {
    mesh.remove(old);
    disposePrintObject(old);
  }
}

function liftAlongNormal(mesh: THREE.Mesh, normal: THREE.Vector3, worldLift: number) {
  mesh.updateWorldMatrix(true, false);
  const worldUnit = Math.max(
    normal.clone().transformDirection(mesh.matrixWorld).length(),
    1e-12,
  );
  if (!mesh.geometry.boundingSphere) mesh.geometry.computeBoundingSphere();
  const radius = mesh.geometry.boundingSphere?.radius ?? 1;
  return Math.min(worldLift / worldUnit, radius * 0.02);
}

function frameTangents(mesh: THREE.Mesh, normal: THREE.Vector3) {
  const localUp = new THREE.Vector3(0, 1, 0).transformDirection(
    new THREE.Matrix4().copy(mesh.matrixWorld).invert(),
  );
  localUp.addScaledVector(normal, -localUp.dot(normal));
  let tangent: THREE.Vector3;
  let bitangent: THREE.Vector3;
  if (localUp.lengthSq() > 1e-8) {
    bitangent = localUp.normalize();
    tangent = new THREE.Vector3().crossVectors(bitangent, normal).normalize();
    bitangent = new THREE.Vector3().crossVectors(normal, tangent).normalize();
  } else {
    const ref =
      Math.abs(normal.y) > 0.86 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
    tangent = new THREE.Vector3().crossVectors(ref, normal).normalize();
    bitangent = new THREE.Vector3().crossVectors(normal, tangent).normalize();
  }
  return { tangent, bitangent };
}

function projectExtents(
  pos: THREE.BufferAttribute | THREE.InterleavedBufferAttribute,
  normal: THREE.Vector3,
  tangent: THREE.Vector3,
  bitangent: THREE.Vector3,
) {
  const vert = new THREE.Vector3();
  let minN = Infinity;
  let maxN = -Infinity;
  let minU = Infinity;
  let maxU = -Infinity;
  let minV = Infinity;
  let maxV = -Infinity;
  for (let i = 0; i < pos.count; i++) {
    vert.fromBufferAttribute(pos, i);
    const d = vert.dot(normal);
    if (d < minN) minN = d;
    if (d > maxN) maxN = d;
    const u = vert.dot(tangent);
    const v = vert.dot(bitangent);
    if (u < minU) minU = u;
    if (u > maxU) maxU = u;
    if (v < minV) minV = v;
    if (v > maxV) maxV = v;
  }
  return { minN, maxN, minU, maxU, minV, maxV, width: maxU - minU, height: maxV - minV };
}

export type PaperFrame = {
  center: THREE.Vector3;
  normal: THREE.Vector3;
  tangent: THREE.Vector3;
  bitangent: THREE.Vector3;
  width: number;
  height: number;
};

export function thinBoxFrame(
  mesh: THREE.Mesh,
  toward: THREE.Object3D | null,
  away: boolean,
  worldLift: number,
): PaperFrame {
  const geom = mesh.geometry;
  const pos = geom.attributes.position;
  if (!geom.boundingBox) geom.computeBoundingBox();
  const box = geom.boundingBox;
  const size = box ? box.getSize(new THREE.Vector3()) : new THREE.Vector3(1, 1, 1);
  const normal = new THREE.Vector3(0, 1, 0);
  if (size.x <= size.y && size.x <= size.z) normal.set(1, 0, 0);
  else if (size.z <= size.x && size.z <= size.y) normal.set(0, 0, 1);

  mesh.updateWorldMatrix(true, false);
  if (toward) {
    toward.updateWorldMatrix(true, false);
    const meshCenter = (box ?? new THREE.Box3()).getCenter(new THREE.Vector3()).applyMatrix4(
      mesh.matrixWorld,
    );
    const target = new THREE.Box3().setFromObject(toward).getCenter(new THREE.Vector3());
    const toTarget = target.sub(meshCenter);
    if (toTarget.lengthSq() > 1e-12) {
      toTarget.normalize();
      const worldN = normal.clone().transformDirection(mesh.matrixWorld).normalize();
      const facing = worldN.dot(toTarget) > 0;
      if (away === facing) normal.negate();
    } else if (away) {
      normal.negate();
    }
  } else {
    const worldN = normal.clone().transformDirection(mesh.matrixWorld);
    if (worldN.y < 0 || (Math.abs(worldN.y) < 0.2 && worldN.z < 0)) normal.negate();
    if (away) normal.negate();
  }

  const { tangent, bitangent } = frameTangents(mesh, normal);
  const extents = projectExtents(pos, normal, tangent, bitangent);
  const lift = liftAlongNormal(mesh, normal, worldLift);
  const center = tangent
    .clone()
    .multiplyScalar((extents.minU + extents.maxU) * 0.5)
    .addScaledVector(bitangent, (extents.minV + extents.maxV) * 0.5)
    .addScaledVector(normal, extents.maxN + lift);
  return {
    center,
    normal,
    tangent,
    bitangent,
    width: extents.width,
    height: extents.height,
  };
}

const PAPER_THICKNESS = 0.00045;
const PAPER_BACK = "#f3eee4";

function frameInParent(frame: PaperFrame, from: THREE.Mesh, to: THREE.Mesh): PaperFrame {
  if (from === to) {
    return {
      center: frame.center.clone(),
      normal: frame.normal.clone(),
      tangent: frame.tangent.clone(),
      bitangent: frame.bitangent.clone(),
      width: frame.width,
      height: frame.height,
    };
  }
  from.updateWorldMatrix(true, false);
  to.updateWorldMatrix(true, false);
  const toLocal = to.matrixWorld.clone().invert();
  const mapPoint = (point: THREE.Vector3) =>
    point.clone().applyMatrix4(from.matrixWorld).applyMatrix4(toLocal);
  const mapDir = (dir: THREE.Vector3) =>
    dir.clone().transformDirection(from.matrixWorld).transformDirection(toLocal).normalize();
  const center = mapPoint(frame.center);
  const tangent = mapDir(frame.tangent);
  const bitangent = mapDir(frame.bitangent);
  const widthEnd = mapPoint(frame.center.clone().addScaledVector(frame.tangent, frame.width));
  const heightEnd = mapPoint(frame.center.clone().addScaledVector(frame.bitangent, frame.height));
  return {
    center,
    normal: mapDir(frame.normal),
    tangent,
    bitangent,
    width: widthEnd.distanceTo(center),
    height: heightEnd.distanceTo(center),
  };
}

export function insertUnderGlass(
  glass: THREE.Mesh | null,
  lid: THREE.Mesh | null,
  tray: THREE.Mesh | null,
  disc: THREE.Mesh | null,
) {
  const pane = glass ?? lid;
  if (!pane) return null;
  const host = lid ?? pane;
  const toward = tray ?? disc ?? (pane === lid ? glass : lid);
  const inner = thinBoxFrame(pane, toward, false, 0.00022);
  const thickness = liftAlongNormal(pane, inner.normal, PAPER_THICKNESS);
  const cover = frameInParent(
    {
      center: inner.center.clone(),
      normal: inner.normal.clone().negate(),
      tangent: inner.tangent.clone(),
      bitangent: inner.bitangent.clone().negate(),
      width: inner.width,
      height: inner.height,
    },
    pane,
    host,
  );
  const paper = frameInParent(
    {
      center: inner.center.clone().addScaledVector(inner.normal, thickness),
      normal: inner.normal.clone(),
      tangent: inner.tangent.clone(),
      bitangent: inner.bitangent.clone(),
      width: inner.width,
      height: inner.height,
    },
    pane,
    host,
  );
  return { host, pane, cover, paper, paperColor: PAPER_BACK };
}

export function discPaperFrame(mesh: THREE.Mesh): PaperFrame {
  const frame = thinBoxFrame(mesh, null, false, 0.00012);
  const diameter = Math.min(frame.width, frame.height);
  return { ...frame, width: diameter, height: diameter };
}

/** Hub/stacking-ring mesh is much smaller than the disc; skip painting it. */
export function isDiscHub(mesh: THREE.Mesh, discs: THREE.Mesh[]) {
  const r = discPaperFrame(mesh).width;
  const max = Math.max(0, ...discs.map((d) => discPaperFrame(d).width));
  return r < max * 0.6;
}

export function discRingGeometry(diameter = 1, innerFrac = DISC_RING_INNER) {
  const outer = diameter / 2;
  const inner = outer * innerFrac;
  const geom = new THREE.RingGeometry(inner, outer, DISC_SEGMENTS);
  const pos = geom.attributes.position;
  const uv = geom.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, pos.getX(i) / diameter + 0.5, pos.getY(i) / diameter + 0.5);
  }
  uv.needsUpdate = true;
  return geom;
}

export function addLabel(
  group: THREE.Group,
  font: Font,
  text: string,
  x: number,
  y: number,
  size: number,
  color: string,
  align: "left" | "center",
  maxWidth: number,
) {
  const shapes = font.generateShapes(text, size);
  if (shapes.length === 0) return;
  const geom = new THREE.ShapeGeometry(shapes, PRINT_CURVE_SEGMENTS);
  geom.computeBoundingBox();
  const bb = geom.boundingBox;
  if (!bb) return;
  const width = Math.max(bb.max.x - bb.min.x, 1e-4);
  const mesh = new THREE.Mesh(geom, paperMat(new THREE.Color(color)));
  const sx = width > maxWidth ? maxWidth / width : 1;
  mesh.scale.set(sx, -1, 1);
  const left = align === "center" ? x - (width * sx) / 2 : x;
  mesh.position.set(left - bb.min.x * sx, y, 0.002);
  group.add(mesh);
}

export function attachPrint(
  mesh: THREE.Mesh,
  svgWidth: number,
  svgHeight: number,
  build: (art: THREE.Group) => void,
  kind: string,
  frame: PaperFrame,
  inset = 0.91,
  side: THREE.Side = THREE.FrontSide,
) {
  const existing = mesh.getObjectByName(`${VECTOR_PRINT_PREFIX}-${kind}`);
  if (existing) {
    mesh.remove(existing);
    disposePrintObject(existing);
  }
  const fitW = kind === "disc" ? Math.min(frame.width, frame.height) : frame.width * inset;
  const fitH = kind === "disc" ? fitW : frame.height * inset;
  const content = new THREE.Group();
  build(content);
  content.position.set(-svgWidth / 2, -svgHeight / 2, 0);
  const art = new THREE.Group();
  art.add(content);
  art.scale.set(fitW / svgWidth, -fitH / svgHeight, 1);
  const overlay = new THREE.Group();
  overlay.name = `${VECTOR_PRINT_PREFIX}-${kind}`;
  overlay.add(art);
  overlay.position.copy(frame.center);
  overlay.quaternion.setFromRotationMatrix(
    new THREE.Matrix4().makeBasis(frame.tangent, frame.bitangent, frame.normal),
  );
  const isInsert = kind === "cover" || kind === "paper";
  overlay.renderOrder = isInsert ? 0 : 2;
  overlay.traverse((obj) => {
    if (!isMesh(obj)) return;
    obj.renderOrder = isInsert ? 0 : 2;
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const item of mats) {
      item.side = side;
      if (isInsert && "polygonOffset" in item) {
        item.polygonOffset = false;
        item.depthWrite = true;
        item.transparent = false;
      }
    }
  });
  mesh.add(overlay);
}

export function mixHex(a: string, b: string, t: number) {
  const parse = (hex: string) => {
    const n = hex.replace("#", "");
    return [
      Number.parseInt(n.slice(0, 2), 16),
      Number.parseInt(n.slice(2, 4), 16),
      Number.parseInt(n.slice(4, 6), 16),
    ] as const;
  };
  const A = parse(a);
  const B = parse(b);
  const to = (i: number) =>
    Math.round(A[i] * (1 - t) + B[i] * t)
      .toString(16)
      .padStart(2, "0");
  return `#${to(0)}${to(1)}${to(2)}`;
}

function addRect(
  art: THREE.Group,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  z = 0,
) {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), paperMat(color));
  mesh.position.set(x + w / 2, y + h / 2, z);
  art.add(mesh);
}

export function addCoverPrint(art: THREE.Group, album: DummyAlbum) {
  addRect(art, 0, 0, 1000, 1000, album.a);
  const accent = new THREE.Mesh(new THREE.CircleGeometry(340, DISC_SEGMENTS), paperMat(album.b));
  accent.position.set(780, 220, 0.001);
  art.add(accent);
  addRect(art, 0, 620, 1000, 380, mixHex(album.a, album.b, 0.35), 0.001);
}

export function addBackPrint(art: THREE.Group, album: DummyAlbum) {
  addRect(art, 0, 0, 1000, 850, album.a);
  addRect(art, 0, 0, 1000, 16, album.b, 0.001);
  addRect(art, 0, 834, 1000, 16, album.b, 0.001);
}

export function addDiscPrint(art: THREE.Group, album: DummyAlbum) {
  const label = new THREE.Mesh(
    new THREE.RingGeometry(470 * DISC_RING_INNER, 470, DISC_SEGMENTS),
    paperMat(album.a),
  );
  label.position.set(500, 500, 0);
  art.add(label);

  const accent = new THREE.Mesh(new THREE.CircleGeometry(250, DISC_SEGMENTS), paperMat(album.b));
  accent.position.set(620, 360, 0.001);
  art.add(accent);
}

export type VectorHosts = {
  lid: THREE.Mesh | null;
  tray: THREE.Mesh | null;
  glass: THREE.Mesh | null;
  discs: THREE.Mesh[];
};

export function applyPlanarVectorAlbum(hosts: VectorHosts, album: DummyAlbum, font: Font) {
  const { lid, tray, glass, discs } = hosts;
  const primaryDisc = discs[0] ?? null;

  const insert = insertUnderGlass(glass, lid, tray, primaryDisc);
  if (insert) {
    detachVectorPrint(insert.host);
    if (insert.pane !== insert.host) detachVectorPrint(insert.pane);
    if (lid && lid !== insert.host) detachVectorPrint(lid);
    attachPrint(
      insert.host,
      1000,
      1000,
      (art) => {
        addCoverPrint(art, album);
        addLabel(art, font, album.title, 70, 780, 64, album.ink, "left", 860);
        addLabel(art, font, `${album.sub}  |  ${album.year}`, 70, 850, 32, album.ink, "left", 860);
        addLabel(art, font, "DESKTOP OF SAMUEL", 70, 910, 20, album.ink, "left", 860);
      },
      "cover",
      insert.cover,
      0.92,
      THREE.FrontSide,
    );
    attachPrint(
      insert.host,
      1000,
      1000,
      (art) => {
        addRect(art, 0, 0, 1000, 1000, insert.paperColor);
      },
      "paper",
      insert.paper,
      0.92,
      THREE.FrontSide,
    );
  }

  if (tray) {
    detachVectorPrint(tray);
    const back = thinBoxFrame(tray, primaryDisc ?? lid, true, 0.00028);
    attachPrint(
      tray,
      1000,
      850,
      (art) => {
        addBackPrint(art, album);
        addLabel(art, font, album.title, 72, 120, 48, album.ink, "left", 860);
        addLabel(art, font, `${album.sub}  |  ${album.year}`, 72, 175, 26, album.ink, "left", 860);
        album.tracks.forEach((track, i) => {
          addLabel(
            art,
            font,
            `${String(i + 1).padStart(2, "0")}   ${track}`,
            72,
            280 + i * 52,
            24,
            album.ink,
            "left",
            860,
          );
        });
        addLabel(art, font, "DESKTOP OF SAMUEL", 72, 780, 18, album.ink, "left", 860);
      },
      "back",
      back,
      0.88,
    );
  }

  for (const disc of discs) {
    detachVectorPrint(disc);
    if (isDiscHub(disc, discs)) continue;
    attachPrint(
      disc,
      1000,
      1000,
      (art) => {
        addDiscPrint(art, album);
        addLabel(art, font, album.title, 500, 720, 48, album.ink, "center", 620);
        addLabel(art, font, `${album.sub}  |  ${album.year}`, 500, 790, 24, album.ink, "center", 560);
        addLabel(art, font, "DESKTOP OF SAMUEL", 500, 850, 16, album.ink, "center", 500);
      },
      "disc",
      discPaperFrame(disc),
      1,
      THREE.FrontSide,
    );
  }
}

export const applyVectorAlbum = applyPlanarVectorAlbum;

export function clearPrintedMaps(
  mat: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial | null,
  source: THREE.Texture | null,
) {
  if (!mat) return;
  if (mat.map && mat.map !== source) {
    if ((mat.map as THREE.CanvasTexture).isCanvasTexture) mat.map.dispose();
  }
  mat.map = null;
  mat.color.set("#efeae2");
  mat.needsUpdate = true;
}
