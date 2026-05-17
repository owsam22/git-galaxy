import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

export default function Planet({ data, onClick }) {
  const planetGroupRef = useRef();
  const planetRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Track pointer position to distinguish drag vs click
  const pointerDown = useRef(null);

  const angle = useMemo(() => Math.random() * Math.PI * 2, []);
  const speed = useMemo(() => 0.2 / data.distance, [data.distance]);

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
      const currentAngle = angle - t * speed;
      planetGroupRef.current.position.x = Math.cos(currentAngle) * data.distance;
      planetGroupRef.current.position.z = Math.sin(currentAngle) * data.distance;
    }
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group rotation={[data.inclination, data.orbitRotation, 0]}>
      {/* Orbit Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[data.distance - 0.02, data.distance + 0.02, 64]} />
        <meshBasicMaterial
          color={data.isContributed ? '#38bdf8' : '#ffffff'}
          transparent
          opacity={data.isContributed ? 0.15 : 0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      <group ref={planetGroupRef}>
        {/* ── Large invisible hitbox for reliable clicking ── */}
        <mesh
          onPointerDown={(e) => {
            e.stopPropagation();
            pointerDown.current = { x: e.clientX, y: e.clientY };
          }}
          onPointerUp={(e) => {
            e.stopPropagation();
            if (!pointerDown.current) return;
            const dx = e.clientX - pointerDown.current.x;
            const dy = e.clientY - pointerDown.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 5 && onClick) onClick(data); // only fire if not a drag
            pointerDown.current = null;
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'pointer';
            setHovered(true);
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'default';
            setHovered(false);
          }}
        >
          <sphereGeometry args={[data.size * 3, 8, 8]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {/* ── Visual planet mesh ── */}
        <mesh ref={planetRef}>
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

        {/* Dynamic glow for hot/active planets */}
        {(data.heat > 0.5 || data.isActive) && (
          <mesh scale={[1.2, 1.2, 1.2]}>
            <sphereGeometry args={[data.size, 16, 16]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={Math.min(0.1 + data.heat * 0.1, 0.3)}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}

        {data.heat > 1.2 && (
          <mesh scale={[1.4, 1.4, 1.4]}>
            <sphereGeometry args={[data.size, 16, 16]} />
            <meshBasicMaterial color={color} transparent opacity={0.05} blending={THREE.AdditiveBlending} />
          </mesh>
        )}

        {/* ── Hover tooltip — pointerEvents disabled so it never blocks clicks ── */}
        {hovered && (
          <Html
            distanceFactor={15}
            center
            style={{ pointerEvents: 'none' }}
            occlude
          >
            <div className="glass-panel" style={{
              padding: '8px 12px',
              borderRadius: '8px',
              color: 'white',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              border: `1px solid ${color}`,
              boxShadow: `0 0 15px ${color}33`,
              backdropFilter: 'blur(10px)',
            }}>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>{data.name}</div>
              <div style={{ display: 'flex', gap: '8px', opacity: 0.8, fontSize: '11px' }}>
                <span>⭐ {data.stars}</span>
                <span>🍴 {data.forks}</span>
                <span style={{ color }}>{data.language || 'Text'}</span>
              </div>
              <div style={{ opacity: 0.5, fontSize: '10px', marginTop: '2px' }}>
                Last push: {new Date(data.lastPush).toLocaleDateString()}
              </div>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}
