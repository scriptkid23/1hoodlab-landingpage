"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

export function ScrollSmootherProvider() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    const existing = ScrollSmoother.get();
    if (existing) {
      existing.kill();
    }

    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1,
      effects: true,
      smoothTouch: 0.1,
    });

    return () => {
      smoother.kill();
    };
  }, []);

  return null;
}
