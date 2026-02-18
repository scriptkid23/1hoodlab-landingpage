"use client";

import Image from "next/image";
import { BackgroundFadeLayer } from "./components/BackgroundFadeLayer";
import { FixedModelLayer } from "./components/FixedModelLayer";
import { HeroAnimation } from "./components/HeroAnimation";
import { HeroSceneProvider } from "./components/HeroSceneContext";
import { ScrollSmootherProvider } from "./components/ScrollSmootherProvider";
import { TechStackSection } from "./components/TechStackSection";
import { TrustedByTyping } from "./components/TrustedByTyping";
import { WhatWeDoSection } from "./components/WhatWeDoSection";

export default function Home() {
  return (
    <HeroSceneProvider>
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

            <section
              id="section-4"
              data-speed="0.9"
              className="relative z-30 min-h-[120vh] overflow-hidden bg-moon-mist-100 px-6 md:px-[120px]"
            >
              <div className="pointer-events-none absolute inset-x-0 -top-28 h-28 bg-linear-to-b from-transparent to-moon-mist-100" />
              <div className="mx-auto flex min-h-screen w-full max-w-[1200px] items-center">
                <div
                  data-speed="1.06"
                  className="w-full rounded-3xl border border-rangitoto-950/10 bg-transparent p-8 md:p-12"
                >
                  <p
                    data-speed="0.92"
                    className="text-sm uppercase tracking-[0.2em] text-rangitoto-950/60"
                  >
                    Section 4
                  </p>
                  <h2
                    data-speed="0.85"
                    className="mt-4 font-heading text-3xl leading-tight text-rangitoto-950 md:text-5xl"
                  >
                    Parallax zone to transition out the hero model
                  </h2>
                  <p
                    data-speed="0.78"
                    className="mt-4 max-w-2xl text-base text-rangitoto-950/70 md:text-lg"
                  >
                    As this section scrolls, the full block moves in parallax and gradually covers
                    the model below it.
                  </p>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </HeroSceneProvider>
  );
}
