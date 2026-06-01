import { useState } from 'react';
import { Wand2, Sparkles, Box, Loader2, Save, BookOpen, Globe } from 'lucide-react';
import { Theme } from '../../types';

interface AISynthesisSectionProps {
  theme: Theme;
  prompt: string;
  setPrompt: (value: string) => void;
  isGenerating: boolean;
  isFreeGenerating: boolean;
  isSaving: boolean;
  saveSuccess: boolean;
  generatedLesson: any;
  suggestions: string[];
  onAIGenerate: () => void;
  onFreeGenerate: () => void;
  onMeshyGenerate?: () => void;
  onSave: () => void;
}

export function AISynthesisSection({
  theme, prompt, setPrompt, isGenerating, isFreeGenerating, isSaving, saveSuccess, generatedLesson, suggestions, onAIGenerate, onFreeGenerate, onMeshyGenerate, onSave
}: AISynthesisSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-zinc-400">
        <Wand2 size={14} className={`text-${theme.primary}`} />
        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]">AI Synthesis</h4>
      </div>
      <div className="space-y-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target?.value || '')}
          placeholder="Describe your hologram... (e.g. 'A pulsating neon virus structure')"
          className={`w-full bg-black/40 border border-white/5 rounded-xl p-4 text-base text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-${theme.primary}/30 focus:ring-1 focus:ring-${theme.primary}/30 transition-all resize-none h-24 font-medium`}
        />
        
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setPrompt(s)}
              className={`px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-[9px] text-zinc-400 hover:text-${theme.primary} transition-colors`}
            >
              {s}
            </button>
          ))}
        </div>

        <button
          onClick={onFreeGenerate}
          disabled={!prompt.trim() || isGenerating || isFreeGenerating}
          className={`w-full py-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-900 disabled:text-zinc-700 text-white text-[12px] font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 uppercase tracking-wider border border-cyan-400/30`}
        >
          {isFreeGenerating ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Searching Global Sources...
            </>
          ) : (
            <>
              <Globe size={16} />
              Fetch Real-World Model (FREE)
            </>
          )}
        </button>

        {onMeshyGenerate && (
          <button
              onClick={onMeshyGenerate}
              disabled={!prompt.trim() || isGenerating || isFreeGenerating}
              className={`w-full py-4 bg-fuchsia-600 hover:bg-fuchsia-500 disabled:bg-zinc-900 disabled:text-zinc-700 text-white text-[12px] font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-fuchsia-500/20 uppercase tracking-wider border border-fuchsia-400/30 mt-2`}
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generating AI Model...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate AI 3D Model (MESHY)
              </>
            )}
          </button>
        )}

        <button
          onClick={onSave}
          disabled={isSaving || saveSuccess}
          className={`w-full py-3 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider ${
            saveSuccess 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
              : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10'
          }`}
        >
          {isSaving ? (
            <Loader2 size={14} className="animate-spin" />
          ) : saveSuccess ? (
            <>Saved to Library!</>
          ) : (
            <>
              <Save size={14} />
              {generatedLesson ? 'Save Construct & Lesson Module' : 'Save Construct'}
            </>
          )}
        </button>
        {generatedLesson && (
           <div className="text-[10px] text-emerald-400 font-medium text-center uppercase tracking-wider mt-2 flex items-center justify-center gap-1">
             <BookOpen size={12} />
             Lesson module "{generatedLesson.title || 'Generated'}" ready
           </div>
        )}
      </div>
    </div>
  );
}
