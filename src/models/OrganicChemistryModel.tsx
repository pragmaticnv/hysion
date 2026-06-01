import { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sphere, Cylinder, Text, Html, MeshTransmissionMaterial, Torus, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const MOLECULES = {
  Caffeine: {
    name: 'CAFFEINE (C8H10N4O2)',
    atoms: [
      { pos: [0, 0, 0], type: 'C' }, { pos: [1.4, 0, 0], type: 'C' }, { pos: [2.1, 1.2, 0], type: 'C' },
      { pos: [1.4, 2.4, 0], type: 'N' }, { pos: [0, 2.4, 0], type: 'C' }, { pos: [-0.7, 1.2, 0], type: 'N' },
      { pos: [2.8, 2.4, 0], type: 'C' }, { pos: [3.5, 1.2, 0], type: 'N' }, { pos: [0, -1.4, 0], type: 'O' },
      { pos: [2.1, 3.6, 0], type: 'O' }
    ],
    bonds: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [2, 7], [7, 6], [6, 3], [0, 8], [4, 9]]
  },
  Aspirin: {
    name: 'ASPIRIN (C9H8O4)',
    atoms: [
      { pos: [0, 0, 0], type: 'C' }, { pos: [1.4, 0, 0], type: 'C' }, { pos: [2.1, 1.2, 0], type: 'C' },
      { pos: [1.4, 2.4, 0], type: 'C' }, { pos: [0, 2.4, 0], type: 'C' }, { pos: [-0.7, 1.2, 0], type: 'C' },
      { pos: [2.8, 3.6, 0], type: 'O' }, { pos: [3.5, 2.4, 0], type: 'O' }, { pos: [-1.4, 2.4, 0], type: 'O' }
    ],
    bonds: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [3, 6], [6, 7], [4, 8]]
  },
  Ethanol: {
    name: 'ETHANOL (C2H5OH)',
    atoms: [
      { pos: [0, 0, 0], type: 'C' }, { pos: [1.5, 0, 0], type: 'C' }, { pos: [2.5, 1, 0], type: 'O' }
    ],
    bonds: [[0, 1], [1, 2]]
  }
};

export function OrganicChemistryModel({ showLabels, ...props }: { showLabels?: boolean }) {
  const [molecule, setMolecule] = useState<keyof typeof MOLECULES>('Caffeine');
  const groupRef = useRef<THREE.Group>(null);
  const baseRef = useRef<THREE.Group>(null);
  const [flicker, setFlicker] = useState(1);
  const { viewport } = useThree();

  const currentMolecule = MOLECULES[molecule];

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.1;
    }
    if (baseRef.current) {
      baseRef.current.rotation.y = -t * 0.1;
    }
    
    if (Math.random() > 0.98) {
      setFlicker(Math.random() * 0.4 + 0.6);
    } else {
      setFlicker(prev => prev + (1 - prev) * 0.1);
    }
  });

  return (
    <group {...props}>
      {/* Advanced Hologram Base */}
      <group position={[0, -6, 0]} ref={baseRef}>
        <Cylinder args={[6, 6.5, 0.6, 32]}>
          <meshStandardMaterial color="#050505" metalness={1} roughness={0.1} />
        </Cylinder>
        <Cylinder args={[5.8, 5.8, 0.1, 32]} position={[0, 0.35, 0]}>
          <meshBasicMaterial color="#ec4899" transparent opacity={0.4 * flicker} />
        </Cylinder>
        
        <Torus args={[5.5, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.4, 0]}>
          <meshBasicMaterial color="#ec4899" transparent opacity={0.2 * flicker} />
        </Torus>

        {[...Array(12)].map((_, i) => (
          <group key={i} rotation={[0, (i / 12) * Math.PI * 2, 0]}>
            <Cylinder args={[0.005, 0.05, 16, 8]} position={[4.5, 8, 0]} rotation={[0, 0, 0.02]}>
              <meshBasicMaterial color="#ec4899" transparent opacity={0.08 * flicker} blending={THREE.AdditiveBlending} />
            </Cylinder>
          </group>
        ))}
      </group>

      {/* Molecule Selector UI - Static Position */}
      {showLabels && (
        <Html position={[0, 5, 0]} center>
          <div className="flex gap-2 bg-black/60 backdrop-blur-md p-2 rounded-xl border border-white/10 pointer-events-auto">
            {(Object.keys(MOLECULES) as Array<keyof typeof MOLECULES>).map((name) => (
              <button
                key={name}
                onClick={(e) => { e.stopPropagation(); setMolecule(name); }}
                className={`px-3 py-1 rounded-lg text-[10px] uppercase font-bold transition-all cursor-pointer ${
                  molecule === name 
                    ? 'bg-pink-500 text-white shadow-[0_0_10px_rgba(236,72,153,0.5)]' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </Html>
      )}

      <group ref={groupRef} position={[0, 1, 0]}>
        <Sparkles count={100} scale={10} size={2} speed={0.4} opacity={0.2} color="#ec4899" />
        
        {currentMolecule.atoms.map((atom, i) => (
          <group key={i} position={atom.pos as [number, number, number]}>
            <Sphere args={[0.4, 32, 32]}>
              <MeshTransmissionMaterial
                color={atom.type === 'C' ? '#444444' : atom.type === 'N' ? '#3b82f6' : atom.type === 'O' ? '#ef4444' : '#ffffff'}
                transmission={0.9}
                thickness={0.5}
                roughness={0.1}
                emissive={atom.type === 'C' ? '#444444' : atom.type === 'N' ? '#3b82f6' : atom.type === 'O' ? '#ef4444' : '#ffffff'}
                emissiveIntensity={0.5 * flicker}
              />
            </Sphere>
            {showLabels && (
              <Html distanceFactor={10} position={[0, 0.6, 0]}>
                <div className="px-2 py-0.5 bg-black/80 border border-white/10 rounded text-[8px] text-white font-mono">
                  {atom.type}
                </div>
              </Html>
            )}
          </group>
        ))}

        {currentMolecule.bonds.map(([startIdx, endIdx], i) => {
          const start = new THREE.Vector3(...currentMolecule.atoms[startIdx].pos);
          const end = new THREE.Vector3(...currentMolecule.atoms[endIdx].pos);
          const distance = start.distanceTo(end);
          const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
          const dir = new THREE.Vector3().subVectors(end, start).normalize();
          const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
          
          return (
            <mesh key={i} position={midpoint} quaternion={quaternion}>
              <cylinderGeometry args={[0.08, 0.08, distance, 8]} />
              <meshStandardMaterial 
                color="#ffffff" 
                transparent 
                opacity={0.3 * flicker} 
                emissive="#ec4899" 
                emissiveIntensity={0.5}
              />
            </mesh>
          );
        })}
      </group>

      {showLabels && (
        <Html position={[0, 5, 0]} center className="pointer-events-none">
          <div className="flex flex-col items-center gap-2">
            <div className="px-4 py-2 bg-black/90 backdrop-blur-md border border-pink-500/40 rounded-full text-[10px] text-pink-400 font-mono tracking-[0.2em] uppercase whitespace-nowrap shadow-[0_0_30px_rgba(236,72,153,0.4)] flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
              Molecular Structure: {molecule}
            </div>
            <div className="w-px h-8 bg-gradient-to-b from-pink-500/50 to-transparent" />
          </div>
        </Html>
      )}


    </group>
  );
}
