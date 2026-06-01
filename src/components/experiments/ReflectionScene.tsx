import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Sphere, Text, Float, Html, Line } from '@react-three/drei';
import { useLabStore } from '../../store/useLabStore';
import * as THREE from 'three';

export function ReflectionScene() {
  const { addReading } = useLabStore();
  const [angle, setAngle] = useState(45);
  const [showNormal, setShowNormal] = useState(true);
  const [showProtractor, setShowProtractor] = useState(true);
  const [laserOn, setLaserOn] = useState(true);

  const angleRad = (angle * Math.PI) / 180;
  const r = 7; // Ray length

  // Coordinates of Laser Emitter source
  const laserX = -r * Math.sin(angleRad);
  const laserY = r * Math.cos(angleRad);

  // Coordinates of Reflected Ray end
  const reflectedX = r * Math.sin(angleRad);
  const reflectedY = r * Math.cos(angleRad);

  const handleRecord = () => {
    addReading({
      x: angle,
      y: angle, // i = r
      timestamp: Date.now()
    });
  };

  return (
    <group position={[0, 0, 0]}>
      {/* Heavy Steel Base Plate */}
      <Box args={[16, 0.2, 10]} position={[0, -0.1, 0]} receiveShadow>
        <meshPhysicalMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
      </Box>

      {/* Plane Mirror Apparatus */}
      <group position={[0, 0, 0]}>
        {/* Mirror holder base */}
        <Box args={[8, 0.4, 1.2]} position={[0, 0.2, -0.8]} castShadow>
          <meshPhysicalMaterial color="#334155" metalness={0.6} roughness={0.4} />
        </Box>
        {/* Silvered Reflective Mirror Surface */}
        <Box args={[7.8, 2.5, 0.15]} position={[0, 1.45, -0.3]} castShadow>
          <meshPhysicalMaterial 
            transmission={0.95} 
            opacity={0.85} 
            transparent 
            roughness={0.01} 
            metalness={0.98} 
            color="#e2e8f0" 
            envMapIntensity={2.5}
          />
        </Box>
        {/* Mirror Title text */}
        <Text position={[0, 2.9, -0.35]} fontSize={0.2} color="#cbd5e1" anchorX="center">
          SILVERED PLANE MIRROR
        </Text>
      </group>

      {/* High-Tech Ray Box / Emitter on Radial Track */}
      <group position={[laserX, laserY, 0]} rotation={[0, 0, -angleRad]}>
        {/* Ray Box Body */}
        <Box args={[1.6, 0.6, 0.6]} castShadow>
          <meshPhysicalMaterial color="#1e293b" metalness={0.7} roughness={0.2} />
        </Box>
        {/* Laser Aperture */}
        <Cylinder args={[0.2, 0.2, 0.3]} position={[0.8, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <meshBasicMaterial color="#38bdf8" />
        </Cylinder>
        {/* Ambient point light at laser nozzle */}
        {laserOn && <pointLight color="#38bdf8" intensity={2} distance={3} />}
      </group>

      {/* Laser Light Rays */}
      {laserOn && (
        <>
          {/* Incident Ray (Cyan Laser Line) */}
          <Line 
            points={[[laserX, laserY, 0], [0, 0, 0]]} 
            color="#38bdf8" 
            lineWidth={3.5} 
          />
          {/* Reflected Ray (Rose/Red Laser Line) */}
          <Line 
            points={[[0, 0, 0], [reflectedX, reflectedY, 0]]} 
            color="#f43f5e" 
            lineWidth={3.5} 
          />
          {/* Glowing point at point of incidence */}
          <Sphere args={[0.1]} position={[0, 0, 0]}>
            <meshBasicMaterial color="#ef4444" />
          </Sphere>
        </>
      )}

      {/* Normal Perpendicular Line */}
      {showNormal && (
        <>
          <Line 
            points={[[0, 0, 0], [0, 6.5, 0]]} 
            color="#94a3b8" 
            lineWidth={1.5} 
            dashed 
            dashSize={0.2} 
            gapSize={0.15} 
          />
          <Text position={[0.3, 6, 0]} fontSize={0.25} color="#94a3b8">
            Normal (N)
          </Text>
        </>
      )}

      {/* 3D Protractor Angle Grid Scale */}
      {showProtractor && (
        <group position={[0, 0.05, 0]} rotation={[0, 0, 0]}>
          {/* Semicircle ticks */}
          {Array.from({ length: 19 }).map((_, idx) => {
            const deg = idx * 10 - 90; // -90 to +90
            const rad = (deg * Math.PI) / 180;
            const isMain = deg % 30 === 0;
            return (
              <group key={idx}>
                <Line 
                  points={[[4.2 * Math.sin(rad), 4.2 * Math.cos(rad), 0], [4.5 * Math.sin(rad), 4.5 * Math.cos(rad), 0]]} 
                  color={deg === 0 ? "#ef4444" : "#475569"} 
                  lineWidth={deg === 0 ? 3 : 1.5} 
                />
                {isMain && (
                  <Text position={[3.7 * Math.sin(rad), 3.7 * Math.cos(rad), 0]} fontSize={0.22} color="#64748b" anchorX="center" anchorY="middle">
                    {Math.abs(deg)}°
                  </Text>
                )}
              </group>
            );
          })}
          {/* Semicircle boundary arc */}
          <Line 
            points={Array.from({ length: 37 }).map((_, idx) => {
              const rad = ((idx * 5 - 90) * Math.PI) / 180;
              return [4.5 * Math.sin(rad), 4.5 * Math.cos(rad), 0];
            })} 
            color="#475569" 
            lineWidth={1.5} 
          />
        </group>
      )}

      {/* Animated Light Photons Flow */}
      <PhotonParticles angle={angle} active={laserOn} />

      {/* Interactive Floating Instrumentation Panel (HTML) */}
      <group position={[4.5, 3.5, 1]} rotation={[0, -Math.PI / 6, 0]}>
        <Html transform occlude>
          <div className="bg-black/90 p-5 rounded-3xl border border-white/10 w-72 flex flex-col gap-4 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-md pointer-events-auto text-white select-none">
            <div className="border-b border-white/10 pb-2 flex justify-between items-center">
              <h3 className="font-black text-xs uppercase tracking-[0.2em] text-indigo-400">Reflection Telemetry</h3>
              <div className="flex gap-1.5 items-center">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-[8px] text-zinc-500 font-mono uppercase">ONLINE</span>
              </div>
            </div>

            {/* Slider Control */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] text-zinc-400">
                <span>INCIDENT ANGLE (∠i)</span>
                <span className="font-mono text-indigo-400 font-bold text-sm">{angle}°</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="80" 
                step="1" 
                value={angle} 
                onChange={(e) => setAngle(parseInt(e.target.value))} 
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
              />
            </div>

            {/* Angular Readings display */}
            <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-3 rounded-2xl border border-white/5 text-center">
              <div className="flex flex-col">
                <span className="text-[8px] text-zinc-500 uppercase tracking-wider font-semibold">Incident Angle</span>
                <span className="font-mono text-base font-bold text-sky-400">∠i = {angle}°</span>
              </div>
              <div className="flex flex-col border-l border-white/10">
                <span className="text-[8px] text-zinc-500 uppercase tracking-wider font-semibold">Reflected Angle</span>
                <span className="font-mono text-base font-bold text-rose-400">∠r = {angle}°</span>
              </div>
            </div>

            {/* Options Checkboxes */}
            <div className="space-y-2 text-[10px] text-zinc-400 font-medium">
              <label className="flex items-center justify-between cursor-pointer">
                <span>Laser Power Status</span>
                <input 
                  type="checkbox" 
                  checked={laserOn} 
                  onChange={() => setLaserOn(!laserOn)} 
                  className="sr-only peer" 
                />
                <div className="relative w-8 h-4 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-zinc-400 after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:bg-white" />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span>Normal Reference Vector</span>
                <input 
                  type="checkbox" 
                  checked={showNormal} 
                  onChange={() => setShowNormal(!showNormal)} 
                  className="sr-only peer" 
                />
                <div className="relative w-8 h-4 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-zinc-400 after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:bg-white" />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span>Protractor Layout Grid</span>
                <input 
                  type="checkbox" 
                  checked={showProtractor} 
                  onChange={() => setShowProtractor(!showProtractor)} 
                  className="sr-only peer" 
                />
                <div className="relative w-8 h-4 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-zinc-400 after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:bg-white" />
              </label>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-1">
              <button 
                onClick={handleRecord}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.97] text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20"
              >
                Record Reading
              </button>
            </div>

            <div className="text-[9px] text-zinc-500 font-mono text-center">
              Law Status: <span className="text-emerald-400 font-bold">VERIFIED (i = r)</span>
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
}

function PhotonParticles({ angle, active }: { angle: number, active: boolean }) {
  const particles = useMemo(() => Array.from({ length: 16 }, () => Math.random()), []);
  const ref = useRef<THREE.Group>(null);
  const angleRad = (angle * Math.PI) / 180;
  const r = 7; // Ray length

  useFrame(({ clock }) => {
    if (!ref.current || !active) return;
    const elapsed = clock.getElapsedTime();
    ref.current.children.forEach((child, i) => {
      // Photon travels: Incident path [0 to 0.5] then Reflected path [0.5 to 1.0]
      const t = (elapsed * 0.8 + particles[i]) % 1.0;
      if (t < 0.5) {
        const pct = t / 0.5;
        const startX = -r * Math.sin(angleRad);
        const startY = r * Math.cos(angleRad);
        const px = startX * (1 - pct);
        const py = startY * (1 - pct);
        child.position.set(px, py, 0);
      } else {
        const pct = (t - 0.5) / 0.5;
        const endX = r * Math.sin(angleRad);
        const endY = r * Math.cos(angleRad);
        const px = endX * pct;
        const py = endY * pct;
        child.position.set(px, py, 0);
      }
    });
  });

  return (
    <group ref={ref}>
      {active && particles.map((_, i) => (
        <Sphere key={i} args={[0.045, 8, 8]}>
          <meshBasicMaterial color={i < 8 ? "#67e8f9" : "#fda4af"} transparent opacity={0.7} />
        </Sphere>
      ))}
    </group>
  );
}
