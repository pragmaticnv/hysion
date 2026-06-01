import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Icosahedron, Dodecahedron, Octahedron, Tetrahedron, Box, Torus, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

export function GeometryModel({ showLabels, ...props }: { showLabels?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const icoRef = useRef<THREE.Mesh>(null);
  const dodRef = useRef<THREE.Mesh>(null);
  const octRef = useRef<THREE.Mesh>(null);
  const tetRef = useRef<THREE.Mesh>(null);
  const boxRef = useRef<THREE.Mesh>(null);
  const torRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.1;
    }
    const rotSpeed = t * 0.5;
    if (icoRef.current) icoRef.current.rotation.set(rotSpeed, rotSpeed, 0);
    if (dodRef.current) dodRef.current.rotation.set(rotSpeed, rotSpeed, 0);
    if (octRef.current) octRef.current.rotation.set(rotSpeed, rotSpeed, 0);
    if (tetRef.current) tetRef.current.rotation.set(rotSpeed, rotSpeed, 0);
    if (boxRef.current) boxRef.current.rotation.set(rotSpeed, rotSpeed, 0);
    if (torRef.current) torRef.current.rotation.set(rotSpeed, rotSpeed, 0);
  });

  const material = new THREE.MeshPhysicalMaterial({
    color: '#3b82f6',
    metalness: 0.1,
    roughness: 0.2,
    transmission: 0.9,
    ior: 1.5,
    thickness: 0.5,
    clearcoat: 1,
  });

  const wireMaterial = new THREE.MeshBasicMaterial({
    color: '#60a5fa',
    wireframe: true,
    transparent: true,
    opacity: 0.3,
  });

  return (
    <group ref={groupRef} scale={1.2} {...props}>
      {/* Center: Icosahedron */}
      <group position={[0, 0, 0]}>
        <Icosahedron ref={icoRef} args={[1.5, 0]} material={material} />
        <Icosahedron args={[1.5, 0]} material={wireMaterial} />
        {showLabels && (
          <Html position={[0, 2.5, 0]} center className="pointer-events-none">
            <div className="px-3 py-1 bg-black/80 backdrop-blur-md border border-blue-500/30 rounded-lg text-[10px] text-blue-400 font-mono uppercase tracking-widest shadow-lg">
              Icosahedron (20 Faces)
            </div>
          </Html>
        )}
      </group>

      {/* Orbiting Shapes */}
      <group position={[4, 0, 0]}>
        <Dodecahedron ref={dodRef} args={[1, 0]} material={material} />
        <Dodecahedron args={[1, 0]} material={wireMaterial} />
        {showLabels && (
          <Html position={[0, 1.8, 0]} center className="pointer-events-none">
            <div className="px-2 py-1 bg-black/80 backdrop-blur-md border border-blue-500/30 rounded-lg text-[8px] text-blue-400 font-mono uppercase tracking-widest shadow-lg">
              Dodecahedron (12)
            </div>
          </Html>
        )}
      </group>

      <group position={[-4, 0, 0]}>
        <Octahedron ref={octRef} args={[1, 0]} material={material} />
        <Octahedron args={[1, 0]} material={wireMaterial} />
        {showLabels && (
          <Html position={[0, 1.8, 0]} center className="pointer-events-none">
            <div className="px-2 py-1 bg-black/80 backdrop-blur-md border border-blue-500/30 rounded-lg text-[8px] text-blue-400 font-mono uppercase tracking-widest shadow-lg">
              Octahedron (8)
            </div>
          </Html>
        )}
      </group>

      <group position={[0, 0, 4]}>
        <Tetrahedron ref={tetRef} args={[1, 0]} material={material} />
        <Tetrahedron args={[1, 0]} material={wireMaterial} />
        {showLabels && (
          <Html position={[0, 1.8, 0]} center className="pointer-events-none">
            <div className="px-2 py-1 bg-black/80 backdrop-blur-md border border-blue-500/30 rounded-lg text-[8px] text-blue-400 font-mono uppercase tracking-widest shadow-lg">
              Tetrahedron (4)
            </div>
          </Html>
        )}
      </group>

      <group position={[0, 0, -4]}>
        <Box ref={boxRef} args={[1.2, 1.2, 1.2]} material={material} />
        <Box args={[1.2, 1.2, 1.2]} material={wireMaterial} />
        {showLabels && (
          <Html position={[0, 1.8, 0]} center className="pointer-events-none">
            <div className="px-2 py-1 bg-black/80 backdrop-blur-md border border-blue-500/30 rounded-lg text-[8px] text-blue-400 font-mono uppercase tracking-widest shadow-lg">
              Hexahedron (6)
            </div>
          </Html>
        )}
      </group>

      <group position={[-4, 0, 4]}>
        <Torus ref={torRef} args={[0.8, 0.3, 16, 32]} material={material} />
        <Torus args={[0.8, 0.3, 16, 32]} material={wireMaterial} />
        {showLabels && (
          <Html position={[0, 1.8, 0]} center className="pointer-events-none">
            <div className="px-2 py-1 bg-black/80 backdrop-blur-md border border-blue-500/30 rounded-lg text-[8px] text-blue-400 font-mono uppercase tracking-widest shadow-lg">
              Torus
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}
