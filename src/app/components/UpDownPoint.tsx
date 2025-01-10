"use client";

import { motion } from "framer-motion";

interface UpDownPointProps {
  size?: number;
  color?: string;
  duration?: number;
  distance?: number;
}

export default function UpDownPoint({
  size = 20,
  color = "#3498db",
  duration = 1.5,
  distance = 20,
}: UpDownPointProps) {
  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ height: size + distance * 2 }}
    >
      <motion.span
        className="absolute inline-flex rounded-full"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
        }}
        animate={{
          y: [-distance, distance],
        }}
        transition={{
          duration: duration,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </div>
  );
}
