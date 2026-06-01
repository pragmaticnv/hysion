import { Sliders } from 'lucide-react';
import { Theme } from '../../types';
import { AdvancedConfig } from '../../models/CustomModel';

interface NeuralParametersSectionProps {
  theme: Theme;
  config: AdvancedConfig;
  onConfigChange: (config: AdvancedConfig) => void;
}

export function NeuralParametersSection({ theme, config, onConfigChange }: NeuralParametersSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-zinc-400">
        <Sliders size={14} className={`text-${theme.accent}`} />
        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]">Neural Parameters</h4>
      </div>
      
      <div className="space-y-6 bg-white/[0.02] p-5 rounded-2xl border border-white/5">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Complexity</label>
            <span className={`text-[10px] font-mono text-${theme.primary} font-bold`}>{config.complexity}</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={config.complexity}
            onChange={(e) => onConfigChange({ ...config, complexity: parseInt(e.target?.value || '1') })}
            className={`w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-${theme.primary}`}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Density</label>
            <span className={`text-[10px] font-mono text-${theme.primary} font-bold`}>{config.particleCount}</span>
          </div>
          <input 
            type="range" 
            min="100" 
            max="2000" 
            step="100"
            value={config.particleCount}
            onChange={(e) => onConfigChange({ ...config, particleCount: parseInt(e.target?.value || '100') })}
            className={`w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-${theme.primary}`}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Luminance</label>
            <span className={`text-[10px] font-mono text-${theme.primary} font-bold`}>{config.glowIntensity}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="5" 
            step="0.5"
            value={config.glowIntensity}
            onChange={(e) => onConfigChange({ ...config, glowIntensity: parseFloat(e.target?.value || '0') })}
            className={`w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-${theme.primary}`}
          />
        </div>
      </div>
    </div>
  );
}
