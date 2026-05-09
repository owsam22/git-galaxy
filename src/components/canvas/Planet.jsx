import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

export default function Planet({ data, onClick }) {
  const planetGroupRef = useRef();
  const planetRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Assign a random starting angle
  const angle = useMemo(() => Math.random() * Math.PI * 2, []);
  // Orbit speed inversely proportional to distance
  const speed = useMemo(() => 0.2 / data.distance, [data.distance]);
  
  // Choose a basic color depending on language (fallback to gray)
  const colors = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Java: '#b07219',
    'C++': '#f34b7d',
    Ruby: '#701516',
    Go: '#00ADD8',
    Rust: '#dea584',
    HTML: '#e34c26',
    CSS: '#563d7c',
  };
  const color = data.language ? (colors[data.language] || '#2dd4bf') : '#0d9488';

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (planetGroupRef.current) {
      // Calculate new position
      const currentAngle = angle + t * speed;
      planetGroupRef.current.position.x = Math.cos(currentAngle) * data.distance;
      planetGroupRef.current.position.z = Math.sin(currentAngle) * data.distance;
    }
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group>
      {/* Orbit Ring centered at 0,0,0 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[data.distance - 0.02, data.distance + 0.02, 64]} />
        <meshBasicMaterial 
          color={data.isContributed ? "#38bdf8" : "#ffffff"} 
          transparent 
          opacity={data.isContributed ? 0.1 : 0.05} 
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* The Planet itself */}
      <group ref={planetGroupRef}>
        <mesh 
          ref={planetRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={(e) => {
            e.stopPropagation();
            if (onClick) onClick(data);
          }}
        >
          <sphereGeometry args={[data.size, 32, 32]} />
          <meshStandardMaterial 
            color={color} 
            roughness={data.isContributed ? 0.1 : 0.6} 
            metalness={data.isContributed ? 0.9 : 0.4}
            emissive={color}
            emissiveIntensity={data.isContributed ? 0.5 : (data.heat > 0 ? 0.3 + data.heat : 0.1)}
            wireframe={data.isContributed}
          />
        </mesh>

        {/* Dynamic Glow for Active/High-Commit Planets */}
        {(data.heat > 0.5 || data.isActive) && (
          <mesh scale={[1.2, 1.2, 1.2]}>
            <sphereGeometry args={[data.size, 16, 16]} />
            <meshBasicMaterial 
              color={color} 
              transparent 
              opacity={Math.min(0.1 + (data.heat * 0.1), 0.3)} 
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}

        {/* Extra Aura for very hot planets */}
        {data.heat > 1.2 && (
          <mesh scale={[1.4, 1.4, 1.4]}>
            <sphereGeometry args={[data.size, 16, 16]} />
            <meshBasicMaterial 
              color={color} 
              transparent 
              opacity={0.05} 
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}

        {/* Label on Hover */}
        {hovered && (
          <Html distanceFactor={15} center>
            <div style={{
              background: 'rgba(0,0,0,0.8)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              border: `1px solid ${color}`,
              fontSize: '12px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none'
            }}>
              {data.name}
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}
