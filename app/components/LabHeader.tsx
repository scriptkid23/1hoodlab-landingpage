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
      if (scrollingDown) setHidden(true);
      else if (scrollingUp) setHidden(false);
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

  useEffect(() => {
    const handleResize = () => {
      if (mobileMenuOpen && window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const headerClassName = [
    "group fixed top-0 right-0 left-0 isolate z-50 flex w-full items-center transition-transform duration-400 ease-(--easing) lg:h-(--header-height) lg:overflow-hidden",
    scrolled ? "-scrolled" : "",
    mobileMenuOpen ? "-mobile-menu-open" : "",
    hidden ? "-translate-y-full" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerClassName}>
      <div className="flex w-full px-[40px]">
        <div className="group-[.-scrolled]:bg-[#111] group-[.-mobile-menu-open]:bg-[#111] relative isolate mx-auto flex h-(--header-height) w-fit grow items-center justify-between gap-[20px] bg-transparent px-[10px] transition-all duration-600 ease-(--easing) lg:h-auto lg:px-0 lg:group-[.-scrolled]:w-fit lg:group-[.-scrolled]:grow-0 lg:group-[.-scrolled]:rounded-[8px] lg:group-[.-scrolled]:bg-[#1b1b1b] lg:group-[.-scrolled]:px-[12px] lg:group-[.-scrolled]:py-[4px]">
          {/* Logo */}
          <a
            href="/"
            className="relative isolate h-[30px] w-[120px] shrink-0 overflow-hidden transition-[width] duration-600 ease-(--easing) group-[.-scrolled]:w-[30px]"
            aria-label="1hoodlabs"
          >
            <Image
              src="/assets/brands/brand.svg"
              alt="1hoodlabs"
              width={120}
              height={29}
              className="h-auto w-full transition-transform duration-600 ease-(--easing) group-[.-scrolled]:-translate-y-full"
              priority
            />
            <Image
              src="/assets/brands/logo-white.svg"
              alt="1hoodlabs"
              width={20}
              height={20}
              className="absolute top-0 left-0 h-auto w-[20px] translate-y-[30px] transition-transform duration-600 ease-(--easing) group-[.-scrolled]:translate-y-0"
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
                    onMouseEnter={(e) => {
                      e.currentTarget.style.animation =
                        "glitch-hover 0.3s linear";
                    }}
                    onAnimationEnd={(e) => {
                      e.currentTarget.style.animation = "";
                    }}
                  >
                    <div className="flex h-[40px] items-center px-[20px]">
                      <div className="size-[10px] -translate-x-[24px] rounded-[3px] bg-[#dadada] opacity-0 blur-[20px] transition-all duration-400 ease-(--easing) group-hover/link:-translate-x-[5px] group-hover/link:opacity-100 group-hover/link:blur-[0px]" />
                      <div
                        className="relative isolate flex -translate-x-[5px] overflow-hidden transition-transform duration-400 ease-(--easing) group-hover/link:translate-x-[5px]"
                        style={{
                          fontFamily: "var(--font-satoshi), sans-serif",
                          fontSize: "0.75rem",
                          lineHeight: "0.938rem",
                          textTransform: "uppercase",
                        }}
                      >
                        <span className="transition-transform duration-400 ease-(--easing) group-hover/link:-translate-y-full">
                          {link.label}
                        </span>
                        <span
                          className="absolute inset-0 translate-y-full transition-transform duration-400 ease-(--easing) group-hover/link:translate-y-0"
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

            <div
              className="pointer-events-none absolute top-0 left-0 h-full w-full transition-[width,left,opacity] duration-400 ease-(--easing)"
              style={{
                width: `${hoverWidth}px`,
                left: `${hoverOffset}px`,
                opacity: isHovering ? 0.4 : 0,
              }}
            >
              <CornerAccentSVG className="transition-opacity duration-400 ease-(--easing)" />
              <CornerAccentSVG className="transition-opacity duration-400 ease-(--easing)" />
              <CornerAccentSVG className="transition-opacity duration-400 ease-(--easing)" />
              <CornerAccentSVG className="transition-opacity duration-400 ease-(--easing)" />
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
            <CornerAccentSVG className="opacity-40 transition-transform duration-400 ease-(--easing) group-[.-mobile-menu-open]:rotate-180" />
            <CornerAccentSVG className="opacity-40 transition-transform duration-400 ease-(--easing) group-[.-mobile-menu-open]:rotate-180" />
            <CornerAccentSVG className="opacity-40 transition-transform duration-400 ease-(--easing) group-[.-mobile-menu-open]:rotate-180" />
            <CornerAccentSVG className="opacity-40 transition-transform duration-400 ease-(--easing) group-[.-mobile-menu-open]:rotate-180" />
          </button>

          {/* Mobile menu overlay */}
          {mobileMenuOpen && (
            <div
              className="absolute top-full left-0 h-[calc(100dvh-var(--header-height))] w-full bg-[#111]/1 backdrop-blur-[10px] lg:hidden"
              style={{ animation: "fadeIn 400ms ease forwards" }}
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
                            fontFamily: "var(--font-satoshi), sans-serif",
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
                <li className="relative isolate col-span-2 mt-[24px]">
                  <a
                    className="w-full text-center"
                    href="#contact"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex h-[60px] items-center justify-center text-center">
                      <span
                        style={{
                          fontFamily: "var(--font-satoshi), sans-serif",
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
