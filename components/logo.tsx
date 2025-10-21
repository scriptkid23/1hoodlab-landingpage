"use client";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { usePageTransition, LOGO_PATHS } from "./PageTransition";

interface LogoProps {
  className?: string;
  enableTransition?: boolean;
}

export function Logo({ className = "", enableTransition = false }: LogoProps) {
  const [, setHoveredPath] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Always call the hook to avoid conditional hook usage
  const pageTransition = usePageTransition();
  const { triggerTransition, updateLogoPosition } = enableTransition
    ? pageTransition
    : { triggerTransition: () => {}, updateLogoPosition: () => {} };

  // Sync vị trí logo với shadow logo
  useEffect(() => {
    if (!enableTransition || !svgRef.current) return;

    const updatePosition = () => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        updateLogoPosition({
          svgRect: {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          },
        });
      }
    };

    // Update ngay khi mount
    updatePosition();

    // Update khi resize
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [enableTransition, updateLogoPosition]);

  const handlePathClick = (index: number) => {
    if (enableTransition) {
      const path = LOGO_PATHS[index];
      triggerTransition(path.url, path.color, path.d);
    }
  };

  return (
    <svg
      ref={svgRef}
      width="229"
      height="301"
      viewBox="0 0 229 301"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${enableTransition ? "overflow-visible" : ""}`}
    >
      {LOGO_PATHS.map((path, index) => (
        <motion.path
          key={index}
          d={path.d}
          fill="currentColor"
          className={enableTransition ? "cursor-pointer" : ""}
          onClick={() => handlePathClick(index)}
          onMouseEnter={() => setHoveredPath(index)}
          onMouseLeave={() => setHoveredPath(null)}
          whileHover={
            enableTransition
              ? {
                  scale: 1.05,
                  filter: "drop-shadow(0 0 8px rgba(0,0,0,0.3))",
                }
              : {}
          }
          transition={{ duration: 0.3 }}
          style={{
            transformOrigin: "center",
            vectorEffect: "non-scaling-stroke",
          }}
        />
      ))}
    </svg>
  );
}
