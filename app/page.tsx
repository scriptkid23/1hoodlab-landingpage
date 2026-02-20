"use client";

import Image from "next/image";
import { BackgroundFadeLayer } from "./components/BackgroundFadeLayer";
import { FixedModelLayer } from "./components/FixedModelLayer";
import { HeroAnimation } from "./components/HeroAnimation";
import { PageLoadingOverlay } from "./components/PageLoadingOverlay";
import { HeroSceneProvider } from "./components/HeroSceneContext";
import { ScrollSmootherProvider } from "./components/ScrollSmootherProvider";
import { TechStackSection } from "./components/TechStackSection";
import { TrustedByTyping } from "./components/TrustedByTyping";
import { WhatWeDoSection } from "./components/WhatWeDoSection";

export default function Home() {
  return (
    <HeroSceneProvider>
      <PageLoadingOverlay />
      <BackgroundFadeLayer />
      <FixedModelLayer />
      <ScrollSmootherProvider />

      <div id="smooth-wrapper" className="relative z-20">
        <div id="smooth-content">
          <main className="min-h-screen bg-transparent text-rangitoto-950">
            <div className="container relative mx-auto min-h-screen w-full overflow-hidden">
              <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 pt-6 md:px-[120px] md:pt-[34px]">
                <Image
                  src="/assets/brands/brand.svg"
                  alt="1hudlabs"
                  width={118}
                  height={24}
                  priority
                />

                <button
                  type="button"
                  className="flex h-10 w-[100px] items-center justify-center gap-2 rounded-full border border-rangitoto-950 text-sm font-normal text-rangitoto-950"
                >
                  <span>Try now</span>
                  <span aria-hidden>→</span>
                </button>
              </header>

              <HeroAnimation />

              <TrustedByTyping />
            </div>

            <WhatWeDoSection />

            <TechStackSection />
          </main>
        </div>
      </div>
    </HeroSceneProvider>
  );
}
