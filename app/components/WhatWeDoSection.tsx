"use client";

import { useEffect, useRef, useState } from "react";

const serviceItems = [
  {
    title: "Product Design",
    description: "UX audits, wireframes, UI systems, prototypes that convert.",
  },
  {
    title: "App Development",
    description: "Web and mobile apps with production-grade architecture.",
  },
  {
    title: "Blockchain Engineering",
    description: "Smart contracts, wallets, integrations, hybrid systems.",
  },
  {
    title: "AI Enablement",
    description: "LLM features, automation, retrieval, data pipelines.",
  },
];

type TypeFadeTextProps = {
  text: string;
  isVisible: boolean;
  className?: string;
  startDelay?: number;
  charDelay?: number;
};

function TypeFadeText({
  text,
  isVisible,
  className = "",
  startDelay = 0,
  charDelay = 16,
}: TypeFadeTextProps) {
  return (
    <span aria-label={text} className={`inline whitespace-pre-wrap ${className}`}>
      {text.split("").map((char, index) => {
        const visibleState = isVisible
          ? "translate-y-0 opacity-100 blur-0"
          : "translate-y-1.5 opacity-0 blur-[2px]";

        return (
          <span
            key={`${char}-${index}`}
            aria-hidden
            className={`inline-block transition-all duration-500 ease-out ${visibleState}`}
            style={{ transitionDelay: `${startDelay + index * charDelay}ms` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
    </span>
  );
}

export function WhatWeDoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const target = sectionRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      {
        // Trigger later so text starts when model is close to final framing.
        threshold: 0.55,
        rootMargin: "0px 0px -12% 0px",
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="section-2"
      ref={sectionRef}
      className="relative z-10 min-h-screen w-full px-6 md:px-[120px]"
    >
      <div className="mx-auto grid min-h-screen w-full max-w-[1200px] items-center gap-8 md:grid-cols-2">
        <div aria-hidden className="hidden min-h-[380px] md:block" />

        <div className="w-full md:ml-auto md:max-w-[540px]">
          <p className="text-xs font-medium tracking-[0.2em] text-rangitoto-950/55 uppercase">
            <TypeFadeText text="What we do" isVisible={isVisible} startDelay={20} charDelay={18} />
          </p>

          <h2 className="mt-3 font-heading text-3xl leading-tight text-rangitoto-950 md:text-5xl">
            <TypeFadeText
              text="Build, ship, and scale digital products"
              isVisible={isVisible}
              startDelay={140}
              charDelay={18}
            />
          </h2>

          <p className="mt-3 text-sm text-rangitoto-950/70 md:text-base">
            <TypeFadeText
              text="End-to-end product delivery: strategy, design, engineering, and launch."
              isVisible={isVisible}
              startDelay={360}
              charDelay={12}
            />
          </p>

          <ul className="mt-6 space-y-3 md:mt-7">
            {serviceItems.map((item, index) => (
              <li
                key={item.title}
                className="border-b border-rangitoto-950/12 pb-3 text-rangitoto-950"
              >
                <p className="text-base font-semibold md:text-lg">
                  <TypeFadeText
                    text={item.title}
                    isVisible={isVisible}
                    startDelay={620 + index * 200}
                    charDelay={14}
                  />
                </p>
                <p className="mt-1 text-sm text-rangitoto-950/72">
                  <TypeFadeText
                    text={item.description}
                    isVisible={isVisible}
                    startDelay={700 + index * 200}
                    charDelay={10}
                  />
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
