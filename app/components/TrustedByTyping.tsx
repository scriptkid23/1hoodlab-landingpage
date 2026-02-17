"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

const PARTNERS = ["Web3", "artbase", "dApps", "Snipers"];

export function TrustedByTyping() {
  const rootRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.6 });

      PARTNERS.forEach((word, index) => {
        const target = textRefs.current[index];
        if (!target) return;

        target.textContent = "";
        const state = { count: 0 };

        tl.to(state, {
          count: word.length,
          duration: Math.max(0.28, word.length * 0.08),
          ease: "none",
          snap: "count",
          onUpdate: () => {
            target.textContent = word.slice(0, state.count);
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <aside
      ref={rootRef}
      className="absolute bottom-8 right-0 px-6 md:bottom-[34px] md:right-[120px] md:px-0"
    >
      <p className="mb-2 w-[100px] font-satoshi text-[22px] font-normal leading-[30px] text-rangitoto-950">
        Trusted by
      </p>
      <div className="flex flex-wrap items-center justify-end gap-6 font-satoshi text-[18px] font-normal leading-[24px] text-black md:justify-end">
        {PARTNERS.map((partner, index) => (
          <span key={partner} className="inline-flex items-center">
            <span className="mr-3 inline-block h-[16px] w-[6px] bg-black" />
            <span className="relative inline-block whitespace-nowrap">
              <span className="invisible">{partner}</span>
              <span
                ref={(el) => {
                  textRefs.current[index] = el;
                }}
                className="absolute inset-0"
              />
            </span>
          </span>
        ))}
      </div>
    </aside>
  );
}
