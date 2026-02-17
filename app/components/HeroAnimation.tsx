"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { useHeroScene } from "./HeroSceneContext";

export function HeroAnimation() {
  const { setModelVisible, setScrollProgress } = useHeroScene();
  const wrapRef = useRef<HTMLDivElement>(null);
  const techRef = useRef<HTMLParagraphElement>(null);
  const line1Ref = useRef<HTMLHeadingElement>(null);
  const line2Ref = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    setModelVisible(false);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      // Technology label enters from top.
      tl.from(techRef.current, {
        y: -20,
        autoAlpha: 0,
        duration: 0.5,
      });

      // Headings and divider animate together without stagger.
      tl.from(line1Ref.current, {
        y: -48,
        autoAlpha: 0,
        duration: 0.6,
      });
      tl.from(
        line2Ref.current,
        { y: 48, autoAlpha: 0, duration: 0.6 },
        "<"
      );
      tl.from(
        lineRef.current,
        {
          scaleX: 0,
          autoAlpha: 0,
          duration: 0.4,
          transformOrigin: "center",
        },
        "<"
      );

      tl.call(() => setModelVisible(true), [], "+=0.05");
    }, wrapRef);

    return () => {
      setModelVisible(false);
      ctx.revert();
    };
  }, [setModelVisible]);

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      const hero = wrapRef.current;
      if (!hero) return;
      const viewportHeight = window.innerHeight || 1;
      const testSection = document.getElementById("scroll-test-section");
      const scrollY = window.scrollY || window.pageYOffset;
      const heroStart = hero.offsetTop;
      const targetY = testSection
        ? testSection.offsetTop + testSection.offsetHeight * 0.5 - viewportHeight * 0.5
        : heroStart + viewportHeight;
      const progress = Math.min(
        Math.max((scrollY - heroStart) / Math.max(targetY - heroStart, 1), 0),
        1
      );
      setScrollProgress(progress);
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
    };
  }, [setScrollProgress]);

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
