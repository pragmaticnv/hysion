import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, PerspectiveCamera, Environment, Float, Html } from '@react-three/drei';
import { Theme } from '../types';
import { FingerprintModel } from '../models/FingerprintModel';
import { Hand } from 'lucide-react';

interface FingerprintSensorCourseProps {
  theme: Theme;
  onClose: () => void;
  isGestureActive: boolean;
  toggleGesture: () => void;
}

import { useStore } from '../store/useStore';

export const FingerprintSensorCourse: React.FC = () => {
  const { 
    theme, 
    setActiveTopic, 
    isGestureActive, 
    setIsGestureActive 
  } = useStore();
  
  const onClose = () => setActiveTopic('Atom');
  const toggleGesture = () => setIsGestureActive(!isGestureActive);
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
      <div className="w-full max-w-6xl h-[90vh] bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-2xl font-light tracking-tight text-white">Advanced Biometric Sensor Array</h2>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleGesture}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${
                isGestureActive 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                  : 'bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10'
              }`}
            >
              <Hand size={14} className={isGestureActive ? 'animate-pulse' : ''} />
              {isGestureActive ? 'Neural Link Active' : 'Enable Neural Link'}
            </button>
            <button 
              onClick={onClose} 
              className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors text-sm font-medium border border-white/5"
            >
              Terminate Session
            </button>
          </div>
        </div>
        
        <div className="flex-1 flex overflow-hidden">
          {/* Main 3D Viewport */}
          <div className="flex-1 relative bg-black">
            <div className="absolute top-4 left-4 z-10 space-y-1">
              <div className="text-[10px] font-mono text-emerald-500/50 tracking-widest uppercase">System Status</div>
              <div className="text-xs font-mono text-emerald-400">SENSOR_ACTIVE_V4.2</div>
            </div>
            
            <Canvas
              dpr={[1, 1]}
              gl={{ 
                antialias: false,
                powerPreference: "high-performance",
                toneMapping: THREE.ACESFilmicToneMapping,
                outputColorSpace: THREE.SRGBColorSpace
              }}
            >
              <Suspense fallback={
                <Html center>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                    <div className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest">Loading Neural Assets...</div>
                  </div>
                </Html>
              }>
                <PerspectiveCamera makeDefault position={[0, 2, 4]} fov={45} />
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#10b981" />
                
                <FingerprintModel />
                
                <Environment preset="city" />
                <OrbitControls 
                  enablePan={false} 
                  minPolarAngle={0} 
                  maxPolarAngle={Math.PI / 2.2}
                  minDistance={2}
                  maxDistance={8}
                />
              </Suspense>
            </Canvas>
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs font-mono text-white/30 pointer-events-none text-center">
              DRAG TO ROTATE • SCROLL TO ZOOM<br/>
              <span className="text-emerald-500/50">HAND GESTURES: PALM TO ROTATE • PINCH TO SEPARATE</span>
            </div>
          </div>
          
          {/* Sidebar Info */}
          <div className="w-96 border-l border-white/10 bg-zinc-900/80 backdrop-blur-sm flex flex-col">
            <div className="p-6 border-b border-white/5">
              <h3 className="text-sm font-mono text-emerald-500 mb-2">ANALYSIS PROTOCOL</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                The sensor utilizes a high-frequency ultrasonic array combined with capacitive sensing to map the epidermal ridges and valleys at a resolution of 500 DPI.
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-4">
                {[
                  { 
                    step: '01', 
                    title: 'Capacitive Coupling', 
                    desc: 'The sensor array generates a localized electrostatic field. Ridges (contact points) discharge the capacitors, while valleys (air gaps) maintain charge, creating a binary map.' 
                  },
                  { 
                    step: '02', 
                    title: 'Ultrasonic Depth Mapping', 
                    desc: 'High-frequency sound waves penetrate the epidermis to map the sub-dermal layer, ensuring liveness detection and bypassing surface contaminants.' 
                  },
                  { 
                    step: '03', 
                    title: 'Minutiae Extraction', 
                    desc: 'The DSP identifies ridge endings, bifurcations, and islands. These vector points are extracted to form a unique biometric template.' 
                  },
                  { 
                    step: '04', 
                    title: 'Template Hashing', 
                    desc: 'The spatial coordinates of minutiae are converted into a cryptographic hash. The original fingerprint image is discarded to ensure privacy.' 
                  },
                ].map((module, i) => (
                  <div key={i} className="group relative pl-6 border-l border-white/10 hover:border-emerald-500/50 transition-colors">
                    <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-zinc-900 border border-white/20 group-hover:border-emerald-500 group-hover:bg-emerald-500/20 transition-colors" />
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-[10px] font-mono text-zinc-600 group-hover:text-emerald-500/70">{module.step}</span>
                      <h4 className="text-sm font-medium text-zinc-200 group-hover:text-white">{module.title}</h4>
                    </div>
                    <p className="text-xs text-zinc-500 group-hover:text-zinc-400 leading-relaxed transition-colors">{module.desc}</p>
                  </div>
                ))}
              </div>
              
              <div className="p-4 rounded-lg bg-emerald-900/10 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs font-mono text-emerald-400">LIVE TELEMETRY</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-black/20 p-2 rounded border border-white/5">
                    <div className="text-[10px] text-zinc-500">SNR</div>
                    <div className="text-xs font-mono text-white">98.2 dB</div>
                  </div>
                  <div className="bg-black/20 p-2 rounded border border-white/5">
                    <div className="text-[10px] text-zinc-500">LATENCY</div>
                    <div className="text-xs font-mono text-white">12ms</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

