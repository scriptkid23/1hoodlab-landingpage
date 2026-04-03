"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LINE_1 = "Built for scale";
const LINE_2 = "and reliability";

const OPEN_DURATION = 1.5;
const OPEN_EASE = "circ.inOut";

type OverlayPhase = "idle" | "opening" | "open" | "closing";

export function TechStackSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<OverlayPhase>("idle");
  const [overlayPhase, setOverlayPhase] = useState<OverlayPhase>("idle");
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    phaseRef.current = overlayPhase;
  }, [overlayPhase]);

  const positionOverlayAtPlayButton = useCallback(() => {
    const button = playButtonRef.current;
    const overlay = overlayRef.current;
    if (!button || !overlay) return;
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    gsap.set(overlay, {
      left: centerX,
      top: centerY,
      xPercent: -50,
      yPercent: -50,
    });
  }, []);

  const handleCloseOverlay = useCallback(() => {
    if (phaseRef.current !== "open") return;
    const overlay = overlayRef.current;
    const button = playButtonRef.current;
    if (!overlay || !button) return;

    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    setOverlayPhase("closing");
    gsap.killTweensOf(overlay);
    gsap.set(overlay, {
      left: centerX,
      top: centerY,
      xPercent: -50,
      yPercent: -50,
    });

    gsap.to(overlay, {
      scale: 0,
      duration: OPEN_DURATION,
      ease: OPEN_EASE,
      onComplete: () => {
        setOverlayPhase("idle");
        playButtonRef.current?.focus();
      },
    });
  }, []);

  const handlePlayClick = useCallback(() => {
    if (phaseRef.current !== "idle") return;
    const button = playButtonRef.current;
    const overlay = overlayRef.current;
    if (!button || !overlay) return;

    setOverlayPhase("opening");
    gsap.killTweensOf(overlay);
    positionOverlayAtPlayButton();
    gsap.set(overlay, { scale: 0 });

    gsap.to(overlay, {
      scale: 1,
      duration: OPEN_DURATION,
      ease: OPEN_EASE,
      onComplete: () => {
        setOverlayPhase("open");
        closeButtonRef.current?.focus();
      },
    });
  }, [positionOverlayAtPlayButton]);

  useEffect(() => {
    if (overlayPhase !== "open") return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseOverlay();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [overlayPhase, handleCloseOverlay]);

  useEffect(() => {
    const section = sectionRef.current;
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    const playButton = playButtonRef.current;
    if (!section || !line1 || !line2) return;

    if (playButton) {
      gsap.set(playButton, { opacity: 0, scale: 0.6 });
    }

    const targets = [line1, line2];
    gsap.set(targets, { yPercent: -100 });

    const ctx = gsap.context(() => {
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

  useEffect(() => {
    if (mounted && overlayRef.current) {
      gsap.set(overlayRef.current, {
        scale: 0,
        left: "50%",
        top: "50%",
        xPercent: -50,
        yPercent: -50,
      });
    }
  }, [mounted]);

  const playAnimating =
    overlayPhase === "opening" || overlayPhase === "closing";

  return (
    <>
      {mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999]"
            style={{
              pointerEvents: overlayPhase === "idle" ? "none" : "auto",
            }}
            role="dialog"
            aria-modal={overlayPhase === "open"}
            aria-hidden={overlayPhase === "idle"}
            aria-label="Video overlay"
          >
            <div
              ref={overlayRef}
              aria-hidden="true"
              className={`fixed left-0 top-0 z-0 h-[300vmax] w-[300vmax] rounded-full bg-black ${
                overlayPhase === "open"
                  ? "pointer-events-auto"
                  : "pointer-events-none"
              }`}
            />
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close"
              onClick={handleCloseOverlay}
              className={`fixed right-6 top-6 z-10 rounded-full border border-white/80 bg-white/10 p-3 text-white backdrop-blur-sm transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                overlayPhase === "open"
                  ? "pointer-events-auto opacity-100"
                  : "pointer-events-none opacity-0"
              }`}
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>,
          document.body
        )}

      <section
        id="section-3"
        ref={sectionRef}
        className="relative z-10 flex min-h-screen w-full flex-col items-center px-6 md:px-[120px]"
      >
        <div className="mx-auto flex w-full flex-col items-center gap-16">
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

            <button
              ref={playButtonRef}
              type="button"
              aria-label="Play video"
              disabled={playAnimating}
              onClick={handlePlayClick}
              className="group flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-black bg-black/5 transition-all duration-300 hover:scale-110 hover:bg-black/10 hover:border-black/80 focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              <svg
                className="ml-1 h-8 w-8 text-black"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M8 5v14l11-7L8 5z"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
