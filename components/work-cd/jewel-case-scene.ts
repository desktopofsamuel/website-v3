import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import type { DummyAlbum } from "@/lib/work-cd/albums";
import type { PrintDemoId } from "@/lib/work-cd/print-demo";
import {
  applyAlbum,
  applyGlassTune,
  collectArt,
  DEFAULT_GLASS_TUNE,
  disposeIfCanvas,
  disposeVectorPrints,
  emptyArt,
  ensureArtFont,
  isMesh,
  JEWEL_CASE_GLB_URL,
  prepareCaseMeshes,
  type CaseArt,
  type GlassTune,
} from "./jewel-case-art";

const DRACO_DECODER_URL =
  "https://www.gstatic.com/draco/versioned/decoders/1.5.7/";

const DISC_SPIN_AXIS = new THREE.Vector3(0, 1, 0);
const DISC_SPIN_STEP = -0.04;

export type JewelCaseHandle = {
  setAlbum: (album: DummyAlbum) => void;
  setOpen: (t: number) => void;
  setSpinning: (value: boolean) => void;
  setGlassTune: (tune: GlassTune) => void;
  dispose: () => void;
};

export type MountJewelCaseOptions = {
  album: DummyAlbum;
  open: number;
  spinning: boolean;
  onStatus: (status: string) => void;
  printMode?: PrintDemoId;
};

export function mountJewelCase(
  canvas: HTMLCanvasElement,
  options: MountJewelCaseOptions,
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
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xefece6);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 1.1;

  const camera = new THREE.PerspectiveCamera(
    28,
    Math.max(canvas.clientWidth, 1) / Math.max(canvas.clientHeight, 1),
    0.01,
    20,
  );
  camera.position.set(0.22, 0.16, 0.28);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.target.set(0, 0.07, 0.03);
  controls.minDistance = 0.12;
  controls.maxDistance = 1.2;
  controls.maxPolarAngle = Math.PI * 0.49;

  const key = new THREE.DirectionalLight(0xfff6ea, 2.4);
  key.position.set(0.4, 0.7, 0.35);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 0.05;
  key.shadow.camera.far = 2;
  key.shadow.camera.left = -0.3;
  key.shadow.camera.right = 0.3;
  key.shadow.camera.top = 0.3;
  key.shadow.camera.bottom = -0.3;
  scene.add(key);
  scene.add(new THREE.AmbientLight(0xffffff, 0.28));
  const rim = new THREE.DirectionalLight(0xcde4ff, 0.7);
  rim.position.set(-0.4, 0.2, -0.3);
  scene.add(rim);

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(0.8, 64),
    new THREE.MeshStandardMaterial({ color: 0xe7e2d8, roughness: 0.92 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  let mixer: THREE.AnimationMixer | null = null;
  let clip: THREE.AnimationClip | null = null;
  let action: THREE.AnimationAction | null = null;
  let spinning = options.spinning;
  let pendingAlbum = options.album;
  let pendingOpen = options.open;
  let glassTune = DEFAULT_GLASS_TUNE;
  let loaded = false;
  let disposed = false;
  let raf = 0;
  const discs: THREE.Mesh[] = [];
  const art: CaseArt = emptyArt();
  const printMode: PrintDemoId = options.printMode === "b" ? "d" : (options.printMode ?? "d");
  let anisotropy = 16;

  function paint(album: DummyAlbum) {
    pendingAlbum = album;
    if (!loaded) return;
    void ensureArtFont().then((font) => {
      if (disposed) return;
      void applyAlbum(art, album, font, printMode, anisotropy);
    });
  }

  function setOpen(t: number) {
    pendingOpen = t;
    if (!action || !clip || !mixer) return;
    action.time = t * clip.duration;
    mixer.update(0);
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

  const draco = new DRACOLoader();
  draco.setDecoderPath(DRACO_DECODER_URL);
  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);

  loader.load(
    JEWEL_CASE_GLB_URL,
    (gltf) => {
      if (disposed) return;
      const root = gltf.scene;
      anisotropy = renderer.capabilities.getMaxAnisotropy();
      prepareCaseMeshes(root, true, anisotropy);
      collectArt(root, art);
      root.traverse((obj) => {
        if (/CD_low/i.test(obj.name) && isMesh(obj)) discs.push(obj);
      });
      scene.add(root);
      applyGlassTune(scene, glassTune);
      loaded = true;
      void ensureArtFont().then((font) => {
        if (disposed) return;
        void applyAlbum(art, pendingAlbum, font, printMode, anisotropy);
      });

      const box = new THREE.Box3().setFromObject(root);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      ground.position.y = box.min.y - 0.001;
      controls.target.copy(center);
      const dist = Math.max(size.x, size.y, size.z) * 2.2;
      camera.position.set(
        center.x + dist * 0.7,
        center.y + dist * 0.45,
        center.z + dist * 0.9,
      );
      camera.near = Math.max(dist / 16, 0.02);
      camera.far = Math.max(dist * 20, 8);
      camera.updateProjectionMatrix();
      controls.update();

      if (gltf.animations.length) {
        mixer = new THREE.AnimationMixer(root);
        clip = gltf.animations[0];
        action = mixer.clipAction(clip);
        action.play();
        action.paused = true;
        setOpen(pendingOpen);
      }
      options.onStatus(
        "Dummy Water For Free art on the photoreal case. Scrub Open. Switch albums.",
      );
    },
    undefined,
    (err) => {
      options.onStatus("Could not load the GLB.");
      console.error(err);
    },
  );

  function tick() {
    if (disposed) return;
    if (spinning) {
      for (const d of discs) d.rotateOnWorldAxis(DISC_SPIN_AXIS, DISC_SPIN_STEP);
    }
    controls.update();
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  }
  tick();
  resize();

  return {
    setAlbum: paint,
    setOpen,
    setSpinning: (value) => {
      spinning = value;
    },
    setGlassTune: (tune) => {
      glassTune = tune;
      applyGlassTune(scene, tune);
    },
    dispose: () => {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      controls.dispose();
      draco.dispose();
      pmrem.dispose();
      disposeVectorPrints(art);
      disposeIfCanvas(art.front?.map === art.frontSource ? null : art.front?.map);
      disposeIfCanvas(art.back?.map === art.backSource ? null : art.back?.map);
      disposeIfCanvas(art.disc?.map === art.discSource ? null : art.disc?.map);
      scene.traverse((obj) => {
        if (!isMesh(obj)) return;
        obj.geometry.dispose();
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        for (const mat of mats) mat.dispose();
      });
      renderer.dispose();
    },
  };
}
