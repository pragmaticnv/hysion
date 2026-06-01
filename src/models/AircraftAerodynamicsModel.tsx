import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Float, Html, Text, Sphere, Cylinder } from '@react-three/drei';;
import * as THREE from 'three';
import { Line, Trail } from '../components/SafeLine';

export function AircraftAerodynamicsModel({ showLabels = false }: { showLabels?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const aircraftRef = useRef<THREE.Group>(null);
  
  // Aerodynamic Parameters
  const [mach, setMach] = useState(1.2);
  const [aoa, setAoa] = useState(8); // Angle of Attack in degrees
  const [altitude, setAltitude] = useState(45000); // Altitude in feet
  const [vsi, setVsi] = useState(0); // Vertical Speed Indicator in ft/min
  const [viewMode, setViewMode] = useState<'pressure' | 'velocity' | 'temperature' | 'standard'>('pressure');

  // Advanced Flow lines (particles)
  const particlesCount = 3000;
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particleData = useMemo(() => {
    const data = [];
    for (let i = 0; i < particlesCount; i++) {
      data.push({
        x: (Math.random() - 0.5) * 40,
        y: (Math.random() - 0.5) * 20,
        z: (Math.random() - 0.5) * 60 - 30,
        speed: 0.5 + Math.random() * 0.8,
        originalY: 0,
        originalX: 0,
        phase: Math.random() * Math.PI * 2,
      });
      data[i].originalY = data[i].y;
      data[i].originalX = data[i].x;
    }
    return data;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(t * 0.5) * 0.02;
      groupRef.current.rotation.x = THREE.MathUtils.degToRad(-aoa) + Math.sin(t * 0.3) * 0.01;
    }

    const calculatedVsi = mach * Math.sin(THREE.MathUtils.degToRad(aoa)) * 15000;
    setVsi(calculatedVsi);
    setAltitude(prev => Math.max(0, prev + (calculatedVsi / 60) * delta));

    if (particlesRef.current) {
      const aoaRad = THREE.MathUtils.degToRad(aoa);
      particleData.forEach((data, i) => {
        const currentSpeed = data.speed * (1 + mach * 0.8);
        data.z += currentSpeed;
        
        if (data.z > 30) {
          data.z = -40;
          data.x = data.originalX;
          data.y = data.originalY;
        }

        let yOffset = 0;
        let xOffset = 0;
        let scaleZ = currentSpeed * 15;
        let colorIntensity = 0.5;
        
        // Hyper-realistic CFD-like flow avoidance
        const localY = data.y - data.z * Math.tan(aoaRad);
        const distToCenter = Math.sqrt(data.x * data.x + localY * localY);
        
        if (data.z > -15 && data.z < 15) {
          if (distToCenter < 8) {
            // Bow shock wave effect
            if (mach > 1.0 && data.z < -10 && distToCenter > 2) {
               const shockAngle = Math.asin(1 / mach);
               const shockRadius = Math.tan(shockAngle) * (data.z + 15);
               if (Math.abs(distToCenter - shockRadius) < 1.0) {
                 colorIntensity = 1.0; // Bright shockwave
               }
            }

            // Flow over wings
            const liftInfluence = aoa * 0.05;
            if (localY > 0) {
              yOffset = Math.sin((data.z + 15) * 0.1) * 2 + liftInfluence;
              scaleZ *= 1.5; // Faster over top
              colorIntensity = 0.2; // Low pressure/temp
            } else {
              yOffset = -Math.sin((data.z + 15) * 0.1) * 1;
              scaleZ *= 0.8; // Slower under bottom
              colorIntensity = 0.9; // High pressure/temp
            }
            xOffset = data.x > 0 ? 1.5 : -1.5;
          }
        }

        // Wingtip vortices
        if (data.z > 5 && Math.abs(data.x) > 5 && Math.abs(data.x) < 8 && Math.abs(localY) < 2) {
           const vortexSpeed = 5 * aoa * 0.1;
           xOffset += Math.cos(data.z * 0.5 + data.phase) * vortexSpeed;
           yOffset += Math.sin(data.z * 0.5 + data.phase) * vortexSpeed;
           colorIntensity = 0.8;
        }

        dummy.position.set(data.x + xOffset, data.y + yOffset, data.z);
        dummy.scale.set(0.02, 0.02, scaleZ);
        
        // Encode color intensity into rotation for the shader to pick up
        dummy.rotation.x = colorIntensity; 
        
        dummy.updateMatrix();
        particlesRef.current!.setMatrixAt(i, dummy.matrix);
      });
      particlesRef.current.instanceMatrix.needsUpdate = true;
    }

    if (hullShaderRef.current && hullShaderRef.current.uniforms && hullShaderRef.current.uniforms.uTime) {
      hullShaderRef.current.uniforms.uTime.value = t;
      if(hullShaderRef.current.uniforms.uMach) hullShaderRef.current.uniforms.uMach.value = mach;
      if(hullShaderRef.current.uniforms.uAoa) hullShaderRef.current.uniforms.uAoa.value = aoa;
      if(hullShaderRef.current.uniforms.uMode) hullShaderRef.current.uniforms.uMode.value = viewMode === 'pressure' ? 0 : viewMode === 'velocity' ? 1 : viewMode === 'temperature' ? 2 : 3;
    }
  });

  const hullShaderRef = useRef<any>(null);
  const advancedShader = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uMach: { value: 1.2 },
      uAoa: { value: 8.0 },
      uMode: { value: 0 }, 
      uBaseColor: { value: new THREE.Color("#1a1a1a") }
    },
    vertexShader: `
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec2 vUv;
      void main() {
        vPosition = position;
        vNormal = normalize(normalMatrix * normal);
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uMach;
      uniform float uAoa;
      uniform int uMode;
      uniform vec3 uBaseColor;
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec2 vUv;

      // Simplex noise function
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        if (uMode == 3) {
          // Standard highly reflective stealth material
          float fresnel = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 3.0);
          vec3 color = uBaseColor + vec3(0.2, 0.3, 0.4) * fresnel;
          gl_FragColor = vec4(color, 1.0);
          return;
        }

        // Advanced Aerodynamic mapping
        float stagnation = smoothstep(5.0, 10.0, vPosition.z); 
        float leadingEdge = smoothstep(0.0, 1.5, abs(vPosition.x)) * smoothstep(2.0, -2.0, vPosition.z);
        float suction = clamp(vPosition.y * uAoa * 0.08, -1.0, 1.0);
        
        float shock = 0.0;
        if (uMach > 1.0) {
          float shockAngle = asin(1.0 / uMach);
          float distToShock = abs(vPosition.z - (abs(vPosition.x) / tan(shockAngle)));
          shock = smoothstep(1.0, 0.0, distToShock) * (uMach - 1.0) * 0.5;
        }

        float turbulence = snoise(vUv * 20.0 + uTime * 5.0) * 0.1 * (uAoa / 10.0);

        float value = stagnation + leadingEdge * 0.6 - suction + shock + turbulence;
        value = clamp(value, -1.0, 1.0);

        vec3 color;
        if (uMode == 0) { // Pressure
          color = mix(mix(vec3(0.0, 0.2, 0.8), vec3(0.2, 0.8, 0.2), value + 1.0), vec3(1.0, 0.1, 0.0), smoothstep(0.0, 1.0, value));
        } else if (uMode == 1) { // Velocity
          color = mix(vec3(0.1, 0.0, 0.3), vec3(0.0, 1.0, 1.0), 1.0 - abs(value));
        } else { // Temperature
          float temp = stagnation * 1.5 + shock * 2.0 + (uMach * uMach * 0.1);
          color = mix(vec3(0.0, 0.0, 0.5), vec3(1.0, 0.9, 0.5), clamp(temp, 0.0, 1.0));
          if (temp > 0.8) color = mix(color, vec3(1.0, 1.0, 1.0), (temp - 0.8) * 5.0); // White hot
        }

        float diff = max(dot(vNormal, vec3(0.5, 0.7, 1.0)), 0.2);
        float spec = pow(max(dot(reflect(-vec3(0.5, 0.7, 1.0), vNormal), vec3(0.0, 0.0, 1.0)), 0.0), 32.0);
        
        gl_FragColor = vec4(color * diff + vec3(1.0) * spec * 0.5, 1.0);
      }
    `
  }), []);

  const hullMaterial = useMemo(() => {
    if (viewMode === 'standard') {
      return new THREE.MeshPhysicalMaterial({ 
        color: "#111111",
        roughness: 0.2, 
        metalness: 0.8,
        clearcoat: 0.5,
        clearcoatRoughness: 0.1
      });
    }
    return new THREE.ShaderMaterial({
      ...advancedShader,
      side: THREE.DoubleSide
    });
  }, [viewMode, advancedShader]);

  useFrame(() => {
    if (aircraftRef.current) {
      aircraftRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.ShaderMaterial) {
          hullShaderRef.current = child.material;
        }
      });
    }
  });

  // Particle Material with custom shader to read intensity from rotation.x
  const particleMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 }
    },
    vertexShader: `
      attribute vec3 instanceColor;
      varying float vIntensity;
      void main() {
        // Actually, let's just use the position to determine color to avoid matrix math complexity here
        vec4 worldPosition = instanceMatrix * vec4(position, 1.0);
        vIntensity = clamp((worldPosition.y + 5.0) / 10.0, 0.0, 1.0);
        gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying float vIntensity;
      void main() {
        vec3 color = mix(vec3(0.0, 0.5, 1.0), vec3(1.0, 0.2, 0.0), vIntensity);
        gl_FragColor = vec4(color, 0.6);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  }), []);

  // Complex Geometry Shapes
  const hyperWingShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0); 
    shape.lineTo(6, -3); 
    shape.lineTo(7, -5); 
    shape.lineTo(7, -6); 
    shape.lineTo(2, -7); 
    shape.lineTo(0, -8); 
    shape.lineTo(0, 0);
    return shape;
  }, []);

  const wingExtrude = { depth: 0.1, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.08, bevelThickness: 0.05 };

  return (
    <group ref={groupRef}>
      {/* Hyper-realistic Sky */}
      <mesh scale={200}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial side={THREE.BackSide}>
          <canvasTexture attach="map" image={createAdvancedSkyTexture()} />
        </meshBasicMaterial>
      </mesh>

      {/* Wind Flow Particles */}
      <instancedMesh ref={particlesRef} args={[new THREE.CylinderGeometry(0.5, 0.5, 1, 8), particleMaterial, particlesCount]}>
      </instancedMesh>

      {/* Physics Vectors & Labels */}
      {showLabels && (
        <group>
          {/* Lift Vector */}
          <group position={[0, 2, 0]}>
            <Line points={[[0, 0, 0], [0, 5 + aoa * 0.2, 0]]} color="#00ff00" lineWidth={5} />
            <Html position={[0, 6 + aoa * 0.2, 0]} center>
              <div className="bg-green-500/20 border border-green-500 text-green-400 px-2 py-1 rounded font-mono text-xs backdrop-blur-sm">LIFT</div>
            </Html>
          </group>
          
          {/* Weight Vector */}
          <group position={[0, -1, 0]}>
            <Line points={[[0, 0, 0], [0, -5, 0]]} color="#ff00ff" lineWidth={5} />
            <Html position={[0, -6, 0]} center>
              <div className="bg-fuchsia-500/20 border border-fuchsia-500 text-fuchsia-400 px-2 py-1 rounded font-mono text-xs backdrop-blur-sm">WEIGHT</div>
            </Html>
          </group>

          {/* Thrust Vector */}
          <group position={[0, 0, -8]}>
            <Line points={[[0, 0, 0], [0, 0, -5 - mach * 2]]} color="#00ffff" lineWidth={5} />
            <Html position={[0, 0, -7 - mach * 2]} center>
              <div className="bg-cyan-500/20 border border-cyan-500 text-cyan-400 px-2 py-1 rounded font-mono text-xs backdrop-blur-sm">THRUST</div>
            </Html>
          </group>

          {/* Drag Vector */}
          <group position={[0, 0, 8]}>
            <Line points={[[0, 0, 0], [0, 0, 4 + mach * 1.5 + aoa * 0.1]]} color="#ff0000" lineWidth={5} />
            <Html position={[0, 0, 5 + mach * 1.5 + aoa * 0.1]} center>
              <div className="bg-red-500/20 border border-red-500 text-red-400 px-2 py-1 rounded font-mono text-xs backdrop-blur-sm">DRAG</div>
            </Html>
          </group>

          {/* Aerodynamic Phenomena Labels */}
          <Html position={[0, 0, 12]} center>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <div className="text-red-400 font-mono text-[10px] bg-black/50 px-2 py-1 rounded border border-red-500/30">Stagnation Point (High P/T)</div>
            </div>
          </Html>
          
          <Html position={[8, 0, -6]} center>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <div className="text-blue-400 font-mono text-[10px] bg-black/50 px-2 py-1 rounded border border-blue-500/30">Wingtip Vortex</div>
            </div>
          </Html>

          {mach > 1.0 && (
            <Html position={[5, 5, -5]} center>
              <div className="text-orange-400 font-mono text-[10px] bg-black/50 px-2 py-1 rounded border border-orange-500/30 border-dashed">
                Mach Cone (Shockwave)
              </div>
            </Html>
          )}
        </group>
      )}

      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <group ref={aircraftRef} rotation={[0, Math.PI, 0]} scale={0.8}>
          
          {/* Hyper-Fuselage */}
          <mesh position={[0, 0, 0]} material={hullMaterial}>
            <capsuleGeometry args={[1.0, 14, 32, 64]} />
          </mesh>
          
          {/* Chined Forebody (Stealth/Hypersonic nose) */}
          <mesh position={[0, 0, -8]} rotation={[Math.PI/2, 0, 0]} material={hullMaterial}>
            <coneGeometry args={[1.0, 6, 4, 1, false, Math.PI/4, Math.PI]} />
          </mesh>

          {/* Cockpit */}
          <mesh position={[0, 0.8, -4]} material={new THREE.MeshPhysicalMaterial({ color: "#000", roughness: 0.1, metalness: 0.9, clearcoat: 1 })}>
            <capsuleGeometry args={[0.5, 3, 16, 32]} />
          </mesh>

          {/* Swept Wings */}
          <mesh position={[0.8, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} material={hullMaterial}>
            <extrudeGeometry args={[hyperWingShape, wingExtrude]} />
          </mesh>
          <mesh position={[-0.8, 0, 0]} rotation={[-Math.PI / 2, Math.PI, 0]} material={hullMaterial}>
            <extrudeGeometry args={[hyperWingShape, wingExtrude]} />
          </mesh>

          {/* V-Tail */}
          <mesh position={[0.5, 0.5, 6]} rotation={[0, 0, -Math.PI/6]} material={hullMaterial}>
            <boxGeometry args={[0.1, 3, 2]} />
          </mesh>
          <mesh position={[-0.5, 0.5, 6]} rotation={[0, 0, Math.PI/6]} material={hullMaterial}>
            <boxGeometry args={[0.1, 3, 2]} />
          </mesh>

          {/* Scramjet Intakes */}
          <mesh position={[0, -1.2, -2]} material={hullMaterial}>
            <boxGeometry args={[1.5, 0.8, 6]} />
          </mesh>
          <mesh position={[0, -1.2, -5]} material={new THREE.MeshBasicMaterial({ color: "#000" })}>
            <boxGeometry args={[1.4, 0.7, 0.1]} />
          </mesh>

          {/* Exhaust */}
          <mesh position={[0, -1.2, 4]} material={new THREE.MeshStandardMaterial({ color: "#ff3300", emissive: "#ff3300", emissiveIntensity: mach > 1 ? 2 : 0.5 })}>
            <boxGeometry args={[1.4, 0.6, 1]} />
          </mesh>
          
          {/* Afterburner Plume */}
          {mach > 1.0 && (
            <mesh position={[0, -1.2, 6]}>
              <cylinderGeometry args={[0.8, 0.2, 4 + mach * 2, 16]} />
              <meshBasicMaterial color="#00ffff" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
            </mesh>
          )}

        </group>
      </Float>

      {/* UI Controls Overlay */}
      {showLabels && (
        <Html position={[0, 0, 0]} className="pointer-events-none w-screen h-screen absolute top-[-50vh] left-[-50vw]">
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-auto p-6 bg-black/80 backdrop-blur-md border border-cyan-500/30 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.1)] flex flex-col gap-6 min-w-[400px]">
            
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex flex-col">
                <span className="text-cyan-400 font-display font-bold text-xl tracking-widest uppercase">Hyper-Aero Sys</span>
                <span className="text-zinc-500 font-mono text-[10px] tracking-[0.3em]">ADVANCED CFD SIMULATION</span>
              </div>
              <div className="flex gap-2">
                {(['pressure', 'velocity', 'temperature', 'standard'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1.5 text-[10px] uppercase font-bold rounded-lg transition-all ${viewMode === mode ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-white/5'}`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <span className="text-xs text-zinc-400 uppercase font-bold tracking-widest">Mach</span>
                  <span className="text-2xl text-cyan-400 font-mono font-light">{mach.toFixed(2)}</span>
                </div>
                <input 
                  type="range" min="0.1" max="5.0" step="0.01" 
                  value={mach} 
                  onChange={(e) => setMach(parseFloat(e.target?.value || '0.1'))}
                  className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <span className="text-xs text-zinc-400 uppercase font-bold tracking-widest">AoA</span>
                  <span className="text-2xl text-orange-400 font-mono font-light">{aoa.toFixed(1)}°</span>
                </div>
                <input 
                  type="range" min="-15" max="45" step="0.5" 
                  value={aoa} 
                  onChange={(e) => setAoa(parseFloat(e.target?.value || '0'))}
                  className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
              <div className="flex flex-col items-center bg-zinc-900/50 rounded-xl p-3 border border-white/5">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Altitude</span>
                <span className="text-emerald-400 font-mono text-lg">{Math.round(altitude).toLocaleString()} <span className="text-[10px]">FT</span></span>
              </div>
              <div className="flex flex-col items-center bg-zinc-900/50 rounded-xl p-3 border border-white/5">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">VSI</span>
                <span className={`${vsi >= 0 ? 'text-emerald-400' : 'text-red-400'} font-mono text-lg`}>{Math.round(vsi).toLocaleString()} <span className="text-[10px]">FPM</span></span>
              </div>
              <div className="flex flex-col items-center bg-zinc-900/50 rounded-xl p-3 border border-white/5">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Dynamic Q</span>
                <span className="text-purple-400 font-mono text-lg">{Math.round(0.5 * 1.225 * Math.pow(mach * 343, 2) / 1000)} <span className="text-[10px]">kPa</span></span>
              </div>
            </div>
          </div>
        </Html>
      )}

      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 20, 10]} intensity={2.5} castShadow />
      <directionalLight position={[-10, -10, -10]} intensity={1.0} color="#aaccff" />
      <Environment preset="city" />
    </group>
  );
}

function createAdvancedSkyTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d')!;
  
  const gradient = ctx.createLinearGradient(0, 0, 0, 2048);
  gradient.addColorStop(0, '#050510'); // Near space
  gradient.addColorStop(0.4, '#1a2b4c'); // Stratosphere
  gradient.addColorStop(1, '#4a7c9c'); // Troposphere
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 2048, 2048);
  
  // Add some high altitude cirrus clouds
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 1000 + 1000; // Lower half
    const w = 100 + Math.random() * 300;
    const h = 5 + Math.random() * 15;
    
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  
  return canvas;
}
