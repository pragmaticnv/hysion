import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sphere, Cylinder, Text, Html, MeshTransmissionMaterial, Torus, Sparkles } from '@react-three/drei';
import { useSphere } from '@react-three/cannon';
import * as THREE from 'three';

function PhysicsAtom({ position, color, flicker, physicsEnabled }: { position: THREE.Vector3, color: string, flicker: number, physicsEnabled: boolean }) {
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: [position.x, position.y, position.z],
    type: physicsEnabled ? 'Dynamic' : 'Static',
    args: [0.3],
  }), useRef<THREE.Mesh>(null));

  useEffect(() => {
    if (!physicsEnabled) {
      api.position.set(position.x, position.y, position.z);
      api.velocity.set(0, 0, 0);
      api.angularVelocity.set(0, 0, 0);
    }
  }, [physicsEnabled, api, position]);

  return (
    <Sphere ref={ref as any} args={[0.3, 32, 32]} castShadow>
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.9}
        roughness={0.1}
        metalness={0.8}
        emissive={color}
        emissiveIntensity={0.6 * flicker}
      />
      <pointLight color={color} intensity={2 * flicker} distance={2} decay={2} />
    </Sphere>
  );
}

const LATTICES = {
  Simple: { name: 'SIMPLE CUBIC', positions: [[0,0,0], [1,0,0], [0,1,0], [0,0,1], [1,1,0], [1,0,1], [0,1,1], [1,1,1]] },
  BCC: { name: 'BODY-CENTERED CUBIC', positions: [[0,0,0], [1,0,0], [0,1,0], [0,0,1], [1,1,0], [1,0,1], [0,1,1], [1,1,1], [0.5,0.5,0.5]] },
  FCC: { name: 'FACE-CENTERED CUBIC', positions: [[0,0,0], [1,0,0], [0,1,0], [0,0,1], [1,1,0], [1,0,1], [0,1,1], [1,1,1], [0.5,0.5,0], [0.5,0.5,1], [0.5,0,0.5], [0.5,1,0.5], [0,0.5,0.5], [1,0.5,0.5]] }
};

export function CrystalLattice({ showLabels, physicsEnabled = false, ...props }: { showLabels?: boolean, physicsEnabled?: boolean }) {
  const [type, setType] = useState<keyof typeof LATTICES>('BCC');
  const groupRef = useRef<THREE.Group>(null);
  const baseRef = useRef<THREE.Group>(null);
  const [flicker, setFlicker] = useState(1);
  const { viewport } = useThree();

  const currentLattice = LATTICES[type];

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.05;
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.1;
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

  const { atoms, bonds } = useMemo(() => {
    const a: THREE.Vector3[] = [];
    const b: { start: THREE.Vector3, end: THREE.Vector3 }[] = [];
    const size = 6;
    const halfSize = size / 2;

    currentLattice.positions.forEach(p => {
      a.push(new THREE.Vector3(p[0] * size - halfSize, p[1] * size - halfSize, p[2] * size - halfSize));
    });

    for (let i = 0; i < a.length; i++) {
      for (let j = i + 1; j < a.length; j++) {
        const dist = a[i].distanceTo(a[j]);
        if (dist < size * 1.1) {
          b.push({ start: a[i], end: a[j] });
        }
      }
    }

    return { atoms: a, bonds: b };
  }, [type]);

  return (
    <group {...props}>
      {/* Advanced Hologram Base */}
      <group position={[0, -6, 0]} ref={baseRef}>
        <Cylinder args={[6, 6.5, 0.6, 32]}>
          <meshStandardMaterial color="#050505" metalness={1} roughness={0.1} />
        </Cylinder>
        <Cylinder args={[5.8, 5.8, 0.1, 32]} position={[0, 0.35, 0]}>
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.4 * flicker} />
        </Cylinder>
        
        <Torus args={[5.5, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.4, 0]}>
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.2 * flicker} />
        </Torus>

        {[...Array(12)].map((_, i) => (
          <group key={i} rotation={[0, (i / 12) * Math.PI * 2, 0]}>
            <Cylinder args={[0.01, 0.1, 16, 8]} position={[4.5, 8, 0]} rotation={[0, 0, 0.02]}>
              <meshBasicMaterial color="#3b82f6" transparent opacity={0.15 * flicker} blending={THREE.AdditiveBlending} />
            </Cylinder>
          </group>
        ))}
        {/* Central Beam */}
        <Cylinder args={[0.05, 0.5, 16, 8]} position={[0, 8, 0]}>
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.05 * flicker} blending={THREE.AdditiveBlending} />
        </Cylinder>
      </group>

      {/* Lattice Selector UI - Static Position */}
      {showLabels && (
        <Html position={[0, 5, 0]} center>
          <div className="flex gap-2 bg-black/60 backdrop-blur-md p-2 rounded-xl border border-white/10 pointer-events-auto">
            {(Object.keys(LATTICES) as Array<keyof typeof LATTICES>).map((name) => (
              <button
                key={name}
                onClick={(e) => { e.stopPropagation(); setType(name); }}
                className={`px-3 py-1 rounded-lg text-[10px] uppercase font-bold transition-all cursor-pointer ${
                  type === name 
                    ? 'bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </Html>
      )}

      <group ref={groupRef}>
        <Sparkles count={100} scale={10} size={2} speed={0.4} opacity={0.2} color="#3b82f6" />
        
        {/* Central Holographic Core */}
        <Sphere args={[1.5, 32, 32]}>
          <meshStandardMaterial 
            color="#3b82f6"
            transparent
            opacity={0.15 * flicker}
            emissive="#3b82f6"
            emissiveIntensity={0.5}
            roughness={0.1}
            metalness={0.5}
          />
        </Sphere>

        {atoms.map((pos, i) => (
          <PhysicsAtom 
            key={i} 
            position={pos} 
            color={i % 2 === 0 ? '#ec4899' : '#3b82f6'} 
            flicker={flicker} 
            physicsEnabled={physicsEnabled} 
          />
        ))}

        {!physicsEnabled && bonds.map((bond, i) => {
          const distance = bond.start.distanceTo(bond.end);
          const midpoint = new THREE.Vector3().addVectors(bond.start, bond.end).multiplyScalar(0.5);
          const dir = new THREE.Vector3().subVectors(bond.end, bond.start).normalize();
          const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
          
          return (
            <mesh
              key={i}
              position={midpoint}
              quaternion={quaternion}
            >
              <cylinderGeometry args={[0.04, 0.04, distance, 8]} />
              <meshStandardMaterial 
                color="#ffffff" 
                transparent 
                opacity={0.2 * flicker} 
                emissive="#3b82f6" 
                emissiveIntensity={0.5}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          );
        })}

        {/* Holographic Scanlines / Grid Overlay */}
        <Sphere args={[7, 32, 32]}>
          <meshBasicMaterial 
            color="#3b82f6" 
            wireframe 
            transparent 
            opacity={0.03 * flicker} 
          />
        </Sphere>
      </group>

      {showLabels && (
        <Html position={[0, 5, 0]} center className="pointer-events-none">
          <div className="flex flex-col items-center gap-2">
            <div className="px-4 py-2 bg-black/90 backdrop-blur-md border border-blue-500/40 rounded-full text-[10px] text-blue-400 font-mono tracking-[0.2em] uppercase whitespace-nowrap shadow-[0_0_30px_rgba(59,130,246,0.4)] flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              {currentLattice.name} Structure
            </div>
          </div>
        </Html>
      )}

      {showLabels && atoms.length > 0 && (
        <Html position={[atoms[0].x, atoms[0].y + 0.5, atoms[0].z]} center className="pointer-events-none">
          <div className="px-2 py-1 bg-black/80 backdrop-blur-sm border border-pink-500/30 rounded text-[8px] text-pink-200 font-mono tracking-wider uppercase whitespace-nowrap">
            Lattice Point (Atom)
          </div>
        </Html>
      )}

      {showLabels && bonds.length > 0 && (
        <Html position={[
          (bonds[0].start.x + bonds[0].end.x) / 2, 
          (bonds[0].start.y + bonds[0].end.y) / 2, 
          (bonds[0].start.z + bonds[0].end.z) / 2
        ]} center className="pointer-events-none">
          <div className="px-2 py-1 bg-black/80 backdrop-blur-sm border border-blue-500/30 rounded text-[8px] text-blue-200 font-mono tracking-wider uppercase whitespace-nowrap">
            Unit Cell Bond
          </div>
        </Html>
      )}


    </group>
  );
}
