import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useBox } from '@react-three/cannon';
import * as THREE from 'three';

function PropWash() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const particleCount = 40;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, () => ({
      radius: Math.random() * 0.4,
      angle: Math.random() * Math.PI * 2,
      y: -Math.random() * 1.5,
      speed: 4 + Math.random() * 4,
      life: Math.random(),
      scale: 0.5 + Math.random() * 0.5
    }));
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    particles.forEach((p, i) => {
      p.y -= p.speed * delta;
      p.life -= delta * 1.5;
      
      // Expand outwards slightly as it goes down (downwash cone)
      p.radius += delta * 0.5;

      if (p.life <= 0 || p.y < -2) {
        p.y = 0;
        p.life = 1;
        p.radius = Math.random() * 0.4;
        p.angle = Math.random() * Math.PI * 2;
      }
      
      const x = Math.cos(p.angle) * p.radius;
      const z = Math.sin(p.angle) * p.radius;

      dummy.position.set(x, p.y, z);
      // Fade out by scaling down thickness, but keep length
      dummy.scale.set(p.scale * p.life, p.scale, p.scale * p.life); 
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, particleCount]}>
      <cylinderGeometry args={[0.005, 0.005, 0.3, 4]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.15} depthWrite={false} blending={THREE.AdditiveBlending} />
    </instancedMesh>
  );
}

function SprayParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const particleCount = 60;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, () => ({
      x: 0,
      y: 0,
      z: 0,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -2 - Math.random() * 2,
      vz: (Math.random() - 0.5) * 0.5,
      life: Math.random(),
      scale: 0.5 + Math.random() * 0.5
    }));
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    particles.forEach((p, i) => {
      p.x += p.vx * delta;
      p.y += p.vy * delta;
      p.z += p.vz * delta;
      p.life -= delta * 1.2;

      if (p.life <= 0) {
        p.x = (Math.random() - 0.5) * 0.05;
        p.y = 0;
        p.z = (Math.random() - 0.5) * 0.05;
        p.vx = (Math.random() - 0.5) * 0.8;
        p.vy = -2 - Math.random() * 2;
        p.vz = (Math.random() - 0.5) * 0.8;
        p.life = 1;
      }
      
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.setScalar(p.scale * p.life);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, particleCount]}>
      <sphereGeometry args={[0.015, 4, 4]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.4} depthWrite={false} blending={THREE.NormalBlending} />
    </instancedMesh>
  );
}

export function DroneModel({ showLabels = true, isSoundEnabled = false, physicsEnabled = false }: { showLabels?: boolean, isSoundEnabled?: boolean, physicsEnabled?: boolean }) {
  const [isDragging, setIsDragging] = useState(false);
  const dragPlane = useRef(new THREE.Plane());
  const dragStartIntersection = useRef(new THREE.Vector3());
  const dragStartObjPos = useRef(new THREE.Vector3());

  const [physicsRef, api] = useBox(() => ({
    mass: 2,
    position: [0, 0, 0],
    type: physicsEnabled ? 'Dynamic' : 'Static',
    args: [3, 1.5, 3], // Approximate bounding box for the drone
    linearDamping: 0.2, // Air resistance / Drag simulation
    angularDamping: 0.5, // Rotational stability
  }), useRef<THREE.Group>(null));

  const rotorsRef = useRef<THREE.Group[]>([]);
  const cameraLensRef = useRef<THREE.Mesh>(null);
  
  // Audio synthesis
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const oscRefs = useRef<OscillatorNode[]>([]);
  const gainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (!isSoundEnabled) {
      if (audioCtx) {
        oscRefs.current.forEach(osc => {
          try { osc.stop(); } catch(e) {}
        });
        if (audioCtx.state !== 'closed') {
          audioCtx.close();
        }
        setAudioCtx(null);
        oscRefs.current = [];
        gainRef.current = null;
      }
      return;
    }

    // Initialize audio context on mount
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    setAudioCtx(ctx);
    
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.05; // Low volume for ambient hum
    masterGain.connect(ctx.destination);
    gainRef.current = masterGain;

    // Create multiple oscillators for a rich drone sound
    const frequencies = [120, 122, 240, 245];
    
    frequencies.forEach(freq => {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800;
      
      osc.connect(filter);
      filter.connect(masterGain);
      osc.start();
      oscRefs.current.push(osc);
    });

    return () => {
      oscRefs.current.forEach(osc => {
        try { osc.stop(); } catch(e) {}
      });
      if (ctx.state !== 'closed') {
        ctx.close();
      }
    };
  }, [isSoundEnabled]);

  useEffect(() => {
    if (!physicsEnabled) {
      api.position.set(0, 0, 0);
      api.velocity.set(0, 0, 0);
      api.angularVelocity.set(0, 0, 0);
      api.rotation.set(0, 0, 0);
    }
  }, [physicsEnabled, api]);

  useFrame((state, delta) => {
    if (physicsEnabled && !isDragging) {
      // Physics Simulation: Apply forces to simulate flight
      // Gravity is managed by the Physics provider (9.81 m/s^2)
      // Mass is 2kg, so weight is approx 19.62N
      
      // Calculate thrust for hovering with some oscillation
      const time = state.clock.elapsedTime;
      const baseThrust = 19.62; // F = m * g
      const hoverOscillation = Math.sin(time * 2) * 1.5; // Slight drift
      const stabilityCorrection = 0.5;
      
      // Apply upward thrust to counteract gravity
      api.applyForce([0, baseThrust + hoverOscillation + stabilityCorrection, 0], [0, 0, 0]);
      
      // Add a tiny bit of random horizontal drift for realism
      if (time % 2 < 0.1) {
        const driftX = (Math.random() - 0.5) * 0.5;
        const driftZ = (Math.random() - 0.5) * 0.5;
        api.applyImpulse([driftX, 0, driftZ], [0, 0, 0]);
      }
    }

    if (!physicsEnabled && physicsRef.current) {
      // Advanced hovering effect with multi-axis noise - only when physics is off
      const time = state.clock.elapsedTime;
      physicsRef.current.position.y = Math.sin(time * 2) * 0.15 + Math.sin(time * 3.5) * 0.05;
      physicsRef.current.rotation.y = Math.sin(time * 0.5) * 0.2;
      physicsRef.current.rotation.z = Math.sin(time * 1.5) * 0.08 + Math.cos(time * 2.5) * 0.02;
      physicsRef.current.rotation.x = Math.cos(time * 1.2) * 0.08 + Math.sin(time * 2.2) * 0.02;
    }

    if (physicsRef.current) {
      const time = state.clock.elapsedTime;
      // Modulate audio based on movement
      if (gainRef.current && audioCtx && audioCtx.state === 'running') {
        // Slight pitch and volume modulation
        const movementIntensity = Math.abs(Math.sin(time * 2)) + Math.abs(Math.cos(time * 1.5));
        
        const targetGain = 0.03 + movementIntensity * 0.02;
        const startTime = audioCtx.currentTime;
        
        if (Number.isFinite(targetGain) && Number.isFinite(startTime)) {
          try {
            gainRef.current.gain.setTargetAtTime(targetGain, startTime, 0.1);
          } catch (e) {
            // Silently handle potential audio errors
          }
        }
        
        oscRefs.current.forEach((osc, i) => {
          const baseFreq = [120, 122, 240, 245][i];
          const targetFreq = baseFreq + movementIntensity * 5;
          if (Number.isFinite(targetFreq) && Number.isFinite(startTime)) {
            try {
              osc.frequency.setTargetAtTime(targetFreq, startTime, 0.1);
            } catch (e) {
              // Silently handle potential audio errors
            }
          }
        });
      }
    }

    // Spin rotors incredibly fast with motion blur effect
    rotorsRef.current.forEach((rotor, i) => {
      if (rotor) {
        const dir = i % 2 === 0 ? 1 : -1;
        rotor.rotation.y += delta * 40 * dir;
      }
    });

    // Pulse camera lens
    if (cameraLensRef.current) {
      const material = cameraLensRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 2 + Math.sin(state.clock.elapsedTime * 8) * 1;
    }
  });

    // Ultra-Realistic Materials
  const whiteBodyMaterial = new THREE.MeshPhysicalMaterial({ 
    color: '#e2e8f0', 
    roughness: 0.1, 
    metalness: 0.8, 
    clearcoat: 1.0, 
    clearcoatRoughness: 0.05,
    envMapIntensity: 2.5
  });

  const darkAlloyMaterial = new THREE.MeshPhysicalMaterial({ 
    color: '#0a0f1c', 
    roughness: 0.2, 
    metalness: 1.0, 
    clearcoat: 0.8,
    envMapIntensity: 2.0
  });

  const aluminumMaterial = new THREE.MeshPhysicalMaterial({
    color: '#a0aab5',
    roughness: 0.4,
    metalness: 0.9,
    clearcoat: 0.1,
    envMapIntensity: 1.5
  });

  const copperMaterial = new THREE.MeshPhysicalMaterial({
    color: '#b87333',
    roughness: 0.5,
    metalness: 0.8,
    clearcoat: 0.2,
    envMapIntensity: 1.0
  });

  const carbonFiberMaterial = new THREE.MeshPhysicalMaterial({ 
    color: '#111827', 
    roughness: 0.4, 
    metalness: 0.6, 
    clearcoat: 0.4
  });

  const blackPlasticMaterial = new THREE.MeshPhysicalMaterial({ 
    color: '#000000', 
    roughness: 0.9, 
    metalness: 0.1, 
    clearcoat: 0.0
  });

  const orangeNozzleMaterial = new THREE.MeshPhysicalMaterial({ 
    color: '#ea580c', 
    roughness: 0.5, 
    metalness: 0.1, 
    clearcoat: 0.2
  });
  
  const redLEDMaterial = new THREE.MeshStandardMaterial({
    color: '#ef4444', // Red LED for realism
    emissive: '#ef4444',
    emissiveIntensity: 2,
    toneMapped: false
  });

  const coreEmissiveMaterial = new THREE.MeshStandardMaterial({
    color: '#eab308', // Amber warning light
    emissive: '#eab308',
    emissiveIntensity: 2,
    toneMapped: false
  });

  const rotorMaterial = new THREE.MeshPhysicalMaterial({ 
    color: '#0f172a', 
    roughness: 0.1, 
    metalness: 0.9, 
    transparent: true, 
    opacity: 0.25,
    transmission: 0.8,
    thickness: 0.05
  });

  const glassMaterial = new THREE.MeshPhysicalMaterial({ 
    color: '#ffffff', 
    metalness: 0.2, 
    roughness: 0.0, 
    transmission: 1.0, 
    ior: 1.55,
    thickness: 0.2,
    transparent: true, 
    opacity: 1.0 
  });

  const armLength = 1.8;
  const numArms = 6;
  const arms = Array.from({ length: numArms }).map((_, i) => {
    const angle = (Math.PI / 3) * i + Math.PI / 6;
    return { angle };
  });

  return (
    <group 
      ref={physicsRef as any} 
      scale={1.0}
      onPointerDown={(e) => {
        if (audioCtx && audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        
        if (physicsEnabled) {
          e.stopPropagation();
          (e.target as any).setPointerCapture(e.pointerId);
          setIsDragging(true);
          
          if (physicsRef.current) {
            dragStartObjPos.current.copy(physicsRef.current.position);
            dragPlane.current.setFromNormalAndCoplanarPoint(
              e.camera.getWorldDirection(new THREE.Vector3()).negate(),
              physicsRef.current.position
            );
            e.ray.intersectPlane(dragPlane.current, dragStartIntersection.current);
            api.mass.set(0); // Make it static/kinematic while dragging
          }
        }
      }}
      onPointerUp={(e) => {
        if (isDragging) {
          e.stopPropagation();
          (e.target as any).releasePointerCapture(e.pointerId);
          setIsDragging(false);
          api.mass.set(2); // Restore mass
        }
      }}
      onPointerMove={(e) => {
        if (isDragging && physicsRef.current) {
          e.stopPropagation();
          const currentIntersection = new THREE.Vector3();
          e.ray.intersectPlane(dragPlane.current, currentIntersection);
          
          if (currentIntersection) {
            const delta = currentIntersection.sub(dragStartIntersection.current);
            const newPos = dragStartObjPos.current.clone().add(delta);
            api.position.set(newPos.x, newPos.y, newPos.z);
            api.velocity.set(0, 0, 0); // Stop velocity while dragging
          }
        }
      }}
    >
      {/* Ultra-Advanced Core Chassis */}
      <group position={[0, 0.2, 0]}>
        <mesh material={carbonFiberMaterial}>
          <cylinderGeometry args={[0.7, 0.8, 0.3, 16]} />
        </mesh>
        
        {/* Core Flight Controller / Battery Unit */}
        <mesh position={[0, 0.1, 0]} material={darkAlloyMaterial}>
          <cylinderGeometry args={[0.65, 0.75, 0.32, 16]} />
        </mesh>

        {/* Chassis Details / Heat Sinks */}
        <group position={[0, 0, 0]}>
          {Array.from({ length: 12 }).map((_, i) => (
             <mesh key={i} material={aluminumMaterial} position={[0.72 * Math.cos(i * Math.PI / 6), 0.05, 0.72 * Math.sin(i * Math.PI / 6)]} rotation={[0, -i * Math.PI / 6, 0]}>
                <boxGeometry args={[0.08, 0.25, 0.05]} />
             </mesh>
          ))}
        </group>
        
        {/* Aerodynamic Top Dome */}
        <mesh position={[0, 0.3, 0]} material={darkAlloyMaterial}>
          <cylinderGeometry args={[0.5, 0.7, 0.3, 16]} />
        </mesh>
        <mesh position={[0, 0.55, 0]} material={whiteBodyMaterial}>
          <sphereGeometry args={[0.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>

        {/* Ventilation Grills on Top Dome */}
        {Array.from({ length: 6 }).map((_, i) => (
           <mesh key={`vent-${i}`} material={carbonFiberMaterial} position={[0.35 * Math.cos(i * Math.PI / 3), 0.6, 0.35 * Math.sin(i * Math.PI / 3)]} rotation={[Math.PI / 8, -i * Math.PI / 3, 0]}>
              <boxGeometry args={[0.15, 0.02, 0.05]} />
           </mesh>
        ))}
        
        {/* Top Status LED */}
        <group position={[0, 1.05, 0]}>
          <mesh material={glassMaterial}>
            <cylinderGeometry args={[0.09, 0.09, 0.06, 16]} />
          </mesh>
          <mesh material={redLEDMaterial}>
            <cylinderGeometry args={[0.07, 0.07, 0.04, 16]} />
          </mesh>
        </group>
      </group>

      {/* Tank / Payload Section underneath */}
      <group position={[0, -0.3, 0]}>
        <mesh material={whiteBodyMaterial}>
          <cylinderGeometry args={[0.6, 0.5, 0.6, 16]} />
        </mesh>
        {/* Tank inner liquid vibe */}
        <mesh position={[0, 0, 0]} material={glassMaterial}>
          <cylinderGeometry args={[0.61, 0.51, 0.58, 16]} />
        </mesh>
        {/* Pump Mechanism */}
        <mesh position={[0, 0, 0]} material={aluminumMaterial}>
          <cylinderGeometry args={[0.3, 0.25, 0.4, 16]} />
        </mesh>
        {/* Payload Armor */}
        {Array.from({ length: 8 }).map((_, i) => (
           <mesh key={`armor-${i}`} material={carbonFiberMaterial} position={[0.55 * Math.cos(i * Math.PI / 4), 0, 0.55 * Math.sin(i * Math.PI / 4)]} rotation={[0, -i * Math.PI / 4, 0]}>
              <boxGeometry args={[0.1, 0.55, 0.05]} />
           </mesh>
        ))}
        <mesh position={[0, -0.35, 0]} material={darkAlloyMaterial}>
          <cylinderGeometry args={[0.5, 0.3, 0.2, 16]} />
        </mesh>
        <mesh position={[0, -0.5, 0]} material={blackPlasticMaterial}>
          <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
        </mesh>
      </group>

      {/* Advanced Sensor / Gimbal Camera Module (Front) */}
      <group position={[0, 0.1, 0.85]}>
        <mesh material={darkAlloyMaterial}>
          <boxGeometry args={[0.3, 0.25, 0.3]} />
        </mesh>
        
        {/* Gimbal Mount */}
        <mesh position={[0, -0.15, 0.1]} material={carbonFiberMaterial} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.15, 16]} />
        </mesh>

        {/* Dynamic Camera Head */}
        <group position={[0, -0.2, 0.15]}>
           <mesh material={darkAlloyMaterial}>
             <sphereGeometry args={[0.12, 32, 32]} />
           </mesh>
           {/* Main Lens */}
           <mesh position={[0, 0, 0.1]} material={glassMaterial} rotation={[Math.PI / 2, 0, 0]}>
             <cylinderGeometry args={[0.07, 0.07, 0.05, 32]} />
           </mesh>
           <mesh ref={cameraLensRef} position={[0, 0, 0.12]} material={redLEDMaterial}>
             <circleGeometry args={[0.04, 32]} />
           </mesh>
           
           {/* Lidar/Secondary Sensor */}
           <mesh position={[0.06, 0.06, 0.1]} material={glassMaterial}>
             <circleGeometry args={[0.015, 16]} />
           </mesh>
           <mesh position={[-0.06, 0.06, 0.1]} material={glassMaterial}>
             <circleGeometry args={[0.015, 16]} />
           </mesh>
        </group>
      </group>

      {/* Cybernetic Landing Gear */}
      <group position={[0, -0.4, 0]}>
        {/* Left Leg */}
        <group position={[-0.6, -0.4, 0]} rotation={[0, 0, -Math.PI / 8]}>
          <mesh material={carbonFiberMaterial}>
            <cylinderGeometry args={[0.04, 0.06, 1.0, 8]} />
          </mesh>
          <mesh position={[0, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]} material={darkAlloyMaterial}>
            <cylinderGeometry args={[0.06, 0.06, 1.4, 16]} />
          </mesh>
          {/* Shock Absorber Details */}
          <mesh position={[0, -0.2, 0]} material={whiteBodyMaterial}>
             <cylinderGeometry args={[0.07, 0.07, 0.2, 16]} />
          </mesh>
        </group>
        
        {/* Right Leg */}
        <group position={[0.6, -0.4, 0]} rotation={[0, 0, Math.PI / 8]}>
          <mesh material={carbonFiberMaterial}>
            <cylinderGeometry args={[0.04, 0.06, 1.0, 8]} />
          </mesh>
          <mesh position={[0, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]} material={darkAlloyMaterial}>
            <cylinderGeometry args={[0.06, 0.06, 1.4, 16]} />
          </mesh>
          <mesh position={[0, -0.2, 0]} material={whiteBodyMaterial}>
             <cylinderGeometry args={[0.07, 0.07, 0.2, 16]} />
          </mesh>
        </group>
      </group>

      {/* Modular Arms and Propulsion Systems */}
      {arms.map((pos, i) => {
        return (
           <group key={i} rotation={[0, pos.angle, 0]}>
            {/* Core Arm Structure */}
            <mesh 
              position={[0, 0.25, armLength / 2]} 
              rotation={[Math.PI / 2, 0, 0]}
              material={carbonFiberMaterial}
            >
              <cylinderGeometry args={[0.05, 0.08, armLength, 16]} />
            </mesh>

            {/* Arm Armor Plating */}
            <mesh 
              position={[0, 0.28, armLength / 2]} 
              rotation={[Math.PI / 2, 0, 0]}
              material={whiteBodyMaterial}
            >
              <boxGeometry args={[0.12, armLength * 0.8, 0.02]} />
            </mesh>
            
            {/* Arm Joint (where it connects to body) */}
            <mesh 
              position={[0, 0.25, armLength * 0.2]} 
              material={darkAlloyMaterial}
            >
              <boxGeometry args={[0.2, 0.2, 0.35]} />
            </mesh>

            {/* Joint Axis */}
            <mesh 
              position={[0, 0.25, armLength * 0.2]} 
              material={aluminumMaterial}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.11, 0.11, 0.26, 16]} />
            </mesh>
            
            {/* Arm Folding Hinge (midway) */}
            <mesh 
              position={[0, 0.25, armLength * 0.5]} 
              material={whiteBodyMaterial}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.15, 0.15, 0.25, 16]} />
            </mesh>

            {/* Arm Structural Detail */}
            <mesh
              position={[0, 0.26, armLength * 0.75]}
              material={darkAlloyMaterial}
            >
              <boxGeometry args={[0.08, 0.02, 0.5]} />
            </mesh>

            {/* Advanced Motor Housing */}
            <group position={[0, 0.3, armLength]}>
              <mesh material={darkAlloyMaterial}>
                <cylinderGeometry args={[0.2, 0.18, 0.25, 32]} />
              </mesh>
              <mesh position={[0, -0.15, 0]} material={whiteBodyMaterial}>
                <cylinderGeometry args={[0.15, 0.1, 0.1, 32]} />
              </mesh>
              {/* Heat Sink Fins */}
              <mesh material={blackPlasticMaterial}>
                <cylinderGeometry args={[0.21, 0.21, 0.2, 24, 1, false, 0, Math.PI * 2]} />
              </mesh>
              {/* Motor Stator Coils */}
              <mesh position={[0, 0.15, 0]} material={copperMaterial}>
                <cylinderGeometry args={[0.14, 0.14, 0.02, 32]} />
              </mesh>
            </group>

            {/* Spray Nozzle System / Payload Drop */}
            <group position={[0, -0.1, armLength]}>
              <mesh material={blackPlasticMaterial}>
                <cylinderGeometry args={[0.02, 0.02, 0.8, 12]} />
              </mesh>
              {/* Nozzle Joint */}
              <mesh position={[0, -0.3, 0]} material={whiteBodyMaterial} rotation={[Math.PI / 2, 0, 0]}>
                 <cylinderGeometry args={[0.04, 0.04, 0.1, 12]} />
              </mesh>
              <mesh position={[0, -0.4, 0]} material={darkAlloyMaterial}>
                <cylinderGeometry args={[0.06, 0.03, 0.15, 16]} />
              </mesh>
              <mesh position={[0, -0.48, 0]} material={orangeNozzleMaterial}>
                <cylinderGeometry args={[0.04, 0.02, 0.05, 16]} />
              </mesh>
              {/* Spray Effect */}
              <group position={[0, -0.5, 0]}>
                <SprayParticles />
              </group>
            </group>

            {/* Prop Wash Effect */}
            <group position={[0, 0.3, armLength]}>
              <PropWash />
            </group>

            {/* Advanced Stealth Rotor Blades */}
            <group 
              position={[0, 0.48, armLength]} 
              ref={(el) => { if (el) rotorsRef.current[i] = el; }}
            >
              {/* Rotor Hub */}
              <mesh material={darkAlloyMaterial}>
                <cylinderGeometry args={[0.07, 0.09, 0.08, 16]} />
              </mesh>
              <mesh position={[0, 0.05, 0]} material={whiteBodyMaterial}>
                <sphereGeometry args={[0.07, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              </mesh>
              
              {/* Blade 1 */}
              <mesh material={rotorMaterial} position={[0.45, 0, 0]}>
                <boxGeometry args={[0.9, 0.005, 0.08]} />
              </mesh>
              {/* Blade 2 */}
              <mesh material={rotorMaterial} position={[-0.45, 0, 0]}>
                <boxGeometry args={[0.9, 0.005, 0.08]} />
              </mesh>
              
              {/* Motion Blur Disc */}
              <mesh material={rotorMaterial} rotation={[Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.95, 32]} />
              </mesh>
            </group>
          </group>
        );
      })}
    </group>
  );
}

