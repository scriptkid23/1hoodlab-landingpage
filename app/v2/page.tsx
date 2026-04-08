"use client";

import { useEffect } from "react";
import { FixedModelLayer } from "../components/FixedModelLayer";
import { LabHeader } from "../components/LabHeader";
import { HeroAnimation } from "../components/HeroAnimation";
import { HeroSceneProvider, useHeroScene } from "../components/HeroSceneContext";

function V2HeroSection() {
  const { setPageReady } = useHeroScene();

  useEffect(() => {
    setPageReady(true);
  }, [setPageReady]);

  return (
    <div className="relative z-20">
      <FixedModelLayer tone="dark" scrollProgressOverride={0} position="absolute" />
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
