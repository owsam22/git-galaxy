import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ShootingStars({ count = 0 }) {
  const groupRef = useRef();
  
  // Cap at 50 shooting stars for performance
  const starCount = Math.min(count, 50);
  
  const stars = useMemo(() => {
    return Array.from({ length: starCount }).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
      ),
      direction: new THREE.Vector3(
        (Math.random() - 0.5),
        (Math.random() - 0.5),
        (Math.random() - 0.5)
      ).normalize(),
      speed: 0.5 + Math.random() * 2,
      length: 2 + Math.random() * 5,
      life: Math.random()
    }));
  }, [starCount]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    groupRef.current.children.forEach((mesh, i) => {
      const star = stars[i];
      star.life += delta * 0.5;
      
      if (star.life > 1) {
        star.life = 0;
        star.position.set(
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100
        );
      }
      
      const pos = star.position.clone().add(star.direction.clone().multiplyScalar(star.life * 50));
      mesh.position.copy(pos);
      
      // Orient towards direction
      mesh.lookAt(pos.clone().add(star.direction));
    });
  });

  if (starCount === 0) return null;

  return (
    <group ref={groupRef}>
      {stars.map((_, i) => (
        <mesh key={i}>
          <boxGeometry args={[0.05, 0.05, 5]} />
          <meshBasicMaterial 
            color="#39d353" 
            transparent 
            opacity={0.8} 
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}
