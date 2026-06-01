import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function EarthCoreModel() {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.05;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y = time * 0.2;
    }
  });

  return (
    <group ref={groupRef} scale={1.2}>
      {/* Crust (Cutaway) */}
      <mesh>
        <sphereGeometry args={[3, 64, 64, 0, Math.PI * 1.5]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.8} />
      </mesh>
      {/* Mantle */}
      <mesh>
        <sphereGeometry args={[2.8, 64, 64, 0, Math.PI * 1.5]} />
        <meshStandardMaterial color="#ef4444" roughness={0.6} emissive="#ef4444" emissiveIntensity={0.1} />
      </mesh>
      {/* Outer Core */}
      <mesh>
        <sphereGeometry args={[1.5, 64, 64, 0, Math.PI * 1.5]} />
        <meshStandardMaterial color="#f97316" roughness={0.2} emissive="#f97316" emissiveIntensity={0.4} />
      </mesh>
      {/* Inner Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#eab308" emissive="#eab308" emissiveIntensity={0.8} />
      </mesh>
      
      {/* Cutaway Faces */}
      <mesh rotation={[0, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="#78350f" side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="#78350f" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
