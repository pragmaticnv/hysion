import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Box, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

export function ColosseumModel({ showLabels, ...props }: { showLabels?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.05;
    }
  });

  const stoneMaterial = new THREE.MeshStandardMaterial({
    color: '#d4c4a8',
    roughness: 0.9,
    metalness: 0.1,
  });

  const innerMaterial = new THREE.MeshStandardMaterial({
    color: '#8b7355',
    roughness: 1,
    metalness: 0,
  });

  return (
    <group ref={groupRef} scale={1.5} {...props}>
      {/* Base / Arena Floor */}
      <Cylinder args={[4, 4, 0.2, 64]} position={[0, -0.1, 0]} material={innerMaterial} castShadow receiveShadow />
      
      {/* Outer Wall (Tier 1) */}
      <Cylinder args={[4.2, 4.2, 1, 64, 1, true]} position={[0, 0.5, 0]} material={stoneMaterial} castShadow receiveShadow />
      {/* Outer Wall (Tier 2) */}
      <Cylinder args={[4.2, 4.2, 1, 64, 1, true]} position={[0, 1.5, 0]} material={stoneMaterial} castShadow receiveShadow />
      {/* Outer Wall (Tier 3) */}
      <Cylinder args={[4.2, 4.2, 1, 64, 1, true]} position={[0, 2.5, 0]} material={stoneMaterial} castShadow receiveShadow />

      {/* Inner Wall */}
      <Cylinder args={[3.2, 3.2, 2.5, 64, 1, true]} position={[0, 1.25, 0]} material={stoneMaterial} castShadow receiveShadow />

      {/* Arches (Simulated with boxes for a stylized look) */}
      {[...Array(32)].map((_, i) => {
        const angle = (i / 32) * Math.PI * 2;
        const x = Math.cos(angle) * 4.2;
        const z = Math.sin(angle) * 4.2;
        return (
          <group key={i} position={[x, 0, z]} rotation={[0, -angle, 0]}>
            <Box args={[0.2, 1, 0.2]} position={[0, 0.5, 0]} material={stoneMaterial} castShadow receiveShadow />
            <Box args={[0.2, 1, 0.2]} position={[0, 1.5, 0]} material={stoneMaterial} castShadow receiveShadow />
            <Box args={[0.2, 1, 0.2]} position={[0, 2.5, 0]} material={stoneMaterial} castShadow receiveShadow />
          </group>
        );
      })}

      {showLabels && (
        <Html position={[0, 4, 0]} center className="pointer-events-none">
          <div className="px-4 py-2 bg-black/80 backdrop-blur-md border border-amber-500/30 rounded-xl text-[10px] text-amber-400 font-mono uppercase tracking-widest shadow-lg flex flex-col items-center gap-1">
            <span className="font-bold">Colosseum</span>
            <span className="text-[8px] opacity-70">Flavian Amphitheatre</span>
          </div>
        </Html>
      )}
    </group>
  );
}
