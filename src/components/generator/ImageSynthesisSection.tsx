import { Box, Wand2 } from 'lucide-react';
import { Theme } from '../../types';

interface ImageSynthesisSectionProps {
  theme: Theme;
  imageUrlInput: string;
  setImageUrlInput: (value: string) => void;
  onImageLoad: () => void;
}

export function ImageSynthesisSection({ theme, imageUrlInput, setImageUrlInput, onImageLoad }: ImageSynthesisSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-zinc-400">
        <Box size={14} className="text-emerald-400" />
        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]">Image Synthesis</h4>
      </div>
      <div className="space-y-3">
        <input
          type="text"
          value={imageUrlInput}
          onChange={(e) => setImageUrlInput(e.target?.value || '')}
          placeholder="Paste image URL (png/jpg)..."
          className={`w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-[11px] text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/30 transition-all font-mono`}
        />
        <button
          onClick={onImageLoad}
          disabled={!imageUrlInput.trim()}
          className={`w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-900 disabled:text-zinc-700 text-zinc-950 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 uppercase tracking-wider`}
        >
          <Wand2 size={14} />
          Render Image Hologram
        </button>
      </div>
    </div>
  );
}
