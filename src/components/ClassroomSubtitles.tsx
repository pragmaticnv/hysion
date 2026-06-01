import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Sparkles, MessageSquare, Maximize2, Minimize2, Move, Quote } from 'lucide-react';
import { useStore } from '../store/useStore';
import { ULTRA_SMOOTH_SPRING } from '../constants/animations';

export function ClassroomSubtitles() {
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
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={ULTRA_SMOOTH_SPRING}
      className="fixed bottom-0 left-0 right-0 z-[70] pointer-events-none p-12 flex flex-col items-center gap-6"
    >
      <AnimatePresence mode="wait">
        {(transcript || interimTranscript) ? (
          <motion.div
            key="active-caption"
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            className="max-w-4xl w-full text-center"
          >
            <div className="bg-black/40 backdrop-blur-3xl border border-white/10 p-10 rounded-[50px] shadow-[0_32px_128px_rgba(0,0,0,0.8)] relative group">
               <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-emerald-500 rounded-full flex items-center gap-2 shadow-xl">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Live Instruction</span>
               </div>
               
               <Quote className="absolute top-8 left-8 text-white/5 w-16 h-16" />

               <p className="text-4xl font-display font-medium text-white leading-tight tracking-tight drop-shadow-2xl">
                 {transcript}
                 <span className="text-emerald-400 font-normal opacity-80 italic ml-2">
                   {interimTranscript}
                 </span>
               </p>
               
               <div className="mt-8 flex justify-center gap-1 opacity-20">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        height: interimTranscript ? Math.random() * 8 + 4 : 4,
                      }}
                      className="w-1 bg-white rounded-full"
                    />
                  ))}
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="idle-caption"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-4 bg-black/60 backdrop-blur-md px-8 py-3 rounded-full border border-white/10 shadow-2xl"
          >
            <Sparkles size={16} className="text-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.4em] font-black">Teacher is explaining</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
