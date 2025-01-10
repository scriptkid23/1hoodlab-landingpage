"use client";

import { motion, useAnimationFrame } from "framer-motion";
import { useRef } from "react";

export default function CircleAnim() {
  const circleRef = useRef<SVGCircleElement>(null);

  const largeCircle = {
    cx: 100,
    cy: 100,
    r: 70,
  };

  useAnimationFrame((time) => {
    if (circleRef.current) {
      const angle = (time / 1000) % (2 * Math.PI); // Convert time to radians
      const x = largeCircle.cx + largeCircle.r * Math.cos(angle);
      const y = largeCircle.cy + largeCircle.r * Math.sin(angle);
      circleRef.current.setAttribute("cx", x.toString());
      circleRef.current.setAttribute("cy", y.toString());
    }
  });

  return (
    <div className="font-polySans">
      <svg
        className="w-full h-full max-w-[800px] max-h-[800px]"
        viewBox="0 0 200 200"
        aria-label="Animated circle diagram"
      >
        {/* Circle Line */}
        <circle
          cx={largeCircle.cx}
          cy={largeCircle.cy}
          r={largeCircle.r}
          fill="none"
          stroke="#000"
          strokeWidth="0.3"
        />
        {/* Small Circle on the Line */}
        <motion.circle
          ref={circleRef}
          r={5}
          fill="#000"
          initial={{ cx: largeCircle.cx + largeCircle.r, cy: largeCircle.cy }}
        />
      </svg>
    </div>
  );
}
