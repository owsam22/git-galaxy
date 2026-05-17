import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import CoreStar from './CoreStar';
import Planet from './Planet';
import ParticleSystem from './ParticleSystem';
import BackgroundStars from './BackgroundStars';
import { mapUserToBackgroundStar } from '../../services/dataMapping';

// ── Demo stars shown when backend is offline ───────────────────────────────────
const DEMO_STARS = [
  { username: 'torvalds',    label: 'Linus Torvalds',   position: [ 30,  10, -40], size: 1.4, color: '#fbbf24' },
  { username: 'gaearon',     label: 'Dan Abramov',       position: [-35,  -8,  20], size: 1.1, color: '#38bdf8' },
  { username: 'sindresorhus',label: 'Sindre Sorhus',     position: [ 20, -15,  50], size: 1.0, color: '#a78bfa' },
  { username: 'tj',          label: 'TJ Holowaychuk',    position: [-50,  18,  -10], size: 1.0, color: '#34d399' },
  { username: 'addyosmani',  label: 'Addy Osmani',       position: [ 10,  30, -60], size: 0.9, color: '#f472b6' },
  { username: 'yyx990803',   label: 'Evan You',          position: [-25, -25, -30], size: 1.2, color: '#4ade80' },
  { username: 'BurntSushi',  label: 'Andrew Gallant',    position: [ 55,   5,  15], size: 0.9, color: '#fb923c' },
  { username: 'antirez',     label: 'Salvatore Sanfi.',  position: [-15,  20,  60], size: 1.0, color: '#e879f9' },
];

function DemoStars({ onStarClick }) {
  const [hovered, setHovered] = useState(null);
  const glowRefs = useRef([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    glowRefs.current.forEach((ref, i) => {
      if (ref) {
        const s = 1 + Math.sin(t * 1.5 + i) * 0.12;
        ref.scale.set(s, s, s);
      }
    });
  });

  return (
    <group>
      {DEMO_STARS.map((star, i) => (
        <group key={star.username} position={star.position}>
          {/* Invisible large hitbox */}
          <mesh
            onClick={(e) => { e.stopPropagation(); onStarClick(star.username); }}
            onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; setHovered(i); }}
            onPointerOut={() => { document.body.style.cursor = 'default'; setHovered(null); }}
          >
            <sphereGeometry args={[star.size * 5, 8, 8]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>

          {/* Core glow */}
          <mesh ref={el => glowRefs.current[i] = el}>
            <sphereGeometry args={[star.size * 1.2, 16, 16]} />
            <meshBasicMaterial color={star.color} transparent opacity={hovered === i ? 1.0 : 0.9} blending={THREE.AdditiveBlending} />
          </mesh>

          {/* Outer halo */}
          <mesh>
            <sphereGeometry args={[star.size * 3, 12, 12]} />
            <meshBasicMaterial color={star.color} transparent opacity={hovered === i ? 0.25 : 0.08} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>

          {/* Flare cross */}
          {[0, Math.PI / 2].map((rot, ri) => (
            <mesh key={ri} rotation={[0, 0, rot]} scale={[star.size * 10, star.size * 10, 1]}>
              <planeGeometry args={[1, 0.04]} />
              <meshBasicMaterial color={star.color} transparent opacity={0.25} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
            </mesh>
          ))}

          {/* Tooltip on hover */}
          {hovered === i && (
            <Html distanceFactor={20} center style={{ pointerEvents: 'none' }}>
              <div style={{
                background: 'rgba(5,7,10,0.85)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${star.color}55`,
                boxShadow: `0 0 18px ${star.color}33`,
                borderRadius: '10px',
                padding: '8px 14px',
                color: 'white',
                fontSize: '12px',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}>
                <div style={{ fontWeight: 700, fontSize: '13px', color: star.color }}>{star.label}</div>
                <div style={{ opacity: 0.6, fontSize: '10px', marginTop: '2px' }}>@{star.username}</div>
                <div style={{ opacity: 0.45, fontSize: '9px', marginTop: '4px', color: '#fbbf24' }}>⚡ Demo — backend offline</div>
                <div style={{ opacity: 0.5, fontSize: '9px', color: 'var(--accent)', marginTop: '2px' }}>Click to preview</div>
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
}

// ── Camera Controller ──────────────────────────────────────────────────────────
// Smoothly transitions between free-roam (galaxy overview) and focused (orbit user star)
const CameraController = ({ targetPosition, isFreeRoam }) => {
  const { camera, controls } = useThree();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const lastKey = useRef('');

  const targetVec = useMemo(
    () => new THREE.Vector3(...(targetPosition || [0, 0, 0])),
    [targetPosition]
  );

  // Trigger transition whenever mode or target changes
  useEffect(() => {
    const key = `${isFreeRoam}|${targetVec.toArray().join(',')}`;
    if (key !== lastKey.current) {
      lastKey.current = key;
      setIsTransitioning(true);
    }
  }, [targetVec, isFreeRoam]);

  useFrame(() => {
    if (!isTransitioning || !controls) return;

    // Determine ideal camera position and orbit target
    let idealPos, idealTarget;
    if (isFreeRoam) {
      idealPos   = new THREE.Vector3(0, 70, 180);   // zoomed out to see full galaxy
      idealTarget = new THREE.Vector3(0, 0, 0);
    } else {
      idealPos   = targetVec.clone().add(new THREE.Vector3(0, 20, 45));
      idealTarget = targetVec.clone();
    }

    const SPEED = 0.05;
    camera.position.lerp(idealPos, SPEED);
    controls.target.lerp(idealTarget, SPEED);
    controls.update();

    if (camera.position.distanceTo(idealPos) < 1.5) {
      camera.position.copy(idealPos);
      controls.target.copy(idealTarget);
      controls.update();
      setIsTransitioning(false);
    }
  });

  return null;
};

// ── Scene ──────────────────────────────────────────────────────────────────────
const Scene = ({ data, galaxyUsers, onStarClick, viewingUser, onPlanetClick, isEmbed, isFreeRoam, isBackendLive }) => {
  const targetStar = viewingUser ? galaxyUsers.find(u => u.username === viewingUser) : null;
  const targetPos  = targetStar ? mapUserToBackgroundStar(targetStar).position : [0, 0, 0];

  // In focused mode, exclude the current user from background stars
  const bgUsers = galaxyUsers.filter(u => !viewingUser || u.username !== viewingUser);
  const showDemoStars = !isBackendLive && bgUsers.length === 0 && !isEmbed;

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" distance={150} decay={2} />

      {/* Static deep-space star field */}
      <Stars radius={200} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Demo stars (famous devs) — shown when backend is offline */}
      {showDemoStars && (
        <DemoStars onStarClick={onStarClick} />
      )}

      {/* Live clickable user stars — shown when backend is online */}
      {!isEmbed && isBackendLive && (
        <BackgroundStars users={bgUsers} onStarClick={onStarClick} />
      )}

      {/* User solar system — only rendered in focused mode */}
      {data && !isFreeRoam && (
        <group position={targetPos}>
          <CoreStar data={data.core} />
          <ParticleSystem count={data.core.stats?.totalCommitsThisYear || 100} speed={data.core.pulseSpeed} />
          {data.planets.map(planet => (
            <Planet key={planet.id} data={planet} onClick={onPlanetClick} />
          ))}
        </group>
      )}

      <CameraController targetPosition={targetPos} isFreeRoam={isFreeRoam} />

      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={isFreeRoam ? 30 : 5}
        maxDistance={isFreeRoam ? 500 : 200}
        rotateSpeed={isFreeRoam ? 0.4 : 0.8}
        zoomSpeed={isFreeRoam ? 1.5 : 1.0}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </>
  );
};

// ── Universe ───────────────────────────────────────────────────────────────────
export default function Universe({
  data,
  galaxyUsers = [],
  onStarClick,
  viewingUser,
  onPlanetClick,
  isEmbed = false,
  isFreeRoam = true,
  isBackendLive = false,
}) {
  return (
    <Canvas
      camera={{ position: [0, 70, 180], fov: 50 }}
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
        isFreeRoam={isFreeRoam}
        isBackendLive={isBackendLive}
      />
    </Canvas>
  );
}

