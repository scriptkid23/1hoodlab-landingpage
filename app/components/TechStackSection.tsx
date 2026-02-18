"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type StackItem = {
  title: string;
  bullet: string;
  icon: ReactNode;
};

const stackItems: StackItem[] = [
  {
    title: "Smart Contracts",
    bullet: "Solidity, audits, test coverage",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <path
          d="M8 4h8l4 4v8l-4 4H8l-4-4V8l4-4Zm0 3-1 1v8l1 1h8l1-1V8l-1-1H8Zm2 2h4v2h-4V9Zm0 4h4v2h-4v-2Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    title: "Backend",
    bullet: "Rust/Go/Nest, event-driven",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <path
          d="M3 7h18v4H3V7Zm2 2v0h14v0H5Zm-2 5h18v6H3v-6Zm3 2v2h4v-2H6Zm8 0v2h4v-2h-4Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    title: "Infrastructure",
    bullet: "CI/CD, monitoring, logging",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <path
          d="M6 5h12l3 4v10H3V9l3-4Zm1.5 2L6 9v8h12V9l-1.5-2h-9ZM8 11h8v2H8v-2Zm0 4h5v2H8v-2Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    title: "Security",
    bullet: "Key management, access control, best practices",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <path
          d="M12 3 4 6v6c0 4.8 3.2 8.7 8 10 4.8-1.3 8-5.2 8-10V6l-8-3Zm0 3.2 5 1.9V12c0 3.4-2 6.2-5 7.3-3-1.1-5-3.9-5-7.3V8.1l5-1.9ZM11 10h2v5h-2v-5Zm0 6h2v2h-2v-2Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

export function TechStackSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      {
        threshold: 0.5,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="section-3"
      ref={sectionRef}
      className="relative z-10 min-h-screen w-full px-6 md:px-[120px]"
    >
      <div className="mx-auto flex min-h-screen w-full max-w-[1200px] items-start pt-18 md:pt-24">
        <div className="w-full rounded-2xl border border-rangitoto-950/8 bg-white/45 p-4 backdrop-blur-[5px] md:p-6">
          <p
            className={`text-xs font-medium tracking-[0.2em] text-rangitoto-950/60 uppercase transition-all duration-700 ease-out ${
              visible ? "translate-y-0 opacity-100 blur-0" : "translate-y-5 opacity-0 blur-[2px]"
            }`}
          >
            Tech stack
          </p>
          <h2
            className={`mt-3 max-w-2xl font-heading text-3xl leading-tight text-rangitoto-950 md:text-5xl transition-all duration-700 ease-out ${
              visible ? "translate-y-0 opacity-100 blur-0" : "translate-y-5 opacity-0 blur-[2px]"
            }`}
            style={{ transitionDelay: "80ms" }}
          >
            Built for reliability, scale, and security
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 md:mt-7 md:grid-cols-4">
            {stackItems.map((item, index) => (
              <div
                key={item.title}
                className={`border-t border-rangitoto-950/12 pt-4 transition-all duration-700 ease-out ${
                  visible ? "translate-y-0 opacity-100 blur-0" : "translate-y-5 opacity-0 blur-[2px]"
                }`}
                style={{ transitionDelay: `${170 + index * 80}ms` }}
              >
                <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-rangitoto-950/15 text-rangitoto-950/85">
                  {item.icon}
                </div>
                <p className="text-base font-semibold text-rangitoto-950">{item.title}</p>
                <p className="mt-1 text-sm text-rangitoto-950/72">- {item.bullet}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
