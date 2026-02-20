"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useHeroScene } from "./HeroSceneContext";

const FALLBACK_READY_MS = 6000;

export function HeroAnimation() {
  const { pageReady, setModelVisible, setScrollProgress, setSection4Progress } = useHeroScene();
  const [fallbackReady, setFallbackReady] = useState(false);

  // Fallback: run animation anyway after 6s if pageReady never fires
  useEffect(() => {
    const t = setTimeout(() => setFallbackReady(true), FALLBACK_READY_MS);
    return () => clearTimeout(t);
  }, []);

  const shouldAnimate = pageReady || fallbackReady;
  const wrapRef = useRef<HTMLDivElement>(null);
  const techRef = useRef<HTMLParagraphElement>(null);
  const line1Ref = useRef<HTMLHeadingElement>(null);
  const line2Ref = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const targets = [techRef.current, line1Ref.current, line2Ref.current, lineRef.current].filter(
      Boolean
    );

    if (!shouldAnimate) {
      gsap.set(targets, { autoAlpha: 0 });
      return;
    }

    setModelVisible(false);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      const tech = techRef.current;
      const line1 = line1Ref.current;
      const line2 = line2Ref.current;
      const line = lineRef.current;

      // Use fromTo so we explicitly animate to visible (elements may already be autoAlpha:0 from loading)
      if (tech) tl.fromTo(tech, { y: -20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5 });
      if (line1) tl.fromTo(line1, { y: -48, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 });
      if (line2)
        tl.fromTo(line2, { y: 48, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 }, "<");
      if (line)
        tl.fromTo(
          line,
          { scaleX: 0, autoAlpha: 0, transformOrigin: "center" },
          { scaleX: 1, autoAlpha: 1, duration: 0.4, transformOrigin: "center" },
          "<"
        );
      tl.call(() => setModelVisible(true), [], "+=0.05");
    }, wrapRef);

    return () => {
      setModelVisible(false);
      ctx.revert();
    };
  }, [shouldAnimate, setModelVisible]);

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      const hero = wrapRef.current;
      if (!hero) return;
      const viewportHeight = window.innerHeight || 1;
      const section3 = document.getElementById("section-3");
      const section2 = document.getElementById("section-2");
      const section4 = document.getElementById("section-4");
      const scrollY = window.scrollY || window.pageYOffset;
      const heroStart = hero.offsetTop;
      const targetSection = section3 ?? section2;
      const targetY = targetSection
        ? targetSection.offsetTop + targetSection.offsetHeight * 0.5 - viewportHeight * 0.5
        : heroStart + viewportHeight;
      const progress = Math.min(
        Math.max((scrollY - heroStart) / Math.max(targetY - heroStart, 1), 0),
        1
      );
      setScrollProgress(progress);

      if (section4) {
        const section4Rect = section4.getBoundingClientRect();
        const section4Range = Math.max(section4Rect.height + viewportHeight * 0.2, 1);
        const nextSection4Progress = Math.min(
          Math.max((viewportHeight * 0.9 - section4Rect.top) / section4Range, 0),
          1
        );
        setSection4Progress(nextSection4Progress);
      } else {
        setSection4Progress(0);
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        updateProgress();
        ticking = false;
      });
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateProgress);
      setScrollProgress(0);
      setSection4Progress(0);
    };
  }, [setModelVisible, setScrollProgress, setSection4Progress]);

  return (
    <div
      ref={wrapRef}
      className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden"
    >
      <section className="relative z-20 w-full px-6 md:px-[120px]">
        <p
          ref={techRef}
          className="mb-1 text-2xl leading-8 font-normal text-rangitoto-950"
        >
          Technology
        </p>

        <h1
          ref={line1Ref}
          className="overflow-hidden font-heading text-[40px] leading-tight font-normal text-rangitoto-950 md:text-[64px] md:leading-[79px]"
        >
          The fastest, most reliable way
        </h1>
      </section>

      <div
        ref={lineRef}
        className="relative left-1/2 z-20 w-screen -translate-x-1/2"
      >
        <div className="h-px w-full bg-rangitoto-950/10" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-linear-to-r from-moon-mist-100 to-transparent md:w-64" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-linear-to-l from-moon-mist-100 to-transparent md:w-64" />
      </div>

      <section className="relative z-20 flex w-full justify-end overflow-hidden px-6 pt-4 md:px-[120px] md:pt-0">
        <h2
          ref={line2Ref}
          className="whitespace-nowrap text-right font-heading text-[40px] leading-tight font-normal text-rangitoto-950 md:text-[64px] md:leading-[79px]"
        >
          to go from <span className="font-bold text-black font-satoshi">idea</span> to{" "}
          <span className="font-bold text-black font-satoshi">production</span>
        </h2>
      </section>
    </div>
  );
}
