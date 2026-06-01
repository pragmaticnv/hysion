import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import { PlasmaBallModel } from '../models/PlasmaBallModel';

export function PlasmaViewer() {
  return (
    <div className="w-full h-64 bg-black/50 rounded-lg overflow-hidden border border-white/10 relative">
      <div className="absolute top-2 left-2 z-10 bg-black/50 px-2 py-1 rounded text-[10px] text-zinc-400 backdrop-blur-sm border border-white/10">
        Interactive Plasma Model
      </div>
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        gl={{ 
          antialias: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
          alpha: true
        }}
      >
        <Suspense fallback={null}>
          <PlasmaBallModel />
          <OrbitControls 
            enableZoom={true} 
            enablePan={false} 
            autoRotate 
            autoRotateSpeed={0.5}
            enableDamping={true}
            dampingFactor={0.05}
            zoomSpeed={1.0}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
