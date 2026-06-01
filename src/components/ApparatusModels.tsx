
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere, Cylinder, Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { GltfApparatus, REALISTIC_MODELS } from './GltfApparatus';

// ... (rest of imports)

export function RealisticModel({ apparatusId, children, ...props }: any) {
  const modelConfig = REALISTIC_MODELS[apparatusId];
  
  if (modelConfig) {
    return (
      <GltfApparatus 
        url={modelConfig.url} 
        scale={modelConfig.scale} 
        rotation={modelConfig.rotation}
      >
        {children}
      </GltfApparatus>
    );
  }
  
  return <group>{children}</group>;
}

// ===================== PHYSICS MODELS =====================

export function ResistorModel() {
  return (
    <group>
      {/* Body - Realistic Ceramic Coated Resistor */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.8, 64]} />
        <meshPhysicalMaterial 
          color="#eec67e" 
          roughness={0.2} 
          metalness={0.0}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
        />
      </mesh>
      {/* Precision Decorative Bands */}
      {[[-0.22, '#8b4513'], [-0.08, 'black'], [0.06, 'red'], [0.24, 'gold']].map(([pos, color], i) => (
        <mesh key={i} rotation={[0, 0, Math.PI / 2]} position={[pos as number, 0, 0]}>
          <cylinderGeometry args={[0.1501, 0.1501, 0.08, 64]} />
          <meshBasicMaterial color={color as string} />
        </mesh>
      ))}
      {/* Realistic Metallic Leads with Bend */}
      <group position={[-0.55, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4, 16]} />
          <meshPhysicalMaterial color="#ddd" metalness={1} roughness={0.1} />
        </mesh>
      </group>
      <group position={[0.95, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4, 16]} />
          <meshPhysicalMaterial color="#ddd" metalness={1} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
}

export function Battery9VModel() {
  return (
    <group>
      {/* Main Chassis - High quality metallic/plastic casing */}
      <mesh>
        <boxGeometry args={[0.8, 1.2, 0.5]} />
        <meshPhysicalMaterial 
          color="#1a1a1a" 
          metalness={0.9} 
          roughness={0.1} 
          clearcoat={0.8} 
        />
      </mesh>
      {/* Precision Label */}
      <mesh position={[0, 0.1, 0.251]}>
        <planeGeometry args={[0.7, 0.8]} />
        <meshPhysicalMaterial color="#003366" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Terminals - One Snap, One Round */}
      <group position={[0, 0.65, 0]}>
        {/* Positive snap terminal */}
        <mesh position={[-0.2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.15, 64]} />
          <meshPhysicalMaterial color="#ddd" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[-0.2, 0.08, 0]}>
           <cylinderGeometry args={[0.15, 0.15, 0.04, 64]} />
           <meshPhysicalMaterial color="#ddd" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Negative terminal */}
        <mesh position={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.15, 64]} />
          <meshPhysicalMaterial color="#999" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

export function PrismModel() {
  return (
    <group>
      {/* High precision glass prism with dispersion properties */}
      <mesh rotation={[0, Math.PI / 4, 0]}>
        <cylinderGeometry args={[1, 1, 1.5, 3]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          transmission={0.99} 
          thickness={0.5} 
          roughness={0.01} 
          ior={1.5} 
          reflectivity={0.9}
          clearcoat={1}
          clearcoatRoughness={0.01}
        />
      </mesh>
      {/* Base edge highlighting */}
      <mesh position={[0, -0.76, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.98, 1.02, 3]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

// ===================== CHEMISTRY MODELS =====================

export function BeakerModel({ volume = 250, liquidColor = "#3b82f6", liquidLevel = 0.6 }) {
  return (
    <group>
      {/* Glass Body - Realistic Refraction */}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.5, 0.45, 1.5, 64, 1, true]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          transmission={0.95} 
          thickness={0.2} 
          roughness={0.02} 
          metalness={0.0}
          transparent 
          opacity={0.3} 
          clearcoat={1}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Pour Spout Lip */}
      <mesh position={[0.45, 1.48, 0]} rotation={[0, 0, -Math.PI/6]}>
        <torusGeometry args={[0.05, 0.02, 16, 32, Math.PI]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} thickness={0.1} />
      </mesh>
      {/* Glass Bottom */}
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.02, 64]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.95} thickness={0.1} transparent opacity={0.3} />
      </mesh>
      {/* Liquid */}
      {liquidLevel > 0 && (
        <mesh position={[0, (1.5 * liquidLevel) / 2, 0]}>
          <cylinderGeometry args={[0.43, 0.43, 1.5 * liquidLevel, 64]} />
          <meshPhysicalMaterial 
            color={liquidColor} 
            transmission={0.6} 
            thickness={0.5} 
            roughness={0.1} 
            transparent 
            opacity={0.85}
            emissive={liquidColor}
            emissiveIntensity={0.1}
          />
        </mesh>
      )}
      {/* Scale Markings - Etched look */}
      {[0.2, 0.6, 1.0, 1.4].map((y, i) => (
        <mesh key={i} position={[0.44, y, 0]}>
           <boxGeometry args={[0.05, 0.01, 0.1]} />
           <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

export function FlaskModel({ liquidColor = "#ef4444", liquidLevel = 0.4 }) {
  return (
    <group>
      {/* Lower Sphere-like body - Realistic Refraction */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.6, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          transmission={0.96} 
          thickness={0.2} 
          roughness={0.02} 
          transparent 
          opacity={0.3} 
          clearcoat={1}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Neck - Precise Geometry */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.8, 64, 1, true]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          transmission={0.96} 
          thickness={0.2} 
          roughness={0.02} 
          transparent 
          opacity={0.3} 
          clearcoat={1}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Liquid - Enhanced transparency */}
      {liquidLevel > 0 && (
         <mesh position={[0, 0.3, 0]}>
            <sphereGeometry args={[0.55, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshPhysicalMaterial 
              color={liquidColor} 
              transmission={0.5} 
              transparent 
              opacity={0.9} 
              roughness={0.05}
            />
         </mesh>
      )}
    </group>
  );
}

// ===================== BIOLOGY MODELS =====================

export function MicroscopeModel() {
  const turretRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (turretRef.current) {
      turretRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  const deepNavyAlloy = new THREE.MeshPhysicalMaterial({
    color: '#0f172a',
    metalness: 0.8,
    roughness: 0.15,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05
  });

  const chromeMaterial = new THREE.MeshPhysicalMaterial({
    color: '#e2e8f0',
    metalness: 1.0,
    roughness: 0.05,
    clearcoat: 1.0
  });

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    transmission: 1.0,
    thickness: 0.1,
    roughness: 0.0,
  });

  return (
    <group scale={0.8}>
      {/* Heavy Base */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[1.2, 0.2, 1.5]} />
        <meshPhysicalMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Light Source */}
      <group position={[0, 0.1, 0.3]}>
        <mesh>
          <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} />
          <meshPhysicalMaterial color="#334155" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.02, 32]} />
          <meshPhysicalMaterial color="#94a3b8" emissive="#0ea5e9" emissiveIntensity={2} />
        </mesh>
        <pointLight position={[0, 0.2, 0]} color="#0ea5e9" intensity={2} distance={2} />
      </group>

      {/* Main Structural Column */}
      <group position={[0, 1.2, -0.6]}>
        <mesh>
          <cylinderGeometry args={[0.25, 0.3, 2.5, 32]} />
          <meshPhysicalMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Adjustment Knob */}
        <mesh position={[0.3, 0.5, 0]} rotation={[0, 0, Math.PI/2]}>
          <cylinderGeometry args={[0.25, 0.25, 0.15, 32]} />
          <meshPhysicalMaterial color="#1e293b" roughness={0.8} />
        </mesh>
      </group>

      {/* Stage */}
      <group position={[0, 0.8, 0.1]}>
        <mesh>
          <boxGeometry args={[1, 0.05, 1]} />
          <meshPhysicalMaterial color="#111" metalness={0.5} roughness={0.1} />
        </mesh>
        {/* Stage Clips */}
        <mesh position={[0.25, 0.05, 0.1]} rotation={[0, -0.2, 0]}>
          <boxGeometry args={[0.04, 0.01, 0.3]} />
          <meshPhysicalMaterial color="#cbd5e1" metalness={1} />
        </mesh>
        <mesh position={[-0.25, 0.05, 0.1]} rotation={[0, 0.2, 0]}>
          <boxGeometry args={[0.04, 0.01, 0.3]} />
          <meshPhysicalMaterial color="#cbd5e1" metalness={1} />
        </mesh>
      </group>

      {/* Objective Turret */}
      <group ref={turretRef} position={[0, 1.6, 0.1]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.15, 32]} />
          <meshPhysicalMaterial color="#1e293b" metalness={0.8} />
        </mesh>
        {/* Multiple Objectives */}
        {[0, Math.PI*2/3, Math.PI*4/3].map((angle, i) => (
          <group key={i} rotation={[0.4, angle, 0]} position={[0, -0.15, 0]}>
            <mesh position={[0, -0.15, 0.15]}>
              <cylinderGeometry args={[0.06, 0.05, 0.3, 32]} />
              <meshPhysicalMaterial color="#cbd5e1" metalness={1} roughness={0.1} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Binocular viewing head */}
      <group position={[0, 2.2, -0.2]} rotation={[-0.4, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.5, 0.4, 0.4]} />
          <meshPhysicalMaterial color="#0f172a" />
        </mesh>
        {/* Right Eyepiece */}
        <group position={[0.15, 0.3, 0.1]}>
          <mesh>
            <cylinderGeometry args={[0.1, 0.1, 0.4, 32]} />
            <meshPhysicalMaterial color="#cbd5e1" metalness={1} />
          </mesh>
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.05, 32]} />
            <meshPhysicalMaterial color="#000" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.26, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.01, 32]} />
            <meshPhysicalMaterial color="#ffffff" transmission={1.0} roughness={0} />
          </mesh>
        </group>
        {/* Left Eyepiece */}
        <group position={[-0.15, 0.3, 0.1]}>
          <mesh>
            <cylinderGeometry args={[0.1, 0.1, 0.4, 32]} />
            <meshPhysicalMaterial color="#cbd5e1" metalness={1} />
          </mesh>
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.05, 32]} />
            <meshPhysicalMaterial color="#000" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.26, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.01, 32]} />
            <meshPhysicalMaterial color="#ffffff" transmission={1.0} roughness={0} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// ===================== CIRCUIT MODELS =====================

export function LedHighDetail({ color = "red", active = true }) {
  const lightRef = useRef<THREE.PointLight>(null);
  
  useFrame(({ clock }) => {
    if (lightRef.current && active) {
        lightRef.current.intensity = 2 + Math.sin(clock.getElapsedTime() * 10) * 0.5;
    }
  });

  return (
    <group>
      {/* Epoxy Lens */}
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.2, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={active ? 2 : 0.1} 
          transparent 
          opacity={0.8} 
          roughness={0.05} 
          clearcoat={1} 
          transmission={0.9}
          thickness={0.5}
        />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.5, 64]} />
        <meshPhysicalMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={active ? 1 : 0.05} 
          transparent 
          opacity={0.8} 
          roughness={0.05} 
          clearcoat={1} 
          transmission={0.9}
          thickness={0.5}
        />
      </mesh>
      {/* Base Flange */}
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.05, 64]} />
        <meshPhysicalMaterial color={color} transparent opacity={0.6} roughness={0.1} clearcoat={1} />
      </mesh>

      {/* Interior Anode/Cathode structure (post and anvil) */}
      <group position={[0, 0, 0]}>
         {/* Anode (smaller post) */}
         <mesh position={[0.08, 0.2, 0]}>
           <boxGeometry args={[0.04, 0.2, 0.04]} />
           <meshPhysicalMaterial color="#ddd" metalness={1} roughness={0.1} />
         </mesh>
         <mesh position={[0.08, 0.3, 0]}>
            <coneGeometry args={[0.04, 0.05, 4]} />
            <meshPhysicalMaterial color="#ccc" metalness={1} roughness={0.1}/>
         </mesh>

         {/* Cathode (larger anvil) */}
         <mesh position={[-0.08, 0.15, 0]}>
           <boxGeometry args={[0.08, 0.3, 0.06]} />
           <meshPhysicalMaterial color="#ddd" metalness={1} roughness={0.1} />
         </mesh>
         <mesh position={[-0.08, 0.3, 0]}>
           <cylinderGeometry args={[0.04, 0.08, 0.08, 16]} />
           <meshPhysicalMaterial color="#ccc" metalness={1} roughness={0.1} />
         </mesh>
         
         {/* Semiconductor block/die */}
         <mesh position={[-0.08, 0.35, 0]}>
           <boxGeometry args={[0.03, 0.01, 0.03]} />
           <meshPhysicalMaterial color={active ? "#fff" : "#111"} emissive={color} emissiveIntensity={active ? 10 : 0} />
         </mesh>

         {/* Wire bond */}
         <mesh position={[0, 0.33, 0]} rotation={[0, 0, -1.2]}>
           <cylinderGeometry args={[0.005, 0.005, 0.15, 8]} />
           <meshPhysicalMaterial color="gold" metalness={1} roughness={0.2} />
         </mesh>
      </group>

      {active && <pointLight ref={lightRef} position={[0, 0.35, 0]} color={color} intensity={2} distance={3} decay={2} />}

      {/* Leads */}
      <mesh position={[0.08, -0.6, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.9, 32]} />
        <meshPhysicalMaterial color="#bbb" metalness={1} roughness={0.3} />
      </mesh>
      <mesh position={[-0.08, -0.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.7, 32]} />
        <meshPhysicalMaterial color="#bbb" metalness={1} roughness={0.3} />
      </mesh>
    </group>
  );
}

export function MotorAdvanced() {
  const shaftRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (shaftRef.current) {
        shaftRef.current.rotation.y = clock.getElapsedTime() * 25;
    }
  });

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      {/* Super Realistic Motor Body with Vents */}
      <mesh>
        <cylinderGeometry args={[0.45, 0.45, 0.9, 64]} />
        <meshPhysicalMaterial color="#334155" metalness={0.9} roughness={0.1} clearcoat={1} />
      </mesh>
      {/* Internal Copper winding visible via vents (simulated with emissive ring) */}
      <mesh rotation={[0, 0, Math.PI/2]}>
         <cylinderGeometry args={[0.3, 0.3, 0.6, 16]} />
         <meshPhysicalMaterial color="#b45309" metalness={0.8} emissive="#451a03" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Texture rings/vents on body */}
      {[0.2, -0.2].map((y, i) => (
         <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.405, 0.015, 16, 64]} />
            <meshPhysicalMaterial color="#111" metalness={0.5} roughness={0.5} />
         </mesh>
      ))}

      {/* Front Face */}
      <mesh position={[0, 0.41, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.02, 64]} />
        <meshPhysicalMaterial color="#888" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Front Bearing */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.04, 32]} />
        <meshPhysicalMaterial color="#b28c30" metalness={1} roughness={0.2} />
      </mesh>
      
      {/* Screw Details */}
      {[[0.25, 0.42, 0], [-0.25, 0.42, 0]].map((pos, i) => (
         <mesh key={i} position={new THREE.Vector3(...pos)}>
            <cylinderGeometry args={[0.03, 0.03, 0.01, 16]} />
            <meshPhysicalMaterial color="#ccc" metalness={1} roughness={0.1}/>
         </mesh>
      ))}

      {/* High-detail Rotating Shaft & Gear */}
      <group ref={shaftRef} position={[0, 0.7, 0]}>
         <mesh>
            <cylinderGeometry args={[0.07, 0.07, 0.7, 32]} />
            <meshPhysicalMaterial color="#cbd5e1" metalness={1} roughness={0.05} />
         </mesh>
         {/* Shaft flat side (D-shaft) */}
         <mesh position={[-0.05, 0.2, 0]}>
            <boxGeometry args={[0.02, 0.35, 0.08]} />
            <meshPhysicalMaterial color="#94a3b8" metalness={0.9} />
         </mesh>
         {/* Precision Brass Gear */}
         <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.15, 12]} />
            <meshPhysicalMaterial color="#a16207" metalness={1} roughness={0.1} />
         </mesh>
         {/* Gear set screw hole */}
         <mesh position={[0.15, 0.25, 0]} rotation={[0, 0, Math.PI/2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.1, 16]} />
            <meshBasicMaterial color="#000" />
         </mesh>
      </group>

      {/* Back Plate */}
      <mesh position={[0, -0.41, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.02, 64]} />
        <meshPhysicalMaterial color="#555" metalness={0.5} roughness={0.6} />
      </mesh>

      {/* Rear electrical terminals */}
      <group position={[0, -0.45, 0]}>
         <mesh position={[-0.2, 0, 0]}>
            <boxGeometry args={[0.04, 0.15, 0.08]} />
            <meshPhysicalMaterial color="#b28c30" metalness={1} roughness={0.2} />
         </mesh>
         <mesh position={[-0.2, 0.05, 0]} rotation={[0, 0, Math.PI/2]}>
             <cylinderGeometry args={[0.02, 0.02, 0.05, 16]} />
             <meshBasicMaterial color="#ef4444" />
         </mesh>
         
         <mesh position={[0.2, 0, 0]}>
            <boxGeometry args={[0.04, 0.15, 0.08]} />
            <meshPhysicalMaterial color="#ddd" metalness={1} roughness={0.2} />
         </mesh>
         <mesh position={[0.2, 0.05, 0]} rotation={[0, 0, Math.PI/2]}>
             <cylinderGeometry args={[0.02, 0.02, 0.05, 16]} />
             <meshBasicMaterial color="#3b82f6" />
         </mesh>
      </group>
    </group>
  );
}

export function AmmeterAdvanced({ reading = 0 }) {
  return (
    <group>
      {/* Precision Casing - More rugged/industrial */}
      <mesh position={[0, -0.2, -0.2]}>
        <boxGeometry args={[1.8, 2.0, 0.8]} />
        <meshPhysicalMaterial color="#1a1a1a" metalness={0.2} roughness={0.7} />
      </mesh>
      {/* Front Faceplate Base */}
      <mesh position={[0, 0, 0.201]}>
         <boxGeometry args={[1.6, 2.2, 0.05]} />
         <meshPhysicalMaterial color="#333" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Screen Frame */}
      <mesh position={[0, 0.3, 0.23]}>
         <boxGeometry args={[1.4, 1.0, 0.04]} />
         <meshPhysicalMaterial color="#111" metalness={0.6} roughness={0.2} />
      </mesh>
      
      {/* Dial Face / Scale background */}
      <mesh position={[0, 0.3, 0.24]}>
        <planeGeometry args={[1.3, 0.9]} />
        <meshPhysicalMaterial color="#f0f0f0" roughness={0.8} />
      </mesh>

      {/* Scale Markings */}
      <group position={[0, -0.1, 0.241]}>
        <mesh position={[0, 0.1, 0]}>
           <ringGeometry args={[0.58, 0.6, 32, 1, Math.PI/4, Math.PI/2]} />
           <meshBasicMaterial color="#000" />
        </mesh>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => {
           const angle = Math.PI/4 + (v/10) * (Math.PI/2);
           const x = Math.cos(angle) * 0.6;
           const y = Math.sin(angle) * 0.6 + 0.1;
           return (
              <mesh key={v} position={[x, y, 0]} rotation={[0, 0, angle]}>
                 <planeGeometry args={[0.015, 0.08]} />
                 <meshBasicMaterial color={v > 8 ? "#ef4444" : "#000"} />
              </mesh>
           );
        })}
      </group>

      {/* A Symbol */}
      <group position={[0, 0.5, 0.241]}>
         <mesh position={[0, 0, 0]}>
            <planeGeometry args={[0.08, 0.02]} />
            <meshBasicMaterial color="#000" />
         </mesh>
         <mesh position={[-0.035, 0.05, 0]} rotation={[0, 0, -0.3]}>
            <planeGeometry args={[0.02, 0.1]} />
            <meshBasicMaterial color="#000" />
         </mesh>
         <mesh position={[0.035, 0.05, 0]} rotation={[0, 0, 0.3]}>
            <planeGeometry args={[0.02, 0.1]} />
            <meshBasicMaterial color="#000" />
         </mesh>
      </group>

      {/* Origin/Pivot Cap for Needle */}
      <mesh position={[0, 0, 0.25]}>
         <cylinderGeometry args={[0.1, 0.1, 0.05, 32]} />
         <meshPhysicalMaterial color="#222" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Physical Needle Element */}
      <group position={[0, 0, 0.25]} rotation={[0, 0, -Math.PI/4 + (reading * Math.PI/2)]}>
         {/* Tapered Needle */}
         <mesh position={[0, 0.35, 0]}>
            <coneGeometry args={[0.015, 0.7, 8]} />
            <meshBasicMaterial color="#ef4444" />
         </mesh>
         <mesh position={[0, -0.1, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
            <meshPhysicalMaterial color="#555" />
         </mesh>
      </group>

      {/* Glass Cover */}
      <mesh position={[0, 0.3, 0.28]}>
        <planeGeometry args={[1.35, 0.95]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.95} thickness={0.05} transparent opacity={0.2} roughness={0.01} clearcoat={1} />
      </mesh>
      
      {/* Terminals - Heavy Duty Binding Posts */}
      <group position={[-0.4, -0.8, 0.25]} rotation={[Math.PI/2, 0, 0]}>
         <mesh>
            <cylinderGeometry args={[0.1, 0.1, 0.1, 32]} />
            <meshPhysicalMaterial color="#ccc" metalness={1} roughness={0.1} />
         </mesh>
         <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.2, 32]} />
            <meshPhysicalMaterial color="#ef4444" metalness={0.2} roughness={0.5} />
         </mesh>
         <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.05, 32]} />
            <meshPhysicalMaterial color="#ccc" metalness={1} roughness={0.1} />
         </mesh>
      </group>

      <group position={[0.4, -0.8, 0.25]} rotation={[Math.PI/2, 0, 0]}>
         <mesh>
            <cylinderGeometry args={[0.1, 0.1, 0.1, 32]} />
            <meshPhysicalMaterial color="#ccc" metalness={1} roughness={0.1} />
         </mesh>
         <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.2, 32]} />
            <meshPhysicalMaterial color="#111" metalness={0.2} roughness={0.5} />
         </mesh>
         <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.05, 32]} />
            <meshPhysicalMaterial color="#ccc" metalness={1} roughness={0.1} />
         </mesh>
      </group>
    </group>
  );
}

export function BunsenBurnerModel({ active = false }) {
  const flameRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (flameRef.current && active) {
        flameRef.current.scale.y = 1 + Math.sin(clock.getElapsedTime() * 20) * 0.2;
        flameRef.current.scale.x = 1 + Math.cos(clock.getElapsedTime() * 15) * 0.1;
    }
  });

  return (
    <group>
      {/* Heavy Base - Cast Iron Texture */}
      <mesh>
        <cylinderGeometry args={[0.6, 0.7, 0.15, 64]} />
        <meshPhysicalMaterial color="#333" metalness={0.6} roughness={0.7} />
      </mesh>
      {/* Barrel - Machined Steel */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 1.4, 64]} />
        <meshPhysicalMaterial color="#ccc" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Gas Inlet - Threaded appearance */}
      <mesh position={[0.3, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
         <cylinderGeometry args={[0.05, 0.05, 0.4, 32]} />
         <meshPhysicalMaterial color="#ccc" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Flame */}
      {active && (
        <group ref={flameRef} position={[0, 1.5, 0]}>
           <mesh>
              <coneGeometry args={[0.1, 0.6, 32]} />
              <meshBasicMaterial color="#3b82f6" transparent opacity={0.7} />
           </mesh>
           <mesh scale={0.6}>
              <coneGeometry args={[0.1, 0.8, 32]} />
              <meshBasicMaterial color="#60a5fa" transparent opacity={0.5} />
           </mesh>
           <pointLight color="#3b82f6" intensity={3} distance={5} />
        </group>
      )}
    </group>
  );
}

export function PetriDishModel() {
  return (
    <group>
      {/* Lower dish - Realistic glass with thickness and refraction */}
      <mesh>
        <cylinderGeometry args={[0.8, 0.8, 0.15, 64, 1, true]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          transmission={0.98} 
          thickness={0.2} 
          transparent 
          opacity={0.3} 
          roughness={0.01} 
          clearcoat={1}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, -0.07, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.01, 64]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          transmission={0.98} 
          thickness={0.1} 
          transparent 
          opacity={0.3} 
          roughness={0.01}
        />
      </mesh>
      {/* Agar Layer - Subsurface look */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.78, 0.78, 0.05, 64]} />
        <meshPhysicalMaterial 
          color="#fef3c7" 
          roughness={0.1} 
          transparent 
          opacity={0.8}
          transmission={0.2}
        />
      </mesh>
      {/* Bacterial Colonies - More realistic variations */}
      {[[-0.2, 0.3], [0.4, -0.1], [-0.3, -0.4], [0.1, 0.2]].map(([x, z], i) => (
        <mesh key={i} position={[x, -0.02, z]} rotation={[-Math.PI / 2, 0, 0]}>
           <circleGeometry args={[0.08 + Math.random() * 0.05, 64]} />
           <meshPhysicalMaterial 
             color={i % 2 === 0 ? "#ef4444" : "#10b981"} 
             roughness={0.2}
             metalness={0.0}
           />
        </mesh>
      ))}
    </group>
  );
}

export function BreadboardModel() {
  return (
    <group>
      {/* Plastic Base - Realistic Molded Texture */}
      <mesh>
        <boxGeometry args={[4, 0.2, 6]} />
        <meshPhysicalMaterial color="#f0f0f0" roughness={0.4} metalness={0.0} />
      </mesh>
      {/* Aluminum Top Plate */}
      <mesh position={[0, 0.105, 0]}>
        <boxGeometry args={[3.8, 0.01, 5.8]} />
        <meshPhysicalMaterial color="#d1d5db" roughness={0.3} metalness={0.3} />
      </mesh>
      {/* Precision Hole Grids - Adding metallic clip appearance */}
      {/* Power Rails */}
      {[-1.8, 1.8].map((x) => (
        <group key={`rail-${x}`} position={[x, 0.11, 0]}>
          {Array.from({ length: 25 }).map((_, i) => (
            <group key={i} position={[0, 0, (i - 12) * 0.22]}>
               <mesh>
                  <cylinderGeometry args={[0.035, 0.035, 0.02, 16]} />
                  <meshPhysicalMaterial color="#1f2937" roughness={0.2} metalness={0.5} />
               </mesh>
               <mesh position={[0, 0.005, 0]}>
                  <cylinderGeometry args={[0.02, 0.02, 0.005, 16]} />
                  <meshBasicMaterial color="#000" />
               </mesh>
            </group>
          ))}
          {/* Rail stripe colored labels */}
          <mesh position={[0.08, -0.01, 0]}>
             <boxGeometry args={[0.02, 0.001, 5.5]} />
             <meshBasicMaterial color={x < 0 ? "#ef4444" : "#3b82f6"} />
          </mesh>
        </group>
      ))}
      {/* Main Grid */}
      {[-1.2, -1, -0.8, -0.6, -0.4, 0.4, 0.6, 0.8, 1, 1.2].map((x) => (
        <group key={`col-${x}`} position={[x, 0.11, 0]}>
          {Array.from({ length: 40 }).map((_, i) => (
            <mesh key={i} position={[0, 0, (i - 19.5) * 0.14]}>
              <cylinderGeometry args={[0.03, 0.03, 0.02, 16]} />
              <meshPhysicalMaterial color="#1f2937" roughness={0.2} metalness={0.5} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

export function BuretteModel({ liquidLevel = 0.5, valveOpen = false }) {
  return (
    <group>
      {/* Glass Tube - ImprovedMaterial */}
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, 8, 64, 1, true]} />
        <meshPhysicalMaterial 
           color="#ffffff" 
           transmission={0.99} 
           thickness={0.1} 
           transparent 
           opacity={0.3} 
           roughness={0.01} 
           clearcoat={1} 
           side={THREE.DoubleSide}
        />
      </mesh>
      {/* Liquid Column */}
      {liquidLevel > 0 && (
        <mesh position={[0, (8 * liquidLevel - 8) / 2, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 8 * liquidLevel, 32]} />
          <meshPhysicalMaterial color="#ffffff" transmission={0.9} transparent opacity={0.6} roughness={0.05} />
        </mesh>
      )}
      {/* Graduations - Etched Precise */}
      {Array.from({ length: 50 }).map((_, i) => (
        <mesh key={i} position={[0.101, (i - 25) * 0.15, 0]} rotation={[0, Math.PI/2, 0]}>
           <boxGeometry args={[0.05, 0.01, 0.005]} />
           <meshBasicMaterial color="#000" transparent opacity={0.6} />
        </mesh>
      ))}
      {/* Valve System - Improved Aesthetics */}
      <group position={[0, -4.2, 0]}>
         {/* Connector */}
         <mesh>
            <cylinderGeometry args={[0.12, 0.1, 0.4, 32]} />
            <meshPhysicalMaterial color="#ffffff" transmission={0.95} transparent opacity={0.4} />
         </mesh>
         {/* Tapered Tip */}
         <mesh position={[0, -0.6, 0]}>
            <cylinderGeometry args={[0.1, 0.02, 0.8, 32]} />
            <meshPhysicalMaterial color="#ffffff" transmission={0.95} transparent opacity={0.4} />
         </mesh>
         {/* Valve Knob */}
         <mesh position={[0, 0, 0.15]} rotation={[Math.PI / 2, valveOpen ? Math.PI/2 : 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.4, 32]} />
            <meshPhysicalMaterial color="#2563eb" metalness={0.8} roughness={0.2} />
         </mesh>
      </group>
    </group>
  );
}

export function ProtractorModel() {
  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      {/* Semi-circular plastic body */}
      <mesh>
        <cylinderGeometry args={[2, 2, 0.05, 64, 1, false, 0, Math.PI]} />
        <meshPhysicalMaterial 
          color="#a5f3fc" 
          transmission={0.9} 
          thickness={0.05} 
          roughness={0.1}
          clearcoat={1}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Inner cutout */}
      <mesh position={[0, -0.01, 0]}>
         <cylinderGeometry args={[1.2, 1.2, 0.07, 64, 1, false, 0, Math.PI]} />
         <meshBasicMaterial color="#000" colorWrite={false} depthWrite={false} />
      </mesh>
      
      {/* Base Ruler Edge */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
         <boxGeometry args={[4.2, 0.05, 0.4]} />
         <meshPhysicalMaterial 
          color="#a5f3fc" 
          transmission={0.9} 
          thickness={0.05} 
          roughness={0.1}
          clearcoat={1}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Degree ticks */}
      {Array.from({ length: 19 }).map((_, i) => {
         const angle = (i * 10 * Math.PI) / 180;
         const innerRadius = i % 9 === 0 ? 1.7 : 1.8;
         return (
            <mesh key={i} position={[Math.cos(angle) * 1.9, 0.03, -Math.sin(angle) * 1.9]} rotation={[0, -angle, 0]}>
               <boxGeometry args={[0.2, 0.01, 0.02]} />
               <meshBasicMaterial color="#1e293b" />
            </mesh>
         )
      })}
      
      {/* Center crosshair */}
      <mesh position={[0, 0.03, 0]}>
         <boxGeometry args={[0.2, 0.01, 0.02]} />
         <meshBasicMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0, 0.03, 0]}>
         <boxGeometry args={[0.02, 0.01, 0.2]} />
         <meshBasicMaterial color="#1e293b" />
      </mesh>
    </group>
  );
}

export function VoltmeterModel({ reading = 0 }) {
  return (
    <group>
      {/* Precision Casing - Similar to ammeter but different color scheme */}
      <mesh position={[0, -0.2, -0.2]}>
        <boxGeometry args={[1.8, 2.0, 0.8]} />
        <meshPhysicalMaterial color="#1a1a1a" metalness={0.2} roughness={0.7} />
      </mesh>
      {/* Front Faceplate Base */}
      <mesh position={[0, 0, 0.201]}>
         <boxGeometry args={[1.6, 2.2, 0.05]} />
         <meshPhysicalMaterial color="#333" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* Screen Frame */}
      <mesh position={[0, 0.3, 0.23]}>
         <boxGeometry args={[1.4, 1.0, 0.04]} />
         <meshPhysicalMaterial color="#111" metalness={0.6} roughness={0.2} />
      </mesh>
      
      {/* Dial Face / Scale background */}
      <mesh position={[0, 0.3, 0.24]}>
        <planeGeometry args={[1.3, 0.9]} />
        <meshPhysicalMaterial color="#f0f0f0" roughness={0.8} />
      </mesh>

      {/* V Symbol */}
      <group position={[0, 0.5, 0.25]}>
         <mesh position={[-0.04, 0, 0]} rotation={[0, 0, -0.3]}>
            <planeGeometry args={[0.02, 0.1]} />
            <meshBasicMaterial color="#3b82f6" />
         </mesh>
         <mesh position={[0.04, 0, 0]} rotation={[0, 0, 0.3]}>
            <planeGeometry args={[0.02, 0.1]} />
            <meshBasicMaterial color="#3b82f6" />
         </mesh>
      </group>

      {/* Physical Needle Element */}
      <group position={[0, 0, 0.25]} rotation={[0, 0, -Math.PI/4 + (reading * Math.PI/2)]}>
         <mesh position={[0, 0.35, 0]}>
            <coneGeometry args={[0.015, 0.7, 8]} />
            <meshBasicMaterial color="#3b82f6" />
         </mesh>
         <mesh position={[0, -0.1, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
            <meshPhysicalMaterial color="#555" />
         </mesh>
      </group>

      <mesh position={[0, 0.3, 0.28]}>
        <planeGeometry args={[1.35, 0.95]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.95} thickness={0.05} transparent opacity={0.2} roughness={0.01} clearcoat={1} />
      </mesh>
    </group>
  );
}

export function StopwatchModel() {
  return (
    <group rotation={[Math.PI / 8, 0, 0]}>
      {/* Metal casing */}
      <mesh>
         <cylinderGeometry args={[1, 1, 0.3, 64]} />
         <meshPhysicalMaterial color="#c0c0c0" metalness={0.9} roughness={0.2} clearcoat={1} />
      </mesh>
      {/* Glass */}
      <mesh position={[0, 0.16, 0]}>
         <cylinderGeometry args={[0.95, 0.95, 0.05, 64]} />
         <meshPhysicalMaterial color="#fff" transmission={0.95} thickness={0.1} roughness={0} />
      </mesh>
      {/* Buttons */}
      <mesh position={[0, 0, -1.05]} rotation={[Math.PI/2, 0, 0]}>
         <cylinderGeometry args={[0.15, 0.15, 0.2, 32]} />
         <meshPhysicalMaterial color="#ccc" metalness={1} roughness={0.5} />
      </mesh>
      <mesh position={[0.7, 0, -0.7]} rotation={[Math.PI/2, 0, -Math.PI/4]}>
         <cylinderGeometry args={[0.1, 0.1, 0.2, 32]} />
         <meshPhysicalMaterial color="#ef4444" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
}

export function ThermometerModel() {
  return (
    <group>
      {/* Main Glass Tube */}
      <mesh>
        <cylinderGeometry args={[0.05, 0.05, 4, 32]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.95} transparent opacity={0.4} roughness={0.05} />
      </mesh>
      {/* Inner Mercury/Alcohol line */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 2, 16]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      {/* Bulb */}
      <mesh position={[0, -2.1, 0]}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshPhysicalMaterial color="#ef4444" transmission={0.5} opacity={0.8} transparent />
      </mesh>
    </group>
  );
}

export function TestTubeModel() {
  return (
    <group>
       {/* Test Tube Glass */}
       <mesh position={[0, 0, 0]}>
         <cylinderGeometry args={[0.2, 0.2, 2.5, 32, 1, true]} />
         <meshPhysicalMaterial color="#ffffff" transmission={0.99} transparent opacity={0.2} roughness={0.01} side={THREE.DoubleSide} />
       </mesh>
       <mesh position={[0, -1.25, 0]} rotation={[Math.PI, 0, 0]}>
         <sphereGeometry args={[0.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
         <meshPhysicalMaterial color="#ffffff" transmission={0.99} transparent opacity={0.2} roughness={0.01} side={THREE.DoubleSide} />
       </mesh>
       {/* Liquid */}
       <mesh position={[0, -0.25, 0]}>
         <cylinderGeometry args={[0.18, 0.18, 2, 32]} />
         <meshPhysicalMaterial color="#10b981" transmission={0.8} transparent opacity={0.8} />
       </mesh>
    </group>
  );
}

export function HeartModel() {
  return (
    <group scale={1.5}>
      {/* Abstract Heart Ventricles */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshPhysicalMaterial color="#be123c" roughness={0.6} metalness={0.1} clearcoat={0.3} />
      </mesh>
      {/* Aorta Arch */}
      <mesh position={[0.2, 0.8, 0]} rotation={[0, 0, -Math.PI/6]}>
        <torusGeometry args={[0.4, 0.15, 16, 32, Math.PI]} />
        <meshPhysicalMaterial color="#ef4444" roughness={0.5} />
      </mesh>
      {/* Pulmonary Artery */}
      <mesh position={[-0.3, 0.7, 0.2]} rotation={[0, 0, Math.PI/4]}>
        <cylinderGeometry args={[0.15, 0.15, 0.8, 32]} />
        <meshPhysicalMaterial color="#3b82f6" roughness={0.5} />
      </mesh>
      {/* Vena Cava */}
      <mesh position={[0.5, 0, -0.3]}>
        <cylinderGeometry args={[0.15, 0.15, 1.5, 32]} />
        <meshPhysicalMaterial color="#2563eb" roughness={0.5} />
      </mesh>
    </group>
  );
}

export function AbacusModel() {
  return (
    <group rotation={[-Math.PI / 4, 0, 0]}>
      {/* Wooden Frame */}
      {/* Top Frame */}
      <mesh position={[0, 1.5, 0]}>
         <boxGeometry args={[4, 0.2, 0.4]} />
         <meshPhysicalMaterial color="#78350f" metalness={0.1} roughness={0.8} />
      </mesh>
      {/* Bottom Frame */}
      <mesh position={[0, -1.5, 0]}>
         <boxGeometry args={[4, 0.2, 0.4]} />
         <meshPhysicalMaterial color="#78350f" metalness={0.1} roughness={0.8} />
      </mesh>
      {/* Upper Deck Divider */}
      <mesh position={[0, 0.5, 0]}>
         <boxGeometry args={[4, 0.2, 0.4]} />
         <meshPhysicalMaterial color="#78350f" metalness={0.1} roughness={0.8} />
      </mesh>
      {/* Left Frame */}
      <mesh position={[-1.9, 0, 0]}>
         <boxGeometry args={[0.2, 3.2, 0.4]} />
         <meshPhysicalMaterial color="#78350f" metalness={0.1} roughness={0.8} />
      </mesh>
      {/* Right Frame */}
      <mesh position={[1.9, 0, 0]}>
         <boxGeometry args={[0.2, 3.2, 0.4]} />
         <meshPhysicalMaterial color="#78350f" metalness={0.1} roughness={0.8} />
      </mesh>

      {/* Metal Rods & Beads */}
      {Array.from({ length: 9 }).map((_, col) => (
         <group key={col} position={[-1.6 + col * 0.4, 0, 0]}>
            {/* Rod */}
            <mesh>
               <cylinderGeometry args={[0.02, 0.02, 3.0, 16]} />
               <meshPhysicalMaterial color="#d1d5db" metalness={1} roughness={0.2} />
            </mesh>
            
            {/* Top Deck Beads (2) */}
            <mesh position={[0, 1.2, 0]}>
               <torusGeometry args={[0.15, 0.08, 16, 32]} />
               <meshPhysicalMaterial color="#f59e0b" roughness={0.4} clearcoat={1} />
            </mesh>
            <mesh position={[0, 0.8, 0]}>
               <torusGeometry args={[0.15, 0.08, 16, 32]} />
               <meshPhysicalMaterial color="#f59e0b" roughness={0.4} clearcoat={1} />
            </mesh>
            
            {/* Bottom Deck Beads (5) */}
            {Array.from({ length: 5 }).map((_, row) => (
               <mesh key={row} position={[0, 0.2 - row * 0.35, 0]}>
                  <torusGeometry args={[0.15, 0.08, 16, 32]} />
                  <meshPhysicalMaterial color="#ea580c" roughness={0.4} clearcoat={1} />
               </mesh>
            ))}
         </group>
      ))}
    </group>
  );
}

export function PipetteModel() {
  return (
    <group>
      {/* Pipette body */}
      <mesh position={[0, 0, 0]}>
         <cylinderGeometry args={[0.08, 0.08, 2, 32]} />
         <meshPhysicalMaterial color="#f8fafc" transmission={0.9} transparent opacity={0.5} />
      </mesh>
      {/* Tip */}
      <mesh position={[0, -1.2, 0]}>
         <cylinderGeometry args={[0.08, 0.02, 0.4, 32]} />
         <meshPhysicalMaterial color="#f8fafc" transmission={0.9} transparent opacity={0.5} />
      </mesh>
      {/* Rubber Bulb */}
      <mesh position={[0, 1.2, 0]}>
         <sphereGeometry args={[0.25, 32, 32]} />
         <meshPhysicalMaterial color="#ef4444" roughness={0.8} />
      </mesh>
    </group>
  );
}

export function SwitchModel({ closed = false }) {
  return (
    <group rotation={[0, Math.PI/4, 0]}>
      {/* Base */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[1.5, 0.2, 0.8]} />
        <meshPhysicalMaterial color="#333" roughness={0.8} />
      </mesh>
      {/* Terminals */}
      <mesh position={[-0.5, 0.1, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.4, 32]} />
        <meshPhysicalMaterial color="#b28c30" metalness={1} roughness={0.2} />
      </mesh>
      <mesh position={[0.5, 0.1, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.4, 32]} />
        <meshPhysicalMaterial color="#b28c30" metalness={1} roughness={0.2} />
      </mesh>
      {/* Knife */}
      <group position={[-0.5, 0.2, 0]} rotation={[0, 0, closed ? 0 : -Math.PI/6]}>
        <mesh position={[0.5, 0, 0]}>
          <boxGeometry args={[1.2, 0.05, 0.05]} />
          <meshPhysicalMaterial color="#ccc" metalness={1} roughness={0.2} />
        </mesh>
        {/* Handle */}
        <mesh position={[1.1, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
          <meshPhysicalMaterial color="#ef4444" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

export function WireSpoolModel() {
  return (
    <group>
      {/* Spool core and ends */}
      <mesh>
        <cylinderGeometry args={[0.4, 0.4, 1, 32]} />
        <meshPhysicalMaterial color="#e5e7eb" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
        <meshPhysicalMaterial color="#1f2937" roughness={0.9} />
      </mesh>
      <mesh position={[0, -0.55, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
        <meshPhysicalMaterial color="#1f2937" roughness={0.9} />
      </mesh>
      {/* Wire around spool */}
      <mesh>
        <cylinderGeometry args={[0.45, 0.45, 0.95, 32]} />
        <meshPhysicalMaterial color="#b87333" metalness={0.8} roughness={0.4} />
      </mesh>
    </group>
  );
}

export function CircuitBoardModel() {
  return (
    <group>
      {/* PCB Base */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[2, 0.05, 1.5]} />
        <meshPhysicalMaterial color="#065f46" metalness={0.2} roughness={0.8} />
      </mesh>
      {/* Chips */}
      <mesh position={[-0.4, 0.05, 0]}>
        <boxGeometry args={[0.4, 0.05, 0.6]} />
        <meshPhysicalMaterial color="#111" metalness={0.3} roughness={0.7} />
      </mesh>
      <mesh position={[0.4, 0.05, -0.3]}>
        <boxGeometry args={[0.3, 0.05, 0.3]} />
        <meshPhysicalMaterial color="#111" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* Capacitors */}
      <mesh position={[0.5, 0.1, 0.3]}>
        <cylinderGeometry args={[0.08, 0.08, 0.2, 16]} />
        <meshPhysicalMaterial color="#1e40af" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0.7, 0.1, 0.3]}>
        <cylinderGeometry args={[0.08, 0.08, 0.2, 16]} />
        <meshPhysicalMaterial color="#1e40af" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Connectors */}
      <mesh position={[-0.9, 0.05, 0]}>
        <boxGeometry args={[0.2, 0.15, 1]} />
        <meshPhysicalMaterial color="#fcd34d" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

export function PendulumBobModel() {
  return (
    <group>
      {/* Bob */}
      <mesh>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshPhysicalMaterial color="#b28c30" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Hook */}
      <mesh position={[0, 0.22, 0]}>
        <torusGeometry args={[0.04, 0.01, 16, 32]} />
        <meshPhysicalMaterial color="#b28c30" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* String bit */}
      <mesh position={[0, 0.76, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 1, 8]} />
        <meshBasicMaterial color="#fff" />
      </mesh>
    </group>
  );
}

export function SupportStandModel() {
  return (
    <group>
      {/* Heavy Base */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.5, 0.2, 1]} />
        <meshPhysicalMaterial color="#1f2937" metalness={0.8} roughness={0.7} />
      </mesh>
      {/* Vertical Rod */}
      <mesh position={[-0.5, 2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 4, 32]} />
        <meshPhysicalMaterial color="#d1d5db" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Clamp */}
      <group position={[-0.5, 2.5, 0]}>
        <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI/2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.4, 16]} />
          <meshPhysicalMaterial color="#4b5563" metalness={0.7} roughness={0.5} />
        </mesh>
        <mesh position={[0.4, 0, 0]}>
          <boxGeometry args={[0.6, 0.1, 0.1]} />
          <meshPhysicalMaterial color="#d1d5db" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

export function ScaleRulerModel() {
  return (
    <group>
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[3, 0.02, 0.3]} />
        <meshPhysicalMaterial color="#f0fdfa" transmission={0.5} thickness={0.05} roughness={0.1} transparent opacity={0.6} />
      </mesh>
      {/* Ticks representation */}
      {Array.from({ length: 31 }).map((_, i) => (
        <mesh key={i} position={[-1.5 + (i * 0.1), 0.03, -0.1]}>
          <boxGeometry args={[0.01, 0.01, i % 5 === 0 ? 0.1 : 0.05]} />
          <meshBasicMaterial color="#000" />
        </mesh>
      ))}
    </group>
  );
}

export function RayBoxModel() {
  return (
    <group>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.8, 0.6, 1]} />
        <meshPhysicalMaterial color="#111" metalness={0.5} roughness={0.8} />
      </mesh>
      {/* Slits front */}
      <mesh position={[0, 0.3, 0.51]}>
        <planeGeometry args={[0.6, 0.4]} />
        <meshBasicMaterial color="#000" />
      </mesh>
      <mesh position={[-0.1, 0.3, 0.511]}>
        <planeGeometry args={[0.02, 0.3]} />
        <meshBasicMaterial color="#fff" />
      </mesh>
      <mesh position={[0, 0.3, 0.511]}>
        <planeGeometry args={[0.02, 0.3]} />
        <meshBasicMaterial color="#fff" />
      </mesh>
      <mesh position={[0.1, 0.3, 0.511]}>
        <planeGeometry args={[0.02, 0.3]} />
        <meshBasicMaterial color="#fff" />
      </mesh>
      {/* Switch on top */}
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
        <meshPhysicalMaterial color="#ef4444" roughness={0.5} />
      </mesh>
    </group>
  );
}

export function ProjectionScreenModel() {
  return (
    <group>
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[2, 1.5, 0.05]} />
        <meshPhysicalMaterial color="#fff" roughness={0.9} clearcoat={0} />
      </mesh>
      {/* Stand Base & frame */}
      <mesh position={[0, 1.2, -0.05]}>
         <boxGeometry args={[2.1, 1.6, 0.02]} />
         <meshPhysicalMaterial color="#111" />
      </mesh>
      <mesh position={[0, 0.2, -0.2]}>
         <boxGeometry args={[0.8, 0.05, 0.4]} />
         <meshPhysicalMaterial color="#333" />
      </mesh>
      <mesh position={[0, 0.7, -0.05]}>
         <cylinderGeometry args={[0.02, 0.02, 1, 16]} />
         <meshPhysicalMaterial color="#888" metalness={0.8} />
      </mesh>
    </group>
  );
}

export function DrawingSheetModel() {
  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh>
        <planeGeometry args={[2.5, 3.5]} />
        <meshStandardMaterial color="#fff" roughness={1} />
      </mesh>
      {/* Grid pattern abstraction */}
      <mesh position={[0, 0, 0.001]}>
        <planeGeometry args={[2.4, 3.4]} />
        <meshBasicMaterial color="#e2e8f0" wireframe transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

export function DynamicsCartModel() {
  return (
    <group>
      {/* Cart Body */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.2, 0.2, 0.6]} />
        <meshPhysicalMaterial color="#0ea5e9" metalness={0.8} roughness={0.2} clearcoat={1} />
      </mesh>
      {/* Wheels */}
      {[-0.4, 0.4].map((x) => (
         [-0.35, 0.35].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, 0.1, z]} rotation={[Math.PI/2, 0, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.05, 32]} />
              <meshPhysicalMaterial color="#111" roughness={0.9} />
            </mesh>
         ))
      ))}
      {/* Plunger/Spring */}
      <mesh position={[0.65, 0.3, 0]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 16]} />
        <meshPhysicalMaterial color="#d1d5db" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Top masses holder */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.8, 0.1, 0.4]} />
        <meshPhysicalMaterial color="#333" />
      </mesh>
    </group>
  );
}

export function DynamicsTrackModel() {
  return (
    <group>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[10, 0.1, 0.8]} />
        <meshPhysicalMaterial color="#e5e5e5" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Rails */}
      <mesh position={[0, 0.15, 0.3]}>
        <boxGeometry args={[10, 0.1, 0.05]} />
        <meshPhysicalMaterial color="#d1d5db" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.15, -0.3]}>
        <boxGeometry args={[10, 0.1, 0.05]} />
        <meshPhysicalMaterial color="#d1d5db" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

export function PulleyModel() {
  return (
    <group>
      {/* Bracket */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.05, 0.4, 0.3]} />
        <meshPhysicalMaterial color="#64748b" metalness={0.8} />
      </mesh>
      {/* Wheel */}
      <mesh position={[0.1, 0.2, 0]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.05, 32]} />
        <meshPhysicalMaterial color="#fbbf24" metalness={0.5} roughness={0.8} />
      </mesh>
      {/* Screw clamp to table */}
      <mesh position={[0, -0.1, 0.2]}>
        <boxGeometry args={[0.05, 0.2, 0.1]} />
        <meshPhysicalMaterial color="#64748b" metalness={0.8} />
      </mesh>
    </group>
  );
}

export function HangingMassModel() {
  return (
    <group>
      {/* Hanger stem */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1, 16]} />
        <meshPhysicalMaterial color="#b28c30" metalness={0.8} />
      </mesh>
      {/* Hook */}
      <mesh position={[0, 1.05, 0]}>
        <torusGeometry args={[0.04, 0.01, 16, 32]} />
        <meshPhysicalMaterial color="#b28c30" metalness={0.8} />
      </mesh>
      {/* Hanger base */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.05, 32]} />
        <meshPhysicalMaterial color="#b28c30" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Slotted masses */}
      {[0.1, 0.2, 0.3].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.08, 32]} />
          <meshPhysicalMaterial color="#6b7280" metalness={0.9} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

export function PlaneMirrorModel() {
  return (
    <group>
      {/* Mirror Glass */}
      <mesh position={[0, 0.5, 0]} rotation={[-Math.PI/12, 0, 0]}>
        <boxGeometry args={[1.5, 1, 0.05]} />
        <meshPhysicalMaterial color="#fff" metalness={1} roughness={0} clearcoat={1} transmission={0} />
      </mesh>
      {/* Wooden Block Stand */}
      <mesh position={[0, 0.1, -0.2]}>
        <boxGeometry args={[1.6, 0.2, 0.4]} />
        <meshPhysicalMaterial color="#78350f" roughness={0.8} />
      </mesh>
    </group>
  );
}

export function PencilModel() {
  return (
    <group rotation={[Math.PI/2, 0, Math.PI/4]}>
      {/* Body */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 1.5, 6]} />
        <meshPhysicalMaterial color="#facc15" roughness={0.8} />
      </mesh>
      {/* Sharpened Wood */}
      <mesh position={[0, 0.15, 0]}>
        <coneGeometry args={[0.03, 0.2, 6]} />
        <meshPhysicalMaterial color="#fed7aa" roughness={0.9} />
      </mesh>
      {/* Lead Tip */}
      <mesh position={[0, 0.04, 0]}>
        <coneGeometry args={[0.008, 0.08, 6]} />
        <meshPhysicalMaterial color="#333" roughness={1} />
      </mesh>
      {/* Eraser Ferrule */}
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.031, 0.031, 0.1, 16]} />
        <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Eraser */}
      <mesh position={[0, 1.9, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.1, 16]} />
        <meshPhysicalMaterial color="#f472b6" roughness={0.9} />
      </mesh>
    </group>
  );
}

export function IndicatorBottleModel({ labelColor = "#ef4444" }) {
  return (
    <group>
      {/* Bottle Body */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.4, 32]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} transparent opacity={0.6} roughness={0.1} />
      </mesh>
      {/* Liquid inside */}
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.3, 32]} />
        <meshPhysicalMaterial color={labelColor} transmission={0.5} transparent opacity={0.8} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.2, 32]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} transparent opacity={0.6} />
      </mesh>
      {/* Dropper Cap */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.2, 32]} />
        <meshPhysicalMaterial color="#333" roughness={0.8} />
      </mesh>
      {/* Rubber Bulb */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial color="#ef4444" roughness={0.9} />
      </mesh>
      {/* Label */}
      <mesh position={[0, -0.2, 0.151]}>
        <planeGeometry args={[0.2, 0.15]} />
        <meshBasicMaterial color="#fff" />
      </mesh>
    </group>
  );
}

export function SolutionBottleModel({ labelText = "Solution", color = "#10b981" }) {
  return (
    <group>
      {/* Bottle Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.8, 32]} />
        <meshPhysicalMaterial color="#f0f0f0" transmission={0.9} transparent opacity={0.7} roughness={0.1} />
      </mesh>
      {/* Liquid */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.6, 32]} />
        <meshPhysicalMaterial color={color} transmission={0.8} transparent opacity={0.8} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.1, 0.3, 0.2, 32]} />
        <meshPhysicalMaterial color="#f0f0f0" transmission={0.9} transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.2, 32]} />
        <meshPhysicalMaterial color="#f0f0f0" transmission={0.9} transparent opacity={0.7} />
      </mesh>
      {/* Cap */}
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.1, 32]} />
        <meshPhysicalMaterial color="#111" roughness={0.7} />
      </mesh>
      {/* Label */}
      <mesh position={[0, 0, 0.301]}>
        <planeGeometry args={[0.3, 0.4]} />
        <meshBasicMaterial color="#fff" />
      </mesh>
    </group>
  );
}

export function MeasuringCylinderModel({ liquidColor = "#3b82f6", liquidLevel = 0.5 }) {
  return (
    <group>
      {/* Hexagonal Base */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 6]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} transparent opacity={0.6} roughness={0.1} />
      </mesh>
      {/* Main Tube */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 3, 32]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} transparent opacity={0.4} roughness={0.05} />
      </mesh>
      {/* Spout */}
      <mesh position={[0.12, 1.95, 0]} rotation={[0, 0, -Math.PI/6]}>
        <cylinderGeometry args={[0.04, 0.04, 0.15, 16]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} transparent opacity={0.4} />
      </mesh>
      {/* Liquid */}
      {liquidLevel > 0 && (
        <mesh position={[0, -0.95 + (liquidLevel * 2.9)/2, 0]}>
          <cylinderGeometry args={[0.138, 0.138, liquidLevel * 2.9, 32]} />
          <meshPhysicalMaterial color={liquidColor} transmission={0.7} transparent opacity={0.8} />
        </mesh>
      )}
      {/* Graduation Marks */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={`mark-${i}`} position={[0.15, -0.5 + i * 0.25, 0]}>
          <boxGeometry args={[0.01, 0.005, 0.02]} />
          <meshBasicMaterial color="#fff" />
        </mesh>
      ))}
    </group>
  );
}

export function ChromatographyPaperModel() {
  return (
    <group>
      {/* Paper Strip */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[0.4, 1.8]} />
        <meshStandardMaterial color="#f8fafc" roughness={1} />
      </mesh>
      {/* Pencil Line */}
      <mesh position={[0, -0.6, 0.001]}>
        <planeGeometry args={[0.35, 0.01]} />
        <meshBasicMaterial color="#94a3b8" />
      </mesh>
      {/* Ink Spots */}
      <mesh position={[-0.1, -0.6, 0.002]}>
        <circleGeometry args={[0.02, 16]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <mesh position={[0, -0.6, 0.002]}>
        <circleGeometry args={[0.02, 16]} />
        <meshBasicMaterial color="#3b82f6" />
      </mesh>
      <mesh position={[0.1, -0.6, 0.002]}>
        <circleGeometry args={[0.02, 16]} />
        <meshBasicMaterial color="#22c55e" />
      </mesh>
      {/* Solvent Front Indicator (wet paper) */}
      <mesh position={[0, -0.3, -0.001]}>
        <planeGeometry args={[0.4, 0.6]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
      </mesh>
    </group>
  );
}

export function InkSampleVialModel() {
  return (
    <group>
      {/* Vial Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.3, 32]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} transparent opacity={0.6} roughness={0.1} />
      </mesh>
      {/* Ink inside */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.2, 32]} />
        <meshPhysicalMaterial color="#111" roughness={0.3} />
      </mesh>
      {/* Cap */}
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.085, 0.085, 0.05, 32]} />
        <meshPhysicalMaterial color="#f0f0f0" roughness={0.8} />
      </mesh>
    </group>
  );
}

export function WaterContainerModel() {
  return (
    <group>
      {/* Large Tank */}
      <mesh position={[0, 0, 0]}>
         <cylinderGeometry args={[0.8, 0.8, 1.5, 32]} />
         <meshPhysicalMaterial color="#ffffff" transmission={0.95} transparent opacity={0.4} roughness={0.1} />
      </mesh>
      {/* Water inside */}
      <mesh position={[0, -0.15, 0]}>
         <cylinderGeometry args={[0.78, 0.78, 1.2, 32]} />
         <meshPhysicalMaterial color="#0ea5e9" transmission={0.8} transparent opacity={0.6} />
      </mesh>
      {/* Spigot / Tap */}
      <group position={[0.78, -0.5, 0]}>
         <mesh rotation={[0, 0, Math.PI/2]}>
            <cylinderGeometry args={[0.05, 0.05, 0.2, 16]} />
            <meshPhysicalMaterial color="#e5e5e5" roughness={0.3} />
         </mesh>
         <mesh position={[0.1, 0.05, 0]}>
            <boxGeometry args={[0.02, 0.15, 0.05]} />
            <meshPhysicalMaterial color="#ef4444" roughness={0.5} />
         </mesh>
      </group>
      {/* Cap */}
      <mesh position={[0, 0.75, 0]}>
         <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
         <meshPhysicalMaterial color="#111" roughness={0.8} />
      </mesh>
    </group>
  );
}

export function ElectrodesModel() {
  return (
    <group>
      {/* Electrode 1 (Anode) */}
      <group position={[-0.2, 0, 0]}>
        {/* Rod */}
        <mesh>
          <cylinderGeometry args={[0.03, 0.03, 1, 16]} />
          <meshPhysicalMaterial color="#333" metalness={0.5} roughness={0.9} />
        </mesh>
        {/* Connector/Clip top */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.08, 0.1, 0.08]} />
          <meshPhysicalMaterial color="#ef4444" roughness={0.5} />
        </mesh>
      </group>
      
      {/* Electrode 2 (Cathode) */}
      <group position={[0.2, 0, 0]}>
        {/* Rod */}
        <mesh>
          <cylinderGeometry args={[0.03, 0.03, 1, 16]} />
          <meshPhysicalMaterial color="#b28c30" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Connector/Clip top */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.08, 0.1, 0.08]} />
          <meshPhysicalMaterial color="#111" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

export function PowerSupplyModel() {
  return (
    <group>
      {/* Box */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.5, 1, 1.2]} />
        <meshPhysicalMaterial color="#e5e5e5" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Screen */}
      <mesh position={[0.2, 0.6, 0.601]}>
        <boxGeometry args={[0.8, 0.4, 0.02]} />
        <meshPhysicalMaterial color="#111" />
      </mesh>
      {/* Readout Text representation */}
      <mesh position={[0.2, 0.6, 0.612]}>
        <planeGeometry args={[0.6, 0.2]} />
        <meshBasicMaterial color="#10b981" />
      </mesh>
      
      {/* Knobs */}
      <mesh position={[-0.4, 0.7, 0.6]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.05, 32]} />
        <meshPhysicalMaterial color="#333" roughness={0.8} />
      </mesh>
      <mesh position={[-0.4, 0.4, 0.6]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.05, 32]} />
        <meshPhysicalMaterial color="#333" roughness={0.8} />
      </mesh>

      {/* Terminals */}
      <mesh position={[0.4, 0.2, 0.6]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.1, 16]} />
        <meshPhysicalMaterial color="#ef4444" roughness={0.5} />
      </mesh>
      <mesh position={[0.1, 0.2, 0.6]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.1, 16]} />
        <meshPhysicalMaterial color="#111" roughness={0.5} />
      </mesh>
    </group>
  );
}

export function GlassStirrerModel() {
  return (
    <group rotation={[Math.PI/6, 0, Math.PI/12]}>
      <mesh>
        <cylinderGeometry args={[0.02, 0.02, 1.5, 16]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.99} transparent opacity={0.3} roughness={0.01} clearcoat={1} />
      </mesh>
      {/* Rounded ends */}
      <mesh position={[0, 0.75, 0]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.99} transparent opacity={0.3} roughness={0.01} clearcoat={1} />
      </mesh>
      <mesh position={[0, -0.75, 0]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.99} transparent opacity={0.3} roughness={0.01} clearcoat={1} />
      </mesh>
    </group>
  );
}

export function SlideModel() {
  return (
    <group>
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[0.8, 0.02, 0.3]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.95} transparent opacity={0.5} roughness={0.01} clearcoat={1} />
      </mesh>
    </group>
  );
}

export function CoverSlipModel() {
  return (
    <group>
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[0.2, 0.005, 0.2]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.99} transparent opacity={0.3} roughness={0.01} clearcoat={1} />
      </mesh>
    </group>
  );
}

export function OnionPeelModel() {
  return (
    <group>
      <mesh position={[0, 0.025, 0]}>
        <planeGeometry args={[0.15, 0.15]} />
        <meshPhysicalMaterial color="#d8b4e2" transmission={0.5} transparent opacity={0.8} roughness={0.5} />
      </mesh>
    </group>
  );
}

export function CheekCellModel() {
  return (
    <group>
      <mesh position={[0, 0.025, 0]}>
        <circleGeometry args={[0.06, 32]} />
        <meshPhysicalMaterial color="#fca5a5" transmission={0.5} transparent opacity={0.7} roughness={0.6} />
      </mesh>
      {/* Nucleus */}
      <mesh position={[0.01, 0.026, 0.01]}>
        <circleGeometry args={[0.015, 16]} />
        <meshPhysicalMaterial color="#991b1b" />
      </mesh>
    </group>
  );
}

export function PotatoModel() {
  return (
    <group>
      <mesh position={[0, 0.3, 0]} rotation={[Math.PI/4, Math.PI/3, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshPhysicalMaterial color="#d4a373" roughness={0.9} />
      </mesh>
      {/* Potato eyes or texture marks */}
      <mesh position={[0.2, 0.4, 0.15]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshPhysicalMaterial color="#6b4226" roughness={1} />
      </mesh>
      <mesh position={[-0.1, 0.2, 0.25]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshPhysicalMaterial color="#6b4226" roughness={1} />
      </mesh>
    </group>
  );
}

export function PlantSetupModel() {
  return (
    <group>
      {/* Pot */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.3, 0.2, 0.4, 32]} />
        <meshPhysicalMaterial color="#8b5a2b" roughness={0.9} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.39, 0]}>
        <cylinderGeometry args={[0.29, 0.29, 0.02, 32]} />
        <meshPhysicalMaterial color="#3e2723" roughness={1} />
      </mesh>
      {/* Stem */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 16]} />
        <meshPhysicalMaterial color="#2e7d32" roughness={0.6} />
      </mesh>
      {/* Leaves */}
      <mesh position={[0.1, 0.6, 0]} rotation={[0, 0, Math.PI/4]}>
        <coneGeometry args={[0.1, 0.3, 16]} />
        <meshPhysicalMaterial color="#388e3c" roughness={0.6} />
      </mesh>
      <mesh position={[-0.1, 0.8, 0]} rotation={[0, 0, -Math.PI/4]}>
        <coneGeometry args={[0.08, 0.25, 16]} />
        <meshPhysicalMaterial color="#388e3c" roughness={0.6} />
      </mesh>
    </group>
  );
}

export function LightSourceLampModel() {
  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.1, 32]} />
        <meshPhysicalMaterial color="#333" roughness={0.8} />
      </mesh>
      {/* Stand arm */}
      <mesh position={[0, 0.4, 0]} rotation={[0, 0, Math.PI/8]}>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 16]} />
        <meshPhysicalMaterial color="#666" metalness={0.7} />
      </mesh>
      {/* Lamp Head */}
      <group position={[0.15, 0.8, 0]} rotation={[0, 0, -Math.PI/4]}>
        <mesh>
          <coneGeometry args={[0.2, 0.3, 32]} />
          <meshPhysicalMaterial color="#222" roughness={0.5} />
        </mesh>
        {/* Bulb */}
        <mesh position={[0, -0.1, 0]}>
          <sphereGeometry args={[0.08, 32, 32]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2} />
        </mesh>
      </group>
    </group>
  );
}

export function DarkChamberModel() {
  return (
    <group>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.2, 1, 1.2]} />
        <meshPhysicalMaterial color="#111" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* Open front face representation */}
      <mesh position={[0, 0.5, 0.601]}>
        <planeGeometry args={[1.1, 0.9]} />
        <meshBasicMaterial color="#000" />
      </mesh>
    </group>
  );
}

export function EnzymeModel() {
  return (
    <group>
      {/* Enzyme Body - complex shape */}
      <mesh position={[0, 0.3, 0]}>
        <torusKnotGeometry args={[0.2, 0.08, 64, 16]} />
        <meshPhysicalMaterial color="#c084fc" roughness={0.4} clearcoat={0.5} />
      </mesh>
      {/* Active Site Marker */}
      <mesh position={[0, 0.3, 0.25]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshPhysicalMaterial color="#fde047" emissive="#fde047" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

export function PhControlModel() {
  return (
    <group>
      <PowerSupplyModel />
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[0.6, 0.3, 0.1]} />
        <meshPhysicalMaterial color="#333" />
      </mesh>
      <mesh position={[0, 1.2, 0.051]}>
        <planeGeometry args={[0.5, 0.2]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      {/* Text representation */}
      <mesh position={[0, 1.2, 0.052]}>
        <planeGeometry args={[0.4, 0.1]} />
        <meshBasicMaterial color="#fff" />
      </mesh>
    </group>
  );
}

export function ReactionChamberModel() {
  return (
    <group>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 1.2, 32]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} transparent opacity={0.4} roughness={0.1} />
      </mesh>
      {/* Steel Base */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.1, 32]} />
        <meshPhysicalMaterial color="#9ca3af" metalness={0.8} />
      </mesh>
      {/* Steel Top */}
      <mesh position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.1, 32]} />
        <meshPhysicalMaterial color="#9ca3af" metalness={0.8} />
      </mesh>
      {/* Pipes */}
      <mesh position={[-0.45, 1.25, 0]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.2, 16]} />
        <meshPhysicalMaterial color="#9ca3af" metalness={0.8} />
      </mesh>
      <mesh position={[0.45, 1.25, 0]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.2, 16]} />
        <meshPhysicalMaterial color="#9ca3af" metalness={0.8} />
      </mesh>
    </group>
  );
}

export function CoordinateGridModel() {
  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh>
        <planeGeometry args={[3, 3]} />
        <meshStandardMaterial color="#fff" roughness={1} />
      </mesh>
      <gridHelper args={[3, 10, '#3b82f6', '#cbd5e1']} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.01]} />
    </group>
  );
}

export function DraggablePointModel() {
  return (
    <group>
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.05, 32, 32]} />
        <meshPhysicalMaterial color="#ef4444" roughness={0.2} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.02, 32]} />
        <meshStandardMaterial color="#000" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

export function FormulaPanelModel() {
  return (
    <group>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[1.5, 0.8, 0.05]} />
        <meshPhysicalMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      {/* Chalk-like text representation */}
      <mesh position={[0, 1, 0.026]}>
        <planeGeometry args={[1.3, 0.6]} />
        <meshBasicMaterial color="#f8fafc" />
      </mesh>
    </group>
  );
}

export function GraphBoardModel() {
  return (
    <group>
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[2, 1.5, 0.1]} />
        <meshPhysicalMaterial color="#fff" roughness={1} />
      </mesh>
      {/* Graph lines representation */}
      <mesh position={[0, 1.2, 0.051]}>
        <planeGeometry args={[1.8, 1.3]} />
        <meshBasicMaterial color="#f1f5f9" />
      </mesh>
      {/* Axes */}
      <mesh position={[-0.8, 1.2, 0.052]}>
        <planeGeometry args={[0.01, 1.3]} />
        <meshBasicMaterial color="#000" />
      </mesh>
      <mesh position={[0, 0.6, 0.052]}>
        <planeGeometry args={[1.8, 0.01]} />
        <meshBasicMaterial color="#000" />
      </mesh>
      {/* Plotted line */}
      <mesh position={[0, 1.2, 0.053]} rotation={[0, 0, Math.PI/6]}>
        <planeGeometry args={[1.5, 0.02]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
    </group>
  );
}

export function DiceModel() {
  return (
    <group position={[0, 0.1, 0]}>
      <mesh>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshPhysicalMaterial color="#fff" roughness={0.3} />
      </mesh>
      {/* 1 dot */}
      <mesh position={[0, 0.101, 0]}>
        <circleGeometry args={[0.02, 16]} />
        <meshBasicMaterial color="#000" />
      </mesh>
      {/* 2 dots */}
      <mesh position={[0.101, 0.05, -0.05]} rotation={[0, Math.PI/2, 0]}>
        <circleGeometry args={[0.02, 16]} />
        <meshBasicMaterial color="#000" />
      </mesh>
      <mesh position={[0.101, -0.05, 0.05]} rotation={[0, Math.PI/2, 0]}>
        <circleGeometry args={[0.02, 16]} />
        <meshBasicMaterial color="#000" />
      </mesh>
    </group>
  );
}

export function CoinModel() {
  return (
    <group position={[0, 0.02, 0]} rotation={[Math.PI/2, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[0.15, 0.15, 0.02, 32]} />
        <meshPhysicalMaterial color="#fbbf24" metalness={0.9} roughness={0.3} />
      </mesh>
      {/* Relief face */}
      <mesh position={[0, -0.011, 0]} rotation={[Math.PI/2, 0, 0]}>
        <circleGeometry args={[0.1, 16]} />
        <meshPhysicalMaterial color="#d97706" metalness={0.9} roughness={0.4} />
      </mesh>
    </group>
  );
}

export function SpinnerModel() {
  return (
    <group>
      {/* Board */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.02, 32]} />
        <meshPhysicalMaterial color="#fff" roughness={0.8} />
      </mesh>
      {/* Colored Sections */}
      <mesh position={[0, 0.031, 0]}>
        <circleGeometry args={[0.55, 32, 0, Math.PI]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <mesh position={[0, 0.031, 0]}>
        <circleGeometry args={[0.55, 32, Math.PI, Math.PI]} />
        <meshBasicMaterial color="#3b82f6" />
      </mesh>
      {/* Arrow */}
      <mesh position={[0, 0.05, 0.2]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.05, 0.4, 3]} />
        <meshBasicMaterial color="#111" />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
        <meshBasicMaterial color="#000" />
      </mesh>
    </group>
  );
}

export function ThreeDShapesModel() {
  return (
    <group>
      {/* Sphere */}
      <mesh position={[-0.4, 0.2, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshPhysicalMaterial color="#3b82f6" roughness={0.4} clearcoat={1} />
      </mesh>
      {/* Cube */}
      <mesh position={[0.2, 0.15, 0.3]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshPhysicalMaterial color="#ef4444" roughness={0.4} clearcoat={1} />
      </mesh>
      {/* Pyramid */}
      <mesh position={[0.4, 0.2, -0.3]}>
        <coneGeometry args={[0.2, 0.4, 4]} />
        <meshPhysicalMaterial color="#10b981" roughness={0.4} clearcoat={1} />
      </mesh>
    </group>
  );
}

export function BloodFlowMarkersModel() {
  return (
    <group>
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[-0.4 + i*0.2, 0, 0]} rotation={[0, 0, -Math.PI/2]}>
          <coneGeometry args={[0.05, 0.1, 16]} />
          <meshPhysicalMaterial color="#ef4444" roughness={0.2} emissive="#ef4444" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

export function VesselPathwaysModel() {
  return (
    <group>
      <mesh position={[0, 0.1, 0]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[0.1, 0.1, 1.5, 32]} />
        <meshPhysicalMaterial color="#fca5a5" transmission={0.5} transparent opacity={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.1, 0]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[0.08, 0.08, 1.5, 32]} />
        <meshPhysicalMaterial color="#93c5fd" transmission={0.5} transparent opacity={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

export function PushButtonModel({ pressed = false }) {
  return (
    <group>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.5, 0.1, 0.5]} />
        <meshPhysicalMaterial color="#333" />
      </mesh>
      <mesh position={[0, pressed ? 0.08 : 0.15, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 32]} />
        <meshPhysicalMaterial color="#ef4444" roughness={0.4} />
      </mesh>
      {/* Terminals */}
      <mesh position={[-0.2, 0.05, -0.2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.2, 16]} />
        <meshPhysicalMaterial color="#d1d5db" metalness={0.8} />
      </mesh>
      <mesh position={[0.2, 0.05, 0.2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.2, 16]} />
        <meshPhysicalMaterial color="#d1d5db" metalness={0.8} />
      </mesh>
    </group>
  );
}

export function CapacitorModel() {
  return (
    <group>
      {/* Electrolytic Body */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.8, 32]} />
        <meshPhysicalMaterial color="#1e40af" metalness={0.1} roughness={0.2} clearcoat={1} />
      </mesh>
      {/* Aluminum Top Cap with score lines */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.02, 32]} />
        <meshPhysicalMaterial color="#aaa" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Negative Terminal Stripe */}
      <mesh position={[0, 0.4, 0.22]}>
        <boxGeometry args={[0.08, 0.78, 0.06]} />
        <meshPhysicalMaterial color="#ddd" roughness={0.5} />
      </mesh>
      {/* Minus Signs on stripe */}
      {[-0.2, 0, 0.2].map((y, i) => (
        <mesh key={i} position={[0, 0.4 + y, 0.255]}>
          <planeGeometry args={[0.04, 0.01]} />
          <meshBasicMaterial color="#333" />
        </mesh>
      ))}
      {/* Rubber Bottom Plug */}
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.24, 0.22, 0.03, 32]} />
        <meshPhysicalMaterial color="#111" roughness={0.9} />
      </mesh>
      {/* Realistic Terminal Leads */}
      <mesh position={[-0.08, -0.3, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 16]} />
        <meshPhysicalMaterial color="#bbb" metalness={1} roughness={0.2} />
      </mesh>
      <mesh position={[0.08, -0.4, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.8, 16]} />
        <meshPhysicalMaterial color="#bbb" metalness={1} roughness={0.2} />
      </mesh>
      {/* Label Text */}
      <Text position={[0.26, 0.4, 0]} rotation={[0, Math.PI/2, 0]} fontSize={0.06} color="white">
        470µF 25V
      </Text>
    </group>
  );
}

export function BuzzerModel() {
  return (
    <group>
      {/* Main Casing */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.4, 32]} />
        <meshPhysicalMaterial color="#111" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Sound Output Grill */}
      <mesh position={[0, 0.405, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.01, 32]} />
        <meshPhysicalMaterial color="#222" roughness={0.5} />
      </mesh>
      {/* Central Aperture */}
      <mesh position={[0, 0.41, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.01, 32]} />
        <meshBasicMaterial color="#000" />
      </mesh>
      {/* Top Label +/- */}
      <Text position={[0.25, 0.415, 0]} rotation={[-Math.PI/2, 0, 0]} fontSize={0.1} color="#ef4444" fontWeight="bold">
        +
      </Text>
      {/* Mounting Pins */}
      <mesh position={[-0.2, -0.1, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.4, 16]} />
        <meshPhysicalMaterial color="#b28c30" metalness={1} />
      </mesh>
      <mesh position={[0.2, -0.1, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.4, 16]} />
        <meshPhysicalMaterial color="#b28c30" metalness={1} />
      </mesh>
    </group>
  );
}

export function FuseModel() {
  return (
    <group rotation={[Math.PI/2, 0, Math.PI/2]}>
      {/* Glass Cylinder with refractive properties */}
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, 0.6, 32]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          transmission={0.98} 
          thickness={0.05} 
          transparent 
          opacity={0.3} 
          roughness={0.01} 
          clearcoat={1} 
        />
      </mesh>
      {/* Realistic Metal End Caps */}
      <group position={[0, 0.35, 0]}>
        <mesh>
          <cylinderGeometry args={[0.11, 0.11, 0.15, 32]} />
          <meshPhysicalMaterial color="#ddd" metalness={1} roughness={0.1} />
        </mesh>
        {/* Cap detailing */}
        <mesh position={[0, 0.076, 0]}>
           <cylinderGeometry args={[0.11, 0.1, 0.02, 32]} />
           <meshPhysicalMaterial color="#ccc" metalness={1} roughness={0.2} />
        </mesh>
      </group>
      <group position={[0, -0.35, 0]}>
        <mesh>
          <cylinderGeometry args={[0.11, 0.11, 0.15, 32]} />
          <meshPhysicalMaterial color="#ddd" metalness={1} roughness={0.1} />
        </mesh>
        <mesh position={[0, -0.076, 0]}>
           <cylinderGeometry args={[0.1, 0.11, 0.02, 32]} />
           <meshPhysicalMaterial color="#ccc" metalness={1} roughness={0.2} />
        </mesh>
      </group>
      {/* Delicate Fuse Wire */}
      <mesh rotation={[0, 0, 0.1]}>
        <cylinderGeometry args={[0.006, 0.006, 0.6, 8]} />
        <meshPhysicalMaterial color="#aaa" metalness={0.8} />
      </mesh>
      {/* Specification Text on cap */}
      <Text position={[0.12, 0, 0]} rotation={[0, Math.PI/2, 0]} fontSize={0.04} color="#555">
        F5A 250V
      </Text>
    </group>
  );
}

export function LightBulbModel({ glowing = false }) {
  return (
    <group>
      {/* Base contact */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.1, 32]} />
        <meshPhysicalMaterial color="#111" roughness={0.8} />
      </mesh>
      {/* Threaded base */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.2, 32]} />
        <meshPhysicalMaterial color="#ca8a04" metalness={0.9} roughness={0.4} />
      </mesh>
      {/* Glass Bulb */}
      <mesh position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshPhysicalMaterial 
          color={glowing ? "#fef08a" : "#ffffff"} 
          transmission={glowing ? 0.3 : 0.9} 
          transparent 
          opacity={0.8} 
          roughness={0.1}
          emissive={glowing ? "#fef08a" : "#000000"}
          emissiveIntensity={glowing ? 2 : 0}
        />
      </mesh>
      {/* Filament */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 16]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <torusGeometry args={[0.08, 0.01, 16, 32]} />
        <meshPhysicalMaterial 
          color="#333" 
          emissive={glowing ? "#fef08a" : "#000000"} 
          emissiveIntensity={glowing ? 5 : 0} 
        />
      </mesh>
    </group>
  );
}

export function RightTriangleModel() {
  return (
    <group>
      {/* Triangle geometry */}
      <mesh position={[0, 0, 0]}>
        <shapeGeometry args={[
          (() => {
            const shape = new THREE.Shape();
            shape.moveTo(0, 0);
            shape.lineTo(0.8, 0);
            shape.lineTo(0, 0.6);
            shape.lineTo(0, 0);
            return shape;
          })()
        ]} />
        <meshPhysicalMaterial color="#f8fafc" transmission={0.9} transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      {/* Right angle symbol */}
      <mesh position={[0.05, 0.05, 0.001]}>
        <planeGeometry args={[0.05, 0.05]} />
        <meshBasicMaterial color="#ef4444" wireframe />
      </mesh>
    </group>
  );
}

export function AngleToolModel() {
  return (
    <group>
      <mesh position={[0, 0.02, 0]} rotation={[Math.PI/2, 0, 0]}>
        <ringGeometry args={[0.4, 0.5, 32, 1, 0, Math.PI]} />
        <meshPhysicalMaterial color="#e5e7eb" transmission={0.5} transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>
      {/* Center mark */}
      <mesh position={[0, 0.02, 0]}>
        <circleGeometry args={[0.02, 16]} />
        <meshBasicMaterial color="#000" />
      </mesh>
      {/* Tick marks */}
      {[0, Math.PI/4, Math.PI/2, 3*Math.PI/4, Math.PI].map((angle, i) => (
        <mesh key={i} position={[Math.cos(angle)*0.45, 0.021, Math.sin(angle)*0.45]} rotation={[0, -angle, 0]}>
          <boxGeometry args={[0.08, 0.002, 0.01]} />
          <meshBasicMaterial color="#000" />
        </mesh>
      ))}
    </group>
  );
}

export function RheostatModel() {
  return (
    <group>
      {/* End brackets */}
      <mesh position={[-0.8, 0.2, 0]}>
        <boxGeometry args={[0.1, 0.4, 0.4]} />
        <meshPhysicalMaterial color="#475569" roughness={0.8} />
      </mesh>
      <mesh position={[0.8, 0.2, 0]}>
        <boxGeometry args={[0.1, 0.4, 0.4]} />
        <meshPhysicalMaterial color="#475569" roughness={0.8} />
      </mesh>
      {/* Ceramic core */}
      <mesh position={[0, 0.2, 0]} rotation={[0, 0, Math.PI/2]}>
         <cylinderGeometry args={[0.15, 0.15, 1.5, 64]} />
         <meshPhysicalMaterial color="#78350f" roughness={0.9} />
      </mesh>
      {/* Texture representation of coils */}
      {Array.from({length: 60}).map((_, i) => (
         <mesh key={i} position={[-0.72 + i*0.024, 0.2, 0]} rotation={[0, 0, Math.PI/2]}>
            <torusGeometry args={[0.152, 0.005, 8, 32]} />
            <meshPhysicalMaterial color="#b45309" metalness={0.8} roughness={0.4} />
         </mesh>
      ))}
      {/* Guide bar */}
      <mesh position={[0, 0.45, 0]} rotation={[0, 0, Math.PI/2]}>
         <cylinderGeometry args={[0.03, 0.03, 1.6, 16]} />
         <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Slider */}
      <group position={[0.2, 0.45, 0]}>
         <mesh>
            <boxGeometry args={[0.2, 0.06, 0.15]} />
            <meshPhysicalMaterial color="#1e293b" />
         </mesh>
         <mesh position={[0, -0.15, 0]}>
            <coneGeometry args={[0.02, 0.3, 16]} />
            <meshPhysicalMaterial color="#fbbf24" metalness={1} />
         </mesh>
      </group>
      {/* Terminals */}
      <mesh position={[-0.8, 0.4, 0.1]} rotation={[Math.PI/2, 0, 0]}>
         <cylinderGeometry args={[0.04, 0.04, 0.1, 16]} />
         <meshPhysicalMaterial color="#ef4444" metalness={0.5} />
      </mesh>
      <mesh position={[0.8, 0.4, 0.1]} rotation={[Math.PI/2, 0, 0]}>
         <cylinderGeometry args={[0.04, 0.04, 0.1, 16]} />
         <meshPhysicalMaterial color="#111" metalness={0.5} />
      </mesh>
    </group>
  );
}

export function LogicGateModel({ type = "AND" }) {
  return (
    <group>
      {/* Realistic 14-pin DIP IC Casing */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.2, 0.2, 0.5]} />
        <meshPhysicalMaterial color="#111" roughness={0.8} metalness={0.1} />
      </mesh>
      {/* Polished Top Face for labeling */}
      <mesh position={[0, 0.301, 0]}>
         <boxGeometry args={[1.1, 0.01, 0.4]} />
         <meshPhysicalMaterial color="#222" roughness={0.4} />
      </mesh>
      {/* Orientation Notch */}
      <mesh position={[-0.6, 0.2, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.21, 16, 1, false, Math.PI/2, Math.PI]} />
        <meshPhysicalMaterial color="#000" />
      </mesh>
      {/* Pins - Realistic bent metallic pins */}
      {Array.from({ length: 7 }).map((_, i) => (
        <group key={i} position={[-0.45 + i * 0.15, 0.1, 0]}>
          {/* Top pin segment */}
          <group position={[0, 0, 0.25]}>
             <mesh rotation={[0, 0, 0]}>
                <boxGeometry args={[0.04, 0.01, 0.1]} />
                <meshPhysicalMaterial color="#ddd" metalness={1} roughness={0.2} />
             </mesh>
             {/* Vertical pin segment */}
             <mesh position={[0, -0.2, 0.04]}>
                <boxGeometry args={[0.04, 0.4, 0.01]} />
                <meshPhysicalMaterial color="#ddd" metalness={1} roughness={0.2} />
             </mesh>
          </group>
          <group position={[0, 0, -0.25]}>
             <mesh rotation={[0, 0, 0]}>
                <boxGeometry args={[0.04, 0.01, 0.1]} />
                <meshPhysicalMaterial color="#ddd" metalness={1} roughness={0.2} />
             </mesh>
             <mesh position={[0, -0.2, -0.04]}>
                <boxGeometry args={[0.04, 0.4, 0.01]} />
                <meshPhysicalMaterial color="#ddd" metalness={1} roughness={0.2} />
             </mesh>
          </group>
        </group>
      ))}
      {/* Technical Markings */}
      <group position={[0, 0.305, 0]}>
         <Text position={[-0.2, 0, 0]} rotation={[-Math.PI/2, 0, 0]} fontSize={0.12} color="#ddd" font="/fonts/JetBrainsMono-Bold.woff">
            SN74LS{type === "AND" ? "08" : type === "OR" ? "32" : type === "NOT" ? "04" : "86"}N
         </Text>
         <Text position={[0.3, 0, 0]} rotation={[-Math.PI/2, 0, 0]} fontSize={0.08} color="#999">
            {type}
         </Text>
         {/* Symbol Representation */}
         <group position={[0, 0, 0.1]} rotation={[-Math.PI/2, 0, 0]}>
             {type === "AND" && (
                <mesh>
                   <boxGeometry args={[0.1, 0.005, 0.1]} />
                   <meshBasicMaterial color="#4ade80" />
                </mesh>
             )}
             {type === "OR" && (
                <mesh>
                   <sphereGeometry args={[0.05, 16, 16]} />
                   <meshBasicMaterial color="#3b82f6" />
                </mesh>
             )}
         </group>
      </group>
      {/* Input/Output Pin Indicators */}
      <group position={[0, 0.31, 0]}>
         <Text position={[-0.45, 0, 0.3]} rotation={[-Math.PI/2, 0, 0]} fontSize={0.04} color="#666">1</Text>
         <Text position={[0.45, 0, 0.3]} rotation={[-Math.PI/2, 0, 0]} fontSize={0.04} color="#666">7</Text>
         <Text position={[0.45, 0, -0.3]} rotation={[-Math.PI/2, 0, 0]} fontSize={0.04} color="#666">8</Text>
         <Text position={[-0.45, 0, -0.3]} rotation={[-Math.PI/2, 0, 0]} fontSize={0.04} color="#666">14</Text>
      </group>
    </group>
  );
}

export function AndGateModel() { return <LogicGateModel type="AND" />; }
export function OrGateModel() { return <LogicGateModel type="OR" />; }
export function NotGateModel() { return <LogicGateModel type="NOT" />; }
export function XorGateModel() { return <LogicGateModel type="XOR" />; }

export function AdvancedWireModel() {
  return (
    <group>
       <mesh position={[0, 0.02, 0]} rotation={[0, 0, Math.PI/2]}>
          <cylinderGeometry args={[0.02, 0.02, 1.2, 16]} />
          <meshPhysicalMaterial color="#ef4444" roughness={0.4} />
       </mesh>
       <mesh position={[-0.6, 0.02, 0]} rotation={[0, 0, Math.PI/2]}>
          <cylinderGeometry args={[0.01, 0.01, 0.1, 8]} />
          <meshPhysicalMaterial color="#d1d5db" metalness={1} />
       </mesh>
       <mesh position={[0.6, 0.02, 0]} rotation={[0, 0, Math.PI/2]}>
          <cylinderGeometry args={[0.01, 0.01, 0.1, 8]} />
          <meshPhysicalMaterial color="#d1d5db" metalness={1} />
       </mesh>
       <mesh position={[-0.55, 0.02, 0]} rotation={[0, 0, Math.PI/2]}>
          <cylinderGeometry args={[0.025, 0.025, 0.05, 16]} />
          <meshPhysicalMaterial color="#111" />
       </mesh>
       <mesh position={[0.55, 0.02, 0]} rotation={[0, 0, Math.PI/2]}>
          <cylinderGeometry args={[0.025, 0.025, 0.05, 16]} />
          <meshPhysicalMaterial color="#111" />
       </mesh>
    </group>
  );
}

export function AdvancedDCSourceModel() {
  return (
    <group>
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[1.6, 1.2, 1.4]} />
        <meshPhysicalMaterial color="#e5e5e5" metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.6, 0.701]}>
        <boxGeometry args={[1.5, 1.1, 0.02]} />
        <meshPhysicalMaterial color="#1e293b" />
      </mesh>
      <mesh position={[-0.3, 0.8, 0.712]}>
        <planeGeometry args={[0.6, 0.3]} />
        <meshBasicMaterial color="#020617" />
      </mesh>
      <mesh position={[-0.3, 0.8, 0.713]}>
        <planeGeometry args={[0.5, 0.15]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <mesh position={[0.4, 0.8, 0.712]}>
        <planeGeometry args={[0.6, 0.3]} />
        <meshBasicMaterial color="#020617" />
      </mesh>
      <mesh position={[0.4, 0.8, 0.713]}>
        <planeGeometry args={[0.5, 0.15]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      
      <mesh position={[-0.4, 0.4, 0.71]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.06, 32]} />
        <meshPhysicalMaterial color="#f8fafc" roughness={0.3} metalness={0.7} />
      </mesh>
      <mesh position={[-0.1, 0.4, 0.71]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.05, 32]} />
        <meshPhysicalMaterial color="#f8fafc" roughness={0.3} metalness={0.7} />
      </mesh>
      <mesh position={[0.3, 0.4, 0.71]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.06, 32]} />
        <meshPhysicalMaterial color="#f8fafc" roughness={0.3} metalness={0.7} />
      </mesh>
      
      <group position={[-0.5, 0.15, 0.75]} rotation={[Math.PI/2, 0, 0]}>
         <cylinderGeometry args={[0.06, 0.06, 0.12, 16]} />
         <meshPhysicalMaterial color="#22c55e" roughness={0.4} />
      </group>
      <group position={[0, 0.15, 0.75]} rotation={[Math.PI/2, 0, 0]}>
         <cylinderGeometry args={[0.06, 0.06, 0.12, 16]} />
         <meshPhysicalMaterial color="#0f172a" roughness={0.4} />
      </group>
      <group position={[0.5, 0.15, 0.75]} rotation={[Math.PI/2, 0, 0]}>
         <cylinderGeometry args={[0.06, 0.06, 0.12, 16]} />
         <meshPhysicalMaterial color="#ef4444" roughness={0.4} />
      </group>
      <mesh position={[0.6, 0.4, 0.72]}>
        <boxGeometry args={[0.15, 0.2, 0.05]} />
        <meshPhysicalMaterial color="#ef4444" />
      </mesh>
    </group>
  );
}
