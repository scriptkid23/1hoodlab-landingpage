"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Center,
  Clone,
  Environment,
  Float,
  MeshTransmissionMaterial,
  useGLTF,
} from "@react-three/drei";
import { ChromaticAberration, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";
import { BlendFunction } from "postprocessing";

type GlassRibbonProps = {
  reveal: boolean;
};

function GlassRibbon({ reveal }: GlassRibbonProps) {
  const { scene } = useGLTF("/assets/models/model.glb");
  const ribbonRef = useRef<THREE.Group>(null);
  const fresnelEdgeA = useMemo(() => new THREE.Color("#5b7cff"), []);
  const fresnelEdgeB = useMemo(() => new THREE.Color("#7a4dff"), []);
  const chromaOffset = useMemo(() => new THREE.Vector2(0.00028, 0.00014), []);
  const revealProgressRef = useRef(0);

  useFrame((state, delta) => {
    if (!ribbonRef.current) return;

    const targetReveal = reveal ? 1 : 0;
    revealProgressRef.current = THREE.MathUtils.damp(
      revealProgressRef.current,
      targetReveal,
      4.5,
      delta
    );
    const revealProgress = revealProgressRef.current;

    ribbonRef.current.visible = revealProgress > 0.02;
    ribbonRef.current.scale.setScalar(0.78 + revealProgress * 0.22);
    ribbonRef.current.position.y = (1 - revealProgress) * -0.38;
    ribbonRef.current.rotation.y += delta * 0.35;
    ribbonRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.05 * revealProgress;
  });

  useEffect(() => {
    scene.traverse((obj) => {
      if ("isMesh" in obj && (obj as THREE.Mesh).isMesh) {
        (obj as THREE.Mesh).frustumCulled = false;
      }
    });
  }, [scene]);

  const addFresnelTint = useCallback(
    (shader: { uniforms: Record<string, { value: unknown }>; fragmentShader: string }) => {
      shader.uniforms.uFresnelEdgeA = { value: fresnelEdgeA };
      shader.uniforms.uFresnelEdgeB = { value: fresnelEdgeB };
      shader.uniforms.uFresnelStrength = { value: 0.16 };

      shader.fragmentShader = shader.fragmentShader
        .replace(
          "void main() {",
          `
          uniform vec3 uFresnelEdgeA;
          uniform vec3 uFresnelEdgeB;
          uniform float uFresnelStrength;
          void main() {
          `
        )
        .replace(
          "#include <output_fragment>",
          `
          #include <output_fragment>
          float fresnel = pow(
            1.0 - clamp(abs(dot(normalize(normal), normalize(vViewPosition))), 0.0, 1.0),
            2.6
          );
          vec3 edgeTint = mix(uFresnelEdgeA, uFresnelEdgeB, smoothstep(0.55, 1.0, fresnel));
          gl_FragColor.rgb = mix(gl_FragColor.rgb, edgeTint, fresnel * uFresnelStrength);
          `
        );
    },
    [fresnelEdgeA, fresnelEdgeB]
  );

  return (
    <Float speed={0.5} rotationIntensity={0.03} floatIntensity={0.045}>
      <group ref={ribbonRef}>
        <Center>
          <Clone
            object={scene}
            inject={(obj: THREE.Object3D) =>
              "isMesh" in obj && (obj as THREE.Mesh).isMesh ? (
                <MeshTransmissionMaterial
                  transmission={1}
                  roughness={0.03}
                  ior={1.18}
                  thickness={0.28}
                  color="#ffffff"
                  attenuationColor="#f3f6ff"
                  attenuationDistance={1.3}
                  chromaticAberration={0.009}
                  anisotropy={0.03}
                  distortion={0}
                  distortionScale={0}
                  temporalDistortion={0}
                  clearcoat={0}
                  samples={6}
                  resolution={256}
                  backside
                  backsideThickness={0.26}
                  side={THREE.DoubleSide}
                  envMapIntensity={0.95}
                  onBeforeCompile={addFresnelTint}
                />
              ) : null
            }
          />
        </Center>
      </group>
      <EffectComposer multisampling={0} enableNormalPass={false}>
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={chromaOffset}
          radialModulation
          modulationOffset={0.5}
        />
      </EffectComposer>
    </Float>
  );
}

type HeroGlassSceneProps = {
  reveal?: boolean;
};

export function HeroGlassScene({ reveal = true }: HeroGlassSceneProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) return <div className="h-full w-full min-h-[400px]" />;

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4.2], fov: 34 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: false,
      }}
      frameloop="always"
      style={{ width: "100%", height: "100%" }}
      onCreated={({ gl }) => {
        const canvas = gl.domElement;
        canvas.addEventListener(
          "webglcontextlost",
          (e) => e.preventDefault(),
          false
        );
        canvas.addEventListener("webglcontextrestored", () => {}, false);
      }}
    >
      <ambientLight intensity={0.1} />
      <directionalLight
        position={[0.25, 3.8, 2.6]}
        intensity={1.1}
        color="#ffffff"
      />
      <directionalLight
        position={[-2.8, 1.4, -3.6]}
        intensity={0.72}
        color="#d8e0ff"
      />
      <pointLight position={[2.4, 0.6, 1.7]} intensity={0.16} color="#f8faff" />

      <Environment preset="studio" blur={0.82} />

      <Suspense fallback={null}>
        <group position={[0, 0, 0]}>
          <GlassRibbon reveal={reveal} />
        </group>
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload("/assets/models/model.glb");
