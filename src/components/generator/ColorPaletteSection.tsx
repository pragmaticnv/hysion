import { Palette } from 'lucide-react';
import { Theme } from '../../types';
import { AdvancedConfig } from '../../models/CustomModel';

interface ColorPaletteSectionProps {
  theme: Theme;
  config: AdvancedConfig;
  onConfigChange: (config: AdvancedConfig) => void;
}

export function ColorPaletteSection({ theme, config, onConfigChange }: ColorPaletteSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-zinc-400">
        <Palette size={14} className="text-pink-400" />
        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]">Chromatic Profile</h4>
      </div>
      <div className="space-y-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
        <div className="flex items-center justify-between gap-4">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Primary</label>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-zinc-600 uppercase">{config.primaryColor}</span>
            <input 
              type="color" 
              value={config.primaryColor}
              onChange={(e) => onConfigChange({ ...config, primaryColor: e.target?.value || '#00ffff' })}
              className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer overflow-hidden"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between gap-4">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Secondary</label>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-zinc-600 uppercase">{config.secondaryColor}</span>
            <input 
              type="color" 
              value={config.secondaryColor}
              onChange={(e) => onConfigChange({ ...config, secondaryColor: e.target?.value || '#ff00ff' })}
              className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer overflow-hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
