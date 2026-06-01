import { Library } from 'lucide-react';
import { Theme } from '../../types';
import { AdvancedConfig } from '../../models/CustomModel';

interface PresetConstructsSectionProps {
  theme: Theme;
  onConfigChange: (config: AdvancedConfig) => void;
}

export function PresetConstructsSection({ theme, onConfigChange }: PresetConstructsSectionProps) {
  const presets = [
    { name: 'Quantum Core', config: { type: 'abstract', shape: 'icosahedron', primaryColor: '#00ffff', secondaryColor: '#ff00ff', complexity: 8, animationSpeed: 2, particleCount: 1500, glowIntensity: 4, wireframe: true } },
    { name: 'Bio-Matrix', config: { type: 'organic', shape: 'sphere', primaryColor: '#00ff00', secondaryColor: '#0088ff', complexity: 6, animationSpeed: 1.5, particleCount: 1000, glowIntensity: 2, wireframe: false } },
    { name: 'Stellar Engine', config: { type: 'astronomical', shape: 'torus', primaryColor: '#ffaa00', secondaryColor: '#ff0000', complexity: 10, animationSpeed: 0.5, particleCount: 2000, glowIntensity: 5, wireframe: false } },
    { name: 'Neural Web', config: { type: 'neural', shape: 'sphere', primaryColor: '#8800ff', secondaryColor: '#00ffff', complexity: 7, animationSpeed: 1, particleCount: 1200, glowIntensity: 3, wireframe: true } },
    { name: 'Neon Cyberpunk Cube', config: { type: 'geometric', shape: 'cube', primaryColor: '#ff0055', secondaryColor: '#00ffff', complexity: 5, animationSpeed: 3, particleCount: 500, glowIntensity: 5, wireframe: true } },
    { name: 'Organic Green Sphere', config: { type: 'organic', shape: 'sphere', primaryColor: '#00ff00', secondaryColor: '#005500', complexity: 8, animationSpeed: 1, particleCount: 800, glowIntensity: 3, wireframe: false } },
    { name: 'Fast Spinning Red Torus', config: { type: 'geometric', shape: 'torus', primaryColor: '#ff0000', secondaryColor: '#ffaa00', complexity: 4, animationSpeed: 5, particleCount: 300, glowIntensity: 4, wireframe: false } },
    { name: 'Complex Blue Molecular Structure', config: { type: 'molecular', shape: 'sphere', primaryColor: '#0088ff', secondaryColor: '#00ffff', complexity: 10, animationSpeed: 0.5, particleCount: 1500, glowIntensity: 2, wireframe: true } },
    { name: 'Slow Golden Abstract Shapes', config: { type: 'abstract', shape: 'icosahedron', primaryColor: '#ffaa00', secondaryColor: '#ffff00', complexity: 6, animationSpeed: 0.2, particleCount: 600, glowIntensity: 3, wireframe: false } }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-zinc-400">
        <Library size={14} className={`text-${theme.primary}`} />
        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]">Pre-loaded Constructs</h4>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => onConfigChange(preset.config as AdvancedConfig)}
            className="py-2.5 px-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white hover:bg-white/[0.05] hover:border-white/10"
          >
            {preset.name}
          </button>
        ))}
      </div>
    </div>
  );
}
