"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  GLSL Shaders                                                       */
/* ------------------------------------------------------------------ */

const vertexShader = `
uniform float uSize;
uniform float uAttenuation;
uniform float uFogNear;
uniform float uFogFar;
varying float vFade;
varying float vHeight;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = uSize * (uAttenuation / max(0.1, -mvPosition.z));
  gl_PointSize = clamp(gl_PointSize, 0.5, 10.0);
  gl_Position  = projectionMatrix * mvPosition;

  float depth = -mvPosition.z;
  vFade = 1.0 - smoothstep(uFogNear, uFogFar, depth);
  vHeight = position.z;
}
`;

const fragmentShader = `
uniform vec3 uColor;
uniform vec3 uBgColor;
varying float vFade;
varying float vHeight;

void main() {
  vec2 center = gl_PointCoord - vec2(0.5);
  float r2 = dot(center, center);
  if (r2 > 0.25) discard;

  // Soft edge antialiasing
  float edge = smoothstep(0.25, 0.18, r2);

  // Height boost — peaks slightly brighter
  float heightBoost = clamp(0.85 + vHeight * 0.06, 0.7, 1.0);

  vec3 col = mix(uBgColor, uColor * heightBoost, vFade * edge);
  gl_FragColor = vec4(col, 1.0);
}
`;

/* ------------------------------------------------------------------ */
/*  Perlin-like fractal noise  (matches reference Tr() function)       */
/* ------------------------------------------------------------------ */

function fractalWave(
  x: number,
  y: number,
  amplitude: number,
  frequency: number = 0.15,
  octaves: number = 3
): number {
  let sum = 0;
  for (let o = 0; o < octaves; o++) {
    const freq = frequency * (o + 1);
    const amp = 1 / (o + 1);
    sum += Math.sin(x * freq) * Math.cos(y * freq * 0.7) * amp;
    sum += Math.cos(x * freq * 0.8) * Math.sin(y * freq) * amp * 0.5;
  }
  return sum * amplitude;
}

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */

const CONFIG = {
  // Geometry — exact reference values
  planeWidth: 150,
  planeHeight: 100,
  widthSegments: 150,
  heightSegments: 150,

  // Wave — exact reference values
  baseAmplitude: 1,
  baseFrequency: 0.15,
  octaves: 2,
  frequencySpeed: 0.35,
  amplitudeVariation: 0.35,
  animationSpeed: 0.6,
  maxAmplitude: 4,
  timeStep: 0.01,

  // Particles — exact reference values
  pointSize: 0.25,
  sizeAttenuation: 250,
  color: "#d1d1d1",

  // Fog — exact reference values
  fogColor: "#111111",
  fogNear: 5,
  fogFar: 50,
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function WavePointCloud() {
  const geometryRef = useRef<THREE.BufferGeometry>(null);

  const dataRef = useRef<{
    original: Float32Array;
    time: number;
  } | null>(null);

  /* ---------- Geometry -------------------------------------------- */
  const positions = useMemo(() => {
    const plane = new THREE.PlaneGeometry(
      CONFIG.planeWidth,
      CONFIG.planeHeight,
      CONFIG.widthSegments,
      CONFIG.heightSegments
    );
    const pos = plane.attributes.position.array as Float32Array;

    // Apply initial fractal wave to Z
    for (let i = 0; i < pos.length; i += 3) {
      pos[i + 2] = fractalWave(
        pos[i],
        pos[i + 1],
        CONFIG.baseAmplitude,
        CONFIG.baseFrequency,
        CONFIG.octaves
      );
    }

    const original = pos.slice() as Float32Array;

    dataRef.current = { original, time: 0 };

    plane.dispose();
    return pos;
  }, []);

  /* ---------- Uniforms -------------------------------------------- */
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(CONFIG.color) },
      uBgColor: { value: new THREE.Color(CONFIG.fogColor) },
      uSize: { value: CONFIG.pointSize },
      uAttenuation: { value: CONFIG.sizeAttenuation },
      uFogNear: { value: CONFIG.fogNear },
      uFogFar: { value: CONFIG.fogFar },
    }),
    []
  );

  /* ---------- Animation loop -------------------------------------- */
  useFrame(() => {
    const geometry = geometryRef.current;
    const data = dataRef.current;
    if (!geometry || !data) return;

    const { original } = data;
    data.time += CONFIG.timeStep;
    const t = data.time;

    const posAttr = geometry.attributes.position;
    const live = posAttr.array as Float32Array;

    const freqMod = 1 + Math.sin(t * CONFIG.frequencySpeed) * CONFIG.amplitudeVariation;
    const modulatedFreq = CONFIG.baseFrequency * freqMod;
    const ampRange = CONFIG.maxAmplitude - CONFIG.baseAmplitude;
    const modulatedAmp =
      CONFIG.baseAmplitude +
      0.5 * ampRange +
      0.5 * ampRange * Math.sin(t * CONFIG.animationSpeed);

    const vertexCount = original.length / 3;
    for (let v = 0; v < vertexCount; v++) {
      const idx = v * 3;
      live[idx + 2] = fractalWave(
        original[idx],
        original[idx + 1] + t * 1.2,
        modulatedAmp,
        modulatedFreq,
        CONFIG.octaves
      );
    }

    posAttr.needsUpdate = true;
  });

  /* ---------- Render ---------------------------------------------- */
  return (
    <points
      rotation={[-1.396, 0, 0]}
      position={[0, 4, -5]}
    >
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          usage={THREE.DynamicDrawUsage}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite
        depthTest
      />
    </points>
  );
}
