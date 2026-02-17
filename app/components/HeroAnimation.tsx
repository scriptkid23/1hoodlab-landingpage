"use client";

import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";

export function HeroAnimation() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const techRef = useRef<HTMLParagraphElement>(null);
  const line1Ref = useRef<HTMLHeadingElement>(null);
  const line2Ref = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      // Technology label: from above
      tl.from(techRef.current, {
        y: -20,
        autoAlpha: 0,
        duration: 0.5,
      });

      // Both lines + divider at the same time: line1 đổ xuống, line2 đổ lên (whole block, no stagger)
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
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="flex min-h-screen flex-col items-center justify-center"
    >
      <section className="w-full px-6 md:px-[120px]">
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
        className="relative left-1/2 w-screen -translate-x-1/2"
      >
        <div className="h-px w-full bg-rangitoto-950/10" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-linear-to-r from-moon-mist-100 to-transparent md:w-64" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-linear-to-l from-moon-mist-100 to-transparent md:w-64" />
      </div>

      <section className="flex w-full justify-end overflow-hidden px-6 pt-4 md:px-[120px] md:pt-0">
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
