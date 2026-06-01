import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Cone, Box, Html, Sphere, Plane } from '@react-three/drei';
import * as THREE from 'three';

interface MissileModelProps {
  isSoundEnabled?: boolean;
}

function Submunition({ position, delay }: { position: [number, number, number], delay: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const [active, setActive] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setActive(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  useFrame((state) => {
    if (!active || !ref.current) return;
    ref.current.position.y -= 0.05;
    ref.current.position.x += (Math.random() - 0.5) * 0.02;
    ref.current.rotation.x += 0.1;
    ref.current.rotation.z += 0.1;
    
    if (ref.current.position.y < -10) {
      ref.current.position.set(position[0], position[1], position[2]);
    }
  });

  if (!active) return null;

  return (
    <Cylinder ref={ref} args={[0.05, 0.05, 0.2, 8]} position={position}>
      <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
    </Cylinder>
  );
}

function SmokeTrail({ position, color = "#94a3b8", count = 20 }: { position: [number, number, number], color?: string, count?: number }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      pos: new THREE.Vector3(0, 0, 0),
      scale: Math.random() * 0.5 + 0.2,
      speed: Math.random() * 0.05 + 0.02,
      offset: new THREE.Vector3((Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5)
    }));
  }, [count]);

  const refs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    refs.current.forEach((ref, i) => {
      if (!ref) return;
      const p = particles[i];
      ref.position.y -= p.speed;
      ref.position.x += Math.sin(t + i) * 0.01;
      ref.scale.setScalar(p.scale * (1 + Math.sin(t * 2 + i) * 0.2));
      if (ref.position.y < -5) {
        ref.position.set(p.offset.x, p.offset.y, p.offset.z);
      }
    });
  });

  return (
    <group position={position}>
      {particles.map((p, i) => (
        <Sphere key={i} ref={(el) => { refs.current[i] = el; }} args={[0.5, 16, 16]} position={[p.offset.x, p.offset.y, p.offset.z]}>
          <meshStandardMaterial color={color} transparent opacity={0.4} />
        </Sphere>
      ))}
    </group>
  );
}

function Explosion({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!ref.current) return;
    const s = 1 + Math.sin(state.clock.getElapsedTime() * 10) * 0.1;
    ref.current.scale.set(s, s, s);
  });

  return (
    <group position={position} ref={ref}>
      <Sphere args={[1.5, 16, 16]}>
        <meshBasicMaterial color="#f97316" transparent opacity={0.6} />
      </Sphere>
      <Sphere args={[1, 16, 16]}>
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.8} />
      </Sphere>
      <Html center>
        <div className="w-24 h-24 bg-orange-500/20 blur-xl rounded-full animate-pulse" />
      </Html>
    </group>
  );
}

export function MissileModel({ isSoundEnabled = true }: MissileModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Audio logic (simplified for brevity but kept functional)
  const audioCtxRef = useRef<AudioContext | null>(null);
  useEffect(() => {
    if (isSoundEnabled && !audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, [isSoundEnabled]);

  return (
    <group ref={groupRef}>
      {/* Background Environment */}
      <group position={[0, -8, -10]}>
        {/* Desert Ground */}
        <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#a8a29e" roughness={1} />
        </Plane>
        
        {/* Distant Mountains */}
        <group position={[0, 0, -20]}>
          <Cone args={[10, 8, 4]} position={[-15, 4, 0]} rotation={[0, Math.PI / 4, 0]}>
            <meshStandardMaterial color="#78716c" />
          </Cone>
          <Cone args={[12, 10, 4]} position={[5, 5, 0]} rotation={[0, Math.PI / 4, 0]}>
            <meshStandardMaterial color="#89817a" />
          </Cone>
        </group>

        {/* Ground Explosions */}
        <Explosion position={[-10, 1, 5]} />
        <Explosion position={[-5, 0.5, 8]} />
        <Explosion position={[8, 1, -2]} />
      </group>

      {/* Left Missile (Cluster Munition) */}
      <group position={[-6, 4, 0]} rotation={[0, 0, -Math.PI / 4]}>
        {/* Body */}
        <Cylinder args={[0.5, 0.5, 6, 32]}>
          <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.2} />
        </Cylinder>
        
        {/* Bands (Flag) */}
        <group position={[0, 1.5, 0]}>
          <Cylinder args={[0.51, 0.51, 0.3, 32]} position={[0, 0.3, 0]}>
            <meshStandardMaterial color="#166534" />
          </Cylinder>
          <Cylinder args={[0.51, 0.51, 0.3, 32]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#ffffff" />
          </Cylinder>
          <Cylinder args={[0.51, 0.51, 0.3, 32]} position={[0, -0.3, 0]}>
            <meshStandardMaterial color="#991b1b" />
          </Cylinder>
        </group>

        <Cone args={[0.5, 1.5, 32]} position={[0, 3.75, 0]}>
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </Cone>

        {/* Cluster Dispenser Section */}
        <Cylinder args={[0.52, 0.52, 1.5, 32]} position={[0, -0.5, 0]}>
          <meshStandardMaterial color="#1e293b" wireframe transparent opacity={0.5} />
        </Cylinder>

        {/* Submunitions falling */}
        {Array.from({ length: 12 }).map((_, i) => (
          <Submunition key={i} position={[0, -1, 0]} delay={i * 0.2} />
        ))}

        {/* Thruster */}
        <group position={[0, -3.5, 0]}>
          <Cone args={[0.4, 2, 16]} rotation={[Math.PI, 0, 0]}>
            <meshBasicMaterial color="#f97316" transparent opacity={0.8} />
          </Cone>
          <SmokeTrail position={[0, -1, 0]} color="#475569" count={30} />
        </group>

        {/* Labels */}
        <Html position={[1.5, 3.5, 0]} distanceFactor={15}>
          <div className="bg-black/80 backdrop-blur-md p-3 rounded-xl border border-emerald-500/30 text-white w-48 shadow-2xl">
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Heavy Ballistic Unit</div>
            <div className="text-xs font-display font-bold mb-1">Re-entry Vehicle</div>
            <div className="text-[9px] text-zinc-400 leading-tight">Reinforced thermal shielding for atmospheric re-entry.</div>
          </div>
        </Html>

        <Html position={[1.5, -0.5, 0]} distanceFactor={15}>
          <div className="bg-black/80 backdrop-blur-md p-3 rounded-xl border border-orange-500/30 text-white w-48 shadow-2xl">
            <div className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-1">Payload System</div>
            <div className="text-xs font-display font-bold mb-1">Cluster Dispenser</div>
            <div className="text-[9px] text-zinc-400 leading-tight">Active ejection of 12x high-explosive submunitions.</div>
          </div>
        </Html>
      </group>

      {/* Right Missile (Interceptor) */}
      <group position={[6, 2, -2]} rotation={[0, 0, Math.PI / 6]}>
        {/* Body */}
        <Cylinder args={[0.4, 0.4, 7, 32]}>
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.1} />
        </Cylinder>

        {/* Israeli Flag Bands */}
        <group position={[0, 2, 0]}>
          <Cylinder args={[0.41, 0.41, 0.15, 32]} position={[0, 0.4, 0]}>
            <meshStandardMaterial color="#1d4ed8" />
          </Cylinder>
          <Cylinder args={[0.41, 0.41, 0.4, 32]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#ffffff" />
          </Cylinder>
          <Cylinder args={[0.41, 0.41, 0.15, 32]} position={[0, -0.4, 0]}>
            <meshStandardMaterial color="#1d4ed8" />
          </Cylinder>
          {/* Star of David (Simplified as a blue hex) */}
          <Cylinder args={[0.1, 0.1, 0.42, 6]} position={[0.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <meshStandardMaterial color="#1d4ed8" />
          </Cylinder>
        </group>

        <Cone args={[0.4, 2, 32]} position={[0, 4.5, 0]}>
          <meshStandardMaterial color="#94a3b8" metalness={0.9} />
        </Cone>

        {/* Fins */}
        {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((r, i) => (
          <Box key={i} args={[0.05, 1.2, 0.8]} position={[0.4, -2.5, 0]} rotation={[0, r, 0]}>
            <meshStandardMaterial color="#64748b" />
          </Box>
        ))}

        {/* Thruster */}
        <group position={[0, -4, 0]}>
          <Cone args={[0.3, 3, 16]} rotation={[Math.PI, 0, 0]}>
            <meshBasicMaterial color="#fbbf24" transparent opacity={0.9} />
          </Cone>
          <SmokeTrail position={[0, -1, 0]} color="#f1f5f9" count={40} />
        </group>

        {/* Labels */}
        <Html position={[-1.5, 4.5, 0]} distanceFactor={15}>
          <div className="bg-black/80 backdrop-blur-md p-3 rounded-xl border border-blue-500/30 text-white w-48 shadow-2xl text-right">
            <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Defense Tech</div>
            <div className="text-xs font-display font-bold mb-1">Hypersonic Interceptor</div>
            <div className="text-[9px] text-zinc-400 leading-tight">Exo-atmospheric kill vehicle designed for ballistic defense.</div>
          </div>
        </Html>

        <Html position={[-1.5, -2.5, 0]} distanceFactor={15}>
          <div className="bg-black/80 backdrop-blur-md p-3 rounded-xl border border-zinc-500/30 text-white w-48 shadow-2xl text-right">
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Propulsion</div>
            <div className="text-xs font-display font-bold mb-1">Solid Rocket Motor</div>
            <div className="text-[9px] text-zinc-400 leading-tight">High-impulse solid propellant for rapid acceleration.</div>
          </div>
        </Html>
      </group>

      {/* Center Label */}
      <Html position={[0, 0, 5]} center>
        <div className="bg-red-500/10 backdrop-blur-md px-6 py-2 rounded-full border border-red-500/40 text-red-400 text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse">
          Ballistic Engagement Simulation
        </div>
      </Html>
    </group>
  );
}

