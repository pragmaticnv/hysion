
import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Sphere, Text, Float, Html } from '@react-three/drei';
import { useLabStore } from '../../store/useLabStore';
import * as THREE from 'three';
import { ResistorModel, Battery9VModel, AmmeterAdvanced } from '../ApparatusModels';

export function OhmsLawScene() {
  const { currentStepIndex, addReading } = useLabStore();
  const [voltage, setVoltage] = useState(5);
  const resistance = 10;
  const current = voltage / resistance;

  // Collecting 5 data points for verification
  const [dataPoints, setDataPoints] = useState<number[]>([]);

  const handleRecord = () => {
    const reading = { x: voltage, y: (voltage / resistance).toFixed(3), timestamp: Date.now() };
    addReading(reading);
    if (!dataPoints.includes(voltage)) {
      setDataPoints([...dataPoints, voltage]);
    }
  };

  return (
    <group position={[0, 0, 0]}>
      {/* Circuit Platform */}
      <Box args={[10, 0.2, 8]} position={[0, 0, 0]} receiveShadow>
         <meshStandardMaterial color="#050505" />
      </Box>

      {/* Battery / DC Source */}
      <group position={[-3, 0.4, -2]}>
         <Battery9VModel />
         <Text position={[0, 1.2, 0]} fontSize={0.2} color="white">9V DC SOURCE</Text>
         <Text position={[0, 0.9, 0]} fontSize={0.15} color="#60a5fa">{voltage}V ACTIVE</Text>
         
         <Html position={[0, 0.1, 0.8]} transform occlude>
            <div className="bg-black/80 p-2 rounded-lg border border-white/10 flex flex-col items-center gap-2 pointer-events-auto">
               <input 
                  type="range" 
                  min="0" 
                  max="12" 
                  step="1" 
                  value={voltage} 
                  onChange={(e) => setVoltage(parseInt(e.target.value))}
                  className="w-20"
               />
               <button 
                  onClick={handleRecord}
                  className="px-2 py-1 bg-indigo-500 text-[8px] font-black uppercase tracking-widest rounded hover:bg-indigo-400 transition-colors"
               >
                  Record V-I
               </button>
            </div>
         </Html>
      </group>

      {/* Resistor */}
      <group position={[0, 0.3, -2]} scale={1.5}>
         <ResistorModel />
         <Text position={[0, 0.6, 0]} fontSize={0.1} color="#666">RESISTOR: {resistance}Ω</Text>
      </group>

      {/* Ammeter */}
      <group position={[3, 0.6, -2]}>
         <AmmeterAdvanced reading={current / 1.2} />
         <Text position={[0, 1.2, 0]} fontSize={0.2} color="white">PRECISION AMMETER</Text>
         <Text position={[0, -0.2, 0.4]} fontSize={0.3} color="#10b981">{current.toFixed(3)}A</Text>
      </group>

      {/* Voltmeter */}
      <group position={[0, 0.6, 2]}>
         <AmmeterAdvanced reading={voltage / 12} />
         <Text position={[0, 1.2, 0]} fontSize={0.2} color="white">PRECISION VOLTMETER</Text>
         <Text position={[0, -0.2, 0.4]} fontSize={0.3} color="#fca5a5">{voltage.toFixed(2)}V</Text>
      </group>

      {/* Wire Visualizations (Animated Particles for Current) */}
      <ElectronFlow current={current} active={currentStepIndex >= 3} />
    </group>
  );
}

function ElectronFlow({ current, active }: { current: number, active: boolean }) {
  const electrons = useMemo(() => Array.from({ length: 20 }, () => Math.random()), []);
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current || !active) return;
    ref.current.children.forEach((child, i) => {
       const t = (clock.getElapsedTime() * current * 2 + electrons[i]) % 1;
       // Follow a rectangular path
       if (t < 0.25) { // Left to center
          child.position.set(-3 + (t/0.25) * 3, 0.2, -2);
       } else if (t < 0.5) { // Center to right
          child.position.set((t-0.25)/0.25 * 3, 0.2, -2);
       } else if (t < 0.75) { // Right to center bottom
          child.position.set(3, 0.2, -2 + (t-0.5)/0.25 * 4);
       } else { // Center bottom to left
          child.position.set(3 - (t-0.75)/0.25 * 6, 0.2, 2);
       }
    });
  });

  return (
    <group ref={ref}>
      {active && electrons.map((_, i) => (
        <Sphere key={i} args={[0.04]}>
           <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </Sphere>
      ))}
    </group>
  );
}
