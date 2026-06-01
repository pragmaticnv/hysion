import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Torus, Html, Sparkles, Tube, MeshDistortMaterial } from '@react-three/drei';;
import * as THREE from 'three';
import { Line, Trail } from '../components/SafeLine';

const HEART_DETAILS: Record<string, string> = {
  "Aortic Arch": "The portion of the main artery that bends between the ascending and descending aorta, distributing oxygenated blood to the upper body.",
  "Superior Vena Cava": "A large vein that carries deoxygenated blood from the upper half of the body to the right atrium of the heart.",
  "Pulmonary Trunk": "A major vessel of the human heart that originates from the right ventricle and branches into the right and left pulmonary arteries.",
  "Left Ventricle": "The thickest of the heart's chambers, responsible for pumping oxygenated blood to tissues all over the body.",
  "Right Ventricle": "The lower right chamber of the heart that pumps deoxygenated blood to the lungs through the pulmonary artery.",
  "Left Atrium": "The upper left chamber that receives oxygen-rich blood from the lungs and pumps it to the left ventricle.",
  "Right Atrium": "The upper right chamber that receives deoxygenated blood from the body and pumps it to the right ventricle.",
  "LAD Artery": "The Left Anterior Descending artery, often called the 'widow maker', supplies blood to the front and left side of the heart muscle."
};

function Hoverable({ name, description, children, color = "#ef4444" }: { name: string, description: string, children: React.ReactNode, color?: string }) {
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
             <strong className="uppercase tracking-widest text-[8px] mb-1" style={{ color }}>Anatomical Structure</strong>
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
  const labelDesc = description || HEART_DETAILS[textContent] || "Detailed physiological characteristic of the human heart.";

  return (
    <Html {...props}>
      <Hoverable name={labelName} description={labelDesc} color={color}>
        {children}
      </Hoverable>
    </Html>
  );
}

function Label({ position, target, children, color = '#ef4444' }: { position: [number, number, number], target: [number, number, number], children: React.ReactNode, color?: string }) {
  return (
    <>
      <Line points={[position, target]} color={color} lineWidth={1.5} transparent opacity={0.6} />
      <SmartHtml position={position} center className="pointer-events-none" color={color}>
        {children}
      </SmartHtml>
    </>
  );
}

export function HeartModel({ showLabels, ...props }: { showLabels?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const heartRef = useRef<THREE.Group>(null);

  // Realistic heartbeat animation (lub-dub)
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.1;
    }
    
    if (heartRef.current) {
      const beat = (t * 1.2) % 1.0; // ~72 BPM
      // Lub (stronger, longer), Dub (weaker, shorter)
      const lub = Math.exp(-Math.pow((beat - 0.1) * 15, 2)) * 0.08;
      const dub = Math.exp(-Math.pow((beat - 0.35) * 20, 2)) * 0.04;
      const pulse = 1 + lub + dub;
      
      heartRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  // Materials for realistic look
  const muscleMaterialProps = {
    color: '#5e0a10',
    emissive: '#1a0000',
    roughness: 0.4,
    metalness: 0.1,
    clearcoat: 0.8,
    clearcoatRoughness: 0.2,
    transmission: 0.3,
    thickness: 2.0,
  };

  const fatMaterial = new THREE.MeshPhysicalMaterial({
    color: '#e6c27a',
    roughness: 0.7,
    metalness: 0.0,
    clearcoat: 0.5,
    clearcoatRoughness: 0.4,
    bumpScale: 0.02,
  });

  const veinMaterial = new THREE.MeshPhysicalMaterial({
    color: '#1e3a8a',
    roughness: 0.3,
    metalness: 0.2,
    clearcoat: 0.9,
    clearcoatRoughness: 0.1,
  });

  const arteryMaterial = new THREE.MeshPhysicalMaterial({
    color: '#991b1b',
    roughness: 0.3,
    metalness: 0.2,
    clearcoat: 0.9,
    clearcoatRoughness: 0.1,
  });

  // Detailed Coronary Vessels
  // Left Anterior Descending (LAD) Artery
  const ladCurve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.1, 0.7, 0.6),
    new THREE.Vector3(-0.2, 0.3, 0.95),
    new THREE.Vector3(-0.3, -0.2, 0.95),
    new THREE.Vector3(-0.2, -0.8, 0.6),
    new THREE.Vector3(0.0, -1.0, 0.2),
  ]), []);

  // Right Coronary Artery (RCA)
  const rcaCurve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.1, 0.7, 0.6),
    new THREE.Vector3(0.5, 0.4, 0.7),
    new THREE.Vector3(0.7, 0.0, 0.5),
    new THREE.Vector3(0.6, -0.4, 0.2),
  ]), []);

  // Great Cardiac Vein
  const gcvCurve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.15, 0.65, 0.65),
    new THREE.Vector3(-0.25, 0.25, 0.98),
    new THREE.Vector3(-0.35, -0.15, 0.98),
    new THREE.Vector3(-0.25, -0.75, 0.65),
  ]), []);

  // Circumflex Artery
  const cxCurve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.1, 0.7, 0.6),
    new THREE.Vector3(-0.5, 0.6, 0.4),
    new THREE.Vector3(-0.7, 0.3, 0.0),
    new THREE.Vector3(-0.6, 0.0, -0.4),
  ]), []);

  return (
    <group ref={groupRef} scale={1.8} {...props}>
      <Sparkles count={100} scale={6} size={1.5} speed={0.4} opacity={0.2} color="#ef4444" />
      
      <group ref={heartRef}>
        {/* --- MAIN MUSCLE MASS --- */}
        {/* Left Ventricle (Thicker, more conical) */}
        <Sphere args={[1.0, 64, 64]} position={[-0.3, -0.3, 0.1]} scale={[1, 1.4, 0.9]} rotation={[0, 0, 0.2]}>
          <MeshDistortMaterial {...muscleMaterialProps} distort={0.05} speed={2} />
        </Sphere>
        
        {/* Right Ventricle (Wraps around LV) */}
        <Sphere args={[0.9, 64, 64]} position={[0.4, -0.1, 0.3]} scale={[0.9, 1.2, 0.8]} rotation={[0, 0, -0.1]}>
          <MeshDistortMaterial {...muscleMaterialProps} distort={0.08} speed={2.5} />
        </Sphere>
        
        {/* Left Atrium */}
        <Sphere args={[0.6, 64, 64]} position={[-0.5, 0.8, -0.3]} scale={[1, 0.9, 1]}>
          <MeshDistortMaterial {...muscleMaterialProps} distort={0.12} speed={3} />
        </Sphere>
        
        {/* Right Atrium */}
        <Sphere args={[0.7, 64, 64]} position={[0.5, 0.7, -0.1]} scale={[1, 0.9, 1]}>
          <MeshDistortMaterial {...muscleMaterialProps} distort={0.12} speed={3} />
        </Sphere>

        {/* --- ADIPOSE TISSUE (Fat in the sulci) --- */}
        {/* Anterior Interventricular Sulcus Fat */}
        <Sphere args={[0.2, 32, 32]} position={[-0.1, 0.2, 0.9]} scale={[1.5, 4, 0.6]} rotation={[0, 0, -0.2]} material={fatMaterial} />
        {/* Atrioventricular Groove Fat */}
        <Sphere args={[0.25, 32, 32]} position={[0.3, 0.5, 0.6]} scale={[3, 1, 0.8]} rotation={[0.2, 0, 0.4]} material={fatMaterial} />
        <Sphere args={[0.2, 32, 32]} position={[-0.4, 0.6, 0.4]} scale={[2, 1, 0.8]} rotation={[-0.2, 0, -0.4]} material={fatMaterial} />

        {/* --- CORONARY VESSELS --- */}
        <Tube args={[ladCurve, 32, 0.035, 8, false]} material={arteryMaterial} />
        <Tube args={[rcaCurve, 32, 0.03, 8, false]} material={arteryMaterial} />
        <Tube args={[cxCurve, 32, 0.025, 8, false]} material={arteryMaterial} />
        <Tube args={[gcvCurve, 32, 0.04, 8, false]} material={veinMaterial} />

        {/* --- MAJOR VESSELS --- */}
        {/* Aorta */}
        <group position={[-0.1, 1.1, -0.1]}>
          {/* Ascending Aorta */}
          <Cylinder args={[0.25, 0.28, 0.6, 32]} position={[0, 0.3, 0]} rotation={[0.2, 0, -0.1]} material={arteryMaterial} />
          {/* Aortic Arch */}
          <Torus args={[0.35, 0.25, 32, 64, Math.PI]} position={[-0.25, 0.5, -0.1]} rotation={[0, -0.3, 0]} material={arteryMaterial} />
          {/* Descending Aorta */}
          <Cylinder args={[0.22, 0.25, 1.0, 32]} position={[-0.5, 0.0, -0.2]} rotation={[0, 0, 0.1]} material={arteryMaterial} />
          
          {/* Brachiocephalic Artery */}
          <Cylinder args={[0.08, 0.08, 0.5, 16]} position={[-0.05, 0.9, 0]} rotation={[0, 0, -0.2]} material={arteryMaterial} />
          {/* Left Common Carotid Artery */}
          <Cylinder args={[0.07, 0.07, 0.5, 16]} position={[-0.25, 0.95, -0.05]} rotation={[0, 0, 0]} material={arteryMaterial} />
          {/* Left Subclavian Artery */}
          <Cylinder args={[0.07, 0.07, 0.5, 16]} position={[-0.45, 0.9, -0.1]} rotation={[0, 0, 0.2]} material={arteryMaterial} />
        </group>
        
        {/* Superior Vena Cava */}
        <Cylinder args={[0.22, 0.22, 1.0, 32]} position={[0.5, 1.4, -0.3]} rotation={[0, 0, -0.1]} material={veinMaterial} />
        
        {/* Inferior Vena Cava */}
        <Cylinder args={[0.25, 0.25, 0.6, 32]} position={[0.4, -1.2, -0.2]} rotation={[0, 0, -0.1]} material={veinMaterial} />
        
        {/* Pulmonary Trunk & Arteries */}
        <group position={[0.1, 1.0, 0.3]}>
          {/* Trunk */}
          <Cylinder args={[0.22, 0.25, 0.7, 32]} position={[0, 0.35, 0]} rotation={[0.2, 0, 0.2]} material={veinMaterial} />
          {/* Left Pulmonary Artery */}
          <Cylinder args={[0.15, 0.15, 0.8, 32]} position={[-0.3, 0.7, -0.1]} rotation={[0, 0, 1.2]} material={veinMaterial} />
          {/* Right Pulmonary Artery */}
          <Cylinder args={[0.15, 0.15, 0.8, 32]} position={[0.4, 0.6, -0.2]} rotation={[0, 0, -1.2]} material={veinMaterial} />
        </group>

        {/* Pulmonary Veins (Red because they carry oxygenated blood) */}
        {/* Right Pulmonary Veins */}
        <Cylinder args={[0.1, 0.1, 0.5, 16]} position={[0.8, 0.9, -0.4]} rotation={[0, 0, -1.5]} material={arteryMaterial} />
        <Cylinder args={[0.1, 0.1, 0.5, 16]} position={[0.8, 0.6, -0.4]} rotation={[0, 0, -1.5]} material={arteryMaterial} />
        {/* Left Pulmonary Veins */}
        <Cylinder args={[0.1, 0.1, 0.5, 16]} position={[-0.8, 0.9, -0.4]} rotation={[0, 0, 1.5]} material={arteryMaterial} />
        <Cylinder args={[0.1, 0.1, 0.5, 16]} position={[-0.8, 0.6, -0.4]} rotation={[0, 0, 1.5]} material={arteryMaterial} />

      </group>

      {showLabels && (
        <>
          {/* Aorta */}
          <Label position={[-1.5, 2.2, 0]} target={[-0.1, 1.6, -0.1]} color="#ef4444">
            <div className="px-2 py-1 bg-black/80 backdrop-blur-md border border-red-500/50 rounded text-[10px] text-red-400 font-mono uppercase shadow-[0_0_10px_rgba(239,68,68,0.2)]">Aortic Arch</div>
          </Label>
          
          {/* Superior Vena Cava */}
          <Label position={[1.8, 1.8, -0.3]} target={[0.5, 1.4, -0.3]} color="#3b82f6">
            <div className="px-2 py-1 bg-black/80 backdrop-blur-md border border-blue-500/50 rounded text-[10px] text-blue-400 font-mono uppercase shadow-[0_0_10px_rgba(59,130,246,0.2)]">Superior Vena Cava</div>
          </Label>

          {/* Pulmonary Artery */}
          <Label position={[1.5, 2.4, 0.5]} target={[0.1, 1.35, 0.3]} color="#3b82f6">
            <div className="px-2 py-1 bg-black/80 backdrop-blur-md border border-blue-500/50 rounded text-[10px] text-blue-400 font-mono uppercase shadow-[0_0_10px_rgba(59,130,246,0.2)]">Pulmonary Trunk</div>
          </Label>
          
          {/* Left Ventricle */}
          <Label position={[-1.8, -0.8, 0.5]} target={[-0.3, -0.5, 0.8]} color="#ef4444">
            <div className="px-2 py-1 bg-black/80 backdrop-blur-md border border-red-500/50 rounded text-[10px] text-red-400 font-mono uppercase shadow-[0_0_10px_rgba(239,68,68,0.2)]">Left Ventricle</div>
          </Label>
          
          {/* Right Ventricle */}
          <Label position={[1.8, -0.5, 0.8]} target={[0.4, -0.3, 0.9]} color="#3b82f6">
            <div className="px-2 py-1 bg-black/80 backdrop-blur-md border border-blue-500/50 rounded text-[10px] text-blue-400 font-mono uppercase shadow-[0_0_10px_rgba(59,130,246,0.2)]">Right Ventricle</div>
          </Label>

          {/* Left Atrium */}
          <Label position={[-1.8, 0.8, -0.5]} target={[-0.6, 0.8, -0.3]} color="#ef4444">
            <div className="px-2 py-1 bg-black/80 backdrop-blur-md border border-red-500/50 rounded text-[10px] text-red-400 font-mono uppercase shadow-[0_0_10px_rgba(239,68,68,0.2)]">Left Atrium</div>
          </Label>

          {/* Right Atrium */}
          <Label position={[1.8, 0.8, -0.1]} target={[0.6, 0.7, -0.1]} color="#3b82f6">
            <div className="px-2 py-1 bg-black/80 backdrop-blur-md border border-blue-500/50 rounded text-[10px] text-blue-400 font-mono uppercase shadow-[0_0_10px_rgba(59,130,246,0.2)]">Right Atrium</div>
          </Label>

          {/* LAD Artery */}
          <Label position={[-1.5, 0.0, 1.5]} target={[-0.2, 0.0, 0.95]} color="#ef4444">
            <div className="px-2 py-1 bg-black/80 backdrop-blur-md border border-red-500/50 rounded text-[9px] text-red-400 font-mono uppercase shadow-[0_0_10px_rgba(239,68,68,0.2)]">LAD Artery</div>
          </Label>


        </>
      )}
    </group>
  );
}
