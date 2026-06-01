import React, { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Text, Html } from '@react-three/drei';
import { BreadboardModel, LedHighDetail, Battery9VModel, ResistorModel, MotorAdvanced } from '../ApparatusModels';

export function CircuitDesignerScene() {
  const [powerOn, setPowerOn] = useState(false);

  return (
    <group position={[0, 0, 0]}>
      {/* ESD Workmat */}
      <Box args={[14, 0.2, 10]} position={[0, -0.1, 0]} receiveShadow>
        <meshPhysicalMaterial color="#075985" roughness={0.8} metalness={0.1} />
      </Box>

      {/* Main Breadboard */}
      <group position={[0, 0.1, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <BreadboardModel />
        
        {/* Components Placed on Breadboard Grid */}
        <group position={[-0.4, 0.2, 0]} scale={0.6}>
           <LedHighDetail active={powerOn} color="#ef4444" />
        </group>

        <group position={[0.4, 0.2, 0]} scale={0.6}>
           <LedHighDetail active={powerOn} color="#3b82f6" />
        </group>

        <group position={[0, 0.1, 1]} rotation={[0, Math.PI / 2, 0]} scale={0.5}>
           <ResistorModel />
        </group>
      </group>

      {/* Power Source */}
      <group position={[4, 0.4, 3]}>
        <Battery9VModel />
        <Text position={[0, 1, 0]} fontSize={0.2} color="white">PRIMARY CELL</Text>
      </group>

      {/* Advanced Component: Motor */}
      <group position={[-4, 0.6, 2]} scale={1.2}>
         <MotorAdvanced />
         {powerOn && <pointLight color="#3b82f6" intensity={0.5} distance={2} />}
         <Text position={[0, 1.2, 0]} fontSize={0.2} color="white">DC DRIVE UNIT</Text>
      </group>

      {/* Control Station */}
      <group position={[5, 2, -2]}>
         <Html transform occlude>
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 w-72 flex flex-col gap-6 shadow-2xl pointer-events-auto">
               <div className="flex items-center justify-between">
                  <h3 className="text-slate-100 font-bold text-lg">BENCH POWER</h3>
                  <div className={`w-3 h-3 rounded-full ${powerOn ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-slate-700'}`} />
               </div>

               <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                     <div className="flex justify-between text-[10px] text-slate-400 font-mono tracking-widest">
                        <span>MASTER RELAY</span>
                        <span>{powerOn ? 'ENERGIZED' : 'OFF'}</span>
                     </div>
                     <button 
                        onClick={() => setPowerOn(!powerOn)}
                        className={`w-full py-4 rounded-xl font-bold border-2 transition-all duration-300 ${
                           powerOn 
                              ? 'bg-red-500/10 border-red-500/50 text-red-500 hover:bg-red-500/20' 
                              : 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/20'
                        }`}
                     >
                        {powerOn ? 'DISCONNECT' : 'INITIALIZE BUS'}
                     </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center font-mono text-xs">
                     <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                        <span className="block text-slate-500 text-[8px] mb-1">BUS VOLTAGE</span>
                        <span className="text-amber-400">{powerOn ? '9.012' : '0.000'}V</span>
                     </div>
                     <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                        <span className="block text-slate-500 text-[8px] mb-1">DRAWN CURRENT</span>
                        <span className="text-emerald-400">{powerOn ? '142.5' : '0.0'}mA</span>
                     </div>
                  </div>
               </div>
            </div>
         </Html>
      </group>

      {/* Multimeter (Static background item for precision look) */}
      <group position={[-5, 0.6, -3]} rotation={[0, -Math.PI / 6, 0]}>
         <Box args={[1.5, 0.8, 2]}>
            <meshPhysicalMaterial color="#fbbf24" metalness={0.2} roughness={0.3} />
         </Box>
         <mesh position={[0, 0.41, 0]}>
            <boxGeometry args={[1.2, 0.01, 0.8]} />
            <meshBasicMaterial color="#111" />
         </mesh>
         <Text position={[0, 1.2, 0]} fontSize={0.15} color="white">AUTO-RANGE DMM</Text>
      </group>
    </group>
  );
}
