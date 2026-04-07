"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
uniform float uSize;
uniform float uAttenuation;
varying float vDepth;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = uSize * (uAttenuation / max(0.1, -mvPosition.z));
  gl_PointSize = clamp(gl_PointSize, 1.0, 12.0);
  gl_Position = projectionMatrix * mvPosition;
  vDepth = mvPosition.z;
}
`;

const fragmentShader = `
uniform vec3 uColor;
varying float vDepth;

void main() {
  vec2 center = gl_PointCoord - vec2(0.5);
  if (dot(center, center) > 0.25) discard;

  float fade = smoothstep(-65.0, -8.0, vDepth);
  gl_FragColor = vec4(uColor * mix(0.4, 1.0, fade), 1.0);
}
`;

export function PlaneWavePointCloud() {
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const positionsRef = useRef<Float32Array>(new Float32Array());
  const originalRef = useRef<Float32Array>(new Float32Array());

  const { positions, original } = useMemo(() => {
    const plane = new THREE.PlaneGeometry(36, 18, 180, 90);
    const pos = plane.attributes.position.array.slice() as Float32Array;
    plane.dispose();
    const original = pos.slice() as Float32Array;
    return { positions: pos, original };
  }, []);

  const uniforms = useMemo(
    () => ({
      uSize: { value: 0.2 },
      uAttenuation: { value: 120 },
      uColor: { value: new THREE.Color("#d1d1d1") },
    }),
    []
  );

  useEffect(() => {
    positionsRef.current = positions;
    originalRef.current = original;
  }, [positions, original]);

  useFrame((state) => {
    const geometry = geometryRef.current;
    if (!geometry) return;

    const t = state.clock.elapsedTime;
    const livePositions = positionsRef.current;
    const originalPositions = originalRef.current;

    for (let i = 0; i < livePositions.length; i += 3) {
      const x = originalPositions[i];
      const y = originalPositions[i + 1];

      const waveA = Math.sin(x * 0.34 + t * 1.2) * 0.9;
      const waveB = Math.cos(y * 0.5 - t * 0.85) * 0.6;
      const waveC = Math.sin((x + y) * 0.22 + t * 0.65) * 0.45;

      livePositions[i + 2] = waveA + waveB + waveC;
    }

    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points rotation={[-0.45, 0.18, 0.02]} position={[0, -0.8, -12]}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={false}
        depthWrite
        depthTest
        blending={THREE.NormalBlending}
      />
    </points>
  );
}
