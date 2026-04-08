"use client";

import { Canvas } from "@react-three/fiber";
import { WavePointCloud } from "./WavePointCloud";

export default function WaveAnimationPage() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#111111]">
      <Canvas
        camera={{ position: [0, 0, 50], fov: 75, near: 0.1, far: 1000 }}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#111111"]} />
        <WavePointCloud />
      </Canvas>

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <h1 className="text-center text-4xl font-bold uppercase leading-[1.1] tracking-tight text-white/90 md:text-6xl lg:text-7xl">
          The future isn&apos;t
          <br />
          something that happens.
          <br />
          It&apos;s something we build.
        </h1>
      </div>
    </main>
  );
}
