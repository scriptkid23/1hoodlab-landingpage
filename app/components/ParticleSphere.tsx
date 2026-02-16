// @ts-nocheck
'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function ParticleSystem({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.Points>(null);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  const particleDataRef = useRef<Array<{ spherePos: THREE.Vector3; boxPos: THREE.Vector3 }>>([]);
  const positionsRef = useRef<Float32Array | null>(null);

  useEffect(() => {
    // Generate particles on sphere surface
    const particleCount = 5000;
    const positions = new Float32Array(particleCount * 3);
    particleDataRef.current = [];
    
    for (let i = 0; i < particleCount; i++) {
      // Sphere position
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 2;
      
      const sphereX = radius * Math.sin(phi) * Math.cos(theta);
      const sphereY = radius * Math.sin(phi) * Math.sin(theta);
      const sphereZ = radius * Math.cos(phi);
      
      // Box position
      const boxX = (Math.random() - 0.5) * 4;
      const boxY = (Math.random() - 0.5) * 4;
      const boxZ = (Math.random() - 0.5) * 4;
      
      positions[i * 3] = sphereX;
      positions[i * 3 + 1] = sphereY;
      positions[i * 3 + 2] = sphereZ;
      
      particleDataRef.current.push({
        spherePos: new THREE.Vector3(sphereX, sphereY, sphereZ),
        boxPos: new THREE.Vector3(boxX, boxY, boxZ),
      });
    }
    
    positionsRef.current = positions;
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometryRef.current = geometry;

    if (meshRef.current) {
      meshRef.current.geometry = geometry;
    }
  }, []);

  useFrame(() => {
    if (!meshRef.current || !positionsRef.current || !geometryRef.current) return;
    
    const positions = positionsRef.current;
    
    // Interpolate between sphere and box positions
    particleDataRef.current.forEach((particle, i) => {
      const x = particle.spherePos.x + (particle.boxPos.x - particle.spherePos.x) * scrollProgress;
      const y = particle.spherePos.y + (particle.boxPos.y - particle.spherePos.y) * scrollProgress;
      const z = particle.spherePos.z + (particle.boxPos.z - particle.spherePos.z) * scrollProgress;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    });
    
    (geometryRef.current.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    
    meshRef.current.rotation.x += 0.0001;
    meshRef.current.rotation.y += 0.0003;
  });

  const circleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 15;
    canvas.height = 15;
    const context = canvas.getContext('2d');
    if (context) {
      context.beginPath();
      context.arc(7.5, 7.5, 7.5, 0, 2 * Math.PI);
      context.fillStyle = 'white';
      context.fill();
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={5000}
          array={new Float32Array(5000 * 3)}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        color={0x606050} 
        size={0.03} 
        sizeAttenuation 
        map={circleTexture} 
        transparent
        alphaTest={0.5}
      />
    </points>
  );
}

export default function ParticleSphere() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = documentHeight > 0 ? Math.min(scrolled / documentHeight, 1) : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    // Call once to set initial state
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-[200vh]" style={{ backgroundColor: 'var(--background)' }}>
      <div className="w-full h-screen sticky top-0">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          style={{ width: '100%', height: '100%' }}
        >
          <ParticleSystem scrollProgress={scrollProgress} />
        </Canvas>
      </div>
      <div className="h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
        <div className="text-4xl font-bold text-center">
          <p>Scroll down to transform the sphere into a box</p>
        </div>
      </div>
    </div>
  );
}
