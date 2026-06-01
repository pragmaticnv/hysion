import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function EngineModel() {
  const groupRef = useRef<THREE.Group>(null);
  const crankshaftRef = useRef<THREE.Group>(null);
  const piston1Ref = useRef<THREE.Group>(null);
  const piston2Ref = useRef<THREE.Group>(null);
  const piston3Ref = useRef<THREE.Group>(null);
  const piston4Ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const speed = time * 2;

    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.1;
    }

    if (crankshaftRef.current) {
      crankshaftRef.current.rotation.z = speed;
    }

    // Piston motion (simplified sine wave)
    const stroke = 1.5;
    if (piston1Ref.current) piston1Ref.current.position.y = Math.sin(speed) * stroke;
    if (piston2Ref.current) piston2Ref.current.position.y = Math.sin(speed + Math.PI) * stroke;
    if (piston3Ref.current) piston3Ref.current.position.y = Math.sin(speed + Math.PI) * stroke;
    if (piston4Ref.current) piston4Ref.current.position.y = Math.sin(speed) * stroke;
  });

  return (
    <group ref={groupRef} scale={0.8}>
      {/* Engine Block Outline */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[8, 6, 4]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={0.1} wireframe />
      </mesh>

      {/* Crankshaft */}
      <group ref={crankshaftRef} position={[0, -1, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 8, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Cylinders & Pistons */}
      {[
        { ref: piston1Ref, x: -3 },
        { ref: piston2Ref, x: -1 },
        { ref: piston3Ref, x: 1 },
        { ref: piston4Ref, x: 3 },
      ].map((piston, i) => (
        <group key={i} position={[piston.x, 0, 0]}>
          {/* Cylinder Sleeve */}
          <mesh position={[0, 2.5, 0]}>
            <cylinderGeometry args={[0.8, 0.8, 4, 32]} />
            <meshStandardMaterial color="#64748b" transparent opacity={0.3} side={THREE.DoubleSide} />
          </mesh>
          {/* Piston Head */}
          <group ref={piston.ref} position={[0, 2.5, 0]}>
            <mesh position={[0, 1.5, 0]}>
              <cylinderGeometry args={[0.75, 0.75, 1, 32]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.6} roughness={0.4} />
            </mesh>
            {/* Connecting Rod (Simplified) */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.2, 3, 0.2]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.5} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}
