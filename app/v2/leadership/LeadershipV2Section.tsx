"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { TorusPointCloud } from "../../lab3/TorusPointCloud";

export function LeadershipV2Section() {
  return (
    <section
      id="partners"
      className="relative isolate z-20 overflow-hidden rounded-t-[20px] rounded-b-[20px] bg-[#111] -mt-[20px]"
    >
      <main className="relative h-[100dvh] w-full overflow-hidden bg-[#111111]">
        <Canvas className="absolute inset-0" camera={{ position: [0, 0, 0], fov: 74, near: 0.01 }} gl={{ antialias: true }}>
          <color attach="background" args={["#111111"]} />
          <TorusPointCloud />
          <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
        </Canvas>
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-44 bg-gradient-to-b from-[#111111] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-44 bg-gradient-to-t from-[#111111] to-transparent" />

        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white/90 md:text-7xl">1hoodlabs</h1>
          <div className="mt-3 max-w-3xl text-[15.6px] leading-snug tracking-tight text-zinc-300 md:text-lg md:mt-6">
            <span className="block">AI, biotech, robotics, blockchain, NewSpace—these aren&apos;t incremental improvements.</span>
            <span className="block">They&apos;re generational leaps that solve humanity&apos;s hardest challenges.</span>
            <span className="block">They move faster than convention. So do we.</span>
          </div>
        </div>
      </main>
    </section>
  );
}
