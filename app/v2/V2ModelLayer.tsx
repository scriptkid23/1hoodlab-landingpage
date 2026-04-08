"use client";

import { Environment, Float, MeshTransmissionMaterial } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function GlassForm() {
  const meshRef = useRef<THREE.Mesh>(null);
  const chroma = useMemo(() => new THREE.Color("#f2f5ff"), []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.35;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.45) * 0.15 + 0.22;
    meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.25) * 0.08;
  });

  return (
    <Float speed={0.7} rotationIntensity={0.2} floatIntensity={0.35}>
      <mesh ref={meshRef} position={[0, 0.25, 0]}>
        <torusKnotGeometry args={[0.95, 0.26, 256, 24, 3, 5]} />
        <MeshTransmissionMaterial
          transmission={1}
          roughness={0.05}
          ior={1.16}
          thickness={0.33}
          color={chroma}
          attenuationColor="#d8e1ff"
          attenuationDistance={1.6}
          chromaticAberration={0.02}
          anisotropy={0.08}
          distortion={0}
          distortionScale={0}
          temporalDistortion={0}
          clearcoat={0}
          samples={6}
          resolution={256}
          backside
          side={THREE.DoubleSide}
          envMapIntensity={1}
        />
      </mesh>
    </Float>
  );
}

export function V2ModelLayer() {
  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4], fov: 34 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.22} />
        <directionalLight position={[1.8, 3, 2.8]} intensity={1.1} color="#ffffff" />
        <directionalLight position={[-2.8, 1.4, -3.2]} intensity={0.6} color="#cbd6ff" />
        <Environment preset="studio" blur={0.8} />
        <GlassForm />
      </Canvas>
    </div>
  );
}
