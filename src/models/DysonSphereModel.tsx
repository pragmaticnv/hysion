import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Text, Html, Float, Torus, Cylinder, Instances, Instance, Stars, Sparkles, Icosahedron } from '@react-three/drei';;
import * as THREE from 'three';
import { Line, Trail } from '../components/SafeLine';

const DYSON_INFO: Record<string, string> = {
  Star: "A G-type main-sequence star. The Dyson Swarm captures its 3.8 x 10^26 Watts of power, providing near-infinite energy for the civilization.",
  Swarm: "A dense network of billions of autonomous solar collectors. Each unit uses advanced photovoltaics and thermal-electric conversion to harvest stellar energy.",
  Shell: "A partial containment lattice that provides structural integrity and serves as a massive planetary-scale communication and processing array.",
  Framework: "The primary geodesic megastructure. Built from ultra-dense carbon-lattice metamaterials, it forms the backbone of the Dyson Sphere.",
  Hub: "Neural Intelligence Command Center. A planetary-scale data hub that manages the swarm's coordination and processes civilization-wide neural data.",
  Rings: "Superconducting magnetic containment rings that stabilize the megastructure against stellar flares and gravitational perturbations.",
  Satellites: "Autonomous energy-seeking satellites orbiting the exterior. They dynamically adjust their trajectories to harvest escaping radiation and beam it to the command hubs."
};

function StarCore() {
  const starRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const flaresRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (starRef.current) {
      starRef.current.rotation.y = t * 0.05;
    }
    if (coronaRef.current) {
      coronaRef.current.rotation.z = -t * 0.05;
      coronaRef.current.scale.setScalar(1.1 + Math.cos(t * 2.0) * 0.02);
    }
    if (flaresRef.current) {
      flaresRef.current.rotation.y = t * 0.15;
      flaresRef.current.rotation.x = Math.sin(t * 0.5) * 0.2;
    }
  });

  return (
    <group>
      {/* Core Star */}
      <Sphere ref={starRef} args={[3, 64, 64]}>
        <meshStandardMaterial 
          color="#ffaa00" 
          emissive="#ff4400" 
          emissiveIntensity={4} 
          roughness={0.8} 
          metalness={0.2} 
        />
      </Sphere>
      
      {/* Corona / Glow Layer */}
      <Sphere ref={coronaRef} args={[3.4, 64, 64]}>
        <meshBasicMaterial 
          color="#ffaa00" 
          transparent 
          opacity={0.15} 
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Sphere>

      {/* Solar Flares (Representative) */}
      <group ref={flaresRef}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Torus key={i} args={[3.1, 0.08, 16, 100, Math.PI / 1.5]} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
            <meshBasicMaterial color="#ff4400" transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
          </Torus>
        ))}
      </group>

      <pointLight color="#ffaa00" intensity={50} distance={300} decay={1.5} />
      <Sparkles count={200} scale={10} size={5} speed={0.8} color="#ffaa00" />
    </group>
  );
}

function CollectorSwarm({ detail }: { detail: 'high' | 'low' }) {
  const groupRef = useRef<THREE.Group>(null);
  const count = detail === 'low' ? 500 : 2000;
  
  const elements = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const radius = 4.5 + Math.random() * 4;
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      temp.push({
        position: [x, y, z] as [number, number, number],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
        scale: 0.02 + Math.random() * 0.06
      });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
      groupRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <Instances range={count} limit={count}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#0ea5e9" side={THREE.DoubleSide} transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
        {elements.map((el, i) => (
          <Instance 
            key={i} 
            position={el.position} 
            rotation={el.rotation} 
            scale={el.scale} 
          />
        ))}
      </Instances>

      {/* Energy Beams connecting swarm to shell */}
      {elements.slice(0, detail === 'low' ? 30 : 100).map((el, i) => {
        const dist = Math.sqrt(el.position[0]**2 + el.position[1]**2 + el.position[2]**2);
        const shellRadius = 10;
        const beamLength = shellRadius - dist;
        
        return (
          <group key={`beam-${i}`} position={el.position}>
            <Cylinder 
              args={[0.005, 0.005, beamLength]} 
              rotation={[Math.atan2(el.position[1], el.position[2]), 0, -Math.atan2(el.position[0], Math.sqrt(el.position[1]**2 + el.position[2]**2))]} 
              position={[el.position[0] * (beamLength/dist/2), el.position[1] * (beamLength/dist/2), el.position[2] * (beamLength/dist/2)]}
            >
              <meshBasicMaterial color="#38bdf8" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
            </Cylinder>
          </group>
        );
      })}
    </group>
  );
}

function EnergySatellites({ count = 800 }: { count?: number }) {
  const bodyMeshRef = useRef<THREE.InstancedMesh>(null);
  const panelMeshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const satellites = useMemo(() => {
    const sats = [];
    for (let i = 0; i < count; i++) {
      // Elliptical orbit parameters (Keplerian elements)
      const a = 12 + Math.random() * 15; // semi-major axis (outside the shell)
      const e = Math.random() * 0.3; // eccentricity (0 to 0.3 for slightly elliptical)
      
      // Random orbit orientation
      const inclination = Math.random() * Math.PI;
      const argumentOfPeriapsis = Math.random() * Math.PI * 2;
      const longitudeOfAscendingNode = Math.random() * Math.PI * 2;
      
      const orbitEuler = new THREE.Euler(inclination, longitudeOfAscendingNode, argumentOfPeriapsis, 'XYZ');
      const orbitQuaternion = new THREE.Quaternion().setFromEuler(orbitEuler);
      
      // Kepler's third law approximation for speed
      const speed = (0.5 + Math.random() * 0.2) / Math.pow(a, 1.5); 
      const phase = Math.random() * Math.PI * 2;
      
      sats.push({ a, e, orbitQuaternion, speed, phase });
    }
    return sats;
  }, [count]);

  useFrame((state) => {
    if (!bodyMeshRef.current || !panelMeshRef.current) return;
    const time = state.clock.getElapsedTime();
    
    satellites.forEach((sat, i) => {
      // Mean anomaly
      const M = sat.phase + time * sat.speed * 15; 
      
      // Solve Kepler's equation for Eccentric Anomaly (E)
      let E = M;
      for (let k = 0; k < 3; k++) {
        E = M + sat.e * Math.sin(E);
      }
      
      // True anomaly (nu)
      const nu = 2 * Math.atan2(Math.sqrt(1 + sat.e) * Math.sin(E / 2), Math.sqrt(1 - sat.e) * Math.cos(E / 2));
      
      // Distance (r)
      const r = sat.a * (1 - sat.e * Math.cos(E));
      
      // Position in 2D orbital plane
      const x = r * Math.cos(nu);
      const y = r * Math.sin(nu);
      const z = 0;
      
      dummy.position.set(x, y, z);
      
      // Apply 3D orbit orientation
      dummy.position.applyQuaternion(sat.orbitQuaternion);
      
      // Point towards the star (0,0,0) to "seek energy"
      dummy.lookAt(0, 0, 0);
      // Rotate so the flat side of the panels (Y-axis) faces the star
      dummy.rotateX(Math.PI / 2); 
      
      dummy.updateMatrix();
      bodyMeshRef.current!.setMatrixAt(i, dummy.matrix);
      panelMeshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    bodyMeshRef.current.instanceMatrix.needsUpdate = true;
    panelMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* Satellite Central Body */}
      <instancedMesh ref={bodyMeshRef} args={[undefined, undefined, count]}>
        <cylinderGeometry args={[0.03, 0.03, 0.2, 8]} />
        <meshStandardMaterial 
          color="#e2e8f0" 
          emissive="#0ea5e9" 
          emissiveIntensity={2} 
          metalness={0.9} 
          roughness={0.2} 
        />
      </instancedMesh>
      {/* Satellite Solar Panels */}
      <instancedMesh ref={panelMeshRef} args={[undefined, undefined, count]}>
        <boxGeometry args={[0.4, 0.01, 0.1]} />
        <meshStandardMaterial 
          color="#0284c7" 
          emissive="#0369a1" 
          emissiveIntensity={1.5} 
          metalness={1} 
          roughness={0.1} 
        />
      </instancedMesh>
    </group>
  );
}

export function DysonSphereModel({ showLabels, isMobile, detail = 'high', ...props }: { showLabels?: boolean, isMobile?: boolean, detail?: 'high' | 'low' }) {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const shellRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (shellRef.current) {
      shellRef.current.rotation.y = -t * 0.005;
      shellRef.current.rotation.x = Math.sin(t * 0.02) * 0.05;
    }
  });

  const PartLabel = ({ name, position }: { name: string, position: [number, number, number] }) => (
    showLabels ? (
      <Html position={position} center className="pointer-events-none z-10">
        <div 
          onClick={(e) => { e.stopPropagation(); setSelectedPart(name); }}
          className={`px-3 py-1 backdrop-blur-md border rounded-full text-[10px] font-mono whitespace-nowrap transition-all duration-300 cursor-pointer pointer-events-auto ${selectedPart === name ? 'bg-cyan-500/90 border-cyan-400 text-white scale-110 shadow-[0_0_20px_rgba(6,182,212,0.6)]' : 'bg-black/70 border-cyan-500/30 text-cyan-100 hover:text-white hover:border-cyan-400/80'}`}
        >
          {name}
        </div>
        {selectedPart === name && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 p-5 bg-zinc-950/98 backdrop-blur-md border border-cyan-500/50 rounded-2xl shadow-2xl shadow-cyan-500/40 text-left pointer-events-auto z-20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                <h4 className="text-[12px] font-bold text-cyan-400 uppercase tracking-widest">{name}</h4>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setSelectedPart(null); }} className="text-zinc-500 hover:text-white text-xl">×</button>
            </div>
            <p className="text-[11px] text-zinc-300 leading-relaxed font-sans mb-4">{DYSON_INFO[name]}</p>
            <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-[8px] text-zinc-500 uppercase tracking-tighter">System Health</span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">100% NOMINAL</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[8px] text-zinc-500 uppercase tracking-tighter">Energy Output</span>
                <span className="text-[10px] text-amber-400 font-mono font-bold">3.8e26 W</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] text-zinc-500 uppercase tracking-tighter">Neural Sync</span>
                <span className="text-[10px] text-cyan-400 font-mono font-bold">ACTIVE</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[8px] text-zinc-500 uppercase tracking-tighter">Containment</span>
                <span className="text-[10px] text-indigo-400 font-mono font-bold">STABLE</span>
              </div>
            </div>
          </div>
        )}
      </Html>
    ) : null
  );

  return (
    <group scale={isMobile ? 0.35 : 0.5} {...props} onPointerMissed={() => setSelectedPart(null)}>
      {/* Background Stars & Nebula */}
      <Stars radius={100} depth={50} count={10000} factor={6} saturation={0.8} fade speed={2} />
      <Sparkles count={500} scale={40} size={1.5} speed={0.2} color="#0ea5e9" opacity={0.2} />

      {/* Central Star */}
      <group onClick={(e) => { e.stopPropagation(); setSelectedPart('Star'); }}>
        <StarCore />
        <PartLabel name="Star" position={[0, 4, 0]} />
      </group>

      {/* Dyson Swarm */}
      <group onClick={(e) => { e.stopPropagation(); setSelectedPart('Swarm'); }}>
        <CollectorSwarm detail={detail} />
        <PartLabel name="Swarm" position={[6, 0, 0]} />
      </group>

      {/* Structural Lattice / Shell */}
      <group ref={shellRef}>
        {/* Geodesic Framework (Wireframe) */}
        <group onClick={(e) => { e.stopPropagation(); setSelectedPart('Framework'); }}>
          <Icosahedron args={[10, 4]}>
            <meshStandardMaterial color="#0f172a" wireframe emissive="#0284c7" emissiveIntensity={2} />
          </Icosahedron>
          <PartLabel name="Framework" position={[0, 10.5, 0]} />
        </group>

        {/* Solid Panels (Glass-like) */}
        <group onClick={(e) => { e.stopPropagation(); setSelectedPart('Shell'); }}>
          <Icosahedron args={[9.95, 4]}>
            <meshPhysicalMaterial 
              color="#0ea5e9"
              metalness={0.8}
              roughness={0.2}
              transparent
              opacity={0.25}
              side={THREE.DoubleSide}
              depthWrite={false}
              envMapIntensity={2}
            />
          </Icosahedron>
          <PartLabel name="Shell" position={[0, -10.5, 0]} />
        </group>

        {/* Equatorial Ring */}
        <group onClick={(e) => { e.stopPropagation(); setSelectedPart('Rings'); }}>
          <Torus args={[10.5, 0.05, 16, 120]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={5} />
          </Torus>
          <Torus args={[10.5, 0.15, 16, 120]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#0f172a" wireframe />
          </Torus>
          <PartLabel name="Rings" position={[11, 0, 0]} />
        </group>
      </group>

      {/* Neural Command Hubs */}
      <group onClick={(e) => { e.stopPropagation(); setSelectedPart('Hub'); }}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <group position={[12, 0, 0]}>
            {/* Core Hub */}
            <Icosahedron args={[0.8, 2]}>
              <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} wireframe />
            </Icosahedron>
            <Icosahedron args={[0.7, 2]}>
              <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={2} transparent opacity={0.8} />
            </Icosahedron>
            
            {/* Energy Connection to Shell */}
            <Cylinder args={[0.05, 0.05, 2]} rotation={[0, 0, Math.PI / 2]} position={[-1, 0, 0]}>
              <meshBasicMaterial color="#0ea5e9" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
            </Cylinder>
            
            <PartLabel name="Hub" position={[0, 1.5, 0]} />
          </group>
        </Float>
      </group>

      {/* Energy Seeking Satellites */}
      <group onClick={(e) => { e.stopPropagation(); setSelectedPart('Satellites'); }}>
        <EnergySatellites count={detail === 'low' ? 300 : 1200} />
        <PartLabel name="Satellites" position={[-12, 5, 0]} />
      </group>



    </group>
  );
}


