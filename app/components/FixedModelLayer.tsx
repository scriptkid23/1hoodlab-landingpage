"use client";

import dynamic from "next/dynamic";
import type { CSSProperties } from "react";
import { useHeroScene } from "./HeroSceneContext";

const HeroGlassScene = dynamic(
  () => import("./HeroGlassScene").then((module) => module.HeroGlassScene),
  { ssr: false }
);

type FixedModelLayerProps = {
  className?: string;
  style?: CSSProperties;
  tone?: "light" | "dark";
  scrollProgressOverride?: number;
  position?: "fixed" | "absolute";
};

export function FixedModelLayer({
  className = "",
  style,
  tone = "light",
  scrollProgressOverride,
  position = "fixed",
}: FixedModelLayerProps) {
  const { modelVisible, scrollProgress } = useHeroScene();
  const sceneScrollProgress = scrollProgressOverride ?? scrollProgress;
  const rootClassName = ["pointer-events-none inset-0 z-10", position, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClassName} style={style}>
      <HeroGlassScene reveal={modelVisible} scrollProgress={sceneScrollProgress} tone={tone} />
    </div>
  );
}
