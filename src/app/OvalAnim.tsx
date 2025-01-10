"use client";

import { motion, useAnimationFrame } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export default function Home() {
  const circleRef = useRef<SVGCircleElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [pathBounds, setPathBounds] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (pathRef.current) {
      const bbox = pathRef.current.getBBox();
      setPathBounds({ width: bbox.width, height: bbox.height });
    }
  }, []);

  useAnimationFrame((time) => {
    if (circleRef.current && pathRef.current) {
      const pathLength = pathRef.current.getTotalLength();
      const progress = (time / 5000) % 1; // Adjust 5000 to change speed
      const point = pathRef.current.getPointAtLength(progress * pathLength);
      circleRef.current.setAttribute("cx", point.x.toString());
      circleRef.current.setAttribute("cy", point.y.toString());
    }
  });

  const svgSize = 650; // You can adjust this value to change the overall size of the SVG
  const padding = 20; // Padding around the path

  return (
    <div>
      <svg
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${pathBounds.width + padding * 2} ${
          pathBounds.height + padding * 2
        }`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Animated centered custom path diagram"
      >
        <g transform={`translate(${padding}, ${padding})`}>
          <path
            ref={pathRef}
            d="M310.012 317.089C238.884 390.826 169.142 452.406 113.887 492.36C86.257 512.339 62.2698 526.895 43.556 534.864C34.1971 538.85 26.1853 541.175 19.7123 541.72C13.2358 542.266 8.37799 541.025 5.21936 537.978C2.06073 534.931 0.645816 530.122 0.957823 523.63C1.26966 517.141 3.30497 509.051 6.95064 499.554C14.2404 480.566 27.9234 456.07 46.8944 427.738C84.8317 371.08 143.86 299.165 214.988 225.427C286.116 151.69 355.858 90.1097 411.113 50.1563C438.743 30.1772 462.73 15.6209 481.444 7.65192C490.803 3.66658 498.815 1.34117 505.288 0.795838C511.764 0.250207 516.622 1.49097 519.781 4.53782C522.939 7.58466 524.354 12.3946 524.042 18.8865C523.73 25.375 521.695 33.4654 518.049 42.9618C510.76 61.9504 497.077 86.4464 478.106 114.778C440.168 171.436 381.14 243.351 310.012 317.089Z"
            stroke="black"
            strokeWidth="1"
            fill="none"
          />
          <motion.circle
            ref={circleRef}
            r={10}
            fill="#000"
            initial={{ cx: 310.012, cy: 317.089 }} // Starting point of the path
          />
        </g>
      </svg>
    </div>
  );
}
