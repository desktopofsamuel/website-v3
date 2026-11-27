import * as THREE from "three";
import type { Font } from "three/addons/loaders/FontLoader.js";
import type { DummyAlbum } from "@/lib/work-cd/albums";
import {
  addBackPrint,
  addCoverPrint,
  addDiscPrint,
  addLabel,
  attachPrint,
  detachVectorPrint,
  discPaperFrame,
  type PaperFrame,
} from "./jewel-case-vector";

type IslandTri = {
  n: THREE.Vector3;
  uvArea: number;
  posArea: number;
  verts: [THREE.Vector3, THREE.Vector3, THREE.Vector3];
  uvs: [THREE.Vector2, THREE.Vector2, THREE.Vector2];
};

function islandTriangles(mesh: THREE.Mesh): IslandTri[] {
  const geom = mesh.geometry;
  const pos = geom.attributes.position;
  const uv = geom.attributes.uv;
  const nor = geom.attributes.normal;
  if (!pos) return [];
  const index = geom.index;
  const triCount = index ? index.count / 3 : Math.floor(pos.count / 3);
  const tris: IslandTri[] = [];
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const uv0 = new THREE.Vector2();
  const uv1 = new THREE.Vector2();
  const uv2 = new THREE.Vector2();
  for (let t = 0; t < triCount; t++) {
    const i0 = index ? index.getX(t * 3) : t * 3;
    const i1 = index ? index.getX(t * 3 + 1) : t * 3 + 1;
    const i2 = index ? index.getX(t * 3 + 2) : t * 3 + 2;
    a.fromBufferAttribute(pos, i0);
    b.fromBufferAttribute(pos, i1);
    c.fromBufferAttribute(pos, i2);
    const n = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a));
    const posArea = n.length() * 0.5;
    if (posArea < 1e-12) continue;
    n.normalize();
    if (nor) {
      n.set(0, 0, 0);
      n.x += nor.getX(i0) + nor.getX(i1) + nor.getX(i2);
      n.y += nor.getY(i0) + nor.getY(i1) + nor.getY(i2);
      n.z += nor.getZ(i0) + nor.getZ(i1) + nor.getZ(i2);
      if (n.lengthSq() < 1e-10) continue;
      n.normalize();
    }
    let uvArea = posArea;
    if (uv) {
      uv0.set(uv.getX(i0), uv.getY(i0));
      uv1.set(uv.getX(i1), uv.getY(i1));
      uv2.set(uv.getX(i2), uv.getY(i2));
      uvArea =
        Math.abs((uv1.x - uv0.x) * (uv2.y - uv0.y) - (uv2.x - uv0.x) * (uv1.y - uv0.y)) * 0.5;
    }
    tris.push({
      n: n.clone(),
      uvArea,
      posArea,
      verts: [a.clone(), b.clone(), c.clone()],
      uvs: [uv0.clone(), uv1.clone(), uv2.clone()],
    });
  }
  if (tris.length === 0) return tris;
  const dominant = new THREE.Vector3();
  for (const tri of tris) dominant.addScaledVector(tri.n, tri.uvArea);
  if (dominant.lengthSq() < 1e-12) {
    for (const tri of tris) dominant.add(tri.n);
  }
  dominant.normalize();
  const aligned = tris.filter((tri) => tri.n.dot(dominant) > 0.82);
  return aligned.length > 12 ? aligned : tris;
}

function uvTangent(island: IslandTri[]) {
  const p0 = new THREE.Vector3();
  const p1 = new THREE.Vector3();
  const p2 = new THREE.Vector3();
  const uv0 = new THREE.Vector2();
  const uv1 = new THREE.Vector2();
  const uv2 = new THREE.Vector2();
  const tangent = new THREE.Vector3();
  const bitangent = new THREE.Vector3();
  for (const tri of island) {
    p0.copy(tri.verts[0]);
    p1.copy(tri.verts[1]).sub(p0);
    p2.copy(tri.verts[2]).sub(p0);
    uv0.copy(tri.uvs[0]);
    uv1.copy(tri.uvs[1]).sub(uv0);
    uv2.copy(tri.uvs[2]).sub(uv0);
    const denom = uv1.x * uv2.y - uv1.y * uv2.x;
    if (Math.abs(denom) < 1e-10) continue;
    const r = 1 / denom;
    tangent.copy(p1).multiplyScalar(uv2.y).addScaledVector(p2, -uv1.y).multiplyScalar(r);
    bitangent.copy(p2).multiplyScalar(uv1.x).addScaledVector(p1, -uv2.x).multiplyScalar(r);
    if (tangent.lengthSq() > 1e-12 && bitangent.lengthSq() > 1e-12) {
      return { tangent: tangent.normalize(), bitangent: bitangent.normalize() };
    }
  }
  return null;
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

function projectVertExtents(
  verts: THREE.Vector3[],
  normal: THREE.Vector3,
  tangent: THREE.Vector3,
  bitangent: THREE.Vector3,
) {
  let minN = Infinity;
  let maxN = -Infinity;
  let minU = Infinity;
  let maxU = -Infinity;
  let minV = Infinity;
  let maxV = -Infinity;
  for (const vert of verts) {
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

function clusterCentroid(cluster: IslandTri[]) {
  const c = new THREE.Vector3();
  let weight = 0;
  for (const tri of cluster) {
    const w = tri.posArea + 1e-8;
    c.addScaledVector(tri.verts[0], w);
    c.addScaledVector(tri.verts[1], w);
    c.addScaledVector(tri.verts[2], w);
    weight += w * 3;
  }
  if (weight > 0) c.multiplyScalar(1 / weight);
  return c;
}

function faceClusterAlignedWith(mesh: THREE.Mesh, axis: THREE.Vector3) {
  const tris = islandTriangles(mesh);
  if (tris.length === 0) return tris;
  const groups = new Map<string, IslandTri[]>();
  for (const tri of tris) {
    const key = `${tri.n.x.toFixed(2)},${tri.n.y.toFixed(2)},${tri.n.z.toFixed(2)}`;
    const list = groups.get(key);
    if (list) list.push(tri);
    else groups.set(key, [tri]);
  }
  mesh.updateWorldMatrix(true, false);
  let best = tris;
  let bestScore = -1;
  for (const group of groups.values()) {
    const n = new THREE.Vector3();
    let area = 0;
    for (const tri of group) {
      n.addScaledVector(tri.n, tri.posArea);
      area += tri.posArea;
    }
    if (n.lengthSq() < 1e-12) continue;
    n.normalize().transformDirection(mesh.matrixWorld).normalize();
    const score = Math.abs(n.dot(axis)) * area;
    if (score > bestScore) {
      bestScore = score;
      best = group;
    }
  }
  return best;
}

function coverPaperFrame(mesh: THREE.Mesh, towardParent = true): PaperFrame {
  mesh.updateWorldMatrix(true, false);
  const parent = mesh.parent;
  const axis = new THREE.Vector3(0, 1, 0);
  if (parent) {
    parent.updateWorldMatrix(true, false);
    axis.transformDirection(parent.matrixWorld).normalize();
  }
  const cluster = faceClusterAlignedWith(mesh, axis);
  const normal = new THREE.Vector3();
  if (cluster.length > 0) {
    for (const tri of cluster) normal.addScaledVector(tri.n, tri.uvArea + tri.posArea);
  }
  if (normal.lengthSq() < 1e-12) {
    for (const tri of cluster) normal.add(tri.n);
  }
  if (normal.lengthSq() < 1e-12) return discPaperFrame(mesh);
  normal.normalize();

  mesh.updateWorldMatrix(true, false);
  if (parent) {
    parent.updateWorldMatrix(true, false);
    const target = new THREE.Box3().setFromObject(parent).getCenter(new THREE.Vector3());
    const worldC = clusterCentroid(cluster).applyMatrix4(mesh.matrixWorld);
    const toParent = target.sub(worldC).normalize();
    const worldN = normal.clone().transformDirection(mesh.matrixWorld);
    const facingParent = worldN.dot(toParent) > 0;
    if (towardParent !== facingParent) normal.negate();
  }

  const uvBasis = uvTangent(cluster);
  let tangent: THREE.Vector3;
  let bitangent: THREE.Vector3;
  if (uvBasis) {
    tangent = uvBasis.tangent;
    bitangent = uvBasis.bitangent;
    if (new THREE.Vector3().crossVectors(tangent, bitangent).dot(normal) < 0) {
      bitangent.negate();
    }
  } else {
    const framed = frameTangents(mesh, normal);
    tangent = framed.tangent;
    bitangent = framed.bitangent;
  }

  const verts = cluster.flatMap((tri) => tri.verts);
  const extents = projectVertExtents(verts, normal, tangent, bitangent);
  const lift = 0.00018;
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

export function applyBookletVectorAlbum(
  front: THREE.Mesh | null,
  back: THREE.Mesh | null,
  disc: THREE.Mesh | null,
  album: DummyAlbum,
  font: Font,
) {
  if (front) {
    detachVectorPrint(front);
    attachPrint(
      front,
      1000,
      1000,
      (art) => {
        addCoverPrint(art, album);
        addLabel(art, font, album.title, 70, 780, 64, album.ink, "left", 860);
        addLabel(art, font, `${album.sub}  |  ${album.year}`, 70, 850, 32, album.ink, "left", 860);
        addLabel(art, font, "DESKTOP OF SAMUEL", 70, 910, 20, album.ink, "left", 860);
      },
      "front",
      coverPaperFrame(front, true),
      0.985,
    );
  }
  if (back) {
    detachVectorPrint(back);
    attachPrint(
      back,
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
      coverPaperFrame(back, false),
      0.985,
    );
  }
  if (disc) {
    detachVectorPrint(disc);
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
    );
  }
}
