"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { TorusPointCloud } from "./TorusPointCloud";

export default function Lab03Page() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#111111]">
      <Canvas camera={{ position: [0, 0, 0], fov: 74, near: 0.01 }} gl={{ antialias: true }}>
        <color attach="background" args={["#111111"]} />
        <TorusPointCloud />
        <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
      </Canvas>

      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold tracking-tight text-white/90 md:text-7xl">1hoodlabs</h1>
        <div className="mt-3 max-w-3xl text-[15.6px] leading-snug tracking-tight text-zinc-300 md:text-lg md:mt-6 text-center">
          <span className="block">
            AI, biotech, robotics, blockchain, NewSpace—these aren’t incremental improvements.
          </span>
          <span className="block">
            They’re generational leaps that solve humanity’s hardest challenges.
          </span>
          <span className="block">
            They move faster than convention. So do we.
          </span>
        </div>
      </div>
    </main>
  );
}
