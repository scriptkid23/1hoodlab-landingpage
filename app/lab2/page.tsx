"use client";

import { HomeHeroPointCloud } from "./HomeHeroPointCloud";

export default function Lab02Page() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#111111]">
      <HomeHeroPointCloud />

      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold tracking-tight text-white/90 md:text-7xl">LAB 02</h1>
        <p className="mt-4 text-xs uppercase tracking-[0.3em] text-zinc-300 md:text-sm">
          Home Hero Tube Point Cloud
        </p>
      </div>
    </main>
  );
}
