import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export function TornadoModel({ showLabels = true }: { showLabels?: boolean }) {
  const vortexRef = useRef<THREE.Group>(null);
  const debrisRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (vortexRef.current) {
      vortexRef.current.rotation.y -= delta * 10;
    }
    if (debrisRef.current) {
      debrisRef.current.rotation.y -= delta * 15;
      debrisRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }
  });

  return (
    <group scale={1.5}>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 10]} intensity={1} color="#94a3b8" />
      <pointLight position={[0, -5, 0]} intensity={2} color="#475569" distance={15} />

      {/* Tornado Vortex (Multiple Cones) */}
      <group ref={vortexRef} position={[0, 0, 0]}>
        {[...Array(10)].map((_, i) => (
          <mesh key={i} position={[0, i * 0.5 - 2, 0]} rotation={[0, i * Math.PI / 4, 0]}>
            <cylinderGeometry args={[0.2 + i * 0.3, 0.1 + i * 0.2, 0.6, 16, 1, true]} />
            <meshStandardMaterial color="#64748b" transparent opacity={0.4 + (10 - i) * 0.05} side={THREE.DoubleSide} roughness={0.8} />
          </mesh>
        ))}
        {showLabels && (
          <Html position={[2, 0, 0]} center>
            <div className="bg-black/80 text-cyan-400 text-[10px] px-2 py-1 rounded border border-cyan-500/30 backdrop-blur-md whitespace-nowrap font-mono uppercase tracking-widest">
              Condensation Funnel
            </div>
          </Html>
        )}
      </group>

      {/* Debris Cloud */}
      <group ref={debrisRef} position={[0, -2, 0]}>
        <Sparkles count={500} scale={6} size={4} speed={2} opacity={0.6} color="#475569" />
        {showLabels && (
          <Html position={[-3, -1.5, 0]} center>
            <div className="bg-black/80 text-orange-400 text-[10px] px-2 py-1 rounded border border-orange-500/30 backdrop-blur-md whitespace-nowrap font-mono uppercase tracking-widest">
              Debris Cloud (High Velocity)
            </div>
          </Html>
        )}
      </group>

      {/* Supercell Base (Cloud) */}
      <mesh position={[0, 3.5, 0]}>
        <cylinderGeometry args={[5, 4, 1, 32]} />
        <meshStandardMaterial color="#334155" transparent opacity={0.8} roughness={1} />
        {showLabels && (
          <Html position={[0, 1, 0]} center>
            <div className="bg-black/80 text-zinc-300 text-[10px] px-2 py-1 rounded border border-zinc-500/30 backdrop-blur-md whitespace-nowrap font-mono uppercase tracking-widest">
              Mesocyclone / Wall Cloud
            </div>
          </Html>
        )}
      </mesh>

      {/* Ground */}
      <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial color="#1e293b" roughness={1} />
      </mesh>
    </group>
  );
}
