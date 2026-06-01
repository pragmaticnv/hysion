import { useRef, useMemo, useEffect, useCallback, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Html, Text, Float, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { useXR } from '@react-three/xr';
import { useStore } from '../store/useStore';

const GEOGRAPHIC_DETAILS: Record<string, string> = {
  "RUSSIA": "The largest country in the world by area, spanning Eastern Europe and Northern Asia. Known for its vast landscapes and rich cultural heritage.",
  "CHINA": "The world's most populous country, located in East Asia. A global leader in technology, manufacturing, and a major historical civilization.",
  "INDIA": "A diverse country in South Asia, known for its deep history, spiritual traditions, and rapidly growing economy.",
  "USA": "A transcontinental country primarily in North America. A major global economic and military power with a highly diverse population.",
  "CANADA": "The second-largest country by area, known for its natural beauty, bilingual culture, and high quality of life.",
  "BRAZIL": "The largest country in South America and Latin America, famous for the Amazon rainforest and vibrant carnival celebrations.",
  "AUSTRALIA": "A country and continent surrounded by the Indian and Pacific oceans, known for its unique wildlife and the Great Barrier Reef."
};

function Hoverable({ name, description, children, color = "#00ffff" }: { name: string, description: string, children: React.ReactNode, color?: string }) {
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
             <strong className="uppercase tracking-widest text-[8px] mb-1" style={{ color }}>Geographic Analysis</strong>
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
  
  const textContent = findText(children).trim().toUpperCase();
  const labelName = name || textContent;
  const labelDesc = description || GEOGRAPHIC_DETAILS[textContent] || "Detailed geographic and geopolitical overview of the selected region.";

  return (
    <Html {...props}>
      <Hoverable name={labelName} description={labelDesc} color={color}>
        {children}
      </Hoverable>
    </Html>
  );
}

export const COUNTRIES = [
  { name: 'RUSSIA', lat: 61.524, lon: 105.318 },
  { name: 'CHINA', lat: 35.861, lon: 104.195 },
  { name: 'INDIA', lat: 22.973, lon: 78.656 },
  { name: 'USA', lat: 37.090, lon: -95.712 },
  { name: 'CANADA', lat: 56.130, lon: -106.346 },
  { name: 'BRAZIL', lat: -14.235, lon: -51.925 },
  { name: 'AUSTRALIA', lat: -25.274, lon: 133.775 },
  { name: 'ALGERIA', lat: 28.033, lon: 1.659 },
  { name: 'SAUDI ARABIA', lat: 23.885, lon: 45.079 },
  { name: 'MEXICO', lat: 23.634, lon: -102.552 },
  { name: 'ARGENTINA', lat: -38.416, lon: -63.616 },
  { name: 'KAZAKHSTAN', lat: 48.019, lon: 66.923 },
  { name: 'MONGOLIA', lat: 46.862, lon: 103.846 },
  { name: 'INDONESIA', lat: -0.789, lon: 113.921 },
  { name: 'EGYPT', lat: 26.820, lon: 30.802 },
  { name: 'SOUTH AFRICA', lat: -30.559, lon: 22.937 },
  { name: 'FRANCE', lat: 46.227, lon: 2.213 },
  { name: 'GERMANY', lat: 51.165, lon: 10.451 },
  { name: 'UK', lat: 55.378, lon: -3.435 },
  { name: 'JAPAN', lat: 36.204, lon: 138.252 },
  { name: 'TURKEY', lat: 38.963, lon: 35.243 },
  { name: 'IRAN', lat: 32.427, lon: 53.688 },
  { name: 'ETHIOPIA', lat: 9.145, lon: 40.489 },
  { name: 'NIGERIA', lat: 9.082, lon: 8.675 },
  { name: 'PAKISTAN', lat: 30.375, lon: 69.345 },
  { name: 'BANGLADESH', lat: 23.685, lon: 90.356 },
  { name: 'VIETNAM', lat: 14.058, lon: 108.277 },
  { name: 'THAILAND', lat: 15.870, lon: 100.993 },
  { name: 'SPAIN', lat: 40.463, lon: -3.749 },
  { name: 'ITALY', lat: 41.871, lon: 12.567 },
  { name: 'SOUTH KOREA', lat: 35.907, lon: 127.766 },
  { name: 'COLOMBIA', lat: 4.570, lon: -74.297 },
  { name: 'PERU', lat: -9.190, lon: -75.015 },
  { name: 'UKRAINE', lat: 48.379, lon: 31.165 },
  { name: 'POLAND', lat: 51.919, lon: 19.145 },
  { name: 'MOROCCO', lat: 31.791, lon: -7.092 },
  { name: 'KENYA', lat: -0.023, lon: 37.906 },
  { name: 'TANZANIA', lat: -6.369, lon: 34.888 },
  { name: 'CHILE', lat: -35.675, lon: -71.543 },
  { name: 'PHILIPPINES', lat: 12.879, lon: 121.774 },
  { name: 'MALAYSIA', lat: 4.210, lon: 101.975 },
  { name: 'IRAQ', lat: 33.223, lon: 43.679 },
  { name: 'AFGHANISTAN', lat: 33.939, lon: 67.709 },
  { name: 'SUDAN', lat: 12.862, lon: 30.217 },
  { name: 'SWEDEN', lat: 60.128, lon: 18.643 },
  { name: 'NORWAY', lat: 60.472, lon: 8.468 },
  { name: 'FINLAND', lat: 61.924, lon: 25.748 },
];

export function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export function GlobeModel({ showLabels, setFocusTarget, controlsRef, detail = 'high', ...props }: { 
  showLabels?: boolean,
  setFocusTarget?: (target: { position: THREE.Vector3, target: THREE.Vector3 } | null) => void,
  controlsRef?: React.RefObject<any>,
  detail?: 'high' | 'low'
}) {
  const groupRef = useRef<THREE.Group>(null);
  const globeRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const labelsGroupRef = useRef<THREE.Group>(null);
  const hoveredCountry = useRef<string | null>(null);
  const [hoveredCountryState, setHoveredCountryState] = useState<string | null>(null);

  const session = useXR((state: any) => state.session);
  const isARMode = useStore(state => state.isARMode);
  const isAR = (session as any)?.mode === 'immersive-ar' || isARMode;

  const colorMap = useLoader(THREE.TextureLoader, 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg');
  const bumpMap = useLoader(THREE.TextureLoader, 'https://unpkg.com/three-globe/example/img/earth-topology.png');
  
  const countryLabels = useMemo(() => {
    const countries = detail === 'low' ? COUNTRIES.slice(0, 10) : COUNTRIES;
    return countries.map(country => ({
      ...country,
      position: latLonToVector3(country.lat, country.lon, 1.55)
    }));
  }, [detail]);

  // Handle wheel event for targeted zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!controlsRef?.current || !hoveredCountry.current) return;

      // If we are zooming in (deltaY < 0), move the target towards the hovered country
      if (e.deltaY < 0) {
        const country = countryLabels.find(c => c.name === hoveredCountry.current);
        if (country && labelsGroupRef.current) {
          const worldPos = country.position.clone();
          labelsGroupRef.current.localToWorld(worldPos);
          
          // Smoothly move the controls target towards the world position
          controlsRef.current.target.lerp(worldPos, 0.1);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [controlsRef, countryLabels]);

  const isFocused = useRef(false);

  useFrame((state) => {
    if (isFocused.current) return; // Stop rotation when focused to maintain precision

    const t = state.clock.getElapsedTime();
    const rotationSpeed = 0.08;
    
    if (globeRef.current) {
      globeRef.current.rotation.y = t * rotationSpeed;
    }

    if (labelsGroupRef.current) {
      labelsGroupRef.current.rotation.y = t * rotationSpeed;
    }

    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y = t * rotationSpeed;
    }
  });

  const handleCountryClick = useCallback((country: any) => {
    if (!setFocusTarget || !labelsGroupRef.current) return;
    
    isFocused.current = true;
    
    const worldPos = new THREE.Vector3();
    const localPos = country.position.clone();
    labelsGroupRef.current.localToWorld(localPos);
    worldPos.copy(localPos);
    
    // Calculate a camera position that is looking at the country
    // Offset along the normal from the globe surface
    const globeWorldPos = new THREE.Vector3();
    groupRef.current?.getWorldPosition(globeWorldPos);
    
    const direction = worldPos.clone().sub(globeWorldPos).normalize();
    const cameraPos = worldPos.clone().add(direction.multiplyScalar(2.2));
    
    setFocusTarget({
      position: cameraPos,
      target: worldPos
    });
  }, [setFocusTarget]);

  useEffect(() => {
    if (detail !== 'high') return;
    
    const handleVoiceCommand = (e: any) => {
      const command = (e.detail || '').toLowerCase().trim();
      if (command.includes('zoom') || command.includes('show') || command.includes('find')) {
        const country = countryLabels.find(c => command.includes(c.name.toLowerCase()));
        if (country) {
          handleCountryClick(country);
        }
      } else if (command.includes('reset') || command.includes('center') || command.includes('full globe') || command.includes('back')) {
        isFocused.current = false;
        if (setFocusTarget) setFocusTarget(null);
      }
    };
    
    window.addEventListener('app-voice-transcript', handleVoiceCommand);
    return () => window.removeEventListener('app-voice-transcript', handleVoiceCommand);
  }, [countryLabels, handleCountryClick, detail, setFocusTarget]);

  return (
    <group ref={groupRef} scale={1.8} {...props}>
      {/* Main Globe */}
      <mesh 
        ref={globeRef} 
        castShadow 
        receiveShadow
        onPointerOut={() => { hoveredCountry.current = null; }}
      >
        <sphereGeometry args={[1.5, detail === 'low' ? 32 : 256, detail === 'low' ? 32 : 256]} />
        <meshStandardMaterial 
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.12}
          roughness={0.3}
          metalness={0.05}
          emissive="#000e22"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Separate group for labels that rotates with the globe but uses Billboard */}
      <group ref={labelsGroupRef}>
        {countryLabels.map((country, idx) => (
          <group 
            key={idx} 
            position={country.position}
            onPointerOver={(e) => {
              e.stopPropagation();
              hoveredCountry.current = country.name;
              document.body.style.cursor = 'pointer';
              setHoveredCountryState(country.name);
            }}
            onPointerOut={() => {
              hoveredCountry.current = null;
              document.body.style.cursor = 'auto';
              setHoveredCountryState(null);
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleCountryClick(country);
            }}
          >
            <Billboard>
              <Text
                fontSize={0.04}
                color={hoveredCountry.current === country.name ? "#ffffff" : "#00ffff"}
                anchorX="center"
                anchorY="middle"
                font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
                outlineWidth={0.003}
                outlineColor="#000000"
                fillOpacity={0.95}
              >
                {country.name}
              </Text>
            </Billboard>
            {hoveredCountryState === country.name && (
              <Html center position={[0, 0, 0]}>
                <div className="bg-zinc-900/95 border border-white/10 text-white p-3 rounded-xl text-[10px] pointer-events-none whitespace-normal w-48 shadow-2xl z-50 backdrop-blur-md">
                   <div className="flex flex-col gap-1">
                     <strong className="uppercase tracking-widest text-[8px] mb-1 text-cyan-400">Geographic Analysis</strong>
                     <span className="font-bold text-white text-xs">{country.name}</span>
                     <p className="text-zinc-400 leading-relaxed font-medium">
                       {GEOGRAPHIC_DETAILS[country.name] || "Detailed geographic and geopolitical overview of the selected region."}
                     </p>
                   </div>
                </div>
              </Html>
            )}
            {/* Small glowing dot for location */}
            <mesh position={[0, 0, -0.01]}>
              <sphereGeometry args={[0.008, 8, 8]} />
              <meshBasicMaterial color={hoveredCountry.current === country.name ? "#ffffff" : "#00ffff"} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Atmosphere / Clouds Layer */}
      {!isAR && (
        <mesh ref={atmosphereRef}>
          <sphereGeometry args={[1.52, detail === 'low' ? 32 : 256, detail === 'low' ? 32 : 256]} />
          <meshPhongMaterial 
            color="#88ccff"
            transparent
            opacity={0.05}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Outer Glow */}
      {!isAR && (
        <mesh>
          <sphereGeometry args={[1.65, detail === 'low' ? 32 : 256, detail === 'low' ? 32 : 256]} />
          <meshBasicMaterial 
            color="#00ffff" 
            transparent 
            opacity={0.03} 
            side={THREE.BackSide} 
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}


    </group>
  );
}

