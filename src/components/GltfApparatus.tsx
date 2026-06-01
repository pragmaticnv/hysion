
import React, { Suspense, useMemo } from 'react';
import { useGLTF, Float, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GltfApparatusProps {
  url: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  onLoad?: () => void;
  children?: React.ReactNode;
}

export function GltfApparatus({ url, scale = 1, position = [0, 0, 0], rotation = [0, 0, 0], onLoad, children }: GltfApparatusProps) {
  const { scene } = useGLTF(url);
  
  // Clone the scene to allow multiple instances
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // Improve materials for "100% precision" realism
        if (child.material) {
          child.material = child.material.clone();
          child.material.envMapIntensity = 1.5;
        }
      }
    });
    if (onLoad) onLoad();
    return clone;
  }, [scene, onLoad]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={clonedScene} />
      {children}
    </group>
  );
}

// Pre-define some realistic model URLs
export const REALISTIC_MODELS: Record<string, { url: string; scale: number; rotation?: [number, number, number] }> = {
  microscope: {
    url: 'https://vazxmixjsiawhamofcre.supabase.co/storage/v1/object/public/models/microscope/model.gltf',
    scale: 0.8,
    rotation: [0, Math.PI / 2, 0]
  },
  battery: {
    url: 'https://vazxmixjsiawhamofcre.supabase.co/storage/v1/object/public/models/battery/model.gltf',
    scale: 1
  },
  beaker: {
    url: 'https://vazxmixjsiawhamofcre.supabase.co/storage/v1/object/public/models/beaker/model.gltf',
    scale: 1.2
  },
  motor: {
    url: 'https://vazxmixjsiawhamofcre.supabase.co/storage/v1/object/public/models/motor/model.gltf',
    scale: 0.8
  },
  breadboard: {
    url: 'https://vazxmixjsiawhamofcre.supabase.co/storage/v1/object/public/models/breadboard/model.gltf',
    scale: 1
  },
  led: {
    url: 'https://vazxmixjsiawhamofcre.supabase.co/storage/v1/object/public/models/led/model.gltf',
    scale: 0.5
  },
  multimeter: {
    url: 'https://vazxmixjsiawhamofcre.supabase.co/storage/v1/object/public/models/multimeter/model.gltf',
    scale: 1
  },
  prism: {
    url: 'https://vazxmixjsiawhamofcre.supabase.co/storage/v1/object/public/models/prism/model.gltf',
    scale: 1
  }
};
