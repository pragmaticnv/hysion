import React, { useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Sphere, Text, Float, Html } from '@react-three/drei';
import { useLabStore } from '../../store/useLabStore';
import * as THREE from 'three';
import { BuretteModel, FlaskModel, BeakerModel } from '../ApparatusModels';

export function TitrationScene() {
  const { currentStepIndex } = useLabStore();
  const [buretteLevel, setBuretteLevel] = useState(0.8);
  const [flaskLevel, setFlaskLevel] = useState(0.2);
  const [flaskColor, setFlaskColor] = useState("#ffffff");
  const [valveOpen, setValveOpen] = useState(false);
  const [drops, setDrops] = useState<{ id: number; y: number }[]>([]);

  useFrame((state, delta) => {
    if (valveOpen && buretteLevel > 0) {
      setBuretteLevel((prev) => Math.max(0, prev - delta * 0.02));
      setFlaskLevel((prev) => Math.min(0.6, prev + delta * 0.02));
      
      // End point color change (simulating Phenolphthalein)
      if (flaskLevel > 0.45) {
        setFlaskColor("#f472b6"); // Pink
      }

      // Add drops
      if (Math.random() > 0.8) {
        setDrops((prev) => [...prev, { id: Math.random(), y: 0.5 }]);
      }
    }

    setDrops((prev) => 
      prev.map(d => ({ ...d, y: d.y - delta * 5 })).filter(d => d.y > -3.5)
    );
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Table Surface */}
      <Box args={[15, 0.2, 10]} position={[0, -0.1, 0]}>
        <meshPhysicalMaterial color="#fafafa" roughness={0.1} />
      </Box>

      {/* Titration Stand */}
      <group position={[-1, 0, -1]}>
        {/* Base */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[2, 0.1, 1.5]} />
          <meshPhysicalMaterial color="#374151" metalness={0.7} />
        </mesh>
        {/* Vertical Rod */}
        <mesh position={[-0.8, 5, -0.5]}>
          <cylinderGeometry args={[0.08, 0.08, 10, 32]} />
          <meshPhysicalMaterial color="#9ca3af" metalness={1} roughness={0.1} />
        </mesh>
        
        {/* Burette Clamp */}
        <group position={[0, 6, -0.5]}>
           <mesh position={[-0.4, 0, 0]} rotation={[0, 0, Math.PI/2]}>
              <cylinderGeometry args={[0.05, 0.05, 0.8, 16]} />
              <meshPhysicalMaterial color="#4b5563" />
           </mesh>
           <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.2, 0.4, 0.3]} />
              <meshPhysicalMaterial color="#1f2937" />
           </mesh>
        </group>

        {/* Burette */}
        <group position={[0, 6, 0]}>
           <BuretteModel liquidLevel={buretteLevel} valveOpen={valveOpen} />
           
           {/* Drops */}
           {drops.map(d => (
             <mesh key={d.id} position={[0, -4.5 + d.y, 0]}>
                <sphereGeometry args={[0.03]} />
                <meshBasicMaterial color="#ffffff" />
             </mesh>
           ))}
        </group>
      </group>

      {/* Erlenmeyer Flask placement */}
      <group position={[-1, 1, -1]}>
         <group scale={1.5} position={[0, -0.9, 0]}>
            <FlaskModel liquidColor={flaskColor} liquidLevel={flaskLevel} />
         </group>
      </group>

      {/* Control UI */}
      <group position={[3, 2, 0]}>
         <Html transform occlude>
            <div className="bg-black/90 p-6 rounded-2xl border border-white/20 w-64 flex flex-col gap-4 shadow-2xl pointer-events-auto">
               <h3 className="text-white font-bold text-lg border-b border-white/10 pb-2">PRECISION CONTROL</h3>
               
               <div className="flex flex-col gap-2">
                  <label className="text-gray-400 text-xs uppercase tracking-widest">Titrant Flow</label>
                  <button 
                    onClick={() => setValveOpen(!valveOpen)}
                    className={`p-3 rounded-lg font-bold transition-all ${
                      valveOpen 
                        ? 'bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30' 
                        : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/50 hover:bg-emerald-500/30'
                    }`}
                  >
                    {valveOpen ? "STOP FLOW" : "RELEASE TITRANT"}
                  </button>
               </div>

               <div className="flex justify-between text-white text-sm bg-white/5 p-3 rounded-lg">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-gray-400">BURETTE</span>
                    <span className="font-mono">{(buretteLevel * 50).toFixed(2)}mL</span>
                  </div>
                  <div className="w-[1px] bg-white/10" />
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-gray-400">ANALYTE</span>
                    <span className="font-mono text-pink-400">pH {flaskLevel > 0.45 ? "8.2+" : "4.5"}</span>
                  </div>
               </div>

               {flaskLevel > 0.45 && (
                 <div className="text-emerald-400 font-bold text-center text-xs animate-pulse">
                    END POINT REACHED
                 </div>
               )}
            </div>
         </Html>
      </group>

      {/* Secondary Equipment - Stored precisely */}
      <group position={[4, 0.8, -3]}>
         <group position={[-1, 0, 0]} scale={0.8}>
            <BeakerModel liquidColor="#60a5fa" liquidLevel={0.9} />
            <Text position={[0, 1.6, 0]} fontSize={0.15} color="white">STARK ACID</Text>
         </group>
         <group position={[1, 0, 0]} scale={0.8}>
            <BeakerModel liquidColor="#f472b6" liquidLevel={0.2} />
            <Text position={[0, 1.6, 0]} fontSize={0.15} color="white">INDICATOR</Text>
         </group>
      </group>

    </group>
  );
}
