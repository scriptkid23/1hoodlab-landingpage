"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LINE_1 = "Built for scale";
const LINE_2 = "and reliability";

export function TechStackSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handlePlayClick = useCallback(() => {
    const button = playButtonRef.current;
    const overlay = overlayRef.current;
    if (!button || !overlay) return;

    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Position overlay at play button center
    gsap.set(overlay, {
      left: centerX,
      top: centerY,
      xPercent: -50,
      yPercent: -50,
      scale: 0,
    });

    // Radiate black overlay from play icon to cover entire screen
    gsap.to(overlay, {
      scale: 1,
      duration: 1.5,
      ease: "circ.inOut",
      onComplete: () => {
        // Overlay covers screen - ready for video/modal
      },
    });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    const playButton = playButtonRef.current;
    if (!section || !line1 || !line2) return;

    // Hide play button and overlay initially
    if (playButton) {
      gsap.set(playButton, { opacity: 0, scale: 0.6 });
    }
    // Overlay init is in separate effect (runs when mounted, overlay is in portal)

    const targets = [line1, line2];
    gsap.set(targets, { yPercent: -100 });

    const ctx = gsap.context(() => {
      // Text animation
      gsap.to(targets, {
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

      // Play button animation - appears after text, when section 3 is in view
      if (playButton) {
        gsap.to(playButton, {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: section,
            start: "top 40%",
            toggleActions: "play none none none",
          },
          delay: 0.4,
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  // Init overlay when mounted (portal to body - escapes overflow:hidden of smooth-wrapper)
  useEffect(() => {
    if (mounted && overlayRef.current) {
      gsap.set(overlayRef.current, { scale: 0, left: "50%", top: "50%", xPercent: -50, yPercent: -50 });
    }
  }, [mounted]);

  return (
    <>
      {/* Black overlay - portaled to body to escape overflow:hidden, radiates from play icon */}
      {mounted &&
        createPortal(
          <div
            ref={overlayRef}
            aria-hidden="true"
            className="pointer-events-none fixed left-0 top-0 z-[9999] h-[300vmax] w-[300vmax] rounded-full bg-black"
          />,
          document.body
        )}

      <section
        id="section-3"
        ref={sectionRef}
        className="relative z-10 flex min-h-screen w-full flex-col items-center px-6 md:px-[120px]"
      >
      <div className="mx-auto flex w-full flex-col items-center gap-16">
        {/* Line 1: Built for | Line 2: scale and reliability */}
        <div className="relative flex flex-1 w-full flex-col items-center justify-center gap-12 text-center py-20">
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

          {/* Play button - centered in the middle, animates in when section 3 is in view */}
          <button
            ref={playButtonRef}
            type="button"
            aria-label="Play video"
            onClick={handlePlayClick}
            className="group flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-black bg-black/5 transition-all duration-300 hover:scale-110 hover:bg-black/10 hover:border-black/80 focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2"
          >
            <svg
              className="ml-1 h-8 w-8 text-black"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8 5v14l11-7L8 5z" />
            </svg>
          </button>
        </div>
      </div>
    </section>
    </>
  );
}
