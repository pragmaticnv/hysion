import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Box, Text, Html, Cylinder, Cone } from '@react-three/drei';
import * as THREE from 'three';

export function MillikanOilDrop({ showLabels, voltage, setVoltage }: { showLabels?: boolean, voltage: number, setVoltage: (v: number) => void }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Oil droplets
  const droplets = useMemo(() => {
    return Array.from({ length: 30 }).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 2
      ),
      charge: Math.floor(Math.random() * 5) + 1, // 1e to 5e
      mass: Math.random() * 0.5 + 0.5,
      velocity: new THREE.Vector3(0, 0, 0),
      initialPos: new THREE.Vector3((Math.random() - 0.5) * 2, 2.2, (Math.random() - 0.5) * 2) // Start near atomizer
    }));
  }, []);

  const dropletsRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Field lines visualization
  const fieldLines = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      const radius = 1.5 + Math.random() * 1;
      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius
      };
    });
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.05) * 0.1;
    }

    if (dropletsRef.current) {
      droplets.forEach((drop, i) => {
        // Gravity pulls down
        const gravity = -9.8 * drop.mass * 0.001;
        
        // Electric force
        // F = qE, E = V/d. Here we simplify.
        const electricForce = voltage * drop.charge * 0.005;
        
        // Drag force (Stokes' law)
        const drag = -drop.velocity.y * 2.0; // Higher drag for oil in air

        const netForce = gravity + electricForce + drag;
        drop.velocity.y += netForce * delta;
        drop.position.y += drop.velocity.y * delta * 5;

        // Boundary/Reset
        if (drop.position.y < -2.5 || drop.position.y > 2.5) {
          // Reset to atomizer
          drop.position.copy(drop.initialPos);
          drop.velocity.set(0, 0, 0);
        }

        // Brownian motion
        drop.position.x += (Math.random() - 0.5) * 0.02;
        drop.position.z += (Math.random() - 0.5) * 0.02;

        dummy.position.copy(drop.position);
        const scale = 0.5 + (drop.charge / 5) * 0.5; // Larger charge = slightly larger visual
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        dropletsRef.current!.setMatrixAt(i, dummy.matrix);
      });
      dropletsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  const plateColor = voltage > 0 ? "#ff4444" : voltage < 0 ? "#4444ff" : "#888888";
  const fieldOpacity = Math.abs(voltage) / 10;

  return (
    <group ref={groupRef}>
      {/* Main Chamber - Holographic Glass */}
      <Cylinder args={[3.2, 3.2, 5.5, 32, 1, true]} position={[0, 0, 0]}>
        <meshPhysicalMaterial 
          color="#aaddff" 
          transparent 
          opacity={0.15} 
          roughness={0.1} 
          metalness={0.9}
          side={THREE.DoubleSide} 
          emissive="#0044aa"
          emissiveIntensity={0.1}
        />
      </Cylinder>
      
      {/* Top Plate (+) */}
      <group position={[0, 2, 0]}>
        <Cylinder args={[3, 3, 0.1, 32]}>
          <meshStandardMaterial color="#ff3333" emissive="#ff0000" emissiveIntensity={0.2} metalness={0.8} roughness={0.2} />
        </Cylinder>
        <gridHelper args={[6, 20, 0xff0000, 0x550000]} position={[0, 0.06, 0]} />
      </group>
      
      {/* Bottom Plate (-) */}
      <group position={[0, -2, 0]}>
        <Cylinder args={[3, 3, 0.1, 32]}>
          <meshStandardMaterial color="#3333ff" emissive="#0000ff" emissiveIntensity={0.2} metalness={0.8} roughness={0.2} />
        </Cylinder>
        <gridHelper args={[6, 20, 0x0000ff, 0x000055]} position={[0, 0.06, 0]} />
      </group>

      {/* Electric Field Lines */}
      {fieldLines.map((pos, i) => (
        <Cylinder key={i} args={[0.02, 0.02, 4, 8]} position={[pos.x, 0, pos.z]}>
          <meshBasicMaterial 
            color={voltage > 0 ? "#ff00ff" : "#00ffff"} 
            transparent 
            opacity={fieldOpacity * 0.5} 
            blending={THREE.AdditiveBlending}
          />
        </Cylinder>
      ))}

      {/* Atomizer (Spray nozzle) */}
      <group position={[2.8, 2.5, 0]} rotation={[0, 0, Math.PI / 3]}>
        <Cylinder args={[0.15, 0.3, 1.2, 16]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#00ffcc" metalness={0.9} roughness={0.1} emissive="#004444" />
        </Cylinder>
        <Sphere args={[0.4, 16, 16]} position={[0, 0.7, 0]}>
          <meshStandardMaterial color="#111" metalness={0.8} />
        </Sphere>
        {/* Mist particles */}
        <Sphere args={[0.05, 8, 8]} position={[0, -0.8, 0]}>
           <meshBasicMaterial color="#ffff00" transparent opacity={0.6} />
        </Sphere>
        <Sphere args={[0.04, 8, 8]} position={[0.1, -0.9, 0.1]}>
           <meshBasicMaterial color="#ffff00" transparent opacity={0.5} />
        </Sphere>
      </group>

      {/* X-Ray Source (Ionizer) */}
      <group position={[-3.5, 0.5, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <Box args={[1, 1, 1]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#222" metalness={0.8} />
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
            <lineBasicMaterial color="#00ff00" />
          </lineSegments>
        </Box>
        <Cone args={[0.5, 2, 32, 1, true]} position={[0, 1.5, 0]} rotation={[0, 0, 0]}>
          <meshBasicMaterial color="#00ff00" transparent opacity={0.1} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
        </Cone>
        <Text position={[0, -0.8, 0]} fontSize={0.3} color="#00ff00" rotation={[0, 0, Math.PI/2]}>
          X-RAY SOURCE
        </Text>
      </group>

      {/* Microscope Viewing Port */}
      <group position={[0, 0, 3.5]} rotation={[Math.PI / 2, 0, 0]}>
        <Cylinder args={[0.5, 0.6, 1.5, 32]} position={[0, 0.5, 0]}>
          <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
          <lineSegments>
             <edgesGeometry args={[new THREE.CylinderGeometry(0.5, 0.6, 1.5, 32)]} />
             <lineBasicMaterial color="#00ffff" />
          </lineSegments>
        </Cylinder>
        <Cylinder args={[0.4, 0.4, 0.1, 32]} position={[0, 1.3, 0]}>
          <meshBasicMaterial color="#00ffff" />
        </Cylinder>
      </group>

      {/* Light Source */}
      <group position={[-3.5, -1, 2]} rotation={[0, Math.PI / 4, 0]}>
        <Cylinder args={[0.4, 0.6, 1, 16]} position={[0, 0, 0]} rotation={[0, 0, -Math.PI/2]}>
          <meshStandardMaterial color="#333" metalness={0.8} />
        </Cylinder>
        <pointLight position={[1, 0, 0]} intensity={30} color="#ffffaa" distance={8} decay={2} />
        <Cone args={[0.5, 4, 32, 1, true]} position={[2.5, 0, 0]} rotation={[0, 0, -Math.PI/2]}>
           <meshBasicMaterial color="#ffffaa" transparent opacity={0.05} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
        </Cone>
      </group>

      {/* Oil Droplets (Instanced) */}
      <instancedMesh ref={dropletsRef} args={[undefined, undefined, 30]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#ffaa00" emissive="#ff4400" emissiveIntensity={0.8} toneMapped={false} />
      </instancedMesh>

      {/* Holographic Labels */}
      {showLabels && (
        <>
          <Html position={[0, 2.8, 0]} center>
            <div className="flex items-center gap-2">
              <div className="w-8 h-[1px] bg-red-500"></div>
              <div className="text-red-400 text-xs font-mono bg-black/80 px-2 py-1 border border-red-500/30 rounded backdrop-blur-sm">
                Anode (+ Plate)
              </div>
            </div>
          </Html>
          <Html position={[0, -2.8, 0]} center>
             <div className="flex items-center gap-2">
              <div className="w-8 h-[1px] bg-blue-500"></div>
              <div className="text-blue-400 text-xs font-mono bg-black/80 px-2 py-1 border border-blue-500/30 rounded backdrop-blur-sm">
                Cathode (- Plate)
              </div>
            </div>
          </Html>
          <Html position={[3.2, 3, 0]} center>
            <div className="text-emerald-400 text-xs font-mono bg-black/80 px-2 py-1 border border-emerald-500/30 rounded backdrop-blur-sm">
              Atomizer (Oil Mist)
            </div>
          </Html>
          <Html position={[0, 0, 4.8]} center>
            <div className="text-cyan-400 text-xs font-mono bg-black/80 px-2 py-1 border border-cyan-500/30 rounded backdrop-blur-sm">
              Microscope View
            </div>
          </Html>
          <Html position={[-4, 1.5, 0]} center>
            <div className="text-green-400 text-xs font-mono bg-black/80 px-2 py-1 border border-green-500/30 rounded backdrop-blur-sm">
              X-Ray Ionizer
            </div>
          </Html>
          <Html position={[-4, -1, 2]} center>
            <div className="text-yellow-400 text-xs font-mono bg-black/80 px-2 py-1 border border-yellow-500/30 rounded backdrop-blur-sm">
              Light Source
            </div>
          </Html>
        </>
      )}
    </group>
  );
}
