"use client";
import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { InfiniteMoving } from "@/components/InfiniteMoving";
import { Footer } from "@/components/Footer";
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
        {/* Infinite Moving Categories */}
        <div className="mb-12 sm:mb-16 lg:mb-24 relative">
          <InfiniteMoving items={categories} speed={40} />
        </div>

        {/* Main Logo Area */}
        <div className="flex flex-col items-center justify-center gap-10 sm:gap-16 lg:gap-20 mb-12 sm:mb-16 lg:mb-24">
          {/* Logo */}
          <Logo className="h-24 w-auto sm:h-32 lg:h-40 text-neutral-900" />

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
        <Footer />
      </div>
    </div>
  );
}
