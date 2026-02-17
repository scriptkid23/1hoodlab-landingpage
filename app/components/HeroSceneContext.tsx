"use client";

import { createContext, useContext, useMemo, useState } from "react";

type HeroSceneContextValue = {
  modelVisible: boolean;
  setModelVisible: (value: boolean) => void;
  scrollProgress: number;
  setScrollProgress: (value: number) => void;
  section4Progress: number;
  setSection4Progress: (value: number) => void;
};

const HeroSceneContext = createContext<HeroSceneContextValue | null>(null);

export function HeroSceneProvider({ children }: { children: React.ReactNode }) {
  const [modelVisible, setModelVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [section4Progress, setSection4Progress] = useState(0);

  const value = useMemo(
    () => ({
      modelVisible,
      setModelVisible,
      scrollProgress,
      setScrollProgress,
      section4Progress,
      setSection4Progress,
    }),
    [modelVisible, scrollProgress, section4Progress]
  );

  return <HeroSceneContext.Provider value={value}>{children}</HeroSceneContext.Provider>;
}

export function useHeroScene() {
  const context = useContext(HeroSceneContext);
  if (!context) {
    throw new Error("useHeroScene must be used within HeroSceneProvider");
  }
  return context;
}
