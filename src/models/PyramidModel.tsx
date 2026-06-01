import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Html, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export function PyramidModel({ showLabels, ...props }: { showLabels?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const [reveal, setReveal] = useState(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.05;
    }
  });

  const stoneMaterial = new THREE.MeshStandardMaterial({
    color: '#eab308',
    roughness: 0.9,
    metalness: 0.1,
  });

  const chamberMaterial = new THREE.MeshStandardMaterial({
    color: '#451a03',
    roughness: 1,
    metalness: 0,
  });

  return (
    <group ref={groupRef} scale={1.5} {...props}>
      <Sparkles count={40} scale={6} size={2} speed={0.1} opacity={0.3} color="#facc15" />
      
      {/* Main Pyramid Body */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow onClick={() => setReveal(!reveal)}>
        <coneGeometry args={[4, 4, 4]} />
        <meshStandardMaterial 
          color="#eab308" 
          roughness={0.8} 
          transparent={reveal} 
          opacity={reveal ? 0.3 : 1} 
          wireframe={reveal}
        />
      </mesh>

      {/* Internal Chambers (Visible when revealed) */}
      {reveal && (
        <group>
          {/* King's Chamber */}
          <Box args={[0.6, 0.4, 0.4]} position={[0, 1.2, 0]} material={chamberMaterial} />
          {/* Queen's Chamber */}
          <Box args={[0.4, 0.3, 0.3]} position={[0, 0.6, 0]} material={chamberMaterial} />
          {/* Grand Gallery */}
          <Box args={[0.2, 0.8, 1.5]} position={[0, 0.9, 0.5]} rotation={[0.5, 0, 0]} material={chamberMaterial} />
          {/* Descending Passage */}
          <Box args={[0.15, 0.15, 3]} position={[0, 0, 1.5]} rotation={[0.4, 0, 0]} material={chamberMaterial} />
        </group>
      )}

      {showLabels && (
        <Html position={[0, 4, 0]} center className="pointer-events-none">
          <div className="px-4 py-2 bg-black/80 backdrop-blur-md border border-yellow-500/30 rounded-xl text-[10px] text-yellow-400 font-mono uppercase tracking-widest shadow-lg flex flex-col items-center gap-1">
            <span className="font-bold">Great Pyramid of Giza</span>
            <span className="text-[8px] opacity-70">{reveal ? 'Internal Structure Revealed' : 'Click to Reveal Chambers'}</span>
          </div>
        </Html>
      )}

      {showLabels && reveal && (
        <>
          <Html position={[1, 1.2, 0]} center className="pointer-events-none">
            <div className="px-2 py-0.5 bg-black/60 border border-yellow-500/20 rounded text-[7px] text-yellow-200 uppercase">King's Chamber</div>
          </Html>
          <Html position={[1, 0.6, 0]} center className="pointer-events-none">
            <div className="px-2 py-0.5 bg-black/60 border border-yellow-500/20 rounded text-[7px] text-yellow-200 uppercase">Queen's Chamber</div>
          </Html>
        </>
      )}
    </group>
  );
}
