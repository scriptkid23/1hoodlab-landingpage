"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

const NAV_LINKS = [
  { label: "WHY WQF", href: "#why-wqf" },
  { label: "PORTFOLIO", href: "#portfolio" },
  { label: "TEAM", href: "#team" },
  { label: "INSIGHTS", href: "#insights" },
  { label: "Contact", href: "#contact" },
];

function CornerAccentSVG({ className }: { className?: string }) {
  return (
    <svg
      className={`size-[9px] corner-accent ${className ?? ""}`}
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.499951 0.199996L0.499952 9.2M0.199951 0.499995L9.19995 0.499995"
        stroke="currentColor"
      />
    </svg>
  );
}

export function LabHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const scrollThreshold = 50;

  // Hover indicator state for desktop nav
  const [hoverWidth, setHoverWidth] = useState(0);
  const [hoverOffset, setHoverOffset] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const handleScroll = useCallback(() => {
    if (mobileMenuOpen) return;

    const currentScrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const pastQuarterViewport = currentScrollY > windowHeight / 4;
    const pastFullViewport = currentScrollY > windowHeight;

    const scrollDelta = currentScrollY - lastScrollY.current;
    const scrollingDown = scrollDelta > scrollThreshold;
    const scrollingUp = scrollDelta < -scrollThreshold;

    setScrolled(pastQuarterViewport);

    if (pastFullViewport) {
      if (scrollingDown) {
        setHidden(true);
      } else if (scrollingUp) {
        setHidden(false);
      }
    } else {
      setHidden(false);
    }

    if (Math.abs(scrollDelta) > scrollThreshold) {
      lastScrollY.current = currentScrollY;
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (mobileMenuOpen && window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const headerClasses = [
    "group fixed top-0 isolate z-50 flex w-full items-center transition-transform duration-400 lg:h-[var(--header-height)] lg:overflow-hidden",
    scrolled ? "-scrolled" : "",
    mobileMenuOpen ? "-mobile-menu-open" : "",
    hidden ? "-translate-y-full" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header
      className={headerClasses}
      style={{ transitionTimingFunction: "var(--easing)" }}
    >
      <div className="flex w-full lg:container lg:mx-auto">
        <div
          className={[
            "relative isolate mx-auto flex h-[var(--header-height)] w-fit grow items-center justify-between gap-[20px] bg-transparent px-[10px] transition-all duration-600",
            "lg:h-auto lg:px-0",
            scrolled
              ? "lg:w-fit lg:grow-0 lg:rounded-[8px] lg:bg-[#1b1b1b] lg:px-[12px] lg:py-[4px]"
              : "",
            mobileMenuOpen ? "bg-[#111]" : "",
            scrolled && !mobileMenuOpen ? "" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ transitionTimingFunction: "var(--easing)" }}
        >
          {/* Logo */}
          <a
            href="/"
            className={[
              "relative isolate h-[30px] shrink-0 overflow-hidden transition-[width] duration-600",
              scrolled ? "w-[30px]" : "w-[120px]",
            ].join(" ")}
            style={{ transitionTimingFunction: "var(--easing)" }}
            aria-label="1hoodlabs"
          >
            {/* Full logo */}
            <Image
              src="/assets/brands/brand.svg"
              alt="1hoodlabs"
              width={120}
              height={29}
              className={[
                "h-auto w-full transition-transform duration-600",
                scrolled ? "-translate-y-full" : "",
              ].join(" ")}
              style={{ transitionTimingFunction: "var(--easing)" }}
              priority
            />
            {/* Icon-only logo (shown when scrolled) */}
            <Image
              src="/assets/brands/logo-white.svg"
              alt="1hoodlabs"
              width={20}
              height={20}
              className={[
                "absolute top-0 left-0 h-auto w-[20px] transition-transform duration-600",
                scrolled ? "translate-y-0" : "translate-y-[30px]",
              ].join(" ")}
              style={{ transitionTimingFunction: "var(--easing)" }}
            />
          </a>

          {/* Desktop Nav */}
          <nav
            className="group/links relative isolate hidden lg:block"
            onMouseLeave={() => setIsHovering(false)}
          >
            <ul className="flex items-center">
              {NAV_LINKS.map((link) => (
                <li
                  key={link.label}
                  onMouseEnter={(e) => {
                    const li = e.currentTarget;
                    setHoverWidth(li.offsetWidth);
                    setHoverOffset(li.offsetLeft);
                    setIsHovering(true);
                  }}
                >
                  <a
                    href={link.href}
                    className="group/link relative isolate"
                    style={{
                      animation: undefined,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.animation =
                        "glitch-hover 0.3s linear";
                    }}
                    onAnimationEnd={(e) => {
                      e.currentTarget.style.animation = "";
                    }}
                  >
                    <div className="flex h-[40px] items-center px-[20px]">
                      {/* Glowing dot */}
                      <div
                        className="size-[10px] -translate-x-[24px] rounded-[3px] bg-[#dadada] opacity-0 blur-[20px] transition-all duration-400 group-hover/link:-translate-x-[5px] group-hover/link:opacity-100 group-hover/link:blur-[0px]"
                        style={{
                          transitionTimingFunction: "var(--easing)",
                        }}
                      />
                      {/* Text with slide-up effect */}
                      <div
                        className="relative isolate flex overflow-hidden -translate-x-[5px] transition-transform duration-400 group-hover/link:translate-x-[5px]"
                        style={{
                          fontFamily: '"Azeret Mono", monospace',
                          fontSize: "0.75rem",
                          lineHeight: "0.938rem",
                          textTransform: "uppercase",
                          transitionTimingFunction: "var(--easing)",
                        }}
                      >
                        <span
                          className="transition-transform duration-400 group-hover/link:-translate-y-full"
                          style={{
                            transitionTimingFunction: "var(--easing)",
                          }}
                        >
                          {link.label}
                        </span>
                        <span
                          className="absolute inset-0 translate-y-full transition-transform duration-400 group-hover/link:translate-y-0"
                          style={{
                            transitionTimingFunction: "var(--easing)",
                          }}
                          aria-hidden
                        >
                          {link.label}
                        </span>
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>

            {/* Hover indicator with corner accents */}
            <div
              className="pointer-events-none absolute top-0 left-0 h-full transition-[width,left,opacity] duration-400"
              style={{
                width: `${hoverWidth}px`,
                left: `${hoverOffset}px`,
                opacity: isHovering ? 0.4 : 0,
                transitionTimingFunction: "var(--easing)",
              }}
            >
              <CornerAccentSVG className="transition-opacity duration-400" />
              <CornerAccentSVG className="transition-opacity duration-400" />
              <CornerAccentSVG className="transition-opacity duration-400" />
              <CornerAccentSVG className="transition-opacity duration-400" />
            </div>
          </nav>

          {/* Mobile menu button */}
          <button
            className="relative isolate flex size-[40px] items-center justify-center lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            <div className="size-[10px] rounded-[3px] bg-[#dadada]" />
            <CornerAccentSVG
              className={`opacity-40 transition-transform duration-400 ${mobileMenuOpen ? "rotate-180" : ""}`}
            />
            <CornerAccentSVG
              className={`opacity-40 transition-transform duration-400 ${mobileMenuOpen ? "rotate-180" : ""}`}
            />
            <CornerAccentSVG
              className={`opacity-40 transition-transform duration-400 ${mobileMenuOpen ? "rotate-180" : ""}`}
            />
            <CornerAccentSVG
              className={`opacity-40 transition-transform duration-400 ${mobileMenuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Mobile menu overlay */}
          {mobileMenuOpen && (
            <div
              className="absolute top-full left-0 h-[calc(100dvh-var(--header-height))] w-full bg-[#111111]/1 backdrop-blur-[10px] lg:hidden"
              style={{
                animation: "fadeIn 400ms ease forwards",
              }}
            >
              <ul
                className="grid grid-cols-2 border-b border-[#e7e7e7]/20 bg-[#111] px-[10px] py-[12px]"
                style={{
                  animation: "clipReveal 400ms var(--easing) 100ms both",
                }}
              >
                {NAV_LINKS.filter((l) => l.label !== "Contact").map((link) => (
                  <li key={link.label} className="relative isolate">
                    <a
                      className="w-full text-center"
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="flex h-[60px] items-center justify-center text-center">
                        <span
                          style={{
                            fontFamily: '"Azeret Mono", monospace',
                            fontSize: "0.688rem",
                            lineHeight: "130%",
                            textTransform: "uppercase",
                          }}
                        >
                          {link.label}
                        </span>
                      </div>
                    </a>
                    <CornerAccentSVG className="opacity-40 duration-400" />
                    <CornerAccentSVG className="opacity-40 duration-400" />
                    <CornerAccentSVG className="opacity-40 duration-400" />
                    <CornerAccentSVG className="opacity-40 duration-400" />
                  </li>
                ))}
                {/* Contact - full width */}
                <li className="relative isolate col-span-2 mt-[24px]">
                  <a
                    className="w-full text-center"
                    href="#contact"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex h-[60px] items-center justify-center text-center">
                      <span
                        style={{
                          fontFamily: '"Azeret Mono", monospace',
                          fontSize: "0.688rem",
                          lineHeight: "130%",
                          textTransform: "uppercase",
                        }}
                      >
                        Contact
                      </span>
                    </div>
                  </a>
                  <CornerAccentSVG className="opacity-40 duration-400" />
                  <CornerAccentSVG className="opacity-40 duration-400" />
                  <CornerAccentSVG className="opacity-40 duration-400" />
                  <CornerAccentSVG className="opacity-40 duration-400" />
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
