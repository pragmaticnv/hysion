import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Sphere, MeshDistortMaterial, Html } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import { Hand, Camera, Info, Sparkles, Zap, Globe, Sun, CircleDot, MoveRight } from 'lucide-react';
import * as THREE from 'three';
import { GlobeModel } from '../models/GlobeModel';
import { SatelliteModel } from '../models/SatelliteModel';
import { GestureHandler } from './GestureHandler';
import { GestureOverlay } from './GestureOverlay';

const OBJECT_TYPES = {
  earth: { name: 'Earth', massScale: 1, color: '#4f46e5', description: 'Planetary mass element used to evaluate local Schwarzschild metric distortions.', icon: Globe },
  star: { name: 'Neutron Star', massScale: 8, color: '#ffffff', description: 'Extremely dense stellar remnant; demonstrates high-gravity time dilation and lensing.', icon: Sun },
  blackhole: { name: 'Black Hole', massScale: 25, color: '#000000', description: 'Region of spacetime exhibiting gravitational acceleration so strong that nothing can escape.', icon: CircleDot }
};

function Hoverable({ name, description, children }: { name: string, description: string, children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <group 
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }} 
      onPointerOut={() => setHovered(false)}
    >
      {children}
      {hovered && (
        <Html center position={[0, 0, 0]}>
          <div className="bg-zinc-900/95 border border-white/10 text-white p-3 rounded-xl text-[10px] pointer-events-none whitespace-normal w-48 shadow-2xl z-50 backdrop-blur-md">
             <div className="flex flex-col gap-1">
               <strong className="text-cyan-400 uppercase tracking-widest text-[8px] mb-1">Theoretical Analysis</strong>
               <span className="font-bold text-white text-xs">{name}</span>
               <p className="text-zinc-400 leading-relaxed font-medium">{description}</p>
             </div>
          </div>
        </Html>
      )}
    </group>
  );
}

const RELATIVITY_DETAILS: Record<string, string> = {
  "Stationary Frame: v = 0": "Observer at rest relative to the events. Measures proper time and length.",
  "Rocket Frame: v = 0.5c (Relative)": "Moving reference frame experiencing kinematic time dilation and length contraction according to the stationary observer.",
  "Light Path Deflection (Lensing)": "The bending of null geodesics by massive objects as predicted by General Relativity's field equations.",
  "Lorentz Factor: γ = ": "The factor by which time, length, and relativistic mass change for an object while that object is moving.",
  "Photon Velocity: c = 299,792,458 m/s": "The universal speed limit; constant in all inertial frames regardless of the motion of the source or observer.",
  "Curvature Metric: Gμν = 8πTμν": "The Einstein Field Equation relating the geometry of spacetime to the distribution of matter and energy within it.",
  "Simultaneity Check": "An analysis of whether events that look simultaneous in one frame are simultaneous in another.",
  "Relativity of Simultaneity": "The concept that distance and time are not absolute but depend on the observer's frame of reference.",
  "T1: EARLIER": "The first event detection in the sequence, affected by the frame's relative velocity.",
  "T2: LATER": "The subsequent event detection, illustrating the loss of simultaneity in motion.",
  "T1 = T2: SIMULTANEOUS": "Events occurring at the same time coordinate within the current inertial frame."
};

function SmartHtml({ children, name, description, ...props }: any) {
  // Extract text content recursively if needed, but usually it's simple strings here
  const findText = (node: any): string => {
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(findText).join('');
    if (node?.props?.children) return findText(node.props.children);
    return '';
  };
  
  const textContent = findText(children);
  const labelName = name || textContent.split(':').shift() || "Relativity Metric";
  const labelDesc = description || RELATIVITY_DETAILS[textContent] || RELATIVITY_DETAILS[Object.keys(RELATIVITY_DETAILS).find(k => textContent.includes(k)) || ""] || "Detailed metric or theoretical identifier for the relativity simulation.";

  return (
    <Html {...props}>
      <Hoverable name={labelName} description={labelDesc}>
        {children}
      </Hoverable>
    </Html>
  );
}

const InertialFramesSimulation = ({ velocity }: { velocity: number }) => {
  const rocketRef = useRef<THREE.Group>(null);
  const [cycle, setCycle] = useState(0);
  const rocketLength = 12;
  const c = 1.0; // Speed of light in simulation units
  
  useFrame((state) => {
    // 4 second cycle for the experiment
    const t = (state.clock.getElapsedTime() % 4);
    setCycle(t);
  });

  // Stationary Frame Calculations
  // Rocket center starts at -10 at t=0
  const startX = -10;
  const rocketX = startX + velocity * cycle * 5; // scaled motion
  
  // Light pulses emitted from center at t=0
  const pulseForwardX = startX + c * cycle * 5;
  const pulseBackwardX = startX - c * cycle * 5;

  // Rocket ends in stationary frame
  const frontX = rocketX + rocketLength / 2;
  const backX = rocketX - rocketLength / 2;

  // Check for collisions in stationary frame
  const hitBackStationary = pulseBackwardX <= backX;
  const hitFrontStationary = pulseForwardX >= frontX;

  // Rocket Frame Calculations (Static Rocket)
  const pulseRocketX = c * cycle * 5;
  const hitBothRocket = pulseRocketX >= rocketLength / 2;

  return (
    <group position={[0, 0, 0]}>
      {/* Perspective 1: Stationary Observer */}
      <group position={[0, 4, 0]}>
        <SmartHtml position={[-18, 2, 0]} center>
          <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded text-[8px] text-blue-400 font-bold uppercase tracking-widest whitespace-nowrap">
            Stationary Frame: v = 0
          </div>
        </SmartHtml>
        
        {/* Rocket in motion */}
        <group position={[rocketX, 0, 0]}>
          <mesh>
            <boxGeometry args={[rocketLength, 1.5, 1.5]} />
            <meshStandardMaterial color="#06b6d4" transparent opacity={0.1} wireframe />
          </mesh>
          {/* Detectors */}
          <mesh position={[rocketLength/2, 0, 0]}>
            <sphereGeometry args={[0.3]} />
            <meshStandardMaterial color={hitFrontStationary ? "#22c55e" : "#ef4444"} emissive={hitFrontStationary ? "#22c55e" : "#000"} emissiveIntensity={2} />
          </mesh>
          <mesh position={[-rocketLength/2, 0, 0]}>
            <sphereGeometry args={[0.3]} />
            <meshStandardMaterial color={hitBackStationary ? "#22c55e" : "#ef4444"} emissive={hitBackStationary ? "#22c55e" : "#000"} emissiveIntensity={2} />
          </mesh>
        </group>

        {/* Light Pulses in Stationary Frame */}
        <mesh position={[pulseForwardX, 0, 0]}>
          <sphereGeometry args={[0.15]} />
          <meshBasicMaterial color="white" />
        </mesh>
        <mesh position={[pulseBackwardX, 0, 0]}>
          <sphereGeometry args={[0.15]} />
          <meshBasicMaterial color="white" />
        </mesh>

        {/* Timing Analysis */}
        <SmartHtml position={[rocketX, -2.5, 0]} center>
          <div className="flex gap-4 bg-black/80 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-2xl min-w-[200px]">
            <div className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[6px] text-zinc-500 uppercase font-bold">Back Event</span>
              <div className={`text-[9px] font-mono font-bold ${hitBackStationary ? 'text-green-400' : 'text-zinc-600'}`}>
                {hitBackStationary ? 'T1: EARLIER' : 'IN FLIGHT...'}
              </div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[6px] text-zinc-500 uppercase font-bold">Front Event</span>
              <div className={`text-[9px] font-mono font-bold ${hitFrontStationary ? 'text-red-400' : 'text-zinc-600'}`}>
                {hitFrontStationary ? 'T2: LATER' : 'IN FLIGHT...'}
              </div>
            </div>
          </div>
        </SmartHtml>
      </group>

      {/* Perspective 2: Rocket Observer */}
      <group position={[0, -4, 0]}>
        <SmartHtml position={[-18, 2, 0]} center>
          <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded text-[8px] text-cyan-400 font-bold uppercase tracking-widest whitespace-nowrap">
            Rocket Frame: v = 0.5c (Relative)
          </div>
        </SmartHtml>

        {/* Static Rocket */}
        <group position={[0, 0, 0]}>
          <mesh>
            <boxGeometry args={[rocketLength, 1.5, 1.5]} />
            <meshStandardMaterial color="#06b6d4" transparent opacity={0.1} wireframe />
          </mesh>
          {/* Detectors */}
          <mesh position={[rocketLength/2, 0, 0]}>
            <sphereGeometry args={[0.3]} />
            <meshStandardMaterial color={hitBothRocket ? "#22c55e" : "#ef4444"} emissive={hitBothRocket ? "#22c55e" : "#000"} emissiveIntensity={2} />
          </mesh>
          <mesh position={[-rocketLength/2, 0, 0]}>
            <sphereGeometry args={[0.3]} />
            <meshStandardMaterial color={hitBothRocket ? "#22c55e" : "#ef4444"} emissive={hitBothRocket ? "#22c55e" : "#000"} emissiveIntensity={2} />
          </mesh>
        </group>

        {/* Light Pulses in Rocket Frame */}
        <mesh position={[pulseRocketX, 0, 0]}>
          <sphereGeometry args={[0.15]} />
          <meshBasicMaterial color="white" />
        </mesh>
        <mesh position={[-pulseRocketX, 0, 0]}>
          <sphereGeometry args={[0.15]} />
          <meshBasicMaterial color="white" />
        </mesh>

        {/* Timing Analysis */}
        <SmartHtml position={[0, -2.5, 0]} center>
          <div className="flex flex-col items-center gap-2 bg-black/80 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-2xl min-w-[200px]">
            <span className="text-[6px] text-zinc-500 uppercase font-bold">Simultaneity Check</span>
            <div className={`text-[10px] font-mono font-bold ${hitBothRocket ? 'text-green-400' : 'text-zinc-600'}`}>
              {hitBothRocket ? 'T1 = T2: SIMULTANEOUS' : 'IN FLIGHT...'}
            </div>
          </div>
        </SmartHtml>
      </group>

      {/* Central Divider */}
      <Line 
        points={[new THREE.Vector3(-25, 0, 0), new THREE.Vector3(25, 0, 0)]}
        color="white"
        lineWidth={1}
        transparent
        opacity={0.05}
      />
      
      <SmartHtml position={[0, 0, 0]} center>
        <div className="px-4 py-2 bg-zinc-900/90 border border-white/10 rounded-2xl shadow-2xl flex flex-col items-center gap-1 max-w-[300px]">
          <span className="text-[7px] text-cyan-500 font-bold uppercase tracking-widest">Relativity of Simultaneity</span>
          <p className="text-[8px] text-zinc-400 text-center italic leading-relaxed">
            "Observers in different frames do not agree on the timing of events."
          </p>
        </div>
      </SmartHtml>
    </group>
  );
};

const GravitationalLensing = ({ mass, objectScale, velocity = 0 }: { mass: number, objectScale: number, velocity?: number }) => {
  const lineRef = useRef<THREE.Group>(null);
  
  const points = useMemo(() => {
    const gamma = 1 / Math.sqrt(1 - velocity * velocity);
    const relativisticMass = mass * objectScale * gamma;

    const p = [];
    const segments = 100;
    const startX = -30;
    const endX = 30;
    const y = 5; // Offset from center
    
    for (let i = 0; i <= segments; i++) {
      const x = startX + (endX - startX) * (i / segments);
      const dist = Math.sqrt(x * x + y * y);
      // Bending formula: deflection angle alpha = 4GM / rc^2
      // We simulate this by offsetting the Y based on distance to center
      const deflection = (relativisticMass * 2) / (dist + 2);
      p.push(new THREE.Vector3(x, y - deflection, 0));
    }
    return p;
  }, [mass, objectScale, velocity]);

  return (
    <group>
      <Line 
        points={points} 
        color="#fbbf24" 
        lineWidth={2} 
        transparent 
        opacity={0.6} 
      />
      <SmartHtml position={[-15, 6, 0]} center className="pointer-events-none">
        <div className="px-2 py-1 bg-amber-500/10 border border-amber-500/30 rounded text-[7px] text-amber-400 font-bold uppercase tracking-widest whitespace-nowrap">
          Light Path Deflection (Lensing)
        </div>
      </SmartHtml>
    </group>
  );
};

const SpacetimeWarping = ({ mass, objectScale, velocity = 0 }: { mass: number, objectScale: number, velocity?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const gridSize = 60;
  const segments = 120;

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(gridSize, gridSize, segments, segments);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;
    const position = meshRef.current.geometry.attributes.position;
    const count = position.count;
    
    const gamma = 1 / Math.sqrt(1 - velocity * velocity);
    const relativisticMass = mass * objectScale * gamma;

    for (let i = 0; i < count; i++) {
      const x = position.getX(i);
      const z = position.getZ(i);
      const dist = Math.sqrt(x * x + z * z);
      
      // Deep funnel warping formula: -A / (dist + B)^C
      const warp = -relativisticMass * 15 / (dist * 0.8 + 1.5);
      position.setY(i, warp);
    }
    position.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, -0.5, 0]}>
      <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.3} />
    </mesh>
  );
};

const SatelliteWithSignal = ({ mass, objectScale, velocity = 0 }: { mass: number, objectScale: number, velocity?: number }) => {
  const satelliteRef = useRef<THREE.Group>(null);
  const signalRef = useRef<THREE.Group>(null);
  
  const gamma = 1 / Math.sqrt(1 - velocity * velocity);
  const relativisticMass = mass * objectScale * gamma;

  // Orbital parameters to match the image's static-looking but dynamic scene
  useFrame((state) => {
    if (!satelliteRef.current) return;
    const t = state.clock.getElapsedTime() * 0.2;
    
    // Position satellite in a stable orbit
    const radius = 12;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius;
    const r = Math.sqrt(x * x + z * z);
    const warp = -relativisticMass * 15 / (r * 0.8 + 1.5);
    
    satelliteRef.current.position.set(x, warp + 2, z);
    satelliteRef.current.lookAt(0, warp, 0);
    satelliteRef.current.rotateY(Math.PI / 2);

    if (signalRef.current) {
      // Signal points to a distant "star"
      signalRef.current.lookAt(20, 15, -20);
    }
  });

  return (
    <group ref={satelliteRef}>
      <SatelliteModel />
      
      {/* Lorentz Factor Label */}
      <SmartHtml position={[0, 1.5, 0]} center className="pointer-events-none">
        <div className="px-2 py-1 bg-black/60 backdrop-blur-md border border-cyan-500/20 rounded-lg flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-[7px] font-bold text-cyan-400 uppercase tracking-widest">Lorentz Factor: γ = {gamma.toFixed(4)}</span>
        </div>
      </SmartHtml>

      {/* Signal Ray */}
      <group ref={signalRef}>
        <Line 
          points={[new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 50)]} 
          color="white" 
          lineWidth={1} 
          transparent 
          opacity={0.8} 
        />
        <SmartHtml position={[0, 0, 25]} center className="pointer-events-none">
          <div className="px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg">
            <span className="text-[7px] font-bold text-white/50 uppercase tracking-widest">Photon Velocity: c = 299,792,458 m/s</span>
          </div>
        </SmartHtml>
        {/* Distant Star point */}
        <mesh position={[0, 0, 50]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshBasicMaterial color="#4f46e5" />
          <pointLight intensity={2} distance={10} color="#4f46e5" />
        </mesh>
      </group>
    </group>
  );
};

const Clock = ({ position, mass, objectScale, velocity = 0, distance }: { position: [number, number, number], mass: number, objectScale: number, velocity?: number, distance: number }) => {
  const handRef = useRef<THREE.Group>(null);
  
  const gamma = 1 / Math.sqrt(1 - velocity * velocity);
  const relativisticMass = mass * objectScale * gamma;

  // Gravitational time dilation factor: sqrt(1 - 2GM/rc^2) multiplied by kinematic time dilation 1/gamma
  const timeDilationFactor = Math.sqrt(Math.max(0, 1 - (relativisticMass * 0.5) / (distance + 1))) / gamma;

  useFrame((state) => {
    if (!handRef.current) return;
    handRef.current.rotation.z = -state.clock.elapsedTime * timeDilationFactor * 2;
  });

  return (
    <group position={position}>
      <mesh>
        <circleGeometry args={[0.5, 32]} />
        <meshBasicMaterial color="white" />
      </mesh>
      <group ref={handRef}>
        <mesh position={[0, 0.25, 0.01]}>
          <planeGeometry args={[0.05, 0.5]} />
          <meshBasicMaterial color="black" />
        </mesh>
      </group>
    </group>
  );
};

const TimeDilationClocks = ({ mass, objectScale, velocity = 0 }: { mass: number, objectScale: number, velocity?: number }) => {
  return (
    <group>
      {/* Clock near the Earth */}
      <Clock position={[0, 3, 0]} mass={mass} objectScale={objectScale} velocity={velocity} distance={0} />
      {/* Clock far away */}
      <Clock position={[10, 3, 10]} mass={mass} objectScale={objectScale} velocity={velocity} distance={14} />
    </group>
  );
};

import { useStore } from '../store/useStore';
import { Line, Trail } from './SafeLine';

export const RelativityVisualization = () => {
  const { isGestureActive, setIsGestureActive } = useStore();
  const [mass, setMass] = useState(2.5);
  const [velocity, setVelocity] = useState(0); // 0 to 0.99 c
  const [objectType, setObjectType] = useState<keyof typeof OBJECT_TYPES>('earth');
  const [showClocks, setShowClocks] = useState(false);
  const [showWarping, setShowWarping] = useState(true);
  const [showLensing, setShowLensing] = useState(true);
  const [showInertialFrames, setShowInertialFrames] = useState(false);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const handleVoiceCommand = (e: any) => {
      const { action, setting, value } = e.detail;
      if (action === 'RELATIVITY_CONTROL' && setting) {
        if (setting === 'objectType' && value) {
          const validTypes = ['earth', 'star', 'blackhole'];
          if (validTypes.includes(value.toLowerCase())) {
            setObjectType(value.toLowerCase() as keyof typeof OBJECT_TYPES);
          }
        } else if (setting === 'mass' && value) {
          const m = parseFloat(value);
          if (!isNaN(m)) setMass(Math.max(0.1, Math.min(5, m)));
        } else if (setting === 'velocity' && value) {
          const v = parseFloat(value);
          if (!isNaN(v)) setVelocity(Math.max(0, Math.min(0.99, v)));
        } else if (setting === 'showWarping') {
          setShowWarping(value === 'true');
        } else if (setting === 'showLensing') {
          setShowLensing(value === 'true');
        } else if (setting === 'showClocks') {
          setShowClocks(value === 'true');
        } else if (setting === 'showInertialFrames') {
          setShowInertialFrames(value === 'true');
        }
      }
    };

    window.addEventListener('app-voice-command', handleVoiceCommand);
    return () => window.removeEventListener('app-voice-command', handleVoiceCommand);
  }, []);

  const currentObject = OBJECT_TYPES[objectType];

  return (
    <div className="w-full h-full relative bg-black rounded-xl overflow-hidden border border-white/10">
      <Canvas 
        camera={{ position: [15, 15, 15], fov: 40 }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        gl={{ powerPreference: "high-performance", antialias: false, alpha: false }}
      >
        <Stars radius={150} depth={50} count={7000} factor={4} saturation={0} fade speed={0.5} />
        <ambientLight intensity={0.7} />
        <pointLight position={[20, 20, 20]} intensity={1.5} />
        
        {showInertialFrames ? (
          <InertialFramesSimulation velocity={Math.max(0.1, velocity)} />
        ) : (
          <>
            {showWarping ? (
              <>
                {/* Central Massive Object */}
                <group position={[0, -mass * currentObject.massScale * 15 / 1.5, 0]}>
                  {objectType === 'earth' && (
                    <group scale={1.2}>
                      <GlobeModel />
                    </group>
                  )}
                  {objectType === 'star' && (
                    <mesh scale={1.5}>
                      <sphereGeometry args={[1, 32, 32]} />
                      <meshStandardMaterial 
                        color="#ffffff" 
                        emissive="#ffffff" 
                        emissiveIntensity={2} 
                      />
                      <pointLight intensity={5} distance={20} color="#ffffff" />
                    </mesh>
                  )}
                  {objectType === 'blackhole' && (
                    <group>
                      {/* Event Horizon */}
                      <mesh scale={1.2}>
                        <sphereGeometry args={[1, 32, 32]} />
                        <meshBasicMaterial color="#000000" />
                      </mesh>
                      {/* Accretion Disk */}
                      <mesh rotation={[Math.PI / 2.2, 0, 0]}>
                        <ringGeometry args={[1.5, 4, 64]} />
                        <meshStandardMaterial 
                          color="#f59e0b" 
                          emissive="#f59e0b" 
                          emissiveIntensity={2} 
                          transparent 
                          opacity={0.7} 
                          side={THREE.DoubleSide}
                        />
                      </mesh>
                    </group>
                  )}
                  
                  <SmartHtml position={[0, 3, 0]} center className="pointer-events-none">
                    <div className="px-4 py-2 bg-black/80 backdrop-blur-md border border-cyan-500/30 rounded-xl text-[10px] text-cyan-400 font-mono uppercase tracking-widest shadow-lg flex flex-col items-center gap-1">
                      <span className="font-bold">{currentObject.name}</span>
                      <span className="text-[8px] opacity-70">{currentObject.description}</span>
                    </div>
                  </SmartHtml>
                </group>
                
                <SpacetimeWarping mass={mass} objectScale={currentObject.massScale} velocity={velocity} />
                <SatelliteWithSignal mass={mass} objectScale={currentObject.massScale} velocity={velocity} />
                {showLensing && <GravitationalLensing mass={mass} objectScale={currentObject.massScale} velocity={velocity} />}

                {/* Curvature Label */}
                <group position={[0, -mass * currentObject.massScale * (1 / Math.sqrt(1 - velocity*velocity)) * 8, 0]}>
                  <SmartHtml center className="pointer-events-none">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-px h-16 bg-gradient-to-t from-cyan-500 to-transparent opacity-50" />
                      <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md border border-cyan-500/20 rounded-lg flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-cyan-500 shadow-[0_0_5px_rgba(6,182,212,1)]" />
                        <span className="text-[8px] font-bold text-cyan-400 uppercase tracking-widest whitespace-nowrap">Curvature Metric: G<sub>μν</sub> = 8πT<sub>μν</sub></span>
                      </div>
                    </div>
                  </SmartHtml>
                </group>
              </>
            ) : (
              <>
                <group position={[0, 0, 0]} scale={1.5}>
                  <GlobeModel />
                </group>
                <group position={[-8, 2, -8]} scale={0.8}>
                  <SatelliteModel />
                </group>
              </>
            )}

            {showClocks && <TimeDilationClocks mass={mass} objectScale={currentObject.massScale} velocity={velocity} />}
          </>
        )}
        <OrbitControls 
          ref={controlsRef} 
          minDistance={5} 
          maxDistance={50}
          enableDamping={true}
          dampingFactor={0.05}
          zoomSpeed={1.0}
        />
        {isGestureActive && <GestureHandler controlsRef={controlsRef} />}
      </Canvas>
      
      {/* HUD Controls - Refined Microscope Style */}
      <div className="absolute top-6 left-6 flex flex-col gap-3">
        <button
          onClick={() => setIsGestureActive(!isGestureActive)}
          className={`p-3.5 rounded-2xl backdrop-blur-md border transition-all duration-300 shadow-xl ${
            isGestureActive 
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)]' 
              : 'bg-zinc-900/80 border-white/10 text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-white/20'
          }`}
          title={isGestureActive ? "Disable Gesture Control" : "Enable Gesture Control"}
        >
          {isGestureActive ? <Hand size={20} /> : <Camera size={20} />}
        </button>

        {/* Object Selector */}
        <div className="flex flex-col gap-2 p-2 bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl">
          {(Object.entries(OBJECT_TYPES) as [keyof typeof OBJECT_TYPES, typeof OBJECT_TYPES.earth][]).map(([key, obj]) => {
            const Icon = obj.icon;
            return (
              <button
                key={key}
                onClick={() => setObjectType(key)}
                className={`p-2.5 rounded-xl transition-all duration-300 flex items-center gap-3 group ${
                  objectType === key 
                    ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400' 
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                }`}
                title={obj.name}
              >
                <Icon size={18} />
                <span className={`text-[9px] font-bold uppercase tracking-widest pr-2 ${objectType === key ? 'block' : 'hidden group-hover:block'}`}>
                  {obj.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="absolute top-6 right-6 bg-zinc-900/90 backdrop-blur-md p-6 rounded-2xl border border-cyan-500/30 text-white w-56 shadow-2xl">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Simulation Parameters</h3>
        </div>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-[10px] mb-2">
              <span className="text-zinc-500 font-bold uppercase tracking-wider">Mass Intensity</span>
              <span className="text-cyan-400 font-mono bg-cyan-500/10 px-1.5 py-0.5 rounded leading-none">{(mass * currentObject.massScale).toFixed(2)}</span>
            </div>
            <input 
              type="range" 
              min="0.1" 
              max="5" 
              step="0.1" 
              value={mass} 
              onChange={(e) => setMass(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] mb-2">
              <span className="text-zinc-500 font-bold uppercase tracking-wider">Observer Velocity</span>
              <span className="text-blue-400 font-mono bg-blue-500/10 px-1.5 py-0.5 rounded leading-none">{velocity.toFixed(2)}c</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="0.99" 
              step="0.01" 
              value={velocity} 
              onChange={(e) => setVelocity(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
            />
          </div>

          <div className="space-y-3 pt-2 border-t border-white/5">
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300 transition-colors uppercase tracking-wider font-bold">Warping</span>
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  checked={showWarping} 
                  onChange={(e) => setShowWarping(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-9 h-5 rounded-full transition-all ${showWarping ? 'bg-cyan-500/30 border-cyan-500/50' : 'bg-white/5 border-white/10'} border`} />
                <div className={`absolute w-3 h-3 bg-white rounded-full transition-all shadow-sm ${showWarping ? 'translate-x-5 bg-cyan-400' : 'translate-x-1 bg-zinc-600'}`} />
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300 transition-colors uppercase tracking-wider font-bold">Time Dilation</span>
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  checked={showClocks} 
                  onChange={(e) => setShowClocks(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-9 h-5 rounded-full transition-all ${showClocks ? 'bg-cyan-500/30 border-cyan-500/50' : 'bg-white/5 border-white/10'} border`} />
                <div className={`absolute w-3 h-3 bg-white rounded-full transition-all shadow-sm ${showClocks ? 'translate-x-5 bg-cyan-400' : 'translate-x-1 bg-zinc-600'}`} />
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300 transition-colors uppercase tracking-wider font-bold">Lensing</span>
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  checked={showLensing} 
                  onChange={(e) => setShowLensing(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-9 h-5 rounded-full transition-all ${showLensing ? 'bg-amber-500/30 border-amber-500/50' : 'bg-white/5 border-white/10'} border`} />
                <div className={`absolute w-3 h-3 bg-white rounded-full transition-all shadow-sm ${showLensing ? 'translate-x-5 bg-amber-400' : 'translate-x-1 bg-zinc-600'}`} />
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300 transition-colors uppercase tracking-wider font-bold">Inertial Frames</span>
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  checked={showInertialFrames} 
                  onChange={(e) => setShowInertialFrames(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-9 h-5 rounded-full transition-all ${showInertialFrames ? 'bg-blue-500/30 border-blue-500/50' : 'bg-white/5 border-white/10'} border`} />
                <div className={`absolute w-3 h-3 bg-white rounded-full transition-all shadow-sm ${showInertialFrames ? 'translate-x-5 bg-blue-400' : 'translate-x-1 bg-zinc-600'}`} />
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Mass-Energy Analysis Panel - Bottom Right */}
      <div className="absolute bottom-20 right-6 w-64 p-5 bg-zinc-900/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col gap-3 z-10">
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-cyan-400" />
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-[0.2em]">Mass-Energy Analysis</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
        </div>

        <div className="flex flex-col items-center py-2">
          <div className="text-2xl font-bold text-white tracking-tighter font-mono">
            E = mc<sup className="text-xs">2</sup>
          </div>
          <div className="text-[8px] text-zinc-500 uppercase tracking-widest mt-1">Fundamental Equivalence</div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center px-2 py-1.5 bg-white/5 rounded-lg border border-white/5">
            <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Energy (E)</span>
            <span className="text-[10px] text-cyan-400 font-mono font-bold">{(mass * currentObject.massScale * (1 / Math.sqrt(1 - velocity*velocity)) * 8.987).toFixed(2)} × 10¹⁶ J</span>
          </div>
          <div className="flex justify-between items-center px-2 py-1.5 bg-white/5 rounded-lg border border-white/5">
            <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Relativistic Mass (m)</span>
            <span className="text-[10px] text-white font-mono font-bold">{(mass * currentObject.massScale * (1 / Math.sqrt(1 - velocity*velocity))).toFixed(2)} kg</span>
          </div>
          <div className="flex justify-between items-center px-2 py-1.5 bg-white/5 rounded-lg border border-white/5">
            <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Constant (c²)</span>
            <span className="text-[10px] text-zinc-500 font-mono">~8.987 × 10¹⁶ m²/s²</span>
          </div>
        </div>

        <div className="mt-1 p-2 bg-cyan-500/5 rounded-xl border border-cyan-500/10">
          <p className="text-[8px] text-zinc-400 leading-relaxed italic">
            "Energy and mass are different manifestations of the same thing."
          </p>
        </div>
      </div>

      {/* Info Overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none">
        <div className="bg-black/40 backdrop-blur-sm p-3 rounded-lg border border-white/5">
          <div className="text-[8px] text-cyan-500/50 uppercase tracking-[0.2em] mb-1">System Status</div>
          <div className="text-[10px] text-white/80 font-mono">
            {showWarping ? 'GRAVITATIONAL_WELL_ACTIVE' : 'FLAT_SPACETIME_SIM'}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-[8px] text-cyan-500/50 uppercase tracking-[0.2em] mb-1">Coordinates</div>
          <div className="text-[10px] text-white/80 font-mono">
            X: {(mass * currentObject.massScale).toFixed(2)} | Y: {(mass * currentObject.massScale * 0.5).toFixed(2)} | Z: 0.00
          </div>
        </div>
      </div>
    </div>
  );
};
