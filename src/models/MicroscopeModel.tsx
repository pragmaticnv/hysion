import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Box, Torus, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';

export function MicroscopeModel({ showLabels, ...props }: { showLabels?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const turretRef = useRef<THREE.Group>(null);
  const diaphragmRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.05;
    }
    if (turretRef.current) {
      turretRef.current.rotation.y = Math.sin(t * 0.3) * 0.15;
    }
    if (diaphragmRef.current) {
       diaphragmRef.current.rotation.y = t * 0.5;
    }
  });

  const chromeMaterial = new THREE.MeshPhysicalMaterial({
    color: '#e2e8f0',
    metalness: 1.0,
    roughness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    envMapIntensity: 2.0
  });

  const brushedSteelMaterial = new THREE.MeshPhysicalMaterial({
    color: '#94a3b8',
    metalness: 0.9,
    roughness: 0.3,
    clearcoat: 0.2
  });

  const deepNavyAlloy = new THREE.MeshPhysicalMaterial({
    color: '#0f172a',
    metalness: 0.8,
    roughness: 0.15,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05
  });

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    transmission: 1.0,
    thickness: 0.5,
    roughness: 0.0,
    ior: 1.5,
  });

  const rubberMaterial = new THREE.MeshStandardMaterial({
    color: '#111827',
    roughness: 0.9,
    metalness: 0.0
  });
  
  const ledMaterial = new THREE.MeshStandardMaterial({
    color: '#0ea5e9',
    emissive: '#0ea5e9',
    emissiveIntensity: 5,
    toneMapped: false
  });

  const amberLedMaterial = new THREE.MeshStandardMaterial({
    color: '#f59e0b',
    emissive: '#f59e0b',
    emissiveIntensity: 2,
    toneMapped: false
  });

  return (
    <group ref={groupRef} scale={1.0} {...props}>
      <group position={[0, -2.8, 0.3]}>
        {/* Heavy Ergonomic Base */}
        <group position={[0, -0.2, 0]}>
          <Box args={[3.2, 0.4, 4]} material={deepNavyAlloy} />
          <Box args={[3.4, 0.1, 4.2]} position={[0, -0.2, 0]} material={rubberMaterial} />
          {/* Foot detail */}
          <Box args={[0.5, 0.2, 0.5]} position={[1.3, -0.1, 1.7]} material={rubberMaterial} />
          <Box args={[0.5, 0.2, 0.5]} position={[-1.3, -0.1, 1.7]} material={rubberMaterial} />
          <Box args={[0.5, 0.2, 0.5]} position={[1.3, -0.1, -1.7]} material={rubberMaterial} />
          <Box args={[0.5, 0.2, 0.5]} position={[-1.3, -0.1, -1.7]} material={rubberMaterial} />
        </group>

        {/* Light Source Housing (Condenser) */}
        <group position={[0, 0.2, 0.5]}>
          <Cylinder args={[0.6, 0.6, 0.4, 32]} material={brushedSteelMaterial} />
          <Cylinder args={[0.45, 0.45, 0.1, 32]} position={[0, 0.25, 0]} material={glassMaterial} />
          <pointLight position={[0, 0.3, 0]} intensity={10} color="#0ea5e9" distance={3} />
          {/* Cooling Vents */}
          {Array.from({ length: 8 }).map((_, i) => (
             <Box key={i} args={[0.05, 0.3, 0.1]} position={[0.65 * Math.cos(i * Math.PI / 4), 0, 0.65 * Math.sin(i * Math.PI / 4)]} rotation={[0, -i * Math.PI / 4, 0]} material={deepNavyAlloy} />
          ))}
        </group>
        
        {/* Structural Support Column (The Arm) */}
        <group position={[0, 1.8, -1.2]}>
          <Cylinder args={[0.6, 0.8, 4.5, 32]} material={deepNavyAlloy} />
          {/* Chrome Rails */}
          <Cylinder args={[0.08, 0.08, 4, 16]} position={[0.4, 0, 0.4]} material={chromeMaterial} />
          <Cylinder args={[0.08, 0.08, 4, 16]} position={[-0.4, 0, 0.4]} material={chromeMaterial} />
        </group>
        
        {/* Observation Stage */}
        <group position={[0, 2.0, 0.5]}>
          <Box args={[2.5, 0.15, 2.5]} material={deepNavyAlloy} />
          {/* Stage Clips */}
          <Box args={[1.2, 0.05, 0.1]} position={[0.4, 0.15, 0.6]} rotation={[0, 0.2, 0]} material={chromeMaterial} />
          <Box args={[1.2, 0.05, 0.1]} position={[-0.4, 0.15, 0.6]} rotation={[0, -0.2, 0]} material={chromeMaterial} />
          {/* X-Y Controller Knobs (under stage) */}
          <Cylinder args={[0.15, 0.15, 0.4, 16]} position={[1.1, -0.2, 0.1]} material={rubberMaterial} />
          <Cylinder args={[0.12, 0.12, 0.6, 16]} position={[1.1, -0.3, 0.1]} material={brushedSteelMaterial} />
        </group>

        {/* Condenser Assembly (Above Stage) */}
        <group position={[0, 3.8, 0.5]}>
          {/* Main Head Casting */}
          <Box args={[1.4, 1.2, 1.8]} position={[0, 0.3, -0.8]} material={deepNavyAlloy} />
          
          {/* Objective Turret */}
          <group ref={turretRef} position={[0, -0.1, 0]}>
            <Cylinder args={[0.8, 0.8, 0.3, 32]} rotation={[0, 0, 0]} material={brushedSteelMaterial} />
            {/* Objective Lenses */}
            {[
              { angle: 0, scale: 0.8, color: '#ef4444' },
              { angle: (Math.PI * 2) / 3, scale: 1.0, color: '#eab308' },
              { angle: (Math.PI * 4) / 3, scale: 1.2, color: '#0ea5e9' }
            ].map((obj, i) => (
              <group key={i} rotation={[0, obj.angle, 0]}>
                <group position={[0.5, -0.4, 0]} rotation={[0.4, 0, 0]}>
                  <Cylinder args={[0.18, 0.15, 0.8, 32]} material={chromeMaterial} />
                  <Cylinder args={[0.2, 0.2, 0.1, 32]} position={[0, 0.3, 0]} material={deepNavyAlloy} />
                  {/* Color identifying ring */}
                  <Cylinder args={[0.19, 0.19, 0.05, 32]} position={[0, -0.2, 0]} material={new THREE.MeshStandardMaterial({ color: obj.color, emissive: obj.color, emissiveIntensity: 0.5 })} />
                  <Cylinder args={[0.12, 0.12, 0.1, 32]} position={[0, -0.4, 0]} material={glassMaterial} />
                </group>
              </group>
            ))}
          </group>

          {/* Binocular Viewing Head */}
          <group position={[0, 1.0, -1.0]} rotation={[-0.4, 0, 0]}>
            <Box args={[1.2, 0.8, 1]} material={deepNavyAlloy} />
            {/* Eyepiece Tubes */}
            <group position={[0.35, 0.6, 0.2]}>
              <Cylinder args={[0.22, 0.22, 0.8, 32]} material={chromeMaterial} />
              <Cylinder args={[0.25, 0.25, 0.25, 32]} position={[0, 0.45, 0]} material={rubberMaterial} />
              <Cylinder args={[0.18, 0.18, 0.05, 32]} position={[0, 0.58, 0]} material={glassMaterial} />
            </group>
            <group position={[-0.35, 0.6, 0.2]}>
              <Cylinder args={[0.22, 0.22, 0.8, 32]} material={chromeMaterial} />
              <Cylinder args={[0.25, 0.25, 0.25, 32]} position={[0, 0.45, 0]} material={rubberMaterial} />
              <Cylinder args={[0.18, 0.18, 0.05, 32]} position={[0, 0.58, 0]} material={glassMaterial} />
            </group>
          </group>
        </group>

        {/* Focus Adjustment Knobs */}
        <group position={[0.9, 2.5, -1.2]}>
          {/* Coarse Focus */}
          <Cylinder args={[0.6, 0.6, 0.3, 32]} rotation={[0, 0, Math.PI / 2]} material={rubberMaterial} />
          {/* Fine Focus */}
          <Cylinder args={[0.3, 0.3, 0.6, 32]} position={[0.25, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={brushedSteelMaterial} />
        </group>
        <group position={[-0.9, 2.5, -1.2]}>
          <Cylinder args={[0.6, 0.6, 0.3, 32]} rotation={[0, 0, Math.PI / 2]} material={rubberMaterial} />
          <Cylinder args={[0.3, 0.3, 0.6, 32]} position={[-0.25, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={brushedSteelMaterial} />
        </group>

        {/* Status Indicators */}
        <mesh position={[-1.2, 0.1, 1.5]} material={ledMaterial}>
          <sphereGeometry args={[0.05, 16, 16]} />
        </mesh>
        <mesh position={[-1.0, 0.1, 1.5]} material={amberLedMaterial}>
          <sphereGeometry args={[0.05, 16, 16]} />
        </mesh>
      </group>

      {showLabels && (
        <Html position={[0, 3.5, 0]} center className="pointer-events-none">
          <div className="px-5 py-3 bg-slate-900/90 backdrop-blur-xl border border-blue-500/30 rounded-2xl text-[11px] text-blue-400 font-mono uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(14,165,233,0.2)] flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="font-black text-white italic">ZENITH-X9</span>
            </div>
            <span className="text-[9px] text-slate-500 font-bold border-t border-slate-700/50 pt-1 w-full text-center">Nano-Scale Optical Processor</span>
          </div>
        </Html>
      )}
    </group>

  );
}
