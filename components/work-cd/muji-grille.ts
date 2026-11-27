import * as THREE from "three";

const PITCH = 2.42;
const HOLE_R = 0.56;
const ROW_H = PITCH * 0.8660254037844386;
const RIM = 6.8;
const WELL_PAD = 0.85;
const CORNER = 34;
const THICKNESS = 2.2;
const TAU = Math.PI * 2;

function roundedBox(px: number, py: number, hx: number, hy: number, r: number) {
  const qx = Math.abs(px) - hx + r;
  const qy = Math.abs(py) - hy + r;
  const ox = Math.max(qx, 0);
  const oy = Math.max(qy, 0);
  return Math.min(Math.max(qx, qy), 0) + Math.hypot(ox, oy) - r;
}

export function hexHoleCenters(
  halfX: number,
  halfY: number,
  well: THREE.Vector2,
  wellRadius: number,
) {
  const hx = halfX - RIM;
  const hy = halfY - RIM;
  const wellR = wellRadius + WELL_PAD;
  const maxR = Math.hypot(hx, hy) + PITCH;
  const centers: number[] = [];
  const nRings = Math.ceil((maxR - wellR) / ROW_H) + 2;
  for (let ring = 0; ring <= nRings; ring++) {
    const r = wellR + ring * ROW_H;
    if (r > maxR) break;
    const n = Math.max(8, Math.round((TAU * r) / PITCH));
    const slot = TAU / n;
    const off = ring % 2 === 1 ? slot * 0.5 : 0;
    for (let i = 0; i < n; i++) {
      const a = i * slot + off;
      const x = well.x + r * Math.cos(a);
      const y = well.y + r * Math.sin(a);
      if (roundedBox(x, y, hx, hy, CORNER) > -HOLE_R) continue;
      centers.push(x, y);
    }
  }
  return centers;
}

function roundedRectShape(hx: number, hy: number, r: number) {
  const s = new THREE.Shape();
  const x0 = -hx;
  const y0 = -hy;
  const x1 = hx;
  const y1 = hy;
  const cr = Math.min(r, hx - 0.5, hy - 0.5);
  s.moveTo(x0 + cr, y0);
  s.lineTo(x1 - cr, y0);
  s.absarc(x1 - cr, y0 + cr, cr, -Math.PI / 2, 0, false);
  s.lineTo(x1, y1 - cr);
  s.absarc(x1 - cr, y1 - cr, cr, 0, Math.PI / 2, false);
  s.lineTo(x0 + cr, y1);
  s.absarc(x0 + cr, y1 - cr, cr, Math.PI / 2, Math.PI, false);
  s.lineTo(x0, y0 + cr);
  s.absarc(x0 + cr, y0 + cr, cr, Math.PI, Math.PI * 1.5, false);
  return s;
}

function circleHole(x: number, y: number, r: number) {
  const path = new THREE.Path();
  path.absarc(x, y, r, 0, Math.PI * 2, true);
  return path;
}

function holeUniforms(well: THREE.Vector2, wellRadius: number, halfX: number, halfY: number) {
  return {
    uWellCenter: { value: well.clone() },
    uWellRadius: { value: wellRadius + WELL_PAD },
    uHalfSize: { value: new THREE.Vector2(halfX, halfY) },
    uCorner: { value: CORNER },
    uRim: { value: RIM },
    uPitch: { value: PITCH },
    uHoleR: { value: HOLE_R },
  };
}

const HOLE_GLSL = /* glsl */ `
  vec2 p = vMujiPlatePos;
  vec2 b = abs(p) - (uHalfSize - vec2(uRim)) + uCorner;
  float plate = min(max(b.x, b.y), 0.0) + length(max(b, 0.0)) - uCorner;
  if (plate > 0.0) discard;
  vec2 d = p - uWellCenter;
  float rad = length(d);
  if (rad < uWellRadius) discard;
  float rowH = uPitch * 0.8660254037844386;
  float ring = floor((rad - uWellRadius) / rowH + 0.5);
  if (ring >= 0.0) {
    float ringR = uWellRadius + ring * rowH;
    float n = max(floor(6.28318530718 * ringR / uPitch + 0.5), 8.0);
    float slot = 6.28318530718 / n;
    float ang = atan(d.y, d.x);
    if (ang < 0.0) ang += 6.28318530718;
    float off = mod(ring, 2.0) > 0.5 ? slot * 0.5 : 0.0;
    float k = floor((ang - off) / slot + 0.5);
    k = mod(k + n, n);
    float a = k * slot + off;
    vec2 hole = uWellCenter + ringR * vec2(cos(a), sin(a));
    if (length(p - hole) < uHoleR) discard;
  }
`;

function patchPlateShader(
  shader: THREE.WebGLProgramParametersWithUniforms,
  uniforms: ReturnType<typeof holeUniforms>,
) {
  Object.assign(shader.uniforms, uniforms);
  shader.vertexShader = shader.vertexShader.replace(
    "#include <common>",
    /* glsl */ `varying vec2 vMujiPlatePos;
    #include <common>`,
  );
  shader.vertexShader = shader.vertexShader.replace(
    "#include <begin_vertex>",
    /* glsl */ `#include <begin_vertex>
    vMujiPlatePos = position.xy;`,
  );
  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <common>",
    /* glsl */ `varying vec2 vMujiPlatePos;
    uniform vec2 uWellCenter;
    uniform float uWellRadius;
    uniform vec2 uHalfSize;
    uniform float uCorner;
    uniform float uRim;
    uniform float uPitch;
    uniform float uHoleR;
    #include <common>`,
  );
  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <clipping_planes_fragment>",
    /* glsl */ `#include <clipping_planes_fragment>
    ${HOLE_GLSL}`,
  );
}

export type GrillePose = {
  center: THREE.Vector2;
  frontZ: number;
  halfX: number;
  halfY: number;
  well: THREE.Vector2;
  wellRadius: number;
};

export function makeGrillePlate(model: THREE.Object3D, pose: GrillePose) {
  const wellLocal = pose.well.clone().sub(pose.center);
  const geo = new THREE.PlaneGeometry(pose.halfX * 2, pose.halfY * 2);
  const mat = new THREE.MeshStandardMaterial({
    color: 0xeceae6,
    roughness: 0.34,
    metalness: 0.03,
    side: THREE.DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });
  const uniforms = holeUniforms(wellLocal, pose.wellRadius, pose.halfX, pose.halfY);
  mat.onBeforeCompile = (shader) => {
    patchPlateShader(shader, uniforms);
  };
  mat.customProgramCacheKey = () => "muji-perforation-plate-v6";
  mat.needsUpdate = true;
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = "muji-grille-plate";
  mesh.position.set(pose.center.x, pose.center.y, pose.frontZ + 1.15);
  model.add(mesh);
  return mesh;
}

export function makeHoleRims(pose: GrillePose) {
  const wellLocal = pose.well.clone().sub(pose.center);
  const centers = hexHoleCenters(pose.halfX, pose.halfY, wellLocal, pose.wellRadius);
  if (centers.length === 0) return null;
  const geo = new THREE.CylinderGeometry(HOLE_R, HOLE_R, THICKNESS, 7, 1, true);
  geo.rotateX(Math.PI / 2);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x5a5854,
    roughness: 0.55,
    metalness: 0.04,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.InstancedMesh(geo, mat, centers.length / 2);
  mesh.name = "muji-hole-rims";
  mesh.frustumCulled = false;
  const dummy = new THREE.Object3D();
  for (let i = 0, n = 0; i < centers.length; i += 2, n += 1) {
    dummy.position.set(
      pose.center.x + centers[i],
      pose.center.y + centers[i + 1],
      pose.frontZ + 0.35,
    );
    dummy.updateMatrix();
    mesh.setMatrixAt(n, dummy.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;
  return mesh;
}

export function makeGrilleCavity(pose: GrillePose) {
  const wellLocal = pose.well.clone().sub(pose.center);
  const shape = roundedRectShape(pose.halfX - 1.2, pose.halfY - 1.2, CORNER);
  shape.holes.push(circleHole(wellLocal.x, wellLocal.y, pose.wellRadius + 1.1));
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.7,
    bevelEnabled: false,
    curveSegments: 20,
    steps: 1,
  });
  const mat = new THREE.MeshStandardMaterial({
    color: 0x3a3834,
    roughness: 0.9,
    metalness: 0,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = "muji-grille-cavity";
  mesh.position.set(pose.center.x, pose.center.y, pose.frontZ + 0.2);
  return mesh;
}
