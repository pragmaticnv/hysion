import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Grid, Float, PerformanceMonitor, AdaptiveDpr, AdaptiveEvents, Preload } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store/useStore';

export const HologramScene = () => {
  const { theme } = useStore();
  const [dpr, setDpr] = useState(1.5);
  
  return (
    <Canvas 
      camera={{ position: [3, 3, 3], fov: 50 }} 
      dpr={dpr}
      performance={{ min: 0.5 }}
      gl={{ powerPreference: "high-performance", antialias: false, alpha: true }}
    >
      <PerformanceMonitor onChange={({ factor }) => setDpr(0.5 + 1.5 * factor)} />
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <Preload all />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color={theme.primaryHex} wireframe />
      </mesh>
      
      <group>
        <Grid
          infiniteGrid
          fadeDistance={10}
          cellColor={theme.secondaryHex}
          sectionColor={theme.secondaryHex}
          sectionThickness={1.5}
        />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
          <coneGeometry args={[2, 1.5, 32, 32, true]} />
          <meshBasicMaterial color={theme.secondaryHex} wireframe transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      </group>
      
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <mesh position={[2, 1, 0]}>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial color={theme.secondaryHex} emissive={theme.secondaryHex} />
        </mesh>
        <Text position={[2.3, 1.2, 0]} fontSize={0.15} color={theme.text === 'text-black' ? 'black' : 'white'}>
          Satellite (Geodesic Path)
        </Text>
      </Float>
      
      <OrbitControls 
        enableDamping={true}
        dampingFactor={0.05}
        zoomSpeed={1.0}
      />
    </Canvas>
  );
};
