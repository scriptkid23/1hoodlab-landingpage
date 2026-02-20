"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LINE_1 = "Built for";
const LINE_2 = "scale and reliability";

export function TechStackSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    if (!section || !line1 || !line2) return;

    const targets = [line1, line2];
    gsap.set(targets, { yPercent: -100 });

    const anim = gsap.to(targets, {
      yPercent: 0,
      duration: 1,
      ease: "power4.out",
      stagger: 0.12,
      scrollTrigger: {
        trigger: section,
        start: "top 40%",
        toggleActions: "play none none none",
      },
    });

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, []);

  return (
    <section
      id="section-3"
      ref={sectionRef}
      className="relative z-10 flex min-h-screen w-full flex-col items-center px-6 md:px-[120px]"
    >
      <div className="mx-auto flex w-full flex-col items-center gap-12 md:gap-16">
        {/* Line 1: Built for | Line 2: scale and reliability */}
        <div className="flex w-full flex-col items-center text-center">
          <h2
            className="mt-3 flex flex-col items-center font-heading text-9xl font-bold uppercase leading-tight text-black"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.3) 100%)",
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.3) 100%)",
            }}
          >
            <span className="inline-block overflow-hidden">
              <span ref={line1Ref} className="inline-block">
                {LINE_1}
              </span>
            </span>
            <span className="inline-block overflow-hidden">
              <span ref={line2Ref} className="inline-block">
                {LINE_2}
              </span>
            </span>
          </h2>
        </div>
      </div>
    </section>
  );
}
