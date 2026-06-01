import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Cylinder, Box, Sphere } from '@react-three/drei';
import * as THREE from 'three';

export function JamesWebbModel({ showLabels = true }: { showLabels?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  // Hexagonal mirror segment
  const MirrorSegment = ({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => (
    <mesh position={position} rotation={rotation || [0, 0, 0]}>
      <cylinderGeometry args={[0.4, 0.4, 0.05, 6]} />
      <meshPhysicalMaterial 
        color="#FFD700" 
        metalness={1} 
        roughness={0.05} 
        envMapIntensity={2} 
        clearcoat={1}
        clearcoatRoughness={0.1}
        reflectivity={1}
      />
    </mesh>
  );

  return (
    <group ref={groupRef} scale={1.2} rotation={[0.2, 0, 0]}>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} />
      
      {/* Primary Mirror (18 segments) */}
      <group position={[0, 1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <MirrorSegment position={[0, 0, 0]} />
        {/* Inner Ring */}
        {[...Array(6)].map((_, i) => {
          const angle = (i * Math.PI) / 3;
          const radius = 0.7;
          return <MirrorSegment key={`inner-${i}`} position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]} rotation={[0, 0, angle]} />;
        })}
        {/* Outer Ring */}
        {[...Array(11)].map((_, i) => {
          const angle = (i * Math.PI * 2) / 12;
          const radius = 1.4;
          return <MirrorSegment key={`outer-${i}`} position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]} rotation={[0, 0, angle]} />;
        })}
        {showLabels && (
          <Html position={[0, 2, 0]} center>
            <div className="bg-black/80 text-amber-400 text-[10px] px-2 py-1 rounded border border-amber-500/30 backdrop-blur-md whitespace-nowrap font-mono uppercase tracking-widest">
              Primary Mirror (Beryllium/Gold)
            </div>
          </Html>
        )}
      </group>

      {/* Secondary Mirror Support Structure */}
      <group position={[0, 1, 2]}>
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.1, 6]} />
          <meshPhysicalMaterial 
            color="#FFD700" 
            metalness={1} 
            roughness={0.05} 
            envMapIntensity={2} 
            clearcoat={1}
            clearcoatRoughness={0.1}
            reflectivity={1}
          />
        </mesh>
        {/* Struts */}
        <mesh position={[0, 1.5, -1]} rotation={[-0.5, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 3]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[-1.3, -0.7, -1]} rotation={[0.5, 0.5, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 3]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[1.3, -0.7, -1]} rotation={[0.5, -0.5, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 3]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.3} />
        </mesh>
        {showLabels && (
          <Html position={[0, 0.5, 0]} center>
            <div className="bg-black/80 text-zinc-300 text-[10px] px-2 py-1 rounded border border-zinc-500/30 backdrop-blur-md whitespace-nowrap font-mono uppercase tracking-widest">
              Secondary Mirror
            </div>
          </Html>
        )}
      </group>

      {/* Sunshield (5 layers) */}
      <group position={[0, -0.5, 0]} rotation={[0, 0, 0]}>
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[0, -i * 0.15, 0]} rotation={[-0.1, 0, 0]}>
            <planeGeometry args={[8, 4]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.4} roughness={0.6} side={THREE.DoubleSide} transparent opacity={0.9} />
          </mesh>
        ))}
        {showLabels && (
          <Html position={[-3, -0.5, 0]} center>
            <div className="bg-black/80 text-blue-400 text-[10px] px-2 py-1 rounded border border-blue-500/30 backdrop-blur-md whitespace-nowrap font-mono uppercase tracking-widest">
              5-Layer Kapton Sunshield
            </div>
          </Html>
        )}
      </group>

      {/* Spacecraft Bus & Solar Array */}
      <group position={[0, -1.5, 0]}>
        <Box args={[1.5, 0.8, 1.5]}>
          <meshPhysicalMaterial 
            color="#cbd5e1" 
            metalness={1} 
            roughness={0.3} 
            envMapIntensity={1.5}
            clearcoat={0.5}
            clearcoatRoughness={0.2}
          />
        </Box>
        <mesh position={[0, -0.4, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1, 2]} />
          <meshStandardMaterial color="#1e3a8a" metalness={0.9} roughness={0.1} side={THREE.DoubleSide} />
        </mesh>
        {showLabels && (
          <Html position={[0, -1, 0]} center>
            <div className="bg-black/80 text-emerald-400 text-[10px] px-2 py-1 rounded border border-emerald-500/30 backdrop-blur-md whitespace-nowrap font-mono uppercase tracking-widest">
              Spacecraft Bus
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}
