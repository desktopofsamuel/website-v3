import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import type { DummyAlbum } from "@/lib/work-cd/albums";
import {
  albumCoverTexture,
  canvasTexture,
  isSharedCoverTexture,
  paintBackCanvas,
  paintDiscCanvas,
  readyFonts,
} from "./jewel-case-canvas";
import { discRingGeometry } from "./jewel-case-vector";
import type { JewelCaseHandle } from "./jewel-case-scene";

const COVER_W = 0.125;
const COVER_H = 0.14;

export function mountCoverPlanes(
  canvas: HTMLCanvasElement,
  options: {
    album: DummyAlbum;
    open: number;
    spinning: boolean;
    onStatus: (status: string) => void;
  },
): JewelCaseHandle {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xefece6);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 1;

  const camera = new THREE.PerspectiveCamera(
    28,
    Math.max(canvas.clientWidth, 1) / Math.max(canvas.clientHeight, 1),
    0.04,
    12,
  );
  camera.position.set(0.18, 0.08, 0.32);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.target.set(0, 0.02, 0);
  controls.minDistance = 0.12;
  controls.maxDistance = 1.2;

  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const key = new THREE.DirectionalLight(0xfff6ea, 2.1);
  key.position.set(0.35, 0.6, 0.4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xcde4ff, 0.55);
  rim.position.set(-0.4, 0.2, -0.3);
  scene.add(rim);

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(0.8, 64),
    new THREE.MeshStandardMaterial({ color: 0xe7e2d8, roughness: 0.92 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -COVER_H / 2 - 0.002;
  scene.add(ground);

  const sleeve = new THREE.Group();
  scene.add(sleeve);

  const anisotropy = renderer.capabilities.getMaxAnisotropy();
  const coverMat = new THREE.MeshStandardMaterial({
    roughness: 0.88,
    metalness: 0,
    side: THREE.FrontSide,
  });
  const backMat = new THREE.MeshStandardMaterial({
    roughness: 0.88,
    metalness: 0,
    side: THREE.FrontSide,
  });
  const discMat = new THREE.MeshStandardMaterial({
    roughness: 0.88,
    metalness: 0,
    transparent: true,
    alphaTest: 0.08,
    side: THREE.DoubleSide,
  });

  const hinge = new THREE.Group();
  hinge.position.set(0, 0, -COVER_W / 2);
  const front = new THREE.Mesh(new THREE.PlaneGeometry(COVER_W, COVER_H), coverMat);
  front.position.set(0, 0, COVER_W / 2);
  hinge.add(front);

  const back = new THREE.Mesh(new THREE.PlaneGeometry(COVER_W, COVER_H), backMat);
  back.rotation.y = Math.PI;

  const disc = new THREE.Mesh(discRingGeometry(COVER_W * 0.84), discMat);
  disc.position.z = -0.004;

  sleeve.add(back);
  sleeve.add(disc);
  sleeve.add(hinge);
  sleeve.position.y = 0.0;

  let spinning = options.spinning;
  let disposed = false;
  let raf = 0;
  let paintToken = 0;

  function setOpen(t: number) {
    hinge.rotation.y = -t * Math.PI * 0.82;
  }

  async function paint(album: DummyAlbum) {
    const token = ++paintToken;
    await readyFonts();
    if (disposed || token !== paintToken) return;
    const coverTex = await albumCoverTexture(album, anisotropy);
    const backTex = canvasTexture(paintBackCanvas(album), anisotropy);
    const discTex = canvasTexture(paintDiscCanvas(album), anisotropy);
    if (disposed || token !== paintToken) {
      if (!isSharedCoverTexture(coverTex)) coverTex.dispose();
      backTex.dispose();
      discTex.dispose();
      return;
    }
    if (coverMat.map && !isSharedCoverTexture(coverMat.map)) coverMat.map.dispose();
    backMat.map?.dispose();
    discMat.map?.dispose();
    coverMat.map = coverTex;
    backMat.map = backTex;
    discMat.map = discTex;
    coverMat.needsUpdate = true;
    backMat.needsUpdate = true;
    discMat.needsUpdate = true;
    options.onStatus("Bloop-style 2048 planes. Zoom in on the type, then orbit.");
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

  void paint(options.album);
  setOpen(options.open);

  function tick() {
    if (disposed) return;
    if (spinning) disc.rotation.z -= 0.04;
    controls.update();
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  }
  tick();
  resize();

  return {
    setAlbum: (album) => {
      void paint(album);
    },
    setOpen,
    setSpinning: (value) => {
      spinning = value;
    },
    setGlassTune: () => {},
    dispose: () => {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      controls.dispose();
      pmrem.dispose();
      if (coverMat.map && !isSharedCoverTexture(coverMat.map)) coverMat.map.dispose();
      backMat.map?.dispose();
      discMat.map?.dispose();
      coverMat.dispose();
      backMat.dispose();
      discMat.dispose();
      front.geometry.dispose();
      back.geometry.dispose();
      disc.geometry.dispose();
      ground.geometry.dispose();
      (ground.material as THREE.Material).dispose();
      renderer.dispose();
    },
  };
}
