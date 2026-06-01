import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export function SteamEngineModel({ showLabels, ...props }: { showLabels?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Group>(null);
  const rodsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const speed = 3;
    
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * speed * 4) * 0.02;
    }
    
    if (wheelsRef.current) {
      wheelsRef.current.children.forEach((wheelGroup) => {
        wheelGroup.rotation.z = -t * speed;
      });
    }
    
    if (rodsRef.current) {
      // Move connecting rods in a circle to match wheel rotation
      rodsRef.current.position.x = Math.cos(-t * speed) * 0.2;
      rodsRef.current.position.y = Math.sin(-t * speed) * 0.2;
    }
  });

  const materials = useMemo(() => ({
    body: new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.7, metalness: 0.6 }),
    gold: new THREE.MeshStandardMaterial({ color: '#d4af37', roughness: 0.3, metalness: 0.8 }),
    red: new THREE.MeshStandardMaterial({ color: '#8b0000', roughness: 0.6, metalness: 0.4 }),
    wheel: new THREE.MeshStandardMaterial({ color: '#222222', roughness: 0.8, metalness: 0.5 }),
    steel: new THREE.MeshStandardMaterial({ color: '#777777', roughness: 0.4, metalness: 0.9 }),
  }), []);

  return (
    <group ref={groupRef} scale={1.2} {...props}>
      {/* Boiler */}
      <mesh position={[0, 1.5, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.body} castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 0.7, 3, 32]} />
      </mesh>

      {/* Cab */}
      <mesh position={[-2, 1.8, 0]} material={materials.body} castShadow receiveShadow>
        <boxGeometry args={[1.5, 2.2, 1.8]} />
      </mesh>
      {/* Cab Roof */}
      <mesh position={[-2, 3, 0]} material={materials.body} castShadow receiveShadow>
        <boxGeometry args={[1.7, 0.2, 2]} />
      </mesh>
      {/* Cab Window Cutouts (simulated with dark boxes) */}
      <mesh position={[-2, 2.2, 0.91]} material={materials.wheel}>
        <boxGeometry args={[0.6, 0.8, 0.05]} />
      </mesh>
      <mesh position={[-2, 2.2, -0.91]} material={materials.wheel}>
        <boxGeometry args={[0.6, 0.8, 0.05]} />
      </mesh>

      {/* Chimney */}
      <mesh position={[1.1, 2.5, 0]} material={materials.body} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.2, 1.2, 16]} />
      </mesh>
      {/* Chimney Top */}
      <mesh position={[1.1, 3.1, 0]} material={materials.gold} castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.25, 0.2, 16]} />
      </mesh>

      {/* Domes */}
      <mesh position={[0.2, 2.3, 0]} material={materials.gold} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.4, 16]} />
      </mesh>
      <mesh position={[0.2, 2.5, 0]} material={materials.gold} castShadow receiveShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
      </mesh>

      <mesh position={[-0.6, 2.3, 0]} material={materials.gold} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.4, 16]} />
      </mesh>
      <mesh position={[-0.6, 2.5, 0]} material={materials.gold} castShadow receiveShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
      </mesh>

      {/* Front Plate / Smokebox door */}
      <mesh position={[1.51, 1.5, 0]} rotation={[0, 0, -Math.PI / 2]} material={materials.body} castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 0.7, 0.1, 32]} />
      </mesh>
      <mesh position={[1.55, 1.5, 0]} rotation={[0, 0, -Math.PI / 2]} material={materials.steel} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
      </mesh>

      {/* Headlight */}
      <mesh position={[1.6, 2.0, 0]} material={materials.gold} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.3, 0.3]} />
      </mesh>
      <mesh position={[1.71, 2.0, 0]} rotation={[0, 0, -Math.PI / 2]} material={new THREE.MeshStandardMaterial({ color: '#ffffee', emissive: '#ffffee', emissiveIntensity: 2 })}>
        <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
      </mesh>

      {/* Cowcatcher */}
      <mesh position={[1.8, 0.4, 0]} rotation={[0, 0, -Math.PI / 8]} material={materials.body} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.6, 1.4]} />
      </mesh>

      {/* Chassis */}
      <mesh position={[-0.2, 0.8, 0]} material={materials.red} castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.4, 1.6]} />
      </mesh>

      {/* Wheels */}
      <group ref={wheelsRef}>
        {/* Large Driving Wheels */}
        {[0, -1.2].map((x, i) => (
          <group key={`drive-${i}`} position={[x, 0.5, 0]}>
            <mesh position={[0, 0, 0.9]} rotation={[Math.PI / 2, 0, 0]} material={materials.wheel} castShadow receiveShadow>
              <cylinderGeometry args={[0.6, 0.6, 0.2, 24]} />
            </mesh>
            <mesh position={[0, 0, -0.9]} rotation={[Math.PI / 2, 0, 0]} material={materials.wheel} castShadow receiveShadow>
              <cylinderGeometry args={[0.6, 0.6, 0.2, 24]} />
            </mesh>
            {/* Wheel spokes detail */}
            <mesh position={[0, 0, 1.01]} material={materials.steel}>
              <boxGeometry args={[1.1, 0.05, 0.05]} />
            </mesh>
            <mesh position={[0, 0, 1.01]} rotation={[0, 0, Math.PI / 2]} material={materials.steel}>
              <boxGeometry args={[1.1, 0.05, 0.05]} />
            </mesh>
            <mesh position={[0, 0, -1.01]} material={materials.steel}>
              <boxGeometry args={[1.1, 0.05, 0.05]} />
            </mesh>
            <mesh position={[0, 0, -1.01]} rotation={[0, 0, Math.PI / 2]} material={materials.steel}>
              <boxGeometry args={[1.1, 0.05, 0.05]} />
            </mesh>
          </group>
        ))}

        {/* Small Front Wheels */}
        <group position={[1.4, 0.3, 0]}>
          <mesh position={[0, 0, 0.8]} rotation={[Math.PI / 2, 0, 0]} material={materials.wheel} castShadow receiveShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          </mesh>
          <mesh position={[0, 0, -0.8]} rotation={[Math.PI / 2, 0, 0]} material={materials.wheel} castShadow receiveShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          </mesh>
          <mesh position={[0, 0, 0.91]} material={materials.steel}>
            <boxGeometry args={[0.5, 0.05, 0.05]} />
          </mesh>
          <mesh position={[0, 0, -0.91]} material={materials.steel}>
            <boxGeometry args={[0.5, 0.05, 0.05]} />
          </mesh>
        </group>
      </group>

      {/* Connecting Rods */}
      <group ref={rodsRef}>
        <mesh position={[-0.6, 0.5, 1.05]} material={materials.steel} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.1, 0.05]} />
        </mesh>
        <mesh position={[-0.6, 0.5, -1.05]} material={materials.steel} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.1, 0.05]} />
        </mesh>
      </group>

      {showLabels && (
        <Html position={[0, 4.5, 0]} center className="pointer-events-none">
          <div className="px-4 py-2 bg-black/80 backdrop-blur-md border border-orange-500/30 rounded-xl text-[10px] text-orange-400 font-mono uppercase tracking-widest shadow-lg flex flex-col items-center gap-1">
            <span className="font-bold">Steam Engine</span>
            <span className="text-[8px] opacity-70">Industrial Revolution</span>
          </div>
        </Html>
      )}
    </group>
  );
}
