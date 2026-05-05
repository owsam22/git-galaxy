import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import CoreStar from './CoreStar';
import Planet from './Planet';
import ParticleSystem from './ParticleSystem';

const Scene = ({ data, onPlanetClick }) => {
  if (!data) return null;
  
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={1.5} color="#ffffff" distance={50} decay={2} />
      
      {/* Background stars */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Core User Star */}
      <CoreStar data={data.core} />
      
      {/* Commits Particle Stream */}
      <ParticleSystem count={data.recentCommits} speed={data.core.pulseSpeed} />
      
      {/* Repositories as Planets */}
      {data.planets.map(planet => (
        <Planet key={planet.id} data={planet} onClick={onPlanetClick} />
      ))}
      
      <OrbitControls 
        enablePan={false} 
        minDistance={5} 
        maxDistance={50}
        autoRotate={true}
        autoRotateSpeed={0.5}
      />
    </>
  );
};

export default function Universe({ data, onPlanetClick }) {
  return (
    <Canvas
      camera={{ position: [0, 10, 20], fov: 45 }}
      gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
      onCreated={({ gl, scene }) => {
        scene.background = new THREE.Color('#05070A');
        gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }}
    >
      <Scene data={data} onPlanetClick={onPlanetClick} />
    </Canvas>
  );
}
