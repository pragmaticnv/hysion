import React, { useState } from 'react';
import { Play, Pause, Wind, Activity, Maximize2 } from 'lucide-react';

export function AerodynamicsViewer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  return (
    <div className="w-full bg-black/40 rounded-xl border border-white/10 overflow-hidden mt-4">
      {/* Viewer Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-2">
          <Wind size={14} className="text-blue-400" />
          <span className="text-xs font-bold text-white">CFD Simulation</span>
        </div>
        <button className="text-zinc-400 hover:text-white transition-colors">
          <Maximize2 size={14} />
        </button>
      </div>

      {/* Simulation Area */}
      <div className="relative h-48 bg-gradient-to-b from-blue-900/20 to-black flex items-center justify-center overflow-hidden">
        {/* Placeholder for 3D/Canvas Simulation */}
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        
        {/* Animated flow lines */}
        {isPlaying && (
          <div className="absolute inset-0 flex flex-col justify-around py-4">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent w-full opacity-50"
                style={{
                  animationName: 'flow',
                  animationDuration: `${2 / speed}s`,
                  animationTimingFunction: 'linear',
                  animationIterationCount: 'infinite',
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Aircraft Silhouette */}
        <div className="relative z-10 text-blue-500/50">
          <svg width="120" height="40" viewBox="0 0 120 40" fill="currentColor">
            <path d="M10,20 Q30,10 60,15 T110,20 Q60,25 10,20 Z" />
            <path d="M50,15 L60,5 L70,15 Z" />
          </svg>
        </div>

        {/* Overlay Stats */}
        <div className="absolute bottom-2 left-2 flex gap-2">
          <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10 flex items-center gap-1.5">
            <Activity size={10} className="text-emerald-400" />
            <span className="text-[9px] font-mono text-emerald-400">Mach {0.85 * speed}</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-3 bg-white/5 flex items-center justify-between">
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            isPlaying ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
          }`}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
        </button>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-zinc-500 font-bold uppercase">Flow Speed</span>
          <input 
            type="range" 
            min="0.5" 
            max="2" 
            step="0.1" 
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-24 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      <style>{`
        @keyframes flow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
