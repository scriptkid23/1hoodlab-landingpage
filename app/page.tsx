"use client";

import Image from "next/image";
import { BackgroundFadeLayer } from "./components/BackgroundFadeLayer";
import { FixedModelLayer } from "./components/FixedModelLayer";
import { HeroAnimation } from "./components/HeroAnimation";
import { HeroSceneProvider } from "./components/HeroSceneContext";
import { ScrollSmootherProvider } from "./components/ScrollSmootherProvider";
import { TrustedByTyping } from "./components/TrustedByTyping";

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

            <section
              id="scroll-test-section"
              className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1200px] items-center px-6 md:px-[120px]"
            >
              <div className="ml-auto w-full rounded-3xl border border-rangitoto-950/10 bg-white/40 p-8 backdrop-blur-sm md:w-[68%] md:p-12">
                <p className="text-sm uppercase tracking-[0.2em] text-rangitoto-950/60">
                  Test section
                </p>
                <h2 className="mt-4 font-heading text-3xl leading-tight md:text-5xl">
                  Scroll here to test the hero model behavior
                </h2>
                <p className="mt-4 max-w-2xl text-base text-rangitoto-950/70 md:text-lg">
                  This is a temporary section for checking scroll-linked animation. You can replace
                  it with real content later.
                </p>
              </div>
            </section>
          </main>
        </div>
      </div>
    </HeroSceneProvider>
  );
}
