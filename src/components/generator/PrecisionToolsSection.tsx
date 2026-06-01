import { Zap, Activity } from 'lucide-react';
import { Theme } from '../../types';
import { AdvancedConfig } from '../../models/CustomModel';

interface PrecisionToolsSectionProps {
  theme: Theme;
  config: AdvancedConfig;
  onConfigChange: (config: AdvancedConfig) => void;
}

export function PrecisionToolsSection({ theme, config, onConfigChange }: PrecisionToolsSectionProps) {
  return (
    <>
      {/* Laser Pointer Tool */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-zinc-400">
          <Zap size={14} className="text-yellow-400" />
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]">Precision Tools</h4>
        </div>
        <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">Laser Pointer</label>
              <p className="text-[8px] text-zinc-500 uppercase tracking-widest leading-relaxed">Highlight specific components</p>
            </div>
            <button
              onClick={() => onConfigChange({ ...config, laserPointerEnabled: !config.laserPointerEnabled })}
              className={`w-12 h-6 rounded-full transition-all relative ${
                config.laserPointerEnabled ? 'bg-yellow-500/20' : 'bg-zinc-800'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${
                config.laserPointerEnabled 
                  ? 'right-1 bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]' 
                  : 'left-1 bg-zinc-600'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Animation */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-zinc-400">
          <Activity size={14} className={`text-${theme.secondary}`} />
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]">Kinematics</h4>
        </div>
        
        <div className="space-y-6 bg-white/[0.02] p-5 rounded-2xl border border-white/5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Velocity</label>
              <span className={`text-[10px] font-mono text-${theme.primary} font-bold`}>{config.animationSpeed}x</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="5" 
              step="0.1"
              value={config.animationSpeed}
              onChange={(e) => onConfigChange({ ...config, animationSpeed: parseFloat(e.target?.value || '0') })}
              className={`w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-${theme.primary}`}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Rendering Mode</label>
            <div className="flex bg-black/40 rounded-lg p-1 border border-white/5">
              <button
                onClick={() => onConfigChange({ ...config, wireframe: false })}
                className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all ${
                  !config.wireframe 
                    ? `bg-${theme.primary}/20 text-${theme.primary} shadow-sm` 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Solid
              </button>
              <button
                onClick={() => onConfigChange({ ...config, wireframe: true })}
                className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all ${
                  config.wireframe 
                    ? `bg-${theme.primary}/20 text-${theme.primary} shadow-sm` 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Wireframe
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
