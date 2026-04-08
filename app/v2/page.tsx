"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect } from "react";
import { LabHeader } from "../components/LabHeader";
import { HeroAnimation } from "../components/HeroAnimation";
import { HeroSceneProvider, useHeroScene } from "../components/HeroSceneContext";
import { MorphPointCloud } from "../lab5/MorphPointCloud";

function V2MorphLayer() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <Canvas camera={{ position: [0, 0, 20], fov: 50 }} gl={{ antialias: true }}>
        <MorphPointCloud />
      </Canvas>
    </div>
  );
}

function V2HeroSection() {
  const { setPageReady } = useHeroScene();

  useEffect(() => {
    setPageReady(true);
  }, [setPageReady]);

  return (
    <div className="relative z-20">
      <V2MorphLayer />
      <HeroAnimation theme="dark" align="split" accountForHeader />
    </div>
  );
}

export default function V2Page() {
  return (
    <HeroSceneProvider>
      <div className="pointer-events-none fixed inset-0 z-0 bg-[#111]" />

      <div className="relative z-20 min-h-[300vh] text-[#e7e7e7]">
        <LabHeader />
        <V2HeroSection />

        <div className="flex min-h-screen items-center justify-center">
          <p className="text-lg opacity-40">Scroll to test header behavior</p>
        </div>
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-lg opacity-40">Keep scrolling...</p>
        </div>
      </div>
    </HeroSceneProvider>
  );
}
