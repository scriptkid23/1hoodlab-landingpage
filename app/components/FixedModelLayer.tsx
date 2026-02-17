"use client";

import dynamic from "next/dynamic";
import { useHeroScene } from "./HeroSceneContext";

const HeroGlassScene = dynamic(
  () => import("./HeroGlassScene").then((module) => module.HeroGlassScene),
  { ssr: false }
);

export function FixedModelLayer() {
  const { modelVisible, scrollProgress } = useHeroScene();

  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      <HeroGlassScene reveal={modelVisible} scrollProgress={scrollProgress} />
    </div>
  );
}
