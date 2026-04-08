"use client";

import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";
import { useEffect, useRef, useState } from "react";
import { EthosCornerAccents } from "../components/EthosCornerAccents";
import { LabHeader } from "../components/LabHeader";
import { HeroAnimation } from "../components/HeroAnimation";
import { HeroSceneProvider, useHeroScene } from "../components/HeroSceneContext";
import { MorphPointCloud } from "../lab5/MorphPointCloud";
import { LeadershipV2Section } from "./leadership/LeadershipV2Section";
import { PortfolioV2Section } from "./portfolio/PortfolioV2Section";

type SwipeCard = {
  id: number;
  title: string;
  order: string;
  description: string;
  iconSrc: string;
  backgroundClass: string;
  textClass: string;
};

const SWIPE_CARDS: SwipeCard[] = [
  {
    id: 1,
    title: "Exponential Foresight",
    order: "01 / 04",
    description:
      "We spot industry trends before they permeate the industry. Transform them into companies that matter. Some call it foresight. We call it pattern recognition at scale.",
    iconSrc:
      "https://worldquant-foundry.files.svdcdn.com/production/images/exponential-foresight-icon.svg?dm=1763974077",
    backgroundClass: "bg-[#111]",
    textClass: "text-[#dadada]",
  },
  {
    id: 2,
    title: "Full-stack support",
    order: "02 / 04",
    description:
      "Brand, marketing, performance, legal, ops, finance, funding, and development. Tech founders need tailored support and a dedicated team from day one.",
    iconSrc:
      "https://worldquant-foundry.files.svdcdn.com/production/images/full-stack-support-icon.svg?dm=1763974134",
    backgroundClass: "bg-[#81a8b8]",
    textClass: "text-[#111]",
  },
  {
    id: 3,
    title: "Financial stability",
    order: "03 / 04",
    description:
      "Breakthrough thinking should not compete with rent. That is why we pay salaries from the start. You focus on building. We handle everything else.",
    iconSrc:
      "https://worldquant-foundry.files.svdcdn.com/production/images/financial-support-icon.svg?dm=1763974167",
    backgroundClass: "bg-[#de794f]",
    textClass: "text-[#111]",
  },
  {
    id: 4,
    title: "Intelligent iteration",
    order: "04 / 04",
    description:
      "Know what you want to build? Start today. No drawn-out program or slow-moving curriculum. Just ruthless focus on product-market fit and market entry.",
    iconSrc:
      "https://worldquant-foundry.files.svdcdn.com/production/images/intelligent-iteration-icon.svg?dm=1763974129",
    backgroundClass: "bg-[#d8d8d8]",
    textClass: "text-[#111]",
  },
];

function V2MorphLayer() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <Canvas camera={{ position: [0, 0, 20], fov: 50 }} gl={{ antialias: true }}>
        <MorphPointCloud />
      </Canvas>
    </div>
  );
}

function V2HeroSection() {
  const { setPageReady } = useHeroScene();

  useEffect(() => {
    setPageReady(true);
  }, [setPageReady]);

  return (
    <div className="relative z-20">
      <V2MorphLayer />
      <HeroAnimation theme="dark" align="split" accountForHeader />
    </div>
  );
}

function V2SwipeSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<HTMLUListElement | null>(null);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      section.style.clipPath = "inset(0 0 0 0)";
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      gsap.from(section, {
        clipPath: "inset(0 100% 0 0)",
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom-=10%",
          end: "top center",
          scrub: 1,
        },
      });

      mm.add("(max-width: 767px)", () => {
        if (!cardsRef.current) return;

        const cards = gsap.utils.toArray<HTMLElement>(cardsRef.current.querySelectorAll("[data-swipe-card]"));
        cards.forEach((card) => {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: "top 50%",
              end: "bottom bottom",
            },
            clipPath: "inset(0 0 100% 0)",
            duration: 0.6,
            ease: "power3.inOut",
          });
        });
      });
    }, section);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 min-h-screen overflow-hidden rounded-t-[20px] bg-[#dadada] px-4 pt-[120px] pb-[200px] text-[#111] md:px-10 md:py-[220px]"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-x-12 lg:gap-x-20">
          <div className="flex flex-col gap-6">
            <p className="font-satoshi text-[0.688rem] uppercase tracking-[0.12em] text-[#111]">
              Our ethos
            </p>
            <h2 className="font-satoshi text-2xl font-bold uppercase leading-[1.05] tracking-tight text-[#111]">
              Vision matters.
              <br />
              Velocity wins.
            </h2>
          </div>
          <div className="flex flex-col items-start gap-10 md:max-w-xl md:justify-self-end lg:max-w-none">
            <p className="font-clash-display leading-relaxed text-[#111]">
              Our comprehensive founder platform shifts the odds. With infrastructure that works. With
              experts who&apos;ve been there. With the right pressure—pushing you forward, not under.
              This isn&apos;t an accelerator. It&apos;s complete company building, at the speed deep tech
              demands.
            </p>
            <button
              type="button"
              className="relative isolate inline-flex h-10 items-center justify-center px-5 font-satoshi text-[0.75rem] uppercase tracking-wide text-[#111]"
              aria-label="Join us"
            >
              <EthosCornerAccents className="text-[#111]" />
              Join us
            </button>
          </div>
        </div>

        <ul ref={cardsRef} className="mt-10 flex flex-col gap-5 md:mt-[60px] md:flex-row md:gap-0">
          {SWIPE_CARDS.map((card) => {
            const isActive = activeCard === card.id;
            const widthClass =
              activeCard === null ? "md:w-[25%]" : isActive ? "md:w-[40%]" : "md:w-[20%]";
            const panelWidthClass = isActive ? "md:w-full" : "md:w-[125%]";

            return (
              <li
                key={card.id}
                data-swipe-card
                className={`w-full shrink-0 transition-[width] delay-100 duration-500 ease-[cubic-bezier(0.65,0.05,0.36,1)] ${widthClass}`}
                onMouseEnter={() => setActiveCard(card.id)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <article
                  id={`ethos-card-${card.id}`}
                  className={`relative h-full w-full overflow-hidden rounded-[20px] transition-all delay-100 duration-500 ease-[cubic-bezier(0.65,0.05,0.36,1)] ${panelWidthClass} ${card.backgroundClass} ${card.textClass}`}
                >
                  <div className="flex size-full justify-center px-5 pt-10 pb-5 md:py-10">
                    <div className="flex w-full flex-col items-center gap-[22px] text-center md:max-w-[300px] md:gap-[44px]">
                      <button
                        type="button"
                        className="hidden md:block"
                        onClick={() => setActiveCard(card.id)}
                        aria-expanded={activeCard === card.id}
                        aria-controls={`ethos-card-${card.id}`}
                      >
                        <h3 className="font-satoshi text-2xl font-bold uppercase leading-[1.05] tracking-tight">
                          {card.title}
                        </h3>
                      </button>

                      <h3 className="font-satoshi text-2xl font-bold uppercase leading-[1.05] tracking-tight md:hidden">
                        {card.title}
                      </h3>

                      <div className="flex h-[220px] w-full items-center justify-center md:h-[300px]">
                        {/* eslint-disable-next-line @next/next/no-img-element -- External SVG assets are decorative and loaded from the source site. */}
                        <img
                          className="h-full w-auto object-contain object-center"
                          src={card.iconSrc}
                          width={2000}
                          height={2000}
                          alt=""
                          loading="lazy"
                          decoding="async"
                        />
                      </div>

                      <div className="flex flex-col gap-[15px]">
                        <p className="font-satoshi text-[0.688rem] uppercase tracking-[0.12em]">{card.order}</p>
                        <p className="font-clash-display text-[0.95rem] leading-relaxed">{card.description}</p>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default function V2Page() {
  const smootherRef = useRef<ReturnType<typeof ScrollSmoother.create> | null>(null);

  useEffect(() => {
    if (smootherRef.current) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    smootherRef.current = ScrollSmoother.create({
      smooth: 1,
      effects: true,
      smoothTouch: 0.1,
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
    });

    return () => {
      smootherRef.current?.kill();
      smootherRef.current = null;
    };
  }, []);

  return (
    <HeroSceneProvider>
      <div className="pointer-events-none fixed inset-0 z-0 bg-[#111]" />

      <div className="relative z-60 pointer-events-auto text-[#e7e7e7]">
        <LabHeader />
      </div>

      <div id="smooth-wrapper" className="relative z-0">
        <div id="smooth-content">
          <div className="relative z-10 min-h-[300vh] text-[#e7e7e7]">
            <V2HeroSection />

            <V2SwipeSection />
            <PortfolioV2Section />
            <LeadershipV2Section />
          </div>
        </div>
      </div>
    </HeroSceneProvider>
  );
}
