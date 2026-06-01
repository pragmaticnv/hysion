import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Wind, Maximize2, Activity, Zap, Layers, ChevronRight, Settings2, ArrowLeft, BookOpen, Sparkles, Volume2, StopCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Theme } from '../types';
import { useHoloAudio } from '../hooks/useHoloAudio';

interface AerodynamicsPanelProps {
  onClose: () => void;
  theme: Theme;
  machNumber: number;
  setMachNumber: (val: number) => void;
  angleOfAttack: number;
  setAngleOfAttack: (val: number) => void;
}

export function AerodynamicsPanel({ 
  onClose, 
  theme, 
  machNumber, 
  setMachNumber, 
  angleOfAttack, 
  setAngleOfAttack 
}: AerodynamicsPanelProps) {
  const [activeTab, setActiveTab] = useState<'flow' | 'pressure' | 'forces' | 'bernoulli'>('flow');
  const { play, stop, isPlaying, currentText } = useHoloAudio();
  const [liveLift, setLiveLift] = useState(0);
  const [liveDrag, setLiveDrag] = useState(0);

  useEffect(() => {
    let frameId: number;
    // Update CFD values dynamically
    const updateRealTimeData = () => {
      const baseLift = angleOfAttack * 0.11 + 0.2;
      const baseDrag = 0.02 + Math.pow(angleOfAttack * 0.05, 2) + Math.max(0, Math.pow(machNumber - 0.8, 2) * 0.5);
      
      // Simulate real-time fluctuation
      const time = performance.now() * 0.005;
      const noise = Math.sin(time) * 0.02 + (Math.random() - 0.5) * 0.01;
      
      setLiveLift(baseLift + noise * baseLift);
      setLiveDrag(baseDrag + noise * 0.5 * baseDrag);
      
      frameId = requestAnimationFrame(updateRealTimeData);
    };
    
    updateRealTimeData();
    return () => cancelAnimationFrame(frameId);
  }, [angleOfAttack, machNumber]);

  const bernoulliContent = `
### Bernoulli's Principle & Lift Dynamics

Bernoulli's principle is the cornerstone of fluid mechanics, describing the inverse relationship between fluid velocity and static pressure. In the context of aerodynamics, it explains how the geometry of an airfoil manipulates airflow to generate the upward force required for flight.

#### The Physics of Airflow
As air molecules encounter the leading edge of a wing, they are divided. The curved upper surface (camber) forces the air to travel a longer path at a higher velocity compared to the air moving along the flatter lower surface.

1. **Velocity Acceleration:** The airfoil's curvature causes the air on top to accelerate.
2. **Pressure Drop:** According to Bernoulli's theorem, this increase in kinetic energy results in a simultaneous decrease in potential energy (static pressure).
3. **Lift Vector:** The resulting pressure differential—high pressure below and low pressure above—creates a net upward force.

#### Mathematical Foundation
The principle is a statement of the **Conservation of Energy** along a streamline. For horizontal flight where elevation changes are negligible:

$$P + \\frac{1}{2}\\rho v^2 = \\text{constant}$$

*Where $P$ is static pressure, $\\rho$ is air density, and $v$ is flow velocity.*
  `;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`fixed md:absolute right-0 md:right-4 top-0 md:top-20 bottom-0 md:bottom-4 w-full md:w-96 ${theme.uiBg} backdrop-blur-md border-l md:border ${theme.border} md:rounded-2xl flex flex-col overflow-hidden z-40 shadow-2xl`}
    >
      {/* Header */}
      <div className={`p-4 border-b ${theme.border} flex items-center justify-between bg-black/20`}>
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Back</span>
          </button>
          <div className="w-[1px] h-4 bg-white/10 mx-1" />
          <div className={`w-8 h-8 rounded-lg bg-${theme.primary}/20 border border-${theme.primary}/30 flex items-center justify-center`}>
            <Wind className={`text-${theme.primary}`} size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">Aerodynamics Analysis</h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Neural Synthesis v4.0</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex p-2 gap-1 border-b border-white/5 bg-black/10">
        {[
          { id: 'flow', label: 'Flow Field', icon: <Wind size={12} /> },
          { id: 'pressure', label: 'Pressure Map', icon: <Layers size={12} /> },
          { id: 'forces', label: 'Aero Forces', icon: <Activity size={12} /> },
          { id: 'bernoulli', label: 'Bernoulli', icon: <BookOpen size={12} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
              activeTab === tab.id 
                ? `bg-${theme.primary}/20 text-${theme.primary} border border-${theme.primary}/30` 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
        
        {activeTab === 'bernoulli' ? (
          <div className="space-y-6">
            {/* Bernoulli Equation Callout */}
            <div className="bg-black/40 rounded-xl border border-cyan-500/20 p-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl -mr-12 -mt-12" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30">
                  <Sparkles className="text-cyan-400" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Energy Conservation</h3>
                  <p className="text-xs font-bold text-white uppercase tracking-wider">Bernoulli's Equation</p>
                </div>
                <button 
                  onClick={() => isPlaying && currentText === bernoulliContent ? stop() : play(bernoulliContent)}
                  className={`p-2.5 rounded-xl transition-all shadow-lg ${isPlaying && currentText === bernoulliContent ? `bg-${theme.primary} text-white shadow-${theme.primary}/20` : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'}`}
                  title={isPlaying && currentText === bernoulliContent ? "Stop Audio" : "Play Explanation"}
                >
                  {isPlaying && currentText === bernoulliContent ? <StopCircle size={18} /> : <Volume2 size={18} />}
                </button>
              </div>
              <div className="bg-black/60 border border-cyan-500/10 p-4 rounded-lg text-center">
                <div className="font-mono text-xl text-cyan-400 tracking-tighter">
                  P + ½ρv² = const
                </div>
                <p className="text-[9px] text-zinc-500 mt-2 uppercase tracking-widest">Static + Dynamic Pressure = Total Pressure</p>
              </div>
            </div>

            {/* Pressure Gradient Visualization */}
            <div className="bg-black/40 rounded-xl border border-white/5 p-4">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Pressure Gradient Visualization</h3>
              <div className="relative h-32 bg-zinc-900/50 rounded-lg border border-white/5 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.2)_0%,transparent_70%)]" />
                
                {/* Airfoil SVG with Pressure Zones */}
                <svg width="200" height="80" viewBox="0 0 200 80" className="relative z-10">
                  {/* Upper Flow (Fast/Low Pressure) */}
                  <path d="M20,40 Q60,10 120,20 T180,40" fill="none" stroke="#22d3ee" strokeWidth="1" strokeDasharray="4 2" className="opacity-40 animate-[flow_2s_linear_infinite]" />
                  <text x="70" y="25" className="text-[8px] fill-cyan-400 font-bold uppercase tracking-widest">Low Pressure (-P)</text>
                  
                  {/* Airfoil */}
                  <path d="M20,40 Q60,15 120,25 T180,40 Q100,50 20,40 Z" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
                  
                  {/* Lower Flow (Slow/High Pressure) */}
                  <path d="M20,40 Q100,60 180,40" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 2" className="opacity-40 animate-[flow_4s_linear_infinite]" />
                  <text x="70" y="65" className="text-[8px] fill-blue-400 font-bold uppercase tracking-widest">High Pressure (+P)</text>
                  
                  {/* Lift Vector */}
                  <path d="M100,30 L100,10 M95,15 L100,10 L105,15" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
                  <text x="110" y="15" className="text-[8px] fill-cyan-400 font-bold uppercase tracking-widest">Lift</text>
                </svg>
              </div>
            </div>

            <div className="markdown-body text-zinc-400 text-xs leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{bernoulliContent}</ReactMarkdown>
            </div>
          </div>
        ) : (
          <>
            {/* Simulation Viewport */}
            <div className="relative h-48 bg-gradient-to-b from-slate-900 to-black rounded-xl border border-white/10 overflow-hidden flex items-center justify-center group">
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
              
              {/* Animated Flow Lines */}
              <div className="absolute inset-0 flex flex-col justify-around py-4 opacity-50">
                {[...Array(8)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-0.5 w-full ${activeTab === 'pressure' ? 'bg-gradient-to-r from-blue-500 via-red-500 to-blue-500' : 'bg-gradient-to-r from-transparent via-cyan-400 to-transparent'}`}
                    style={{
                      animationName: 'flow',
                      animationDuration: `${1.5 / machNumber}s`,
                      animationTimingFunction: 'linear',
                      animationIterationCount: 'infinite',
                      animationDelay: `${i * 0.15}s`
                    }}
                  />
                ))}
              </div>

              {/* Aircraft Profile */}
              <div className="relative z-10 text-white/80 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]" style={{ transform: `rotate(${-angleOfAttack}deg)` }}>
                <svg width="160" height="40" viewBox="0 0 160 40" fill="currentColor">
                  <path d="M10,20 Q40,5 80,10 T150,20 Q80,30 10,20 Z" />
                  <path d="M60,10 L75,-5 L90,10 Z" />
                </svg>
              </div>

              {/* Overlay Stats */}
              <div className="absolute bottom-2 right-2 flex gap-2">
                <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10 flex items-center gap-1.5">
                  <Zap size={10} className="text-amber-400" />
                  <span className="text-[9px] font-mono text-amber-400">Live</span>
                </div>
              </div>

              <button className="absolute top-2 right-2 p-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 size={12} />
              </button>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <Settings2 size={14} className={`text-${theme.primary}`} />
                  Flight Parameters
                </h3>
              </div>

              {/* Mach Number Slider */}
              <div className="space-y-2 bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Mach Number</label>
                  <span className="text-xs font-mono text-cyan-400">{machNumber.toFixed(2)} M</span>
                </div>
                <input 
                  type="range" 
                  min="0.1" 
                  max="2.5" 
                  step="0.05" 
                  value={machNumber}
                  onChange={(e) => setMachNumber(parseFloat(e.target?.value || '0.1'))}
                  className={`w-full h-1.5 bg-black rounded-lg appearance-none cursor-pointer accent-${theme.primary}`}
                />
                <div className="flex justify-between text-[9px] text-zinc-600 font-mono">
                  <span>Subsonic</span>
                  <span>Transonic</span>
                  <span>Supersonic</span>
                </div>
              </div>

              {/* Angle of Attack Slider */}
              <div className="space-y-2 bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Angle of Attack (AoA)</label>
                  <span className="text-xs font-mono text-emerald-400">{angleOfAttack.toFixed(1)}°</span>
                </div>
                <input 
                  type="range" 
                  min="-5" 
                  max="25" 
                  step="0.5" 
                  value={angleOfAttack}
                  onChange={(e) => setAngleOfAttack(parseFloat(e.target?.value || '0'))}
                  className={`w-full h-1.5 bg-black rounded-lg appearance-none cursor-pointer accent-${theme.primary}`}
                />
                <div className="flex justify-between text-[9px] text-zinc-600 font-mono">
                  <span>-5°</span>
                  <span>Stall ~15°</span>
                  <span>25°</span>
                </div>
              </div>
            </div>

            {/* Telemetry Data */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Lift Coefficient (Cl)</p>
                <p className="text-lg font-mono text-white">{liveLift.toFixed(3)}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Drag Coefficient (Cd)</p>
                <p className="text-lg font-mono text-white">{liveDrag.toFixed(4)}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1">L/D Ratio</p>
                <p className="text-lg font-mono text-emerald-400">{(liveLift / (liveDrag || 0.001)).toFixed(1)}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Flow Regime</p>
                <p className={`text-sm font-bold uppercase tracking-wider mt-1 ${machNumber < 0.8 ? 'text-blue-400' : machNumber < 1.2 ? 'text-amber-400' : 'text-red-400'}`}>
                  {machNumber < 0.8 ? 'Subsonic' : machNumber < 1.2 ? 'Transonic' : 'Supersonic'}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes flow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </motion.div>
  );
}
