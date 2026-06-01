import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Crosshair, Activity, Wind, Cpu, ShieldAlert, Navigation, X, Scan } from 'lucide-react';

interface HUDProps {
  mode: 'hologram' | 'cfd' | 'ar';
  setMode: (mode: 'hologram' | 'cfd' | 'ar') => void;
  onClose?: () => void;
  machNumber: number;
  angleOfAttack: number;
  verticalSpeed: number;
}

export function HUD({ mode, setMode, onClose, machNumber, angleOfAttack, verticalSpeed }: HUDProps) {
  const [alt, setAlt] = useState(45000);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Simulate fluctuating altitude
  useEffect(() => {
    const interval = setInterval(() => {
      setAlt((prev) => Math.floor(prev + (Math.random() - 0.5) * 100));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`pointer-events-none absolute inset-0 z-10 flex flex-col justify-between ${isMobile ? 'p-3' : 'p-6'} text-cyan-400 font-mono`}>
      {/* Top Bar */}
      <header className="flex justify-between items-start">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-0.5"
        >
          <div className={`flex items-center gap-2 ${isMobile ? 'text-sm' : 'text-xl'} font-bold tracking-widest`}>
            <Cpu className={isMobile ? 'w-4 h-4' : 'w-6 h-6'} />
            <span>AERO-SYS // V2.4</span>
          </div>
          <div className={`${isMobile ? 'text-[8px]' : 'text-xs'} opacity-70 tracking-widest`}>DASSAULT RAFALE SIMULATION</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col items-end gap-1"
        >
          <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-4'}`}>
            <div className="flex flex-col items-end">
              <span className={`${isMobile ? 'text-[8px]' : 'text-xs'} opacity-70`}>MACH</span>
              <span className={`${isMobile ? 'text-sm' : 'text-2xl'} font-bold`}>{machNumber.toFixed(2)}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className={`${isMobile ? 'text-[8px]' : 'text-xs'} opacity-70`}>AOA</span>
              <span className={`${isMobile ? 'text-sm' : 'text-2xl'} font-bold`}>{angleOfAttack.toFixed(1)}°</span>
            </div>
            <div className="flex flex-col items-end">
              <span className={`${isMobile ? 'text-[8px]' : 'text-xs'} opacity-70`}>VSI (FT/M)</span>
              <span className={`${isMobile ? 'text-sm' : 'text-2xl'} font-bold`}>{verticalSpeed.toFixed(0)}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className={`${isMobile ? 'text-[8px]' : 'text-xs'} opacity-70`}>ALT (FT)</span>
              <span className={`${isMobile ? 'text-sm' : 'text-2xl'} font-bold`}>{alt.toLocaleString()}</span>
            </div>
            {onClose && (
              <button 
                onClick={onClose}
                className={`pointer-events-auto ${isMobile ? 'p-1.5' : 'p-2'} bg-cyan-950/40 border border-cyan-500/30 rounded-full hover:bg-cyan-500 hover:text-black transition-all ml-1`}
              >
                <X className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
              </button>
            )}
          </div>
        </motion.div>
      </header>

      {/* Center Reticle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 flex items-center justify-center">
        <Crosshair className={`${isMobile ? 'w-32 h-32' : 'w-64 h-64'} animate-pulse duration-300`} strokeWidth={0.5} />
        <div className={`absolute ${isMobile ? 'w-48 h-48' : 'w-96 h-96'} border border-cyan-500/20 rounded-full border-dashed animate-[spin_10s_linear_infinite]`} />
        <div className={`absolute ${isMobile ? 'w-40 h-40' : 'w-80 h-80'} border border-cyan-500/30 rounded-full border-dotted animate-[spin_15s_linear_infinite_reverse]`} />
      </div>

      {/* Bottom Bar */}
      <footer className={`flex ${isMobile ? 'flex-col gap-3' : 'justify-between'} items-end`}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex flex-col gap-1 ${isMobile ? 'w-full items-start' : ''}`}
        >
          <div className={`flex items-center gap-2 ${isMobile ? 'text-[10px]' : 'text-sm'}`}>
            <Activity className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
            <span>SYSTEM STATUS: NOMINAL</span>
          </div>
          <div className={`flex items-center gap-2 ${isMobile ? 'text-[10px]' : 'text-sm'} text-red-400`}>
            <ShieldAlert className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
            <span>WEAPONS: ARMED</span>
          </div>
        </motion.div>

        {/* Controls (Pointer events enabled here) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`pointer-events-auto flex gap-2 bg-cyan-950/40 ${isMobile ? 'p-1 w-full justify-center' : 'p-2'} rounded-lg border border-cyan-500/30 backdrop-blur-md`}
        >
          <button
            onClick={() => setMode('hologram')}
            className={`flex items-center gap-2 ${isMobile ? 'px-2 py-1.5 text-[10px]' : 'px-4 py-2'} rounded transition-all ${
              mode === 'hologram' ? 'bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(0,255,255,0.5)]' : 'hover:bg-cyan-900/50'
            }`}
          >
            <Navigation className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
            HOLOGRAM
          </button>
          <button
            onClick={() => setMode('cfd')}
            className={`flex items-center gap-2 ${isMobile ? 'px-2 py-1.5 text-[10px]' : 'px-4 py-2'} rounded transition-all ${
              mode === 'cfd' ? 'bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(0,255,255,0.5)]' : 'hover:bg-cyan-900/50'
            }`}
          >
            <Wind className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
            CFD ANALYSIS
          </button>
          <button
            onClick={() => setMode('ar')}
            className={`flex items-center gap-2 ${isMobile ? 'px-2 py-1.5 text-[10px]' : 'px-4 py-2'} rounded transition-all ${
              mode === 'ar' ? 'bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(0,255,255,0.5)]' : 'hover:bg-cyan-900/50'
            }`}
          >
            <Scan className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
            AR MODE
          </button>
        </motion.div>
      </footer>
    </div>
  );
}
