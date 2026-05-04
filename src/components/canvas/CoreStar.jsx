import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function CoreStar({ data }) {
  const meshRef = useRef();
  const materialRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Pulse effect based on speed
    if (materialRef.current && meshRef.current) {
      const pulse = Math.sin(t * data.pulseSpeed * 2) * 0.05 + 1;
      meshRef.current.scale.set(pulse, pulse, pulse);
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial 
          ref={materialRef}
          color="#ffffff" 
        />
      </mesh>
      
      {/* Glow effect */}
      <mesh>
        <sphereGeometry args={[1.7, 32, 32]} />
        <meshBasicMaterial 
          color="#38bdf8" 
          transparent={true} 
          opacity={0.2} 
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.0, 32, 32]} />
        <meshBasicMaterial 
          color="#1e3a8a" 
          transparent={true} 
          opacity={0.1} 
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
      
      {/* Point light matching the core */}
      <pointLight 
        color="#38bdf8" 
        intensity={data.brightness} 
        distance={30} 
      />
    </group>
  );
}
