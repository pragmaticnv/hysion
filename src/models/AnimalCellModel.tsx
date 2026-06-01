import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Torus, Html, Sparkles, Cylinder, Tube, Box, Float } from '@react-three/drei';
import * as THREE from 'three';

const CELL_DETAILS: Record<string, string> = {
  "Cytosol": "The aqueous component of the cytoplasm of a cell, within which various organelles and particles are suspended.",
  "Nucleus": "The double-membrane-bound organelle that contains the genetic material (DNA) and serves as the cell's control center.",
  "Nucleolus": "A dense structure within the nucleus responsible for producing and assembling the cell's ribosomes.",
  "Mitochondrion": "Known as the powerhouse of the cell, it generates most of the cell's supply of adenosine triphosphate (ATP) through cellular respiration.",
  "Rough ER": "A network of membrane-bound sacs and tubules studded with ribosomes, active in protein synthesis and folding.",
  "Smooth ER": "A network of tubules involved in the synthesis of lipids, metabolism of carbohydrates, and detoxification of drugs and poisons.",
  "Golgi Complex": "A stack of flattened membranes that modifies, sorts, and packages proteins and lipids for secretion or delivery to other organelles.",
  "Lysosome (Digestive)": "A membrane-bound organelle containing digestive enzymes that break down waste materials and cellular debris.",
  "Peroxisome": "Small, membrane-bound organelles that contain enzymes involved in metabolic reactions, including the breakdown of fatty acids.",
  "Vacuole": "A membrane-bound sac within the cytoplasm of a cell, involved in storage, ingestion, digestion, excretion, and expulsion of excess water.",
  "Centrosome / Centrioles": "Structures that organize microtubules and help in cell division (mitosis) by forming spindle fibers."
};

function Hoverable({ name, description, children, color = "#60a5fa" }: { name: string, description: string, children: React.ReactNode, color?: string }) {
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
           <div className="flex flex-col gap-1 text-left">
             <strong className="uppercase tracking-widest text-[8px] mb-1" style={{ color }}>Cellular Anatomy</strong>
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
  const labelDesc = description || CELL_DETAILS[textContent] || CELL_DETAILS[Object.keys(CELL_DETAILS).find(k => textContent.includes(k)) || ""] || "Detailed organelle characteristic of the animal cell.";

  return (
    <Html {...props}>
      <Hoverable name={labelName} description={labelDesc} color={color}>
        {children}
      </Hoverable>
    </Html>
  );
}

interface AnimalCellModelProps {
  showLabels?: boolean;
}

export function AnimalCellModel({ showLabels = true }: AnimalCellModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const membraneRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.05;
      groupRef.current.rotation.z = Math.sin(time * 0.1) * 0.02;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={groupRef} rotation={[0.5, -0.5, 0]} scale={1.2}>
        {/* Cell Membrane (Translucent Bilayer Idea) */}
        <group>
          {/* Outer Membrane Hemisphere */}
          <Sphere ref={membraneRef} args={[4, 64, 64, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]}>
            <meshPhysicalMaterial 
              color="#60a5fa" 
              transmission={0.6}
              thickness={1.5}
              roughness={0.1} 
              metalness={0.05}
              clearcoat={0.8}
              ior={1.33}
              side={THREE.DoubleSide}
              transparent
            />
          </Sphere>
          
          {/* Inner Cytoplasm Jelly Surface */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <circleGeometry args={[3.98, 64]} />
            <meshPhysicalMaterial 
              color="#1e40af" 
              roughness={0.4} 
              metalness={0.1}
              transmission={0.3}
              transparent
              opacity={0.8}
            />
          </mesh>

          {/* Membrane Rim Edge */}
          <Torus args={[3.98, 0.04, 16, 128]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#93c5fd" emissive="#93c5fd" emissiveIntensity={0.5} />
          </Torus>
        </group>



        {/* Free Ribosomes (Dots scattered in cytoplasm) */}
        <group>
          {Array.from({ length: 200 }).map((_, i) => (
            <Sphere key={`free-ribo-${i}`} args={[0.02, 6, 6]} position={[
              (Math.random() - 0.5) * 7,
              (Math.random() - 0.5) * 6,
              (Math.random() - 0.5) * 7
            ]}>
              <meshStandardMaterial color="#ef4444" opacity={0.6} transparent />
            </Sphere>
          ))}
        </group>

        {/* Cytoplasm Particles (Organic floaties) */}
        <Sparkles count={300} scale={7.5} size={2} speed={0.5} opacity={0.4} color="#bae6fd" position={[0, 0, 0]} />
        {showLabels && (
          <SmartHtml position={[3.5, 3.5, 0]} distanceFactor={8}>
             <div className="px-3 py-1.5 bg-slate-900/80 backdrop-blur-md border-r-4 border-blue-400 text-blue-200 rounded-l-lg shadow-xl">
               <div className="text-[10px] font-black uppercase tracking-widest">Cytosol</div>
               <div className="text-[7px] font-mono text-blue-200/50 uppercase mt-0.5">Metabolic Matrix</div>
             </div>
          </SmartHtml>
        )}

        {/* Nucleus (Detailed with Laminar Structure & Pores) */}
        <group position={[0, 0.4, -0.6]} rotation={[0.2, 0.4, 0]}>
          {/* Nucleus Outer Envelope with Simulated Pores */}
          <group>
            <Sphere args={[1.5, 64, 64, 0, Math.PI * 1.5, 0, Math.PI]}>
              <meshPhysicalMaterial 
                color="#4c1d95" 
                roughness={0.4}
                metalness={0.2}
                side={THREE.DoubleSide}
                clearcoat={1.0}
                clearcoatRoughness={0.1}
                transmission={0.2}
                thickness={0.5}
              />
            </Sphere>
            {/* Visual Pores */}
            {Array.from({ length: 40 }).map((_, i) => {
              const phi = Math.acos(-1 + (2 * i) / 40);
              const theta = Math.sqrt(40 * Math.PI) * phi;
              if (theta > (Math.PI * 1.5)) return null;
              return (
                <mesh key={`pore-${i}`} position={[
                  1.51 * Math.sin(phi) * Math.cos(theta),
                  1.51 * Math.cos(phi),
                  1.51 * Math.sin(phi) * Math.sin(theta)
                ]}>
                  <Sphere args={[0.04, 8, 8]}>
                    <meshBasicMaterial color="#1e1b4b" />
                  </Sphere>
                </mesh>
              );
            })}
          </group>
          
          {/* Nucleoplasm Slice Surface */}
          <group>
             <mesh rotation={[0, -Math.PI / 2, 0]}>
                <circleGeometry args={[1.49, 48, 0, Math.PI]} />
                <meshPhysicalMaterial color="#5b21b6" roughness={0.6} transmission={0.1} thickness={1} />
             </mesh>
             <mesh rotation={[Math.PI / 2, 0, 0]}>
                <circleGeometry args={[1.49, 48, 0, Math.PI / 2]} />
                <meshPhysicalMaterial color="#5b21b6" roughness={0.6} transmission={0.1} thickness={1} />
             </mesh>
          </group>

          {/* Nucleolus (Dense spherical core with inner glow) */}
          <group position={[0.2, 0, 0.2]}>
            <Sphere args={[0.65, 32, 32]}>
               <meshPhysicalMaterial color="#be185d" roughness={0.2} emissive="#db2777" emissiveIntensity={0.5} metalness={0.1} transmission={0.4} thickness={2} />
            </Sphere>
            <pointLight intensity={2} color="#f472b6" distance={2} />
            {showLabels && (
               <SmartHtml position={[0, 0.8, 0]} distanceFactor={8}>
                 <div className="flex flex-col items-center group pointer-events-none">
                    <div className="w-px h-8 bg-gradient-to-t from-pink-500/80 to-transparent" />
                    <div className="px-3 py-1.5 bg-slate-900/90 backdrop-blur-xl border-l-4 border-pink-500 rounded-r-lg shadow-2xl min-w-[120px]">
                       <div className="text-[10px] font-black text-pink-400 tracking-tighter uppercase mb-0.5">Nucleolus</div>
                       <div className="text-[8px] text-pink-200/60 font-mono leading-none lowercase">Ribosome production center</div>
                    </div>
                 </div>
               </SmartHtml>
            )}
          </group>

          {/* Chromatin - Fibers inside nucleus */}
          {Array.from({ length: 12 }).map((_, i) => (
            <Torus key={`chrom-${i}`} args={[0.8 + Math.random() * 0.4, 0.005, 8, 48]} position={[0, 0, 0]} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]}>
               <meshStandardMaterial color="#c084fc" transparent opacity={0.4} />
            </Torus>
          ))}

          {showLabels && (
            <SmartHtml position={[0, 2.4, 0]} distanceFactor={8}>
               <div className="flex flex-col items-center group pointer-events-none">
                  <div className="px-5 py-3 bg-slate-900/95 backdrop-blur-2xl border-t-2 border-purple-500 rounded-xl shadow-[0_0_50px_rgba(168,85,247,0.3)] flex flex-col items-center">
                    <div className="text-[11px] font-black text-purple-200 tracking-[0.2em] uppercase mb-1 flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                       Nucleus
                    </div>
                    <div className="text-[9px] text-zinc-400 font-mono uppercase border-t border-purple-500/20 pt-1.5 mt-0.5 w-full text-center">
                       Genetic Information Vault
                    </div>
                  </div>
                  <div className="w-px h-12 bg-gradient-to-b from-purple-500/80 to-transparent" />
               </div>
            </SmartHtml>
          )}
        </group>

        {/* Mitochondria - Ultra-Detail Cristae */}
        {[
          { pos: [2.2, 0.4, 0.8], rot: [0.3, 0.6, -0.2], scale: 1.1 },
          { pos: [-2.4, 0.6, 1.2], rot: [0.6, -1.0, 0.4], scale: 0.9 },
          { pos: [-1.8, 0.2, -2.2], rot: [-0.4, 1.4, 0.2], scale: 1.0 },
          { pos: [1.6, 0.8, -2.4], rot: [1.0, 0.3, -0.6], scale: 0.8 }
        ].map((item, i) => (
          <group key={`mito-${i}`} position={item.pos as any} rotation={item.rot as any} scale={item.scale}>
            {/* Outer Membrane */}
            <mesh>
              <capsuleGeometry args={[0.45, 1.3, 16, 32]} />
              <meshPhysicalMaterial color="#c2410c" roughness={0.4} metalness={0.1} clearcoat={1.0} transmission={0.3} thickness={1} transparent opacity={0.9} />
            </mesh>
            {/* Inner Cristae (Bio-folds) */}
            <group>
              {[-0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6].map((y, j) => (
                <group key={j} position={[0, y, 0]} rotation={[0, 0, j % 2 === 0 ? 0.4 : -0.4]}>
                   <mesh>
                      <boxGeometry args={[0.65, 0.04, 0.65]} />
                      <meshStandardMaterial color="#fcd34d" emissive="#f59e0b" emissiveIntensity={0.2} />
                   </mesh>
                </group>
              ))}
            </group>
            {i === 0 && showLabels && (
              <SmartHtml position={[0, 1.6, 0]} distanceFactor={8}>
                <div className="flex flex-col items-center group pointer-events-none">
                  <div className="px-4 py-2 bg-slate-900/90 backdrop-blur-xl border-l-4 border-orange-500 rounded-r-lg shadow-2xl">
                    <div className="text-[10px] font-black text-orange-400 tracking-widest uppercase mb-0.5">Mitochondrion</div>
                    <div className="text-[8px] text-orange-200/70 font-mono italic">ATP Production Hub</div>
                  </div>
                  <div className="w-px h-6 bg-gradient-to-b from-orange-500 to-transparent" />
                </div>
              </SmartHtml>
            )}
          </group>
        ))}

        {/* Endoplasmic Reticulum (Rough & Smooth) */}
        <group position={[0, 0.2, -0.6]}>
          {/* Rough ER (Detailed Folds with Ribosomes) */}
          <group>
            {[1.8, 2.2, 2.6].map((radius, i) => (
              <mesh key={`rer-${i}`} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.3 + i * 0.15, 0]}>
                <torusGeometry args={[radius, 0.18, 32, 128, Math.PI * 1.3]} />
                <meshPhysicalMaterial 
                  color="#2563eb" 
                  roughness={0.8} 
                  metalness={0.05} 
                  transmission={0.1}
                  thickness={0.5}
                />
              </mesh>
            ))}
            {/* Denser attached ribosomes */}
            <group position={[0, 0.1, 0]}>
               {Array.from({ length: 120 }).map((_, i) => (
                 <Sphere key={`ribo-${i}`} args={[0.035, 12, 12]} position={[
                    (1.7 + Math.random() * 1) * Math.cos(i * 0.1),
                    (Math.random() - 0.5) * 0.4,
                    (1.7 + Math.random() * 1) * Math.sin(i * 0.1)
                 ]}>
                    <meshStandardMaterial color="#b91c1c" emissive="#7f1d1d" emissiveIntensity={0.2} />
                 </Sphere>
               ))}
            </group>
            {showLabels && (
               <SmartHtml position={[-3.2, 0.3, 0]} distanceFactor={8}>
                 <div className="flex items-center group pointer-events-none">
                    <div className="px-3 py-1.5 bg-slate-900/90 backdrop-blur-xl border-l-4 border-blue-500 rounded-r-lg shadow-2xl">
                       <div className="text-[10px] font-black text-blue-400 tracking-tighter uppercase mb-0.5">Rough ER</div>
                       <div className="text-[8px] text-blue-200/60 font-mono tracking-tight">Active Protein Synthesis</div>
                    </div>
                    <div className="w-8 h-px bg-gradient-to-r from-blue-500/80 to-transparent" />
                 </div>
               </SmartHtml>
            )}
          </group>

          {/* Smooth ER (Bio-Tubular structure with Bio-Flow) */}
          <group position={[-2.5, 0.2, -1.8]} rotation={[0.4, 0.8, 0]}>
            {Array.from({ length: 6 }).map((_, i) => {
              const points = [];
              for (let j = 0; j < 10; j++) {
                points.push(new THREE.Vector3(
                  Math.sin(j * 0.5 + i) * 0.3,
                  j * 0.15,
                  Math.cos(j * 0.5 + i) * 0.3
                ));
              }
              const curve = new THREE.CatmullRomCurve3(points);
              return (
                <mesh key={`ser-tube-${i}`} position={[i * 0.2, 0, 0]}>
                  <tubeGeometry args={[curve, 20, 0.1, 8, false]} />
                  <meshPhysicalMaterial color="#60a5fa" roughness={0.2} metalness={0.1} transmission={0.3} thickness={1} />
                </mesh>
              );
            })}
            {showLabels && (
              <SmartHtml position={[0, 1.8, 0]} distanceFactor={8}>
                 <div className="flex flex-col items-center group pointer-events-none">
                    <div className="px-3 py-1.5 bg-slate-900/90 backdrop-blur-xl border-b-4 border-sky-400 rounded-t-lg shadow-2xl">
                       <div className="text-[10px] font-black text-sky-400 tracking-tighter uppercase">Smooth ER</div>
                       <div className="text-[8px] text-sky-200/60 font-mono text-center">Lipid Synthesis & Detox</div>
                    </div>
                    <div className="w-px h-6 bg-gradient-to-t from-sky-400 to-transparent" />
                 </div>
              </SmartHtml>
            )}
          </group>
        </group>

        {/* Golgi Apparatus (High-Definition Secretory Hub) */}
        <group position={[2.6, 0.5, -1.4]} rotation={[0.1, -0.8, -0.1]}>
          {[-0.5, -0.25, 0, 0.25, 0.5].map((z, i) => (
            <mesh key={`golgi-${i}`} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
              <capsuleGeometry args={[0.13, 2.0 - Math.abs(z) * 2.5, 20, 40]} />
              <meshPhysicalMaterial 
                color="#15803d" 
                roughness={0.3} 
                metalness={0.05} 
                clearcoat={1.0}
                transmission={0.25}
                thickness={2}
              />
            </mesh>
          ))}
          {/* Active Secretory Vesicles (Floating and budding) */}
          {Array.from({ length: 10 }).map((_, i) => (
            <group key={`ves-group-${i}`} position={[
                1.5 + Math.random() * 1.5, 
                (Math.random() - 0.5) * 1.5, 
                (Math.random() - 0.5) * 2.5
            ]}>
              <Sphere args={[0.18 + Math.random() * 0.1, 20, 20]}>
                <meshPhysicalMaterial 
                   color="#4ade80" 
                   transmission={0.7} 
                   thickness={1} 
                   transparent 
                   roughness={0.1}
                   metalness={0.05}
                />
              </Sphere>
              <pointLight intensity={0.5} color="#4ade80" distance={1} />
            </group>
          ))}
          {showLabels && (
            <SmartHtml position={[0, 1.8, 0]} distanceFactor={8}>
              <div className="flex flex-col items-center group pointer-events-none">
                <div className="px-5 py-2.5 bg-slate-900/95 backdrop-blur-2xl border-l-4 border-green-500 rounded-r-xl shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                  <div className="text-[11px] font-black text-green-400 tracking-[0.2em] uppercase mb-0.5">Golgi Complex</div>
                  <div className="text-[8px] text-green-200/60 font-mono tracking-tight border-t border-green-500/20 pt-1 mt-1">Chemical Processing & Logistics</div>
                </div>
                <div className="w-px h-10 bg-gradient-to-b from-green-500 to-transparent" />
              </div>
            </SmartHtml>
          )}
        </group>

        {/* Specialized Digestion & Recycling (Lysosomes & Peroxisomes) */}
        <group>
          {/* Lysosomes (Hydrolytic Bio-spheres) */}
          {[
              [2.0, 0.4, 2.5], [-1.8, 0.2, 3.2], [1.2, 0.5, 3.8]
          ].map((pos, i) => (
              <group key={`lys-${i}`} position={pos as any}>
                <Sphere args={[0.35, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]}>
                    <meshPhysicalMaterial 
                       color="#701a75" 
                       roughness={0.2} 
                       side={THREE.DoubleSide} 
                       clearcoat={1.0} 
                       metalness={0.2} 
                       transmission={0.4}
                       thickness={2}
                    />
                </Sphere>
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <circleGeometry args={[0.35, 32]} />
                  <meshPhysicalMaterial color="#f0abfc" transmission={0.2} />
                </mesh>
                {i === 0 && showLabels && (
                  <SmartHtml position={[0, 0.8, 0]} distanceFactor={8}>
                    <div className="flex flex-col items-center group pointer-events-none">
                       <div className="px-2.5 py-1.5 bg-slate-900/90 backdrop-blur-lg border-b-4 border-pink-500 rounded-t-lg shadow-xl">
                          <span className="font-black text-pink-400 text-[10px] tracking-tighter uppercase whitespace-nowrap">Lysosome (Digestive)</span>
                       </div>
                       <div className="w-px h-4 bg-pink-500/50" />
                    </div>
                  </SmartHtml>
                )}
              </group>
          ))}
          
          {/* Peroxisomes (Oxidative Micro-bodies) */}
          {[
              [3.2, 0.3, 0.5], [-3.2, 0.4, -1.2], [0.5, 0.7, -3.8]
          ].map((pos, i) => (
              <group key={`pero-${i}`} position={pos as any}>
                <Sphere args={[0.22, 24, 24]}>
                    <meshPhysicalMaterial 
                      color="#7f1d1d" 
                      roughness={0.6} 
                      metalness={0.3} 
                      emissive="#991b1b"
                      emissiveIntensity={0.1}
                    />
                </Sphere>
                {i === 0 && showLabels && (
                  <SmartHtml position={[0, 0.5, 0]} distanceFactor={8}>
                    <div className="px-2 py-1 bg-slate-900/80 border border-red-500/50 rounded text-red-400 font-mono text-[8px] uppercase tracking-widest whitespace-nowrap">
                       Peroxisome
                    </div>
                  </SmartHtml>
                )}
              </group>
          ))}

          {/* Vacuoles (Small clear storage sacs) */}
          {[
              [1.0, -0.4, -2.5], [-2.5, -0.3, 0.5], [2.2, -0.2, 2.2]
          ].map((pos, i) => (
              <group key={`vac-${i}`} position={pos as any}>
                <Sphere args={[0.4, 32, 32]}>
                    <meshPhysicalMaterial 
                       color="#bae6fd" 
                       roughness={0} 
                       transmission={1.0} 
                       thickness={0.5} 
                       ior={1.1}
                    />
                </Sphere>
                {i === 0 && showLabels && (
                   <SmartHtml position={[0, 0.6, 0]} distanceFactor={8}>
                      <div className="px-2 py-1 bg-sky-900/40 backdrop-blur-md border border-white/20 rounded text-sky-100 font-mono text-[8px] uppercase tracking-widest">
                         Vacuole
                      </div>
                   </SmartHtml>
                )}
              </group>
          ))}
        </group>

        {/* Centrosome & Centriole Matrix */}
        <group position={[-2.2, 0.4, -1.0]}>
            <group rotation={[0, 0.6, 0.3]}>
               {/* High Detail Centriole Hub 1 */}
               <group>
                  {Array.from({ length: 9 }).map((_, i) => (
                     <Cylinder key={`c1-${i}`} args={[0.03, 0.03, 1.0, 12]} position={[
                        0.2 * Math.cos(i * Math.PI * 2 / 9), 
                        0, 
                        0.2 * Math.sin(i * Math.PI * 2 / 9)
                     ]}>
                        <meshPhysicalMaterial 
                           color="#854d0e" 
                           emissive="#eab308" 
                           emissiveIntensity={0.3} 
                           metalness={0.8}
                           roughness={0.2}
                        />
                     </Cylinder>
                  ))}
               </group>
               {/* High Detail Centriole Hub 2 (Perpendicular) */}
               <group position={[0.7, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  {Array.from({ length: 9 }).map((_, i) => (
                     <Cylinder key={`c2-${i}`} args={[0.03, 0.03, 1.0, 12]} position={[
                        0.2 * Math.cos(i * Math.PI * 2 / 9), 
                        0, 
                        0.2 * Math.sin(i * Math.PI * 2 / 9)
                     ]}>
                        <meshPhysicalMaterial color="#854d0e" emissive="#eab308" emissiveIntensity={0.3} metalness={0.8} />
                     </Cylinder>
                  ))}
               </group>
            </group>
            {showLabels && (
              <Html position={[0, 1.4, 0]} distanceFactor={8}>
                 <div className="flex flex-col items-center group pointer-events-none">
                    <div className="px-4 py-1.5 bg-slate-900/95 backdrop-blur-xl border border-yellow-500/50 rounded-full shadow-2xl">
                       <span className="font-black text-yellow-400 text-[10px] tracking-widest uppercase italic">Centrosome / Centrioles</span>
                    </div>
                 </div>
              </Html>
            )}
        </group>



      </group>
    </Float>
  );
}

