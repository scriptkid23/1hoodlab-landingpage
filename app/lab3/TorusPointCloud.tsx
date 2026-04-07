"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
uniform float uSize;
uniform float uAttenuation;
varying float vDepth;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = uSize * (uAttenuation / max(0.1, -mvPosition.z));
  gl_PointSize = clamp(gl_PointSize, 1.0, 14.0);
  gl_Position = projectionMatrix * mvPosition;
  vDepth = mvPosition.z;
}
`;

const fragmentShader = `
uniform vec3 uColor;
varying float vDepth;

void main() {
  vec2 center = gl_PointCoord - vec2(0.5);
  if (dot(center, center) > 0.25) discard;

  // vDepth là giá trị âm (khoảng từ 0 đến -12)
  // Giảm khoảng smoothstep để các điểm ở xa (ví dụ -10) sẽ mờ hẳn đi
  float fade = smoothstep(-10.0, -2.0, vDepth);
  
  // Màu nền của trang là #111111 (khoảng 0.067 trong RGB)
  vec3 bgColor = vec3(0.067, 0.067, 0.067);
  
  // Mix màu của hạt với màu nền để các hạt ở xa chìm vào bóng tối của hole
  gl_FragColor = vec4(mix(bgColor, uColor, fade), 1.0);
}
`;

export function TorusPointCloud() {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    // Tăng bán kính ống (tube) từ 2.2 lên 3.5 để hole rộng hơn
    const geometry = new THREE.TorusGeometry(8.2, 3.5, 92, 320);
    const pos = geometry.attributes.position.array.slice() as Float32Array;
    geometry.dispose();
    return pos;
  }, []);

  const uniforms = useMemo(
    () => ({
      uSize: { value: 0.28 },
      uAttenuation: { value: 160 },
      uColor: { value: new THREE.Color("#d1d1d1") },
    }),
    []
  );

  useFrame((state) => {
    if (!pointsRef.current) return;

    const t = state.clock.elapsedTime;

    // Đặt donut nằm đứng (mặt phẳng YZ) bằng cách xoay quanh trục Y 90 độ
    pointsRef.current.rotation.x = 0;
    pointsRef.current.rotation.y = Math.PI / 2;
    
    // Đổi chiều xoay (thêm dấu trừ) và giảm tốc độ (từ 0.3 xuống 0.1)
    pointsRef.current.rotation.z = -t * 0.1;

    // Lắc trái phải nhịp nhàng và lên xuống nhẹ
    const swayX = Math.sin(t * 1.5) * 0.5;
    const swayY = Math.cos(t * 0.8) * 0.15;

    state.camera.position.x = swayX;
    state.camera.position.y = swayY;
    
    // Nhìn thẳng về phía trước, hơi hướng theo nhịp lắc
    state.camera.lookAt(swayX * 0.2, swayY * 0.2, -5);
    
    // Thêm độ nghiêng (roll) cho camera khi lắc trái phải
    state.camera.rotation.z = -Math.sin(t * 1.5) * 0.1;
  });

  return (
    // Đặt tâm donut ở [0, 8.2, 0] để đường cong của hole hướng lên trên
    <points ref={pointsRef} position={[0, 8.2, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={false}
        depthWrite
        depthTest
        blending={THREE.NormalBlending}
      />
    </points>
  );
}
