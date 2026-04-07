"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const POINT_COUNT = 7000;

const vertexShader = `
uniform float uSize;
uniform float uAttenuation;
varying float vDepth;
varying float vAlpha;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = uSize * (uAttenuation / max(0.1, -mvPosition.z));
  gl_PointSize = clamp(gl_PointSize, 1.0, 12.0);
  gl_Position = projectionMatrix * mvPosition;
  vDepth = mvPosition.z;
  vAlpha = 0.92;
}
`;

const fragmentShader = `
uniform vec3 uColor;
varying float vDepth;
varying float vAlpha;

void main() {
  vec2 center = gl_PointCoord - vec2(0.5);
  if (dot(center, center) > 0.25) discard;

  float fade = smoothstep(-45.0, -5.0, vDepth);
  gl_FragColor = vec4(uColor * mix(0.45, 1.0, fade), vAlpha);
}
`;

function buildMorphSources() {
  const a = new Float32Array(POINT_COUNT * 3);
  const b = new Float32Array(POINT_COUNT * 3);

  for (let i = 0; i < POINT_COUNT; i += 1) {
    const i3 = i * 3;
    const t = i / POINT_COUNT;

    // Shape A: stacked planes along Y.
    const layer = (i % 120) / 120;
    const xA = (Math.random() * 2 - 1) * 7.5;
    const yA = -6 + layer * 12;
    const zA = (Math.random() * 2 - 1) * 3.8;

    // Shape B: cylinder surface + slight thickness.
    const theta = Math.random() * Math.PI * 2;
    const radius = 5.2 + (Math.random() * 2 - 1) * 0.35;
    const yB = -6 + t * 12;
    const xB = Math.cos(theta) * radius;
    const zB = Math.sin(theta) * radius;

    a[i3] = xA;
    a[i3 + 1] = yA;
    a[i3 + 2] = zA;

    b[i3] = xB;
    b[i3 + 1] = yB;
    b[i3 + 2] = zB;
  }

  return { a, b };
}

export function MorphPointCloud() {
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const livePositionsRef = useRef<Float32Array>(new Float32Array());

  const { sourceA, sourceB, livePositions } = useMemo(() => {
    const { a, b } = buildMorphSources();
    const livePositions = a.slice() as Float32Array;
    return { sourceA: a, sourceB: b, livePositions };
  }, []);

  const uniforms = useMemo(
    () => ({
      uSize: { value: 0.22 },
      uAttenuation: { value: 140 },
      uColor: { value: new THREE.Color("#d1d1d1") },
    }),
    []
  );

  useEffect(() => {
    livePositionsRef.current = livePositions;
  }, [livePositions]);

  useFrame((state) => {
    const geometry = geometryRef.current;
    if (!geometry) return;

    const t = state.clock.elapsedTime;
    const morph = (Math.sin(t * 0.55) + 1) * 0.5;
    const noiseScale = 1 - morph;
    const live = livePositionsRef.current;

    for (let i = 0; i < live.length; i += 3) {
      const wobble = Math.sin(t * 2.1 + i * 0.013) * 0.08 * noiseScale;
      live[i] = THREE.MathUtils.lerp(sourceA[i], sourceB[i], morph) + wobble;
      live[i + 1] = THREE.MathUtils.lerp(sourceA[i + 1], sourceB[i + 1], morph);
      live[i + 2] = THREE.MathUtils.lerp(sourceA[i + 2], sourceB[i + 2], morph) + wobble;
    }

    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points rotation={[0, -0.45, 0]}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute attach="attributes-position" args={[livePositions, 3]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite
        depthTest
        blending={THREE.NormalBlending}
      />
    </points>
  );
}
