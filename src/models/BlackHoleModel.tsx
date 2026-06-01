import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function BlackHoleModel() {
  const groupRef = useRef<THREE.Group>(null);
  const diskRef = useRef<THREE.Mesh>(null);
  const jetsRef = useRef<THREE.Points>(null);

  const particlesCount = 5000;
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      const radius = 2 + Math.random() * 8;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 0.5 * (10 - radius);
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, []);

  const jetParticlesCount = 2000;
  const jetPositions = useMemo(() => {
    const pos = new Float32Array(jetParticlesCount * 3);
    for (let i = 0; i < jetParticlesCount; i++) {
      const radius = Math.random() * 0.5;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() * 15) * (Math.random() > 0.5 ? 1 : -1);
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.1;
      groupRef.current.rotation.z = Math.sin(time * 0.2) * 0.1;
    }
    if (diskRef.current) {
      diskRef.current.rotation.y = time * -0.5;
    }
    if (jetsRef.current) {
      const positions = jetsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < jetParticlesCount; i++) {
        const y = positions[i * 3 + 1];
        const speed = 0.5 + Math.abs(y) * 0.1;
        positions[i * 3 + 1] += Math.sign(y) * speed;
        if (Math.abs(positions[i * 3 + 1]) > 15) {
          positions[i * 3 + 1] = Math.sign(y) * 0.5;
        }
      }
      jetsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} scale={0.5}>
      {/* Event Horizon (Singularity) */}
      <mesh>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshBasicMaterial color="black" />
      </mesh>

      {/* Photon Sphere Glow */}
      <mesh>
        <sphereGeometry args={[1.7, 64, 64]} />
        <meshBasicMaterial color="#ffaa00" transparent opacity={0.2} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Accretion Disk */}
      <mesh ref={diskRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2, 10, 128]} />
        <meshBasicMaterial 
          color="#ff5500" 
          transparent 
          opacity={0.6} 
          side={THREE.DoubleSide} 
          blending={THREE.AdditiveBlending}
          map={createDiskTexture()}
        />
      </mesh>

      {/* Accretion Disk Particles */}
      <points rotation={[0, 0, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#ffaa00" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      </points>

      {/* Relativistic Jets */}
      <points ref={jetsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={jetParticlesCount}
            array={jetPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.08} color="#00aaff" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
}

function createDiskTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  if (context) {
    const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 170, 0, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 50, 0, 0.4)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
  }
  return new THREE.CanvasTexture(canvas);
}
