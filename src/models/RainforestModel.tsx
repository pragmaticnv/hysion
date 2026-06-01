import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Float, Text, Instance, Instances, Cloud, Sky } from '@react-three/drei';
import * as THREE from 'three';

export function RainforestModel({ showLabels = true }: { showLabels?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, -2, 0]}>
      <ambientLight intensity={0.5} color="#a8e6cf" />
      <directionalLight position={[5, 10, 5]} intensity={1.5} color="#ffeb3b" castShadow />
      
      {/* Ground */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <cylinderGeometry args={[10, 10, 0.5, 64]} />
        <meshStandardMaterial color="#2d4c1e" roughness={0.9} />
      </mesh>

      {/* Trees */}
      {Array.from({ length: 40 }).map((_, i) => {
        const radius = Math.random() * 8 + 1;
        const angle = Math.random() * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const scale = Math.random() * 0.5 + 0.5;
        const height = Math.random() * 4 + 4;
        
        return (
          <group key={i} position={[x, 0, z]} scale={scale}>
            {/* Trunk */}
            <mesh position={[0, height / 2, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.4, height, 8]} />
              <meshStandardMaterial color="#3e2723" roughness={1} />
            </mesh>
            {/* Canopy */}
            <mesh position={[0, height, 0]} castShadow>
              <sphereGeometry args={[1.5, 8, 8]} />
              <meshStandardMaterial color="#1b5e20" roughness={0.8} />
            </mesh>
            <mesh position={[0.5, height + 0.5, 0.5]} castShadow>
              <sphereGeometry args={[1.2, 8, 8]} />
              <meshStandardMaterial color="#2e7d32" roughness={0.8} />
            </mesh>
            <mesh position={[-0.5, height + 0.2, -0.5]} castShadow>
              <sphereGeometry args={[1.3, 8, 8]} />
              <meshStandardMaterial color="#388e3c" roughness={0.8} />
            </mesh>
          </group>
        );
      })}

      {/* River */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.26, 0]}>
        <planeGeometry args={[20, 2]} />
        <meshStandardMaterial color="#0288d1" transparent opacity={0.8} roughness={0.1} metalness={0.8} />
      </mesh>

      {/* Fog / Atmosphere */}
      <fog attach="fog" args={['#a8e6cf', 5, 25]} />


    </group>
  );
}
