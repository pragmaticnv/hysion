import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Sparkles, MeshTransmissionMaterial, Float } from '@react-three/drei';;
import * as THREE from 'three';
import { Line, Trail } from '../components/SafeLine';

function ReactorLabel({ position, text, title, color = "#3b82f6", delay = 0, side = 'right' }: { position: [number, number, number], text: string, title: string, color?: string, delay?: number, side?: 'left' | 'right' | 'top' | 'bottom' }) {
  return (
    <Html position={position} center zIndexRange={[100, 0]}>
      <div className={`flex ${side === 'bottom' ? 'flex-col' : side === 'top' ? 'flex-col-reverse' : side === 'left' ? 'flex-row-reverse' : 'flex-row'} items-center animate-fade-in pointer-events-none`} style={{ animationDelay: `${delay}s` }}>
        <div className={`w-8 h-[1px] bg-gradient-to-r ${side === 'left' ? 'from-transparent to-current' : 'from-current to-transparent'}`} style={{ color: color, display: (side === 'left' || side === 'right') ? 'block' : 'none' }}></div>
        <div className={`w-[1px] h-8 bg-gradient-to-b ${side === 'top' ? 'from-transparent to-current' : 'from-current to-transparent'}`} style={{ color: color, display: (side === 'top' || side === 'bottom') ? 'block' : 'none' }}></div>
        
        <div className={`bg-black/80 text-[10px] p-2.5 rounded border backdrop-blur-md whitespace-nowrap font-mono uppercase tracking-widest shadow-[0_0_15px_rgba(0,0,0,0.5)]`} style={{ borderColor: `${color}40`, color: color, boxShadow: `0 0 10px ${color}20` }}>
          <div className="font-bold text-[11px] mb-1 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }}></div>
            {title}
          </div>
          <div className="text-zinc-300 text-[9px] max-w-[180px] whitespace-normal normal-case tracking-normal leading-relaxed">{text}</div>
        </div>
      </div>
    </Html>
  );
}

export function NuclearReactorModel({ showLabels = true }: { showLabels?: boolean }) {
  const controlRodsRef = useRef<THREE.Group>(null);
  const turbineRef = useRef<THREE.Group>(null);
  const steamParticlesRef = useRef<THREE.Group>(null);
  const primaryCoolantRef = useRef<THREE.Group>(null);
  const generatorRef = useRef<THREE.Group>(null);

  // Pipe paths
  const hotLegPath = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.2, 1.5, 0),
    new THREE.Vector3(0, 1.5, 0),
    new THREE.Vector3(1, 1, 0),
    new THREE.Vector3(2, 1, 0)
  ]), []);

  const coldLegPath = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(2, -1.5, 0),
    new THREE.Vector3(1, -1.5, 0),
    new THREE.Vector3(0, -2, 0),
    new THREE.Vector3(-1.2, -2, 0)
  ]), []);

  const steamLinePath = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(2, 3.5, 0),
    new THREE.Vector3(2, 4.5, 0),
    new THREE.Vector3(4, 4.5, 0),
    new THREE.Vector3(5, 2, 0),
    new THREE.Vector3(6, 2, 0)
  ]), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Control rods modulate slowly
    if (controlRodsRef.current) {
      controlRodsRef.current.position.y = Math.sin(t * 0.5) * 0.8 + 0.5;
    }

    // High-speed turbine spin
    if (turbineRef.current) {
      turbineRef.current.rotation.x = t * 15;
    }
    if (generatorRef.current) {
      generatorRef.current.rotation.x = t * 15;
    }

    // Steam particles rising
    if (steamParticlesRef.current) {
      steamParticlesRef.current.children.forEach((particle, i) => {
        particle.position.y += 0.02 + Math.sin(t + i) * 0.01;
        particle.position.x += Math.sin(t * 2 + i) * 0.005;
        if (particle.position.y > 3) {
          particle.position.y = -1;
          particle.position.x = (Math.random() - 0.5) * 1.5;
        }
        const mat = (particle as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = Math.max(0, 1 - (particle.position.y + 1) / 4) * 0.5;
      });
    }

    // Primary coolant flow particles
    if (primaryCoolantRef.current) {
      primaryCoolantRef.current.children.forEach((particle, i) => {
        // Simple loop around the hot/cold leg
        const speed = 0.5;
        const progress = ((t * speed) + (i / 40)) % 1;
        
        if (progress < 0.5) {
          // Hot leg (Reactor -> Steam Gen)
          const p = progress * 2;
          hotLegPath.getPointAt(p, particle.position);
          ((particle as THREE.Mesh).material as THREE.MeshBasicMaterial).color.setHex(0xef4444); // Red/Hot
        } else {
          // Cold leg (Steam Gen -> Reactor)
          const p = (progress - 0.5) * 2;
          coldLegPath.getPointAt(p, particle.position);
          ((particle as THREE.Mesh).material as THREE.MeshBasicMaterial).color.setHex(0x3b82f6); // Blue/Cold
        }
      });
    }
  });

  const metalMaterial = new THREE.MeshPhysicalMaterial({
    color: "#64748b",
    metalness: 0.9,
    roughness: 0.2,
    clearcoat: 0.5,
    side: THREE.DoubleSide
  });

  const darkMetalMaterial = new THREE.MeshPhysicalMaterial({
    color: "#334155",
    metalness: 0.8,
    roughness: 0.4,
    side: THREE.DoubleSide
  });

  const copperMaterial = new THREE.MeshPhysicalMaterial({
    color: "#b45309",
    metalness: 0.8,
    roughness: 0.3,
  });

  return (
    <group scale={0.7} position={[-1, -1, 0]}>
      <ambientLight intensity={0.2} />
      <pointLight position={[-2, 0, 0]} intensity={4} color="#3b82f6" distance={15} /> {/* Cherenkov Glow */}
      <pointLight position={[2, 0, 0]} intensity={2} color="#ef4444" distance={10} /> {/* Heat Glow */}
      <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />

      {/* ==================== REACTOR PRESSURE VESSEL (RPV) ==================== */}
      <group position={[-2, 0, 0]}>
        {/* RPV Outer Shell (Cutaway) */}
        <mesh material={metalMaterial} castShadow receiveShadow>
          <cylinderGeometry args={[2, 2, 7, 64, 1, false, 0, Math.PI * 1.3]} />
        </mesh>
        
        {/* RPV Head (Dome) */}
        <mesh position={[0, 3.5, 0]} material={metalMaterial} castShadow>
          <sphereGeometry args={[2, 64, 32, 0, Math.PI * 1.3, 0, Math.PI / 2]} />
        </mesh>
        
        {/* RPV Bottom (Dome) */}
        <mesh position={[0, -3.5, 0]} rotation={[Math.PI, 0, 0]} material={metalMaterial} castShadow>
          <sphereGeometry args={[2, 64, 32, 0, Math.PI * 1.3, 0, Math.PI / 2]} />
        </mesh>

        {/* Reactor Core Barrel */}
        <mesh position={[0, -0.5, 0]} material={darkMetalMaterial}>
          <cylinderGeometry args={[1.6, 1.6, 5, 32, 1, false, 0, Math.PI * 1.3]} />
        </mesh>

        {/* Water / Coolant with Cherenkov Radiation */}
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[1.55, 1.55, 5.8, 32, 1, false, 0, Math.PI * 1.3]} />
          <MeshTransmissionMaterial 
            backside
            samples={4}
            thickness={2}
            chromaticAberration={0.05}
            anisotropy={0.1}
            distortion={0.1}
            distortionScale={0.5}
            temporalDistortion={0.1}
            color="#bfdbfe"
            emissive="#1d4ed8"
            emissiveIntensity={0.8}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Fuel Assemblies (Uranium Rods) */}
        <group position={[0, -1.5, 0]}>
          {[...Array(45)].map((_, i) => {
            const row = Math.floor(i / 7) - 3;
            const col = (i % 7) - 3;
            if (row * row + col * col > 10) return null; // Make it roughly circular
            return (
              <mesh key={`fuel-${i}`} position={[col * 0.35, 0, row * 0.35]}>
                <cylinderGeometry args={[0.08, 0.08, 3.5, 8]} />
                <meshStandardMaterial 
                  color="#f59e0b" 
                  emissive="#f59e0b" 
                  emissiveIntensity={1.5} 
                  metalness={0.5} 
                  roughness={0.2} 
                />
              </mesh>
            );
          })}
        </group>

        {/* Control Rods & Drive Mechanisms */}
        <group ref={controlRodsRef} position={[0, 1.5, 0]}>
          {[...Array(21)].map((_, i) => {
            const row = Math.floor(i / 5) - 2;
            const col = (i % 5) - 2;
            if (row * row + col * col > 6) return null;
            return (
              <group key={`rod-${i}`} position={[col * 0.4, 0, row * 0.4]}>
                {/* The absorbing rod */}
                <mesh position={[0, 0, 0]}>
                  <cylinderGeometry args={[0.06, 0.06, 4, 8]} />
                  <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
                </mesh>
                {/* The drive shaft extending upwards */}
                <mesh position={[0, 3.5, 0]}>
                  <cylinderGeometry args={[0.03, 0.03, 3, 8]} />
                  <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
                </mesh>
              </group>
            );
          })}
        </group>

        {/* Control Rod Drive Housings (Top of RPV) */}
        <group position={[0, 4.5, 0]}>
          {[...Array(21)].map((_, i) => {
            const row = Math.floor(i / 5) - 2;
            const col = (i % 5) - 2;
            if (row * row + col * col > 6) return null;
            return (
              <mesh key={`housing-${i}`} position={[col * 0.4, 0, row * 0.4]}>
                <cylinderGeometry args={[0.1, 0.1, 1.5, 8]} />
                <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.4} />
              </mesh>
            );
          })}
        </group>

        {/* Cherenkov Sparkles */}
        <Sparkles count={200} scale={[2.5, 5, 2.5]} size={4} speed={0.4} opacity={0.6} color="#60a5fa" position={[0, -0.5, 0]} />

        {showLabels && (
          <>
            <ReactorLabel 
              position={[-2.2, 0, 0]} 
              title="Reactor Core" 
              text="Contains uranium fuel assemblies where nuclear fission occurs, generating immense heat." 
              color="#f59e0b" 
              side="left"
            />
            <ReactorLabel 
              position={[-1.5, 3, 0]} 
              title="Control Rods" 
              text="Made of neutron-absorbing material (like boron or cadmium). Inserted or withdrawn to control the fission rate." 
              color="#94a3b8" 
              side="left"
              delay={0.2}
            />
            <ReactorLabel 
              position={[-2.2, -2, 0]} 
              title="Cherenkov Radiation" 
              text="The characteristic blue glow caused by particles traveling faster than the phase velocity of light in water." 
              color="#3b82f6" 
              side="left"
              delay={0.4}
            />
          </>
        )}
      </group>

      {/* ==================== STEAM GENERATOR ==================== */}
      <group position={[2, 1, 0]}>
        {/* Outer Shell (Cutaway) */}
        <mesh material={metalMaterial} castShadow receiveShadow>
          <cylinderGeometry args={[1.5, 1.5, 6, 64, 1, false, 0, Math.PI * 1.3]} />
        </mesh>
        <mesh position={[0, 3, 0]} material={metalMaterial} castShadow>
          <sphereGeometry args={[1.5, 64, 32, 0, Math.PI * 1.3, 0, Math.PI / 2]} />
        </mesh>
        <mesh position={[0, -3, 0]} rotation={[Math.PI, 0, 0]} material={metalMaterial} castShadow>
          <sphereGeometry args={[1.5, 64, 32, 0, Math.PI * 1.3, 0, Math.PI / 2]} />
        </mesh>

        {/* U-Tubes (Heat Exchanger) */}
        <group position={[0, -2.5, 0]}>
          {[...Array(15)].map((_, i) => {
            const radius = 0.2 + (i * 0.08);
            const height = 3 + (i * 0.15);
            return (
              <mesh key={`utube-${i}`} position={[0, height/2, 0]}>
                <torusGeometry args={[radius, 0.02, 8, 32, Math.PI]} />
                <meshStandardMaterial color="#ef4444" metalness={0.6} roughness={0.4} emissive="#ef4444" emissiveIntensity={0.5} />
              </mesh>
            );
          })}
          {[...Array(15)].map((_, i) => {
            const radius = 0.2 + (i * 0.08);
            const height = 3 + (i * 0.15);
            return (
              <group key={`utube-legs-${i}`}>
                <mesh position={[-radius, height/4, 0]}>
                  <cylinderGeometry args={[0.02, 0.02, height/2, 8]} />
                  <meshStandardMaterial color="#ef4444" metalness={0.6} roughness={0.4} emissive="#ef4444" emissiveIntensity={0.5} />
                </mesh>
                <mesh position={[radius, height/4, 0]}>
                  <cylinderGeometry args={[0.02, 0.02, height/2, 8]} />
                  <meshStandardMaterial color="#3b82f6" metalness={0.6} roughness={0.4} />
                </mesh>
              </group>
            );
          })}
        </group>

        {/* Secondary Water */}
        <mesh position={[0, -1, 0]}>
          <cylinderGeometry args={[1.4, 1.4, 4, 32, 1, false, 0, Math.PI * 1.3]} />
          <MeshTransmissionMaterial 
            backside
            samples={4}
            thickness={1}
            color="#60a5fa"
            transparent
            opacity={0.6}
            distortion={0.2}
            temporalDistortion={0.2}
          />
        </mesh>

        {/* Boiling Steam Particles */}
        <group ref={steamParticlesRef} position={[0, 0, 0]}>
          {[...Array(40)].map((_, i) => (
            <mesh key={`steam-${i}`} position={[(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 2]}>
              <sphereGeometry args={[0.15 + Math.random() * 0.15, 8, 8]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
            </mesh>
          ))}
        </group>

        {showLabels && (
          <ReactorLabel 
            position={[1.8, 1, 0]} 
            title="Steam Generator" 
            text="Heat from the primary loop boils water in the secondary loop, creating high-pressure steam." 
            color="#ef4444" 
            side="right"
            delay={0.6}
          />
        )}
      </group>

      {/* ==================== PIPING SYSTEM ==================== */}
      {/* Hot Leg */}
      <mesh>
        <tubeGeometry args={[hotLegPath, 64, 0.4, 16, false]} />
        <meshPhysicalMaterial color="#ef4444" metalness={0.7} roughness={0.3} clearcoat={0.5} />
      </mesh>
      
      {/* Cold Leg */}
      <mesh>
        <tubeGeometry args={[coldLegPath, 64, 0.4, 16, false]} />
        <meshPhysicalMaterial color="#3b82f6" metalness={0.7} roughness={0.3} clearcoat={0.5} />
      </mesh>

      {/* Steam Line */}
      <mesh>
        <tubeGeometry args={[steamLinePath, 64, 0.3, 16, false]} />
        <meshPhysicalMaterial color="#e2e8f0" metalness={0.8} roughness={0.2} clearcoat={0.8} />
      </mesh>

      {/* Flow Particles */}
      <group ref={primaryCoolantRef}>
        {[...Array(40)].map((_, i) => (
          <mesh key={`flow-${i}`}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>

      {showLabels && (
        <>
          <ReactorLabel 
            position={[0.5, 2.2, 0]} 
            title="Hot Leg" 
            text="Carries superheated pressurized water (approx 315°C) from the reactor to the steam generator." 
            color="#ef4444" 
            side="top"
            delay={0.8}
          />
          <ReactorLabel 
            position={[0.5, -2.7, 0]} 
            title="Cold Leg" 
            text="Returns cooled water (approx 275°C) back to the reactor core to be reheated." 
            color="#3b82f6" 
            side="bottom"
            delay={1.0}
          />
        </>
      )}

      {/* ==================== TURBINE & GENERATOR ==================== */}
      <group position={[7, 2, 0]}>
        {/* Turbine Housing (Bottom Half) */}
        <mesh position={[0, -0.5, 0]} material={metalMaterial} castShadow receiveShadow>
          <boxGeometry args={[4, 1, 2]} />
        </mesh>
        
        {/* Turbine Blades */}
        <group ref={turbineRef} position={[-1, 0.5, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} material={darkMetalMaterial}>
            <cylinderGeometry args={[0.2, 0.2, 3, 16]} />
          </mesh>
          {[...Array(5)].map((_, stage) => (
            <group key={`stage-${stage}`} position={[(stage - 2) * 0.5, 0, 0]}>
              {[...Array(12)].map((_, blade) => (
                <mesh key={`blade-${stage}-${blade}`} rotation={[Math.PI * 2 * (blade / 12), 0, 0]} position={[0, 0, 0]}>
                  <boxGeometry args={[0.1, 1.2 + stage * 0.1, 0.05]} />
                  <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
                </mesh>
              ))}
            </group>
          ))}
        </group>

        {/* Generator */}
        <group ref={generatorRef} position={[1.5, 0.5, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} material={copperMaterial}>
            <cylinderGeometry args={[0.8, 0.8, 1.5, 32]} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} material={darkMetalMaterial}>
            <cylinderGeometry args={[0.85, 0.85, 1.4, 32, 1, true]} />
          </mesh>
        </group>

        {showLabels && (
          <>
            <ReactorLabel 
              position={[-1, 2, 0]} 
              title="Steam Turbine" 
              text="High-pressure steam expands through the turbine blades, converting thermal energy into mechanical rotation." 
              color="#e2e8f0" 
              side="top"
              delay={1.2}
            />
            <ReactorLabel 
              position={[1.5, 2, 0]} 
              title="Electrical Generator" 
              text="The spinning turbine drives the generator, moving electromagnets past copper coils to produce electricity." 
              color="#f59e0b" 
              side="top"
              delay={1.4}
            />
          </>
        )}
      </group>

    </group>
  );
}
