import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import CoreStar from './CoreStar';
import Planet from './Planet';
import ParticleSystem from './ParticleSystem';
import BackgroundStars from './BackgroundStars';
import ShootingStars from './ShootingStars';

const CameraController = ({ targetPosition }) => {
  const { camera, controls } = useThree();
  const lastTarget = useRef(new THREE.Vector3());
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const targetVec = useMemo(() => new THREE.Vector3(...targetPosition), [targetPosition]);
  
  useEffect(() => {
    if (targetPosition && !lastTarget.current.equals(targetVec)) {
      setIsTransitioning(true);
      lastTarget.current.copy(targetVec);
    }
  }, [targetVec]);

  useFrame(() => {
    if (!isTransitioning) return;

    const offset = new THREE.Vector3(0, 20, 40);
    const idealPos = targetVec.clone().add(offset);
    
    // Smoothly move camera and target
    camera.position.lerp(idealPos, 0.15);
    if (controls) {
      controls.target.lerp(targetVec, 0.15);
    }

    // Stop once we're close enough to feel smooth
    if (camera.position.distanceTo(idealPos) < 1.0) {
      setIsTransitioning(false);
    }
  });
  
  return null;
};

const Scene = ({ data, galaxyUsers, onStarClick, viewingUser, onPlanetClick, isEmbed }) => {
  if (!data) return null;
  
  // Find the position of the user being viewed
  const targetStar = galaxyUsers.find(u => u.username === viewingUser);
  const targetPos = targetStar ? mapUserToBackgroundStar(targetStar).position : [0, 0, 0];

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" distance={100} decay={2} />
      
      {/* Background stars (static) */}
      <Stars radius={200} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Multi-user background stars – hidden in embed mode to prevent user-switching */}
      {!isEmbed && (
        <BackgroundStars users={galaxyUsers.filter(u => u.username !== data.core.username)} onStarClick={onStarClick} />
      )}
      
      {/* Shooting stars from today's contributions */}
      <ShootingStars count={data.todayCommits} />
      
      <group position={targetPos}>
        {/* Core User Star */}
        <CoreStar data={data.core} />
        
        {/* Commits Particle Stream */}
        <ParticleSystem count={data.core.stats?.totalCommitsThisYear || 100} speed={data.core.pulseSpeed} />
        
        {/* Repositories as Planets */}
        {data.planets.map(planet => (
          <Planet key={planet.id} data={planet} onClick={onPlanetClick} />
        ))}
      </group>
      
      <CameraController targetPosition={targetPos} />
      
      <OrbitControls 
        makeDefault
        enablePan={true} 
        panSpeed={0.5}
        minDistance={5} 
        maxDistance={200}
        rotateSpeed={0.8}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </>
  );
};

export default function Universe({ data, galaxyUsers = [], onStarClick, viewingUser, onPlanetClick, isEmbed = false }) {
  return (
    <Canvas
      camera={{ position: [0, 20, 40], fov: 45 }}
      gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
      onCreated={({ gl, scene }) => {
        scene.background = new THREE.Color('#05070A');
        gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }}
    >
      <Scene 
        data={data} 
        galaxyUsers={galaxyUsers} 
        onStarClick={onStarClick} 
        viewingUser={viewingUser}
        onPlanetClick={onPlanetClick}
        isEmbed={isEmbed}
      />
    </Canvas>
  );
}

// Helper needed here since Universe is a separate component
import { mapUserToBackgroundStar } from '../../services/dataMapping';
