import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WindParticlesProps {
  machNumber: number;
  angleOfAttack: number;
}

export function WindParticles({ machNumber, angleOfAttack }: WindParticlesProps) {
  const count = 800; 
  const vortexCount = 200;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const leftVortexRef = useRef<THREE.InstancedMesh>(null);
  const rightVortexRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const aoaRad = (angleOfAttack * Math.PI) / 180;

  // Generate random initial positions and speeds for particles
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 10,
        z: (Math.random() - 0.5) * 10,
        speed: 0.2 + Math.random() * 0.3,
        scale: 0.5 + Math.random() * 1.5,
      });
    }
    return temp;
  }, []);

  // Vortex particle data
  const vortexParticles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < vortexCount; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 15,
        angle: Math.random() * Math.PI * 2,
        radius: 0.1 + Math.random() * 0.5,
        speed: 0.3 + Math.random() * 0.2,
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (!meshRef.current || machNumber <= 0) return;

    const speedMultiplier = machNumber * 1.5;
    const t = state.clock.elapsedTime;

    // Main flow particles
    for (let i = 0; i < count; i++) {
      const particle = particles[i];
      const vx = -particle.speed * speedMultiplier;
      const vy = -vx * Math.tan(aoaRad);

      particle.x += vx;
      particle.y += vy;

      if (particle.x < -10 || Math.abs(particle.y) > 8) {
        particle.x = 10;
        particle.y = (Math.random() - 0.5) * 10;
        particle.z = (Math.random() - 0.5) * 10;
      }

      // Airfoil deflection logic
      const distToCenter = Math.sqrt(particle.y * particle.y + particle.z * particle.z);
      if (particle.x > -3 && particle.x < 3 && distToCenter < 2) {
        const force = (2 - distToCenter) * 0.05;
        particle.y += (particle.y / distToCenter) * force;
        particle.z += (particle.z / distToCenter) * force;
      }

      dummy.position.set(particle.x, particle.y, particle.z);
      dummy.scale.set(particle.scale * 2, 0.015, 0.015);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;

    // Vortex particles (Simulating high AoA flow separation at wingtips)
    const renderVortex = (ref: React.RefObject<THREE.InstancedMesh>, zPos: number) => {
      if (!ref.current) return;
      
      const vortexIntensity = Math.max(0, angleOfAttack / 15); // Stronger at higher AoA
      
      for (let i = 0; i < vortexCount; i++) {
        const p = vortexParticles[i];
        p.x -= p.speed * speedMultiplier;
        
        if (p.x < -10) {
          p.x = -1.5; // Starts at wing trailing edge
          p.angle = Math.random() * Math.PI * 2;
        }

        // Spiral motion
        const distFromTip = -1.5 - p.x;
        const currentRadius = p.radius + distFromTip * 0.2 * vortexIntensity;
        const currentAngle = p.angle + distFromTip * 2;
        
        const yOffset = Math.sin(currentAngle) * currentRadius;
        const zOffset = Math.cos(currentAngle) * currentRadius;

        dummy.position.set(p.x, yOffset - Math.tan(aoaRad) * distFromTip, zPos + zOffset);
        dummy.scale.set(0.1, 0.01, 0.01);
        dummy.updateMatrix();
        ref.current.setMatrixAt(i, dummy.matrix);
      }
      ref.current.instanceMatrix.needsUpdate = true;
      ref.current.visible = vortexIntensity > 0.1;
    };

    renderVortex(leftVortexRef, -2.3); // Matching wingtip missile Z
    renderVortex(rightVortexRef, 2.3);
  });

  return (
    <group>
      {/* Main Flow Lines */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </instancedMesh>

      {/* Wingtip Vortices */}
      <instancedMesh ref={leftVortexRef} args={[undefined, undefined, vortexCount]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
      </instancedMesh>
      <instancedMesh ref={rightVortexRef} args={[undefined, undefined, vortexCount]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
      </instancedMesh>
    </group>
  );
}
