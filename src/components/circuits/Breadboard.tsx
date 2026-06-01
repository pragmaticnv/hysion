import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Text, Box, Cylinder } from '@react-three/drei';

interface BreadboardProps {
  onPinHover?: (pinId: string) => void;
  onPinClick?: (pinId: string) => void;
}

export const Breadboard: React.FC<BreadboardProps> = ({ onPinHover, onPinClick }) => {
  // Breadboard dimensions: 63 columns, 10 rows (A-E, F-G-H-I-J) plus power rails
  const columns = 30; // Simplified for visibility
  const rows = 10;
  
  const pins = useMemo(() => {
    const p = [];
    const spacing = 0.5;
    
    // Main area components (A-E and F-J)
    for (let c = 0; c < columns; c++) {
      for (let r = 0; r < rows; r++) {
        const x = (c - columns / 2) * spacing;
        const y = 0.05;
        const z = (r - rows / 2) * spacing + (r >= 5 ? 0.2 : -0.2); // Ravine in middle
        
        const pinId = `${String.fromCharCode(65 + r)}${c + 1}`;
        p.push({ id: pinId, position: [x, y, z] as [number, number, number] });
      }
    }
    
    // Power rails (+ and -)
    for (let c = 0; c < columns; c++) {
      const x = (c - columns / 2) * spacing;
      const y = 0.05;
      
      // Top power rails
      p.push({ id: `VCC_T_${c}`, position: [x, y, -3.5], color: '#ef4444' });
      p.push({ id: `GND_T_${c}`, position: [x, y, -3.2], color: '#3b82f6' });
      
      // Bottom power rails
      p.push({ id: `VCC_B_${c}`, position: [x, y, 3.2], color: '#ef4444' });
      p.push({ id: `GND_B_${c}`, position: [x, y, 3.5], color: '#3b82f6' });
    }
    
    return p;
  }, [columns, rows]);

  return (
    <group>
      {/* Plastic Base */}
      <Box args={[16, 0.4, 10]} position={[0, -0.2, 0]}>
        <meshStandardMaterial color="#ffffff" roughness={0.05} metalness={0.1} />
      </Box>
      <Box args={[15.6, 0.42, 9.6]} position={[0, -0.21, 0]}>
        <meshStandardMaterial color="#f8fafc" roughness={0.1} />
      </Box>

      {/* Holes */}
      {pins.map((pin) => (
        <group key={pin.id} position={pin.position}>
          <Cylinder args={[0.08, 0.09, 0.04, 8]} position={[0, -0.01, 0]}>
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
          </Cylinder>
          {/* Inner metallic contact */}
          <Cylinder args={[0.04, 0.04, 0.06, 6]} position={[0, -0.02, 0]}>
            <meshStandardMaterial color="#94a3b8" metalness={1} />
          </Cylinder>
          {/* Invisible larger hit area for easier clicking/hovering */}
          <mesh 
            onPointerOver={() => onPinHover?.(pin.id)}
            onClick={() => onPinClick?.(pin.id)}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <circleGeometry args={[0.2, 8]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
          {pin.color && (
             <Box args={[0.1, 0.01, 0.1]} position={[0, -0.012, 0]}>
               <meshBasicMaterial color={pin.color} />
             </Box>
          )}
        </group>
      ))}

      {/* Column Numbers */}
      {Array.from({ length: columns / 5 }).map((_, i) => (
        <Text
          key={i}
          position={[(i * 5 - columns / 2) * 0.5, 0.1, 2.8]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.2}
          color="#9ca3af"
        >
          {i * 5 + 1}
        </Text>
      ))}

      {/* Grid Labels A-J */}
      {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map((label, i) => (
        <Text
          key={label}
          position={[-7.5, 0.1, (i - 5) * 0.5 + (i >= 5 ? 0.2 : -0.2)]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.2}
          color="#9ca3af"
        >
          {label}
        </Text>
      ))}
    </group>
  );
};
