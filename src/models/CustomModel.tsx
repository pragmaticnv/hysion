import React, { useRef, useMemo, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Torus, Text, Html, MeshTransmissionMaterial, Box, Points, PointMaterial, useGLTF, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Line, Trail } from '../components/SafeLine';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Loader2, AlertCircle } from 'lucide-react';

export interface AdvancedConfig {
  type: 'geometric' | 'organic' | 'abstract' | 'molecular' | 'astronomical' | 'neural' | 'assembly';
  shape: 'sphere' | 'cube' | 'torus' | 'cylinder' | 'icosahedron';
  primaryColor: string;
  secondaryColor: string;
  complexity: number;
  animationSpeed: number;
  particleCount: number;
  glowIntensity: number;
  wireframe: boolean;
  laserPointerEnabled?: boolean;
  prompt?: string;
  imageUrl?: string;
  glbUrl?: string;
  isRealistic?: boolean;
  elements?: Array<{
    shape: 'sphere' | 'box' | 'torus' | 'cylinder' | 'icosahedron' | 'cone';
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    color: string;
    opacity: number;
    wireframe: boolean;
    metalness?: number;
    roughness?: number;
    emissiveIntensity?: number;
  }>;
  particles?: {
    count: number;
    color: string;
    size: number;
    type: 'points' | 'stars' | 'neural';
  };
  source?: string;
  author?: string;
}

interface CustomModelProps extends AdvancedConfig {
  showLabels?: boolean;
}

function HologramGLTF({ url, color, isRealistic }: { url: string, color: string, isRealistic?: boolean }) {
  const { scene } = useGLTF(url);
  
  // Clone the scene to avoid mutating the cached object
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    if (!isRealistic) {
      clone.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.material = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 1.5,
            wireframe: false,
            transparent: true,
            opacity: 0.8,
          });
        }
      });
    }
    return clone;
  }, [scene, color, isRealistic]);

  return (
    <group>
      <primitive object={clonedScene} scale={3} position={[0, 0, 0]} />
    </group>
  );
}

function HologramImage({ url, color }: { url: string, color: string }) {
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return loader.load(url);
  }, [url]);

  return (
    <group>
      {/* Front facing plane */}
      <mesh>
        <planeGeometry args={[6, 6]} />
        <meshBasicMaterial 
          map={texture} 
          transparent 
          blending={THREE.AdditiveBlending} 
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Intersecting plane for 3D effect */}
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshBasicMaterial 
          map={texture} 
          transparent 
          blending={THREE.AdditiveBlending} 
          depthWrite={false}
          side={THREE.DoubleSide}
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}

export function CustomModel({ 
  type, 
  shape = 'torus',
  primaryColor, 
  secondaryColor, 
  complexity, 
  animationSpeed, 
  particleCount, 
  glowIntensity, 
  wireframe, 
  showLabels, 
  prompt,
  imageUrl,
  glbUrl,
  isRealistic,
  ...props
}: CustomModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1 * animationSpeed;
      groupRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.2 * animationSpeed) * 0.1;
    }
  });

  const techTexture = useMemo(() => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Dark background for transparency contrast
      ctx.fillStyle = 'rgba(0,0,0,0)';
      ctx.fillRect(0, 0, size, size);
      
      // Set grid style using primary color
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.5;
      
      // Draw grid lines
      ctx.beginPath();
      for (let i = 0; i <= size; i += 64) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, size);
        ctx.moveTo(0, i);
        ctx.lineTo(size, i);
      }
      ctx.stroke();
      
      // Draw tech dots at intersections
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = primaryColor;
      for (let i = 0; i <= size; i += 64) {
        for (let j = 0; j <= size; j += 64) {
          ctx.beginPath();
          ctx.arc(i, j, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Add a secondary thinner grid for complexity
      ctx.globalAlpha = 0.2;
      ctx.beginPath();
      for (let i = 0; i <= size; i += 16) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, size);
        ctx.moveTo(0, i);
        ctx.lineTo(size, i);
      }
      ctx.stroke();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    return texture;
  }, [primaryColor]);

  const transmissionProps = {
    samples: 16,
    resolution: 512,
    transmission: 1,
    roughness: 0.05,
    thickness: 0.5,
    ior: 1.6,
    chromaticAberration: 0.01,
    anisotropy: 0.2,
    distortion: 0.05,
    distortionScale: 0.1,
    temporalDistortion: 0.05,
  };

  const renderShape = (s: string, args: any[], props: any) => {
    switch (s) {
      case 'box':
      case 'cube': return <Box args={args} {...props} />;
      case 'sphere': return <Sphere args={[args[0], 32, 32]} {...props} />;
      case 'cylinder': return <Cylinder args={[args[0], args[0], args[0] * 2, 32]} {...props} />;
      case 'cone': return <mesh {...props}><coneGeometry args={[args[0], args[0] * 2, 32]} /></mesh>;
      case 'icosahedron': return <mesh {...props}><icosahedronGeometry args={[args[0], 0]} /></mesh>;
      case 'torus': default: return <Torus args={[args[0], args[0] * 0.3, 16, 100]} {...props} />;
    }
  };

  const geometricElements = useMemo(() => {
    if (type !== 'geometric') return null;
    return [...Array(complexity)].map((_, i) => (
      <group key={i} rotation={[i * 0.5, i * 0.8, 0]}>
        {renderShape(shape, [2 + i * 0.5], {
          castShadow: true,
          receiveShadow: true,
          children: <meshStandardMaterial 
            color={primaryColor} 
            emissive={primaryColor} 
            emissiveIntensity={glowIntensity} 
            toneMapped={false} 
            wireframe={wireframe} 
            map={techTexture}
            emissiveMap={techTexture}
            transparent={true}
            opacity={0.8}
          />
        })}
        <Sphere args={[0.15, 32, 32]} position={[2 + i * 0.5, 0, 0]} castShadow receiveShadow>
          <MeshTransmissionMaterial {...transmissionProps} color={secondaryColor} />
        </Sphere>
      </group>
    ));
  }, [type, complexity, primaryColor, secondaryColor, glowIntensity, wireframe, shape]);

  const organicElements = useMemo(() => {
    if (type !== 'organic') return null;
    return (
      <group>
        {[...Array(complexity * 3)].map((_, i) => {
          const scale = Math.random() * 0.5 + 0.2;
          return (
            <Sphere 
              key={i} 
              args={[scale, 32, 32]} 
              position={[
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 4
              ]}
              castShadow
              receiveShadow
            >
              <MeshTransmissionMaterial 
                {...transmissionProps} 
                color={primaryColor} 
                distortion={0.5}
                distortionScale={0.5}
                temporalDistortion={0.2}
                wireframe={wireframe}
              />
            </Sphere>
          );
        })}
        {/* Central Core */}
        <Sphere args={[1.5, 64, 64]}>
          <meshStandardMaterial 
            color={secondaryColor} 
            wireframe={wireframe} 
            transparent 
            opacity={0.3} 
            emissive={secondaryColor} 
            emissiveIntensity={glowIntensity} 
            map={techTexture}
          />
        </Sphere>
      </group>
    );
  }, [type, complexity, primaryColor, secondaryColor, glowIntensity, wireframe]);

  const abstractElements = useMemo(() => {
    if (type !== 'abstract') return null;
    return (
      <group>
        {[...Array(complexity * 4)].map((_, i) => {
          const s = Math.random() * 0.5 + 0.1;
          return (
            <group
              key={i}
              position={[
                (Math.random() - 0.5) * 6,
                (Math.random() - 0.5) * 6,
                (Math.random() - 0.5) * 6
              ]}
              rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
            >
              {renderShape(shape === 'torus' ? 'cube' : shape, [s, s, s * 4], {
                castShadow: true,
                receiveShadow: true,
                children: <meshStandardMaterial 
                  color={primaryColor} 
                  emissive={primaryColor} 
                  emissiveIntensity={glowIntensity} 
                  toneMapped={false} 
                  wireframe={wireframe} 
                  map={techTexture}
                  emissiveMap={techTexture}
                />
              })}
            </group>
          );
        })}
        {/* Floating Glass Panels */}
        {[...Array(3)].map((_, i) => (
           <Box 
            key={`glass-${i}`}
            args={[4, 4, 0.05]} 
            rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
          >
            <MeshTransmissionMaterial {...transmissionProps} color={secondaryColor} roughness={0} wireframe={wireframe} />
          </Box>
        ))}
      </group>
    );
  }, [type, complexity, primaryColor, secondaryColor, glowIntensity, wireframe, shape]);

  const molecularElements = useMemo(() => {
    if (type !== 'molecular') return null;
    const atoms = [];
    const bonds = [];
    for (let i = 0; i < complexity * 2; i++) {
      atoms.push(new THREE.Vector3(
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5
      ));
    }
    for (let i = 0; i < atoms.length; i++) {
      for (let j = i + 1; j < atoms.length; j++) {
        if (atoms[i].distanceTo(atoms[j]) < 2.5) {
          bonds.push({ start: atoms[i], end: atoms[j] });
        }
      }
    }
    return (
      <group>
        {atoms.map((pos, i) => (
          <Sphere key={i} args={[0.3, 16, 16]} position={pos}>
            <meshStandardMaterial color={i % 2 === 0 ? primaryColor : secondaryColor} emissive={i % 2 === 0 ? primaryColor : secondaryColor} emissiveIntensity={glowIntensity * 0.5} wireframe={wireframe} />
          </Sphere>
        ))}
        {bonds.map((bond, i) => {
          const distance = bond.start.distanceTo(bond.end);
          const midpoint = new THREE.Vector3().addVectors(bond.start, bond.end).multiplyScalar(0.5);
          const dir = new THREE.Vector3().subVectors(bond.end, bond.start).normalize();
          const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
          return (
            <mesh 
              key={`bond-${i}`}
              position={midpoint}
              quaternion={quaternion}
            >
              <cylinderGeometry args={[0.05, 0.05, distance, 8]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.5} wireframe={wireframe} />
            </mesh>
          );
        })}
      </group>
    );
  }, [type, complexity, primaryColor, secondaryColor, glowIntensity, wireframe]);

  const astronomicalElements = useMemo(() => {
    if (type !== 'astronomical') return null;
    return (
      <group>
        {/* Central Star */}
        <Sphere args={[1.5, 32, 32]}>
          <meshBasicMaterial color={primaryColor} />
          <pointLight color={primaryColor} intensity={glowIntensity * 2} distance={20} />
        </Sphere>
        {/* Orbital Rings */}
        {[...Array(complexity)].map((_, i) => (
          <Torus key={i} args={[2.5 + i * 1.2, 0.01, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
            <meshBasicMaterial color={secondaryColor} transparent opacity={0.3} />
          </Torus>
        ))}
        {/* Planets */}
        {[...Array(complexity)].map((_, i) => {
          const radius = 2.5 + i * 1.2;
          const angle = Math.random() * Math.PI * 2;
          return (
            <Sphere key={`planet-${i}`} args={[0.2 + Math.random() * 0.3, 16, 16]} position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}>
              <meshStandardMaterial color={secondaryColor} roughness={0.8} wireframe={wireframe} />
            </Sphere>
          );
        })}
      </group>
    );
  }, [type, complexity, primaryColor, secondaryColor, glowIntensity, wireframe]);

  const neuralElements = useMemo(() => {
    if (type !== 'neural') return null;
    const points = [];
    for (let i = 0; i < particleCount; i++) {
      points.push(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      );
    }
    return (
      <group>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={points.length / 3}
              array={new Float32Array(points)}
              itemSize={3}
            />
          </bufferGeometry>
          <PointMaterial
            transparent
            color={primaryColor}
            size={0.1}
            sizeAttenuation={true}
            depthWrite={false}
            opacity={0.8}
            toneMapped={false}
          />
        </points>
        {/* Central glowing mass */}
        <Sphere args={[2, 32, 32]}>
          <MeshTransmissionMaterial {...transmissionProps} color={secondaryColor} wireframe={wireframe} />
        </Sphere>
      </group>
    );
  }, [type, particleCount, primaryColor, secondaryColor, wireframe]);

  const assemblyElements = useMemo(() => {
    if (type !== 'assembly' || !props.elements) return null;
    return (
      <group>
        <Environment preset="studio" />
        <ambientLight intensity={0.5} />
        <directionalLight castShadow position={[5, 10, 5]} intensity={1.5} shadow-mapSize={[2048, 2048]} />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} color={secondaryColor} />
        <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.5} far={10} color="#000000" position={[0, -2.5, 0]} />
        {props.elements.map((el, i) => (
          <group 
            key={i} 
            position={el.position} 
            rotation={el.rotation} 
            scale={el.scale}
          >
            {renderShape(el.shape === 'box' ? 'cube' : el.shape, [1], {
              castShadow: true,
              receiveShadow: true,
              children: (
                <meshStandardMaterial 
                  color={el.color} 
                  emissive={el.color} 
                  emissiveIntensity={(el.emissiveIntensity ?? 1) * glowIntensity} 
                  metalness={el.metalness ?? 0.5}
                  roughness={el.roughness ?? 0.5}
                  envMapIntensity={2.5}
                  transparent={el.opacity < 1} 
                  opacity={el.opacity} 
                  wireframe={el.wireframe} 
                />
              )
            })}
          </group>
        ))}
        {props.particles && (
          <points>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={props.particles.count}
                array={new Float32Array([...Array(props.particles.count * 3)].map(() => (Math.random() - 0.5) * 10))}
                itemSize={3}
              />
            </bufferGeometry>
            <PointMaterial
              transparent
              color={props.particles.color}
              size={props.particles.size}
              sizeAttenuation={true}
              depthWrite={false}
              opacity={0.6}
              toneMapped={false}
            />
          </points>
        )}
      </group>
    );
  }, [type, props.elements, props.particles, glowIntensity]);

  return (
    <group ref={groupRef} scale={0.8}>
      {showLabels && (
        <Html position={[0, 4, 0]} center className="pointer-events-none">
          <div className="px-3 py-1 bg-black/80 backdrop-blur-md border border-white/10 rounded-full text-[10px] text-white font-mono whitespace-nowrap shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            AI CONSTRUCT: {type.toUpperCase()}
          </div>
        </Html>
      )}
      
      {glbUrl ? (
        <ErrorBoundary fallback={
          <group>
            <Sphere args={[2, 32, 32]}>
              <meshStandardMaterial color={primaryColor} wireframe transparent opacity={0.3} emissive={primaryColor} />
            </Sphere>
            <Html center>
              <div className="flex flex-col items-center gap-2 bg-black/80 p-4 rounded-2xl border border-red-500/30 backdrop-blur-md">
                <AlertCircle className="text-red-500" size={24} />
                <p className="text-white text-xs font-bold uppercase tracking-widest whitespace-nowrap">Source Unreachable (404)</p>
                <p className="text-zinc-500 text-[10px] text-center max-w-[150px]">Try another result from the model search panel.</p>
              </div>
            </Html>
          </group>
        }>
          <Suspense fallback={
            <Html center>
              <div className="flex flex-col items-center gap-3">
                <Loader2 className={`text-${primaryColor} animate-spin`} size={32} />
                <span className="text-white text-[10px] font-bold uppercase tracking-widest animate-pulse">Syncing 3D Data...</span>
              </div>
            </Html>
          }>
            <HologramGLTF url={glbUrl} color={primaryColor} isRealistic={isRealistic} />
          </Suspense>
        </ErrorBoundary>
      ) : imageUrl ? (
        <HologramImage url={imageUrl} color={primaryColor} />
      ) : (
        <>
          {type === 'geometric' && (
            <group>
              <Sphere args={[1, 4, 2]} castShadow receiveShadow>
                 <meshStandardMaterial 
                   color={primaryColor} 
                   wireframe 
                   map={techTexture}
                   emissive={primaryColor}
                   emissiveIntensity={0.5}
                 />
              </Sphere>
              {geometricElements}
            </group>
          )}

          {type === 'organic' && organicElements}
          {type === 'abstract' && abstractElements}
          {type === 'molecular' && molecularElements}
          {type === 'astronomical' && astronomicalElements}
          {type === 'neural' && neuralElements}
          {type === 'assembly' && assemblyElements}
        </>
      )}


    </group>
  );
}
