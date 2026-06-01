import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Box, Cylinder, Sphere } from '@react-three/drei';
import * as THREE from 'three';

export function MarsRoverModel({ showLabels = true }: { showLabels?: boolean }) {
  const mastRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Group[]>([]);
  const armRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (mastRef.current) {
      mastRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
    }
    wheelsRef.current.forEach((wheel, i) => {
      if (wheel) wheel.rotation.x = state.clock.elapsedTime * 2;
    });
    if (armRef.current) {
      armRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.2 + 0.2;
    }
  });

  const Wheel = ({ position }: { position: [number, number, number] }) => (
    <group position={position} ref={(el) => { if (el) wheelsRef.current.push(el); }}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
        <meshStandardMaterial color="#1e293b" metalness={0.2} roughness={0.9} />
      </mesh>
      {/* Treads */}
      {[...Array(12)].map((_, i) => (
        <mesh key={i} rotation={[i * (Math.PI / 6), 0, 0]} position={[0, Math.cos(i * (Math.PI / 6)) * 0.4, Math.sin(i * (Math.PI / 6)) * 0.4]}>
          <boxGeometry args={[0.32, 0.05, 0.1]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      ))}
    </group>
  );

  return (
    <group scale={1.5} rotation={[0.2, -Math.PI / 4, 0]}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} color="#fcd34d" />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#fbbf24" />

      {/* Main Body */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[2, 0.8, 3]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.5} roughness={0.5} />
      </mesh>
      {showLabels && (
        <Html position={[0, 1, 1.5]} center>
          <div className="bg-black/80 text-zinc-300 text-[10px] px-2 py-1 rounded border border-zinc-500/30 backdrop-blur-md whitespace-nowrap font-mono uppercase tracking-widest">
            Chassis (WEB)
          </div>
        </Html>
      )}

      {/* RTG Power Source */}
      <mesh position={[0, 1.2, -1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.8, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.4} />
      </mesh>
      {showLabels && (
        <Html position={[0, 1.8, -1.2]} center>
          <div className="bg-black/80 text-orange-400 text-[10px] px-2 py-1 rounded border border-orange-500/30 backdrop-blur-md whitespace-nowrap font-mono uppercase tracking-widest">
            MMRTG Power Source
          </div>
        </Html>
      )}

      {/* Mast & Cameras */}
      <group ref={mastRef} position={[0.8, 1.4, 1]}>
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 1.6]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.6, 0]}>
          <boxGeometry args={[0.4, 0.2, 0.2]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.5} roughness={0.5} />
        </mesh>
        {/* Lenses */}
        <mesh position={[0.1, 1.6, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.05]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[-0.1, 1.6, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.05]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        {showLabels && (
          <Html position={[0, 2, 0]} center>
            <div className="bg-black/80 text-cyan-400 text-[10px] px-2 py-1 rounded border border-cyan-500/30 backdrop-blur-md whitespace-nowrap font-mono uppercase tracking-widest">
              SuperCam / Mastcam-Z
            </div>
          </Html>
        )}
      </group>

      {/* Robotic Arm */}
      <group ref={armRef} position={[0, 1, 1.5]}>
        <mesh position={[0, 0, 0.8]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 1.6]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 1.6]}>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
        </mesh>
        {showLabels && (
          <Html position={[0, 0.5, 1.6]} center>
            <div className="bg-black/80 text-emerald-400 text-[10px] px-2 py-1 rounded border border-emerald-500/30 backdrop-blur-md whitespace-nowrap font-mono uppercase tracking-widest">
              Turret / PIXL / SHERLOC
            </div>
          </Html>
        )}
      </group>

      {/* Suspension (Rocker-Bogie) & Wheels */}
      <group position={[0, 0, 0]}>
        {/* Left Side */}
        <Wheel position={[-1.2, 0.4, 1.2]} />
        <Wheel position={[-1.2, 0.4, 0]} />
        <Wheel position={[-1.2, 0.4, -1.2]} />
        {/* Right Side */}
        <Wheel position={[1.2, 0.4, 1.2]} />
        <Wheel position={[1.2, 0.4, 0]} />
        <Wheel position={[1.2, 0.4, -1.2]} />
        
        {/* Suspension Struts (Simplified) */}
        <mesh position={[-1.1, 0.8, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.1, 0.1, 2.4]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[1.1, 0.8, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.1, 0.1, 2.4]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>
    </group>
  );
}
