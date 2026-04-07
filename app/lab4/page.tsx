"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { PlaneWavePointCloud } from "./PlaneWavePointCloud";

export default function Lab04Page() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#111111]">
      <Canvas camera={{ position: [0, 0, 28], fov: 48 }} gl={{ antialias: true }}>
        <color attach="background" args={["#111111"]} />
        <PlaneWavePointCloud />
        <OrbitControls enablePan={false} enableZoom={false} autoRotate={false} />
      </Canvas>

      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold tracking-tight text-white/90 md:text-7xl">LAB 04</h1>
        <p className="mt-4 text-xs uppercase tracking-[0.3em] text-zinc-300 md:text-sm">Plane Wave Point Cloud</p>
      </div>
    </main>
  );
}
