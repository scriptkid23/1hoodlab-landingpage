"use client";
import { motion, useAnimationControls } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Twitter, Instagram, Linkedin, Github } from "lucide-react";
const scrambleText = "!<>-_\\/[]{}—=+*^?#________";
const categories = [
  "Blockchain",
  "Frontend",
  "GameFi",
  "Web3",
  "DeFi",
  "NFT",
  "Metaverse",
  "AI",
  "IoT",
];

export default function Home() {
  const controls = useAnimationControls();
  const [scrambledText, setScrambledText] = useState("1hoodlabs");
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      controls.start({
        opacity: [1, 0.5, 1],
        transition: { duration: 1.5, times: [0, 0.5, 1] },
      });
      scrambleEffect();
    }, 3000);

    return () => clearInterval(interval);
  }, [controls]);

  const scrambleEffect = () => {
    let iterations = 0;
    const interval = setInterval(() => {
      setScrambledText((prevText) =>
        prevText
          .split("")
          .map((letter, index) => {
            if (index < iterations) {
              return "1hoodlabs"[index];
            }
            return scrambleText[
              Math.floor(Math.random() * scrambleText.length)
            ];
          })
          .join("")
      );

      if (iterations >= "1hoodlabs".length) {
        clearInterval(interval);
      }

      iterations += 1 / 3;
    }, 30);
  };
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white">
      {/* Holographic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50/40 via-white to-blue-50/40" />
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-50/30 via-transparent to-orange-50/30" />

      {/* Content */}
      <div className="relative w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Continuous Flowing Categories */}
        <div
          className="overflow-hidden mb-12 sm:mb-16 lg:mb-24"
          ref={containerRef}
        >
          <motion.div
            className="flex whitespace-nowrap text-xs sm:text-sm text-neutral-600"
            animate={{
              x: [-containerWidth, 0],
            }}
            transition={{
              x: {
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              },
            }}
            style={{ width: `${containerWidth * 2}px` }}
          >
            {[...categories, ...categories].map((category, index) => (
              <span key={index} className="inline-block mx-4">
                {category}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Main Logo Area */}
        <div className="flex flex-col items-center justify-center gap-10 sm:gap-16 lg:gap-20 mb-12 sm:mb-16 lg:mb-24">
          {/* Logo */}

          {/* Text with scramble effect */}
          <motion.h1
            animate={controls}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-neutral-900 text-center"
          >
            {scrambledText}
            <span className="align-top text-xs sm:text-sm lg:text-base">®</span>
          </motion.h1>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between text-xs sm:text-sm text-neutral-600 gap-8 sm:gap-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-neutral-900"></div>
            <p className="max-w-xl text-center sm:text-left text-sm sm:text-base">
              Transforming digital experiences through blockchain, GameFi, and
              Web3 technologies.
            </p>
          </div>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-neutral-600 transition-colors hover:text-neutral-900"
            >
              <Twitter size={20} className="sm:w-6 sm:h-6" />
              <span className="sr-only">Twitter</span>
            </a>
            <a
              href="#"
              className="text-neutral-600 transition-colors hover:text-neutral-900"
            >
              <Instagram size={20} className="sm:w-6 sm:h-6" />
              <span className="sr-only">Instagram</span>
            </a>
            <a
              href="#"
              className="text-neutral-600 transition-colors hover:text-neutral-900"
            >
              <Linkedin size={20} className="sm:w-6 sm:h-6" />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a
              href="#"
              className="text-neutral-600 transition-colors hover:text-neutral-900"
            >
              <Github size={20} className="sm:w-6 sm:h-6" />
              <span className="sr-only">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
