import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import Webcam from 'react-webcam';
import { Aircraft } from './Aircraft';
import { GestureHandler } from './GestureHandler';
import { CFDPlane } from './CFDPlane';
import { WindParticles } from './WindParticles';
import { HUD } from './HUD';
import { BrainCircuit, BookOpen, BarChart, ArrowLeft } from 'lucide-react';
import { NeuralIntelligencePanel } from './NeuralIntelligencePanel';
import { CoursePanel } from './CoursePanel';
import { AerodynamicsPanel } from './AerodynamicsPanel';
import { DEFAULT_THEME } from '../constants/themes';

import { useStore } from '../store/useStore';
import { useHoloAudio } from '../hooks/useHoloAudio';

export function AerodynamicsModule() {
  const { setActiveTopic } = useStore();
  const { init } = useHoloAudio();
  const handleBack = () => setActiveTopic('Atom');
  const [mode, setMode] = useState<'hologram' | 'cfd' | 'ar'>('hologram');
  const [isNeuralOpen, setIsNeuralOpen] = useState(false);

  const toggleNeural = () => {
    if (!isNeuralOpen) init();
    setIsNeuralOpen(!isNeuralOpen);
  };
  const [isCourseOpen, setIsCourseOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [machNumber, setMachNumber] = useState(0.85);
  const [angleOfAttack, setAngleOfAttack] = useState(2.5);
  const [verticalSpeed, setVerticalSpeed] = useState(0);
  const orbitControlsRef = useRef<any>(null);

  useEffect(() => {
    const handleVoiceCommand = (e: any) => {
      const { action, setting, value } = e.detail;
      if (action === 'AERODYNAMICS_CONTROL' && setting) {
        if (setting === 'speed' && value) {
          const m = parseFloat(value);
          if (!isNaN(m)) setMachNumber(Math.max(0.1, Math.min(3, m)));
        } else if (setting === 'angle' && value) {
          const a = parseFloat(value);
          if (!isNaN(a)) setAngleOfAttack(Math.max(-10, Math.min(20, a)));
        }
      }
    };

    window.addEventListener('app-voice-command', handleVoiceCommand);
    return () => window.removeEventListener('app-voice-command', handleVoiceCommand);
  }, []);

  // Simulate VSI
  useEffect(() => {
    const interval = setInterval(() => {
      setVerticalSpeed((prev) => prev + (Math.random() - 0.5) * 50);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsPanelOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full h-full bg-[#050505] overflow-hidden relative font-sans selection:bg-cyan-500/30 rounded-2xl border border-white/10">
      {/* Neural Intelligence & Course Buttons */}
      <div className={`absolute ${isMobile ? 'top-4 left-4' : 'top-6 left-6'} z-20 flex gap-2`}>
        <button onClick={handleBack} className={`${isMobile ? 'p-2' : 'p-3'} bg-white/5 border border-white/10 rounded-xl text-zinc-400 hover:text-white hover:border-white/30 transition-all`}>
          <ArrowLeft size={isMobile ? 18 : 20} />
        </button>
        <button onClick={toggleNeural} className={`${isMobile ? 'p-2' : 'p-3'} bg-white/5 border border-white/10 rounded-xl text-zinc-400 hover:text-indigo-400 hover:border-indigo-500/50 transition-all`}>
          <BrainCircuit size={isMobile ? 18 : 20} />
        </button>
        <button onClick={() => setIsCourseOpen(!isCourseOpen)} className={`${isMobile ? 'p-2' : 'p-3'} bg-white/5 border border-white/10 rounded-xl text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-all`}>
          <BookOpen size={isMobile ? 18 : 20} />
        </button>
        <button onClick={() => setIsPanelOpen(!isPanelOpen)} className={`${isMobile ? 'p-2' : 'p-3'} bg-white/5 border border-white/10 rounded-xl text-zinc-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all`}>
          <BarChart size={isMobile ? 18 : 20} />
        </button>
      </div>

      {/* Panels */}
      {mode === 'ar' && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Webcam 
            audio={false} 
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "environment" }} 
            className="w-full h-full object-cover" 
          />
        </div>
      )}

      {isNeuralOpen && (
        <NeuralIntelligencePanel 
          onClose={() => setIsNeuralOpen(false)} 
          onOpenCourse={() => {
            setIsNeuralOpen(false);
            setIsCourseOpen(true);
          }}
          theme={{ ...DEFAULT_THEME, primary: 'indigo-500', id: 'neural' }} 
          topic="AircraftAerodynamics"
        />
      )}
      {isCourseOpen && (
        <CoursePanel 
          activeTopic="AircraftAerodynamics" 
          onClose={() => setIsCourseOpen(false)} 
          theme={{ ...DEFAULT_THEME, primary: 'emerald-500', id: 'course' }} 
        />
      )}

      {/* Real-time CFD Data Panel */}
      {isPanelOpen && (
        <AerodynamicsPanel 
          onClose={() => setIsPanelOpen(false)}
          theme={{ ...DEFAULT_THEME, primary: 'cyan-500', id: 'aero' }}
          machNumber={machNumber}
          setMachNumber={setMachNumber}
          angleOfAttack={angleOfAttack}
          setAngleOfAttack={setAngleOfAttack}
        />
      )}

      {/* 2D Overlay */}
      <HUD 
        mode={mode} 
        setMode={setMode} 
        machNumber={machNumber} 
        angleOfAttack={angleOfAttack} 
        verticalSpeed={verticalSpeed}
      />

      {/* 3D Scene */}
      <Canvas 
        camera={{ position: [5, 3, 6], fov: 45 }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        gl={{ 
          antialias: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
          alpha: true
        }}
      >
        {!mode || mode !== 'ar' ? (
          <color attach="background" args={['#020205']} />
        ) : null}
        
        {/* Lighting */}
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color={mode === 'hologram' ? '#00ffff' : '#ffffff'} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#0088ff" />

        {/* Environment for reflections in CFD mode or AR */}
        {(mode === 'cfd' || mode === 'ar') && <Environment preset="city" />}

        {/* The Aircraft Model */}
        <Aircraft mode={mode === 'ar' ? 'hologram' : mode} angleOfAttack={angleOfAttack} />

        {/* Mode-specific effects */}
        {(mode === 'hologram' || mode === 'ar') && (
          <>
            <WindParticles machNumber={machNumber} angleOfAttack={angleOfAttack} />
            {mode === 'hologram' && (
              <Grid 
                renderOrder={-1} 
                position={[0, -2, 0]} 
                infiniteGrid 
                cellSize={1} 
                cellThickness={0.5} 
                sectionSize={5} 
                sectionThickness={1} 
                sectionColor="#00ffff" 
                cellColor="#004444" 
                fadeDistance={30} 
              />
            )}
          </>
        )}

        {mode === 'cfd' && (
          <CFDPlane machNumber={machNumber} angleOfAttack={angleOfAttack} />
        )}

        {/* Controls */}
        <OrbitControls 
          ref={orbitControlsRef}
          enablePan={false} 
          minDistance={3} 
          maxDistance={15} 
          autoRotate={mode === 'hologram'} 
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2 + 0.2}
        />
        <GestureHandler controlsRef={orbitControlsRef} />
      </Canvas>
    </div>
  );
}
