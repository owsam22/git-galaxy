import React, { useRef, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export default function CoreStar({ data }) {
  const meshRef = useRef();
  const wireframeRef = useRef();
  const auraRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Load avatar as texture
  const texture = useLoader(THREE.TextureLoader, data.avatarUrl);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      const pulse = Math.sin(t * data.pulseSpeed) * 0.03 + 1;
      meshRef.current.scale.set(pulse, pulse, pulse);
      meshRef.current.rotation.y += 0.003;
    }
    if (wireframeRef.current) {
      // Rotate only on Y axis to keep it stable/untilted
      wireframeRef.current.rotation.y -= 0.005;
    }
    if (auraRef.current) {
      auraRef.current.scale.set(
        1 + Math.sin(t * 0.5) * 0.05,
        1 + Math.cos(t * 0.5) * 0.05,
        1 + Math.sin(t * 0.7) * 0.05
      );
    }
  });

  return (
    <group>
      {/* The User Core (Avatar Texture) */}
      <mesh 
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => window.open(`https://github.com/${data.username}`, '_blank')}
        style={{ cursor: 'pointer' }}
      >
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial 
          map={texture}
          emissive="#ffffff"
          emissiveIntensity={0.1}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Digital Grid/Wireframe Overlay */}
      <mesh ref={wireframeRef} pointerEvents="none">
        <sphereGeometry args={[1.55, 32, 32]} />
        <meshBasicMaterial 
          color="#38bdf8" 
          wireframe 
          transparent 
          opacity={0.15} 
        />
      </mesh>
      
      {/* Primary Blue Aura */}
      <mesh pointerEvents="none">
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial 
          color="#38bdf8" 
          transparent 
          opacity={0.15} 
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* GitHub Contribution Green Aura (Secondary) */}
      <mesh ref={auraRef} pointerEvents="none">
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial 
          color="#39d353" 
          transparent 
          opacity={0.08} 
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
      
      {/* Core Light Source */}
      <pointLight 
        color="#ffffff" 
        intensity={data.brightness * 2} 
        distance={40} 
        decay={2}
      />
      <pointLight 
        color="#39d353" 
        intensity={data.brightness} 
        distance={20} 
        position={[2, 2, 2]}
      />

      {/* Hover Label */}
      {hovered && (
        <Html distanceFactor={10} center>
          <div style={{
            background: 'rgba(0,0,0,0.85)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid var(--accent)',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.3)',
            backdropFilter: 'blur(4px)'
          }}>
            <span style={{ fontWeight: 600 }}>{data.username}</span>
            <span style={{ opacity: 0.8, fontSize: '10px' }}>Click to view GitHub profile</span>
          </div>
        </Html>
      )}
    </group>
  );
}
