import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';

export function DesertModel({ showLabels = true }: { showLabels?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <group ref={groupRef} position={[0, -2, 0]}>
      <ambientLight intensity={0.6} color="#ffcc80" />
      <directionalLight position={[10, 15, 5]} intensity={2} color="#ffb74d" castShadow />
      
      {/* Ground (Dunes) */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <cylinderGeometry args={[12, 12, 0.5, 64]} />
        <meshStandardMaterial color="#f4a460" roughness={1} />
      </mesh>

      {/* Dunes */}
      {Array.from({ length: 8 }).map((_, i) => {
        const radius = Math.random() * 6 + 2;
        const angle = Math.random() * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const scale = Math.random() * 2 + 1;
        
        return (
          <mesh key={`dune-${i}`} position={[x, scale / 2, z]} scale={[scale * 2, scale, scale * 1.5]} castShadow receiveShadow>
            <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#e69138" roughness={1} />
          </mesh>
        );
      })}

      {/* Cacti */}
      {Array.from({ length: 15 }).map((_, i) => {
        const radius = Math.random() * 9 + 1;
        const angle = Math.random() * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const scale = Math.random() * 0.5 + 0.5;
        const height = Math.random() * 2 + 1;
        
        return (
          <group key={`cactus-${i}`} position={[x, 0, z]} scale={scale}>
            {/* Main Trunk */}
            <mesh position={[0, height / 2, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.15, height, 8]} />
              <meshStandardMaterial color="#2e7d32" roughness={0.9} />
            </mesh>
            {/* Arm 1 */}
            {Math.random() > 0.3 && (
              <mesh position={[0.3, height * 0.6, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
                <cylinderGeometry args={[0.1, 0.1, height * 0.5, 8]} />
                <meshStandardMaterial color="#2e7d32" roughness={0.9} />
              </mesh>
            )}
            {/* Arm 2 */}
            {Math.random() > 0.5 && (
              <mesh position={[-0.3, height * 0.4, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
                <cylinderGeometry args={[0.1, 0.1, height * 0.4, 8]} />
                <meshStandardMaterial color="#2e7d32" roughness={0.9} />
              </mesh>
            )}
          </group>
        );
      })}

      {/* Sun */}
      <mesh position={[10, 10, -10]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#ff9800" />
      </mesh>

      {/* Fog / Heat Haze */}
      <fog attach="fog" args={['#ffcc80', 10, 30]} />


    </group>
  );
}
