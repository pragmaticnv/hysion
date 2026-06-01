import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Text, Html, MeshTransmissionMaterial, Ring, Float } from '@react-three/drei';;
import * as THREE from 'three';
import { Line, Trail } from '../components/SafeLine';

const PLANET_INFO: Record<string, string> = {
  Sun: "The star at the center of the Solar System. It is a nearly perfect sphere of hot plasma, heated to incandescence by nuclear fusion reactions in its core.",
  Mercury: "The smallest planet in the Solar System and the closest to the Sun. Its orbit around the Sun takes 87.97 Earth days, the shortest of all the Sun's planets.",
  Venus: "The second planet from the Sun. It is a terrestrial planet and is sometimes called Earth's 'sister planet' because of their similar size, mass, proximity to the Sun, and bulk composition.",
  Earth: "The third planet from the Sun and the only astronomical object known to harbor life. About 29.2% of Earth's surface is land consisting of continents and islands.",
  Mars: "The fourth planet from the Sun. It is a dusty, cold, desert world with a very thin atmosphere. It is also a dynamic planet with seasons, polar ice caps, canyons, and extinct volcanoes.",
  Jupiter: "The fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass more than two and a half times that of all the other planets in the Solar System combined.",
  Saturn: "The sixth planet from the Sun and the second-largest in the Solar System, after Jupiter. It is a gas giant with an average radius of about nine and a half times that of Earth.",
  Uranus: "The seventh planet from the Sun. It has the third-largest planetary radius and fourth-largest planetary mass in the Solar System. It rotates on its side.",
  Neptune: "The eighth and farthest-known Solar planet from the Sun. In the Solar System, it is the fourth-largest planet by diameter, the third-most-massive planet, and the densest giant planet."
};

function Hoverable({ name, description, children, color = "#fbbf24" }: { name: string, description: string, children: React.ReactNode, color?: string }) {
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
             <strong className="uppercase tracking-widest text-[8px] mb-1" style={{ color }}>Astronomical Data</strong>
             <span className="font-bold text-white text-xs">{name}</span>
             <p className="text-zinc-400 leading-relaxed font-medium">{description}</p>
           </div>
        </div>
      )}
    </div>
  );
}

function SmartHtml({ children, name, description, color, ...props }: any) {
  const findText = (node: any): string => {
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(findText).join('');
    if (node?.props?.children) return findText(node.props.children);
    return '';
  };
  
  const textContent = findText(children).trim();
  const labelName = name || textContent;
  const labelDesc = description || PLANET_INFO[textContent] || "Detailed planetary characteristic of the Solar System.";

  return (
    <Html {...props}>
      <Hoverable name={labelName} description={labelDesc} color={color}>
        {children}
      </Hoverable>
    </Html>
  );
}

const generateOrbit = (radius: number, segments: number = 128) => {
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
  }
  return points;
};

export function SolarSystemModel({ showLabels, isMobile, detail = 'high', ...props }: { showLabels?: boolean, isMobile?: boolean, detail?: 'high' | 'low' }) {
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);

  const sunRef = useRef<THREE.Mesh>(null);
  const mercuryGroup = useRef<THREE.Group>(null);
  const venusGroup = useRef<THREE.Group>(null);
  const earthGroup = useRef<THREE.Group>(null);
  const marsGroup = useRef<THREE.Group>(null);
  const jupiterGroup = useRef<THREE.Group>(null);
  const saturnGroup = useRef<THREE.Group>(null);
  const uranusGroup = useRef<THREE.Group>(null);
  const neptuneGroup = useRef<THREE.Group>(null);
  const starsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (sunRef.current) sunRef.current.rotation.y = t * 0.05;
    if (mercuryGroup.current) mercuryGroup.current.rotation.y = t * 0.8;
    if (venusGroup.current) venusGroup.current.rotation.y = t * 0.6;
    if (earthGroup.current) earthGroup.current.rotation.y = t * 0.4;
    if (marsGroup.current) marsGroup.current.rotation.y = t * 0.3;
    if (jupiterGroup.current) jupiterGroup.current.rotation.y = t * 0.15;
    if (saturnGroup.current) saturnGroup.current.rotation.y = t * 0.1;
    if (uranusGroup.current) uranusGroup.current.rotation.y = t * 0.07;
    if (neptuneGroup.current) neptuneGroup.current.rotation.y = t * 0.05;
    
    // Slowly rotate the starfield
    if (starsRef.current) {
      starsRef.current.rotation.y = t * 0.005;
      starsRef.current.rotation.x = t * 0.002;
    }
  });

  const orbitSegments = detail === 'low' ? 32 : (isMobile ? 64 : 128);
  const mercuryOrbit = useMemo(() => generateOrbit(4, orbitSegments), [orbitSegments]);
  const venusOrbit = useMemo(() => generateOrbit(6, orbitSegments), [orbitSegments]);
  const earthOrbit = useMemo(() => generateOrbit(8.5, orbitSegments), [orbitSegments]);
  const marsOrbit = useMemo(() => generateOrbit(11, orbitSegments), [orbitSegments]);
  const jupiterOrbit = useMemo(() => generateOrbit(15, orbitSegments), [orbitSegments]);
  const saturnOrbit = useMemo(() => generateOrbit(19, orbitSegments), [orbitSegments]);
  const uranusOrbit = useMemo(() => generateOrbit(23, orbitSegments), [orbitSegments]);
  const neptuneOrbit = useMemo(() => generateOrbit(27, orbitSegments), [orbitSegments]);

  // Generate random stars for the background
  const stars = useMemo(() => {
    const count = detail === 'low' ? 200 : (isMobile ? 500 : 2000);
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 200;
      const y = (Math.random() - 0.5) * 200;
      const z = (Math.random() - 0.5) * 200;
      // Keep stars out of the immediate center
      if (Math.abs(x) < 30 && Math.abs(y) < 30 && Math.abs(z) < 30) continue;
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, [isMobile, detail]);

  const OrbitLine = ({ points }: { points: THREE.Vector3[] }) => (
    <Line points={points} color="#ffffff" lineWidth={0.5} opacity={0.1} transparent />
  );

  const PlanetLabel = ({ name, position }: { name: string, position: [number, number, number] }) => (
    showLabels && detail === 'high' ? (
      <SmartHtml position={position} center className="pointer-events-none z-10">
        <div className={`px-2 py-0.5 backdrop-blur-sm border rounded text-[9px] font-mono whitespace-nowrap transition-all duration-300 ${selectedPlanet === name ? 'bg-indigo-500/80 border-indigo-400 text-white scale-110' : 'bg-black/60 border-white/5 text-zinc-400'}`}>
          {name}
        </div>
      </SmartHtml>
    ) : null
  );

  const atmosphereProps = {
    samples: detail === 'low' ? 2 : (isMobile ? 4 : 8),
    resolution: detail === 'low' ? 64 : (isMobile ? 128 : 256),
    transmission: 0.9,
    roughness: 0.1,
    thickness: 0.2,
    ior: 1.2,
    chromaticAberration: 0.05,
    anisotropy: 0.1,
    distortion: 0.1,
    distortionScale: 0.2,
    temporalDistortion: 0.1,
    attenuationDistance: 0.5,
    attenuationColor: '#ffffff',
  };

  const planetSegments = detail === 'low' ? 8 : (isMobile ? 12 : 32);
  const gasGiantSegments = detail === 'low' ? 12 : (isMobile ? 16 : 32);

  return (
    <group scale={0.6} {...props} onPointerMissed={() => setSelectedPlanet(null)}>
      {/* Dynamic Starfield Background */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={stars.length / 3}
            array={stars}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.1} color="#ffffff" transparent opacity={0.6} sizeAttenuation />
      </points>

      {/* Sun - Multi-layered Corona */}
      <group>
        <Sphere ref={sunRef} args={[2.5, gasGiantSegments, gasGiantSegments]} onClick={(e) => { e.stopPropagation(); setSelectedPlanet('Sun'); }}>
          {showLabels && (
            <SmartHtml position={[0, 3.5, 0]} center className="pointer-events-none z-10">
              <div className={`px-3 py-1 backdrop-blur-md border rounded-full text-[10px] font-mono whitespace-nowrap transition-all duration-300 ${selectedPlanet === 'Sun' ? 'bg-yellow-500/80 border-yellow-300 text-white shadow-[0_0_30px_rgba(234,179,8,0.8)] scale-110' : 'bg-black/80 border-white/10 text-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.4)]'}`} id="sun-label">
                Sun
              </div>
            </SmartHtml>
          )}
          <meshStandardMaterial 
            color="#fbbf24" 
            emissive="#fbbf24" 
            emissiveIntensity={3} 
            toneMapped={false} 
            roughness={0.2} 
          />
        </Sphere>
        {/* Outer Corona Glow */}
        <Sphere args={[2.9, gasGiantSegments, gasGiantSegments]}>
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.15} side={THREE.BackSide} toneMapped={false} />
        </Sphere>
        <pointLight color="#fbbf24" intensity={8} distance={80} decay={1.5} />
      </group>

      {/* Mercury */}
      <group ref={mercuryGroup}>
        <PlanetLabel name="Mercury" position={[4, 1, 0]} />
        <OrbitLine points={mercuryOrbit} />
        <Sphere args={[0.2, planetSegments, planetSegments]} position={[4, 0, 0]} castShadow receiveShadow onClick={(e) => { e.stopPropagation(); setSelectedPlanet('Mercury'); }}>
          <meshStandardMaterial color="#a1a1aa" roughness={0.8} metalness={0.5} />
        </Sphere>
      </group>

      {/* Venus - Thick Atmosphere */}
      <group ref={venusGroup}>
        <PlanetLabel name="Venus" position={[6, 1.5, 0]} />
        <OrbitLine points={venusOrbit} />
        <group position={[6, 0, 0]} onClick={(e) => { e.stopPropagation(); setSelectedPlanet('Venus'); }}>
          <Sphere args={[0.45, planetSegments, planetSegments]} castShadow receiveShadow>
            <meshStandardMaterial color="#fcd34d" roughness={0.5} metalness={0.3} />
          </Sphere>
          <Sphere args={[0.5, planetSegments, planetSegments]}>
            <MeshTransmissionMaterial {...atmosphereProps} color="#fcd34d" opacity={0.4} />
          </Sphere>
        </group>
      </group>

      {/* Earth - Blue Marble with Atmosphere */}
      <group ref={earthGroup}>
        <PlanetLabel name="Earth" position={[8.5, 1.5, 0]} />
        <OrbitLine points={earthOrbit} />
        <group position={[8.5, 0, 0]} onClick={(e) => { e.stopPropagation(); setSelectedPlanet('Earth'); }}>
          <Sphere args={[0.5, planetSegments, planetSegments]} castShadow receiveShadow>
            <meshStandardMaterial color="#3b82f6" roughness={0.4} metalness={0.2} emissive="#1d4ed8" emissiveIntensity={0.2} />
          </Sphere>
          {/* Atmosphere */}
          <Sphere args={[0.55, planetSegments, planetSegments]}>
            <MeshTransmissionMaterial {...atmosphereProps} color="#60a5fa" />
          </Sphere>
          
          {/* Moon */}
          <group position={[1.2, 0, 0]}>
            <Sphere args={[0.15, planetSegments, planetSegments]}>
              <meshStandardMaterial color="#e5e7eb" roughness={0.9} metalness={0.1} />
            </Sphere>
          </group>
          <Line 
            points={generateOrbit(1.2, 32)} 
            color="#ffffff" 
            lineWidth={0.2} 
            opacity={0.1} 
            transparent 
          />
        </group>
      </group>

      {/* Mars */}
      <group ref={marsGroup}>
        <PlanetLabel name="Mars" position={[11, 1.5, 0]} />
        <OrbitLine points={marsOrbit} />
        <Sphere args={[0.35, planetSegments, planetSegments]} position={[11, 0, 0]} castShadow receiveShadow onClick={(e) => { e.stopPropagation(); setSelectedPlanet('Mars'); }}>
          <meshStandardMaterial color="#ef4444" roughness={0.9} metalness={0.2} emissive="#991b1b" emissiveIntensity={0.1} />
        </Sphere>
      </group>

      {/* Jupiter - Gas Giant */}
      <group ref={jupiterGroup}>
        <PlanetLabel name="Jupiter" position={[15, 2.5, 0]} />
        <OrbitLine points={jupiterOrbit} />
        <Sphere args={[1.4, gasGiantSegments, gasGiantSegments]} position={[15, 0, 0]} castShadow receiveShadow onClick={(e) => { e.stopPropagation(); setSelectedPlanet('Jupiter'); }}>
          <meshStandardMaterial color="#d97706" roughness={0.5} metalness={0.1} emissive="#b45309" emissiveIntensity={0.1} />
        </Sphere>
      </group>

      {/* Saturn - Rings */}
      <group ref={saturnGroup}>
        <PlanetLabel name="Saturn" position={[19, 2.5, 0]} />
        <OrbitLine points={saturnOrbit} />
        <group position={[19, 0, 0]} onClick={(e) => { e.stopPropagation(); setSelectedPlanet('Saturn'); }}>
          <Sphere args={[1.2, gasGiantSegments, gasGiantSegments]} castShadow receiveShadow>
            <meshStandardMaterial color="#f59e0b" roughness={0.6} metalness={0.1} />
          </Sphere>
          {/* Rings */}
          <group rotation={[Math.PI / 2.5, 0, 0]}>
            <Ring args={[1.6, 2.8, gasGiantSegments]} receiveShadow castShadow>
              <meshStandardMaterial color="#fde68a" transparent opacity={0.9} side={THREE.DoubleSide} emissive="#fde68a" emissiveIntensity={0.3} />
            </Ring>
            <Ring args={[1.7, 2.7, gasGiantSegments]} position={[0, 0, 0.01]}>
               <meshBasicMaterial color="#78350f" transparent opacity={0.4} side={THREE.DoubleSide} />
            </Ring>
          </group>
        </group>
      </group>

      {/* Uranus */}
      <group ref={uranusGroup}>
        <PlanetLabel name="Uranus" position={[23, 2.5, 0]} />
        <OrbitLine points={uranusOrbit} />
        <group position={[23, 0, 0]} onClick={(e) => { e.stopPropagation(); setSelectedPlanet('Uranus'); }}>
          <Sphere args={[0.9, gasGiantSegments, gasGiantSegments]} castShadow receiveShadow>
            <meshStandardMaterial color="#22d3ee" roughness={0.6} metalness={0.1} emissive="#06b6d4" emissiveIntensity={0.1} />
          </Sphere>
          {/* Rings - Simplified */}
          <group rotation={[Math.PI / 2.5, 0, 0]}>
            <Ring args={[1.2, 2.0, gasGiantSegments]} receiveShadow castShadow>
              <meshStandardMaterial color="#a5f3fc" transparent opacity={0.6} side={THREE.DoubleSide} emissive="#a5f3fc" emissiveIntensity={0.1} />
            </Ring>
          </group>
        </group>
      </group>

      {/* Neptune */}
      <group ref={neptuneGroup}>
        <PlanetLabel name="Neptune" position={[27, 2.5, 0]} />
        <OrbitLine points={neptuneOrbit} />
        <Sphere args={[0.9, gasGiantSegments, gasGiantSegments]} position={[27, 0, 0]} castShadow receiveShadow onClick={(e) => { e.stopPropagation(); setSelectedPlanet('Neptune'); }}>
          <meshStandardMaterial color="#3b82f6" roughness={0.6} metalness={0.1} emissive="#2563eb" emissiveIntensity={0.1} />
        </Sphere>
      </group>
      

    </group>
  );
}
