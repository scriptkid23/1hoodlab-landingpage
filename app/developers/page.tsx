"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Github, Linkedin, Mail } from "lucide-react";
import { useState, useEffect } from "react";

// TypingText component với cursor nhấp nháy
function TypingText({ text, speed = 100 }: { text: string; speed?: number }) {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <span>
      {displayText}
      <span
        className={`inline-block w-2 h-16 bg-white ml-1 ${
          showCursor ? "opacity-100" : "opacity-0"
        } transition-opacity duration-100`}
      />
    </span>
  );
}

export default function DevelopersPage() {
  return (
    <div className="relative flex  flex-col min-h-screen w-full  overflow-hidden bg-black">
      {/* Animated lines overlay */}
      {/* Vertical line 1 - Right border of first column (top section) */}
      <motion.div
        className="absolute left-[50px] top-0 w-[1px] h-[50px] bg-gray-600 origin-top"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
      />

      {/* Horizontal line 1 - Top border of second row, left column */}
      <motion.div
        className="absolute left-0 top-[50px] w-[50px] h-[1px] bg-gray-600 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
      />

      {/* Vertical line 2 - Right border of left column (bottom section) */}
      <motion.div
        className="absolute left-[50px] top-[50px] w-[1px] bottom-0 bg-gray-600 origin-top"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
      />

      {/* Horizontal line 2 - Top border of second row, right side */}
      <motion.div
        className="absolute left-[50px] top-[50px] right-0 h-[1px] bg-gray-600 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
      />

      {/* Layout với height 50px, full width, chia 2 cột */}
      <div className="flex h-[50px] w-full">
        {/* Cột đầu tiên với width 50px - Back button */}
        <div className="w-[50px] flex items-center justify-center">
          <Link
            href="/"
            className="w-full h-full flex items-center justify-center hover:bg-white transition-colors duration-200 group"
          >
            <ArrowLeft className="w-5 h-5 text-white group-hover:text-black transition-colors duration-200" />
          </Link>
        </div>

        {/* Cột thứ hai chiếm phần còn lại */}
        <div className="flex-1  flex items-center justify-center">
          <span className="text-white text-xs"></span>
        </div>
      </div>

      {/* Hàng thứ hai: Layout tương tự nhưng chiếm toàn bộ chiều cao còn lại */}
      <div className="flex flex-1 w-full">
        {/* Cột đầu tiên với width 50px - Social links */}
        <div className="w-[50px] flex flex-col items-center justify-center gap-2">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 1.2, ease: "easeOut" }}
          >
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 border border-gray-600 rounded-full flex items-center justify-center hover:bg-white hover:border-white transition-colors duration-200 group"
            >
              <Github className="w-4 h-4 text-white group-hover:text-black transition-colors duration-200" />
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 1.4, ease: "easeOut" }}
          >
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 border border-gray-600 rounded-full flex items-center justify-center hover:bg-white hover:border-white transition-colors duration-200 group"
            >
              <Linkedin className="w-4 h-4 text-white group-hover:text-black transition-colors duration-200" />
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 1.6, ease: "easeOut" }}
          >
            <Link
              href="mailto:olivier.do@example.com"
              className="w-8 h-8 border border-gray-600 rounded-full flex items-center justify-center hover:bg-white hover:border-white transition-colors duration-200 group"
            >
              <Mail className="w-4 h-4 text-white group-hover:text-black transition-colors duration-200" />
            </Link>
          </motion.div>
        </div>

        {/* Cột thứ hai chiếm phần còn lại - chia thành 1/3 và 2/3 */}
        <div className="flex-1 flex">
          {/* Phần 1/3 - Image */}
          <div className="w-1/3 flex items-center justify-center overflow-hidden">
            <motion.div
              className="w-full h-full border-r border-gray-600 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.6, ease: "easeOut" }}
            >
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ scaleY: 1 }}
                animate={{ scaleY: 0 }}
                transition={{ duration: 1.2, delay: 1.8, ease: "easeInOut" }}
                style={{ transformOrigin: "top" }}
              />
              <Image
                src="/dev01.jpg"
                alt="Developer"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>

          {/* Phần 2/3 - Developer Info */}
          <div className="w-2/3 flex">
            {/* Phần 2/3 của phần 2/3 - Main Info */}
            <div className="w-2/3 flex flex-col items-start justify-center px-8">
              <motion.h1
                className="text-white text-8xl font-extrabold mb-4 font-mono"
                style={{ fontFamily: "Geist, sans-serif", fontWeight: 800 }}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0, delay: 0 }}
              >
                <TypingText text="Olivier Do." />
              </motion.h1>

              <motion.p
                className="text-gray-300 text-md mb-6 leading-relaxed"
                style={{ fontFamily: "var(--font-urbanist), sans-serif" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2.2, ease: "easeOut" }}
              >
                As a developer, my primary skills and experience revolve around
                React and Node.js. I specialize in crafting responsive, dynamic
                web applications using React for building intuitive,
                maintainable user interfaces, and Node.js for robust server-side
                development. My work typically encompasses both the frontend and
                backend, but my core strengths remain in developing with these
                two powerful technologies. I have a deep understanding of
                component-based architecture, state management, hooks, and best
                practices in React to deliver seamless and efficient user
                experiences. On the backend, I leverage Node.js to build
                scalable APIs and handle data operations effectively, ensuring
                that the applications I create are high-performing and
                maintainable.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2.4, ease: "easeOut" }}
              >
                <span className="px-4 py-2 bg-white/10 backdrop-blur-lg text-white text-sm rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-lg select-none">
                  React
                </span>
                <span className="px-4 py-2 bg-white/10 backdrop-blur-lg text-white text-sm rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-lg select-none">
                  TypeScript
                </span>
                <span className="px-4 py-2 bg-white/10 backdrop-blur-lg text-white text-sm rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-lg select-none">
                  Node.js
                </span>
                <span className="px-4 py-2 bg-white/10 backdrop-blur-lg text-white text-sm rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-lg select-none">
                  Next.js
                </span>
                <span className="px-4 py-2 bg-white/10 backdrop-blur-lg text-white text-sm rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-lg select-none">
                  Python
                </span>
              </motion.div>
            </div>

            {/* Vertical line separator */}
            <motion.div
              className="w-[1px] bg-gray-600 origin-top"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.8, delay: 2.6, ease: "easeOut" }}
            />

            {/* Phần 1/3 của phần 2/3 - Additional Info */}
            <div className="w-1/3 flex flex-col items-start justify-center px-6">
              <motion.div
                className="text-white text-sm mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2.8, ease: "easeOut" }}
              >
                <h3 className="font-semibold mb-2">Experience</h3>
                <p className="text-gray-300">5+ years</p>
              </motion.div>

              <motion.div
                className="text-white text-sm mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 3.0, ease: "easeOut" }}
              >
                <h3 className="font-semibold mb-2">Location</h3>
                <p className="text-gray-300">San Francisco</p>
              </motion.div>

              <motion.div
                className="text-white text-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 3.2, ease: "easeOut" }}
              >
                <h3 className="font-semibold mb-2">Status</h3>
                <p className="text-green-400">Available</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
