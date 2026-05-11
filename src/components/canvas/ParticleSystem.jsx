import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ParticleSystem({ count = 100, speed = 1 }) {
  const pointsRef = useRef();
  
  const particlesCount = Math.min(count * 5, 2000); // Max 2000 particles
  
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount; i++) {
      // Create a swirling disk / orbit around the core
      const radius = 1.8 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 0.5; // slight height variation
      
      pos[i * 3] = Math.cos(theta) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(theta) * radius;
    }
    
    return pos;
  }, [particlesCount]);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pointsRef.current) {
      // Clockwise and faster rotation
      pointsRef.current.rotation.y = -t * speed * 1.5;
    }
  });

  if (particlesCount === 0) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#38bdf8"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
