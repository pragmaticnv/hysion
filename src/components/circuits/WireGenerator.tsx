import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { QuadraticBezierLine } from '@react-three/drei';

interface WireProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  thickness?: number;
}

export const Wire: React.FC<WireProps & { current?: number }> = ({ start, end, color = "#6366f1", thickness = 2, current = 0 }) => {
  const midPoint = useMemo(() => {
    /* ... same as before ... */
    const [x1, y1, z1] = start;
    const [x2, y2, z2] = end;
    const dist = Math.sqrt((x1-x2)**2 + (z1-z2)**2);
    const height = Math.max(0.5, dist * 0.4);
    return [(x1 + x2) / 2, Math.max(y1, y2) + height, (z1 + z2) / 2] as [number, number, number];
  }, [start, end]);

  const dashOffset = useRef(0);
  useFrame((state, delta) => {
    if (Math.abs(current) > 0.0001) {
      dashOffset.current -= delta * current * 10;
    }
  });

  return (
    <group>
      <QuadraticBezierLine
        start={start}
        end={end}
        mid={midPoint}
        color={color}
        lineWidth={thickness}
        transparent
        opacity={0.8}
        dashed={true}
        dashScale={current !== 0 ? 5 : 0}
        dashOffset={dashOffset.current}
      />
      {/* Connector pins at ends */}
      <mesh position={start}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#9ca3af" metalness={1} />
      </mesh>
      <mesh position={end}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#9ca3af" metalness={1} />
      </mesh>
    </group>
  );
};
