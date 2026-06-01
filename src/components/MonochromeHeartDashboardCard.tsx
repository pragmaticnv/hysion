import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { HeartModel } from '../models/HeartModel';

export function MonochromeHeartDashboardCard() {
  return (
    <div className="bg-white dark:bg-[#0d0d10] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all aspect-square flex flex-col items-center justify-center">
      <div className="w-full h-full flex flex-col">
        <h3 className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest mb-4">Neural Heart Model</h3>
        <div className="flex-1 w-full bg-zinc-50 dark:bg-black rounded-2xl overflow-hidden grayscale">
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Suspense fallback={null}>
              <Stage intensity={0.5} environment="city" adjustCamera={false}>
                <HeartModel />
              </Stage>
            </Suspense>
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
          </Canvas>
        </div>
      </div>
    </div>
  );
}
