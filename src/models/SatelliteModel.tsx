import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export function SatelliteModel() {
  const groupRef = useRef<THREE.Group>(null);
  const solarArrayLeftRef = useRef<THREE.Group>(null);
  const solarArrayRightRef = useRef<THREE.Group>(null);
  const antennaRef = useRef<THREE.Group>(null);
  const radarDishRef = useRef<THREE.Group>(null);
  const radarSweepRef = useRef<THREE.Mesh>(null);
  const engineGlowRef = useRef<THREE.Mesh>(null);
  const scannerRef = useRef<THREE.Mesh>(null);
  const reactionWheelRef = useRef<THREE.Group>(null);
  
  // Light refs for blinking
  const redLightRef = useRef<THREE.PointLight>(null);
  const greenLightRef = useRef<THREE.PointLight>(null);
  const whiteLightRef = useRef<THREE.PointLight>(null);

  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  // Generate random greebles
  const greebles = useMemo(() => {
    return Array.from({ length: 50 }).map(() => ({
      position: [
        (Math.random() - 0.5) * 1.1,
        (Math.random() - 0.5) * 1.8,
        (Math.random() - 0.5) * 1.1,
      ] as [number, number, number],
      scale: [
        Math.random() * 0.15 + 0.05,
        Math.random() * 0.15 + 0.05,
        Math.random() * 0.15 + 0.05,
      ] as [number, number, number],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      ] as [number, number, number],
      isCylinder: Math.random() > 0.5
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      // Complex orbital rotation and bobbing
      groupRef.current.rotation.y = t * 0.08;
      groupRef.current.rotation.z = Math.sin(t * 0.2) * 0.05;
      groupRef.current.rotation.x = Math.cos(t * 0.15) * 0.05;
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.15;
    }
    
    // Solar panels sun tracking (complex unfolding/tracking)
    if (solarArrayLeftRef.current && solarArrayRightRef.current) {
      const targetRotation = Math.sin(t * 0.2) * 0.3;
      solarArrayLeftRef.current.rotation.x = THREE.MathUtils.lerp(solarArrayLeftRef.current.rotation.x, targetRotation, 0.05);
      solarArrayRightRef.current.rotation.x = THREE.MathUtils.lerp(solarArrayRightRef.current.rotation.x, targetRotation, 0.05);
      
      // Add slight vibration to panels
      solarArrayLeftRef.current.rotation.z = Math.sin(t * 10) * 0.002;
      solarArrayRightRef.current.rotation.z = Math.cos(t * 11) * 0.002;
    }
    
    // Antenna tracking
    if (antennaRef.current) {
      antennaRef.current.rotation.z = Math.sin(t * 0.5) * 0.5;
      antennaRef.current.rotation.x = Math.cos(t * 0.3) * 0.4;
    }

    // Radar dish spinning
    if (radarDishRef.current) {
      radarDishRef.current.rotation.y = t * 2;
      radarDishRef.current.rotation.z = Math.sin(t * 0.5) * 0.2;
    }

    // Radar sweeping effect
    if (radarSweepRef.current) {
      // Sweep back and forth across the 0.7 width (from -0.35 to 0.35)
      radarSweepRef.current.position.x = Math.sin(t * 4) * 0.35;
      const sweepMat = radarSweepRef.current.material as THREE.MeshBasicMaterial;
      if (sweepMat) sweepMat.opacity = 0.4 + Math.sin(t * 15) * 0.4;
    }

    // Reaction wheels spinning fast
    if (reactionWheelRef.current) {
      reactionWheelRef.current.rotation.y = t * 10;
      reactionWheelRef.current.rotation.x = t * 5;
    }

    // Scanner sweeping
    if (scannerRef.current) {
      scannerRef.current.rotation.x = Math.sin(t * 2) * 0.5;
      const scannerMat = scannerRef.current.material as THREE.MeshStandardMaterial;
      if (scannerMat) scannerMat.emissiveIntensity = 2 + Math.sin(t * 10) * 1;
    }

    // Engine glow pulsing (Ion Thruster)
    if (engineGlowRef.current) {
      const material = engineGlowRef.current.material as THREE.MeshBasicMaterial;
      if (material) material.opacity = 0.6 + Math.sin(t * 15) * 0.3;
      const scale = 1 + Math.sin(t * 30) * 0.1;
      engineGlowRef.current.scale.set(scale, scale * 1.2, scale);
    }

    // Blinking lights
    if (redLightRef.current) redLightRef.current.intensity = Math.sin(t * 5) > 0 ? 2 : 0;
    if (greenLightRef.current) greenLightRef.current.intensity = Math.sin(t * 5 + Math.PI) > 0 ? 2 : 0;
    if (whiteLightRef.current) whiteLightRef.current.intensity = Math.sin(t * 2) > 0.8 ? 5 : 0;
  });

  const handlePointerOver = (part: string) => (e: any) => {
    e.stopPropagation();
    setHoveredPart(part);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHoveredPart(null);
    document.body.style.cursor = 'auto';
  };

  // Ultra-realistic Materials
  const busMaterial = new THREE.MeshPhysicalMaterial({ 
    color: '#cbd5e1', metalness: 0.9, roughness: 0.2, clearcoat: 0.5, clearcoatRoughness: 0.1 
  });
  const goldFoilMaterial = new THREE.MeshPhysicalMaterial({ 
    color: '#fbbf24', metalness: 0.7, roughness: 0.3, bumpScale: 0.05, clearcoat: 0.2, emissive: '#452000', emissiveIntensity: 0.2
  });
  const carbonFiberMaterial = new THREE.MeshPhysicalMaterial({ 
    color: '#1e293b', metalness: 0.8, roughness: 0.6, clearcoat: 0.8, clearcoatRoughness: 0.2
  });
  const solarCellMaterial = new THREE.MeshPhysicalMaterial({ 
    color: '#020617', metalness: 1, roughness: 0.05, iridescence: 1, iridescenceIOR: 1.5, clearcoat: 1
  });
  const silverMaterial = new THREE.MeshPhysicalMaterial({ 
    color: '#f8fafc', metalness: 1, roughness: 0.1, clearcoat: 1
  });
  const darkSensorMaterial = new THREE.MeshPhysicalMaterial({ 
    color: '#000000', metalness: 0.9, roughness: 0.1, clearcoat: 1
  });
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: '#38bdf8', transmission: 0.95, opacity: 1, metalness: 0.1, roughness: 0, ior: 1.5, thickness: 0.5, clearcoat: 1
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef} scale={1.2}>
        
        {/* --- MAIN BUS --- */}
        <group onPointerOver={handlePointerOver('Main Bus')} onPointerOut={handlePointerOut}>
          {/* Central Hexagonal Prism */}
          <mesh material={busMaterial}>
            <cylinderGeometry args={[0.7, 0.7, 2.2, 6]} />
          </mesh>
          
          {/* Gold Foil Wraps (Top, Middle, Bottom) */}
          <mesh position={[0, 0.9, 0]} material={goldFoilMaterial}>
            <cylinderGeometry args={[0.72, 0.72, 0.3, 6]} />
          </mesh>
          <mesh position={[0, 0, 0]} material={goldFoilMaterial}>
            <cylinderGeometry args={[0.72, 0.72, 0.4, 6]} />
          </mesh>
          <mesh position={[0, -0.9, 0]} material={goldFoilMaterial}>
            <cylinderGeometry args={[0.72, 0.72, 0.3, 6]} />
          </mesh>

          {/* Greebles (Surface Details) */}
          {greebles.map((g, i) => (
            <mesh 
              key={i} 
              position={g.position} 
              scale={g.scale} 
              rotation={g.rotation}
              material={i % 3 === 0 ? silverMaterial : (i % 2 === 0 ? carbonFiberMaterial : busMaterial)}
            >
              {g.isCylinder ? <cylinderGeometry args={[0.5, 0.5, 1, 8]} /> : <boxGeometry args={[1, 1, 1]} />}
            </mesh>
          ))}

          {/* Reaction Wheels */}
          <group ref={reactionWheelRef} position={[0, 0, 0]}>
            <mesh position={[0.8, 0, 0]} rotation={[0, 0, Math.PI/2]} material={silverMaterial}>
              <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
            </mesh>
            <mesh position={[-0.8, 0, 0]} rotation={[0, 0, Math.PI/2]} material={silverMaterial}>
              <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
            </mesh>
            <mesh position={[0, 0, 0.8]} rotation={[Math.PI/2, 0, 0]} material={silverMaterial}>
              <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
            </mesh>
          </group>
        </group>

        {/* --- PAYLOAD MODULE (Front) --- */}
        <group position={[0, 1.3, 0]} onPointerOver={handlePointerOver('Optical Payload')} onPointerOut={handlePointerOut}>
          {/* Base Mount */}
          <mesh material={carbonFiberMaterial}>
            <cylinderGeometry args={[0.5, 0.6, 0.4, 8]} />
          </mesh>
          
          {/* Main Telescope Tube */}
          <mesh position={[0, 0.6, 0]} material={silverMaterial}>
            <cylinderGeometry args={[0.35, 0.35, 1, 32]} />
          </mesh>
          
          {/* Sun Shield / Baffle */}
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.4, 0.35, 0.4, 32, 1, true]} />
            <meshPhysicalMaterial color="#111" side={THREE.DoubleSide} metalness={0.5} roughness={0.8} />
          </mesh>

          {/* Lens */}
          <mesh position={[0, 1.0, 0]} material={glassMaterial}>
            <cylinderGeometry args={[0.33, 0.33, 0.05, 32]} />
          </mesh>
          
          {/* Secondary Sensor */}
          <mesh position={[0.4, 0.4, 0]} rotation={[0, 0, -Math.PI/6]} material={busMaterial}>
            <boxGeometry args={[0.2, 0.4, 0.2]} />
          </mesh>
          <mesh position={[0.48, 0.6, 0]} rotation={[0, 0, -Math.PI/6]} material={glassMaterial}>
            <sphereGeometry args={[0.08, 16, 16]} />
          </mesh>
        </group>

        {/* --- SOLAR ARRAYS --- */}
        {/* Left Array */}
        <group ref={solarArrayLeftRef} position={[-0.8, 0, 0]} onPointerOver={handlePointerOver('Solar Array')} onPointerOut={handlePointerOut}>
          {/* Main Boom */}
          <mesh position={[-1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={carbonFiberMaterial}>
            <cylinderGeometry args={[0.05, 0.05, 3]} />
          </mesh>
          {/* Panels (4 segments) */}
          {[-1.0, -2.1, -3.2, -4.3].map((x, i) => (
            <group key={i} position={[x, 0, 0]}>
              {/* Panel Frame */}
              <mesh material={carbonFiberMaterial}>
                <boxGeometry args={[1, 0.06, 2]} />
              </mesh>
              {/* Solar Cells Top */}
              <mesh position={[0, 0.035, 0]} material={solarCellMaterial}>
                <boxGeometry args={[0.95, 0.01, 1.95]} />
              </mesh>
              {/* Solar Cells Bottom */}
              <mesh position={[0, -0.035, 0]} material={solarCellMaterial}>
                <boxGeometry args={[0.95, 0.01, 1.95]} />
              </mesh>
              {/* Grid Lines */}
              <mesh position={[0, 0.045, 0]} rotation={[-Math.PI/2, 0, 0]}>
                <planeGeometry args={[0.95, 1.95]} />
                <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.15} />
              </mesh>
            </group>
          ))}
        </group>

        {/* Right Array */}
        <group ref={solarArrayRightRef} position={[0.8, 0, 0]} onPointerOver={handlePointerOver('Solar Array')} onPointerOut={handlePointerOut}>
          {/* Main Boom */}
          <mesh position={[1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={carbonFiberMaterial}>
            <cylinderGeometry args={[0.05, 0.05, 3]} />
          </mesh>
          {/* Panels (4 segments) */}
          {[1.0, 2.1, 3.2, 4.3].map((x, i) => (
            <group key={i} position={[x, 0, 0]}>
              {/* Panel Frame */}
              <mesh material={carbonFiberMaterial}>
                <boxGeometry args={[1, 0.06, 2]} />
              </mesh>
              {/* Solar Cells Top */}
              <mesh position={[0, 0.035, 0]} material={solarCellMaterial}>
                <boxGeometry args={[0.95, 0.01, 1.95]} />
              </mesh>
              {/* Solar Cells Bottom */}
              <mesh position={[0, -0.035, 0]} material={solarCellMaterial}>
                <boxGeometry args={[0.95, 0.01, 1.95]} />
              </mesh>
              {/* Grid Lines */}
              <mesh position={[0, 0.045, 0]} rotation={[-Math.PI/2, 0, 0]}>
                <planeGeometry args={[0.95, 1.95]} />
                <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.15} />
              </mesh>
            </group>
          ))}
        </group>

        {/* --- ANTENNAS & SENSORS --- */}
        {/* High-Gain Dish Antenna */}
        <group ref={antennaRef} position={[0.5, 0.8, 0.6]} rotation={[Math.PI / 4, Math.PI / 4, 0]} onPointerOver={handlePointerOver('High-Gain Antenna')} onPointerOut={handlePointerOut}>
          <mesh position={[0, -0.4, 0]} material={silverMaterial}>
            <cylinderGeometry args={[0.04, 0.04, 0.8]} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
            <meshPhysicalMaterial color="#f8fafc" metalness={0.8} roughness={0.4} side={THREE.DoubleSide} />
          </mesh>
          {/* Feed Horn */}
          <mesh position={[0, 0.25, 0]} material={carbonFiberMaterial}>
            <cylinderGeometry args={[0.02, 0.01, 0.5]} />
          </mesh>
          <mesh position={[0, 0.5, 0]} material={goldFoilMaterial}>
            <cylinderGeometry args={[0.05, 0.08, 0.1]} />
          </mesh>
          {/* Support Struts */}
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[Math.cos(i * Math.PI * 2 / 3) * 0.2, 0.25, Math.sin(i * Math.PI * 2 / 3) * 0.2]} rotation={[0, -i * Math.PI * 2 / 3, Math.PI/6]} material={silverMaterial}>
              <cylinderGeometry args={[0.005, 0.005, 0.6]} />
            </mesh>
          ))}
        </group>

        {/* Spinning Radar Dish */}
        <group ref={radarDishRef} position={[-0.6, -0.5, 0.6]} rotation={[Math.PI/2, 0, 0]} onPointerOver={handlePointerOver('SAR Radar')} onPointerOut={handlePointerOut}>
          <mesh material={carbonFiberMaterial}>
            <boxGeometry args={[0.8, 0.1, 0.4]} />
          </mesh>
          <mesh position={[0, 0.051, 0]} rotation={[-Math.PI/2, 0, 0]}>
            <planeGeometry args={[0.7, 0.3]} />
            <meshStandardMaterial color="#94a3b8" metalness={1} roughness={0.2} wireframe />
          </mesh>
          {/* Sweeping Scanner Line */}
          <mesh ref={radarSweepRef} position={[0, 0.052, 0]} rotation={[-Math.PI/2, 0, 0]}>
            <planeGeometry args={[0.02, 0.3]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
        </group>

        {/* Sweeping Scanner */}
        <group position={[0, -0.5, -0.7]} onPointerOver={handlePointerOver('LIDAR Scanner')} onPointerOut={handlePointerOut}>
          <mesh material={silverMaterial}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
          </mesh>
          <mesh ref={scannerRef} position={[0, 0, -0.15]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.1]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} />
          </mesh>
        </group>

        {/* --- MAIN ENGINE (Rear) --- */}
        <group position={[0, -1.2, 0]} onPointerOver={handlePointerOver('Ion Thruster')} onPointerOut={handlePointerOut}>
          {/* Engine Mount */}
          <mesh material={carbonFiberMaterial}>
            <cylinderGeometry args={[0.5, 0.4, 0.4, 16]} />
          </mesh>
          
          {/* Engine Bell */}
          <mesh position={[0, -0.3, 0]} material={darkSensorMaterial}>
            <cylinderGeometry args={[0.4, 0.15, 0.5, 32]} />
          </mesh>
          
          {/* Ion Grid */}
          <mesh position={[0, -0.55, 0]}>
            <cylinderGeometry args={[0.38, 0.38, 0.02, 32]} />
            <meshStandardMaterial color="#cbd5e1" wireframe />
          </mesh>
          
          {/* Engine Glow/Exhaust (Ion Blue) */}
          <mesh ref={engineGlowRef} position={[0, -1.0, 0]}>
            <cylinderGeometry args={[0.35, 0.1, 1.2, 32]} />
            <meshBasicMaterial color="#0ea5e9" transparent opacity={0.8} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          <mesh position={[0, -0.8, 0]}>
            <cylinderGeometry args={[0.2, 0.05, 0.8, 32]} />
            <meshBasicMaterial color="#e0f2fe" transparent opacity={0.9} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>

          {/* Exhaust Particles */}
          <Sparkles position={[0, -1.5, 0]} count={100} scale={[0.6, 2, 0.6]} size={4} speed={2} opacity={0.8} color="#38bdf8" />
        </group>

        {/* --- NAVIGATION LIGHTS --- */}
        <pointLight ref={redLightRef} position={[-4.5, 0, 1]} color="#ef4444" distance={5} intensity={0} />
        <mesh position={[-4.5, 0, 1]}>
          <sphereGeometry args={[0.05]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>

        <pointLight ref={greenLightRef} position={[4.5, 0, 1]} color="#22c55e" distance={5} intensity={0} />
        <mesh position={[4.5, 0, 1]}>
          <sphereGeometry args={[0.05]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>

        <pointLight ref={whiteLightRef} position={[0, 2, 0]} color="#ffffff" distance={5} intensity={0} />
        <mesh position={[0, 2, 0]}>
          <sphereGeometry args={[0.05]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* Tooltip */}
        {hoveredPart && (
          <Html position={[0, 2.5, 0]} center>
            <div className="bg-slate-900/90 text-slate-100 px-4 py-2 rounded-lg text-sm font-mono whitespace-nowrap border border-slate-700 backdrop-blur-md shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                {hoveredPart}
              </div>
            </div>
          </Html>
        )}
      </group>
    </Float>
  );
}

