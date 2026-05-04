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
  const color = data.language ? (colors[data.language] || '#888888') : '#555555';

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
        <meshBasicMaterial color="#ffffff" transparent opacity={0.05} side={THREE.DoubleSide} />
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
            roughness={0.7} 
            metalness={0.3}
            emissive={color}
            emissiveIntensity={data.isActive ? 0.2 : 0}
          />
        </mesh>

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
