"use client";

import { useHeroScene } from "./HeroSceneContext";

export function BackgroundFadeLayer() {
  const { scrollProgress } = useHeroScene();
  const backgroundFade = Math.min(Math.max((scrollProgress - 0.08) / 0.92, 0), 1);
  const start = { r: 221, g: 221, b: 209 };
  const end = { r: 255, g: 255, b: 255 };
  const r = Math.round(start.r + (end.r - start.r) * backgroundFade);
  const g = Math.round(start.g + (end.g - start.g) * backgroundFade);
  const b = Math.round(start.b + (end.b - start.b) * backgroundFade);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{ backgroundColor: `rgb(${r}, ${g}, ${b})` }}
    />
  );
}
