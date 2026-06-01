import { Box } from 'lucide-react';
import { Theme } from '../../types';
import { AdvancedConfig } from '../../models/CustomModel';

interface GeometrySectionProps {
  theme: Theme;
  config: AdvancedConfig;
  onConfigChange: (config: AdvancedConfig) => void;
}

export function GeometrySection({ theme, config, onConfigChange }: GeometrySectionProps) {
  return (
    <>
      {/* Type Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-zinc-400">
          <Box size={14} className={`text-${theme.primary}`} />
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]">Base Geometry</h4>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {(['geometric', 'organic', 'abstract', 'molecular', 'astronomical', 'neural'] as const).map((type) => (
            <button
              key={type}
              onClick={() => onConfigChange({ ...config, type })}
              className={`py-2.5 px-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                config.type === type 
                  ? `bg-${theme.primary}/10 border-${theme.primary}/30 text-${theme.primary} shadow-[0_0_15px_rgba(99,102,241,0.1)]` 
                  : 'bg-white/[0.02] border-white/5 text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.05]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Shape Selection */}
      {(config.type === 'geometric' || config.type === 'abstract') && (
        <div className="space-y-4 pt-4 border-t border-white/5 mt-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <Box size={14} className="text-cyan-400" />
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]">Geometric Primitive</h4>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['sphere', 'cube', 'torus', 'cylinder', 'icosahedron'] as const).map((shape) => (
              <button
                key={shape}
                onClick={() => onConfigChange({ ...config, shape })}
                className={`py-2 px-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all border ${
                  config.shape === shape 
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)]' 
                    : 'bg-white/[0.02] border-white/5 text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.05]'
                }`}
              >
                {shape}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
