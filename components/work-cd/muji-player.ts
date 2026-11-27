import * as THREE from "three";
import { isMesh } from "./jewel-case-art";
import {
  makeGrilleCavity,
  makeGrillePlate,
  makeHoleRims,
  type GrillePose,
} from "./muji-grille";

export const MUJI_PLAYER_GLB_URL = "/dev/work-cd/muji-cd-player.glb";

const MM_TO_M = 0.001;

export type MujiPlayer = {
  root: THREE.Group;
  model: THREE.Group;
  spindle: THREE.Group;
  bodyD: number;
};

function meshSize(mesh: THREE.Object3D) {
  mesh.updateWorldMatrix(true, false);
  const box = new THREE.Box3().setFromObject(mesh);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  return { box, size, center };
}

function isPhotoCard(size: THREE.Vector3) {
  const min = Math.min(size.x, size.y, size.z);
  const max = Math.max(size.x, size.y, size.z);
  return min < 0.15 && max > 180;
}

function isBakedDisc(name: string, size: THREE.Vector3) {
  if (name.includes("Union")) return true;
  const d = Math.max(size.x, size.y);
  const t = Math.min(size.x, size.y, size.z);
  return name.includes("4489") && d > 140 && d < 156 && t < 3;
}

function isWell(name: string, size: THREE.Vector3) {
  const dxy = Math.max(size.x, size.y);
  const t = Math.min(size.x, size.y, size.z);
  const round = Math.abs(size.x - size.y) / Math.max(dxy, 1) < 0.12;
  return name.includes("4489") && round && dxy > 158 && dxy < 176 && t > 1 && t < 8;
}

function isFrontSkin(size: THREE.Vector3) {
  const dxy = Math.max(size.x, size.y);
  const t = Math.min(size.x, size.y, size.z);
  return t > 0.4 && t < 2.6 && dxy > 180;
}

function aabbInModel(obj: THREE.Object3D, model: THREE.Object3D) {
  const world = new THREE.Box3().setFromObject(obj);
  const local = new THREE.Box3();
  const v = new THREE.Vector3();
  for (const x of [world.min.x, world.max.x]) {
    for (const y of [world.min.y, world.max.y]) {
      for (const z of [world.min.z, world.max.z]) {
        v.set(x, y, z);
        model.worldToLocal(v);
        local.expandByPoint(v);
      }
    }
  }
  return local;
}

function tunePlayerMaterial(mat: THREE.Material) {
  if (!(mat instanceof THREE.MeshStandardMaterial) && !(mat instanceof THREE.MeshPhysicalMaterial)) {
    return;
  }
  if (mat.map) {
    mat.map.dispose();
    mat.map = null;
  }
  const color = mat.color;
  if (color.r > 0.9 && color.g < 0.45 && color.b < 0.45) {
    color.setRGB(0.96, 0.96, 0.94);
    mat.roughness = 0.38;
    mat.metalness = 0.02;
    return;
  }
  const luma = color.r * 0.22 + color.g * 0.72 + color.b * 0.06;
  if (luma > 0.85) {
    mat.roughness = 0.32;
    mat.metalness = 0.04;
  } else if (luma < 0.25) {
    mat.roughness = 0.28;
    mat.metalness = 0.55;
  } else {
    mat.roughness = 0.45;
    mat.metalness = 0.12;
  }
}

export function mountMujiPlayer(scene: THREE.Scene, source: THREE.Object3D): MujiPlayer {
  const model = source.clone(true);
  model.name = "muji-cd-player";

  let well: THREE.Object3D | null = null;
  let wellRadius = 82;
  const bodyMeshes: THREE.Object3D[] = [];

  model.traverse((obj) => {
    if (!isMesh(obj)) return;
    const { size } = meshSize(obj);
    if (
      isPhotoCard(size) ||
      isBakedDisc(obj.name, size) ||
      obj.name.includes("群組") ||
      obj.name.includes("Group") ||
      obj.name.includes("Component_3282")
    ) {
      obj.visible = false;
      return;
    }
    if (isWell(obj.name, size)) {
      well = obj;
      wellRadius = Math.max(size.x, size.y) * 0.5;
    } else if (isFrontSkin(size)) {
      obj.visible = false;
    }
    if (!obj.name.includes("群組") && !obj.name.includes("Group")) {
      bodyMeshes.push(obj);
    }
    const raw = Array.isArray(obj.material) ? obj.material : [obj.material];
    const cloned = raw.map((mat) => mat.clone());
    obj.material = cloned.length === 1 ? cloned[0] : cloned;
    for (const mat of cloned) tunePlayerMaterial(mat);
  });

  const bodyBox = new THREE.Box3();
  if (bodyMeshes.length > 0) {
    for (const mesh of bodyMeshes) bodyBox.expandByObject(mesh);
  } else {
    bodyBox.setFromObject(model);
  }
  const bodyCenter = bodyBox.getCenter(new THREE.Vector3());
  const bodySize = bodyBox.getSize(new THREE.Vector3());
  model.position.sub(bodyCenter);
  model.updateMatrixWorld(true);

  const inner = new THREE.Group();
  inner.add(model);
  inner.scale.setScalar(MM_TO_M);

  const root = new THREE.Group();
  root.name = "muji-player-root";
  root.add(inner);
  root.updateMatrixWorld(true);

  const spindle = new THREE.Group();
  spindle.name = "muji-spindle";
  if (well) {
    const wellBox = new THREE.Box3().setFromObject(well);
    const wellCenter = wellBox.getCenter(new THREE.Vector3());
    root.worldToLocal(wellCenter);
    spindle.position.copy(wellCenter);
    spindle.position.z += 0.003;
  } else {
    spindle.position.set(0, 0, bodySize.z * MM_TO_M * 0.52);
  }
  root.add(spindle);
  root.visible = false;
  scene.add(root);
  root.updateMatrixWorld(true);

  const shellBox = new THREE.Box3();
  for (const mesh of bodyMeshes) {
    if (!mesh.visible) continue;
    const box = aabbInModel(mesh, model);
    if (!box.isEmpty()) shellBox.union(box);
  }
  if (shellBox.isEmpty()) shellBox.copy(aabbInModel(model, model));
  const wellBox = well ? aabbInModel(well, model) : shellBox;
  const wellLocal = wellBox.getCenter(new THREE.Vector3());
  wellRadius = Math.max(wellBox.max.x - wellBox.min.x, wellBox.max.y - wellBox.min.y) * 0.5;
  const pose: GrillePose = {
    center: new THREE.Vector2(
      (shellBox.min.x + shellBox.max.x) * 0.5,
      (shellBox.min.y + shellBox.max.y) * 0.5,
    ),
    frontZ: shellBox.max.z,
    halfX: (shellBox.max.x - shellBox.min.x) * 0.5 - 1.6,
    halfY: (shellBox.max.y - shellBox.min.y) * 0.5 - 1.6,
    well: new THREE.Vector2(wellLocal.x, wellLocal.y),
    wellRadius,
  };
  makeGrillePlate(model, pose);
  const rims = makeHoleRims(pose);
  if (rims) model.add(rims);
  model.add(makeGrilleCavity(pose));

  return {
    root,
    model: inner,
    spindle,
    bodyD: Math.max(bodySize.x, bodySize.y) * MM_TO_M,
  };
}
