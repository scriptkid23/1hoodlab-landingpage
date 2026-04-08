"use client";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { Swiper as SwiperClass } from "swiper";
import { Mousewheel } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { ComponentType, CSSProperties } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { EthosCornerAccents } from "../../components/EthosCornerAccents";
import {
  LogoAlphaDeal,
  LogoEdda,
  LogoNovyra,
  LogoRemixLabs,
  LogoStratahub,
  LogoUSAutonomousSystems,
} from "./PortfolioLogos";

import "swiper/css";

type PortfolioCard = {
  title: string;
  description: string;
  websiteUrl?: string;
  hoverBackgroundColor: string;
  hoverLogoColor: string;
  Logo: ComponentType<{ className?: string }>;
};

const PORTFOLIO_CARDS: PortfolioCard[] = [
  {
    title: "Alpha Deal",
    description: "Private asset analysis, reimagined.",
    websiteUrl: "https://www.alphadeal.ai/",
    hoverBackgroundColor: "#1c412e",
    hoverLogoColor: "#dadada",
    Logo: LogoAlphaDeal,
  },
  {
    title: "Edda",
    description: "A better, social-first, audio book streaming platform.",
    websiteUrl: "https://joinedda.com/",
    hoverBackgroundColor: "#5640ff",
    hoverLogoColor: "#dadada",
    Logo: LogoEdda,
  },
  {
    title: "Novyra",
    description: "Precision matching for clinical oncology trials.",
    websiteUrl: "https://novyra.ai/",
    hoverBackgroundColor: "#fffebe",
    hoverLogoColor: "#111111",
    Logo: LogoNovyra,
  },
  {
    title: "Stratahub",
    description:
      "AI-readiness hub that transforms fragmented, raw enterprise data into a structured, actionable form.",
    websiteUrl: "https://stratahub.com/",
    hoverBackgroundColor: "#0000f7",
    hoverLogoColor: "#dadada",
    Logo: LogoStratahub,
  },
  {
    title: "Remix Labs",
    description: "Advanced time series modeling for tomorrow’s data flows.",
    websiteUrl: "https://remixlabs.ai/",
    hoverBackgroundColor: "#e5ff56",
    hoverLogoColor: "#111111",
    Logo: LogoRemixLabs,
  },
  {
    title: "US Autonomous Systems",
    description: "American-made drone accessories for frontline rescue and law enforcement.",
    hoverBackgroundColor: "#090909",
    hoverLogoColor: "#dadada",
    Logo: LogoUSAutonomousSystems,
  },
];

const TAGLINE =
  "Our companies don't just enter markets. They define them.";

function PortfolioTaglineReveal() {
  const ref = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      el.textContent = TAGLINE;
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const words = TAGLINE.split(" ");
    el.innerHTML = words
      .map(
        (w) =>
          `<span class="inline-block overflow-hidden align-baseline"><span class="inline-block">${w}</span></span>`,
      )
      .join(" ");

    const innerSpans = el.querySelectorAll<HTMLElement>("span > span");
    gsap.set(innerSpans, { yPercent: 100 });
    const ctx = gsap.context(() => {
      gsap.to(innerSpans, {
        yPercent: 0,
        duration: 0.9,
        stagger: 0.035,
        ease: "power4.out",
        scrollTrigger: {
          trigger: el,
          start: "top 82%",
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <p
      ref={ref}
      className="mb-[24px] min-h-[3rem] font-satoshi text-[clamp(1.6rem,3.2vw,2.4rem)] uppercase leading-[1.05] text-balance md:mb-[32px]"
      suppressHydrationWarning
    />
  );
}

function PortfolioWebsiteLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      className="group/button relative isolate block hover:[animation:glitch-hover_0.45s_ease-in-out] motion-reduce:hover:[animation:none]"
      data-theme="dark"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      <div className="flex h-[40px] items-center justify-center px-[20px]">
        <div className="button--dot group-data-[theme=dark]/button:bg-[#111] motion-reduce:blur-0 size-[10px] -translate-x-[24px] rounded-[3px] opacity-0 blur-[20px] transition-all duration-400 ease-(--easing) group-hover/button:-translate-x-[5px] group-hover/button:opacity-100 group-hover/button:blur-0 group-active/button:-translate-x-[5px] group-active/button:opacity-100 group-active/button:blur-0 motion-reduce:hidden motion-reduce:translate-x-0 motion-reduce:opacity-0 motion-reduce:group-hover/button:translate-x-0 motion-reduce:group-hover/button:opacity-0" />
        <div className="relative isolate flex -translate-x-[5px] overflow-hidden font-mono text-[0.75rem] uppercase tracking-[0.12em] text-[#111] transition-transform duration-400 ease-(--easing) group-hover/button:translate-x-[5px] group-active/button:translate-x-[5px] motion-reduce:translate-x-0 motion-reduce:group-hover/button:translate-x-0">
          <span className="transition-transform duration-400 ease-(--easing) group-hover/button:-translate-y-full group-active/button:-translate-y-full motion-reduce:translate-y-0 motion-reduce:group-hover/button:translate-y-0">
            Website
          </span>
          <span
            className="absolute inset-0 translate-y-full transition-transform duration-400 ease-(--easing) group-hover/button:translate-y-0 group-active/button:translate-y-0 motion-reduce:hidden"
            aria-hidden="true"
          >
            Website
          </span>
        </div>
      </div>
      <EthosCornerAccents className="size-[9px] text-[#111] transition-opacity duration-400 ease-(--easing) group-active/button:opacity-100 motion-reduce:opacity-100 motion-reduce:transition-none" />
    </a>
  );
}

function ArrowPrevIcon() {
  return (
    <svg className="size-[18px]" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M10.0833 13H8.01667L4 9.02474L8.01667 5H10.0833L8.38333 6.69897L6.56667 8.38144L9.08333 8.29897H14V9.75052H9.08333L6.58333 9.66804L8.43333 11.367L10.0833 13Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ArrowNextIcon() {
  return (
    <svg className="size-[18px]" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M7.91667 13H9.98333L14 9.02474L9.98333 5H7.91667L9.61667 6.69897L11.4333 8.38144L8.91667 8.29897H4V9.75052H8.91667L11.4167 9.66804L9.56667 11.367L7.91667 13Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PortfolioV2Section() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const swiperRef = useRef<SwiperClass | null>(null);
  const [nav, setNav] = useState({ isBeginning: true, isEnd: false });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      content.style.opacity = "1";
      content.style.transform = "translateY(0)";
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(content, {
        opacity: 0,
        y: 80,
        duration: 1.2,
        ease: "power4.inOut",
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
        },
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  const syncNav = (sw: SwiperClass) => {
    setNav({ isBeginning: sw.isBeginning, isEnd: sw.isEnd });
    setActiveIndex(sw.activeIndex);
  };

  return (
    <section
      ref={sectionRef}
      className="relative z-10 overflow-hidden bg-[#dadada] pt-[170px] pb-[120px] text-[#111] md:pb-[200px]"
    >
      <div ref={contentRef} className="@container mx-auto w-full max-w-[1440px] px-4 md:px-10" id="portfolio">
        <div className="mx-auto mb-[80px] flex max-w-[668px] flex-col items-center gap-[15px] text-center md:mb-[100px]">
          <h2 className="font-satoshi text-[0.688rem] uppercase tracking-[0.12em]">Our portfolio</h2>
          <PortfolioTaglineReveal />

          <a
            className="group/button relative isolate block hover:[animation:glitch-hover_0.45s_ease-in-out] motion-reduce:hover:[animation:none]"
            data-theme="dark"
            aria-label="Explore our portfolio"
            href="https://www.worldquantfoundry.com/portfolio"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex h-[40px] items-center justify-center px-[20px]">
              <div className="button--dot group-data-[theme=dark]/button:bg-[#111] motion-reduce:blur-0 size-[10px] -translate-x-[24px] rounded-[3px] opacity-0 blur-[20px] transition-all duration-400 ease-(--easing) group-hover/button:-translate-x-[5px] group-hover/button:opacity-100 group-hover/button:blur-0 group-active/button:-translate-x-[5px] group-active/button:opacity-100 group-active/button:blur-0 motion-reduce:hidden motion-reduce:translate-x-0 motion-reduce:opacity-0 motion-reduce:group-hover/button:translate-x-0 motion-reduce:group-hover/button:opacity-0" />
              <div className="relative isolate flex -translate-x-[5px] overflow-hidden font-mono text-[0.75rem] uppercase tracking-[0.12em] text-[#111] transition-transform duration-400 ease-(--easing) group-hover/button:translate-x-[5px] group-active/button:translate-x-[5px] motion-reduce:translate-x-0 motion-reduce:group-hover/button:translate-x-0">
                <span className="transition-transform duration-400 ease-(--easing) group-hover/button:-translate-y-full group-active/button:-translate-y-full motion-reduce:translate-y-0 motion-reduce:group-hover/button:translate-y-0">
                  Explore our portfolio
                </span>
                <span
                  className="absolute inset-0 translate-y-full transition-transform duration-400 ease-(--easing) group-hover/button:translate-y-0 group-active/button:translate-y-0 motion-reduce:hidden"
                  aria-hidden="true"
                >
                  Explore our portfolio
                </span>
              </div>
            </div>
            <EthosCornerAccents className="size-[9px] text-[#111] transition-opacity duration-400 ease-(--easing) group-active/button:opacity-100 motion-reduce:opacity-100 motion-reduce:transition-none" />
          </a>
        </div>

        <div>
          <Swiper
            className="overflow-visible! [&_.swiper-wrapper]:min-h-[89.60cqw] [&_.swiper-wrapper]:items-center [&_.swiper-wrapper]:duration-400! md:[&_.swiper-wrapper]:min-h-[53.94cqw] lg:[&_.swiper-wrapper]:min-h-[32.36cqw]"
            modules={[Mousewheel]}
            centeredSlides
            slidesPerView="auto"
            speed={500}
            slideToClickedSlide
            mousewheel={{ forceToAxis: true, releaseOnEdges: true }}
            longSwipesRatio={0.15}
            longSwipesMs={250}
            threshold={3}
            resistanceRatio={0.5}
            touchRatio={1.2}
            breakpoints={{
              768: {
                longSwipesRatio: 0.15,
                longSwipesMs: 250,
                threshold: 3,
                resistanceRatio: 0.2,
                touchRatio: 1.1,
              },
            }}
            onSwiper={(sw) => {
              swiperRef.current = sw;
              syncNav(sw);
            }}
            onSlideChange={syncNav}
          >
            {PORTFOLIO_CARDS.map((card) => (
              <SwiperSlide key={card.title} className="group w-auto!">
                <div
                  className="before:bg-black-100 relative isolate flex h-[34.80cqw] w-[50.40cqw] flex-col items-center justify-center gap-[20px] overflow-hidden rounded-none p-0 text-center text-[#111] opacity-40 transition-[padding,width,height,border-radius,opacity,color] duration-300 ease-(--easing) group-[.swiper-slide-active]:h-[89.60cqw] group-[.swiper-slide-active]:w-[67.20cqw] group-[.swiper-slide-active]:rounded-[20px] group-[.swiper-slide-active]:p-[24px] group-[.swiper-slide-active]:opacity-100 before:absolute before:inset-0 before:-z-1 before:size-full before:transition-[clip-path,background-color] before:delay-100 before:duration-300 before:ease-(--easing) before:[clip-path:inset(0_0_100%_0)] group-[.swiper-slide-active]:before:[clip-path:inset(0_0_0_0)] group-[.swiper-slide-active]:hover:text-(--hover-logo-color) group-[.swiper-slide-active]:hover:[&_path]:fill-(--hover-logo-color) group-[.swiper-slide-active]:hover:before:bg-(--hover-background-color) max-md:group-[.swiper-slide-active]:text-(--hover-logo-color) max-md:group-[.swiper-slide-active]:before:bg-(--hover-background-color) max-md:group-[.swiper-slide-active]:[&_path]:fill-(--hover-logo-color) md:h-[25.47cqw] md:w-[34.72cqw] md:group-[.swiper-slide-active]:h-[53.94cqw] md:group-[.swiper-slide-active]:w-[40.52cqw] lg:h-[24cqw] lg:w-[20.83cqw] lg:group-[.swiper-slide-active]:h-[32.36cqw] lg:group-[.swiper-slide-active]:w-[34.31cqw] xl:gap-[40px] xl:group-[.swiper-slide-active]:w-[24.31cqw] [&_path]:transition-[fill] [&_path]:duration-300 [&_path]:ease-(--easing)"
                  style={
                    {
                      "--hover-background-color": card.hoverBackgroundColor,
                      "--hover-logo-color": card.hoverLogoColor,
                    } as CSSProperties
                  }
                >
                  <div className="max-w-[270px] px-[40px] md:px-0 lg:pt-[20px] lg:opacity-0 lg:group-[.swiper-slide-active]:opacity-100 xl:pt-[36px] xl:opacity-100">
                    <button
                      type="button"
                      className="pointer-events-none cursor-none font-satoshi text-[clamp(1rem,2vw,1.25rem)] font-semibold uppercase md:text-[1.35rem]"
                      tabIndex={-1}
                      aria-label={`View ${card.title}`}
                    >
                      {card.title}
                    </button>
                  </div>

                  <div className="size-[80px] text-[#111] [&_path]:transition-[fill] [&_path]:duration-300 [&_path]:ease-(--easing)">
                    <card.Logo className="size-full object-contain" />
                  </div>

                  <div className="grid h-full w-full grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-(--easing) group-[.swiper-slide-active]:grid-rows-[1fr] md:grid-rows-[auto_0fr] md:group-[.swiper-slide-active]:grid-rows-[auto_1fr]">
                    <div className="flex flex-col items-center justify-center gap-[20px] overflow-hidden">
                      <p className="mx-auto mb-auto w-[67.20cqw] max-w-full shrink-0 pt-[15px] font-mono text-[0.7rem] uppercase leading-snug text-balance opacity-0 group-[.swiper-slide-active]:opacity-60 md:w-[40.52cqw] lg:w-[24.31cqw] xl:max-w-[222px] xl:px-[20px]">
                        {card.description}
                      </p>
                    </div>
                    <div className="mt-auto opacity-0 transition group-[.swiper-slide-active]:opacity-100 group-hover:[&_.button--dot]:bg-[currentColor]!">
                      {card.websiteUrl ? (
                        <PortfolioWebsiteLink
                          href={card.websiteUrl}
                          label={`Visit the website of ${card.title}`}
                        />
                      ) : null}
                    </div>
                  </div>

                  <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-[24px] opacity-0 transition group-[.swiper-slide-active]:opacity-100">
                    <div className="size-[9px] border-t border-l border-current" />
                    <div className="size-[9px] border-t border-r border-current" />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="mt-[80px] flex items-center justify-between md:mt-[100px] md:justify-center md:gap-[32px]">
            <button
              type="button"
              className="button -arrow text-[#111] disabled:opacity-50"
              aria-label="Previous"
              disabled={nav.isBeginning}
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <ArrowPrevIcon />
            </button>
            <p className="font-mono text-[0.75rem] uppercase tracking-[0.12em] md:hidden">
              {String(activeIndex + 1).padStart(2, "0")} / {String(PORTFOLIO_CARDS.length).padStart(2, "0")}
            </p>
            <button
              type="button"
              className="button -arrow text-[#111] disabled:opacity-50"
              aria-label="Next"
              disabled={nav.isEnd}
              onClick={() => swiperRef.current?.slideNext()}
            >
              <ArrowNextIcon />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
