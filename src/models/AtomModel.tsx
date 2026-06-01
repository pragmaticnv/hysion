import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sphere, Text, Html, MeshTransmissionMaterial, Points, PointMaterial, Cylinder, Torus, Sparkles } from '@react-three/drei';;
import * as THREE from 'three';
import { Line, Trail } from '../components/SafeLine';

const ATOM_DETAILS: Record<string, string> = {
  "Nucleus": "The extremely dense central region of an atom, consisting of protons and neutrons, containing nearly all of the atom's mass.",
  "Proton (+)": "A subatomic particle with a positive elementary charge, located in the nucleus. The number of protons defines the element.",
  "Neutron (0)": "A subatomic particle with no electric charge, roughly equal in mass to a proton, providing stability to the nucleus.",
  "Electron (-)": "A subatomic particle with a negative charge that orbits the nucleus in specific energy levels or shells.",
  "Quantum Level": "A discrete energy state of an electron in an atom, defined by quantum numbers according to the Bohr model and wave mechanics.",
  "Probability Cloud": "A mathematical representation of where an electron is likely to be found, based on the Schrodinger wave equation."
};

function Hoverable({ name, description, children, color = "#a78bfa" }: { name: string, description: string, children: React.ReactNode, color?: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div 
      onMouseEnter={() => setHovered(true)} 
      onMouseLeave={() => setHovered(false)}
      className="relative pointer-events-auto"
    >
      {children}
      {hovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-zinc-900/95 border border-white/10 text-white p-3 rounded-xl text-[10px] pointer-events-none whitespace-normal w-48 shadow-2xl z-50 backdrop-blur-md">
           <div className="flex flex-col gap-1">
             <strong className="uppercase tracking-widest text-[8px] mb-1" style={{ color }}>Atomic Physics</strong>
             <span className="font-bold text-white text-xs">{name}</span>
             <p className="text-zinc-400 leading-relaxed font-medium">{description}</p>
           </div>
        </div>
      )}
    </div>
  );
}

function SmartHtml({ children, name, description, color, ...props }: any) {
  // Extract text content recursively
  const findText = (node: any): string => {
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(findText).join('');
    if (node?.props?.children) return findText(node.props.children);
    return '';
  };
  
  const textContent = findText(children);
  const labelName = name || textContent.split(':').shift() || "Atom Component";
  const labelDesc = description || ATOM_DETAILS[textContent] || ATOM_DETAILS[Object.keys(ATOM_DETAILS).find(k => textContent.includes(k)) || ""] || "Detailed quantum characteristic of the current atomic model.";

  return (
    <Html {...props}>
      <Hoverable name={labelName} description={labelDesc} color={color}>
        {children}
      </Hoverable>
    </Html>
  );
}

const generateElectronPath = (radius: number, tilt: [number, number, number]) => {
  const points = [];
  for (let i = 0; i <= 256; i++) {
    const t = (i / 256) * Math.PI * 2;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius;
    const vector = new THREE.Vector3(x, 0, z);
    vector.applyEuler(new THREE.Euler(...tilt));
    points.push(vector);
  }
  return points;
};

function GluonString({ start, end, flicker }: { start: THREE.Vector3, end: THREE.Vector3, flicker: number }) {
  const ref = useRef<THREE.Line>(null);
  const points = useMemo(() => [start, end], [start, end]);
  
  return (
    <Line 
      points={points} 
      color="#ffffff" 
      lineWidth={0.5} 
      transparent 
      opacity={0.2 * flicker} 
      blending={THREE.AdditiveBlending}
    />
  );
}

const ELEMENTS = {
  Hydrogen: { protons: 1, neutrons: 0, shells: [{ radius: 3, electrons: 1, color: '#6366f1' }], name: 'HYDROGEN-1' },
  Helium: { protons: 2, neutrons: 2, shells: [{ radius: 3, electrons: 2, color: '#fbbf24' }], name: 'HELIUM-4' },
  Carbon: { protons: 6, neutrons: 6, shells: [{ radius: 3.2, electrons: 2, color: '#6366f1' }, { radius: 5.2, electrons: 4, color: '#ec4899' }], name: 'CARBON-12' },
  Oxygen: { protons: 8, neutrons: 8, shells: [{ radius: 3.2, electrons: 2, color: '#6366f1' }, { radius: 5.2, electrons: 6, color: '#ec4899' }], name: 'OXYGEN-16' },
  Neon: { protons: 10, neutrons: 10, shells: [{ radius: 3.2, electrons: 2, color: '#6366f1' }, { radius: 5.2, electrons: 8, color: '#ec4899' }], name: 'NEON-20' }
};

export function AtomModel({ showLabels, detail = 'high', ...props }: { showLabels?: boolean, detail?: 'high' | 'low' }) {
  const [element, setElement] = useState<keyof typeof ELEMENTS>('Carbon');
  const groupRef = useRef<THREE.Group>(null);
  const nucleusRef = useRef<THREE.Group>(null);
  const baseRef = useRef<THREE.Group>(null);
  const cloudRef = useRef<THREE.Points>(null);
  const [flicker, setFlicker] = useState(1);
  const { viewport } = useThree();
  
  useEffect(() => {
    const handleVoiceCommand = (e: any) => {
      const { action, setting, value } = e.detail;
      if (action === 'ATOM_CONTROL' && setting) {
        if (setting === 'element' && value) {
          const validElements = ['Hydrogen', 'Helium', 'Carbon', 'Oxygen', 'Neon'];
          const capitalized = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
          if (validElements.includes(capitalized)) {
            setElement(capitalized as keyof typeof ELEMENTS);
          }
        }
      }
    };

    window.addEventListener('app-voice-command', handleVoiceCommand);
    return () => window.removeEventListener('app-voice-command', handleVoiceCommand);
  }, []);

  const currentElement = ELEMENTS[element];

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.05;
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.1;
    }
    if (nucleusRef.current) {
      nucleusRef.current.rotation.x = Math.sin(t * 0.2) * 0.2;
      nucleusRef.current.rotation.y = t * 0.1;
    }
    if (baseRef.current) {
      baseRef.current.rotation.y = -t * 0.1;
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y = t * 0.05;
    }

    if (Math.random() > 0.98) {
      setFlicker(Math.random() * 0.5 + 0.5);
    } else {
      setFlicker(prev => prev + (1 - prev) * 0.1);
    }
  });

  const nucleusParticles = useMemo(() => {
    const particles = [];
    const radius = 0.8;
    
    for (let i = 0; i < currentElement.protons; i++) {
      const phi = Math.acos(-1 + (2 * i) / currentElement.protons);
      const theta = Math.sqrt(currentElement.protons * Math.PI) * phi;
      particles.push({
        position: new THREE.Vector3(
          radius * Math.cos(theta) * Math.sin(phi),
          radius * Math.sin(theta) * Math.sin(phi),
          radius * Math.cos(phi)
        ).add(new THREE.Vector3((Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2)),
        color: '#ff3366',
        scale: 0.28,
        type: 'proton'
      });
    }
    for (let i = 0; i < currentElement.neutrons; i++) {
      const phi = Math.acos(-1 + (2 * i) / Math.max(1, currentElement.neutrons));
      const theta = Math.sqrt(Math.max(1, currentElement.neutrons) * Math.PI) * phi;
      particles.push({
        position: new THREE.Vector3(
          radius * Math.cos(theta + Math.PI) * Math.sin(phi),
          radius * Math.sin(theta + Math.PI) * Math.sin(phi),
          radius * Math.cos(phi)
        ).add(new THREE.Vector3((Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2)),
        color: '#33ccff',
        scale: 0.28,
        type: 'neutron'
      });
    }
    return particles;
  }, [currentElement]);

  const gluonStrings = useMemo(() => {
    if (detail === 'low') return [];
    const strings = [];
    for (let i = 0; i < nucleusParticles.length; i++) {
      for (let j = i + 1; j < nucleusParticles.length; j++) {
        if (nucleusParticles[i].position.distanceTo(nucleusParticles[j].position) < 1.5) {
          strings.push({ start: nucleusParticles[i].position, end: nucleusParticles[j].position });
        }
      }
    }
    return strings;
  }, [nucleusParticles, detail]);

  const probabilityCloud = useMemo(() => {
    const count = detail === 'low' ? 3000 : 15000;
    const points = [];
    for (let i = 0; i < count; i++) {
      const isInner = Math.random() < 0.2;
      const rBase = isInner ? 3.2 : 5.2;
      const spread = isInner ? 0.8 : 1.5;
      
      let r = rBase + (Math.random() - 0.5) * spread;
      let theta = Math.random() * Math.PI * 2;
      let phi = Math.acos(Math.random() * 2 - 1);
      
      if (!isInner && Math.random() < 0.6) {
        const axis = Math.floor(Math.random() * 3);
        if (axis === 0) { theta = Math.random() < 0.5 ? 0 : Math.PI; phi = Math.PI/2 + (Math.random()-0.5)*0.5; }
        else if (axis === 1) { phi = Math.random() < 0.5 ? 0 : Math.PI; }
        else { theta = Math.random() < 0.5 ? Math.PI/2 : Math.PI*1.5; phi = Math.PI/2 + (Math.random()-0.5)*0.5; }
        r += Math.random() * 1.5;
      }

      points.push(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
    }
    return new Float32Array(points);
  }, [detail]);

  const sphereSegments = detail === 'low' ? 16 : 128;
  const nucleusSegments = detail === 'low' ? 24 : 128;

  return (
    <group {...props}>
      {/* Advanced Hologram Base removed per user request */}

      {/* Element Selector UI - Static Position */}
      {showLabels && (
        <Html position={[0, 5, 0]} center>
          <div className="flex gap-2 bg-black/60 backdrop-blur-md p-2 rounded-xl border border-white/10 pointer-events-auto">
            {(Object.keys(ELEMENTS) as Array<keyof typeof ELEMENTS>).map((name) => (
              <button
                key={name}
                onClick={(e) => { e.stopPropagation(); setElement(name); }}
                className={`px-3 py-1 rounded-lg text-[10px] uppercase font-bold transition-all cursor-pointer ${
                  element === name 
                    ? 'bg-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </Html>
      )}

      <group ref={groupRef} scale={1.1}>
        {/* Enhanced Probability Cloud */}
        <points ref={cloudRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={probabilityCloud.length / 3}
              array={probabilityCloud}
              itemSize={3}
            />
          </bufferGeometry>
          <PointMaterial
            transparent
            color="#a78bfa"
            size={0.05}
            sizeAttenuation={true}
            depthWrite={false}
            opacity={0.15 * flicker}
            blending={THREE.AdditiveBlending}
          />
        </points>

        {/* Ambient Quantum Fluctuations */}
        <Sparkles count={200} scale={12} size={1.5} speed={0.4} opacity={0.2} color="#818cf8" />

        {/* Nucleus */}
        <group ref={nucleusRef}>
          {showLabels && (
            <SmartHtml position={[0, 2.2, 0]} center className="pointer-events-none">
              <div className="flex flex-col items-center gap-2">
                <div className="px-4 py-2 bg-black/90 backdrop-blur-md border border-red-500/40 rounded-full text-[12px] text-red-400 font-mono tracking-[0.2em] uppercase whitespace-nowrap shadow-[0_0_30px_rgba(239,68,68,0.4)] flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  Nucleus
                </div>
                <div className="w-px h-8 bg-gradient-to-b from-red-500/50 to-transparent" />
              </div>
            </SmartHtml>
          )}
          
          {/* Central Energy Core with Refraction */}
          <Sphere args={[1.6, nucleusSegments, nucleusSegments]}>
            <MeshTransmissionMaterial 
              transmission={0.95}
              thickness={2.5}
              roughness={0.05}
              chromaticAberration={0.15}
              anisotropy={0.5}
              distortion={0.3}
              distortionScale={0.3}
              temporalDistortion={0.2}
              samples={16}
              resolution={1024}
              color="#e0e7ff"
              transparent
              opacity={0.6 * flicker}
              clearcoat={1}
              clearcoatRoughness={0.05}
            />
          </Sphere>
          <pointLight color="#818cf8" intensity={20} distance={15} decay={2} />

          {/* Nucleus Particles with Advanced Materials */}
          {nucleusParticles.map((particle, i) => (
            <group key={i} position={particle.position}>
              <Sphere args={[particle.scale, sphereSegments, sphereSegments]}>
                <meshPhysicalMaterial 
                  color={particle.color} 
                  emissive={particle.color} 
                  emissiveIntensity={1.2 * flicker} 
                  roughness={0.2} 
                  metalness={0.8}
                  clearcoat={1}
                  clearcoatRoughness={0.1}
                  transmission={0.2}
                  thickness={0.5}
                />
              </Sphere>
              {showLabels && particle.type === 'proton' && i === 0 && (
                <SmartHtml position={[0, 0.4, 0]} center className="pointer-events-none">
                  <div className="px-2 py-1 bg-black/80 backdrop-blur-sm border border-red-500/30 rounded text-[8px] text-red-200 font-mono tracking-wider uppercase whitespace-nowrap">
                    Proton (+)
                  </div>
                </SmartHtml>
              )}
              {showLabels && particle.type === 'neutron' && i === currentElement.protons && (
                <SmartHtml position={[0, 0.4, 0]} center className="pointer-events-none">
                  <div className="px-2 py-1 bg-black/80 backdrop-blur-sm border border-blue-500/30 rounded text-[8px] text-blue-200 font-mono tracking-wider uppercase whitespace-nowrap">
                    Neutron (0)
                  </div>
                </SmartHtml>
              )}
            </group>
          ))}
        </group>

        {/* Electron Shells */}
        {currentElement.shells.map((shell, i) => {
          const path = generateElectronPath(shell.radius, [0.5, 0.5, 0]);
          return (
            <group key={i}>
              {showLabels && i === currentElement.shells.length - 1 && (
                <SmartHtml position={[shell.radius + 1, 0, 0]} center className="pointer-events-none">
                  <div className="px-3 py-1 bg-zinc-900/90 backdrop-blur-md border border-white/20 rounded-lg text-[9px] text-zinc-200 font-mono tracking-widest uppercase whitespace-nowrap shadow-xl">
                    Quantum Level: {i + 1}
                  </div>
                </SmartHtml>
              )}
              
              {/* Orbital Path with Glow */}
              <Line points={path} color={shell.color} lineWidth={3} opacity={0.3 * flicker} transparent blending={THREE.AdditiveBlending} />
              <Line points={path} color="#ffffff" lineWidth={1} opacity={0.5 * flicker} transparent blending={THREE.AdditiveBlending} />
              
              {/* Electrons */}
              {[...Array(shell.electrons)].map((_, j) => (
                <Electron 
                  key={j}
                  radius={shell.radius} 
                  speed={2.2 / (i + 1)} 
                  tilt={[0.5, 0.5, 0]} 
                  color={shell.color} 
                  offset={(j / shell.electrons) * Math.PI * 2}
                  flicker={flicker}
                  showLabel={showLabels && i === currentElement.shells.length - 1 && j === 0}
                  detail={detail}
                />
              ))}
            </group>
          );
        })}


      </group>
    </group>
  );
}

function Electron({ radius, speed, tilt, color, offset = 0, flicker, showLabel, detail = 'high' }: { radius: number, speed: number, tilt: [number, number, number], color: string, offset?: number, flicker: number, showLabel?: boolean, detail?: 'high' | 'low' }) {
  const ref = useRef<THREE.Group>(null);
  const segments = detail === 'low' ? 12 : 64;
  const glowSegments = detail === 'low' ? 8 : 48;
  
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime() * speed + offset;
      const x = Math.cos(t) * radius;
      const z = Math.sin(t) * radius;
      const vector = new THREE.Vector3(x, 0, z);
      vector.applyEuler(new THREE.Euler(...tilt));
      ref.current.position.copy(vector);
    }
  });

  return (
    <group ref={ref}>
      {showLabel && (
        <SmartHtml position={[0, 0.5, 0]} center className="pointer-events-none">
          <div className="px-2 py-1 bg-black/80 backdrop-blur-sm border border-white/20 rounded text-[8px] text-white font-mono tracking-wider uppercase whitespace-nowrap">
            Electron (-)
          </div>
        </SmartHtml>
      )}
      <Trail width={2} length={detail === 'low' ? 10 : 30} color={new THREE.Color(color)} attenuation={(t) => t * t * t}>
        <Sphere args={[0.2, segments, segments]}>
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </Sphere>
      </Trail>
      <Sphere args={[0.25, glowSegments, glowSegments]}>
        <meshBasicMaterial color={color} transparent opacity={0.4} blending={THREE.AdditiveBlending} toneMapped={false} />
      </Sphere>
      <pointLight color={color} intensity={12 * flicker} distance={8} decay={2} />
    </group>
  );
}
