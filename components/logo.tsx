"use client";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { usePageTransition, LOGO_PATHS } from "./PageTransition";

interface LogoProps {
  className?: string;
  enableTransition?: boolean;
}

export function Logo({ className = "", enableTransition = false }: LogoProps) {
  const [hoveredPath, setHoveredPath] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const { triggerTransition, updateLogoPosition } = enableTransition
    ? usePageTransition()
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

  const handlePathClick = (index: number, event: React.MouseEvent<SVGPathElement>) => {
    if (enableTransition) {
      const path = LOGO_PATHS[index];
      const pathElement = event.currentTarget;
      const svgElement = svgRef.current;
      
      if (pathElement && svgElement) {
        // Lấy bounding box của path cụ thể
        const pathBBox = pathElement.getBBox();
        const svgRect = svgElement.getBoundingClientRect();
        const svgViewBox = svgElement.viewBox.baseVal;
        
        // Tính toán tỷ lệ giữa kích thước thực tế và viewBox
        const scaleX = svgRect.width / svgViewBox.width;
        const scaleY = svgRect.height / svgViewBox.height;
        
        // Chuyển đổi tọa độ từ SVG coordinate system sang screen coordinate
        const pathScreenRect = {
          left: svgRect.left + pathBBox.x * scaleX,
          top: svgRect.top + pathBBox.y * scaleY,
          width: pathBBox.width * scaleX,
          height: pathBBox.height * scaleY,
        };

        triggerTransition(path.url, path.color, path.d, {
          svgRect: pathScreenRect,
        });
      }
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
          onClick={(e) => handlePathClick(index, e)}
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
