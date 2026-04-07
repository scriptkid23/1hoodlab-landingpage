"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { SpiralFunnel } from "./SpiralFunnel";

export default function Lab01Page() {
  return (
    <main className="w-full h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [14, 1, 17], fov: 40 }}
          gl={{ antialias: true, alpha: false }}
        >
          <color attach="background" args={["#000000"]} />

          <SpiralFunnel />

          <OrbitControls
            enableZoom
            enablePan={false}
            autoRotate={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2 + 0.2}
          />
        </Canvas>
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full pointer-events-none">
        <h1 className="text-white text-5xl md:text-7xl font-bold tracking-tighter opacity-80">
          PARAMETRIC
        </h1>
        <p className="text-gray-400 mt-4 tracking-widest uppercase text-sm">
          PROCEDURAL POINT CLOUD
        </p>
      </div>
    </main>
  );
}
