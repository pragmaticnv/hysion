import { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sphere, Text, Html, Points, PointMaterial, Cylinder, Torus, Sparkles } from '@react-three/drei';;
import * as THREE from 'three';
import { Line, Trail } from '../components/SafeLine';

export function QuantumPhysicsModel({ showLabels, ...props }: { showLabels?: boolean }) {
  const [mode, setMode] = useState<'Probability' | 'Wave' | 'Particle'>('Probability');
  const [localization, setLocalization] = useState(0.5); // 0 = wide wave, 1 = narrow particle
  const [momentum, setMomentum] = useState(5); // k value
  
  const groupRef = useRef<THREE.Group>(null);
  const cloudRef = useRef<THREE.Points>(null);
  const baseRef = useRef<THREE.Group>(null);
  const particleGroupRef = useRef<THREE.Group>(null);
  const [flicker, setFlicker] = useState(1);
  const { viewport } = useThree();

  // 1D Wave Function Refs
  const lineCount = 400;
  const xRange = 12; // from -6 to 6
  const realGeoRef = useRef<THREE.BufferGeometry>(null);
  const imagGeoRef = useRef<THREE.BufferGeometry>(null);
  const envGeoRef = useRef<THREE.BufferGeometry>(null);
  const probGeoRef = useRef<THREE.BufferGeometry>(null);

  const linePoints = useMemo(() => new Float32Array(lineCount * 3), [lineCount]);

  // 3D Probability Cloud Points
  const particleCount = 15000;
  const cloudPositions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      // Box-Muller transform for normal distribution
      const u1 = Math.max(Math.random(), 0.000001);
      const u2 = Math.random();
      const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
      const u3 = Math.max(Math.random(), 0.000001);
      const u4 = Math.random();
      const z2 = Math.sqrt(-2.0 * Math.log(u3)) * Math.cos(2.0 * Math.PI * u4);
      
      pos[i * 3] = z0;
      pos[i * 3 + 1] = z1;
      pos[i * 3 + 2] = z2;
    }
    return pos;
  }, [particleCount]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const sigma = 2.0 - 1.8 * localization; // Spread of the wave packet
    const k = momentum; // Wave number
    const omega = (k * k) / 2; // Dispersion relation (E = p^2/2m)

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.2; // Subtle sway
    }
    if (baseRef.current) {
      baseRef.current.rotation.y = -t * 0.05;
    }

    // Update 1D wave functions
    if (realGeoRef.current && imagGeoRef.current && envGeoRef.current && probGeoRef.current) {
      const realPos = realGeoRef.current.attributes.position.array as Float32Array;
      const imagPos = imagGeoRef.current.attributes.position.array as Float32Array;
      const envPos = envGeoRef.current.attributes.position.array as Float32Array;
      const probPos = probGeoRef.current.attributes.position.array as Float32Array;

      for (let i = 0; i < lineCount; i++) {
        const x = (i / (lineCount - 1)) * xRange - xRange / 2;
        
        // Gaussian envelope
        const envelope = Math.exp(-(x * x) / (4 * sigma * sigma));
        // Probability density |psi|^2
        const prob = Math.exp(-(x * x) / (2 * sigma * sigma));
        
        const phase = k * x - omega * t;
        
        const real = envelope * Math.cos(phase);
        const imag = envelope * Math.sin(phase);

        const idx = i * 3;
        
        realPos[idx] = x; realPos[idx + 1] = real * 2; realPos[idx + 2] = 0;
        imagPos[idx] = x; imagPos[idx + 1] = imag * 2; imagPos[idx + 2] = 0;
        envPos[idx] = x; envPos[idx + 1] = envelope * 2; envPos[idx + 2] = 0;
        probPos[idx] = x; probPos[idx + 1] = prob * 2; probPos[idx + 2] = 0;
      }

      realGeoRef.current.attributes.position.needsUpdate = true;
      imagGeoRef.current.attributes.position.needsUpdate = true;
      envGeoRef.current.attributes.position.needsUpdate = true;
      probGeoRef.current.attributes.position.needsUpdate = true;
    }

    // Update 3D probability cloud
    if (cloudRef.current) {
      cloudRef.current.scale.setScalar(sigma * 1.5);
      cloudRef.current.rotation.y = t * 0.2;
      cloudRef.current.rotation.z = t * 0.1;
    }

    // Update Particle Mode
    if (particleGroupRef.current && mode === 'Particle') {
      const x = Math.sin(t * momentum * 0.5) * 4;
      particleGroupRef.current.position.x = x;
      const jitter = sigma * 0.3;
      particleGroupRef.current.position.y = (Math.random() - 0.5) * jitter;
      particleGroupRef.current.position.z = (Math.random() - 0.5) * jitter;
    }

    // Hologram flicker
    if (Math.random() > 0.95) {
      setFlicker(Math.random() * 0.3 + 0.7);
    } else {
      setFlicker(prev => prev + (1 - prev) * 0.1);
    }
  });

  return (
    <group {...props}>
      {/* Advanced Hologram Base */}
      <group position={[0, -6, 0]} ref={baseRef}>
        <Cylinder args={[6, 6.5, 0.6, 64]}>
          <meshStandardMaterial color="#050505" metalness={1} roughness={0.2} />
        </Cylinder>
        
        <Cylinder args={[5.8, 5.8, 0.1, 64]} position={[0, 0.35, 0]}>
          <meshBasicMaterial color="#00ffff" transparent opacity={0.3 * flicker} blending={THREE.AdditiveBlending} />
        </Cylinder>
        <Cylinder args={[5.4, 5.4, 0.1, 64]} position={[0, 0.35, 0]}>
          <meshBasicMaterial color="#ff00ff" transparent opacity={0.15 * flicker} blending={THREE.AdditiveBlending} />
        </Cylinder>
        
        <Torus args={[5.5, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.4, 0]}>
          <meshBasicMaterial color="#00ffff" transparent opacity={0.5 * flicker} />
        </Torus>

        <gridHelper args={[11.6, 20, 0x00ffff, 0x00ffff]} position={[0, 0.41, 0]} material-opacity={0.1} material-transparent />

        {[...Array(16)].map((_, i) => (
          <group key={i} rotation={[0, (i / 16) * Math.PI * 2, 0]}>
            <Cylinder args={[0.01, 0.05, 12, 8]} position={[5, 6, 0]} rotation={[0, 0, 0.05]}>
              <meshBasicMaterial color="#00ffff" transparent opacity={0.08 * flicker} blending={THREE.AdditiveBlending} />
            </Cylinder>
          </group>
        ))}
      </group>

      {/* Mode Selector UI */}
      {showLabels && (
        <Html position={[0, 5, 0]} center zIndexRange={[100, 0]}>
          <div className="flex flex-col gap-1.5 bg-black/80 backdrop-blur-md p-2.5 rounded-xl border border-cyan-500/30 w-[90vw] max-w-[250px] pointer-events-auto shadow-[0_0_30px_rgba(0,255,255,0.15)]">
            <div className="text-[8px] font-bold text-cyan-400 uppercase tracking-widest border-b border-cyan-500/30 pb-1 mb-0.5 flex items-center justify-between">
              <span>Quantum State Control</span>
              <span className="text-fuchsia-400 animate-pulse">LIVE SIMULATION</span>
            </div>
            
            <div className="flex justify-between gap-1">
              {['Probability', 'Wave', 'Particle'].map((m) => (
                <button
                  key={m}
                  onClick={(e) => { e.stopPropagation(); setMode(m as any); }}
                  className={`flex-1 py-1 rounded-md text-[8px] uppercase font-bold transition-all cursor-pointer ${
                    mode === m 
                      ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(0,255,255,0.6)]' 
                      : 'text-cyan-500/70 hover:text-cyan-300 hover:bg-cyan-500/10 border border-cyan-500/20'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            
            <div className="space-y-0.5 mt-1">
              <div className="flex justify-between text-[8px] font-bold text-cyan-300 uppercase tracking-wider">
                <span>Localization (Δx)</span>
                <span>{((localization) * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.01" value={localization} 
                onChange={(e) => { e.stopPropagation(); setLocalization(parseFloat(e.target?.value || '0.5')); }}
                className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[6px] text-zinc-500 uppercase">
                <span>Delocalized (Wave)</span>
                <span>Localized (Particle)</span>
              </div>
            </div>

            <div className="space-y-0.5 mt-1">
              <div className="flex justify-between text-[8px] font-bold text-fuchsia-300 uppercase tracking-wider">
                <span>Momentum (p = ℏk)</span>
                <span>{momentum.toFixed(1)}</span>
              </div>
              <input 
                type="range" min="0" max="10" step="0.1" value={momentum} 
                onChange={(e) => { e.stopPropagation(); setMomentum(parseFloat(e.target?.value || '5')); }}
                className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-fuchsia-500"
              />
            </div>
          </div>
        </Html>
      )}

      <group ref={groupRef} scale={1.2}>
        {/* 1D Wave Function Projection */}
        <group position={[0, 3.5, 0]}>
          <line>
            <bufferGeometry ref={realGeoRef}>
              <bufferAttribute attach="attributes-position" count={lineCount} array={linePoints} itemSize={3} />
            </bufferGeometry>
            <lineBasicMaterial color="#00ffff" linewidth={2} transparent opacity={mode === 'Wave' ? 0.9 : 0.15} />
          </line>
          <line>
            <bufferGeometry ref={imagGeoRef}>
              <bufferAttribute attach="attributes-position" count={lineCount} array={linePoints} itemSize={3} />
            </bufferGeometry>
            <lineBasicMaterial color="#ff00ff" linewidth={2} transparent opacity={mode === 'Wave' ? 0.9 : 0.1} />
          </line>
          <line>
            <bufferGeometry ref={envGeoRef}>
              <bufferAttribute attach="attributes-position" count={lineCount} array={linePoints} itemSize={3} />
            </bufferGeometry>
            <lineBasicMaterial color="#ffffff" linewidth={1} transparent opacity={mode === 'Wave' ? 0.4 : 0.05} />
          </line>
          <line>
            <bufferGeometry ref={probGeoRef}>
              <bufferAttribute attach="attributes-position" count={lineCount} array={linePoints} itemSize={3} />
            </bufferGeometry>
            <lineBasicMaterial color="#ffff00" linewidth={2} transparent opacity={mode === 'Probability' ? 0.9 : 0.15} />
          </line>

          {showLabels && (
            <>
              <Html position={[-6, 2.5, 0]} center className="pointer-events-none">
                <div className="flex items-center gap-2 text-[10px] font-mono whitespace-nowrap bg-black/50 px-2 py-1 rounded border border-cyan-500/20">
                  <div className="w-3 h-0.5 bg-cyan-500 shadow-[0_0_5px_#00ffff]"></div>
                  <span className="text-cyan-400">Real Part Re(ψ)</span>
                </div>
              </Html>
              <Html position={[-6, 1.8, 0]} center className="pointer-events-none">
                <div className="flex items-center gap-2 text-[10px] font-mono whitespace-nowrap bg-black/50 px-2 py-1 rounded border border-fuchsia-500/20">
                  <div className="w-3 h-0.5 bg-fuchsia-500 shadow-[0_0_5px_#ff00ff]"></div>
                  <span className="text-fuchsia-400">Imaginary Part Im(ψ)</span>
                </div>
              </Html>
              <Html position={[-6, 1.1, 0]} center className="pointer-events-none">
                <div className="flex items-center gap-2 text-[10px] font-mono whitespace-nowrap bg-black/50 px-2 py-1 rounded border border-yellow-400/20">
                  <div className="w-3 h-0.5 bg-yellow-400 shadow-[0_0_5px_#ffff00]"></div>
                  <span className="text-yellow-400">Probability Density |ψ|²</span>
                </div>
              </Html>
              <Html position={[6, 2.5, 0]} center className="pointer-events-none">
                <div className="px-3 py-2 bg-black/80 border border-white/20 rounded-lg text-[10px] text-white font-mono whitespace-nowrap shadow-lg">
                  <div className="text-zinc-400 mb-1 text-[8px] uppercase">Wave Packet Equation</div>
                  ψ(x,t) = A e<sup className="text-[8px]">-x²/4σ²</sup> e<sup className="text-[8px]">i(kx-ωt)</sup>
                </div>
              </Html>
            </>
          )}
        </group>

        {/* 3D Probability Cloud */}
        {mode !== 'Particle' && (
          <points ref={cloudRef} position={[0, -1, 0]}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={particleCount}
                array={cloudPositions}
                itemSize={3}
              />
            </bufferGeometry>
            <PointMaterial
              transparent
              color="#00ffff"
              size={0.06}
              sizeAttenuation={true}
              depthWrite={false}
              opacity={(mode === 'Probability' ? 0.4 : 0.1) * flicker}
              blending={THREE.AdditiveBlending}
            />
          </points>
        )}

        {/* Particle Mode */}
        {mode === 'Particle' && (
          <group ref={particleGroupRef} position={[0, -1, 0]}>
            <Sphere args={[0.15, 32, 32]}>
              <meshStandardMaterial color="#ffffff" emissive="#00ffff" emissiveIntensity={2} />
            </Sphere>
            <pointLight color="#00ffff" intensity={10} distance={10} decay={2} />
            <Trail
              width={0.8}
              length={15}
              color={new THREE.Color('#00ffff')}
              attenuation={(t) => t * t}
            >
              <Sphere args={[0.05, 16, 16]} visible={false} />
            </Trail>
          </group>
        )}

        <Sparkles count={150} scale={12} size={2} speed={0.5} opacity={0.2} color="#00ffff" position={[0, -1, 0]} />

        {/* 3D Labels */}
        {showLabels && (
          <>
            <Html position={[4, -1, 0]} center className="pointer-events-none">
              <div className="px-4 py-3 bg-black/80 backdrop-blur-md border border-cyan-500/40 rounded-xl text-[10px] text-cyan-200 font-mono tracking-wider uppercase whitespace-nowrap shadow-[0_0_20px_rgba(0,255,255,0.1)]">
                <div className="text-cyan-400 font-bold mb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping"></div>
                  Heisenberg Uncertainty
                </div>
                <div className="text-white text-lg mb-2">Δx · Δp ≥ ℏ/2</div>
                <div className="grid grid-cols-2 gap-4 text-xs mt-2 border-t border-cyan-500/30 pt-2">
                  <div>
                    <span className="text-zinc-500 text-[8px] block">Position Spread (Δx)</span>
                    <span className="text-cyan-300">{(2.0 - 1.8 * localization).toFixed(3)} nm</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[8px] block">Momentum Spread (Δp)</span>
                    <span className="text-fuchsia-300">{(1 / (2.0 - 1.8 * localization)).toFixed(3)} eV/c</span>
                  </div>
                </div>
              </div>
            </Html>
            
            {mode === 'Probability' && (
              <Html position={[-4, -1, 0]} center className="pointer-events-none">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-2 bg-black/80 border border-cyan-500/40 rounded-lg text-[10px] text-cyan-300 font-mono whitespace-nowrap shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                    <div className="font-bold text-white mb-1">Electron Cloud</div>
                    <div className="text-[8px] text-zinc-400">Superposition of all possible states</div>
                    <div className="text-[8px] text-zinc-400 mt-1">Density ∝ |ψ|²</div>
                  </div>
                  <div className="w-12 h-px bg-gradient-to-r from-cyan-500 to-transparent"></div>
                </div>
              </Html>
            )}

            {mode === 'Particle' && (
              <Html position={[-4, -1, 0]} center className="pointer-events-none">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-2 bg-black/80 border border-white/50 rounded-lg text-[10px] text-white font-mono whitespace-nowrap shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    <div className="font-bold mb-1">Wavefunction Collapsed</div>
                    <div className="text-[8px] text-zinc-400">Particle localized due to measurement</div>
                    <div className="text-[8px] text-cyan-400 mt-1">High momentum uncertainty</div>
                  </div>
                  <div className="w-12 h-px bg-gradient-to-r from-white to-transparent"></div>
                </div>
              </Html>
            )}
          </>
        )}


      </group>
    </group>
  );
}
