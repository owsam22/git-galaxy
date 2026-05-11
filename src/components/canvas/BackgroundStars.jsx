import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { mapUserToBackgroundStar } from '../../services/dataMapping';

export default function BackgroundStars({ users = [], onStarClick }) {
  const [hoveredUser, setHoveredUser] = useState(null);
  const flaresRef = useRef([]);

  const backgroundStars = users.map(user => mapUserToBackgroundStar(user));

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    flaresRef.current.forEach((ref, i) => {
      if (ref) {
        ref.rotation.z = t * 0.5 + i; // Offset each star
        const s = 1 + Math.sin(t * 2 + i) * 0.1; // Pulsing size
        ref.scale.set(s, s, s);
      }
    });
  });

  return (
    <group>
      {backgroundStars.map((star, i) => (
        <group key={star.username} position={star.position}>
          <mesh 
            onClick={() => onStarClick(star.username)}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredUser(star);
            }}
            onPointerOut={() => setHoveredUser(null)}
          >
            <sphereGeometry args={[star.size * 1.5, 16, 16]} />
            <meshBasicMaterial 
              color={star.shininess > 0.6 ? "#fbbf24" : "#f8fafc"} 
              transparent 
              opacity={0.8}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          {/* Star Flare / Glow Cross */}
          <group 
            ref={el => flaresRef.current[i] = el}
            scale={[star.size * 8, star.size * 8, star.size * 8]}
          >
            <mesh rotation={[0, 0, 0]}>
              <planeGeometry args={[1, 0.05]} />
              <meshBasicMaterial color={star.shininess > 0.6 ? "#fbbf24" : "#ffffff"} transparent opacity={0.3} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <planeGeometry args={[1, 0.05]} />
              <meshBasicMaterial color={star.shininess > 0.6 ? "#fbbf24" : "#ffffff"} transparent opacity={0.3} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
            </mesh>
          </group>

          {/* Soft Halo */}
          <mesh scale={[4, 4, 4]}>
            <sphereGeometry args={[star.size, 16, 16]} />
            <meshBasicMaterial 
              color={star.shininess > 0.6 ? "#fbbf24" : "#ffffff"} 
              transparent 
              opacity={0.15} 
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>

          {hoveredUser?.username === star.username && (
            <Html distanceFactor={20} center>
              <div className="glass-panel" style={{
                padding: '8px 12px',
                borderRadius: '8px',
                color: 'white',
                fontSize: '12px',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                border: '1px solid var(--accent)',
                boxShadow: '0 0 20px rgba(56, 189, 248, 0.2)'
              }}>
                <img 
                  src={star.avatarUrl} 
                  alt={star.username} 
                  style={{ width: '24px', height: '24px', borderRadius: '50%' }} 
                />
                <div>
                  <div style={{ fontWeight: 600 }}>{star.username}</div>
                  <div style={{ opacity: 0.7, fontSize: '10px' }}>
                    ⭐ {star.stats?.totalStars || 0} | 🔥 {star.stats?.contributionStreak || 0} day streak
                  </div>
                </div>
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
}
