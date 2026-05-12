import React, { useRef, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export default function CoreStar({ data }) {
  const meshRef = useRef();
  const wireframeRef = useRef();
  const auraRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Load avatar as texture with CORS support and fallback
  const [texture, setTexture] = useState(null);
  
  React.useEffect(() => {
    if (!data.avatarUrl) return;
    
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    loader.load(
      data.avatarUrl,
      (tex) => setTexture(tex),
      undefined,
      (err) => {
        console.warn("Failed to load avatar texture, using fallback color:", err);
        setTexture(null);
      }
    );
  }, [data.avatarUrl]);
  
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
          color={texture ? "#ffffff" : "#38bdf8"}
          emissive={texture ? "#ffffff" : "#38bdf8"}
          emissiveIntensity={texture ? 0.1 : 0.5}
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
      
      {/* Core Light Sources */}
      <pointLight 
        color="#ffffff" 
        intensity={data.brightness * 3} 
        distance={60} 
        decay={2}
      />
      <pointLight 
        color="#39d353" 
        intensity={data.brightness * 2} 
        distance={30} 
        position={[2, 2, 2]}
      />

      {/* Strong Aura (Stars) - Blue Fire */}
      {data.stats.totalStars > 100 && (
        <mesh scale={[1.2, 1.2, 1.2]}>
          <sphereGeometry args={[2.5, 32, 32]} />
          <meshBasicMaterial 
            color="#38bdf8" 
            transparent 
            opacity={Math.min(0.05 + data.stats.totalStars / 5000, 0.2)} 
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Strong Aura (Streak) - Golden Radiance */}
      {data.stats.contributionStreak > 5 && (
        <mesh scale={[1.1, 1.1, 1.1]} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[2.8, 0.02, 16, 100]} />
          <meshBasicMaterial 
            color="#fbbf24" 
            transparent 
            opacity={Math.min(0.2 + data.stats.contributionStreak / 50, 0.6)} 
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {data.stats.contributionStreak > 5 && (
        <pointLight 
          color="#fbbf24" 
          intensity={Math.min(data.stats.contributionStreak / 10, 3)} 
          distance={40} 
        />
      )}

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
