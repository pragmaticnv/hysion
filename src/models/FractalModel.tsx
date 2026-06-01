import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Text, Html, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function MengerSponge({ iteration, size, position }: { iteration: number; size: number; position: [number, number, number] }) {
  if (iteration === 0) {
    return (
      <Box args={[size, size, size]} position={position}>
        <meshStandardMaterial color="#10b981" metalness={0.8} roughness={0.2} emissive="#10b981" emissiveIntensity={0.2} />
      </Box>
    );
  }

  const newSize = size / 3;
  const cubes = [];

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const sum = Math.abs(x) + Math.abs(y) + Math.abs(z);
        if (sum > 1) {
          cubes.push(
            <MengerSponge
              key={`${x}-${y}-${z}`}
              iteration={iteration - 1}
              size={newSize}
              position={[
                position[0] + x * newSize,
                position[1] + y * newSize,
                position[2] + z * newSize,
              ]}
            />
          );
        }
      }
    }
  }

  return <group>{cubes}</group>;
}

export function FractalModel({ showLabels, ...props }: { showLabels?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.2;
      groupRef.current.rotation.x = t * 0.1;
    }
  });

  return (
    <group ref={groupRef} scale={1.5} {...props}>
      <Sparkles count={50} scale={5} size={2} speed={0.3} opacity={0.4} color="#10b981" />
      
      {/* Menger Sponge Iteration 2 (3 is too heavy for real-time rendering in a complex scene) */}
      <MengerSponge iteration={2} size={3} position={[0, 0, 0]} />

      {showLabels && (
        <Html position={[0, 3, 0]} center className="pointer-events-none">
          <div className="px-4 py-2 bg-black/80 backdrop-blur-md border border-emerald-500/30 rounded-xl text-[10px] text-emerald-400 font-mono uppercase tracking-widest shadow-lg flex flex-col items-center gap-1">
            <span className="font-bold">Menger Sponge</span>
            <span className="text-[8px] opacity-70">Fractal Dimension: ~2.727</span>
          </div>
        </Html>
      )}


    </group>
  );
}
