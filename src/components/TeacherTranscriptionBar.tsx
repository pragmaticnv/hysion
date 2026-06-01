import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Sparkles, BrainCircuit } from 'lucide-react';
import { useStore } from '../store/useStore';

export function TeacherTranscriptionBar() {
  const { isTranscriptionOpen, transcript, interimTranscript, theme } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript, interimTranscript]);

  if (!isTranscriptionOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] w-full max-w-4xl px-12 pointer-events-none"
    >
      <div className={`mx-auto w-full h-24 bg-black/60 backdrop-blur-3xl border border-white/20 rounded-[1.5rem] shadow-[0_32px_64px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden pointer-events-auto`}>
        {/* Progress/Scan Line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent animate-[scan_3s_linear_infinite]" />
        
        {/* Header Status */}
        <div className="px-6 py-1.5 flex items-center justify-between bg-white/5 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-black">Link: Stream</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Sparkles size={8} className="text-amber-400" />
              <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Live Sync</span>
            </div>
          </div>
        </div>

        {/* Text Container */}
        <div 
          ref={scrollRef}
          className="flex-1 px-6 py-2 overflow-y-auto custom-scrollbar flex items-center"
        >
          <div className="w-full relative">
            <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent" />
            
            {transcript || interimTranscript ? (
              <p className="text-lg md:text-xl font-display font-medium leading-tight tracking-tight text-white/90">
                <span className="drop-shadow-sm">{transcript}</span>
                <span className="text-cyan-400 italic font-normal ml-2 opacity-80">{interimTranscript}</span>
              </p>
            ) : (
              <div className="flex flex-col items-center justify-center opacity-30 select-none">
                <p className="text-xs font-display font-bold uppercase tracking-[0.5em] text-zinc-500 animate-pulse">
                  Awaiting Teacher's Explanation
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Waveform Footer - Removed for HUD compactness */}
      </div>
    </motion.div>
  );
}
