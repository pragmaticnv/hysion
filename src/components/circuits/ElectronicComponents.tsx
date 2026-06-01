import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Sphere, Torus, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { CircuitElement } from './types';
import { getPinPosition } from './constants';

interface ComponentProps {
  element: CircuitElement;
  isSelected?: boolean;
  onSelect?: () => void;
  onDrag?: (position: [number, number, number]) => void;
  simulationResults?: any;
}

export const Resistor: React.FC<ComponentProps> = ({ element, isSelected, onSelect }) => {
  const rotation = useMemo(() => {
    if (element.connections.length === 2) {
      const p1 = getPinPosition(element.connections[0]);
      const p2 = getPinPosition(element.connections[1]);
      const angle = Math.atan2(p2[0] - p1[0], p2[2] - p1[2]);
      return [0, angle + Math.PI / 2, 0] as [number, number, number];
    }
    return element.rotation;
  }, [element.connections, element.rotation]);

  return (
    <group position={element.position} rotation={rotation} onClick={onSelect}>
      {/* Body */}
      <Cylinder args={[0.2, 0.2, 1, 32]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#d1d5db" roughness={0.1} />
      </Cylinder>
      {/* Color Rings */}
      <Cylinder args={[0.21, 0.21, 0.1, 32]} position={[-0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#92400e" />
      </Cylinder>
      <Cylinder args={[0.21, 0.21, 0.1, 32]} position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#1e40af" />
      </Cylinder>
      <Cylinder args={[0.21, 0.21, 0.1, 32]} position={[0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#ca8a04" />
      </Cylinder>
      {/* Selection Ring */}
      {isSelected && (
        <Torus args={[0.4, 0.05, 16, 64]} rotation={[0, Math.PI/2, 0]}>
          <meshBasicMaterial color="#6366f1" transparent opacity={0.5} />
        </Torus>
      )}
      <Text position={[0, 0.5, 0]} fontSize={0.15} color="white">{element.value} Ω</Text>
    </group>
  );
};

export const LED: React.FC<ComponentProps> = ({ element, isSelected, onSelect, simulationResults }) => {
  const current = simulationResults?.currents?.[element.id] || 0;
  const isLit = current > 0.001;

  const rotation = useMemo(() => {
    if (element.connections.length === 2) {
      const p1 = getPinPosition(element.connections[0]);
      const p2 = getPinPosition(element.connections[1]);
      const angle = Math.atan2(p2[0] - p1[0], p2[2] - p1[2]);
      return [0, angle, 0] as [number, number, number];
    }
    return element.rotation;
  }, [element.connections, element.rotation]);

  return (
    <group position={element.position} rotation={rotation} onClick={onSelect}>
      {/* Base */}
      <Cylinder args={[0.25, 0.25, 0.1, 32]} position={[0, -0.2, 0]}>
        <meshStandardMaterial color="#374151" />
      </Cylinder>
      {/* Casing */}
      <Sphere args={[0.22, 32, 32]} position={[0, 0.1, 0]}>
        <meshStandardMaterial 
          color={element.color || "#ef4444"} 
          transparent 
          opacity={0.8} 
          emissive={isLit ? element.color : "#000000"}
          emissiveIntensity={isLit ? 2 : 0}
        />
      </Sphere>
      {/* Point Light when lit */}
      {isLit && (
        <pointLight color={element.color} intensity={2} distance={2} />
      )}
      {isSelected && (
         <Torus args={[0.35, 0.04, 16, 64]} rotation={[Math.PI/2, 0, 0]} position={[0, -0.2, 0]}>
           <meshBasicMaterial color="#6366f1" />
         </Torus>
      )}
    </group>
  );
};

export const Battery: React.FC<ComponentProps> = ({ element, isSelected, onSelect }) => {
  const rotation = useMemo(() => {
    if (element.connections.length === 2) {
      const p1 = getPinPosition(element.connections[0]);
      const p2 = getPinPosition(element.connections[1]);
      const angle = Math.atan2(p2[0] - p1[0], p2[2] - p1[2]);
      return [0, angle + Math.PI / 2, 0] as [number, number, number];
    }
    return element.rotation;
  }, [element.connections, element.rotation]);

  return (
    <group position={element.position} rotation={rotation} onClick={onSelect}>
      <Box args={[1, 1.5, 0.8]}>
        <meshStandardMaterial color="#1f2937" roughness={0.1} />
      </Box>
      <Box args={[0.8, 1.3, 0.01]} position={[0, 0, 0.405]}>
        <meshStandardMaterial color="#ca8a04" />
      </Box>
      {/* Terminals */}
      <Cylinder args={[0.1, 0.1, 0.2, 16]} position={[-0.3, 0.8, 0]}>
        <meshStandardMaterial color="#9ca3af" metalness={1} />
      </Cylinder>
      <Cylinder args={[0.1, 0.1, 0.2, 16]} position={[0.3, 0.8, 0]}>
        <meshStandardMaterial color="#9ca3af" metalness={1} />
      </Cylinder>
      <Text position={[0, 0, 0.42]} fontSize={0.2} color="black" fontWeight="bold">9V</Text>
      {isSelected && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.1, 1.6, 0.9]} />
          <meshBasicMaterial color="#6366f1" wireframe />
        </mesh>
      )}
    </group>
  );
};

export const Switch: React.FC<ComponentProps> = ({ element, isSelected, onSelect }) => {
  const isOn = element.state?.on || false;
  
  const rotation = useMemo(() => {
    if (element.connections.length === 2) {
      const p1 = getPinPosition(element.connections[0]);
      const p2 = getPinPosition(element.connections[1]);
      const angle = Math.atan2(p2[0] - p1[0], p2[2] - p1[2]);
      return [0, angle + Math.PI / 2, 0] as [number, number, number];
    }
    return element.rotation;
  }, [element.connections, element.rotation]);

  return (
    <group position={element.position} rotation={rotation} onClick={onSelect}>
      {/* Housing */}
      <Box args={[0.6, 0.4, 0.6]}>
        <meshStandardMaterial color="#374151" />
      </Box>
      {/* Lever */}
      <group rotation={[isOn ? 0.3 : -0.3, 0, 0]} position={[0, 0.3, 0]}>
        <Box args={[0.1, 0.4, 0.1]}>
          <meshStandardMaterial color="#9ca3af" />
        </Box>
      </group>
      {isSelected && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.7, 0.5, 0.7]} />
          <meshBasicMaterial color="#6366f1" wireframe />
        </mesh>
      )}
    </group>
  );
};

export const Multimeter: React.FC<{ potentials: any, currents: any, hoveredPin?: string | null }> = ({ potentials, currents, hoveredPin }) => {
  const voltage = useMemo(() => {
    if (!hoveredPin) return 0;
    return potentials[hoveredPin] || 0;
  }, [potentials, hoveredPin]);

  return (
    <Html position={[0, 4, -4]} center transform scale={1}>
      <div className="bg-zinc-900/90 border border-amber-500/30 p-6 rounded-2xl shadow-2xl backdrop-blur-md w-64">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest font-bold">Quantum Meter</span>
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        </div>
        <div className="bg-black/50 p-4 rounded-xl border border-white/5 mb-4">
          <div className="text-[8px] text-zinc-500 mb-1 uppercase font-black">Node: {hoveredPin || 'None'}</div>
          <div className="text-4xl font-mono text-amber-400 text-right drop-shadow-lg">
            {voltage.toFixed(3)}
            <span className="text-xl ml-2 text-amber-600">V</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/5 p-2 rounded-lg">
            <div className="text-[8px] text-zinc-500 uppercase font-black">Accuracy</div>
            <div className="text-xs text-white font-mono">99.998%</div>
          </div>
          <div className="bg-white/5 p-2 rounded-lg">
            <div className="text-[8px] text-zinc-500 uppercase font-black">Mode</div>
            <div className="text-xs text-white font-mono">Auto-V</div>
          </div>
        </div>
      </div>
    </Html>
  );
};
