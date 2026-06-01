
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Sphere, Text, Float } from '@react-three/drei';
import { useLabStore } from '../../store/useLabStore';
import * as THREE from 'three';

export function PendulumScene() {
  const { addReading } = useLabStore();
  const [length, setLength] = useState(5);
  const [isSimulating, setIsSimulating] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  
  const period = 2 * Math.PI * Math.sqrt(length / 9.81);
  const [startTime, setStartTime] = useState(0);
  const [timer, setTimer] = useState(0);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      if (isSimulating) {
        const t = clock.getElapsedTime() - startTime;
        setTimer(t);
        const theta = 0.2 * Math.cos((2 * Math.PI * t) / period);
        groupRef.current.rotation.z = theta;
      } else {
        groupRef.current.rotation.z = 0;
      }
    }
  });

  const toggleSimulation = () => {
    if (!isSimulating) {
      setStartTime(performance.now() / 1000);
      setIsSimulating(true);
    } else {
      setIsSimulating(false);
      addReading({ x: length, y: period.toFixed(3), timestamp: Date.now() });
    }
  };

  return (
    <group position={[0, 0, 0]}>
      {/* Stand - Heavy professional lab support */}
      <group position={[0, 0, 0]}>
         <Box args={[4, 0.4, 4]} position={[0, -0.2, 0]} receiveShadow>
            <meshPhysicalMaterial color="#1f2937" metalness={0.7} roughness={0.4} />
         </Box>
         <Cylinder args={[0.15, 0.15, 10, 32]} position={[0, 5, -1.8]} castShadow>
            <meshPhysicalMaterial color="#9ca3af" metalness={1} roughness={0.1} clearcoat={1} />
         </Cylinder>
         <Cylinder args={[0.08, 0.08, 2, 32]} rotation={[Math.PI / 2, 0, 0]} position={[0, 10, -1]}>
            <meshPhysicalMaterial color="#9ca3af" metalness={1} roughness={0.1} clearcoat={1} />
         </Cylinder>
         {/* Mounting Bracket */}
         <Box args={[0.3, 0.3, 0.3]} position={[0, 10, -0.1]}>
            <meshPhysicalMaterial color="#4b5563" metalness={0.8} />
         </Box>
      </group>

      <group position={[0, 10, -0.1]}>
         <group ref={groupRef}>
            {/* High tension synthetic string */}
            <Cylinder args={[0.005, 0.005, length, 8]} position={[0, -length / 2, 0]}>
               <meshPhysicalMaterial color="#d1d5db" roughness={0.8} />
            </Cylinder>
            {/* Precision Chrome Bob */}
            <Sphere args={[0.35, 64, 64]} position={[0, -length, 0]} castShadow>
               <meshPhysicalMaterial color="#ffffff" metalness={1} roughness={0.05} clearcoat={1} ior={2.5} />
            </Sphere>
         </group>
      </group>

      {/* Interface Panel (3D) */}
      <group position={[3, 2, 0]} rotation={[0, -Math.PI / 4, 0]}>
         <Box args={[2, 3, 0.1]}>
            <meshStandardMaterial color="#111" />
         </Box>
         <Text position={[0, 1.2, 0.1]} fontSize={0.15} color="white">INSTRUMENTATION</Text>
         <Text position={[0, 0.5, 0.1]} fontSize={0.12} color="#666">Length: {length}m</Text>
         <Text position={[0, 0, 0.1]} fontSize={0.12} color="#666">Period: {period.toFixed(2)}s</Text>
         <Text position={[0, -0.5, 0.1]} fontSize={0.3} color="#fcd34d">{timer.toFixed(2)}s</Text>
         
         <Float speed={2} rotationIntensity={0.5}>
            <mesh position={[0, -1, 0.15]} onClick={toggleSimulation}>
               <boxGeometry args={[1.5, 0.4, 0.1]} />
               <meshStandardMaterial color={isSimulating ? "#ef4444" : "#10b981"} />
               <Text position={[0, 0, 0.1]} fontSize={0.1} color="white">
                  {isSimulating ? "STOP / RECORD" : "RELEASE BOB"}
               </Text>
            </mesh>
         </Float>
      </group>

      {/* Adjust Length Handle */}
      <mesh position={[0, 10 - length, 0.5]} onPointerDown={() => {}} onPointerUp={() => {}}>
         <sphereGeometry args={[0.1]} />
         <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}
