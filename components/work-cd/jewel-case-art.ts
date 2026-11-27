import * as THREE from "three";
import type { Font } from "three/addons/loaders/FontLoader.js";
import type { DummyAlbum } from "@/lib/work-cd/albums";
import type { PrintDemoId } from "@/lib/work-cd/print-demo";
import { applyBookletVectorAlbum } from "./jewel-case-booklet";
import { applyPlanarCanvasAlbum } from "./jewel-case-canvas";
import {
  applyPlanarVectorAlbum,
  clearPrintedMaps,
  detachVectorPrint,
  ensureArtFont,
  type VectorHosts,
} from "./jewel-case-vector";

export { ensureArtFont };

export const JEWEL_CASE_GLB_URL = "/dev/work-cd/jewel-case-2k.glb";

export type DiscIsland = {
  cx: number;
  cy: number;
  r: number;
  hole: number;
};

export type MappedMaterial = THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial;

export type CaseArt = {
  front: MappedMaterial | null;
  back: MappedMaterial | null;
  disc: MappedMaterial | null;
  frontMesh: THREE.Mesh | null;
  backMesh: THREE.Mesh | null;
  discMesh: THREE.Mesh | null;
  lidMesh: THREE.Mesh | null;
  trayMesh: THREE.Mesh | null;
  glassMesh: THREE.Mesh | null;
  discMeshes: THREE.Mesh[];
  frontSource: THREE.Texture | null;
  backSource: THREE.Texture | null;
  discSource: THREE.Texture | null;
  discIsland: DiscIsland | null;
};

export function isMesh(obj: THREE.Object3D): obj is THREE.Mesh {
  return (obj as THREE.Mesh).isMesh === true;
}

export function asMappedMaterial(
  mat: THREE.Material | THREE.Material[],
): MappedMaterial | null {
  const single = Array.isArray(mat) ? mat[0] : mat;
  if (!single) return null;
  if (single instanceof THREE.MeshStandardMaterial) return single;
  if (single instanceof THREE.MeshPhysicalMaterial) return single;
  return null;
}

export function emptyArt(): CaseArt {
  return {
    front: null,
    back: null,
    disc: null,
    frontMesh: null,
    backMesh: null,
    discMesh: null,
    lidMesh: null,
    trayMesh: null,
    glassMesh: null,
    discMeshes: [],
    frontSource: null,
    backSource: null,
    discSource: null,
    discIsland: null,
  };
}

export function disposeIfCanvas(tex: THREE.Texture | null | undefined) {
  if (tex && (tex as THREE.CanvasTexture).isCanvasTexture) tex.dispose();
}

export type GlassTune = {
  blur: number;
  roughness: number;
  thickness: number;
  ior: number;
};

export const DEFAULT_GLASS_TUNE: GlassTune = {
  blur: 0,
  roughness: 0,
  thickness: 0,
  ior: 1.02,
};

function isGlassMaterial(
  mat: MappedMaterial | null,
  obj: THREE.Object3D,
) {
  if (mat?.name === "glass") return true;
  if (obj.name.toLowerCase().includes("glass")) return true;
  return false;
}

function asJewelGlass(mat: MappedMaterial, tune: GlassTune = DEFAULT_GLASS_TUNE) {
  const phys =
    mat instanceof THREE.MeshPhysicalMaterial
      ? mat
      : new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          roughness: 0.04,
          metalness: 0,
        });
  phys.name = "glass";
  phys.color.set(0xffffff);
  // Transmission only runs in the opaque pass. transparent + depthWrite false
  // turns the lid into alpha-over and kills the plastic highlight.
  phys.transparent = false;
  phys.opacity = 1;
  phys.depthWrite = true;
  phys.transmission = 1;
  phys.thickness = tune.thickness;
  phys.ior = tune.ior;
  phys.roughness = tune.roughness;
  phys.metalness = 0;
  phys.clearcoat = 1;
  phys.clearcoatRoughness = 0.08;
  phys.envMapIntensity = 1.35;
  phys.specularIntensity = 1;
  phys.side = THREE.DoubleSide;
  phys.userData.transmissionBlur = { value: tune.blur };
  phys.onBeforeCompile = function patchTransmissionBlur(shader) {
    const blur = this.userData.transmissionBlur ?? { value: 1 };
    this.userData.transmissionBlur = blur;
    shader.uniforms.uTransmissionBlur = blur;
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "uniform sampler2D transmissionSamplerMap;",
        "uniform sampler2D transmissionSamplerMap;\n\tuniform float uTransmissionBlur;",
      )
      .replace(
        "float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );",
        "float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior ) * uTransmissionBlur;",
      );
  };
  phys.customProgramCacheKey = () => "jewel-glass-lod";
  phys.needsUpdate = true;
  return phys;
}

export function applyGlassTune(root: THREE.Object3D, tune: GlassTune) {
  root.traverse((obj) => {
    if (!isMesh(obj)) return;
    const mat = asMappedMaterial(obj.material);
    if (!mat || !isGlassMaterial(mat, obj)) return;
    if (!(mat instanceof THREE.MeshPhysicalMaterial)) return;
    mat.roughness = tune.roughness;
    mat.thickness = tune.thickness;
    mat.ior = tune.ior;
    if (mat.userData.transmissionBlur) mat.userData.transmissionBlur.value = tune.blur;
    mat.needsUpdate = true;
  });
}

function sharpenGltfMaps(
  mat: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial,
  anisotropy: number,
) {
  const maps = [mat.map, mat.normalMap, mat.roughnessMap, mat.metalnessMap, mat.aoMap];
  for (const tex of maps) {
    if (!tex) continue;
    tex.anisotropy = anisotropy;
    tex.needsUpdate = true;
  }
}

function meshRadius(mesh: THREE.Mesh) {
  if (!mesh.geometry.boundingSphere) mesh.geometry.computeBoundingSphere();
  return mesh.geometry.boundingSphere?.radius ?? 0;
}

export function collectArt(root: THREE.Object3D, into: CaseArt = emptyArt()): CaseArt {
  root.traverse((obj) => {
    if (!isMesh(obj)) return;
    const mat = asMappedMaterial(obj.material);
    if (obj.name === "Top") into.lidMesh = obj;
    if (obj.name === "Back") into.trayMesh = obj;
    if (isGlassMaterial(mat, obj)) into.glassMesh = obj;
    if (mat?.name === "Front") {
      if (!into.frontMesh || meshRadius(obj) > meshRadius(into.frontMesh)) {
        into.front = mat;
        into.frontMesh = obj;
        into.frontSource = mat.map;
      }
    }
    if (mat?.name === "Back") {
      if (!into.backMesh || meshRadius(obj) > meshRadius(into.backMesh)) {
        into.back = mat;
        into.backMesh = obj;
        into.backSource = mat.map;
      }
    }
    if (/CD_low/i.test(obj.name) && mat) {
      if (!into.discMeshes.includes(obj)) into.discMeshes.push(obj);
      if (!into.discMesh || meshRadius(obj) > meshRadius(into.discMesh)) {
        into.disc = mat;
        into.discMesh = obj;
        into.discSource = mat.map;
      }
    }
  });
  return into;
}

function paperize(
  mat: MappedMaterial | null,
  source: THREE.Texture | null,
  color: string,
) {
  clearPrintedMaps(mat, source);
  if (!mat) return;
  mat.color.set(color);
  mat.roughness = 0.88;
  mat.metalness = 0;
  mat.side = THREE.DoubleSide;
  mat.needsUpdate = true;
}

function hostsFrom(art: CaseArt): VectorHosts {
  return {
    lid: art.lidMesh,
    tray: art.trayMesh,
    glass: art.glassMesh,
    discs: art.discMeshes.length ? art.discMeshes : art.discMesh ? [art.discMesh] : [],
  };
}

export async function applyAlbum(
  art: CaseArt,
  album: DummyAlbum,
  font: Font,
  mode: PrintDemoId = "d",
  anisotropy = 16,
) {
  const booklet = mode === "c";
  if (art.frontMesh) art.frontMesh.visible = booklet;
  if (art.backMesh) art.backMesh.visible = booklet;

  paperize(art.disc, art.discSource, "#2a2a2c");
  if (art.disc instanceof THREE.MeshPhysicalMaterial) {
    art.disc.transmission = 0;
    art.disc.opacity = 1;
    art.disc.transparent = false;
    art.disc.needsUpdate = true;
  }

  if (mode === "c") {
    paperize(art.front, art.frontSource, album.a);
    paperize(art.back, art.backSource, album.a);
    applyBookletVectorAlbum(art.frontMesh, art.backMesh, art.discMesh, album, font);
    return;
  }

  if (mode === "d") {
    await applyPlanarCanvasAlbum(hostsFrom(art), album, anisotropy);
    return;
  }

  applyPlanarVectorAlbum(hostsFrom(art), album, font);
}

export function disposeVectorPrints(art: CaseArt) {
  detachVectorPrint(art.frontMesh);
  detachVectorPrint(art.backMesh);
  detachVectorPrint(art.lidMesh);
  detachVectorPrint(art.glassMesh);
  detachVectorPrint(art.trayMesh);
  detachVectorPrint(art.discMesh);
  for (const disc of art.discMeshes) detachVectorPrint(disc);
}

export function prepareCaseMeshes(root: THREE.Object3D, shadows: boolean, anisotropy = 16) {
  root.traverse((obj) => {
    if (isMesh(obj)) {
      obj.castShadow = shadows;
      obj.receiveShadow = shadows;
      const mat = asMappedMaterial(obj.material);
      if (mat) sharpenGltfMaps(mat, anisotropy);
      if (mat && (mat.name === "Front" || mat.name === "Back")) {
        mat.roughness = 0.88;
        mat.metalness = 0;
      }
      if (mat?.name === "Disks") {
        mat.envMapIntensity = 1.6;
        if (mat instanceof THREE.MeshPhysicalMaterial) {
          mat.clearcoat = 1;
          mat.clearcoatRoughness = Math.min(mat.clearcoatRoughness || 0.12, 0.12);
        }
      }
      if (/CD_low/i.test(obj.name) && mat) {
        mat.roughness = Math.min(mat.roughness, 0.16);
      }
      if (mat && isGlassMaterial(mat, obj)) {
        obj.material = asJewelGlass(mat);
        obj.renderOrder = 0;
      } else if (mat instanceof THREE.MeshPhysicalMaterial && mat.transmission > 0) {
        mat.thickness = 0.004;
        mat.ior = 1.49;
        mat.roughness = Math.min(mat.roughness, 0.035);
        mat.envMapIntensity = 1.2;
      }
    }
    if (obj.position && obj.position.y > 1) obj.visible = false;
  });
}

export function cloneCaseWithMaterials(source: THREE.Object3D): THREE.Object3D {
  const clone = source.clone(true);
  clone.traverse((obj) => {
    if (!isMesh(obj)) return;
    if (Array.isArray(obj.material)) {
      obj.material = obj.material.map((mat) => mat.clone());
    } else {
      obj.material = obj.material.clone();
    }
  });
  return clone;
}

export function poseCaseLid(
  root: THREE.Object3D,
  clip: THREE.AnimationClip | undefined,
  t: number,
) {
  if (!clip) return null;
  const mixer = new THREE.AnimationMixer(root);
  const action = mixer.clipAction(clip);
  action.play();
  action.paused = true;
  action.time = t * clip.duration;
  mixer.update(0);
  return { mixer, action, clip };
}

export function sitOnGround(root: THREE.Object3D) {
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  root.position.x -= center.x;
  root.position.y -= box.min.y;
  root.position.z -= center.z;
  return size;
}

export function centerAtOrigin(root: THREE.Object3D) {
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  root.position.sub(center);
  return size;
}
