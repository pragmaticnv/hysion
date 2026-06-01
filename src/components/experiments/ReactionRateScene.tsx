
import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Sphere, Text, Float, Html } from '@react-three/drei';
import { useLabStore } from '../../store/useLabStore';
import * as THREE from 'three';
import { BeakerModel, BunsenBurnerModel } from '../ApparatusModels';

export function ReactionRateScene() {
  const { currentStepIndex } = useLabStore();
  const [concentration, setConcentration] = useState(1); // 0.1 to 2.0
  const [temperature, setTemperature] = useState(25); // 20 to 100 degrees Celsius
  
  // Rate calculation (arbitrary simplified formula)
  const rate = (concentration * (1 + (temperature - 20) / 100));

  return (
    <group position={[0, 0, 0]}>
      {/* Table */}
      <Box args={[10, 0.2, 8]} position={[0, 0, 0]} receiveShadow>
         <meshStandardMaterial color="#2d2d2d" />
      </Box>

      {/* Control Panel */}
      <group position={[0, 1.5, 3]}>
         <Text position={[0, 1.8, 0]} fontSize={0.3} color="white">REACTANT CONTROLS</Text>
         <Html transform occlude>
            <div className="bg-black/90 p-4 rounded-xl border border-white/20 flex flex-col gap-4 w-60 pointer-events-auto">
               
               <label className="text-white text-xs">Concentration: {concentration.toFixed(1)}M</label>
               <input 
                  type="range" min="0.1" max="2.0" step="0.1" value={concentration}
                  onChange={(e) => setConcentration(parseFloat(e.target.value))}
                  className="w-full"
               />
               
               <label className="text-white text-xs">Temperature: {temperature.toFixed(0)}°C</label>
               <input 
                  type="range" min="20" max="100" step="1" value={temperature}
                  onChange={(e) => setTemperature(parseInt(e.target.value))}
                  className="w-full"
               />
            </div>
         </Html>
      </group>

      {/* Bunsen Burner */}
      <group position={[0, 0.4, 0]} scale={0.8}>
         <BunsenBurnerModel active={temperature > 30} />
      </group>

      {/* Reaction Chamber (Beaker) */}
      <group position={[0, 0.6, 0]} scale={2}>
         <BeakerModel 
            liquidColor={`rgb(${100 + rate * 30}, 200, 255)`} 
            liquidLevel={0.4 + (rate * 0.1)} 
         />
         
         {/* Bubbles moved inside beaker group and scaled */}
         <group scale={0.5} position={[0, 0.3, 0]}>
            <BubbleSystem rate={rate} active={currentStepIndex >= 0} />
         </group>
      </group>
    </group>
  );
}

function BubbleSystem({ rate, active }: { rate: number, active: boolean }) {
  const count = Math.floor(rate * 20);
  const bubbles = useMemo(() => Array.from({ length: 50 }, () => ({
    offset: Math.random() * Math.PI * 2,
    speed: 0.5 + Math.random() * rate * 0.5
  })), [rate]);
  
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current || !active) return;
    ref.current.children.forEach((child: any, i) => {
        const bubble = bubbles[i];
        if (i < count) {
            child.visible = true;
            child.position.y = (clock.getElapsedTime() * bubble.speed) % 2;
        } else {
            child.visible = false;
        }
    });
  });

  return (
    <group ref={ref} position={[0, -1, 0]}>
      {bubbles.map((_, i) => (
        <Sphere key={i} args={[0.05 + Math.random() * 0.05]}>
            <meshBasicMaterial color="white" transparent opacity={0.5} />
        </Sphere>
      ))}
    </group>
  );
}
