import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Tube, Html, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

const DNA_DETAILS: Record<string, string> = {
  "Sugar-Phosphate Backbone": "The structural framework of nucleic acids, composed of alternating sugar and phosphate groups joined by phosphodiester bonds.",
  "5' → 3' Strand": "The leading strand of DNA, synthesized continuously in the 5' to 3' direction toward the replication fork.",
  "3' → 5' Strand": "The lagging strand of DNA, synthesized discontinuously in the 5' to 3' direction, away from the replication fork.",
  "Adenine (A)": "A purine base that pairs uniquely with Thymine in DNA, forming two hydrogen bonds.",
  "Thymine (T)": "A pyrimidine base that pairs uniquely with Adenine in DNA, forming two hydrogen bonds.",
  "Guanine (G)": "A purine base that pairs uniquely with Cytosine in DNA, forming three hydrogen bonds.",
  "Cytosine (C)": "A pyrimidine base that pairs uniquely with Guanine in DNA, forming three hydrogen bonds.",
  "Hydrogen Bonds": "Weak electrostatic attractions between slightly positive hydrogen atoms and slightly negative atoms (like nitrogen or oxygen) in base pairs.",
  "Base Pair": "A duo of complementary nitrogenous bases in a DNA molecule, forming the steps of the 'twisted ladder'."
};

function Hoverable({ name, description, children, color = "#ff00ff" }: { name: string, description: string, children: React.ReactNode, color?: string }) {
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
             <strong className="uppercase tracking-widest text-[8px] mb-1" style={{ color }}>Molecular Biology</strong>
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
  const labelName = name || textContent.split(' → ').shift() || "DNA Component";
  const labelDesc = description || DNA_DETAILS[textContent] || DNA_DETAILS[Object.keys(DNA_DETAILS).find(k => textContent.includes(k)) || ""] || "Detailed molecular characteristic of the DNA double helix.";

  return (
    <Html {...props}>
      <Hoverable name={labelName} description={labelDesc} color={color}>
        {children}
      </Hoverable>
    </Html>
  );
}

export function DNAModel({ showLabels, isMobile, setFocusTarget, ...props }: { showLabels?: boolean, isMobile?: boolean, setFocusTarget?: (target: { position: THREE.Vector3, target: THREE.Vector3 } | null) => void }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  const { points1, points2, basePairs, height } = useMemo(() => {
    const p1 = [];
    const p2 = [];
    const pairs = [];
    const count = isMobile ? 12 : 20; // Number of base pairs
    const radius = 2.5; // Radius of the helix
    const height = 18; // Total height of the helix
    const turns = 3; // Number of turns in the helix
    
    for (let i = 0; i <= count; i++) {
      const t = i / count;
      const angle = t * Math.PI * 2 * turns;
      const y = (t - 0.5) * height;
      
      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;
      
      p1.push(new THREE.Vector3(x1, y, z1));
      p2.push(new THREE.Vector3(x2, y, z2));

      if (i < count) { // Every step, excluding the top-most to match connections
        pairs.push({
          index: i,
          start: new THREE.Vector3(x1, y, z1),
          end: new THREE.Vector3(x2, y, z2),
          angle: angle
        });
      }
    }
    
    // Add the final cap position for the path
    const lastT = 1;
    const lastY = (lastT - 0.5) * height;
    const lastAngle = lastT * Math.PI * 2 * turns;
    pairs.push({
      index: count,
      start: new THREE.Vector3(Math.cos(lastAngle) * radius, lastY, Math.sin(lastAngle) * radius),
      end: new THREE.Vector3(Math.cos(lastAngle + Math.PI) * radius, lastY, Math.sin(lastAngle + Math.PI) * radius),
      angle: lastAngle
    });
    
    const curve1 = new THREE.CatmullRomCurve3(p1);
    const curve2 = new THREE.CatmullRomCurve3(p2);
    
    return { points1: curve1, points2: curve2, basePairs: pairs, height };
  }, [isMobile]);

  const transmissionProps = {
    samples: isMobile ? 4 : 16,
    resolution: isMobile ? 256 : 1024,
    transmission: 1.0,
    roughness: 0.05,
    thickness: 3.5,
    ior: 1.5,
    chromaticAberration: 0.06,
    anisotropy: 0.1,
    distortion: 0.1,
    distortionScale: 0.3,
    temporalDistortion: 0.1,
    clearcoat: 1,
    attenuationDistance: 0.5,
    attenuationColor: '#ffffff',
    color: '#ffffff',
  };

  const tubeSegments = isMobile ? 128 : 256;
  const sphereSegments = isMobile ? 24 : 64;

  // Find exact positions for labels
  const getPair = (i: number) => basePairs[Math.min(i, basePairs.length - 1)];

  useEffect(() => {
    const handleVoiceCommand = (e: any) => {
      if (!setFocusTarget || !groupRef.current) return;
      const command = (e.detail || '').toLowerCase();
      
      if (command.includes('zoom')) {
        const labels = [
          { name: 'sugar', keywords: ['sugar', 'phosphate', 'backbone'], getPos: () => new THREE.Vector3(0, getPair(20).start.y + 2, 0) },
          { name: "5' strand", keywords: ['5 primer', '5 prime', "5'"], getPos: () => getPair(18).start },
          { name: 'cytosine', keywords: ['cytosine'], getPos: () => getPair(16).end },
          { name: 'hydrogen bonds', keywords: ['hydrogen', 'bonds'], getPos: () => new THREE.Vector3((getPair(13).start.x + getPair(13).end.x) / 2, getPair(13).start.y, (getPair(13).start.z + getPair(13).end.z) / 2) },
          { name: 'adenine', keywords: ['adenine'], getPos: () => getPair(10).start },
          { name: 'base pair', keywords: ['base pair', 'pair'], getPos: () => getPair(8).start },
          { name: 'thymine', keywords: ['thymine'], getPos: () => getPair(6).end },
          { name: 'guanine', keywords: ['guanine'], getPos: () => getPair(3).end },
          { name: "3' strand", keywords: ['3 primer', '3 prime', "3'"], getPos: () => new THREE.Vector3(0, getPair(0).start.y - 2, 0) }
        ];

        let matchedLabel = null;
        for (const label of labels) {
          if (label.keywords.some((k: string) => command.includes(k))) {
            matchedLabel = label;
            break;
          }
        }
        
        if (matchedLabel) {
          const localPos = matchedLabel.getPos().clone();
          const rotatedPos = localPos.clone();
          const currentRotation = groupRef.current ? groupRef.current.rotation.y : 0;
          rotatedPos.applyAxisAngle(new THREE.Vector3(0, 1, 0), currentRotation);
          
          const worldPos = rotatedPos.clone();
          groupRef.current.localToWorld(worldPos);

          const cameraPos = new THREE.Vector3().copy(worldPos);
          if (Math.abs(worldPos.x) < 0.1 && Math.abs(worldPos.z) < 0.1) {
             cameraPos.z += 8;
          } else {
             const outDir = new THREE.Vector3(worldPos.x, 0, worldPos.z).normalize();
             cameraPos.add(outDir.multiplyScalar(6));
             cameraPos.y += 1; 
          }
          
          setFocusTarget({
            position: cameraPos,
            target: worldPos
          });
        }
      }
    };
    
    window.addEventListener('app-voice-transcript', handleVoiceCommand);
    return () => window.removeEventListener('app-voice-transcript', handleVoiceCommand);
  }, [setFocusTarget, basePairs]);

  return (
    <group ref={groupRef} scale={0.5} {...props}>
      {/* Central Axis Rod */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, height + 2, 16]} />
        <meshStandardMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.3} 
          roughness={0.1} 
          metalness={0.5} 
          depthWrite={false} 
        />
      </mesh>

      {/* Sugar-Phosphate Backbones - Continuous Tubes */}
      <Tube args={[points1, tubeSegments, 0.5, sphereSegments, false]} castShadow receiveShadow>
         <MeshTransmissionMaterial {...transmissionProps} color="#4fd1c5" />
      </Tube>
      <Tube args={[points2, tubeSegments, 0.5, sphereSegments, false]} castShadow receiveShadow>
         <MeshTransmissionMaterial {...transmissionProps} color="#ff00ff" />
      </Tube>

      {/* Base Pairs & Nodes */}
      {basePairs.map((pair, i) => (
        <group key={i}>
          {/* Thick Grey Hydrogen Bonds */}
          <mesh 
            position={[
              (pair.start.x + pair.end.x) / 2,
              (pair.start.y + pair.end.y) / 2,
              (pair.start.z + pair.end.z) / 2
            ]}
            onUpdate={(self) => {
              const dir = new THREE.Vector3().subVectors(pair.end, pair.start).normalize();
              const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
              self.quaternion.copy(quaternion);
            }}
          >
            <cylinderGeometry args={[0.25, 0.25, pair.start.distanceTo(pair.end) * 0.95, 12]} />
            <meshStandardMaterial 
              color="#e4e4e7" 
              transparent 
              opacity={0.4} 
              roughness={0.2} 
              metalness={0.4} 
              depthWrite={false} 
            />
          </mesh>

          {/* Cyan Backbone Nodes */}
          <group position={pair.start}>
             <Sphere args={[0.65, 16, 16]}>
               <meshStandardMaterial 
                 color="#4fd1c5" 
                 emissive="#4fd1c5"
                 emissiveIntensity={0.4}
                 roughness={0.1}
                 metalness={0.5}
                 transparent
                 opacity={0.9}
               />
             </Sphere>
          </group>
          
          {/* Magenta Backbone Nodes */}
          <group position={pair.end}>
             <Sphere args={[0.65, 16, 16]}>
               <meshStandardMaterial 
                 color="#ff00ff" 
                 emissive="#ff00ff"
                 emissiveIntensity={0.4}
                 roughness={0.1}
                 metalness={0.5}
                 transparent
                 opacity={0.9}
               />
             </Sphere>
          </group>
        </group>
      ))}

      {/* Floating UI Labels */}
      {showLabels && (
        <>
          {/* Top Level Backbones */}
          <SmartHtml position={[0, getPair(20).start.y + 2, 0]} center className="pointer-events-none z-50">
            <div className="px-4 py-1.5 bg-black/80 backdrop-blur-md border border-cyan-400 rounded-lg text-xs text-cyan-300 font-mono whitespace-nowrap shadow-[0_0_10px_rgba(79,209,197,0.5)]">
              Sugar-Phosphate Backbone
            </div>
          </SmartHtml>

          {/* 5' -> 3' Strand */}
          <SmartHtml position={[getPair(18).start.x - 2, getPair(18).start.y, getPair(18).start.z]} center className="pointer-events-none z-50">
            <div className="px-3 py-1 bg-black/80 backdrop-blur-md border border-cyan-400 rounded-lg text-xs text-cyan-300 font-mono whitespace-nowrap shadow-[0_0_10px_rgba(79,209,197,0.5)]">
              5' → 3' Strand
            </div>
          </SmartHtml>

          {/* Cytosine (C) */}
          <SmartHtml position={[getPair(16).end.x + 3, getPair(16).end.y, getPair(16).end.z]} center className="pointer-events-none z-50">
            <div className="px-3 py-1 bg-black/80 backdrop-blur-md border border-purple-400 rounded-lg text-xs text-purple-300 font-mono whitespace-nowrap shadow-[0_0_10px_rgba(168,85,247,0.5)]">
              Cytosine (C)
            </div>
          </SmartHtml>

          {/* Hydrogen Bonds */}
          <SmartHtml position={[getPair(13).end.x + 4, getPair(13).start.y - 0.5, 0]} center className="pointer-events-none z-50">
            <div className="px-3 py-1 bg-black/80 backdrop-blur-md border border-white rounded-lg text-xs text-white font-mono whitespace-nowrap shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              Hydrogen Bonds
            </div>
          </SmartHtml>

          {/* Adenine (A) */}
          <SmartHtml position={[getPair(10).start.x + 3, getPair(10).start.y, getPair(10).start.z]} center className="pointer-events-none z-50">
            <div className="px-3 py-1 bg-black/80 backdrop-blur-md border border-green-400 rounded-lg text-xs text-green-300 font-mono whitespace-nowrap shadow-[0_0_10px_rgba(74,222,128,0.5)]">
              Adenine (A)
            </div>
          </SmartHtml>

          {/* Base Pair */}
          <SmartHtml position={[getPair(8).start.x + 0, getPair(8).start.y, getPair(8).start.z]} center className="pointer-events-none z-50">
            <div className="px-3 py-1 bg-black/80 backdrop-blur-md border border-yellow-400 rounded-lg text-xs text-yellow-300 font-mono whitespace-nowrap shadow-[0_0_10px_rgba(250,204,21,0.5)]">
              Base Pair
            </div>
          </SmartHtml>

          {/* Thymine (T) */}
          <SmartHtml position={[getPair(6).end.x + 3, getPair(6).end.y, getPair(6).end.z]} center className="pointer-events-none z-50">
            <div className="px-3 py-1 bg-black/80 backdrop-blur-md border border-orange-400 rounded-lg text-xs text-orange-300 font-mono whitespace-nowrap shadow-[0_0_10px_rgba(251,146,60,0.5)]">
              Thymine (T)
            </div>
          </SmartHtml>

          {/* Guanine (G) */}
          <SmartHtml position={[getPair(3).end.x + 2, getPair(3).end.y - 1, getPair(3).end.z]} center className="pointer-events-none z-50">
            <div className="px-3 py-1 bg-black/80 backdrop-blur-md border border-red-400 rounded-lg text-xs text-red-300 font-mono whitespace-nowrap shadow-[0_0_10px_rgba(248,113,113,0.5)]">
              Guanine (G)
            </div>
          </SmartHtml>

          {/* 3' -> 5' Strand */}
          <SmartHtml position={[0, getPair(0).start.y - 2, 0]} center className="pointer-events-none z-50">
            <div className="px-3 py-1 bg-black/80 backdrop-blur-md border border-fuchsia-400 rounded-lg text-xs text-fuchsia-300 font-mono whitespace-nowrap shadow-[0_0_10px_rgba(232,121,249,0.5)]">
              3' → 5' Strand
            </div>
          </SmartHtml>
        </>
      )}
    </group>
  );
}

