import React, { useState } from 'react';
import { Box, Text, Html, Float } from '@react-three/drei';
import { useLabStore } from '../../store/useLabStore';
import { MicroscopeModel } from '../ApparatusModels';

export function CellObservationScene() {
  const { currentStepIndex } = useLabStore();
  const [isLooking, setIsLooking] = useState(false);
  const [magnification, setMagnification] = useState(40);

  return (
    <group position={[0, 0, 0]}>
      {/* Table Surface */}
      <Box args={[12, 0.2, 8]} position={[0, -0.1, 0]}>
        <meshPhysicalMaterial color="#111827" roughness={0.5} />
      </Box>

      {/* Main Microscope */}
      <group position={[0, 0.1, 0]}>
        <MicroscopeModel />
        
        {/* Interaction Point */}
        <mesh position={[0, 2.5, -0.3]} onClick={() => setIsLooking(!isLooking)}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.3} />
        </mesh>
      </group>

      {/* Slide on Stage */}
      <mesh position={[0, 0.95, 0.1]}>
        <boxGeometry args={[0.5, 0.02, 0.2]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} transparent opacity={0.5} />
        {/* Sample dot */}
        <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.03, 16]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      </mesh>

      {/* Secondary Slides Container */}
      <group position={[3, 0.1, -2]}>
         <Box args={[1.5, 0.2, 1]}>
            <meshStandardMaterial color="#1f2937" />
         </Box>
         {[0, 0.1, 0.2].map((y, i) => (
            <mesh key={i} position={[0, 0.2 + y, 0]}>
               <boxGeometry args={[0.8, 0.01, 0.3]} />
               <meshPhysicalMaterial color="#ffffff" transmission={0.9} transparent opacity={0.4} />
            </mesh>
         ))}
         <Text position={[0, 0.6, 0]} fontSize={0.15} color="white">PREPARED SLIDES</Text>
      </group>

      {/* Microscope View Overlay */}
      {isLooking && (
        <Html center>
          <div className="relative w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full border-[10px] border-black overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] pointer-events-none">
            {/* The "Microscopic" content */}
            <div className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center">
              <div 
                className="grid grid-cols-6 grid-rows-6 gap-2 opacity-80"
                style={{ transform: `scale(${magnification / 10})` }}
              >
                {Array.from({ length: 36 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="w-16 h-16 border-2 border-emerald-500/30 rounded-xl bg-emerald-500/10 flex items-center justify-center"
                  >
                    <div className="w-4 h-4 bg-emerald-400/40 rounded-full blur-sm" />
                  </div>
                ))}
              </div>
              
              {/* Lens Grime / Realistic Artifacts */}
              <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.9)_100%)]" />
              <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-white/5 rounded-full blur-[2px]" />
            </div>

            {/* Scale Bar */}
            <div className="absolute bottom-10 right-20 flex flex-col items-end gap-1">
               <div className="w-20 h-[2px] bg-white" />
               <span className="text-white text-[10px] font-mono">10μm</span>
            </div>

            {/* Exit Close Button Overlay */}
            <div className="absolute inset-0 flex items-end justify-center pb-10">
               <button 
                  onClick={(e) => { e.stopPropagation(); setIsLooking(false); }}
                  className="bg-red-500 px-6 py-2 rounded-full text-white font-bold text-sm pointer-events-auto hover:bg-red-600 transition-colors"
               >
                  CLOSE EYEPIECE
               </button>
            </div>
          </div>
          
          {/* Controls Overlay */}
          <div className="fixed top-20 right-4 sm:right-20 bg-black/80 p-4 border border-white/20 rounded-xl flex flex-col gap-4 pointer-events-auto">
             <label className="text-white text-xs font-bold uppercase tracking-tighter">Objective Lens</label>
             <div className="flex gap-2">
                {[4, 10, 40].map(m => (
                  <button 
                    key={m}
                    onClick={() => setMagnification(m)}
                    className={`px-3 py-1 rounded border ${magnification === m ? 'bg-blue-600 border-blue-400' : 'bg-white/5 border-white/10'} text-white text-xs`}
                  >
                    {m}x
                  </button>
                )) }
             </div>
          </div>
        </Html>
      )}

      {/* Decorative environment items */}
      <group position={[-4, 0.1, -2]}>
         <Box args={[1, 0.1, 1]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#374151" />
         </Box>
         <Text position={[0, 0.5, 0]} fontSize={0.1} color="white">SPECIMEN LOG</Text>
      </group>
    </group>
  );
}
