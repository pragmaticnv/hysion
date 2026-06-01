import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function CellModel() {
  const groupRef = useRef<THREE.Group>(null);
  const nucleusRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.1;
      groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
    }
    if (nucleusRef.current) {
      nucleusRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.05);
    }
  });

  return (
    <group ref={groupRef} scale={1.5}>
      {/* Cell Membrane */}
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial color="#4ade80" transparent opacity={0.2} roughness={0.1} />
      </mesh>

      {/* Cytoplasm */}
      <mesh>
        <sphereGeometry args={[1.9, 32, 32]} />
        <meshStandardMaterial color="#86efac" transparent opacity={0.1} />
      </mesh>

      {/* Nucleus */}
      <mesh ref={nucleusRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#a855f7" roughness={0.3} emissive="#a855f7" emissiveIntensity={0.2} />
      </mesh>

      {/* Nucleolus */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#d8b4fe" />
      </mesh>

      {/* Mitochondria */}
      <group position={[1, 0.5, 0.5]} rotation={[0.5, 0.2, 0]}>
        <mesh>
          <capsuleGeometry args={[0.2, 0.4, 16, 16]} />
          <meshStandardMaterial color="#f97316" />
        </mesh>
      </group>
      <group position={[-0.8, -0.6, 0.8]} rotation={[-0.3, 0.8, 0]}>
        <mesh>
          <capsuleGeometry args={[0.15, 0.3, 16, 16]} />
          <meshStandardMaterial color="#f97316" />
        </mesh>
      </group>

      {/* Endoplasmic Reticulum (Simplified) */}
      <mesh position={[-0.5, 0.2, -0.5]} rotation={[0.2, 0, 0.5]}>
        <torusGeometry args={[0.8, 0.1, 16, 32]} />
        <meshStandardMaterial color="#3b82f6" transparent opacity={0.6} />
      </mesh>
      <mesh position={[-0.6, 0.1, -0.4]} rotation={[0.3, 0.1, 0.4]}>
        <torusGeometry args={[0.9, 0.08, 16, 32]} />
        <meshStandardMaterial color="#3b82f6" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}
