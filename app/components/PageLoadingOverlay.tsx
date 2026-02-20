"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { useHeroScene } from "./HeroSceneContext";

const MIN_DISPLAY_MS = 800;
const MAX_WAIT_MS = 5000;

export function PageLoadingOverlay() {
  const { modelLoaded } = useHeroScene();

  // Lock scroll while loading
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }, []);

  // Wait for model to load and minimum display time before hiding
  const [startTime] = useState(() => Date.now());
  const [canHide, setCanHide] = useState(false);

  useEffect(() => {
    const check = () => {
      const elapsed = Date.now() - startTime;
      // Hide when model is loaded and min time passed, or max wait reached (fallback)
      if ((modelLoaded && elapsed >= MIN_DISPLAY_MS) || elapsed >= MAX_WAIT_MS) {
        setCanHide(true);
      }
    };
    const interval = setInterval(check, 100);
    return () => clearInterval(interval);
  }, [modelLoaded, startTime]);

  useEffect(() => {
    if (!canHide) return;

    const el = document.getElementById("page-loading-overlay");
    if (!el) return;

    gsap.to(el, {
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        el.style.pointerEvents = "none";
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
      },
    });
  }, [canHide]);

  return (
    <div
      id="page-loading-overlay"
      className="fixed inset-0 z-100 flex items-center justify-center bg-rangitoto-50 overscroll-none touch-none"
    >
      <div className="flex flex-col items-center gap-8">
        <Image
          src="/assets/brands/brand.svg"
          alt="1hudlabs"
          width={94}
          height={20}
          className="opacity-80"
        />
        <div className="flex gap-1">
          <span
            className="h-1.5 w-1.5 animate-[loadingDot_0.6s_ease-in-out_infinite] rounded-full bg-rangitoto-950"
            style={{ animationDelay: "0s" }}
          />
          <span
            className="h-1.5 w-1.5 animate-[loadingDot_0.6s_ease-in-out_infinite] rounded-full bg-rangitoto-950"
            style={{ animationDelay: "0.2s" }}
          />
          <span
            className="h-1.5 w-1.5 animate-[loadingDot_0.6s_ease-in-out_infinite] rounded-full bg-rangitoto-950"
            style={{ animationDelay: "0.4s" }}
          />
        </div>
      </div>
    </div>
  );
}
