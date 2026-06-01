import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSpring, animated, useTransition } from '@react-spring/three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Environment, Text, Float, Sphere, Cylinder, Box, Instance, Instances, AdaptiveDpr, Html, ContactShadows } from '@react-three/drei';
import { Physics, useBox, usePlane, useSphere } from '@react-three/cannon';
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing';
import { Mic, Hand, Activity, Play, RotateCcw, Users, Glasses } from 'lucide-react';
import { useStore } from '../store/useStore';
import * as THREE from 'three';
import { Line as SafeLine } from './SafeLine';
import { XR, createXRStore, useXRSessionModeSupported, DefaultXRController, DefaultXRHand, useXR } from '@react-three/xr';
import Webcam from 'react-webcam';
import { GestureHandler } from './GestureHandler';

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
          <motion.div 
            initial={{ opacity: 0, y: 5, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="bg-zinc-900/95 border border-white/10 text-white p-3 rounded-xl text-[10px] pointer-events-none whitespace-normal w-48 shadow-2xl z-50 backdrop-blur-md"
          >
             <div className="flex flex-col gap-1">
               <strong className="text-indigo-400 uppercase tracking-widest text-[8px] mb-1">Detailed Analysis</strong>
               <span className="font-bold text-white text-xs">{name}</span>
               <p className="text-zinc-400 leading-relaxed font-medium">{description}</p>
             </div>
          </motion.div>
        </Html>
      )}
    </group>
  );
}

const LABEL_DETAILS: Record<string, string> = {
  "ANODE (+)": "The electrode where oxidation occurs. In an electrolytic cell, it is the positive terminal that attracts anions.",
  "CATHODE (-)": "The electrode where reduction occurs. It is the negative terminal attracting cations, essential for charge transfer.",
  "UN0-R3": "A programmable microcontroller board that acts as the 'brain' for physical computing and robotics projects.",
  "9V SOURCE": "A portable electrochemical power source supplying direct current to electronic components and sensors.",
  "Principal Focus (F)": "The specific point on the axis of a lens or mirror where rays of light parallel to the axis converge after reflection or refraction.",
  "MAGNETIC HOTPLATE SYSTEM": "Laboratory equipment designed to heat liquids while simultaneously stirring them via a rotating magnetic field.",
  "REST FRAME (v = 0)": "A coordinate system in which the observer is stationary, serving as the baseline for measuring proper time and length.",
  "Ψ ALPHA": "Represents the initial quantum state or wave function phase in this probability distribution model.",
  "Ψ BETA": "Represents the secondary quantum state, illustrating interference patterns or alternative outcomes.",
  "HIGGS BOSON DETECTED": "A confirmed detection of the fundamental particle associated with the Higgs field, which gives mass to other elementary particles.",
  "NUCLEUS": "The dense central region of an atom containing protons and neutrons, housing nearly all of its mass.",
  "9V": "Standard voltage level providing the potential difference necessary to drive current through these components.",
  "Input A": "The first logical input channel for the gate, determining the output state based on boolean algebra.",
  "Input B": "The second logical input channel. Combined with Input A to produce a deterministic logic result.",
  "MAGNETIC FIELD B": "The vector field used to describe the magnetic influence on moving electric charges and magnetic materials.",
  "FORCE F": "The vector quantity that causes an object with mass to change its velocity—fundamental to Newton's Second Law.",
  "f = ": "The focal length of the optical system, representing the distance over which initially collimated rays are brought to a focus.",
  "LUMINOSITY": "A measure of the total amount of energy emitted by a celestial object or collider event per unit time.",
  "F = ma": "Newton's Second Law of Motion: The net force on an object is equal to the mass of the object multiplied by its acceleration.",
  "Force: ": "The net interaction exerted on the mass element in this simulation.",
  "SPATIAL TELEMETRY": "Real-time telemetry data processing system for immersive XR environments.",
  "V = ": "The cumulative volume of titrant added to the analyte in the flask.",
  "I = ": "Electric current representing the rate of flow of electric charge through the circuit.",
  "T = ": "The time period of one complete oscillation of the pendulum.",
  "COHERENT STATE DETECTED": "Indicates that the quantum particles are in a synchronized superposition of states.",
  "WAVEFUNCTION COLLAPSE": "The reduction of several possible quantum states into a single definite outcome due to observation.",
  "SINGULARITY DETECTED": "The center of a black hole where density and gravity become infinite, and spacetime curves to an extreme degree.",
  "QUANTUM INTERFERENCE DETECTOR": "Sensor array capturing the probability distribution of path-interference for quantum particles.",
  "v = ": "The relative velocity of the reference frame expressed as a fraction of the speed of light.",
  "BURNT !": "Irreversible component failure due to excessive current exceeding the breakdown voltage.",
  "A": "Ammeter configuration for measuring electrical current in Amperes.",
  "V": "Voltmeter configuration for measuring potential difference in Volts.",
  "OUTPUT": "The resulting logical signal level after boolean computation.",
  "AND": "Logical conjunction: Output is HIGH only if both inputs are HIGH.",
  "OR": "Logical disjunction: Output is HIGH if at least one input is HIGH.",
  "XOR": "Exclusive OR: Output is HIGH if exactly one input is HIGH.",
  "NAND": "Negated AND: Output is LOW only if both inputs are HIGH.",
  "μF": "The charge-storing capability of the electrolytic capacitor measured in microfarads."
};

function SmartText({ children, name, description, ...props }: any) {
  const textContent = typeof children === 'string' ? children : '';
  const labelName = name || textContent;
  const labelDesc = description || LABEL_DETAILS[textContent] || "Detailed metric or identifier for the current simulation model.";

  return (
    <Hoverable name={labelName} description={labelDesc}>
      <Text {...props}>{children}</Text>
    </Hoverable>
  );
}

// ==========================================
// SHARED 3D UI & CONTROLS HUD
// ==========================================
function VoiceWaveform({ active }: { active: boolean }) {
  const bars = Array.from({ length: 8 });
  return (
    <div className="flex gap-0.5 items-end h-3">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          animate={{
            height: active ? [4, 12, 6, 10, 4] : 4,
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.1,
          }}
          className={`w-0.5 rounded-full ${active ? 'bg-emerald-400' : 'bg-zinc-600'}`}
        />
      ))}
    </div>
  );
}

function LabEnvironment() {
  const controlsRef = useRef<any>(null);
  const { theme } = useStore();
  const isLight = theme.id === 'white' || theme.id === 'ios-light';

  return (
    <>
      <ambientLight intensity={isLight ? 0.6 : 0.4} />
      <spotLight 
        position={[20, 20, 10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={isLight ? 1.8 : 2.5} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[-10, 5, -10]} intensity={isLight ? 0.6 : 1} color={isLight ? "#f0f7ff" : "#6366f1"} />
      <pointLight position={[10, -5, 5]} intensity={isLight ? 0.4 : 0.8} color={isLight ? "#fff0f5" : "#f472b6"} />
      <directionalLight 
        position={[0, 10, 5]} 
        intensity={isLight ? 1.2 : 0.2} 
        color={isLight ? "#f8faff" : "#ffffff"} 
      />
      
      <Environment preset={isLight ? "studio" : "city"} />
      
      <ContactShadows 
        position={[0, -4.99, 0]} 
        opacity={isLight ? 0.4 : 0.6} 
        scale={20} 
        blur={2} 
        far={4.5} 
      />

      <OrbitControls ref={controlsRef} makeDefault enableDamping dampingFactor={0.05} minDistance={5} maxDistance={25} />
      <GestureHandler controlsRef={controlsRef} />
      {!isLight && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}
      
      {/* High-Tech Ground Plate / Holo-Grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          color={isLight ? "#f8fafc" : "#0a0a0a"} 
          roughness={isLight ? 0.1 : 0.1} 
          metalness={isLight ? 0.05 : 0.8} 
          emissive={isLight ? "#e2e8f0" : "#06b6d4"} 
          emissiveIntensity={isLight ? 0.02 : 0.05}
        />
      </mesh>
      <gridHelper args={[50, 50, isLight ? '#e2e8f0' : '#333', isLight ? '#f1f5f9' : '#111']} position={[0, -4.99, 0]} />
      <fog attach="fog" args={[isLight ? '#f8fafc' : '#000', 10, 60]} />
    </>
  );
}

const Slider = ({ label, val, set, min, max, step=1, unit="" }: any) => (
  <div className="mb-3">
     <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
       <span>{label}</span><span className="font-mono text-white">{val}{unit}</span>
     </div>
     <input type="range" min={min} max={max} step={step} value={val} onChange={(e) => set(parseFloat(e.target?.value || e.target?.toString() || '0'))} className="w-full" />
  </div>
);

function TranscriptionPanel({ active }: { active: boolean }) {
  const { transcript } = useStore();
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (active && transcript) {
      setDisplayText(transcript);
    } else if (!active) {
      setDisplayText("Waiting for explanation...");
    }
  }, [active, transcript]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div 
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 py-4 bg-black/60 border border-white/10 rounded-2xl backdrop-blur-md shadow-2xl pointer-events-auto"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.2em]">Live Transcription</span>
          </div>
          <p className="text-sm sm:text-base text-zinc-100 font-medium leading-relaxed italic">
            "{displayText || "Listening to teacher's instructions..."}"
          </p>
          <div className="mt-3 flex gap-1">
             {[...Array(40)].map((_, i) => (
               <motion.div 
                 key={i}
                 className="h-1 bg-zinc-800 flex-1 rounded-full overflow-hidden"
               >
                 <motion.div 
                   className="h-full bg-emerald-500/30"
                   animate={{ width: active ? ['0%', '100%'] : '0%' }}
                   transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: i * 0.05 }}
                 />
               </motion.div>
             ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SpatialHUD() {
  const { transcript, isVoiceActive } = useStore();
  const session = useXR((state) => state.session);
  
  if (!session) return null;

  return (
    <group position={[0, 2, -4]}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <group>
          {/* Background Plate */}
          <mesh>
            <planeGeometry args={[6, 2.5]} />
            <meshStandardMaterial color="#000" transparent opacity={0.7} />
          </mesh>
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[6.1, 2.6]} />
            <meshStandardMaterial color="#4f46e5" transparent opacity={0.2} />
          </mesh>
          
          {/* Title */}
          <SmartText
            position={[-2.8, 1, 0.02]}
            fontSize={0.2}
            color="#6366f1"
            anchorX="left"
            font="/fonts/Inter-Bold.ttf"
          >
            SPATIAL TELEMETRY
          </SmartText>
          
          {/* Transcript Content */}
          <SmartText
            position={[-2.8, 0.2, 0.02]}
            fontSize={0.15}
            color="white"
            maxWidth={5.5}
            anchorX="left"
            anchorY="top"
            name="Transcription Stream"
            description="Live data feed containing the synchronized audio-to-text transcript from the teacher's explanation."
          >
            {isVoiceActive ? (transcript || "Syncing audio streams...") : "Audio Input Offline"}
          </SmartText>

          {/* Status Bar */}
          <mesh position={[0, -1.1, 0.02]}>
            <boxGeometry args={[5.8, 0.05, 0.01]} />
            <meshStandardMaterial color={isVoiceActive ? "#10b981" : "#333"} />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

function SimLayout({ title, desc, prompt, controls, children, camera = [0, 5, 10], physics=false, isUiOnly, isContentOnly }: any) {
  const { isGestureActive, isVoiceActive, isMultiplayer } = useStore();
  
  if (isContentOnly) {
    return <>{children}</>;
  }

  return (
    <div className="w-full h-full absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6">
      <TranscriptionPanel active={isVoiceActive} />
      <div className="absolute top-6 left-6 pointer-events-auto">
        <button className="bg-black/80 border border-white/10 text-white p-3 rounded-2xl flex items-center gap-2 backdrop-blur-xl shadow-lg hover:bg-black/60 transition-all">
          <Mic size={16} className="text-emerald-500" />
          <span className="text-xs font-bold uppercase tracking-wider">Voice to Text</span>
        </button>
      </div>
      <div className="flex justify-between items-start">
         <div className="flex gap-2">
           {isGestureActive && (
             <motion.div 
               initial={{ x: -20, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/20 border border-indigo-500/30 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.2)]"
             >
               <Hand size={14} className="text-indigo-400" />
               <span className="text-[10px] text-indigo-300 font-bold font-mono uppercase tracking-widest hidden sm:inline">Gesture Adaptive</span>
             </motion.div>
           )}
           {isVoiceActive && (
             <motion.div 
               initial={{ x: -20, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               className="flex items-center gap-3 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.2)]"
             >
               <VoiceWaveform active={true} />
               <span className="text-[10px] text-emerald-300 font-bold font-mono uppercase tracking-widest hidden sm:inline">Neural Voice Core</span>
             </motion.div>
           )}
           {isMultiplayer && (
             <motion.div 
               initial={{ x: -20, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/20 border border-indigo-500/30 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.2)]"
             >
               <div className="flex -space-x-1">
                  {[1,2].map(i => (
                    <div key={i} className="w-5 h-5 rounded-full border border-white/20 bg-zinc-800 flex items-center justify-center overflow-hidden">
                       <img src={`https://picsum.photos/seed/${i+10}/20/20`} referrerPolicy="no-referrer" alt="" />
                    </div>
                  ))}
               </div>
               <Users size={14} className="text-indigo-400 ml-1" />
               <span className="text-[10px] text-indigo-300 font-bold font-mono uppercase tracking-widest">3 Connected</span>
             </motion.div>
           )}
         </div>
      </div>
      
      <div className="pointer-events-auto bg-black/80 p-5 rounded-2xl border border-white/10 backdrop-blur-xl w-[calc(100vw-32px)] sm:w-80 self-end shadow-[0_0_40px_rgba(0,0,0,0.5)] border-l-4 border-l-indigo-500/50">
         <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] font-display">{title}</h3>
            <Activity size={12} className="text-indigo-400/50" />
         </div>
         <p className="text-[10px] text-zinc-400 mb-5 leading-relaxed font-medium italic opacity-70 border-b border-white/5 pb-3">"{desc}"</p>
         
         <div className="space-y-4">
           {controls}
         </div>

         <div className="mt-5 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-[9px] text-zinc-500 font-mono">
               <Mic size={10} className="text-emerald-500/50" />
               <span className="uppercase tracking-widest text-zinc-400">Voice Trigger:</span>
               <span className="text-white bg-white/5 px-2 py-0.5 rounded border border-white/10">"{prompt}"</span>
            </div>
            
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {['Zoom', 'Focus', 'Calibrate'].map(hint => (
                <span key={hint} className="px-2 py-0.5 bg-white/5 text-[8px] text-zinc-500 rounded border border-white/5 font-mono uppercase shrink-0">
                  {hint}
                </span>
              ))}
            </div>
         </div>
      </div>
    </div>
  );
}

// --- CHEMISTRY EXPERIMENTS ---

function ChemTitrationSim({ drops, isSimulating }: any) {
  const flaskLiquidRef = useRef<THREE.Mesh>(null);
  
  // Equivalence point logic: after 50 drops of base, color shifts to pink
  const isEquivalent = drops >= 50;
  
  useFrame(({ clock }) => {
    if (flaskLiquidRef.current) {
      // Wobble effect
      flaskLiquidRef.current.position.y = -2 + Math.sin(clock.getElapsedTime() * 2) * 0.02;
    }
  });

  return (
    <group>
      {/* Burette */}
      <group position={[0, 4, 0]}>
        <Cylinder args={[0.2, 0.2, 5, 32]}>
          <meshStandardMaterial color="#cbd5e1" transparent opacity={0.4} />
        </Cylinder>
        {/* Stopcock */}
        <Box args={[0.5, 0.2, 0.2]} position={[0, -2.5, 0]}>
          <meshStandardMaterial color="#475569" />
        </Box>
      </group>

      {/* Flask */}
      <group position={[0, -2, 0]}>
        <Cylinder args={[1.5, 0.2, 3, 32]}>
          <meshStandardMaterial color="#cbd5e1" transparent opacity={0.3} />
        </Cylinder>
        {/* Liquid */}
        <Cylinder ref={flaskLiquidRef} args={[1.4, 0.15, 0.5, 32]} position={[0, -1.2, 0]}>
          <meshStandardMaterial 
            color={isEquivalent ? "#f472b6" : "#ffffff"} 
            transparent 
            opacity={0.6} 
            emissive={isEquivalent ? "#f472b6" : "#ffffff"}
            emissiveIntensity={isEquivalent ? 0.3 : 0}
          />
        </Cylinder>
      </group>

      {/* Drops */}
      {isSimulating && drops % 10 < 5 && (
        <TitrationDrop />
      )}

      <SmartText position={[3, 0, 0]} fontSize={0.3} color="white">
        V = {(drops * 0.1).toFixed(1)} mL
      </SmartText>
    </group>
  );
}

function ChemTitration(props: any) {
  const [drops, setDrops] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isSimulating) {
      interval = setInterval(() => {
        setDrops(d => d + 1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  return (
    <SimLayout {...props} title="Acid-Base Titration" desc="Titrating 0.1M HCl with NaOH using Phenolphthalein indicator." prompt="Start Titration"
      controls={
        <div className="space-y-4">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex justify-between items-center">
            <span className="text-[10px] text-zinc-400 uppercase">Volume Added</span>
            <span className="text-xl font-mono text-white">{(drops * 0.1).toFixed(1)}<span className="text-xs text-zinc-500 ml-1">mL</span></span>
          </div>
          <button 
            onMouseDown={() => setIsSimulating(true)} 
            onMouseUp={() => setIsSimulating(false)}
            className={`w-full py-4 rounded-xl font-bold uppercase transition-all bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 active:bg-indigo-500/40`}
          >
            Hold to Add Drops
          </button>
          <button onClick={() => setDrops(0)} className="w-full py-2 text-xs text-zinc-500 hover:text-white transition-colors">Reset Burette</button>
        </div>
      }
    >
      <ChemTitrationSim drops={drops} isSimulating={isSimulating} />
    </SimLayout>
  );
}

function ChemMolecularDynamics({ temp }: { temp: number }) {
  const count = 50;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const { animatedTemp } = useSpring({
    animatedTemp: temp,
    config: { mass: 1, tension: 200, friction: 20 }
  });

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      pos: new THREE.Vector3((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10),
      vel: new THREE.Vector3((Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1),
    }));
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    const currentTemp = animatedTemp.get();

    particles.forEach((p, i) => {
      // Brownian motion scaled by animated temp
      p.vel.add(new THREE.Vector3(
        (Math.random() - 0.5) * 0.01 * currentTemp, 
        (Math.random() - 0.5) * 0.01 * currentTemp, 
        (Math.random() - 0.5) * 0.01 * currentTemp
      ));
      p.pos.add(p.vel);
      
      // Boundary check
      if (Math.abs(p.pos.x) > 5) p.vel.x *= -1;
      if (Math.abs(p.pos.y) > 5) p.vel.y *= -1;
      if (Math.abs(p.pos.z) > 5) p.vel.z *= -1;

      dummy.position.copy(p.pos);
      dummy.scale.setScalar(0.4);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <Box args={[10, 10, 10]}>
        <meshStandardMaterial wireframe color="#0ea5e9" opacity={0.1} transparent />
      </Box>
      <instancedMesh ref={meshRef} args={[new THREE.SphereGeometry(1, 16, 16), null as any, count]}>
        <meshStandardMaterial color="#0ea5e9" metalness={0.8} roughness={0.2} emissive="#0ea5e9" emissiveIntensity={0.5} />
      </instancedMesh>
      <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
    </group>
  );
}

function ChemMolecularLab(props: any) {
  const [temp, setTemp] = useState(1);

  useEffect(() => {
    const handler = (e: any) => { if (e.detail?.command === 'RUN_SIMULATION') setTemp(t => t >= 5 ? 1 : t + 1); };
    window.addEventListener('app-voice-command', handler);
    return () => window.removeEventListener('app-voice-command', handler);
  }, []);

  return (
    <SimLayout {...props} title="Molecular Kinetic Engine" desc="Atomic-scale thermo-dynamic solver rendering real-time Brownian collisions." prompt="Increase temperature"
      controls={<Slider label="System Entropy" val={temp} set={setTemp} min="0.1" max="5" step="0.1" unit="k" />}
    >
      <ChemMolecularDynamics temp={temp} />
    </SimLayout>
  );
}

function ChemFusionCore({ power, magnetic }: { power: number, magnetic: boolean }) {
  const coronaRef = useRef<THREE.Mesh>(null);
  const plasmaRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (coronaRef.current) {
      coronaRef.current.rotation.y = t * power * 2;
      const unstable = !magnetic && power > 1.2;
      const pulse = 1 + Math.sin(t * (unstable ? 30 : 10)) * 0.05 * (unstable ? 2 : power);
      coronaRef.current.scale.setScalar(pulse);
    }
    if (plasmaRef.current) {
      plasmaRef.current.rotation.z = -t * 0.5;
    }
  });

  return (
    <group>
      {/* Torus Vessel */}
      <mesh rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[4, 1, 16, 100]} />
        <meshStandardMaterial color="#1e293b" wireframe opacity={0.3} transparent />
      </mesh>
      
      {/* Active Plasma */}
      <mesh ref={plasmaRef} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[4, 0.6, 32, 200]} />
        <meshStandardMaterial 
          color={magnetic ? "#38bdf8" : "#f43f5e"} 
          emissive={magnetic ? "#0ea5e9" : "#ef4444"} 
          emissiveIntensity={power * 5} 
          transparent 
          opacity={0.6}
        />
      </mesh>

      <Sphere ref={coronaRef} args={[1.5, 64, 64]}>
        <meshStandardMaterial 
          color="#06b6d4" 
          emissive="#22d3ee" 
          emissiveIntensity={power * 10} 
          transparent 
          opacity={0.8}
          wireframe
        />
      </Sphere>
      
      <pointLight intensity={power * 50} color={magnetic ? "#00ffff" : "#ff0000"} />
    </group>
  );
}

function ChemFusionLab(props: any) {
  const [power, setPower] = useState(0.8);
  const [magnetic, setMagnetic] = useState(true);
  const isDestabilized = power > 1.5 && !magnetic;

  useEffect(() => {
    const handler = (e: any) => { if (e.detail?.command === 'RUN_SIMULATION') setMagnetic(false); }; // "run" triggers destabilization or toggles it
    window.addEventListener('app-voice-command', handler);
    return () => window.removeEventListener('app-voice-command', handler);
  }, []);

  return (
    <SimLayout {...props} title="Tokamak Fusion Core" desc="High-temperature plasma containment. Balance magnetic flux with thermal power to maintain steady-state fusion." prompt={isDestabilized ? "DESTABILIZED - Adjust Flux" : "Stabilize Plasma"}
      controls={<div className="space-y-4">
        <Slider label="Thermodynamic Power" val={power} set={setPower} min="0.1" max="2" step="0.1" unit="GW" />
        
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
          <span className="text-[10px] text-zinc-400 uppercase font-mono">Magnetic Containment</span>
          <button 
            onClick={() => setMagnetic(!magnetic)}
            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${magnetic ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-500 border border-red-500/40'}`}
          >
            {magnetic ? 'ONLINE' : 'CRITICAL'}
          </button>
        </div>

        <div className={`p-4 rounded-xl border transition-colors ${isDestabilized ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Core Stability</span>
            <span className={`text-[10px] font-mono ${isDestabilized ? 'text-red-500' : 'text-emerald-400 font-bold'}`}>
              {isDestabilized ? 'DANGER' : 'OPTIMAL'}
            </span>
          </div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
             <motion.div 
               animate={{ 
                 width: isDestabilized ? '20%' : `${100 - (power/2)*20}%`,
                 backgroundColor: isDestabilized ? '#ef4444' : '#10b981'
               }} 
               className="h-full" 
             />
          </div>
        </div>
      </div>}
    >
      <ChemFusionCore power={power} magnetic={magnetic} />
    </SimLayout>
  );
}


// --- PHYSICS EXPERIMENTS ---

function CurrentCharge({ delay, current }: { delay: number, current: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = (clock.getElapsedTime() + delay) % (5 / current);
      const progress = t / (5 / current);
      ref.current.position.x = -3 + progress * 6;
    }
  });
  return (
    <group ref={ref}>
      <Sphere args={[0.05]}>
        <meshBasicMaterial color="#ffffff" />
      </Sphere>
    </group>
  );
}

function TitrationDrop() {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() % 0.5;
      const progress = t / 0.5;
      ref.current.position.y = 1.5 - progress * 4.5;
    }
  });
  return (
    <group ref={ref}>
      <Sphere args={[0.05]}>
        <meshBasicMaterial color="#ffffff" />
      </Sphere>
    </group>
  );
}

function PhysOhmsLaw({ voltage, resistance, isSimulating }: any) {
  const current = voltage / resistance;
  
  return (
    <group>
      {/* Battery */}
      <Hoverable name="Battery" description="Adjustable DC Power Source">
        <Box args={[2, 1.5, 1]} position={[-3, 0, 0]}>
          <meshStandardMaterial color="#ef4444" />
        </Box>
      </Hoverable>

      {/* Resistor */}
      <Hoverable name="Resistor" description={`${resistance}Ω Component`}>
        <Cylinder args={[0.3, 0.3, 2, 32]} rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#fcd34d" />
        </Cylinder>
      </Hoverable>

      {/* Current flow visualization */}
      <SafeLine 
        points={[[-3, 0, 0], [0, 0, 0], [3, 0, 0], [3, -2, 0], [-3, -2, 0], [-3, 0, 0]]}
        color={isSimulating ? "#10b981" : "#334155"}
        lineWidth={3}
      />
      
      {isSimulating && (
        <group>
          {[...Array(10)].map((_, i) => (
             <CurrentCharge key={i} delay={i * 0.5} current={current} />
          ))}
        </group>
      )}

      <SmartText position={[0, 2, 0]} fontSize={0.5} color="white">
        I = {(voltage / resistance).toFixed(3)} A
      </SmartText>
    </group>
  );
}

function PhysOhmsLawLab(props: any) {
  const [voltage, setVoltage] = useState(5);
  const [resistance, setResistance] = useState(10);
  const [isSimulating, setIsSimulating] = useState(false);

  return (
    <SimLayout {...props} title="Verification of Ohm's Law" desc="Study the relationship between voltage, current, and resistance in a DC circuit." prompt="Run Simulation"
      controls={
        <div className="space-y-4">
          <Slider label="Voltage (V)" val={voltage} set={setVoltage} min={1} max={20} unit="V" />
          <Slider label="Resistance (R)" val={resistance} set={setResistance} min={1} max={100} unit="Ω" />
          <button onClick={() => setIsSimulating(!isSimulating)} className={`w-full py-3 rounded-xl font-bold uppercase transition-all ${isSimulating ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
            {isSimulating ? 'Stop Current' : 'Apply Voltage'}
          </button>
        </div>
      }
    >
      <PhysOhmsLaw voltage={voltage} resistance={resistance} isSimulating={isSimulating} />
    </SimLayout>
  );
}

function PhysPendulum({ length, isSimulating }: any) {
  const groupRef = useRef<THREE.Group>(null);
  const period = 2 * Math.PI * Math.sqrt(length / 9.81);

  useFrame(({ clock }) => {
    if (!isSimulating || !groupRef.current) return;
    const t = clock.getElapsedTime();
    const theta = 0.2 * Math.cos((2 * Math.PI * t) / period);
    groupRef.current.rotation.z = theta;
  });

  return (
    <group position={[0, 4, 0]}>
      {/* Stand */}
      <Box args={[0.5, 0.1, 0.5]} position={[0, 0.05, 0]}>
        <meshStandardMaterial color="#475569" />
      </Box>
      
      <group ref={groupRef}>
        {/* String */}
        <Cylinder args={[0.02, 0.02, length, 8]} position={[0, -length / 2, 0]}>
          <meshStandardMaterial color="white" />
        </Cylinder>
        
        {/* Bob */}
        <Sphere args={[0.4, 32, 32]} position={[0, -length, 0]}>
          <meshStandardMaterial color="#ef4444" metalness={0.8} roughness={0.2} />
        </Sphere>
      </group>

      <SmartText position={[2, -length/2, 0]} fontSize={0.3} color="white">
        T = {period.toFixed(2)}s
      </SmartText>
    </group>
  );
}

function PhysPendulumLab(props: any) {
  const [length, setLength] = useState(5);
  const [isSimulating, setIsSimulating] = useState(false);

  return (
    <SimLayout {...props} title="Simple Pendulum" desc="Measuring the period of oscillation relative to pendulum length." prompt="Release Bob"
      controls={
        <div className="space-y-4">
          <Slider label="String Length (L)" val={length} set={setLength} min={1} max={8} unit="m" />
          <button onClick={() => setIsSimulating(!isSimulating)} className={`w-full py-3 rounded-xl font-bold uppercase transition-all ${isSimulating ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
            {isSimulating ? 'Stop Oscillation' : 'Release Bob'}
          </button>
        </div>
      }
    >
      <PhysPendulum length={length} isSimulating={isSimulating} />
    </SimLayout>
  );
}


function PhysQuantumEntanglement({ entangled, observation }: { entangled: boolean, observation: number }) {
  const p1 = useRef<THREE.Mesh>(null);
  const p2 = useRef<THREE.Mesh>(null);
  const cloud1 = useRef<THREE.Group>(null);
  const cloud2 = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const fuzz = observation > 0.5 ? 0.1 : 1.0;
    
    if (p1.current && p2.current && cloud1.current && cloud2.current) {
      if (entangled) {
        p2.current.rotation.x = p1.current.rotation.x = t * 2;
        p2.current.rotation.y = p1.current.rotation.y = t * 1.5;
        p2.current.position.y = p1.current.position.y = Math.sin(t) * 0.5;
        cloud1.current.scale.setScalar(fuzz);
        cloud2.current.scale.setScalar(fuzz);
      } else {
        p1.current.rotation.x = t * 2;
        p2.current.rotation.x = t * -1;
        p1.current.position.y = Math.sin(t) * 0.5;
        p2.current.position.y = Math.cos(t) * 0.5;
        cloud1.current.scale.setScalar(1);
        cloud2.current.scale.setScalar(1);
      }
      
      cloud1.current.rotation.z = t * 0.5;
      cloud2.current.rotation.z = -t * 0.3;
    }
  });

  return (
    <group>
      <group position={[-4, 0, 0]}>
        <SmartText position={[0, 2.5, 0]} fontSize={0.3} color="#fca5a5" font="/fonts/Inter-Bold.ttf">Ψ ALPHA</SmartText>
        <mesh ref={p1}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#f87171" emissive="#f87171" emissiveIntensity={0.5} wireframe />
        </mesh>
        <group ref={cloud1}>
           {[...Array(20)].map((_, i) => (
             <Sphere key={i} args={[0.05]} position={[Math.sin(i)*1.5, Math.cos(i)*1.5, Math.sin(i*2)*1.5]}>
                <meshBasicMaterial color="#f87171" transparent opacity={0.3} />
             </Sphere>
           ))}
        </group>
      </group>
      
      <group position={[4, 0, 0]}>
        <SmartText position={[0, 2.5, 0]} fontSize={0.3} color="#93c5fd" font="/fonts/Inter-Bold.ttf">Ψ BETA</SmartText>
        <mesh ref={p2}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={0.5} wireframe />
        </mesh>
        <group ref={cloud2}>
           {[...Array(20)].map((_, i) => (
             <Sphere key={i} args={[0.05]} position={[Math.cos(i)*1.5, Math.sin(i)*1.5, Math.cos(i*2)*1.5]}>
                <meshBasicMaterial color="#60a5fa" transparent opacity={0.3} />
             </Sphere>
           ))}
        </group>
      </group>

      {entangled && (
        <SafeLine
          points={[[-4, 0, 0], [4, 0, 0]]}
          color="#a855f7"
          lineWidth={2}
          dashed
          dashSize={0.4}
          gapSize={0.2}
        />
      )}
      
      <SmartText position={[0, -3, 0]} fontSize={0.25} color="#94a3b8" font="monospace">
        {entangled ? "COHERENT STATE DETECTED" : "WAVEFUNCTION COLLAPSE"}
      </SmartText>
    </group>
  );
}

function PhysQuantumLab(props: any) {
  const [entangled, setEntangled] = useState(true);
  const [observation, setObservation] = useState(0);

  useEffect(() => {
    const handler = (e: any) => { if (e.detail?.command === 'RUN_SIMULATION') setEntangled(e => !e); };
    window.addEventListener('app-voice-command', handler);
    return () => window.removeEventListener('app-voice-command', handler);
  }, []);

  return (
    <SimLayout {...props} title="Quantum Entanglement" desc="Analyzing non-local correlation between paired particles. Wavefunction collapse occurs upon external observation." prompt="Toggle Entanglement"
      controls={
        <div className="space-y-4">
          <Slider label="Observation Flux" val={observation} set={setObservation} min="0" max="1" step="0.1" />
          <button 
            onClick={() => setEntangled(!entangled)} 
            className={`w-full py-4 font-black rounded-xl border transition-all ${entangled?'bg-indigo-600 border-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.4)]':'bg-zinc-800 border-zinc-700'}`}
          >
            {entangled ? 'BREAK COHERENCE' : 'SYNCHRONIZE SPINS'}
          </button>
        </div>
      }
    >
      <PhysQuantumEntanglement entangled={entangled} observation={observation} />
    </SimLayout>
  );
}

function PhysBlackHole({ mass, rotation }: { mass: number, rotation: number }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const photonSphereRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.rotation.z = t * (0.5 + rotation);
      ringRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05);
    }
    if (photonSphereRef.current) {
      photonSphereRef.current.rotation.y = t * 2;
    }
  });

  return (
    <group>
      {/* Schwarzschild Radius (Event Horizon) */}
      <Sphere args={[mass, 64, 64]}>
        <meshBasicMaterial color="#000000" />
      </Sphere>
      
      {/* Photon Sphere */}
      <Hoverable name="Photon Sphere" description="Region where gravity is so strong that photons are forced to orbit the hole.">
        <Sphere ref={photonSphereRef} args={[mass * 1.5, 32, 32]}>
          <meshStandardMaterial color="#38bdf8" wireframe opacity={0.1} transparent />
        </Sphere>
      </Hoverable>

      {/* Accretion Disk (Mathematical Kerr Disk) */}
      <group rotation={[Math.PI / 2.5, 0, 0]}>
        <Hoverable name="Accretion Disk" description="Superheated matter spiraling into the singularity.">
          <mesh ref={ringRef}>
            <torusGeometry args={[mass * 4, 0.4, 2, 128]} />
            <meshStandardMaterial 
              color="#fbbf24" 
              emissive="#d97706" 
              emissiveIntensity={10} 
              transparent 
              opacity={0.6}
              wireframe
            />
          </mesh>
        </Hoverable>
        {/* Glow core */}
        <Sphere args={[mass * 1.1, 32, 32]}>
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={5} transparent opacity={0.2} />
        </Sphere>
      </group>

      <Stars radius={200} depth={50} count={20000} factor={6} />
      <pointLight intensity={mass * 20} color="#fbbf24" />
      
      <SmartText position={[0, -4, 0]} fontSize={0.2} color="#94a3b8" font="monospace">
        SINGULARITY DETECTED: {mass.toFixed(2)} M⊙
      </SmartText>
    </group>
  );
}

function PhysBlackHoleLab(props: any) {
  const [mass, setMass] = useState(1);
  const [rotation, setRotation] = useState(0.5);

  useEffect(() => {
    const handler = (e: any) => { if (e.detail?.command === 'RUN_SIMULATION') setMass(m => Math.min(3, m + 0.5)); };
    window.addEventListener('app-voice-command', handler);
    return () => window.removeEventListener('app-voice-command', handler);
  }, []);

  return (
    <SimLayout {...props} title="Kerr Black Hole" desc="Spacetime topology solver for rotating singularities. Observe gravitational lensing and the accretion disk luminosity." prompt="Simulate mass accretion"
      controls={<div className="space-y-4">
        <Slider label="Solar Masses (M⊙)" val={mass} set={setMass} min="0.5" max="3" step="0.1" unit="M" />
        <Slider label="Angular Momentum (J)" val={rotation} set={setRotation} min="0.1" max="2" step="0.1" unit="spin" />
      </div>}
    >
      <PhysBlackHole mass={mass} rotation={rotation} />
    </SimLayout>
  );
}

function PhysLHC({ speed, colliding }: { speed: number, colliding: boolean }) {
  const particlesRef = useRef<THREE.Group>(null);
  const sparkRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      // Rotation speed based on acceleration
      particlesRef.current.rotation.y = clock.getElapsedTime() * 5 * speed;
    }
  });

  return (
    <group>
      {/* Accelerator Tunnel */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[5, 0.25, 16, 100]} />
        <meshStandardMaterial color="#1e293b" wireframe />
      </mesh>
      
      {/* Superconducting Magnets */}
      {[...Array(12)].map((_, i) => (
        <group key={i} rotation={[0, (i * Math.PI) / 6, 0]}>
          <Box args={[0.5, 0.8, 1]} position={[5, 0, 0]}>
            <meshStandardMaterial color="#334155" />
          </Box>
        </group>
      ))}

      {/* Orbiting Particles */}
      <group ref={particlesRef}>
        <Sphere args={[0.15]} position={[5, 0, 0]}>
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={speed * 5} />
        </Sphere>
        <Sphere args={[0.15]} position={[-5, 0, 0]}>
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={speed * 5} />
        </Sphere>
      </group>

      {colliding && (
        <Float speed={5} rotationIntensity={2} floatIntensity={2}>
           <group position={[0, 0, 0]}>
             <Sphere args={[0.5]}>
                <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={10} toneMapped={false} />
             </Sphere>
             <SmartText position={[0, 1.5, 0]} fontSize={0.3} color="#fcd34d" font="monospace">HIGGS BOSON DETECTED</SmartText>
           </group>
        </Float>
      )}

      <SmartText position={[0, -1, 0]} fontSize={0.2} color="#475569" description="Integrated luminosity representing the total count of potential collision events.">LUMINOSITY: {(speed * 10).toFixed(1)} fb⁻¹</SmartText>
    </group>
  );
}

function PhysLHCLab(props: any) {
  const [speed, setSpeed] = useState(0);
  const [colliding, setColliding] = useState(false);

  useEffect(() => {
    const handler = (e: any) => { 
      if (e.detail?.command === 'RUN_SIMULATION') {
        setSpeed(0);
        setColliding(false);
        let s = 0;
        const interval = setInterval(() => {
          s += 0.05;
          setSpeed(s);
          if (s >= 1) {
            clearInterval(interval);
            setColliding(true);
            setTimeout(() => setColliding(false), 3000);
          }
        }, 100);
      } 
    };
    window.addEventListener('app-voice-command', handler);
    return () => window.removeEventListener('app-voice-command', handler);
  }, []);

  const startSequence = () => {
    setSpeed(0);
    setColliding(false);
    let s = 0;
    const interval = setInterval(() => {
      s += 0.05;
      setSpeed(s);
      if (s >= 1) {
        clearInterval(interval);
        setColliding(true);
        setTimeout(() => setColliding(false), 3000);
      }
    }, 100);
  };

  return (
    <SimLayout {...props} title="Relativistic Supercollider" desc="Superconductive solenoid magnet array accelerating hadronic beams to CERN target velocities." prompt="Initialize Beam Sequence"
      controls={
        <div className="space-y-4">
           <div className="bg-black/40 p-4 rounded-xl border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-zinc-500 uppercase">Beam Sync</span>
                <span className="text-[10px] text-indigo-400 font-mono">{(speed * 99.99).toFixed(2)}% c</span>
              </div>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${speed * 100}%` }}
                  className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                />
              </div>
           </div>
           
           <button 
             onClick={startSequence}
             disabled={speed > 0 && speed < 1}
             className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-black uppercase tracking-widest shadow-xl transition-all"
           >
             {speed === 0 ? 'START ACCELERATION' : speed < 1 ? 'ACCELERATING...' : 'RE-COLLIDE'}
           </button>
        </div>
      }
    >
      <PhysLHC speed={speed} colliding={colliding} />
    </SimLayout>
  );
}


// ==========================================
// 3. BIOLOGY LAB 3D - ULTRA ADVANCED
// ==========================================

function BioViralDynamics({ mutation, proteinCount }: { mutation: number, proteinCount: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if(groupRef.current) {
      groupRef.current.rotation.y = t * 0.2;
    }
    if(coreRef.current) {
      coreRef.current.rotation.z = -t * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Viral Nucleocapsid */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial color="#701a75" emissive="#4a044e" wireframe />
      </mesh>
      
      <Sphere args={[1, 32, 32]}>
        <meshStandardMaterial color="#be185d" opacity={0.6} transparent />
      </Sphere>

      {/* Spike Proteins */}
      {[...Array(proteinCount)].map((_, i) => (
        <group key={i} rotation={[i * (Math.PI/proteinCount), i * 2, 0]}>
          <Cylinder args={[0.08, 0.04, 1 + mutation, 8]} position={[0, 1.8, 0]}>
            <meshStandardMaterial color="#db2777" emissive="#db2777" emissiveIntensity={0.5} />
            <Sphere args={[0.15]} position={[0, 0.5, 0]}>
               <meshStandardMaterial color="#f472b6" />
            </Sphere>
          </Cylinder>
        </group>
      ))}

      <Stars radius={50} depth={20} count={1000} factor={2} />
    </group>
  );
}

function BioViralLab(props: any) {
  const [mutation, setMutation] = useState(0.4);
  const [proteins, setProteins] = useState(12);

  useEffect(() => {
    const handler = (e: any) => { if (e.detail?.command === 'RUN_SIMULATION') setMutation(m => m >= 1.5 ? 0 : m + 0.3); };
    window.addEventListener('app-voice-command', handler);
    return () => window.removeEventListener('app-voice-command', handler);
  }, []);

  return (
    <SimLayout {...props} title="Pathogen Morphology" desc="Visualizing viral capsid architecture and surface spike proteins. Analyze structural mutation vectors." prompt="Evolve viral strain"
      controls={<div className="space-y-4">
        <Slider label="Mutation Magnitude" val={mutation} set={setMutation} min="0" max="1.5" step="0.1" unit="Δ" />
        <Slider label="Protein Density" val={proteins} set={setProteins} min="6" max="30" step="1" unit="qty" />
      </div>}
    >
      <BioViralDynamics mutation={mutation} proteinCount={proteins} />
    </SimLayout>
  );
}




// ==========================================
// 5. MATHEMATICS LAB 3D - ULTRA ADVANCED
// ==========================================

function MengerSponge({ position, size, depth }: { position: [number, number, number], size: number, depth: number }) {
  if (depth === 0) {
    return (
      <Box position={position} args={[size, size, size]}>
        <meshStandardMaterial color="#06b6d4" emissive="#0891b2" emissiveIntensity={0.2} metalness={0.8} roughness={0.2} />
      </Box>
    );
  }

  const subSize = size / 3;
  const elements = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const absSum = Math.abs(x) + Math.abs(y) + Math.abs(z);
        if (absSum > 1) {
          elements.push(
            <MengerSponge
              key={`${x}-${y}-${z}-${depth}`}
              position={[position[0] + x * subSize, position[1] + y * subSize, position[2] + z * subSize]}
              size={subSize}
              depth={depth - 1}
            />
          );
        }
      }
    }
  }
  return <group>{elements}</group>;
}

function MengerSimulation({ depth }: { depth: number }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.3;
      groupRef.current.rotation.x = clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <>
      <group ref={groupRef}>
        <MengerSponge position={[0, 0, 0]} size={6} depth={depth} />
      </group>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </>
  );
}

function MathFractalExplorer(props: any) {
  const [depth, setDepth] = useState(2);

  useEffect(() => {
    const handler = (e: any) => { if (e.detail?.command === 'RUN_SIMULATION') setDepth(d => d >= 3 ? 1 : d + 1); };
    window.addEventListener('app-voice-command', handler);
    return () => window.removeEventListener('app-voice-command', handler);
  }, []);

  return (
    <SimLayout {...props} title="Menger Fractal Engine" desc="Recursive topology solving the infinite surface area paradox." prompt="Recursive depth expansion"
      controls={<Slider label="Iteration Depth" val={depth} set={setDepth} min="1" max="3" step="1" />}
    >
      <MengerSimulation depth={depth} />
    </SimLayout>
  );
}

function MathChaos({ sigma, clear }: { sigma: number, clear: number }) {
  const [points, setPoints] = useState<THREE.Vector3[]>([]);
  
  useEffect(() => {
    setPoints([]);
  }, [clear, sigma]);

  useFrame(() => {
    if (points.length > 2000) return;
    const last = points.length === 0 ? new THREE.Vector3(0.1, 0, 0) : points[points.length - 1].clone();
    
    // Lorenz Attractor Equations
    const dt = 0.015;
    const s = sigma;
    const r = 28;
    const b = 8/3;

    const dx = s * (last.y - last.x) * dt;
    const dy = (last.x * (r - last.z) - last.y) * dt;
    const dz = (last.x * last.y - b * last.z) * dt;

    setPoints(prev => [...prev, new THREE.Vector3(last.x + dx, last.y + dy, last.z + dz)]);
  });

  return (
    <group scale={0.25} position={[0, -2, 0]}>
      <SafeLine points={points} color="#fbbf24" lineWidth={2} />
      {points.length > 0 && (
        <Sphere args={[0.5]} position={points[points.length - 1]}>
          <meshBasicMaterial color="#ffffff" />
        </Sphere>
      )}
    </group>
  );
}

function MathChaosLab(props: any) {
  const [sigma, setSigma] = useState(10);
  const [clear, setClear] = useState(0);

  useEffect(() => {
    const handler = (e: any) => { if (e.detail?.command === 'RUN_SIMULATION') setClear(c => c + 1); };
    window.addEventListener('app-voice-command', handler);
    return () => window.removeEventListener('app-voice-command', handler);
  }, []);

  return (
    <SimLayout {...props} title="Lorenz Chaos Dynamics" desc="Visualizing sensitivity to initial conditions. Small parameter shifts diverge the attractor flow." prompt="Trigger bifurcation"
      controls={<div className="space-y-4">
        <Slider label="Prandtl Number (σ)" val={sigma} set={setSigma} min="5" max="25" step="1" />
        <button onClick={() => setClear(c => c + 1)} className="w-full py-3 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl font-bold uppercase tracking-widest hover:bg-amber-500/30 transition-all">
          RESET TRAJECTORY
        </button>
      </div>}
    >
      <MathChaos sigma={sigma} clear={clear} />
    </SimLayout>
  );
}


// ==========================================
// RENDERER MAPPINGS
// ==========================================

// Deprecated duplicate ChemTitration removed. Using primary implementation in header.

function ChemOrganicInner({ temp, isStirring }: { temp: number, isStirring: boolean }) {
  const meshA = useRef<THREE.Mesh>(null);
  const meshB = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * (temp/20);
    const bonded = temp > 75;
    if(meshA.current && meshB.current) {
       meshA.current.position.x = bonded ? -0.5 : -2 + Math.sin(t)*0.5;
       meshB.current.position.x = bonded ? 0.5 : 2 + Math.cos(t)*0.5;
    }
    if(groupRef.current && isStirring) {
       groupRef.current.rotation.y = t * 2;
    }
  });

  return (
    <group ref={groupRef}>
      <Sphere ref={meshA} args={[0.8]} position={[-1.5, 0, 0]}>
        <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.8} />
      </Sphere>
      <Sphere ref={meshB} args={[0.8]} position={[1.5, 0, 0]}>
        <meshStandardMaterial color="#ec4899" roughness={0.1} metalness={0.8} />
      </Sphere>
      {temp > 75 && <Cylinder args={[0.15, 0.15, 1]} rotation={[0,0,Math.PI/2]} material-color="#cbd5e1" />}
      
      {/* Heating Platform */}
      <Box args={[6, 0.5, 6]} position={[0, -2.5, 0]}>
         <meshStandardMaterial color={temp > 50 ? "#ef4444" : "#1e293b"} emissive={temp > 50 ? "#ef4444" : "#000"} emissiveIntensity={temp/100} />
      </Box>
      <SmartText position={[0, -3.5, 0]} fontSize={0.2} color="#94a3b8">MAGNETIC HOTPLATE SYSTEM</SmartText>
    </group>
  );
}

function ChemOrganic(props: any) {
  const [temp, setTemp] = useState(25);
  const [stir, setStir] = useState(false);

  useEffect(() => {
    const handler = (e: any) => { if (e.detail?.command === 'RUN_SIMULATION') setStir(s => !s); };
    window.addEventListener('app-voice-command', handler);
    return () => window.removeEventListener('app-voice-command', handler);
  }, []);

  return (
    <SimLayout {...props} title="Molecular Synthesis" desc="Catalyze organic reactions by manipulating thermodynamic energy. Observe structural bonding as temperature exceeds activation thresholds." prompt="Synthesize ester"
      controls={<div className="space-y-4">
        <Slider label="Thermodynamic Flux" val={temp} set={setTemp} min="20" max="120" unit="°C" />
        <button 
          onClick={()=>setStir(!stir)} 
          className={`w-full py-4 font-black rounded-xl border transition-all ${stir?'bg-indigo-600 border-indigo-400 shadow-lg':'bg-zinc-800 border-zinc-700 text-zinc-500'}`}
        >
          {stir ? 'STOP MAGNETIC STIRRER' : 'ENGAGE MAGNETIC STIRRER'}
        </button>
      </div>}
    >
      <ChemOrganicInner temp={temp} isStirring={stir} />
    </SimLayout>
  );
}

function ChemElectrolysisInner({ volt, active }: { volt: number, active: boolean }) {
  const bubbles = useRef<THREE.InstancedMesh>(null);
  const anodeRef = useRef<THREE.Mesh>(null);
  const cathodeRef = useRef<THREE.Mesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    if (bubbles.current && active && volt > 1.23) { // 1.23V is the theoretical limit
      const t = clock.getElapsedTime();
      for(let i=0; i<40; i++) {
         const y = ((t*volt*0.3 + i*0.5) % 6) - 3;
         const x = i % 2 === 0 ? -1.8 : 1.8;
         dummy.position.set(x + Math.sin(t*10+i)*0.1, y, Math.cos(t*8+i)*0.1);
         dummy.scale.setScalar(i % 2 === 0 ? 0.8 : 1.2); // Oxygen vs Hydrogen size
         dummy.updateMatrix();
         bubbles.current.setMatrixAt(i, dummy.matrix);
      }
      bubbles.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Vessel */}
      <Box args={[5, 6, 5]}>
        <meshStandardMaterial color="#38bdf8" opacity={0.15} transparent roughness={0} />
      </Box>
      <gridHelper args={[5, 5, '#334155', '#1e293b']} position={[0, -3, 0]} />

      {/* Electrodes */}
      <Box ref={anodeRef} args={[0.3, 5, 0.8]} position={[-1.8, 0, 0]}>
        <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.1} />
        <SmartText position={[0, 3, 0]} fontSize={0.2} color="#f87171">ANODE (+)</SmartText>
      </Box>
      <Box ref={cathodeRef} args={[0.3, 5, 0.8]} position={[1.8, 0, 0]}>
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
        <SmartText position={[0, 3, 0]} fontSize={0.2} color="#60a5fa">CATHODE (-)</SmartText>
      </Box>

      {/* Gas Bubbles */}
      <instancedMesh ref={bubbles} args={[new THREE.SphereGeometry(0.08, 12, 12), new THREE.MeshStandardMaterial({ color:'white', transparent: true, opacity: 0.6 }), 40]} />
      
      <pointLight position={[0, 0, 2]} intensity={volt * 2} color="#00ffff" />
    </group>
  );
}

function ChemElectrolysis(props: any) {
  const [volt, setVolt] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handler = (e: any) => { if (e.detail?.command === 'RUN_SIMULATION') setActive(true); };
    window.addEventListener('app-voice-command', handler);
    return () => window.removeEventListener('app-voice-command', handler);
  }, []);

  return (
    <SimLayout {...props} title="Redox Electrolysis" desc="Decompose aqueous solutions into molecular Oxygen and Hydrogen. Exceed the thermodynamic potential to catalyze electron transfer." prompt="Initiate decomposition"
      controls={<div className="space-y-4">
        <Slider label="Electrode Potential" val={volt} set={(v:number) => { setVolt(v); if (v > 0) setActive(true); }} min="0" max="15" step="0.5" unit="V" />
        <button 
          onClick={()=>setActive(!active)} 
          className={`w-full py-4 font-black rounded-xl border transition-all ${active?'bg-emerald-600 border-emerald-400 shadow-emerald-500/20 shadow-lg':'bg-zinc-800 border-zinc-700 text-zinc-500'}`}
        >
          {active ? 'CUT POWER SUPPLY' : 'INITIALIZE DC SOURCE'}
        </button>
        {active && volt < 1.23 && <p className="text-[10px] text-red-400 text-center uppercase font-mono">Potential below threshold (1.23V)</p>}
      </div>}
    >
      <ChemElectrolysisInner volt={volt} active={active} />
    </SimLayout>
  );
}

// ==========================================
// 2. PHYSICS LAB 3D
// ==========================================
function Ground() {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], position: [0, -2, 0] })) as any;
  return (<mesh ref={ref} receiveShadow><planeGeometry args={[100, 100]} /><meshStandardMaterial color="#111" transparent opacity={0.8} /></mesh>);
}

function ProjectileOrb({ vX, vY, trigger }: any) {
  const [ref, api] = useSphere(() => ({ 
    mass: 1, 
    position: [-10, 0.5, 0],
    args: [0.5],
    onCollide: (e) => {}
  })) as any;

  // Jump to start when fired
  useEffect(() => {
    if (trigger > 0) {
      api.position.set(-10, 0.5, 0);
      api.velocity.set(vX, vY, 0);
      api.angularVelocity.set(0, 0, -vX);
    }
  }, [trigger, api.position, api.velocity, api.angularVelocity]);

  // Adjust velocity dynamics mid-air when slider is dragged
  useEffect(() => {
    if (trigger > 0) {
      api.velocity.set(vX, vY, 0);
      api.angularVelocity.set(0, 0, -vX);
    }
  }, [vX, vY, api.velocity, api.angularVelocity]);

  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial 
        color="#38bdf8" 
        emissive="#0284c7" 
        emissiveIntensity={2} 
        roughness={0.1}
        metalness={0.8}
      />
    </mesh>
  );
}

function ProjectileTrajectory({ vX, vY }: { vX: number, vY: number }) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    const g = 9.81;
    const startX = -10;
    const startY = 0.5;
    for (let i = 0; i <= 60; i++) {
      const t = i * 0.1;
      const x = startX + vX * t;
      const y = startY + vY * t - 0.5 * g * t * t;
      if (y < -2) {
        pts.push([x, -2, 0]);
        break;
      }
      pts.push([x, y, 0]);
    }
    return pts;
  }, [vX, vY]);

  return <SafeLine points={points} color="#ffffff" lineWidth={1} dashed dashSize={0.2} gapSize={0.1} />;
}

function PhysProjectile(props: any) {
  const [v, setV] = useState({ x: 5, y: 15, trig: 0 });
  const [metrics, setMetrics] = useState({ range: 0, maxHeight: 0 });

  useEffect(() => {
    const handler = (e: any) => { if (e.detail?.command === 'RUN_SIMULATION') setV(p => ({...p, trig: p.trig+1})); };
    window.addEventListener('app-voice-command', handler);
    return () => window.removeEventListener('app-voice-command', handler);
  }, []);

  useEffect(() => {
    // Theoretical calculations
    const g = 9.81;
    const tFlight = (2 * v.y) / g;
    const range = v.x * tFlight;
    const maxHeight = (v.y * v.y) / (2 * g);
    setMetrics({ 
      range: Number(range.toFixed(2)), 
      maxHeight: Number(maxHeight.toFixed(2)) 
    });
  }, [v.x, v.y]);

  return (
    <SimLayout {...props} title="Ballistic Dynamics" desc="Real-time multi-body physics engine solving projectile motion with variable vectors." prompt="Execute firing sequence" physics={true}
      controls={<div className="space-y-4">
        <Slider label="Velocity X (u)" val={v.x} set={(x:number)=>setV(p=>({...p, x, trig: p.trig+1}))} min="1" max="25" unit="m/s" />
        <Slider label="Velocity Y (v)" val={v.y} set={(y:number)=>setV(p=>({...p, y, trig: p.trig+1}))} min="1" max="25" unit="m/s" />
        <div className="grid grid-cols-2 gap-2 p-3 bg-white/5 rounded-xl border border-white/10 font-mono text-[10px]">
          <div>
            <p className="text-zinc-500 uppercase tracking-tighter">Est. Range</p>
            <p className="text-sky-400 text-lg font-bold">{metrics.range}m</p>
          </div>
          <div>
            <p className="text-zinc-500 uppercase tracking-tighter">Max Height</p>
            <p className="text-amber-400 text-lg font-bold">{metrics.maxHeight}m</p>
          </div>
        </div>
        <button onClick={()=>setV(p=>({...p,trig:p.trig+1}))} className="w-full py-4 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-xl font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(14,165,233,0.3)] hover:scale-[1.02] active:scale-95 transition-all">
          FIRE CANNON [SPACE]
        </button>
      </div>}
    >
      <Ground />
      <ProjectileOrb vX={v.x} vY={v.y} trigger={v.trig} />
      <ProjectileTrajectory vX={v.x} vY={v.y} />
      
      {/* Target Marker */}
      <mesh position={[v.x * (2 * v.y / 9.81) - 10, -1.9, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <ringGeometry args={[0.5, 0.7, 32]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.5} />
      </mesh>
      
      {/* Launch Pad */}
      <Box args={[1.5, 1, 1.5]} position={[-10, -1.5, 0]}>
        <meshStandardMaterial color="#334155" />
      </Box>
      <Cylinder args={[0.3, 0.3, 1]} position={[-10, -0.5, 0]} rotation={[0,0,Math.atan2(v.y, v.x)]}>
         <meshStandardMaterial color="#475569" />
      </Cylinder>
    </SimLayout>
  );
}

function PhysOpticsContent({ focal }: { focal: number }) {
  // Real geometric optics visualization
  const yTop = 1.5;
  const yBot = -1.5;
  
  // Paraxial focal Point calculation
  // At screen (x=12.5): y = y0 + slope * 12.5
  // where slope = -y0 / focal
  const targetTopY = yTop * (1 - 12.5 / focal);
  const targetBotY = yBot * (1 - 12.5 / focal);

  return (
    <>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Light Source */}
      <Box args={[1, 4, 1]} position={[-10.5, 0, 0]} material-emissive="#222" material-color="#111" />
      
      {/* Lens (Convex geometry) */}
      <Sphere args={[2, 64, 64]} scale={[0.15 * focal, 1, 1]} position={[0,0,0]}>
         <meshPhysicalMaterial 
            transmission={1} 
            opacity={0.4} 
            transparent 
            roughness={0} 
            ior={1.52} 
            thickness={2} 
            envMapIntensity={2}
         />
      </Sphere>
      
      {/* Optical Axis */}
      <SafeLine points={[[-12, 0, 0], [12, 0, 0]]} color="#333" lineWidth={1} dashed dashSize={0.2} gapSize={0.1} />

      {/* Central Ray */}
      <SafeLine points={[[-10, 0, 0], [12.5, 0, 0]]} color="#fbbf24" lineWidth={3} />
      
      {/* Upper Ray mapping: Object -> Lens -> Focal Point -> Screen */}
      <SafeLine points={[[-10, yTop, 0], [0, yTop, 0], [focal, 0, 0], [12.5, targetTopY, 0]]} color="#06b6d4" lineWidth={2} />
      
      {/* Lower Ray mapping */}
      <SafeLine points={[[-10, yBot, 0], [0, yBot, 0], [focal, 0, 0], [12.5, targetBotY, 0]]} color="#06b6d4" lineWidth={2} />
      
      {/* Focal Point Indicator */}
      <Sphere args={[0.12]} position={[focal, 0, 0]}>
        <meshBasicMaterial color="#ef4444" />
      </Sphere>
      <group position={[focal, -0.6, 0]}>
        <SmartText fontSize={0.3} color="#ef4444">Principal Focus (F)</SmartText>
        <SmartText position={[0, -0.3, 0]} fontSize={0.2} color="#94a3b8">f = {focal}m</SmartText>
      </group>

      {/* Observation Screen */}
      <group position={[12.5, 0, 0]}>
        <Box args={[0.1, 10, 10]}>
           <meshStandardMaterial color="#ffffff" opacity={0.1} transparent />
        </Box>
        {/* Converged Points indicators */}
        <Sphere args={[0.1]} position={[0, targetTopY, 0]}><meshBasicMaterial color="#06b6d4" /></Sphere>
        <Sphere args={[0.1]} position={[0, targetBotY, 0]}><meshBasicMaterial color="#06b6d4" /></Sphere>
      </group>

      <gridHelper args={[30, 30, '#111', '#050505']} position={[0, -5, 0]} />
    </>
  );
}

function PhysOptics(props: any) {
  const [focal, setFocal] = useState(2.5);
  return (
    <SimLayout {...props} title="Precision Geometrical Optics" desc="Adjust lens curvature and focal metrics to observe paraxial ray diffraction." prompt="Optimize focal alignment"
      controls={<Slider label="Focal Length (f)" val={focal} set={setFocal} min="1" max="6" step="0.1" unit="m" />}
    >
      <PhysOpticsContent focal={focal} />
    </SimLayout>
  );
}

function PhysQuantumContent({ wave }: { wave: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const screenRef = useRef<THREE.Mesh>(null);
  
  const geom = useMemo(() => {
    const g = new THREE.PlaneGeometry(20, 20, 160, 160);
    g.rotateX(-Math.PI / 2);
    return g;
  }, []);

  const screenGeom = useMemo(() => new THREE.PlaneGeometry(20, 8, 160, 1), []);

  useFrame(({ clock }) => {
    if(!meshRef.current || !screenRef.current) return;
    const t = clock.getElapsedTime() * 5;
    const pos = meshRef.current.geometry.attributes.position as any;
    
    // Physical Slit dimensions
    const slitX = -8;
    const slitSpacing = 2.4; // 1.2 * 2
    const slit1Z = -slitSpacing/2;
    const slit2Z = slitSpacing/2;
    
    const k = (2 * Math.PI) / (wave / 60);

    for(let i=0; i<pos.count; i++) {
       const x = pos.getX(i); 
       const z = pos.getZ(i);
       
       if (x < slitX) {
         // Incident plane wave
         pos.setY(i, Math.sin(k * x - t) * 0.4);
         continue;
       }

       const d1 = Math.sqrt((x - slitX)**2 + (z - slit1Z)**2);
       const d2 = Math.sqrt((x - slitX)**2 + (z - slit2Z)**2);
       
       // Spherically decaying wave from slits
       const amp1 = Math.sin(k * d1 - t) / (Math.sqrt(d1) + 1.2);
       const amp2 = Math.sin(k * d2 - t) / (Math.sqrt(d2) + 1.2);
       
       pos.setY(i, (amp1 + amp2) * 1.8);
    }
    pos.needsUpdate = true;

    // Interference pattern intensity mapping on screen
    const sPos = screenRef.current.geometry.attributes.position as any;
    const L = 18; // Distance from slits to screen roughly
    for(let i=0; i<sPos.count; i++) {
      const z = sPos.getZ(i);
      const d1 = Math.sqrt(L**2 + (z - slit1Z)**2);
      const d2 = Math.sqrt(L**2 + (z - slit2Z)**2);
      
      const phaseDiff = k * (d1 - d2);
      // Intensity I = 4I0 * cos^2(delta/2)
      const intensity = Math.pow(Math.cos(phaseDiff / 2), 2);
      sPos.setY(i, intensity * 2.5);
    }
    sPos.needsUpdate = true;
  });

  return (
    <>
      <mesh ref={meshRef} geometry={geom} position={[2, -1, 0]}>
        <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={0.8} wireframe opacity={0.6} transparent />
      </mesh>
      
      {/* Opaque Wall */}
      <Box args={[0.4, 8, 20]} position={[-8, 3, 0]} material-color="#020617" />
      
      {/* Glowing Slits */}
      <Box args={[0.5, 8, 0.2]} position={[-8, 3, -1.2]} material-emissive="#0ea5e9" material-emissiveIntensity={5} />
      <Box args={[0.5, 8, 0.2]} position={[-8, 3, 1.2]} material-emissive="#0ea5e9" material-emissiveIntensity={5} />

      {/* Observation Detector */}
      <group position={[10, 3, 0]} rotation={[0, -Math.PI/2, 0]}>
        <mesh ref={screenRef} geometry={screenGeom}>
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2} wireframe={false} toneMapped={false} />
        </mesh>
        <Box args={[20, 8, 0.1]} position={[0, 0, -0.1]} material-color="#000" />
        <SmartText position={[0, -4.5, 0]} fontSize={0.35} color="#94a3b8">
          QUANTUM INTERFERENCE DETECTOR (ψ² PATTERN)
        </SmartText>
      </group>

      <gridHelper args={[40, 40, '#111', '#050505']} position={[0, -4, 0]} />
    </>
  );
}

function PhysQuantum(props: any) {
  const [wave, setWave] = useState(550);
  return (
    <SimLayout {...props} title="Quantum Interference" desc="Analyze wave-particle duality through the double-slit probability amplitude." prompt="Shift λ for wider fringes"
      controls={<Slider label="Wavelength (λ)" val={wave} set={setWave} min="300" max="900" unit="nm" />}
    >
      <PhysQuantumContent wave={wave} />
    </SimLayout>
  );
}


function PhysRelativityInner({ speed, gravity, frame }: { speed: number, gravity: number, frame: 'stationary' | 'moving' }) {
  const movingClockRef = useRef<THREE.Group>(null);
  const movingPhotonRef = useRef<THREE.Mesh>(null);
  const statPhotonRef = useRef<THREE.Mesh>(null);
  
  const gamma = 1 / Math.sqrt(1 - Math.pow(speed, 2));
  const timeDilation = gamma * (1 + gravity * 0.05);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    if (statPhotonRef.current) {
      statPhotonRef.current.position.y = Math.sin(t * 8) * 2;
    }
    
    if (movingPhotonRef.current) {
      // In the stationary frame, the moving clock appears to tick slower.
      // In the moving frame, it ticks normally, but the rest of the universe ticks differently.
      const activeTime = frame === 'stationary' ? (t / timeDilation) : t;
      movingPhotonRef.current.position.y = Math.sin(activeTime * 8) * 2;
    }
    
    if (movingClockRef.current && frame === 'stationary') {
      // Moving clock oscillates through space as well
      movingClockRef.current.position.x = 4 + Math.sin(t * 0.5) * speed * 4;
    } else if (movingClockRef.current) {
      movingClockRef.current.position.x = 4;
    }
  });

  return (
    <group>
      <gridHelper args={[40, 40, '#222', '#111']} position={[0, -3, 0]} />
      {/* Grid wrapper that contracts to visualize length contraction in the direction of motion */}
      <group scale={[frame === 'moving' ? 1/gamma : 1, 1, 1]}>
         <gridHelper args={[40, 40, '#06b6d4', '#06b6d4']} position={[0, -2.9, 0]} />
      </group>

      {/* Rest Frame Clock */}
      <group position={[-4, 0, 0]}>
         <Hoverable name="Stationary Clock" description="Light clock in the rest frame. Ticks at proper time (t).">
           <Box args={[2, 0.2, 2]} position={[0, 2.2, 0]}><meshStandardMaterial color="#475569" /></Box>
           <Box args={[2, 0.2, 2]} position={[0, -2.2, 0]}><meshStandardMaterial color="#475569" /></Box>
           <SafeLine points={[[0, -2, 0], [0, 2, 0]]} color="#475569" lineWidth={1} opacity={0.5} transparent />
           <Sphere ref={statPhotonRef} args={[0.2]}>
              <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={5} />
           </Sphere>
         </Hoverable>
         <SmartText position={[0, -3.5, 0]} fontSize={0.3} color="#06b6d4">REST FRAME (v = 0)</SmartText>
      </group>

      {/* Moving Frame Clock */}
      <group ref={movingClockRef} position={[4, 0, 0]}>
         <Hoverable name="Moving Clock" description={`Light clock experiencing time dilation. Ticks at coordinate time (t').`}>
           <Box args={[2, 0.2, 2]} position={[0, 2.2, 0]}><meshStandardMaterial color="#475569" /></Box>
           <Box args={[2, 0.2, 2]} position={[0, -2.2, 0]}><meshStandardMaterial color="#475569" /></Box>
           <SafeLine points={[[0, -2, 0], [0, 2, 0]]} color="#475569" lineWidth={1} opacity={0.5} transparent />
           <Sphere ref={movingPhotonRef} args={[0.2]}>
              <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={5} />
           </Sphere>
         </Hoverable>
         <SmartText position={[0, -3.5, 0]} fontSize={0.3} color="#ef4444">v = {speed.toFixed(2)}c</SmartText>
      </group>
    </group>
  );
}

function PhysRelativityLab(props: any) {
  const [speed, setSpeed] = useState(0.5);
  const [gravity, setGravity] = useState(1);
  const [frame, setFrame] = useState<'stationary' | 'moving'>('stationary');

  useEffect(() => {
    const handler = (e: any) => { if (e.detail?.command === 'RUN_SIMULATION') setSpeed(s => Math.min(0.99, s + 0.1)); };
    window.addEventListener('app-voice-command', handler);
    return () => window.removeEventListener('app-voice-command', handler);
  }, []);

  const gamma = 1 / Math.sqrt(1 - Math.pow(speed, 2));
  const timeDilation = gamma * (1 + gravity * 0.05);

  return (
    <SimLayout {...props} title="Spacetime Relativity" desc="Visualize Special and General effects on spacetime. Adjust observer velocity and gravitational wells to observe time dilation and length contraction." prompt="Accelerate observer"
      controls={<div className="space-y-4">
        <Slider label="Observer Speed (v)" val={speed} set={setSpeed} min="0" max="0.99" step="0.01" unit="c" />
        <Slider label="Gravitational Field" val={gravity} set={setGravity} min="0" max="10" step="0.1" unit="g" />
        
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
          <span className="text-[10px] text-zinc-400 uppercase font-mono">Reference Frame</span>
          <button 
            onClick={() => setFrame(f => f === 'stationary' ? 'moving' : 'stationary')}
            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all bg-indigo-500/20 text-indigo-400 border border-indigo-500/40`}
          >
            {frame.toUpperCase()} OBSERVER
          </button>
        </div>

        <div className="p-4 rounded-xl border bg-black/40 border-white/10 text-[10px] font-mono">
           <div className="flex justify-between mb-2">
             <span className="text-zinc-500">Lorentz Factor (γ)</span> 
             <span className="text-white">{gamma.toFixed(3)}</span>
           </div>
           <div className="flex justify-between mb-2">
             <span className="text-zinc-500">Length Contraction (L')</span> 
             <span className="text-indigo-400">{(1/gamma).toFixed(3)}L</span>
           </div>
           <div className="flex justify-between pt-2 border-t border-white/10">
             <span className="text-zinc-500">Time Dilation Factor</span> 
             <span className="text-red-400">{timeDilation.toFixed(3)}x Slower</span>
           </div>
        </div>
      </div>}
    >
      <PhysRelativityInner speed={speed} gravity={gravity} frame={frame} />
    </SimLayout>
  );
}

// ==========================================
// 3. ELECTRONICS LAB 3D - ADVANCED CIRCUIT BUILDER
// ==========================================

interface ElectronicComponent {
  id: string;
  type: 'battery' | 'resistor' | 'led' | 'arduino' | 'switch' | 'capacitor' | 'bulb' | 'motor' | 'buzzer' | 'ammeter' | 'voltmeter';
  position: [number, number, number];
  rotation?: [number, number, number];
  value: number; // Volts, Ohms, farads
  pins: { id: string, relPos: [number, number, number], node?: number }[];
  isBurnt?: boolean;
  state?: any;
}

interface Wire {
  from: { componentId: string, pinId: string };
  to: { componentId: string, pinId: string };
  color: string;
}


const initialElectronicsComponents: ElectronicComponent[] = [
    { 
      id: 'bat1', type: 'battery', position: [-4, 0.5, 0], value: 9, 
      pins: [
        { id: 'pos', relPos: [0.5, 0, 0] },
        { id: 'neg', relPos: [-0.5, 0, 0] }
      ] 
    },
    { 
      id: 'ard1', type: 'arduino', position: [0, 0.25, 0], value: 0, 
      pins: [
        { id: 'd13', relPos: [2, 0, 1] },
        { id: 'gnd', relPos: [2, 0, -1] }
      ],
      state: { code: 'void loop() {\n  digitalWrite(13, HIGH);\n  delay(500);\n  digitalWrite(13, LOW);\n  delay(500);\n}', isRunning: false }
    },
    { 
      id: 'led1', type: 'led', position: [4, 0.5, 0], value: 2.0, // Forward voltage
      pins: [
        { id: 'anode', relPos: [0.2, 0, 0] },
        { id: 'cathode', relPos: [-0.2, 0, 0] }
      ]
    },
    {
      id: 'bulb1', type: 'bulb', position: [0, 0.8, -3], value: 12,
      pins: [
        { id: 'p1', relPos: [0.3, -0.6, 0] },
        { id: 'p2', relPos: [-0.3, -0.6, 0] }
      ]
    }
  ];

function AdvancedElectronicsLab(props: any) {
  const [components, setComponents] = useState<ElectronicComponent[]>(initialElectronicsComponents);

  const [wires, setWires] = useState<Wire[]>([]);
  const [arduinoCode, setArduinoCode] = useState(components.find(c => c.type === 'arduino')?.state?.code || '');
  const [isSimulating, setIsSimulating] = useState(false);
  const [liveValues, setLiveValues] = useState<{ v: number, i: number }>({ v: 0, i: 0 });
  const [oscilloscopeData, setOscilloscopeData] = useState<number[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  useEffect(() => {
    const handler = (e: any) => { if (e.detail?.command === 'RUN_SIMULATION') setIsSimulating(s => !s); };
    window.addEventListener('app-voice-command', handler);
    return () => window.removeEventListener('app-voice-command', handler);
  }, []);

  const handleUpload = () => {
    setComponents(prev => prev.map(c => 
      c.type === 'arduino' ? { ...c, state: { ...c.state, code: arduinoCode, isRunning: true } } : c
    ));
    setIsSimulating(true);
  };

  const burnComponent = (id: string) => {
    setComponents(prev => prev.map(c => c.id === id ? { ...c, isBurnt: true } : c));
    setWarnings(prev => [...prev, `CRITICAL: Component ${id} overloaded and destroyed!`]);
  };

  return (
    <SimLayout {...props} title="Advanced Electronics Lab" desc="Real-time SPICE-integrated circuit builder with Arduino execution." prompt="Upload Arduino code"
      controls={<>
        <div className="space-y-4">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mb-1">Component Toolbox</div>
          <div className="grid grid-cols-2 gap-2">
             {[
               { type: 'bulb', label: 'Incandescent' },
               { type: 'led', label: 'GaAs LED' },
               { type: 'battery', label: '9V Cell' },
               { type: 'motor', label: 'DC Motor' },
               { type: 'buzzer', label: 'Piezo' },
               { type: 'switch', label: 'SPST Switch' }
             ].map(item => (
               <button 
                 key={item.type}
                 onClick={() => {
                   const id = `${item.type}_${Date.now()}`;
                   setComponents((prev: any) => [...prev, { 
                     id, 
                     type: item.type, 
                     position: [(Math.random()-0.5)*8, 0.5, (Math.random()-0.5)*4], 
                     value: 10,
                     pins: [{ id: 'p1', relPos: [0.3, 0, 0] }, { id: 'p2', relPos: [-0.3, 0, 0] }]
                   }]);
                 }}
                 className="p-2 bg-white/5 border border-white/5 rounded-lg text-[9px] uppercase font-bold text-zinc-400 hover:bg-indigo-500/10 hover:text-indigo-400 hover:border-indigo-500/30 transition-all text-center"
               >
                 {item.label}
               </button>
             ))}
          </div>

          <div className="flex items-center gap-2 bg-black/40 p-2 rounded-lg border border-white/5 mt-4">
            <button onClick={() => setIsSimulating(true)} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-[10px] font-bold uppercase transition-all text-white">Run</button>
            <button onClick={() => setIsSimulating(false)} className="flex-1 py-2 bg-yellow-600 hover:bg-yellow-500 rounded text-[10px] font-bold uppercase transition-all text-white">Pause</button>
            <button onClick={() => { setIsSimulating(false); setComponents(initialElectronicsComponents); setWires([]); setOscilloscopeData([]); }} className="flex-1 py-2 bg-red-600 hover:bg-red-500 rounded text-[10px] font-bold uppercase transition-all text-white">Reset</button>
          </div>
          <div>
            <label className="text-[10px] text-zinc-500 uppercase flex items-center gap-2 mb-2">
              <Activity size={12} className="text-indigo-400" /> Oscilloscope Channel A
            </label>
            <div className="h-20 bg-black/40 border border-white/10 rounded-lg overflow-hidden flex items-end px-1 gap-[1px]">
              {oscilloscopeData.map((val, i) => (
                <div key={i} className="flex-1 bg-cyan-400" style={{ height: `${val * 100}%`, opacity: 0.8 }} />
              ))}
            </div>
          </div>

          <div className="bg-black/40 p-4 rounded-xl border border-white/5">
             <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-zinc-500 font-mono">Arduino IDE</span>
                <span className="text-[9px] px-2 py-0.5 bg-green-500/10 text-green-400 rounded">COM3 Connected</span>
             </div>
             <textarea 
               value={arduinoCode}
               onChange={(e) => setArduinoCode(e.target?.value || '')}
               className="w-full h-32 bg-zinc-950/80 border border-white/10 rounded-lg p-2 text-[10px] font-mono text-zinc-300 focus:outline-none focus:border-indigo-500/50"
             />
             <button onClick={handleUpload} className="w-full mt-2 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-2">
               <RotateCcw size={12} /> Compile & Upload
             </button>
          </div>

          {warnings.length > 0 && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg space-y-1">
               {warnings.map((w, idx) => (
                 <p key={idx} className="text-[9px] text-red-400 font-bold leading-tight">{w}</p>
               ))}
            </div>
          )}

          <div className="flex justify-between items-center px-2 py-1 bg-black/20 rounded-lg border border-white/5">
             <div className="text-center">
               <div className="text-[8px] text-zinc-500">VOLTAGE</div>
               <div className="text-xs font-mono text-white">{liveValues.v.toFixed(2)}V</div>
             </div>
             <div className="h-6 w-px bg-white/10" />
             <div className="text-center">
               <div className="text-[8px] text-zinc-500">CURRENT</div>
               <div className="text-xs font-mono text-white">{(liveValues.i * 1000).toFixed(1)}mA</div>
             </div>
          </div>
        </div>
      </>}
    >
      <AdvancedElectronicsContent 
        components={components}
        wires={wires}
        setWires={setWires}
        isSimulating={isSimulating}
        setLiveValues={setLiveValues}
        setOscilloscopeData={setOscilloscopeData}
        burnComponent={burnComponent}
      />
    </SimLayout>
  );
}

function AdvancedElectronicsContent({ components, wires, setWires, isSimulating, setLiveValues, setOscilloscopeData, burnComponent }: any) {
  // Simulation Logic moved here inside Canvas context
  useFrame(({ clock }) => {
    if (!isSimulating) return;
    const t = clock.getElapsedTime();

    const arduino = components.find((c: any) => c.type === 'arduino');
    if (arduino && arduino.state.isRunning) {
      const match = arduino.state.code.match(/delay\((\d+)\)/);
      const delay = match ? parseInt(match[1]) : 500;
      const ledOn = Math.floor((t * 1000) / delay) % 2 === 0;
      
      const led = components.find((c: any) => c.type === 'led');
      if (led) {
        const isConnected = wires.some((w: any) => 
          (w.from.componentId === 'ard1' && w.from.pinId === 'd13' && w.to.componentId === 'led1' && w.to.pinId === 'anode') ||
          (w.to.componentId === 'ard1' && w.to.pinId === 'd13' && w.from.componentId === 'led1' && w.from.pinId === 'anode')
        );

        if (isConnected) {
          setLiveValues({ v: ledOn ? 5 : 0, i: ledOn ? 0.02 : 0 });
          setOscilloscopeData((prev: any) => [...prev.slice(-49), ledOn ? 1 : 0]);
        }
      }
    }
  });

  return (
    <group position={[0,0,0]}>
      {/* Table / Workspace */}
      <Box args={[15, 0.2, 10]} position={[0, -0.1, 0]} material-color="#18181b" receiveShadow />
      <gridHelper args={[15, 15, '#333', '#111']} position={[0, 0.01, 0]} />

      {components.map((comp: any) => (
        <ElectronicComponentNode key={comp.id} component={comp} />
      ))}

      {/* Render Wires dynamically */}
      {wires.map((wire: any, idx: number) => {
        const fromComp = components.find((c: any) => c.id === wire.from.componentId);
        const toComp = components.find((c: any) => c.id === wire.to.componentId);
        if (!fromComp || !toComp) return null;
        
        const fromPin = fromComp.pins.find((p: any) => p.id === wire.from.pinId);
        const toPin = toComp.pins.find((p: any) => p.id === wire.to.pinId);
        if (!fromPin || !toPin) return null;

        const p1: [number, number, number] = [
          fromComp.position[0] + fromPin.relPos[0],
          fromComp.position[1] + fromPin.relPos[1],
          fromComp.position[2] + fromPin.relPos[2]
        ];
        const p2: [number, number, number] = [
          toComp.position[0] + toPin.relPos[0],
          toComp.position[1] + toPin.relPos[1],
          toComp.position[2] + toPin.relPos[2]
        ];

        return <SafeLine key={idx} points={[p1, [p1[0], p1[1]+1, p1[2]], [p2[0], p2[1]+1, p2[2]], p2]} color={wire.color} lineWidth={4} />;
      })}

      {/* Mock Wire Creation interaction for demo */}
      {wires.length === 0 && (
        <Html position={[0, 4, 0]} center>
          <button 
            onClick={() => {
              setWires([
                { from: { componentId: 'ard1', pinId: 'd13' }, to: { componentId: 'led1', pinId: 'anode' }, color: '#ef4444' },
                { from: { componentId: 'ard1', pinId: 'gnd' }, to: { componentId: 'led1', pinId: 'cathode' }, color: '#333' }
              ]);
            }}
            className="px-6 py-3 bg-indigo-500/80 hover:bg-indigo-400 text-white rounded-full font-bold text-xs uppercase tracking-widest backdrop-blur-md shadow-2xl border border-white/20 transition-all border-b-4 border-indigo-700 active:border-b-0 active:translate-y-1"
          >
            Auto-Connect Logic (D13 → Red LED)
          </button>
        </Html>
      )}
      
      {/* Overload Simulation trigger */}
      {isSimulating && (
        <Html position={[-4, 3, 0]} center>
          <button 
            onClick={() => burnComponent('led1')}
            className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-[10px] font-bold uppercase transition-all border border-red-500/30"
          >
            Trigger Overload Test
          </button>
        </Html>
      )}
    </group>
  );
}

function ElectronicComponentNode({ component }: { component: ElectronicComponent }) {
  const { type, position, isBurnt } = component;
  
  return (
    <group position={position}>
      {/* Visual Model based on type */}
      {type === 'battery' && (
        <Box args={[1, 0.8, 0.6]} material-color={isBurnt ? "#222" : "#3b82f6"}>
          <SmartText position={[0, 0.5, 0.35]} fontSize={0.2} color="white">9V SOURCE</SmartText>
        </Box>
      )}

      {type === 'arduino' && (
        <group>
          <Box args={[4.5, 0.2, 3]} material-color="#006064" />
          <Box args={[1.5, 0.4, 1.5]} position={[-0.5, 0.2, 0]} material-color="#111" />
          <SmartText position={[0, 0.3, 1]} fontSize={0.25} color="white" rotation={[-Math.PI/2, 0, 0]}>UN0-R3</SmartText>
          <Sphere args={[0.08]} position={[1.8, 0.2, 1]}>
             <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={2} />
          </Sphere>
        </group>
      )}

      {type === 'led' && (
        <group>
          <Cylinder args={[0.3, 0.3, 0.6]} material-transparent material-opacity={0.6} material-color={isBurnt ? "#111" : "#ef4444"}>
             <meshStandardMaterial 
               color={isBurnt ? "#000" : "#ef4444"} 
               emissive="#ef4444" 
               emissiveIntensity={isBurnt ? 0 : 2} 
             />
          </Cylinder>
          {isBurnt && (
            <Float speed={5} rotationIntensity={2} floatIntensity={2}>
              <SmartText position={[0, 1, 0]} fontSize={0.4} color="#ef4444" font="monospace">BURNT !</SmartText>
            </Float>
          )}
        </group>
      )}

      {type === 'bulb' && (
        <group>
          <Cylinder args={[0.3, 0.3, 0.5]} position={[0, -0.3, 0]}>
            <meshStandardMaterial color="#444" />
          </Cylinder>
          <Sphere args={[0.6]} position={[0, 0.2, 0]}>
            <meshStandardMaterial color="#fff" transparent opacity={0.3} />
          </Sphere>
          <pointLight intensity={isBurnt ? 0 : 5} color="#fbbf24" position={[0, 0.2, 0]} />
        </group>
      )}

      {type === 'switch' && (
        <group>
          <Box args={[0.8, 0.2, 0.8]} material-color="#111" />
          <Box args={[0.4, 0.5, 0.1]} position={[0, 0.3, 0]} rotation={[component.state?.isOpen ? 0.5 : -0.5, 0, 0]}>
            <meshStandardMaterial color="#333" />
          </Box>
        </group>
      )}

      {type === 'motor' && (
        <group>
          <Cylinder args={[0.5, 0.5, 1.2]} rotation={[Math.PI/2, 0, 0]}>
            <meshStandardMaterial color="#71717a" metalness={0.8} roughness={0.2} />
          </Cylinder>
          <Cylinder args={[0.05, 0.05, 1.8]} rotation={[Math.PI/2, 0, 0]}>
             <meshStandardMaterial color="#d4d4d8" />
          </Cylinder>
        </group>
      )}

      {type === 'buzzer' && (
        <group>
          <Cylinder args={[0.6, 0.6, 0.4]}>
            <meshStandardMaterial color="#111" />
          </Cylinder>
          <Cylinder args={[0.1, 0.1, 0.05]} position={[0, 0.2, 0]}>
            <meshStandardMaterial color="#222" />
          </Cylinder>
        </group>
      )}

      {(type === 'ammeter' || type === 'voltmeter') && (
        <group>
          <Box args={[1.2, 0.4, 1.2]} material-color="#1e293b" />
          <Box args={[1, 0.05, 1]} position={[0, 0.21, 0]} material-color="#000" />
          <SmartText position={[0, 0.3, 0]} fontSize={0.3} color="white" rotation={[-Math.PI/2, 0, 0]}>
            {type === 'ammeter' ? 'A' : 'V'}
          </SmartText>
        </group>
      )}

      {component.pins.map(pin => (
        <group key={pin.id} position={pin.relPos}>
           <Sphere args={[0.08]} material-color="#d4d4d8" />
           <Text position={[0, 0.2, 0]} fontSize={0.12} color="#94a3b8">{pin.id}</Text>
        </group>
      ))}
    </group>
  );
}

function ElecOhms(props: any) {
  const [volts, setVolts] = useState(5);
  const [res, setRes] = useState(100);
  const current = volts / res;
  
  return (
    <SimLayout {...props} title="Ohmic Load Analysis" desc="Interactive circuit testing identifying the V=IR relationship through variable resistors." prompt="Vary voltage and load"
      controls={<div className="space-y-4">
        <Slider label="Voltage Source" val={volts} set={setVolts} min="1" max="24" unit="V" />
        <Slider label="Resistance (R)" val={res} set={setRes} min="10" max="1000" step="10" unit="Ω" />
        
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl font-mono">
           <div className="flex justify-between items-center text-[10px] text-emerald-300">
             <span>Calculated Current (I)</span>
             <span className="bg-emerald-500 text-black px-1 font-bold">LIVE</span>
           </div>
           <div className="text-2xl font-black text-emerald-400">{(current * 1000).toFixed(2)} mA</div>
        </div>
      </div>}
    >
      <group rotation={[Math.PI / 12, -Math.PI / 6, 0]}>
         {/* Prototyping Breadboard */}
         <Box args={[8, 0.5, 4]} position={[0, -0.25, 0]}>
            <meshStandardMaterial color="#e5e7eb" roughness={0.5} />
         </Box>
         {[...Array(40)].map((_, i) => (
           <group key={i} position={[-3.5 + (i % 20) * 0.35, 0.01, -1.5 + Math.floor(i / 20) * 3]}>
              <Box args={[0.1, 0.1, 0.1]}><meshStandardMaterial color="#9ca3af" /></Box>
           </group>
         ))}

         {/* 9V/Power Battery */}
         <Box args={[1.5, 2, 1]} position={[-3, 1, 1]}>
            <meshStandardMaterial color="#1e293b" />
            <SmartText position={[0, 0, 0.51]} fontSize={0.3} color="white">9V</SmartText>
         </Box>
         
         {/* Resistor Component */}
         <group position={[0, 0.3, 0]}>
            <Cylinder args={[0.15, 0.15, 1.2]} rotation={[0,0,Math.PI/2]}>
               <meshStandardMaterial color="#d97706" />
            </Cylinder>
            <Box args={[0.05, 0.35, 0.35]} position={[-0.3, 0, 0]} material-color="#b45309" />
            <Box args={[0.05, 0.35, 0.35]} position={[0.3, 0, 0]} material-color="#78350f" />
         </group>

         {/* High Fidelity LED */}
         <group position={[3, 0.5, 0]}>
            <Cylinder args={[0.3, 0.3, 0.6]} position={[0, 0, 0]}>
               <meshStandardMaterial 
                 color="#ef4444" 
                 emissive="#ef4444" 
                 emissiveIntensity={current * 200} 
                 transparent 
                 opacity={0.8} 
                 toneMapped={false} 
               />
            </Cylinder>
            <Cylinder args={[0.1, 0.1, 0.5]} position={[0, -0.4, 0]} material-color="#94a3b8" />
         </group>

         {/* Connecting Wires */}
         <SafeLine points={[[-3, 2, 1], [-3, 2, 0], [3, 2, 0], [3, 1, 0]]} color="#ef4444" lineWidth={2} />
         <SafeLine points={[[-3, 0, 1], [-3, 0, -1], [3, 0, -1], [3, 0, 0]]} color="#1e293b" lineWidth={2} />
      </group>
    </SimLayout>
  );
}

function ElecLogic(props: any) {
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const [gate, setGate] = useState(0); // 0=AND, 1=OR, 2=XOR, 3=NAND
  const gates = ['AND', 'OR', 'XOR', 'NAND'];
  
  const out = useMemo(() => {
    switch(gate) {
      case 0: return a && b;
      case 1: return a || b;
      case 2: return a !== b;
      case 3: return !(a && b);
      default: return false;
    }
  }, [a, b, gate]);

  return (
    <SimLayout {...props} title="Boolean Logic Array" desc="Mechanized binary computation. Aggregate input states to determine high/low output signals." prompt="Switch inputs"
      controls={<div className="space-y-4">
        <div className="flex gap-2">
          <button onClick={()=>setA(!a)} className={`flex-1 py-4 font-black rounded-xl border transition-all ${a?'bg-indigo-600 border-indigo-400 shadow-lg':'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>A: {a?'1':'0'}</button>
          <button onClick={()=>setB(!b)} className={`flex-1 py-4 font-black rounded-xl border transition-all ${b?'bg-indigo-600 border-indigo-400 shadow-lg':'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>B: {b?'1':'0'}</button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {gates.map((g, i) => (
             <button key={g} onClick={()=>setGate(i)} className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${gate===i?'bg-amber-500/20 border-amber-500 text-amber-400':'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>{g}</button>
          ))}
        </div>
      </div>}
    >
      {/* Visual Circuit */}
      <group position={[-3, 0, 0]}>
         <Box args={[1.2, 0.6, 0.6]} position={[0, 1.5, 0]} material-color={a?'#6366f1':'#334155'} onClick={()=>setA(!a)} />
         <Box args={[1.2, 0.6, 0.6]} position={[0, -1.5, 0]} material-color={b?'#6366f1':'#334155'} onClick={()=>setB(!b)} />
         <SmartText position={[0, 2.2, 0]} fontSize={0.3} color="white">Input A</SmartText>
         <SmartText position={[0, -2.2, 0]} fontSize={0.3} color="white">Input B</SmartText>
      </group>

      <group position={[0, 0, 0]}>
         <Box args={[2, 2, 2]} material-color="#3b82f6" material-wireframe />
         <SmartText position={[0, 1.5, 1.1]} fontSize={0.4} color="#60a5fa">{gates[gate]}</SmartText>
      </group>

      <group position={[4, 0, 0]}>
         <Sphere args={[1.5]}>
            <meshStandardMaterial 
              color={out?'#ef4444':'#1e293b'} 
              emissive="#ef4444" 
              emissiveIntensity={out?10:0} 
              toneMapped={false}
            />
         </Sphere>
         <SmartText position={[0, -2, 0]} fontSize={0.3} color={out?'#ef4444':'#94a3b8'}>OUTPUT: {out?'HIGH':'LOW'}</SmartText>
      </group>

      <SafeLine points={[[-2.4, 1.5, 0], [-1, 0.5, 0]]} color="#6366f1" lineWidth={3} />
      <SafeLine points={[[-2.4, -1.5, 0], [-1, -0.5, 0]]} color="#6366f1" lineWidth={3} />
      <SafeLine points={[[1, 0, 0], [2.5, 0, 0]]} color={out?"#ef4444":"#334155"} lineWidth={3} />
    </SimLayout>
  );
}

// ==========================================
// 4. BIOLOGY LAB 3D
// ==========================================
function BioCell(props: any) {
  const [zoom, setZoom] = useState(1);
  return (
    <SimLayout {...props} title="Eukaryotic Cell" desc="Organelle topological explorer rendering semi-permeable membranes." prompt="Explore the mitochondria"
      controls={<Slider label="Microscope Zoom" val={zoom} set={setZoom} min="1" max="3" step="0.1" unit="x" />}
    >
      <group scale={[zoom, zoom, zoom]}>
        <Sphere args={[5, 64, 64]}>
          <meshPhysicalMaterial color="#34d399" transmission={0.9} opacity={0.3} transparent roughness={0.1} />
        </Sphere>
        <group>
          <Sphere args={[1.5, 32, 32]}>
             <meshStandardMaterial color="#a78bfa" emissive="#581c87" emissiveIntensity={0.5} />
          </Sphere>
          <SmartText position={[0, 2, 0]} fontSize={0.3} color="white">NUCLEUS</SmartText>
        </group>
        {[...Array(5)].map((_, i) => (
          <group key={i} position={[Math.sin(i*1.2)*3, Math.cos(i*1.2)*3, Math.sin(i)*2]}>
            <Cylinder args={[0.3, 0.3, 1]} rotation={[1,1,0]}>
               <meshStandardMaterial color="#fb923c" emissive="#fb923c" emissiveIntensity={0.5} />
            </Cylinder>
          </group>
        ))}
      </group>
    </SimLayout>
  );
}

function BioDNAInner({ mutation }: { mutation: number }) {
  const group = useRef<THREE.Group>(null);
  const basePairs = useMemo(() => {
    const pairs = [];
    for (let i = 0; i < 30; i++) {
       pairs.push({ y: (i-15)*0.5, rot: i*0.4, type: i%4 });
    }
    return pairs;
  }, []);

  useFrame(({ clock }) => group.current && (group.current.rotation.y = clock.getElapsedTime() * 0.5));
  
  return (
    <group ref={group}>
      {basePairs.map((p, i) => (
        <group key={i} position={[0, p.y, 0]} rotation={[0, p.rot + mutation, 0]}>
          <Sphere args={[0.2]} position={[2, 0, 0]} material-color="#10b981" />
          <Sphere args={[0.2]} position={[-2, 0, 0]} material-color="#8b5cf6" />
          <Box args={[4, 0.08, 0.08]}>
             <meshStandardMaterial color={p.type < 2 ? "#ef4444" : "#3b82f6"} emissive={p.type < 2 ? "#ef4444" : "#3b82f6"} emissiveIntensity={0.2} />
          </Box>
        </group>
      ))}
    </group>
  );
}

function BioDNA(props: any) {
  const [mutation, setMutation] = useState(0);
  return (
    <SimLayout {...props} title="DNA Replication" desc="Helicase mathematical double-helix simulation structure." prompt="Analyze nucleotide pairs"
       controls={<div className="flex gap-2"><Slider label="Helix Torsion" val={mutation} set={setMutation} min="0" max="6.28" unit="rad" /></div>}
    >
       <BioDNAInner mutation={mutation} />
    </SimLayout>
  );
}

function BioEcosystemInner() {
  const predators = useRef<THREE.InstancedMesh>(null);
  const preys = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
     const t = clock.getElapsedTime();
     if(predators.current && preys.current) {
        for(let i=0; i<5; i++) {
           dummy.position.set(Math.sin(t+i)*4, 0, Math.cos(t+i*2)*4);
           dummy.updateMatrix();
           predators.current.setMatrixAt(i, dummy.matrix);
        }
        for(let i=0; i<20; i++) {
           dummy.position.set(Math.sin(t*2+i*3)*6, 0, Math.cos(t*1.5+i)*6);
           dummy.updateMatrix();
           preys.current.setMatrixAt(i, dummy.matrix);
        }
        predators.current.instanceMatrix.needsUpdate = true;
        preys.current.instanceMatrix.needsUpdate = true;
     }
  });

  return (
    <>
       <Box args={[15, 0.5, 15]} position={[0,-0.25,0]} material-color="#14532d" />
       <instancedMesh ref={predators} args={[new THREE.BoxGeometry(0.5,0.5,0.5), new THREE.MeshStandardMaterial({color:'#ef4444'}), 5]} />
       <instancedMesh ref={preys} args={[new THREE.SphereGeometry(0.2), new THREE.MeshStandardMaterial({color:'#3b82f6'}), 20]} />
    </>
  );
}

function BioEcosystem(props: any) {
  return (
    <SimLayout {...props} title="Lotka-Volterra Ecosystem" desc="Agent-based predator-prey roaming simulator." prompt="Observe population curves">
       <BioEcosystemInner />
    </SimLayout>
  );
}

// ==========================================
// 5. MATHEMATICS LAB 3D
// ==========================================
function MathSurfaceInner({ freq }: { freq: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geom = useMemo(() => new THREE.PlaneGeometry(15, 15, 80, 80), []);
  
  useFrame(({ clock }) => {
    if(!meshRef.current) return;
    const t = clock.getElapsedTime() * 2;
    const pos = meshRef.current.geometry.attributes.position as any;
    for(let i=0; i<pos.count; i++) {
       const x = pos.getX(i);
       const z = pos.getZ(i);
       const r = Math.sqrt(x*x + z*z);
       // Ripple wave physics
       pos.setY(i, Math.sin(r * freq - t) * (1 / (r + 1)) * 4);
    }
    pos.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} geometry={geom} rotation={[-Math.PI / 2, 0, 0]}>
      <meshStandardMaterial color="#fbbf24" wireframe emissive="#b45309" emissiveIntensity={1} />
    </mesh>
  );
}

function MathSurface(props: any) {
  const [freq, setFreq] = useState(2);

  useEffect(() => {
    const handler = (e: any) => { if (e.detail?.command === 'RUN_SIMULATION') setFreq(f => f >= 5 ? 1 : f + 0.5); };
    window.addEventListener('app-voice-command', handler);
    return () => window.removeEventListener('app-voice-command', handler);
  }, []);

  return (
    <SimLayout {...props} title="3D Calculus Plotter" desc="Topological sine-wave generation rendering mathematical vertices." prompt="Increase wave frequency"
      controls={<Slider label="Frequency" val={freq} set={setFreq} min="1" max="5" step="0.1" />}
    >
      <MathSurfaceInner freq={freq} />
    </SimLayout>
  );
}

function MathMatrix(props: any) {
  const [s, setS] = useState(1);
  const [r, setR] = useState(0);
  const [shear, setShear] = useState(0);

  useEffect(() => {
    const handler = (e: any) => { if (e.detail?.command === 'RUN_SIMULATION') { setS(1.5); setR(45); } };
    window.addEventListener('app-voice-command', handler);
    return () => window.removeEventListener('app-voice-command', handler);
  }, []);

  const matrix = useMemo(() => {
    const rad = (r * Math.PI) / 180;
    return [
      [Math.cos(rad) * s, -Math.sin(rad) * s + shear],
      [Math.sin(rad) * s, Math.cos(rad) * s]
    ];
  }, [s, r, shear]);

  return (
    <SimLayout {...props} title="Matrix Transformations" desc="Real-time multi-dimensional transformation scalar math. Visualize linear mappings, rotations, and shear." prompt="Transform the coordinate space"
      controls={<div className="space-y-4">
        <Slider label="Scalar Scale (S)" val={s} set={setS} min="0.5" max="2.5" step="0.1" unit="x" />
        <Slider label="Rotation (θ)" val={r} set={setR} min="0" max="360" unit="°" />
        <Slider label="Shear (k)" val={shear} set={setShear} min="-1" max="1" step="0.1" unit="k" />
        
        <div className="bg-black/40 p-3 rounded-xl border border-white/10 font-mono text-[10px]">
           <div className="text-zinc-500 mb-2 uppercase">Transformation Matrix</div>
           <div className="grid grid-cols-2 gap-2 text-center text-indigo-400">
              <div className="p-1 border border-indigo-500/20 rounded">[{matrix[0][0].toFixed(2)}]</div>
              <div className="p-1 border border-indigo-500/20 rounded">[{matrix[0][1].toFixed(2)}]</div>
              <div className="p-1 border border-indigo-500/20 rounded">[{matrix[1][0].toFixed(2)}]</div>
              <div className="p-1 border border-indigo-500/20 rounded">[{matrix[1][1].toFixed(2)}]</div>
           </div>
        </div>
      </div>}
    >
      <gridHelper args={[20, 20, '#444', '#222']} position={[0, -0.01, 0]} />
      <Box args={[2, 2, 2]} scale={[s, s, s]} rotation={[0, r * Math.PI/180, 0]}>
         <meshStandardMaterial color="#fbbf24" wireframe emissive="#fbbf24" emissiveIntensity={0.5}/>
      </Box>
      {/* Transformation vectors */}
      <SafeLine points={[[0,0,0], [matrix[0][0]*2, matrix[1][0]*2, 0]]} color="#60a5fa" lineWidth={3} />
      <SafeLine points={[[0,0,0], [matrix[0][1]*2, matrix[1][1]*2, 0]]} color="#f472b6" lineWidth={3} />
    </SimLayout>
  );
}

function MathProbabilityInner({ trig, diceCount }: { trig: number, diceCount: number }) {
  const diceRefs = useRef<THREE.Mesh[]>([]);
  const [results, setResults] = useState<number[]>([]);

  useEffect(() => {
    if (trig > 0) {
      const newResults = Array.from({ length: diceCount }, () => Math.floor(Math.random() * 6) + 1);
      setResults(newResults);
    }
  }, [trig, diceCount]);

  useFrame((_, delta) => {
    if (trig > 0) {
      diceRefs.current.forEach((mesh, i) => {
         if (!mesh) return;
         // Procedural bouncing math
         const bounce = Math.abs(Math.sin((Date.now()/200) + i)) * 3;
         if (bounce > 0.1) {
            mesh.position.y = bounce;
            mesh.rotation.x += delta * (i+5);
            mesh.rotation.y += delta * (i+10);
         } else {
            mesh.position.y = 0.5;
            // Snapping to faces is complex, we just pretend
         }
      });
    }
  });

  return (
    <>
      <gridHelper args={[20, 20]} position={[0, -0.5, 0]} />
      <Box args={[20, 1, 20]} position={[0, -1, 0]} material-color="#111" />
      {[...Array(diceCount)].map((_, i) => (
        <group key={i} position={[i*2.5 - (diceCount-1)*1.25, 0.5, 0]}>
          <Box ref={(el:any) => diceRefs.current[i] = el} args={[1, 1, 1]}>
            <meshStandardMaterial color="#ef4444" emissive="#7f1d1d" emissiveIntensity={0.5} />
          </Box>
          <SmartText position={[0, 1.5, 0]} fontSize={0.3} color="white" name="Dice Outcome" description="The stochastic result of a pseudo-random number generation event.">{results[i] || '?'}</SmartText>
        </group>
      ))}
    </>
  );
}

function MathProbability(props: any) {
  const [trig, setTrig] = useState(0);
  const [diceCount, setDiceCount] = useState(3);

  useEffect(() => {
    const handler = (e: any) => { if (e.detail?.command === 'RUN_SIMULATION') setTrig(t => t + 1); };
    window.addEventListener('app-voice-command', handler);
    return () => window.removeEventListener('app-voice-command', handler);
  }, []);

  return (
    <SimLayout {...props} title="Stochastic Probability" desc="Procedural random-generation bounce simulation mapping bell curves. Analyze the law of large numbers and entropy." prompt="Execute trial"
      controls={<div className="space-y-4">
        <Slider label="Trial Size (n)" val={diceCount} set={setDiceCount} min="1" max="6" step="1" unit="qty" />
        <div className="flex gap-2">
           <button onClick={()=>setTrig(t=>t+1)} className="flex-1 py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-black uppercase tracking-widest shadow-xl transition-all active:scale-95">ROLL DICE</button>
           <button onClick={()=>setTrig(0)} className="px-4 py-4 bg-zinc-800 text-white rounded-xl"><RotateCcw size={18}/></button>
        </div>
      </div>}
    >
      <MathProbabilityInner trig={trig} diceCount={diceCount} />
    </SimLayout>
  );
}


// ==========================================
// MASTER EXPORT RENDERER
// ==========================================
function SimulationTransition({ activeExperiment, refreshKey }: any) {
  const getSimulation = (id: string) => {
    switch (id) {
      // PHYSICS
      case 'phys1': return <PhysOhmsLawLab key={refreshKey} />;
      case 'phys2': return <PhysPendulumLab key={refreshKey} />;
      case 'phys3': return <PhysOptics key={refreshKey} />;
      case 'phys4': return <PhysNewtonLab key={refreshKey} />;
      case 'phys5': return <PhysReflection key={refreshKey} />;
      
      // CHEMISTRY
      case 'chem1': return <ChemTitration key={refreshKey} />;
      case 'chem2': return <ChemOrganic key={refreshKey} />;
      case 'chem3': return <ChemElectrolysis key={refreshKey} />;
      case 'chem4': return <ChemMolecularLab key={refreshKey} />;
      case 'chem5': return <ChemFusionLab key={refreshKey} />;

      // BIOLOGY
      case 'bio1': return <BioCell key={refreshKey} />;
      case 'bio2': return <BioDNA key={refreshKey} />;
      case 'bio3': return <BioEcosystem key={refreshKey} />;
      case 'bio5': return <BioViralLab key={refreshKey} />;

      // MATH
      case 'math1': return <MathSurface key={refreshKey} />;
      case 'math2': return <MathMatrix key={refreshKey} />;
      case 'math3': return <MathProbability key={refreshKey} />;
      case 'math4': return <MathChaosLab key={refreshKey} />;
      case 'math5': return <MathFractalExplorer key={refreshKey} />;

      // ELECTRONICS
      case 'elec1': return <ElecOhms key={refreshKey} />;
      case 'elec2': return <ElecSeriesParallel key={refreshKey} />;
      case 'elec4': return <ElecCapacitance key={refreshKey} />;
      case 'elec5': return <ElecLogic key={refreshKey} />;
      
      default: return null;
    }
  };

  const transitions = useTransition(activeExperiment, {
    from: { scale: 0.995, opacity: 0 },
    enter: { scale: 1, opacity: 1 },
    leave: { scale: 1.005, opacity: 0 },
    config: { duration: 50 },
    keys: activeExperiment,
  });

  return transitions((style, item) => {
    const sim = getSimulation(item);
    if (!sim) return null;
    const isPhysics = ['phys1', 'phys2', 'phys3', 'phys4', 'phys5', 'phys6', 'phys7', 'math3', 'math4', 'math5'].includes(item);

    return (
      <animated.group 
        scale={style.scale}
      >
        {isPhysics ? (
          <Physics gravity={[0, -9.81, 0]}>
            {React.cloneElement(sim as any, { isContentOnly: true })}
          </Physics>
        ) : (
          React.cloneElement(sim as any, { isContentOnly: true })
        )}
      </animated.group>
    );
  });
}

function ElecCapacitanceInner({ isCharging, charge, setCharge, setData, resistance, capacitance }: any) {
  useFrame((state, delta) => {
    // tau in seconds = R(kOhm) * C(uF) / 1000
    const tau = (resistance * capacitance) / 1000;
    
    setCharge((currentCharge: number) => {
      let nextCharge = currentCharge;
      if (isCharging) {
        // dV/dt = (V0 - V) / tau  => nextV = V + (1 - V) * (dt/tau)
        nextCharge = currentCharge + (1 - currentCharge) * (delta / tau);
        if (nextCharge > 0.999) nextCharge = 1;
      } else {
        // dV/dt = -V / tau => nextV = V - V * (dt/tau)
        nextCharge = currentCharge - currentCharge * (delta / tau);
        if (nextCharge < 0.001) nextCharge = 0;
      }
      return nextCharge;
    });

    setData((prev: any) => [...prev.slice(-99), charge]);
  });

  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Cylinder args={[1, 1, 2.5, 32]} position={[0, 1.25, 0]} rotation={[0, 0, 0]}>
          <meshStandardMaterial color="#27272a" metalness={0.8} roughness={0.2} />
        </Cylinder>
        {/* Electrolytic Stripe */}
        <mesh position={[0, 1.25, 1.01]}>
          <planeGeometry args={[0.5, 2.5]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <SmartText position={[0, 1.25, 1.02]} fontSize={0.2} color="#18181b" font="/fonts/Inter-Bold.ttf" anchorX="center" anchorY="middle">
          {capacitance}μF
        </SmartText>
        
        {/* Terminals */}
        <Box args={[1.8, 0.05, 0.05]} position={[0, 2.5, 0]} material-color="#a1a1aa" />
        <Box args={[0.05, 0.5, 0.05]} position={[0.8, 2.75, 0]} material-color="#a1a1aa" />
        <Box args={[0.05, 0.5, 0.05]} position={[-0.8, 2.75, 0]} material-color="#a1a1aa" />

        {/* Charge Visualization - Glow inside */}
        <Sphere args={[0.9, 32, 32]} position={[0, 1.25, 0]}>
          <meshBasicMaterial color="#0ea5e9" transparent opacity={charge * 0.4} />
        </Sphere>
      </Float>
      
      <pointLight position={[0, 3, 2]} intensity={Math.max(0.2, charge * 15)} color="#38bdf8" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </group>
  );
}

function ElecCapacitance(props: any) {
  const [isCharging, setIsCharging] = useState(false);
  const [charge, setCharge] = useState(0);
  const [resistance, setResistance] = useState(50); // kOhms
  const [capacitance, setCapacitance] = useState(100); // uF
  const [data, setData] = useState<number[]>([]);

  const tau = (resistance * capacitance) / 1000;

  return (
    <SimLayout {...props} title="RC Circuit Dynamics" desc="Explore the exponential charging and discharging curves of a capacitor." prompt="Toggle Charge/Discharge"
      controls={<div className="space-y-4">
        <div className="bg-zinc-900/50 p-3 rounded-xl border border-white/5 space-y-3">
          <Slider label="Resistance (R)" val={resistance} set={setResistance} min={10} max={200} unit=" kΩ" />
          <Slider label="Capacitance (C)" val={capacitance} set={setCapacitance} min={10} max={1000} unit=" μF" />
          
          <div className="pt-2 border-t border-white/5 flex justify-between items-center">
            <span className="text-[10px] text-zinc-400 font-medium">Time Constant (τ)</span>
            <span className="text-xs font-mono text-cyan-400 font-bold">{tau.toFixed(3)}s</span>
          </div>
        </div>

        <button 
          onClick={() => setIsCharging(!isCharging)} 
          className={`w-full py-4 rounded-xl font-black uppercase transition-all shadow-xl flex items-center justify-center gap-2 ${
            isCharging 
              ? 'bg-amber-500 hover:bg-amber-400 text-amber-950 shadow-amber-500/20' 
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
          }`}
        >
          {isCharging ? <RotateCcw size={18} /> : <Play size={18} />}
          {isCharging ? 'Discharge Capacitor' : 'Start Charging'}
        </button>

        <div className="space-y-2">
          <div className="flex justify-between text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
            <span>Voltage Curve</span>
            <span>{(charge * 10).toFixed(2)}V</span>
          </div>
          <div className="h-32 bg-black/60 border border-white/10 rounded-xl p-2 relative overflow-hidden flex items-end gap-[1px]">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none opacity-20">
              <div className="border-t border-white/50 w-full" />
              <div className="border-t border-white/50 w-full" />
              <div className="border-t border-white/50 w-full" />
            </div>
            {data.map((v, i) => (
              <motion.div 
                key={i} 
                className="flex-1 bg-gradient-to-t from-cyan-600 to-cyan-300 rounded-t-sm" 
                style={{ height: `${v * 100}%` }} 
                initial={false}
              />
            ))}
            {/* Tau markers */}
            {isCharging && charge > 0.63 && (
              <div className="absolute left-[63%] top-0 bottom-0 border-l border-amber-500/50 border-dashed flex items-start">
                <span className="text-[8px] text-amber-500 px-1 bg-black/80 rounded">1τ (63.2%)</span>
              </div>
            )}
          </div>
        </div>
      </div>}
    >
      <ElecCapacitanceInner 
        isCharging={isCharging} 
        charge={charge} 
        setCharge={setCharge} 
        setData={setData} 
        resistance={resistance}
        capacitance={capacitance}
      />
    </SimLayout>
  );
}

function ElecSeriesParallel(props: any) {
  const [mode, setMode] = useState<'series' | 'parallel'>('series');
  const volts = 3;
  const r = 10;
  const current = mode === 'series' ? volts / (r * 2) : (volts / r) * 2;

  return (
    <SimLayout {...props} title="Topology Analysis" desc="Switch between series and parallel configurations and observe the change in load power." prompt="Switch configuration"
      controls={<div className="space-y-4">
        <div className="flex gap-2">
          <button onClick={() => setMode('series')} className={`flex-1 py-2 rounded-lg border font-bold ${mode === 'series' ? 'bg-indigo-500/20 border-indigo-500' : 'bg-zinc-800'}`}>SERIES</button>
          <button onClick={() => setMode('parallel')} className={`flex-1 py-2 rounded-lg border font-bold ${mode === 'parallel' ? 'bg-emerald-500/20 border-emerald-500' : 'bg-zinc-800'}`}>PARALLEL</button>
        </div>
        <div className="p-4 bg-black/40 rounded-xl border border-white/10 text-center">
          <div className="text-[10px] text-zinc-500 uppercase tracking-tighter">System Current Draw</div>
          <div className="text-2xl font-black text-white">{(current * 1000).toFixed(0)} mA</div>
        </div>
      </div>}
    >
      <group>
        {[0, 1].map(i => (
          <group key={i} position={mode === 'series' ? [i * 3 - 1.5, 0, 0] : [0, 0, i * 3 - 1.5]}>
            <Cylinder args={[0.4, 0.4, 0.6]} position={[0, -0.3, 0]} material-color="#333" />
            <Sphere args={[0.5]}>
              <meshStandardMaterial color="#fff" transparent opacity={0.3} />
            </Sphere>
            <pointLight intensity={mode === 'series' ? 2 : 5} color="#fbbf24" />
          </group>
        ))}
      </group>
    </SimLayout>
  );
}

const Fallback = (props: any) => (
  <SimLayout 
     {...props}
     title="Simulation Under Construction" 
     desc="This module is being upgraded to version 2.0."
     prompt="Check back later"
     controls={<div className="p-4 bg-black/40 text-zinc-400 text-xs text-center border border-white/10 rounded-xl">Module Offline</div>}
  >
    <Box material-color="#555" material-wireframe args={[2, 2, 2]} />
  </SimLayout>
);

const PhysNewtonContent = ({ force, mass, isSimulating }: any) => {
  const boxRef = useRef<THREE.Mesh>(null);
  const velocity = useRef(0);

  useFrame((state, delta) => {
    if (isSimulating && boxRef.current) {
      const acceleration = force / mass;
      velocity.current += acceleration * delta * 0.1;
      boxRef.current.position.x += velocity.current * delta;
      
      if (boxRef.current.position.x > 10) {
        boxRef.current.position.x = -10;
        velocity.current = 0;
      }
    } else if (!isSimulating && boxRef.current) {
      boxRef.current.position.x = 0;
      velocity.current = 0;
    }
  });

  return (
    <group>
      <gridHelper args={[40, 40, '#222', '#111']} rotation={[Math.PI/2, 0, 0]} position={[0, 0, -0.5]} />
      <mesh ref={boxRef}>
        <boxGeometry args={[mass * 0.4, mass * 0.4, mass * 0.4]} />
        <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.2} />
      </mesh>
      <SmartText position={[0, 4, 0]} fontSize={0.6} color="white">F = ma</SmartText>
      <SmartText position={[0, 3.2, 0]} fontSize={0.3} color="#818cf8" name="System Metrics" description="Real-time calculation of Newtonian physics showing force-mass-acceleration proportionality.">
        Force: {force}N | Mass: {mass}kg | Accel: {(force/mass).toFixed(2)}m/s²
      </SmartText>
    </group>
  );
};

const PhysNewtonLab = (props: any) => {
  const [force, setForce] = useState(10);
  const [mass, setMass] = useState(2);
  const [isSimulating, setIsSimulating] = useState(false);

  return (
    <SimLayout 
      {...props}
      title="Newton's Second Law" 
      desc="Explore the relationship between Force, Mass, and Acceleration (F = ma)."
      prompt="Exert Force"
      controls={
        <div className="space-y-4">
          <Slider label="Net Force (N)" val={force} set={setForce} min={1} max={50} unit="N" />
          <Slider label="Object Mass (kg)" val={mass} set={setMass} min={1} max={10} unit="kg" />
          <button 
            onClick={() => setIsSimulating(!isSimulating)}
            className={`w-full py-3 rounded-xl font-bold uppercase transition-all ${isSimulating ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'}`}
          >
            {isSimulating ? 'Reset System' : 'Apply Constant Force'}
          </button>
          <div className="p-3 bg-black/40 rounded-lg border border-white/5 text-[10px] font-mono text-zinc-400">
             <div>Acceleration = {(force/mass).toFixed(2)} m/s²</div>
          </div>
        </div>
      }
    >
      <PhysNewtonContent force={force} mass={mass} isSimulating={isSimulating} />
    </SimLayout>
  );
};

function PhysReflectionContent({ angle, showNormal, showProtractor }: { angle: number, showNormal: boolean, showProtractor: boolean }) {
  const angleRad = (angle * Math.PI) / 180;
  const r = 8;
  const laserX = -r * Math.sin(angleRad);
  const laserY = r * Math.cos(angleRad);
  const reflectedX = r * Math.sin(angleRad);
  const reflectedY = r * Math.cos(angleRad);

  return (
    <>
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      
      {/* Plane Mirror */}
      <group position={[0, -0.1, 0]}>
        <Box args={[10, 0.2, 3]} material-color="#1e293b" />
        <Box args={[9.8, 0.22, 2.8]} position={[0, 0.01, 0]}>
          <meshPhysicalMaterial 
            transmission={0.9} 
            opacity={0.8} 
            transparent 
            roughness={0.05} 
            metalness={0.9} 
            color="#cbd5e1"
            envMapIntensity={2.5}
          />
        </Box>
        <SmartText position={[0, 0.2, 1.6]} fontSize={0.25} color="#94a3b8" rotation={[-Math.PI/2, 0, 0]}>PLANE MIRROR</SmartText>
      </group>

      {/* Incident Emitter Laser Box */}
      <group position={[laserX, laserY, 0]} rotation={[0, 0, -angleRad]}>
        <Box args={[1.5, 0.6, 0.6]} material-color="#0f172a" />
        <Cylinder args={[0.2, 0.2, 0.4]} position={[0.75, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <meshBasicMaterial color="#38bdf8" />
        </Cylinder>
        <pointLight color="#38bdf8" intensity={1.5} distance={2} />
      </group>

      {/* Incident Ray Line */}
      <SafeLine points={[[laserX, laserY, 0], [0, 0, 0]]} color="#38bdf8" lineWidth={3.5} />
      
      {/* Reflected Ray Line */}
      <SafeLine points={[[0, 0, 0], [reflectedX, reflectedY, 0]]} color="#f43f5e" lineWidth={3.5} />

      {/* Normal Reference Line */}
      {showNormal && (
        <>
          <SafeLine points={[[0, 0, 0], [0, 8, 0]]} color="#94a3b8" lineWidth={1.5} dashed dashSize={0.2} gapSize={0.1} />
          <group position={[0.3, 7.5, 0]}>
            <SmartText fontSize={0.25} color="#94a3b8">Normal (N)</SmartText>
          </group>
        </>
      )}

      {/* Protractor Tick Scale */}
      {showProtractor && (
        <group position={[0, 0.05, -0.1]} rotation={[0, 0, 0]}>
          {Array.from({ length: 19 }).map((_, idx) => {
            const deg = idx * 10 - 90;
            const rad = (deg * Math.PI) / 180;
            const isLabel = deg % 30 === 0;
            return (
              <group key={idx}>
                <SafeLine 
                  points={[[4.7 * Math.sin(rad), 4.7 * Math.cos(rad), 0], [5 * Math.sin(rad), 5 * Math.cos(rad), 0]]} 
                  color={deg === 0 ? "#ef4444" : "#475569"} 
                  lineWidth={deg === 0 ? 3 : 1.5} 
                />
                {isLabel && (
                  <group position={[4.2 * Math.sin(rad), 4.2 * Math.cos(rad), 0]}>
                    <SmartText fontSize={0.22} color="#64748b" center>{Math.abs(deg)}°</SmartText>
                  </group>
                )}
              </group>
            );
          })}
          <SafeLine 
            points={Array.from({ length: 37 }).map((_, idx) => {
              const rad = ((idx * 5 - 90) * Math.PI) / 180;
              return [5 * Math.sin(rad), 5 * Math.cos(rad), 0];
            })} 
            color="#475569" 
            lineWidth={1.5} 
          />
        </group>
      )}

      {/* Dynamic photon flow */}
      <SimPhotonParticles angle={angle} active={true} />

      {/* Ray labels */}
      <group position={[laserX / 2 - 1.2, laserY / 2 + 0.3, 0.2]}>
        <SmartText fontSize={0.28} color="#38bdf8">Incident Ray</SmartText>
        <SmartText position={[0, -0.3, 0]} fontSize={0.24} color="#0284c7">i = {angle}°</SmartText>
      </group>

      <group position={[reflectedX / 2 + 0.2, reflectedY / 2 + 0.3, 0.2]}>
        <SmartText fontSize={0.28} color="#f43f5e">Reflected Ray</SmartText>
        <SmartText position={[0, -0.3, 0]} fontSize={0.24} color="#e11d48">r = {angle}°</SmartText>
      </group>

      {/* Point of Incidence dot */}
      <Sphere args={[0.1]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#ef4444" />
      </Sphere>

      {/* Air verification message */}
      <group position={[0, 5.5, 0]}>
        <SmartText fontSize={0.35} color="#10b981" center>∠i = ∠r ({angle}° = {angle}°)</SmartText>
        <SmartText position={[0, -0.3, 0]} fontSize={0.22} color="#34d399" center>Law of Reflection Verified</SmartText>
      </group>

      <gridHelper args={[24, 24, '#111', '#050505']} position={[0, -5, 0]} />
    </>
  );
}

function SimPhotonParticles({ angle, active }: { angle: number, active: boolean }) {
  const particles = useMemo(() => Array.from({ length: 16 }, () => Math.random()), []);
  const ref = useRef<THREE.Group>(null);
  const angleRad = (angle * Math.PI) / 180;
  const r = 8;

  useFrame(({ clock }) => {
    if (!ref.current || !active) return;
    const elapsed = clock.getElapsedTime();
    ref.current.children.forEach((child, i) => {
      const t = (elapsed * 0.8 + particles[i]) % 1.0;
      if (t < 0.5) {
        const pct = t / 0.5;
        const startX = -r * Math.sin(angleRad);
        const startY = r * Math.cos(angleRad);
        const px = startX * (1 - pct);
        const py = startY * (1 - pct);
        child.position.set(px, py, 0);
      } else {
        const pct = (t - 0.5) / 0.5;
        const endX = r * Math.sin(angleRad);
        const endY = r * Math.cos(angleRad);
        const px = endX * pct;
        const py = endY * pct;
        child.position.set(px, py, 0);
      }
    });
  });

  return (
    <group ref={ref}>
      {active && particles.map((_, i) => (
        <Sphere key={i} args={[0.045, 8, 8]}>
          <meshBasicMaterial color={i < 8 ? "#67e8f9" : "#fda4af"} transparent opacity={0.7} />
        </Sphere>
      ))}
    </group>
  );
}

function PhysReflection(props: any) {
  const [angle, setAngle] = useState(45);
  const [showNormal, setShowNormal] = useState(true);
  const [showProtractor, setShowProtractor] = useState(true);

  if (props.isUiOnly) {
    return (
      <div className="absolute top-20 right-6 w-80 crystal-glass p-5 rounded-3xl border border-white/10 shadow-2xl pointer-events-auto space-y-6 z-40 bg-zinc-900/90 text-white font-sans">
        <div>
          <div className="flex justify-between items-center mb-1">
             <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Angle of Incidence (∠i)</h3>
             <span className="text-indigo-400 font-mono text-base font-bold">{angle}°</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="80" 
            step="1" 
            value={angle} 
            onChange={(e) => setAngle(parseInt(e.target.value))} 
            className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
          />
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-xs text-zinc-400">Show Normal Reference Line</span>
            <input 
              type="checkbox" 
              checked={showNormal} 
              onChange={() => setShowNormal(!showNormal)} 
              className="sr-only peer" 
            />
            <div className="relative w-8 h-4 bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-zinc-400 after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:bg-white" />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-xs text-zinc-400">Show Protractor Overlay Dial</span>
            <input 
              type="checkbox" 
              checked={showProtractor} 
              onChange={() => setShowProtractor(!showProtractor)} 
              className="sr-only peer" 
            />
            <div className="relative w-8 h-4 bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-zinc-400 after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:bg-white" />
          </label>
        </div>

        <div className="pt-2">
          <div className="flex gap-2">
            <button 
              onClick={() => setAngle(30)}
              className="flex-1 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-[9px] font-bold tracking-wide uppercase transition-colors"
            >
              30° Angle
            </button>
            <button 
              onClick={() => setAngle(45)}
              className="flex-1 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-[9px] font-bold tracking-wide uppercase transition-colors"
            >
              45° Angle
            </button>
            <button 
              onClick={() => setAngle(60)}
              className="flex-1 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-[9px] font-bold tracking-wide uppercase transition-colors"
            >
              60° Angle
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SimLayout 
      {...props} 
      title="Law of Reflection Lab" 
      desc="Investigate light ray reflection on a silvered plane mirror and verify the classic law ∠i = ∠r." 
      prompt="Rotate the laser emitter to adjust the incident angle"
      controls={
        <div className="space-y-4">
          <Slider label="Incident Angle" val={angle} set={setAngle} min="0" max="80" step="1" unit="°" />
        </div>
      }
    >
      <PhysReflectionContent angle={angle} showNormal={showNormal} showProtractor={showProtractor} />
    </SimLayout>
  );
}

export function LabSimulationRenderer({ activeExperiment }: { activeExperiment: string }) {
  const { theme, simulationCameraPosition, setSimulationCameraPosition, isARMode, toggleARMode } = useStore();
  const [refreshKey, setRefreshKey] = useState(0);

  const [store] = useState(() => createXRStore({
    controller: DefaultXRController,
    hand: DefaultXRHand,
  }));
  const isVRSupported = useXRSessionModeSupported('immersive-vr');
  const isARSupported = useXRSessionModeSupported('immersive-ar');
  
  useEffect(() => {
    const handleVoice = (e: any) => {
      const { command } = e.detail || {};
      if (command === 'RESET_SIMULATION' || command === 'Calibrate') {
        setRefreshKey(p => p + 1);
        console.log("Voice Command Received: Resetting Simulation");
      }
    };
    window.addEventListener('app-voice-command', handleVoice);
    return () => window.removeEventListener('app-voice-command', handleVoice);
  }, []);

  // Pre-calculate content for UI layer only
  const uiOnlySimulation = useMemo(() => {
    switch (activeExperiment) {
      // PHYSICS
      case 'phys1': return <PhysOhmsLawLab key={refreshKey} isUiOnly />;
      case 'phys2': return <PhysPendulumLab key={refreshKey} isUiOnly />;
      case 'phys3': return <PhysOptics key={refreshKey} isUiOnly />;
      case 'phys4': return <PhysNewtonLab key={refreshKey} isUiOnly />;
      case 'phys5': return <PhysReflection key={refreshKey} isUiOnly />;
      case 'chem1': return <ChemTitration key={refreshKey} isUiOnly />;
      case 'chem2': return <ChemOrganic key={refreshKey} isUiOnly />;
      case 'chem3': return <ChemElectrolysis key={refreshKey} isUiOnly />;
      case 'chem4': return <ChemMolecularLab key={refreshKey} isUiOnly />;
      case 'chem5': return <ChemFusionLab key={refreshKey} isUiOnly />;
      case 'bio1': return <BioCell key={refreshKey} isUiOnly />;
      case 'bio2': return <BioDNA key={refreshKey} isUiOnly />;
      case 'bio3': return <BioEcosystem key={refreshKey} isUiOnly />;
      case 'bio5': return <BioViralLab key={refreshKey} isUiOnly />;
      case 'math1': return <MathSurface key={refreshKey} isUiOnly />;
      case 'math2': return <MathMatrix key={refreshKey} isUiOnly />;
      case 'math3': return <MathProbability key={refreshKey} isUiOnly />;
      case 'math4': return <MathChaosLab key={refreshKey} isUiOnly />;
      case 'math5': return <MathFractalExplorer key={refreshKey} isUiOnly />;
      case 'elec1': return <ElecOhms key={refreshKey} isUiOnly />;
      case 'elec2': return <ElecSeriesParallel key={refreshKey} isUiOnly />;
      case 'elec4': return <ElecCapacitance key={refreshKey} isUiOnly />;
      case 'elec5': return <ElecLogic key={refreshKey} isUiOnly />;
      default: return null;
    }
  }, [activeExperiment, refreshKey]);

  if (!activeExperiment) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-black/60 rounded-3xl m-10 border border-white/5 shadow-2xl backdrop-blur-md">
         <Activity className="w-20 h-20 text-indigo-500/50 mb-4 animate-[pulse_3s_ease-in-out_infinite]" />
         <h2 className="text-2xl font-bold text-white mb-2 tracking-wide font-display">Waiting for Initialization...</h2>
         <p className="text-zinc-400 max-w-sm text-sm">Please select a simulation from the left panel to load the precise 3D environment engine.</p>
      </div>
    );
  }

  const isPhysics = ['phys1', 'phys2', 'phys3', 'phys4', 'phys5', 'phys6', 'phys7', 'math3', 'math4', 'math5'].includes(activeExperiment);

  return (
    <div className={`flex-1 relative w-full h-full ${isARMode ? 'bg-transparent' : 'bg-black'} transition-colors duration-500`}>
      {isARMode && (
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <Webcam audio={false} videoConstraints={{ facingMode: "environment" }} className="w-full h-full object-cover" />
        </div>
      )}
      {/* Simulation UI Layer (Outside Canvas) */}
      {uiOnlySimulation}

      {/* Centralized WebGL Canvas */}
      <div className="absolute inset-0 pointer-events-auto">
        <Canvas 
          shadows 
          camera={{ position: simulationCameraPosition }} 
          dpr={[1, 2]} 
          performance={{ min: 0.65 }}
          gl={{ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance",
            stencil: false,
            depth: true
          }}
        >
          <XR store={store}>
            <Suspense fallback={null}>
              <LabEnvironment />
              <SpatialHUD />
              <SimulationTransition activeExperiment={activeExperiment} refreshKey={refreshKey} />
              
              <EffectComposer>
                <Bloom 
                  luminanceThreshold={1.2} 
                  mipmapBlur 
                  intensity={0.8} 
                  radius={0.4} 
                />
                <ToneMapping />
              </EffectComposer>

              <AdaptiveDpr />
            </Suspense>
          </XR>
        </Canvas>
        
        <div className="absolute bottom-6 right-6 z-50 flex flex-col gap-3">
          <button 
            onClick={() => toggleARMode()}
            className={`px-4 py-3 ${isARMode ? 'bg-fuchsia-600 text-white shadow-[0_0_20px_rgba(192,38,211,0.3)]' : 'bg-black/60 text-zinc-400 border border-white/10 hover:bg-fuchsia-600 hover:text-white'} rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all`}
          >
            <Activity size={16} />
            {isARMode ? 'Exit AR' : 'Enter AR'}
          </button>
          {isVRSupported && (
            <button 
              onClick={() => store.enterVR()}
              className="px-4 py-3 bg-indigo-500 hover:bg-indigo-400 text-white rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all"
            >
              <Glasses size={16} />
              Spatial VR
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
