import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Sparkles, Languages } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

export function LiveCaptions() {
  const { isTranscriptionOpen, interimTranscript, latestFinalTranscript } = useStore();
  const [displayTranscript, setDisplayTranscript] = useState('');

  useEffect(() => {
    if (latestFinalTranscript) {
      setDisplayTranscript(latestFinalTranscript);
      // Clear transcript after 5 seconds of no new final results
      const timeout = setTimeout(() => {
        setDisplayTranscript(prev => prev === latestFinalTranscript ? '' : prev);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [latestFinalTranscript]);

  if (!isTranscriptionOpen || (!displayTranscript && !interimTranscript)) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 z-[60] pointer-events-none"
    >
      <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center gap-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          <Mic size={14} className={interimTranscript ? 'animate-pulse' : ''} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-lg font-medium leading-tight truncate">
            {displayTranscript}
            <span className="text-indigo-400/70 italic ml-2">{interimTranscript}</span>
          </p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2 px-2 py-1 rounded-lg bg-white/5 border border-white/10">
          <Sparkles size={10} className="text-indigo-400" />
          <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Live AI Captions</span>
        </div>
      </div>
    </motion.div>
  );
}
