import React from 'react';
import { Box, Globe, ExternalLink, Check, Info } from 'lucide-react';
import { Theme } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface ModelResult {
  name: string;
  url: string;
  source: string;
  author?: string;
  thumbnail?: string;
  isRealistic?: boolean;
}

interface ModelSearchResultsProps {
  theme: Theme;
  results: ModelResult[];
  onSelect: (model: ModelResult) => void;
  selectedUrl?: string;
}

export function ModelSearchResults({ theme, results, onSelect, selectedUrl }: ModelSearchResultsProps) {
  if (results.length === 0) return null;

  return (
    <div className="space-y-4 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-400">
          <Globe size={14} className={`text-${theme.primary}`} />
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]">Neural Search Results</h4>
        </div>
        <span className="text-[9px] text-emerald-500 font-mono uppercase tracking-[0.1em] px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
          {results.length} Models Found
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <AnimatePresence mode="popLayout">
          {results.map((model, idx) => {
            const isSelected = selectedUrl === model.url;
            return (
              <motion.button
                key={model.url}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => onSelect(model)}
                className={`group flex flex-col w-full text-left p-3 rounded-xl border transition-all relative overflow-hidden ${
                  isSelected 
                    ? `bg-${theme.primary}/10 border-${theme.primary}/40 ring-1 ring-${theme.primary}/20` 
                    : 'bg-black/40 border-white/10 hover:border-white/20 hover:bg-black/60'
                }`}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className={`absolute top-2 right-2 w-5 h-5 bg-${theme.primary} rounded-full flex items-center justify-center shadow-lg`}>
                    <Check size={12} className="text-zinc-950 font-bold" />
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-${theme.primary}/30 transition-colors shrink-0`}>
                    <Box size={20} className={isSelected ? `text-${theme.primary}` : 'text-zinc-500'} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h5 className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                      {model.name}
                    </h5>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] text-zinc-500 font-medium bg-white/5 px-1.5 py-0.5 rounded border border-white/5 truncate">
                        Source: {model.source}
                      </span>
                      {model.author && (
                        <span className="text-[9px] text-zinc-500 font-medium bg-white/5 px-1.5 py-0.5 rounded border border-white/5 truncate">
                          By: {model.author}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    {model.isRealistic && (
                      <span className="text-[8px] text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1">
                        <Info size={10} />
                        High Fidelity
                      </span>
                    )}
                  </div>
                  <div className={`text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 ${isSelected ? `text-${theme.primary}` : 'text-zinc-500'}`}>
                    {isSelected ? 'Ready for Viewer' : 'Select Model'}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
      
      <p className="text-[9px] text-zinc-600 font-medium italic text-center px-4">
        Note: These models are sourced from high-quality public repositories for educational use.
      </p>
    </div>
  );
}
