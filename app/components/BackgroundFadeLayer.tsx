"use client";

import { useHeroScene } from "./HeroSceneContext";

export function BackgroundFadeLayer() {
  const { scrollProgress, section4Progress } = useHeroScene();
  const backgroundFade = Math.min(Math.max((scrollProgress - 0.08) / 0.92, 0), 1);
  const start = { r: 221, g: 221, b: 209 };
  const end = { r: 255, g: 255, b: 255 };
  const midR = start.r + (end.r - start.r) * backgroundFade;
  const midG = start.g + (end.g - start.g) * backgroundFade;
  const midB = start.b + (end.b - start.b) * backgroundFade;
  const r = Math.round(midR + (start.r - midR) * section4Progress);
  const g = Math.round(midG + (start.g - midG) * section4Progress);
  const b = Math.round(midB + (start.b - midB) * section4Progress);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{ backgroundColor: `rgb(${r}, ${g}, ${b})` }}
    />
  );
}
