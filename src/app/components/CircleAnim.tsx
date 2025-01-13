"use client";

import { motion, useAnimationFrame } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface Props {
  className?: string;
}
export default function CircleAnim(props: Props) {
  const circleRef = useRef<SVGCircleElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [, setPathBounds] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (pathRef.current) {
      const bbox = pathRef.current.getBBox();
      setPathBounds({ width: bbox.width, height: bbox.height });
    }
  }, []);

  useAnimationFrame((time) => {
    if (circleRef.current && pathRef.current) {
      const pathLength = pathRef.current.getTotalLength();
      const progress = (time / 3000) % 1; // 3000ms để hoàn thành một vòng tròn
      const point = pathRef.current.getPointAtLength(progress * pathLength);
      circleRef.current.setAttribute("cx", point.x.toString());
      circleRef.current.setAttribute("cy", point.y.toString());
    }
  });

  const svgSize = 700; // Kích thước SVG
  const radius = 250; // Bán kính đường tròn

  return (
    <svg
      className={props.className}
      width={svgSize}
      height={svgSize}
      viewBox={`0 0 ${svgSize} ${svgSize}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Animated circle path"
    >
      <g transform={`translate(${svgSize / 2}, ${svgSize / 2})`}>
        {/* Đường tròn */}
        <path
          ref={pathRef}
          d={`
            M 0 ${-radius}
            A ${radius} ${radius} 0 1 1 0 ${radius}
            A ${radius} ${radius} 0 1 1 0 ${-radius}
          `}
          stroke="black"
          strokeWidth="1"
          fill="none"
        />
        {/* Hình tròn nhỏ di chuyển */}
        <motion.circle
          ref={circleRef}
          r={30}
          fill="black"
          initial={{ cx: 0, cy: -radius }} // Điểm bắt đầu
        />
      </g>
    </svg>
  );
}
