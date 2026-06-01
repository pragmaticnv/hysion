import React, { useRef, useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ArrowRight, Box, Cpu, Network, Sparkles, Shield, Database, Activity, Terminal, Globe, Layers, BrainCircuit, Brain } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { HyperVisionLogo } from './HyperVisionLogo';
import { ULTRA_SMOOTH_SPRING, SMOOTH_SPRING } from '../constants/animations';
import { useStore } from '../store/useStore';

// --- Futuristic 3D Background Elements ---

function PhotorealisticBrain({ isLight }: { isLight: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, colors, sizes } = useMemo(() => {
    // Ultra-dense particle count for MRI/volumetric photorealism
    const count = 220000;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const s = new Float32Array(count);
    
    let i = 0;
    // Generate inside a bounding box
    while (i < count) {
      const x = (Math.random() - 0.5) * 16;
      const y = (Math.random() - 0.5) * 16;
      const z = (Math.random() - 0.5) * 20;

      // Base anatomical structure
      const rX = 5.2;
      const rY = 5.5 + (y < 0 ? y * 0.15 : 0); 
      const rZ = 7.0 + (z < 0 ? z * 0.1 : z * 0.05); 
      
      // High frequency neural folds (Gyri and Sulci)
      const f1 = Math.sin(x*2.0)*Math.cos(y*2.0) + Math.cos(z*2.0)*Math.sin(x*2.0);
      const f2 = Math.sin(x*4.0)*Math.cos(y*4.0) + Math.cos(z*4.0)*Math.sin(x*4.0);
      const folds = f1 * 0.12 + f2 * 0.06;

      // Longitudinal fissure separation
      const split = Math.exp(-Math.abs(x) * 4.0) * (y > -1 ? 1.0 : (y > -3 ? (y+3)/2 : 0.0));

      // Implicit surfaces (SDF-like)
      const dCerebrum = Math.sqrt( (x*x)/(rX*rX) + (y*y)/(rY*rY) + (z*z)/(rZ*rZ) ) + folds + split * 0.25;
      const dCerebellum = Math.sqrt( (x*x)/(3.0*3.0) + ((y+4.5)*(y+4.5))/(2.0*2.0) + ((z+5.5)*(z+5.5))/(2.5*2.5) ) + (Math.sin(y*15)*0.04);
      const dStem = Math.sqrt( (x*x)/(0.8*0.8) + ((y+6)*(y+6))/(3.0*3.0) + ((z+1.5)*(z+1.5))/(0.8*0.8) );

      const isCerebrum = dCerebrum < 1.0;
      const isCerebellum = dCerebellum < 1.0;
      const isStem = dStem < 1.0;

      if (isCerebrum || isCerebellum || isStem) {
        const val = isCerebrum ? dCerebrum : (isCerebellum ? dCerebellum : dStem);
        const isSurface = val > 0.88;

        // Form an internal neural web with rejection sampling
        if (!isSurface && Math.random() > 0.035) continue;

        pos[i*3] = x;
        pos[i*3+1] = y + 2; 
        pos[i*3+2] = z;

        const c = new THREE.Color();
        if (isCerebrum) {
          if (isSurface) {
            c.setHSL(0.55 + Math.random() * 0.1, 0.8, 0.7 + Math.random() * 0.3);
          } else {
            c.setHSL(0.6 + Math.random() * 0.1, 0.7, 0.3 + Math.random() * 0.2);
          }
        } else if (isCerebellum) {
          c.setHSL(0.75 + Math.random() * 0.1, 0.9, isSurface ? 0.6 : 0.3);
        } else if (isStem) {
          c.setHSL(0.5 + Math.random() * 0.1, 0.8, 0.5);
        }

        // Add 1% ultra-bright neural nodes
        if (Math.random() > 0.99) {
          c.setHSL(0.0, 0.0, 1.0); // White hot sparks
          s[i] = Math.random() * 0.3 + 0.1;
        } else {
          s[i] = isSurface ? (Math.random() * 0.06 + 0.02) : (Math.random() * 0.03 + 0.01);
        }

        cols[i*3] = c.r; 
        cols[i*3+1] = c.g; 
        cols[i*3+2] = c.b;
        i++;
      }
    }
    return { positions: pos, colors: cols, sizes: s };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
        const t = state.clock.elapsedTime;
        pointsRef.current.rotation.y = t * 0.05;
        pointsRef.current.rotation.x = Math.sin(t * 0.1) * 0.05;
        pointsRef.current.rotation.z = Math.cos(t * 0.1) * 0.05;
    }
  });

  return (
    <Points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length/3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length/3} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={sizes.length} array={sizes} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial 
        transparent={true}
        depthWrite={false}
        blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
        vertexColors={true}
        vertexShader={`
          attribute float size;
          varying vec3 vColor;
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (350.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            float alpha = 1.0 - (dist * 2.0);
            alpha = pow(alpha, 1.3);
            vec3 finalColor = vColor;
            ${isLight ? 'finalColor = vec3(1.0) - vColor; // Invert for light mode\nfinalColor *= 0.8;' : ''}
            gl_FragColor = vec4(finalColor, alpha * ${isLight ? '1.5' : '0.9'});
          }
        `}
      />
    </Points>
  );
}

function WireframeNode({ position, color, scale, rotationSpeed, isLight }: { position: [number, number, number], color: string, scale: number, rotationSpeed: { x: number, y: number }, isLight: boolean }) {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += rotationSpeed.x * delta;
      ref.current.rotation.y += rotationSpeed.y * delta;
    }
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh>
        <icosahedronGeometry args={[2, 0]} />
        <meshBasicMaterial color={color} wireframe={true} transparent opacity={isLight ? 0.6 : 0.3} blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending} />
      </mesh>
      <Points>
        <icosahedronGeometry args={[2, 0]} />
        <PointMaterial color={color} size={0.15} transparent opacity={isLight ? 1 : 0.9} blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending} />
      </Points>
    </group>
  );
}

function Background3D({ isLight }: { isLight: boolean }) {
  return (
    <div className={`fixed inset-0 z-0 pointer-events-none ${isLight ? 'bg-zinc-50' : 'bg-black'} overflow-hidden`}>
      {/* Blueprint Grid Layers */}
      <div className={`absolute inset-0 grid-blueprint opacity-20 ${isLight ? 'invert' : ''}`} />
      <div className={`absolute inset-0 grid-blueprint-fine opacity-10 ${isLight ? 'invert' : ''}`} />
      
      {/* Scanline Effect */}
      <div className={`absolute inset-0 scanline opacity-10 ${isLight ? 'invert' : ''}`} />
      
      <Canvas 
        camera={{ position: [0, 0, 25], fov: 55 }}
        dpr={[1, 1]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        style={{ touchAction: 'none' }}
      >
        <ambientLight intensity={isLight ? 0.6 : 0.4} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={isLight ? 1.2 : 2} color={isLight ? "#f0f7ff" : "#6366f1"} />
        <pointLight position={[-10, -10, -5]} intensity={isLight ? 0.4 : 1} color={isLight ? "#e0f2fe" : "#d946ef"} />
        <directionalLight position={[0, 0, 10]} intensity={isLight ? 1 : 0.1} color={isLight ? "#ffffff" : "#ffffff"} />
        <PhotorealisticBrain isLight={isLight} />
        <WireframeNode position={[-18, -8, -5]} color={isLight ? "#0ea5e9" : "#00ffff"} scale={3} rotationSpeed={{ x: 0.12, y: 0.18 }} isLight={isLight} />
        <WireframeNode position={[18, 6, -10]} color={isLight ? "#d946ef" : "#ff00ff"} scale={4} rotationSpeed={{ x: -0.08, y: 0.15 }} isLight={isLight} />
      </Canvas>
    </div>
  );
}

function MouseGlow() {
  const [mouse, setMouse] = React.useState({ x: 0, y: 0 });
  
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div 
      className="fixed inset-0 pointer-events-none z-10"
      animate={{
        background: `radial-gradient(800px circle at ${mouse.x}px ${mouse.y}px, rgba(99, 102, 241, 0.05), transparent 40%)`
      }}
      transition={{ type: "tween", ease: "backOut", duration: 0.5 }}
    />
  );
}

const TechnicalOverlay = ({ isLight }: { isLight: boolean }) => (
  <div className={`fixed inset-0 pointer-events-none z-30 opacity-30 font-mono text-[10px] uppercase tracking-widest ${isLight ? 'text-zinc-600 mix-blend-multiply' : 'text-zinc-500 mix-blend-screen'} p-8 flex flex-col justify-between`}>
    <div className="flex justify-between items-start">
      <div className="space-y-1.5 opacity-50">
        <div>SYS.LATENCY: 0.12ms</div>
        <div>BANDWIDTH: 4.8 GB/s</div>
      </div>
      <div className="text-right space-y-1.5 opacity-50">
        <div>RENDER.ENGINE: ACTIVE</div>
        <div>VRAM.ALLOC: 2.4 GB</div>
      </div>
    </div>
    <div className="flex justify-between items-end">
      <div className="space-y-1.5 opacity-50">
        <div>CORE.SYSTEM v4.0</div>
        <div>NEURAL.LINK: STABLE</div>
      </div>
      <div className="text-right space-y-1.5 opacity-50">
        <div>TIME: {new Date().toISOString().split('T')[1].split('.')[0]}</div>
        <div>SECURE_ENVIRONMENT</div>
      </div>
    </div>
  </div>
);

const SystemBoot = ({ onComplete, isLight }: { onComplete: () => void, isLight: boolean }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const bootMessages = [
    "INITIALIZING_RUNTIME_ENVIRONMENT...",
    "HANDSHAKE_REMOTE_SERVER_V4.2...",
    "ALLOCATING_SYSTEM_BUFFERS...",
    "SYNCING_SPATIAL_MESH...",
    "VALIDATING_USER_CREDENTIALS...",
    "LOADING_HIGH_RES_ASSETS...",
    "SYSTEM_READY.",
  ];

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      if (current < bootMessages.length) {
        setLogs(prev => [...prev, bootMessages[current]]);
        setProgress(p => Math.min(p + (100 / bootMessages.length), 100));
        current++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 800);
      }
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8, ease: "circIn" }}
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center font-mono p-8 ${isLight ? 'bg-zinc-50 text-zinc-900' : 'bg-black text-white'}`}
    >
      <div className="w-full max-w-lg space-y-8">
        <div className="space-y-2">
          {logs.map((log, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`text-[10px] ${isLight ? 'text-emerald-600' : 'text-emerald-400/80'} flex gap-4`}
            >
              <span className={`${isLight ? 'text-zinc-500' : 'text-zinc-700'}`}>[{i.toString().padStart(2, '0')}]</span>
              <span>{log}</span>
            </motion.div>
          ))}
        </div>
        
        <div className="space-y-2">
          <div className={`flex justify-between text-[8px] ${isLight ? 'text-zinc-600' : 'text-zinc-500'} uppercase tracking-widest`}>
            <span>Core_Sync_Status</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className={`h-1 w-full overflow-hidden rounded-full border ${isLight ? 'bg-zinc-200 border-black/5' : 'bg-zinc-900 border-white/5'}`}>
            <motion.div 
              className={`h-full ${isLight ? 'bg-cyan-500 shadow-none' : 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]'}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface LandingPageProps {
  onStart: () => void;
  needsApiKey: boolean;
  onSelectKey: () => void;
}

export function LandingPage({ onStart, needsApiKey, onSelectKey }: LandingPageProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { theme } = useStore();
  const isLight = theme.id === 'white' || theme.id === 'ios-light';

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMousePos({ 
        x: (e.clientX / window.innerWidth - 0.5) * 20, 
        y: (e.clientY / window.innerHeight - 0.5) * 20 
      });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key="content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className={`fixed inset-0 z-[100] ${isLight ? 'bg-zinc-50 text-zinc-900' : 'bg-black text-white'} flex flex-col items-center overflow-y-auto overflow-x-hidden font-sans selection:bg-cyan-500/30 safe-top safe-bottom`}
      >
          <Background3D isLight={isLight} />
          <MouseGlow />
          <TechnicalOverlay isLight={isLight} />

          <motion.nav 
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={ULTRA_SMOOTH_SPRING}
            className="w-full flex justify-between items-center px-6 md:px-12 py-6 md:py-10 relative z-40"
          >
            <div className="flex items-center gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={SMOOTH_SPRING}
                className="cursor-pointer pointer-events-auto filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              >
                <HyperVisionLogo size="md" />
              </motion.div>
              <div className={`h-8 w-px ${isLight ? 'bg-black/10' : 'bg-white/10'}`} />
              <div className="flex flex-col">
                <span className={`text-[11px] font-medium tracking-widest ${isLight ? 'text-zinc-900' : 'text-white'} uppercase`}>Simulation Core</span>
                <span className={`text-[9px] font-medium tracking-widest ${isLight ? 'text-zinc-500' : 'text-zinc-500'} uppercase`}>Interactive Environment</span>
              </div>
            </div>
            
            <div className={`hidden xl:flex items-center gap-12 text-[10px] font-medium ${isLight ? 'text-zinc-500' : 'text-zinc-500'} uppercase tracking-widest`}>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Systems Active</span>
              </div>
              <div className="flex items-center gap-3">
                <Activity size={12} className="text-zinc-400" />
                <span>Latency: 0.12ms</span>
              </div>
            </div>

            <div className="flex items-center gap-6 pointer-events-auto">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-medium tracking-wide text-zinc-300 hover:text-white hover:bg-white/10 transition-all"
              >
                Access Portal
              </motion.button>
            </div>
          </motion.nav>

          <div className="flex-1 w-full max-w-[1400px] px-4 md:px-12 flex flex-col justify-center relative z-10 pt-10 md:pt-16">
            <div className="grid grid-cols-12 gap-12 items-center">
              
              <div className="col-span-12 lg:col-span-8 flex flex-col gap-12">
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...ULTRA_SMOOTH_SPRING, delay: 0.2 }}
                    className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/5"
                  >
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map(i => (
                        <motion.div 
                          key={i}
                          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                          className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                        />
                      ))}
                    </div>
                    <span className={`text-[10px] font-medium ${isLight ? 'text-zinc-500' : 'text-zinc-400'} uppercase tracking-widest`}>Environment Synced</span>
                  </motion.div>

                  <h1 className={`text-4xl sm:text-5xl md:text-7xl xl:text-[8rem] font-display font-medium ${isLight ? 'text-zinc-900' : 'text-white'} leading-[0.95] tracking-tighter`}>
                    <motion.span 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...ULTRA_SMOOTH_SPRING, delay: 0.2 }}
                      className={`block text-xl md:text-3xl ${isLight ? 'text-zinc-500' : 'text-zinc-400'} font-normal tracking-tight mb-6`}
                    >
                      Welcome to
                    </motion.span>
                    <motion.span 
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...ULTRA_SMOOTH_SPRING, delay: 0.3 }}
                      className={`block relative bg-clip-text text-transparent bg-gradient-to-b ${isLight ? 'from-zinc-900 to-zinc-500' : 'from-white to-zinc-300'}`}
                    >
                      Experience
                    </motion.span>
                    <motion.span 
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...ULTRA_SMOOTH_SPRING, delay: 0.4 }}
                      className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-400 to-fuchsia-500 mt-2"
                    >
                      Spatial Learning
                    </motion.span>
                  </h1>
                </div>

                <motion.p 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...ULTRA_SMOOTH_SPRING, delay: 0.5 }}
                  className={`${isLight ? 'text-zinc-600 border-zinc-300' : 'text-zinc-300 border-cyan-500/30'} text-base sm:text-lg md:text-xl font-light leading-relaxed max-w-2xl selection:bg-black/10 border-l-2 pl-6 md:pl-8 ml-1 md:ml-2`}
                >
                  Precision-engineered spatial computation for the next generation of scientific pedagogy. Instantiate mathematically rigorous, photorealistic laboratory apparatus directly into your browser.
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...ULTRA_SMOOTH_SPRING, delay: 0.6 }}
                  className="flex flex-wrap gap-4 pointer-events-auto mt-8"
                >
                  {needsApiKey ? (
                    <motion.button
                      onClick={onSelectKey}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`group relative px-8 py-4 ${isLight ? 'bg-zinc-900 text-white shadow-xl' : 'bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.25)]'} rounded-full font-medium text-sm flex items-center gap-3 transition-all`}
                    >
                      <Zap size={16} fill={isLight ? "white" : "black"} />
                      Configure API
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={onStart}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`group relative px-8 py-4 ${isLight ? 'bg-zinc-900 text-white shadow-xl' : 'bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.25)]'} rounded-full font-medium text-sm flex items-center gap-3 transition-all`}
                    >
                      Enter Environment
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  )}
                  <motion.button 
                    whileHover={{ scale: 1.02, backgroundColor: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.12)" }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-8 py-4 ${isLight ? 'bg-black/[0.02] border-black/10 text-zinc-900' : 'bg-white/[0.05] border-white/20 text-white'} rounded-full font-medium text-sm transition-all shadow-sm`}
                  >
                    View Specifications
                  </motion.button>
                </motion.div>
              </div>

              <div className="hidden lg:block col-span-4 relative h-[600px]">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, x: 100 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    x: 0,
                    rotateX: mousePos.y * 0.1,
                    rotateY: -mousePos.x * 0.1
                  }}
                  transition={ULTRA_SMOOTH_SPRING}
                  className={`relative h-full ${isLight ? 'bg-zinc-100 border-black/5 shadow-inner' : 'bg-zinc-900/40 border-white/5'} rounded-3xl p-8 grid grid-rows-3 gap-6 pointer-events-auto overflow-hidden group`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <div className={`row-span-1 ${isLight ? 'bg-white border-zinc-200 shadow-sm' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'} rounded-3xl border p-6 flex flex-col justify-between transition-colors`}>
                    <div className="flex justify-between items-start">
                      <div className={`p-3 ${isLight ? 'bg-zinc-50 border-zinc-100' : 'bg-white/[0.05] border-white/10'} border rounded-xl`}>
                        <Activity size={18} className="text-zinc-400" />
                      </div>
                      <span className="text-[10px] font-medium text-emerald-400 animate-pulse tracking-widest uppercase">Live Feed</span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-4xl font-light tracking-tight text-white">4.8<span className="text-2xl text-zinc-500">GB/s</span></div>
                      <div className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">Data Throughput</div>
                    </div>
                  </div>

                  <div className="row-span-1 bg-white/[0.02] rounded-3xl border border-white/5 p-6 flex items-center gap-6 hover:bg-white/[0.04] transition-colors">
                    <div className="w-16 h-16 bg-white/[0.05] border border-white/10 rounded-2xl flex items-center justify-center">
                      <Box size={24} className="text-zinc-400" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          animate={{ width: ["20%", "80%", "40%"] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                          className="h-full bg-white/80"
                        />
                      </div>
                      <div className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">Rendering Engine</div>
                      <div className="flex gap-1.5">
                        <div className="w-6 h-1 bg-white/60 rounded-full" />
                        <div className="w-3 h-1 bg-white/10 rounded-full" />
                        <div className="w-3 h-1 bg-white/10 rounded-full" />
                      </div>
                    </div>
                  </div>

                  <div className="row-span-1 flex gap-6">
                    <div className="flex-1 bg-white/[0.02] rounded-3xl border border-white/5 p-6 flex flex-col items-center justify-center gap-3 hover:bg-white/[0.04] transition-colors">
                      <Shield size={20} className="text-zinc-400" />
                      <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest text-center mt-2">Secure</span>
                    </div>
                    <div className="flex-1 bg-white text-black rounded-3xl p-6 flex flex-col items-center justify-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] transition-all">
                      <Brain size={20} className="text-black" />
                      <span className="text-[10px] font-medium text-black/80 uppercase tracking-widest text-center mt-2">AI Native</span>
                    </div>
                  </div>

                  <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
                </motion.div>
              </div>

            </div>
          </div>

          <div className="w-full max-w-[1400px] px-6 md:px-12 py-20 md:py-32 relative z-20 flex flex-col gap-16 md:gap-24">
            
            {/* New Labster-like Module Showcase Section */}
            <div className="flex flex-col gap-12">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col gap-6 items-center text-center max-w-4xl mx-auto"
              >
                <div className={`px-5 py-1.5 rounded-full border border-white/10 ${isLight ? 'bg-zinc-100' : 'bg-zinc-900/80'} inline-flex items-center gap-2`}>
                  <Activity size={12} className="text-zinc-400" />
                  <span className="text-[10px] font-medium tracking-widest text-zinc-400">EMPIRICAL MODULE LIBRARY</span>
                </div>
                <h2 className={`text-4xl md:text-5xl font-display font-medium ${isLight ? 'text-zinc-900' : 'text-white'} tracking-tight`}>
                  High-Fidelity Simulation Sandbox
                </h2>
                <p className={`${isLight ? 'text-zinc-600' : 'text-zinc-400'} text-lg md:text-xl font-light leading-relaxed`}>
                  Engage with precision-engineered, mathematically-rigorous instruments. From relativistic spectroscopy to proteomic sequencing, instantiate isolated laboratory environments directly into your local runtime.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pointer-events-auto">
                {[
                  {
                    title: "CRISPR-Cas9 Editing",
                    tag: "Molecular Biology",
                    desc: "Manipulate nucleoprotein complexes and evaluate off-target genomic cleavage using quantum-resolved structural modeling.",
                    color: "from-emerald-500/20 to-teal-900/40",
                    border: "group-hover:border-emerald-500/30",
                    glow: "bg-emerald-500",
                    icon: Layers
                  },
                  {
                    title: "Tokamak Confinement",
                    tag: "Plasma Physics",
                    desc: "Regulate magnetohydrodynamic instability in a toroidal fusion reactor schema with real-time particle-in-cell simulations.",
                    color: "from-orange-500/20 to-red-900/40",
                    border: "group-hover:border-orange-500/30",
                    glow: "bg-orange-500",
                    icon: Zap
                  },
                  {
                    title: "Neuromorphic interfacing",
                    tag: "Cellular Neuroscience",
                    desc: "Interrogate action potential propagation kinetics and synaptic vesicle exocytosis across engineered neuronal meshes.",
                    color: "from-cyan-500/20 to-blue-900/40",
                    border: "group-hover:border-cyan-500/30",
                    glow: "bg-cyan-500",
                    icon: BrainCircuit
                  }
                ].map((lab, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ ...ULTRA_SMOOTH_SPRING, delay: idx * 0.15 }}
                    whileHover={{ scale: 1.02 }}
                    className={`${isLight ? 'bg-white border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300' : 'bg-zinc-900/40 border-white/5 hover:bg-zinc-800/50'} rounded-3xl p-8 border transition-all duration-200 overflow-hidden relative group cursor-default shadow-sm`}
                  >
                    <div className={`absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br ${lab.color} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
                    
                    <div className="flex justify-between items-start mb-16 relative z-10">
                      <div className={`${isLight ? 'text-zinc-500' : 'text-zinc-300'} transition-colors`}>
                        <lab.icon size={22} strokeWidth={1.5} />
                      </div>
                      <span className="text-[10px] font-medium tracking-widest text-zinc-500 uppercase">{lab.tag}</span>
                    </div>
                    
                    <div className="relative z-10 mt-auto">
                      <h3 className={`text-xl font-display font-medium tracking-tight ${isLight ? 'text-zinc-900' : 'text-white'} mb-3`}>{lab.title}</h3>
                      <p className={`text-sm font-light ${isLight ? 'text-zinc-600' : 'text-zinc-400'} leading-relaxed mb-8`}>{lab.desc}</p>
                      
                      <div className={`flex items-center gap-2 text-[12px] font-medium tracking-wide text-zinc-500 ${isLight ? 'group-hover:text-zinc-900' : 'group-hover:text-white'} transition-colors cursor-pointer`}>
                        <span>Initialize Protocol</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className={`w-full h-px ${isLight ? 'bg-gradient-to-r from-transparent via-zinc-200 to-transparent' : 'bg-gradient-to-r from-transparent via-white/10 to-transparent'} my-12`} />

            {/* Architecture Section */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...ULTRA_SMOOTH_SPRING }}
              className="flex items-center gap-6 mb-12"
            >
              <div className="flex flex-col items-center gap-1 w-full">
                <span className={`text-[10px] font-medium tracking-widest text-zinc-500 uppercase`}>In-Situ Subsystems Architecture</span>
                <span className={`text-3xl md:text-5xl font-display font-medium ${isLight ? 'text-zinc-900' : 'text-white'} tracking-tight mt-2 pb-2`}>Enterprise Telemetry</span>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pointer-events-auto">
              {[
                { 
                  icon: Terminal, 
                  color: "text-emerald-400", 
                  bg: "bg-emerald-500/10",
                  title: "Deterministic Execution", 
                  desc: "Mathematical apparatus executes thermodynamic and kinematic equations in closed-form deterministic runtime." 
                },
                { 
                  icon: Database, 
                  color: "text-blue-400", 
                  bg: "bg-blue-500/10",
                  title: "LMS Telemetry Sync", 
                  desc: "Granular learning analytics and assessment payloads synchronized sub-second via standardized LTI protocols." 
                },
                { 
                  icon: Globe, 
                  color: "text-indigo-400", 
                  bg: "bg-indigo-500/10",
                  title: "Spatial Volumetrics", 
                  desc: "Adaptive resolution scaling for volumetric scattering algorithms, ensuring framerate parity across diverse hardware." 
                },
                { 
                  icon: Network, 
                  color: "text-cyan-400", 
                  bg: "bg-cyan-500/10",
                  title: "Multiplexed Pedagogy", 
                  desc: "Asynchronous, multi-agent laboratory sessions with differential access controls and real-time state orchestration." 
                }
              ].map((feature, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...ULTRA_SMOOTH_SPRING, delay: i * 0.1 }}
                  className={`p-8 rounded-3xl ${isLight ? 'bg-white shadow-sm border-zinc-200 hover:bg-zinc-50' : 'bg-zinc-900/30 border-white/5'} border group relative overflow-hidden flex flex-col justify-between transition-colors`}
                >
                  <div className={`absolute -top-10 -right-10 w-32 h-32 ${feature.bg} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                  <div>
                    <div className={`mb-6 p-3 inline-block ${isLight ? 'bg-zinc-50 border-zinc-100' : 'bg-white/[0.03] border-white/5'} border rounded-xl relative`}>
                      <feature.icon size={22} className={`${feature.color}`} strokeWidth={1.5} />
                    </div>
                    <h3 className={`text-[15px] font-display font-medium ${isLight ? 'text-zinc-900' : 'text-white'} tracking-tight mb-2`}>
                      {feature.title}
                    </h3>
                    <p className={`text-[14px] ${isLight ? 'text-zinc-600' : 'text-zinc-400'} leading-relaxed font-light`}>
                      {feature.desc}
                    </p>
                  </div>
                  <div className={`mt-8 pt-4 border-t ${isLight ? 'border-black/5' : 'border-white/5'} flex justify-between items-center opacity-60`}>
                    <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">Active</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.footer 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className={`w-full px-6 md:px-12 py-8 border-t ${isLight ? 'border-zinc-200 bg-white' : 'border-white/5 bg-black'} flex flex-col md:flex-row justify-between items-center text-[11px] font-medium text-zinc-500 uppercase tracking-widest z-40 mt-auto`}
          >
            <div className="flex flex-wrap items-center justify-center gap-8 mb-6 md:mb-0">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <span className="text-emerald-500 font-medium">All Systems Operational</span>
              </div>
              <div className={`h-4 w-px ${isLight ? 'bg-black/10' : 'bg-white/10'} hidden md:block`} />
              <span>v4.2.1 Core</span>
              <div className={`h-4 w-px ${isLight ? 'bg-black/10' : 'bg-white/10'} hidden md:block`} />
              <span className="text-zinc-500">© 2026 HyperVision Group</span>
            </div>
            
            <div className="flex items-center gap-8 pointer-events-auto">
              {["API Reference", "Legal", "Support"].map(item => (
                <a key={item} href="#" className={`hover:${isLight ? 'text-black' : 'text-white'} transition-colors`}>
                  {item}
                </a>
              ))}
            </div>
          </motion.footer>
        </motion.div>
    </AnimatePresence>
  );
}
