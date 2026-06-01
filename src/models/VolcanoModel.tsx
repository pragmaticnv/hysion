import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Sparkles, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

export function VolcanoModel({ showLabels = true }: { showLabels?: boolean }) {
  const magmaRef = useRef<THREE.Mesh>(null);
  const ashRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (magmaRef.current) {
      const material = magmaRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.5;
    }
    if (ashRef.current) {
      ashRef.current.position.y += delta * 2;
      if (ashRef.current.position.y > 5) ashRef.current.position.y = 0;
    }
  });

  return (
    <group scale={1.2} rotation={[0.2, 0, 0]}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 10]} intensity={1} color="#fcd34d" />
      <pointLight position={[0, 2, 0]} intensity={3} color="#ef4444" distance={10} />

      {/* Stratovolcano Cone (Cutaway) */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 4, 4, 32, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#475569" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* Inner Cutaway Surface */}
      <mesh position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[8, 4]} />
        <meshStandardMaterial color="#334155" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>

      {/* Magma Chamber */}
      <mesh position={[0, -1.5, 0]}>
        <sphereGeometry args={[1.5, 32, 16, 0, Math.PI]} />
        <meshStandardMaterial color="#dc2626" emissive="#b91c1c" emissiveIntensity={0.8} roughness={0.5} side={THREE.DoubleSide} />
        {showLabels && (
          <Html position={[2, 0, 0]} center>
            <div className="bg-black/80 text-orange-400 text-[10px] px-2 py-1 rounded border border-orange-500/30 backdrop-blur-md whitespace-nowrap font-mono uppercase tracking-widest">
              Magma Chamber
            </div>
          </Html>
        )}
      </mesh>

      {/* Central Vent */}
      <mesh ref={magmaRef} position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.3, 0.5, 3, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#ef4444" emissive="#f97316" emissiveIntensity={1} roughness={0.2} side={THREE.DoubleSide} />
        {showLabels && (
          <Html position={[-1.5, 1, 0]} center>
            <div className="bg-black/80 text-red-400 text-[10px] px-2 py-1 rounded border border-red-500/30 backdrop-blur-md whitespace-nowrap font-mono uppercase tracking-widest">
              Central Vent (Conduit)
            </div>
          </Html>
        )}
      </mesh>

      {/* Ash Plume */}
      <group ref={ashRef} position={[0, 2, 0]}>
        <Sparkles count={300} scale={4} size={5} speed={0.5} opacity={0.8} color="#94a3b8" />
        <Sparkles count={100} scale={2} size={3} speed={1} opacity={0.9} color="#f97316" />
        {showLabels && (
          <Html position={[2, 2, 0]} center>
            <div className="bg-black/80 text-zinc-300 text-[10px] px-2 py-1 rounded border border-zinc-500/30 backdrop-blur-md whitespace-nowrap font-mono uppercase tracking-widest">
              Ash & Gas Plume
            </div>
          </Html>
        )}
      </group>

      {/* Lava Flow (Side) */}
      <mesh position={[1.5, 0.5, 0.5]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.1, 0.2, 2, 8]} />
        <meshStandardMaterial color="#ea580c" emissive="#c2410c" emissiveIntensity={0.8} roughness={0.4} />
      </mesh>
      {showLabels && (
        <Html position={[2.5, 0.5, 0.5]} center>
          <div className="bg-black/80 text-amber-400 text-[10px] px-2 py-1 rounded border border-amber-500/30 backdrop-blur-md whitespace-nowrap font-mono uppercase tracking-widest">
            Lava Flow
          </div>
        </Html>
      )}

      {/* Tectonic Plates (Base) */}
      <mesh position={[0, -2.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#1e293b" roughness={1} />
      </mesh>
    </group>
  );
}
