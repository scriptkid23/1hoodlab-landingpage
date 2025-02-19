import { motion } from "framer-motion";
import React from "react";

interface InfiniteMovingProps {
  items: string[];
  speed?: number;
  direction?: "left" | "right";
}

export const InfiniteMoving: React.FC<InfiniteMovingProps> = ({
  items,
  speed = 50,
  direction = "left",
}) => {
  return (
    <div className="relative overflow-hidden whitespace-nowrap">
      <div className="absolute top-0 bottom-0 left-0 w-1/6 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
      <div className="absolute top-0 bottom-0 right-0 w-1/6 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
      <motion.div
        className="inline-block"
        animate={{
          x: direction === "left" ? [0, -100 + "%"] : [-100 + "%", 0],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: (items.length * speed) / 10,
            ease: "linear",
          },
        }}
      >
        {items.map((item, index) => (
          <span
            key={index}
            className="inline-block mx-4 text-sm sm:text-base text-neutral-600"
          >
            {item}
          </span>
        ))}
      </motion.div>
      <motion.div
        className="inline-block"
        animate={{
          x: direction === "left" ? [0, -100 + "%"] : [-100 + "%", 0],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: (items.length * speed) / 10,
            ease: "linear",
          },
        }}
      >
        {items.map((item, index) => (
          <span
            key={index}
            className="inline-block mx-4 text-sm sm:text-base text-neutral-600 font-sans font-normal"
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
};
