import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useGLTF, Float, MeshDistortMaterial, Sparkles, Cylinder, Torus, Sphere } from '@react-three/drei';
import * as THREE from 'three';

export function JetEngineModel({ showLabels = true }: { showLabels?: boolean }) {
  const fanRef = useRef<THREE.Group>(null);
  const compressorRef = useRef<THREE.Group>(null);
  const turbineRef = useRef<THREE.Group>(null);
  const exhaustRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (fanRef.current) fanRef.current.rotation.z -= delta * 15;
    if (compressorRef.current) compressorRef.current.rotation.z -= delta * 25;
    if (turbineRef.current) turbineRef.current.rotation.z -= delta * 25;
    
    if (exhaustRef.current) {
      const material = exhaustRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 2 + Math.sin(state.clock.elapsedTime * 20) * 0.5;
    }
  });

  return (
    <group rotation={[0, Math.PI / 4, 0]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={2} />
      <pointLight position={[-5, 0, 0]} intensity={5} color="#ffaa00" distance={10} />

      {/* Outer Casing (Cutaway) */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[2.2, 2.2, 8, 32, 1, true, 0, Math.PI]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* Fan Blades */}
      <group ref={fanRef} position={[-3.5, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <Cylinder args={[0.5, 0.5, 0.5, 16]}>
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
        </Cylinder>
        {[...Array(24)].map((_, i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI * 2) / 24]}>
            <boxGeometry args={[0.1, 4, 0.3]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
      </group>
      {showLabels && (
        <Html position={[-3.5, 2.5, 0]} center>
          <div className="bg-black/80 text-cyan-400 text-[10px] px-2 py-1 rounded border border-cyan-500/30 backdrop-blur-md whitespace-nowrap font-mono uppercase tracking-widest">
            Titanium Fan
          </div>
        </Html>
      )}

      {/* Compressor Section */}
      <group ref={compressorRef} position={[-1.5, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <Cylinder args={[0.8, 1.2, 3, 32]}>
          <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
        </Cylinder>
        {[...Array(5)].map((_, stage) => (
          <group key={stage} position={[0, -1 + stage * 0.5, 0]}>
            {[...Array(36)].map((_, i) => (
              <mesh key={i} rotation={[0, 0, (i * Math.PI * 2) / 36]}>
                <boxGeometry args={[0.05, 1.5 + stage * 0.2, 0.1]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
      {showLabels && (
        <Html position={[-1.5, 1.5, 0]} center>
          <div className="bg-black/80 text-emerald-400 text-[10px] px-2 py-1 rounded border border-emerald-500/30 backdrop-blur-md whitespace-nowrap font-mono uppercase tracking-widest">
            High-Pressure Compressor
          </div>
        </Html>
      )}

      {/* Combustion Chamber */}
      <group position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <Torus args={[1.2, 0.4, 16, 32]}>
          <meshStandardMaterial color="#b91c1c" metalness={0.5} roughness={0.5} emissive="#ef4444" emissiveIntensity={0.5} />
        </Torus>
        <Sparkles count={200} scale={3} size={2} speed={0.4} opacity={0.8} color="#f59e0b" />
        {showLabels && (
          <Html position={[1.5, 1.5, 0]} center>
            <div className="bg-black/80 text-orange-400 text-[10px] px-2 py-1 rounded border border-orange-500/30 backdrop-blur-md whitespace-nowrap font-mono uppercase tracking-widest">
              Combustion Chamber (2000°C)
            </div>
          </Html>
        )}
      </group>

      {/* Turbine Section */}
      <group ref={turbineRef} position={[2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <Cylinder args={[1.2, 0.8, 2, 32]}>
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
        </Cylinder>
        {[...Array(3)].map((_, stage) => (
          <group key={stage} position={[0, -0.5 + stage * 0.5, 0]}>
            {[...Array(24)].map((_, i) => (
              <mesh key={i} rotation={[0, 0, (i * Math.PI * 2) / 24]}>
                <boxGeometry args={[0.08, 2.2 - stage * 0.2, 0.15]} />
                <meshStandardMaterial color="#f87171" metalness={0.9} roughness={0.1} emissive="#991b1b" emissiveIntensity={0.2} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
      {showLabels && (
        <Html position={[2, 1.5, 0]} center>
          <div className="bg-black/80 text-red-400 text-[10px] px-2 py-1 rounded border border-red-500/30 backdrop-blur-md whitespace-nowrap font-mono uppercase tracking-widest">
            Turbine Stages
          </div>
        </Html>
      )}

      {/* Exhaust */}
      <mesh ref={exhaustRef} position={[3.5, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[1.5, 1.8, 2, 32, 1, true]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.4} emissive="#ea580c" emissiveIntensity={1} side={THREE.DoubleSide} />
        {showLabels && (
          <Html position={[0, 2, 0]} center>
            <div className="bg-black/80 text-amber-400 text-[10px] px-2 py-1 rounded border border-amber-500/30 backdrop-blur-md whitespace-nowrap font-mono uppercase tracking-widest">
              Exhaust Nozzle
            </div>
          </Html>
        )}
      </mesh>
      
      {/* Central Shaft */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 8, 16]} />
        <meshStandardMaterial color="#cbd5e1" metalness={1} roughness={0.1} />
      </mesh>
    </group>
  );
}
