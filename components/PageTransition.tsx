"use client";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface PositionData {
  svgRect: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

interface TransitionContextType {
  triggerTransition: (
    targetPath: string,
    color: string,
    pathData: string,
    position: PositionData
  ) => void;
  updateLogoPosition: (position: PositionData) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(
  undefined
);

export function usePageTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error(
      "usePageTransition must be used within PageTransitionProvider"
    );
  }
  return context;
}

// Định nghĩa tất cả paths để dùng chung
export const LOGO_PATHS = [
  {
    d: "M205.831 1.65717C216.451 -3.65982 228.848 4.50596 228.145 16.3556L217.156 201.783C216.454 213.633 203.179 220.279 193.262 213.747L38.0708 111.521C28.1534 104.989 29.0313 90.1768 39.6509 84.8598L205.831 1.65717Z",
    url: "/products",
    color: "#FF6B6B",
    name: "Products",
  },
  {
    d: "M22.0918 202.147C11.3774 207.27 -0.868868 198.881 0.0485991 187.046L3.5759 141.545C4.49337 129.71 17.8865 123.306 27.6835 130.018L65.3492 155.821C75.1462 162.532 73.9993 177.326 63.2848 182.449L22.0918 202.147Z",
    url: "/developers",
    color: "#4ECDC4",
    name: "Developers",
  },
  {
    d: "M100.553 298.927C89.8846 304.147 77.5634 295.868 78.3745 284.025L84.3034 197.454C85.1144 185.612 98.4494 179.087 108.306 185.711L180.361 234.127C190.218 240.751 189.204 255.554 178.536 260.773L100.553 298.927Z",
    url: "/services",
    color: "#95E1D3",
    name: "Services",
  },
];

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activePathIndex, setActivePathIndex] = useState<number | null>(null);
  const [transitionColor, setTransitionColor] = useState("#000000");
  // Vị trí của toàn bộ logo (SVG container)
  const [logoPosition, setLogoPosition] = useState<PositionData | null>(null);
  // Vị trí của path cụ thể được click
  const [clickedPathPosition, setClickedPathPosition] = useState<PositionData | null>(null);
  const pathname = usePathname();

  const triggerTransition = (
    targetPath: string,
    color: string,
    pathD: string,
    pos: PositionData
  ) => {
    // Tìm index của path được click
    const pathIndex = LOGO_PATHS.findIndex((p) => p.d === pathD);
    
    setActivePathIndex(pathIndex);
    setTransitionColor(color);
    setClickedPathPosition(pos);
    setIsTransitioning(true);

    // Navigate after animation starts
    setTimeout(() => {
      window.location.href = targetPath;
    }, 1000);
  };

  const updateLogoPosition = (pos: PositionData) => {
    setLogoPosition(pos);
  };

  const finalSize = Math.max(
    typeof window !== "undefined" ? window.innerWidth : 1920,
    typeof window !== "undefined" ? window.innerHeight : 1080
  ) * 3;

  return (
    <TransitionContext.Provider value={{ triggerTransition, updateLogoPosition }}>
      {/* Layer 1: Logo shadow - Container phủ toàn màn hình */}
      {logoPosition && (
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: isTransitioning ? 9999 : -1,
          }}
        >
          <svg
            viewBox="0 0 229 301"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute"
            style={{
              left: logoPosition.svgRect.left,
              top: logoPosition.svgRect.top,
              width: logoPosition.svgRect.width,
              height: logoPosition.svgRect.height,
              overflow: "visible",
            }}
          >
            {LOGO_PATHS.map((path, index) => (
              <motion.path
                key={index}
                d={path.d}
                fill={activePathIndex === index ? path.color : "transparent"}
                initial={false}
                animate={{
                  scale: isTransitioning && activePathIndex === index ? finalSize / 100 : 1,
                }}
                transition={{
                  duration: 1.0,
                  ease: [0.76, 0, 0.24, 1],
                }}
                style={{
                  transformOrigin: "center",
                }}
              />
            ))}
          </svg>
        </div>
      )}

      {/* Layer 2: Content layer - UI bình thường */}
      {children}
    </TransitionContext.Provider>
  );
}

