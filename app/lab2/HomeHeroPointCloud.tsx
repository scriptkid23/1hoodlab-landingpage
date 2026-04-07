"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const CONFIG = {
  camera: { fov: 60, near: 0.1, far: 1000, position: new THREE.Vector3(0, 0, 50) },
  clearColor: 0x111111,
  fog: { color: 0x111111, near: 0, far: 15 },
  tube: {
    radius: 1.5,
    tubularSegments: 60,
    radialSegments: 60,
    arcLength: 22,
    arcHeight: 0,
    positionDesktop: new THREE.Vector3(4.9, -1.6, 36),
    rotationDegDesktop: new THREE.Vector3(0, -117, 11),
    positionMobile: new THREE.Vector3(4.9, -1.6, 34),
    rotationDegMobile: new THREE.Vector3(0, -117, 11),
  },
  points: { color: 0xd1d1d1, size: 0.2, sizeAttenuation: 170 },
  wave: {
    li: 0.01,
    ji: 0.015,
    ni: 0.02,
    timeStep: 0.01,
    introStartIntensity: 30,
    introDelaySec: 2,
    introDurationSec: 2,
    targetIntensityDesktop: 0.02,
    targetIntensityTouch: 0,
    spatialBlendDurationSec: 1.5,
  },
  mouse: { radiusPx: 125, forceXY: 1.5, forceZFactor: 0.5, smoothAlpha: 0.1 },
  mobileBreakpoint: 768,
} as const;

const vertexShader = `
uniform float size;
uniform float sizeAttenuation;
#include <fog_pars_vertex>
void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size * (sizeAttenuation / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`;

const fragmentShader = `
uniform vec3 color;
#include <fog_pars_fragment>
void main() {
  vec2 center = gl_PointCoord - vec2(0.5);
  if (dot(center, center) > 0.25) discard;
  gl_FragColor = vec4(color, 1.0);
  #include <fog_fragment>
}
`;

type TubePointsApi = {
  updateTransform: () => void;
  getGeometry: () => THREE.TubeGeometry | null;
  getOriginalPositions: () => Float32Array | null;
  getMatrixWorld: () => THREE.Matrix4 | null;
  destroy: () => void;
};

function degToRad(value: number): number {
  return (value * Math.PI) / 180;
}

function xi(time: number, value: number, freq: number, useCos: boolean): number {
  const trig = useCos ? Math.cos : Math.sin;
  return 0.5 * Math.sin(trig(time + value * freq) * Math.PI);
}

function gi(time: number, a: number, b: number, c: number): THREE.Vector3Like {
  return {
    x: xi(time, a, CONFIG.wave.li, false),
    y: xi(time, b, CONFIG.wave.ji, true),
    z: xi(time, c, CONFIG.wave.ni, false),
  };
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function createTubePoints(scene: THREE.Scene): TubePointsApi {
  let points: THREE.Points<THREE.TubeGeometry, THREE.ShaderMaterial> | null = null;
  let originalPositions: Float32Array | null = null;

  const pickTransform = () => {
    const isMobile = window.innerWidth < CONFIG.mobileBreakpoint;
    return {
      position: isMobile ? CONFIG.tube.positionMobile : CONFIG.tube.positionDesktop,
      rotation: isMobile ? CONFIG.tube.rotationDegMobile : CONFIG.tube.rotationDegDesktop,
    };
  };

  const applyTransform = () => {
    if (!points) return;
    const { position, rotation } = pickTransform();
    points.position.copy(position);
    points.rotation.set(degToRad(rotation.x), degToRad(rotation.y), degToRad(rotation.z));
  };

  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-CONFIG.tube.arcLength / 2, 0, 0),
    new THREE.Vector3(0, CONFIG.tube.arcHeight, 0),
    new THREE.Vector3(CONFIG.tube.arcLength / 2, 0, 0)
  );

  const geometry = new THREE.TubeGeometry(
    curve,
    CONFIG.tube.tubularSegments,
    CONFIG.tube.radius,
    CONFIG.tube.radialSegments,
    false
  );
  geometry.attributes.position.setUsage(THREE.DynamicDrawUsage);

  const material = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib.fog,
      {
        color: { value: new THREE.Color(CONFIG.points.color) },
        size: { value: CONFIG.points.size },
        sizeAttenuation: { value: CONFIG.points.sizeAttenuation },
      },
    ]),
    vertexShader,
    fragmentShader,
    fog: true,
    transparent: false,
  });

  points = new THREE.Points(geometry, material);
  applyTransform();
  scene.add(points);
  originalPositions = new Float32Array(points.geometry.attributes.position.array);

  return {
    updateTransform: applyTransform,
    getGeometry: () => points?.geometry ?? null,
    getOriginalPositions: () => originalPositions,
    getMatrixWorld: () => {
      if (!points) return null;
      points.updateWorldMatrix(true, false);
      return points.matrixWorld;
    },
    destroy: () => {
      if (!points) return;
      points.geometry.dispose();
      points.material.dispose();
      scene.remove(points);
      points = null;
      originalPositions = null;
    },
  };
}

type AnimatorApi = {
  startIntroAnimation: () => void;
  skipToEnd: () => void;
  updateWavePositions: (time: number) => void;
  handleMouseMove: (event: MouseEvent) => void;
  isIntroComplete: () => boolean;
  destroy: () => void;
};

function createAnimator(params: {
  tubePoints: TubePointsApi;
  camera: THREE.PerspectiveCamera;
  canvas: HTMLCanvasElement;
  isTouchDevice: boolean;
  prefersReducedMotion: boolean;
}): AnimatorApi {
  const { tubePoints, camera, canvas, isTouchDevice, prefersReducedMotion } = params;
  const original = tubePoints.getOriginalPositions();

  let mouse = { x: 0, y: 0 };
  let worldPos: THREE.Vector3 | null = null;
  let ndcPos: THREE.Vector3 | null = null;
  let mouseTarget: Float32Array | null = null;
  let mouseSmoothed: Float32Array | null = null;

  if (!isTouchDevice && original) {
    worldPos = new THREE.Vector3();
    ndcPos = new THREE.Vector3();
    mouseTarget = new Float32Array(original.length);
    mouseSmoothed = new Float32Array(original.length);
  }

  let waveIntensity = CONFIG.wave.introStartIntensity;
  let spatialBlend = 0;
  let introComplete = false;
  let introStartMs: number | null = null;
  let spatialStartMs: number | null = null;

  const updateTweens = () => {
    if (introComplete) {
      if (!isTouchDevice && !prefersReducedMotion && spatialBlend < 1 && spatialStartMs !== null) {
        const t = Math.min(1, (performance.now() - spatialStartMs) / 1000 / CONFIG.wave.spatialBlendDurationSec);
        spatialBlend = easeInOutQuad(t);
      }
      return;
    }
    if (introStartMs === null) return;

    const elapsed = (performance.now() - introStartMs) / 1000;
    const target = isTouchDevice ? CONFIG.wave.targetIntensityTouch : CONFIG.wave.targetIntensityDesktop;

    if (elapsed < CONFIG.wave.introDelaySec) {
      waveIntensity = CONFIG.wave.introStartIntensity;
      return;
    }

    const t = (elapsed - CONFIG.wave.introDelaySec) / CONFIG.wave.introDurationSec;
    if (t < 1) {
      waveIntensity =
        CONFIG.wave.introStartIntensity + (target - CONFIG.wave.introStartIntensity) * easeInOutCubic(Math.min(1, Math.max(0, t)));
      return;
    }

    waveIntensity = target;
    introComplete = true;
    if (!isTouchDevice && !prefersReducedMotion) spatialStartMs = performance.now();
  };

  return {
    startIntroAnimation: () => {
      introStartMs = performance.now();
    },
    skipToEnd: () => {
      waveIntensity = isTouchDevice || prefersReducedMotion ? CONFIG.wave.targetIntensityTouch : CONFIG.wave.targetIntensityDesktop;
      spatialBlend = isTouchDevice || prefersReducedMotion ? 0 : 1;
      introComplete = true;
    },
    updateWavePositions: (time) => {
      updateTweens();

      const geometry = tubePoints.getGeometry();
      const original = tubePoints.getOriginalPositions();
      if (!geometry || !original) return;

      const positions = geometry.attributes.position.array as Float32Array;

      if (introComplete && !isTouchDevice) {
        const matrixWorld = tubePoints.getMatrixWorld();
        if (matrixWorld && mouseTarget && mouseSmoothed && worldPos && ndcPos) {
          const dpr = Math.min(window.devicePixelRatio, 2);
          const viewW = canvas.width / dpr;
          const viewH = canvas.height / dpr;
          const vertexCount = original.length / 3;

          for (let v = 0; v < vertexCount; v += 1) {
            const idx = v * 3;
            worldPos.set(original[idx], original[idx + 1], original[idx + 2]).applyMatrix4(matrixWorld);
            ndcPos.copy(worldPos).project(camera);

            const sx = (0.5 * ndcPos.x + 0.5) * viewW;
            const sy = (0.5 * -ndcPos.y + 0.5) * viewH;
            const dx = sx - mouse.x;
            const dy = sy - mouse.y;
            const dist = Math.hypot(dx, dy);

            if (dist < CONFIG.mouse.radiusPx) {
              const w = 1 - dist / CONFIG.mouse.radiusPx;
              const ang = Math.atan2(dy, dx);
              mouseTarget[idx] = -Math.cos(ang) * w * CONFIG.mouse.forceXY;
              mouseTarget[idx + 1] = -Math.sin(ang) * w * CONFIG.mouse.forceXY;
              mouseTarget[idx + 2] = CONFIG.mouse.forceXY * w * CONFIG.mouse.forceZFactor;
            } else {
              mouseTarget[idx] = 0;
              mouseTarget[idx + 1] = 0;
              mouseTarget[idx + 2] = 0;
            }

            mouseSmoothed[idx] += CONFIG.mouse.smoothAlpha * (mouseTarget[idx] - mouseSmoothed[idx]);
            mouseSmoothed[idx + 1] += CONFIG.mouse.smoothAlpha * (mouseTarget[idx + 1] - mouseSmoothed[idx + 1]);
            mouseSmoothed[idx + 2] += CONFIG.mouse.smoothAlpha * (mouseTarget[idx + 2] - mouseSmoothed[idx + 2]);
          }
        }
      }

      const fallbackOffsets = mouseSmoothed ?? new Float32Array(positions.length);

      for (let idx = 0; idx < positions.length; idx += 3) {
        const ox = original[idx];
        const oy = original[idx + 1];
        const oz = original[idx + 2];

        const byIndex = gi(time, idx, idx, idx);
        const byPosition = gi(time, ox, oy, oz);
        const blended = {
          x: byIndex.x * (1 - spatialBlend) + byPosition.x * spatialBlend,
          y: byIndex.y * (1 - spatialBlend) + byPosition.y * spatialBlend,
          z: byIndex.z * (1 - spatialBlend) + byPosition.z * spatialBlend,
        };

        positions[idx] = ox + blended.x * waveIntensity + (isTouchDevice ? 0 : fallbackOffsets[idx]);
        positions[idx + 1] = oy + blended.y * waveIntensity + (isTouchDevice ? 0 : fallbackOffsets[idx + 1]);
        positions[idx + 2] = oz + blended.z * waveIntensity + (isTouchDevice ? 0 : fallbackOffsets[idx + 2]);
      }

      geometry.attributes.position.needsUpdate = true;
    },
    handleMouseMove: (event) => {
      const rect = canvas.getBoundingClientRect();
      mouse = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    },
    isIntroComplete: () => introComplete,
    destroy: () => {
      worldPos = null;
      ndcPos = null;
      mouseTarget = null;
      mouseSmoothed = null;
    },
  };
}

export function HomeHeroPointCloud() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(CONFIG.fog.color, CONFIG.fog.near, CONFIG.fog.far);

    const camera = new THREE.PerspectiveCamera(
      CONFIG.camera.fov,
      window.innerWidth / window.innerHeight,
      CONFIG.camera.near,
      CONFIG.camera.far
    );
    camera.position.copy(CONFIG.camera.position);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      powerPreference: "high-performance",
      antialias: false,
    });
    renderer.setClearColor(CONFIG.clearColor, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const tubePoints = createTubePoints(scene);
    const animator = createAnimator({ tubePoints, camera, canvas, isTouchDevice, prefersReducedMotion });

    if (prefersReducedMotion) animator.skipToEnd();
    else animator.startIntroAnimation();

    let visible = false;
    let hasRenderedOnce = false;
    let time = 0;
    let rafId = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      tubePoints.updateTransform();
    };

    const onMouseMove = (event: MouseEvent) => {
      animator.handleMouseMove(event);
    };

    window.addEventListener("resize", onResize);
    if (!isTouchDevice) window.addEventListener("mousemove", onMouseMove);

    const animate = () => {
      rafId = window.requestAnimationFrame(animate);
      if (!visible) return;

      if ((isTouchDevice || prefersReducedMotion) && animator.isIntroComplete()) {
        if (!hasRenderedOnce) {
          hasRenderedOnce = true;
          animator.updateWavePositions(time);
          renderer.render(scene, camera);
        }
        return;
      }

      time += CONFIG.wave.timeStep;
      animator.updateWavePositions(time);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      if (!isTouchDevice) window.removeEventListener("mousemove", onMouseMove);
      animator.destroy();
      tubePoints.destroy();
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full" />;
}
