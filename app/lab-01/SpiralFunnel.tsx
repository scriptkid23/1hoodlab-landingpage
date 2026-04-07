"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Circular slices swept along a curved 3D spine (Frenet-style frame).
 * Cross-section profile is an isosceles trapezoid (diagram): bottom width 7.4, top 5.0,
 * height 7 → half-widths 3.7 → 2.5, linear along slice parameter u.
 */
const NUM_SLICES = 40;
const POINTS_PER_RING = 40;
const POINT_COUNT = NUM_SLICES * POINTS_PER_RING;

/** Extra dot radius (+0.25cm at 96dpi); gl_PointSize is diameter in px, so ×2 */
const PX_PER_CM = 96 / 2.54;
const EXTRA_POINT_RADIUS_CM = 0.05;
const EXTRA_POINT_DIAMETER_PX = 2 * EXTRA_POINT_RADIUS_CM * PX_PER_CM;

const vertexShader = `
  uniform float uTime;
  uniform float uPointScale;
  uniform float uCount;
  uniform float uPointsPerRing;
  uniform float uExtraDiameterPx;
  
  attribute float aIndex;
  
  varying float vDepth;
  varying float vAlpha;

  // Curved spine: centers of slices follow an arc (not a straight axis)
  vec3 spine(float u) {
    float a = u * 1.42;
    float bx = -9.5 + 13.5 * u + 2.8 * sin(a * 0.72);
    float by = -2.4 * sin(a * 0.55);
    float bz = -0.8 - 9.0 * pow(u, 1.05) - 2.6 * (1.0 - cos(a * 0.88));
    return vec3(bx, by, bz);
  }

  vec3 spineTangent(float u) {
    float e = 0.004;
    float up = min(u + e, 1.0);
    float um = max(u - e, 0.0);
    return normalize(spine(up) - spine(um));
  }

  void main() {
    float ppr = uPointsPerRing;
    float slice = floor(aIndex / ppr);
    float numSlices = uCount / ppr;
    float iRing = mod(aIndex, ppr);
    
    float u = slice / max(numSlices - 1.0, 1.0);
    
    // Trapezoid cross-section (grid units): C(0,1)–D(7.4,1) bottom, A(1.2,8)–B(6.2,8) top
    // Half-widths: bottom 3.7, top 2.5 → linear taper (frustum profile)
    float halfBottom = 3.7;
    float halfTop = 2.5;
    float rSceneScale = 12.8 / halfBottom;
    float r = rSceneScale * (halfBottom + (halfTop - halfBottom) * u);
    
    float theta = (iRing / ppr) * 6.2831853;
    
    vec3 C = spine(clamp(u, 0.001, 0.999));
    vec3 T = spineTangent(clamp(u, 0.02, 0.98));
    
    vec3 upRef = vec3(0.0, 1.0, 0.0);
    vec3 N = normalize(cross(upRef, T));
    if (length(N) < 0.02) {
      upRef = vec3(1.0, 0.0, 0.0);
      N = normalize(cross(upRef, T));
    }
    vec3 B = normalize(cross(T, N));
    
    vec3 pos = C + r * (cos(theta) * N + sin(theta) * B);
    
    float breathe = sin(theta * 2.0 + uTime * 0.3) * 0.025 * (1.0 - abs(u - 0.5) * 1.1);
    pos += T * breathe;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    float dist = max(0.12, -mvPosition.z);
    
    gl_PointSize = uPointScale * 3.0 * (14.0 / dist) + uExtraDiameterPx;
    gl_PointSize = clamp(gl_PointSize, 1.0, 32.0);
    
    gl_Position = projectionMatrix * mvPosition;
    vDepth = mvPosition.z;
    vAlpha = 0.94;
  }
`;

const fragmentShader = `
  varying float vDepth;
  varying float vAlpha;

  void main() {
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    float d = dot(cxy, cxy);
    if (d > 1.0) discard;
    
    float edge = smoothstep(1.0, 0.88, d);
    float alpha = edge * vAlpha;
    
    float depthFade = smoothstep(-36.0, -4.0, vDepth);
    vec3 col = vec3(0.82, 0.82, 0.84);
    col *= mix(0.52, 1.0, depthFade);
    
    gl_FragColor = vec4(col, alpha);
  }
`;

export function SpiralFunnel() {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { positionArray, indexArray } = useMemo(() => {
    const positionArray = new Float32Array(POINT_COUNT * 3);
    const indexArray = new Float32Array(POINT_COUNT);
    for (let i = 0; i < POINT_COUNT; i++) indexArray[i] = i;
    return { positionArray, indexArray };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointScale: {
        value: typeof window !== "undefined" ? Math.min(1.25, 1 / window.devicePixelRatio) : 1,
      },
      uCount: { value: POINT_COUNT },
      uPointsPerRing: { value: POINTS_PER_RING },
      uExtraDiameterPx: { value: EXTRA_POINT_DIAMETER_PX },
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <group rotation={[0.32, -0.52, 0.08]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positionArray, 3]} />
          <bufferAttribute attach="attributes-aIndex" args={[indexArray, 1]} />
        </bufferGeometry>

        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite
          depthTest
          blending={THREE.NormalBlending}
        />
      </points>
    </group>
  );
}
