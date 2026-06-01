import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Sparkles, BrainCircuit, Quote, Trash2, X, Settings, Loader2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { correctTranscription } from '../../services/geminiService';
import { Theme } from '../../types';

export function TeacherExplanationPanel() {
  const { 
    isTranscriptionOpen, 
    setIsTranscriptionOpen, 
    transcript, 
    setTranscript,
    interimTranscript, 
    setInterimTranscript,
    setLatestFinalTranscript,
    language,
    theme,
    isSidebarOpen,
    isMobile
  } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isCorrecting, setIsCorrecting] = useState(false);

  const onResult = useCallback(async (final: string, interim: string, latestFinal?: string) => {
    if (final !== undefined) {
      setTranscript(final.trim());
    }
    setInterimTranscript(interim);
    
    if (latestFinal && latestFinal.trim().length > 10) {
      setLatestFinalTranscript(latestFinal.trim());
      setIsCorrecting(true);
      try {
        const corrected = await correctTranscription(final, language === 'en' ? 'English' : language);
        if (corrected && corrected !== final) {
          setTranscript(corrected);
        }
      } catch (e) {
        console.error("Neural correction error:", e);
      } finally {
        setIsCorrecting(false);
      }
    }
  }, [setTranscript, setInterimTranscript, setLatestFinalTranscript, language]);

  const { isListening, error, start, stop, clearTranscript } = useSpeechRecognition({
    language: language === 'en' ? 'en-US' : language,
    onResult
  });

  useEffect(() => {
    if (isTranscriptionOpen) {
      start();
    } else {
      stop();
    }
  }, [isTranscriptionOpen, start, stop]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript, interimTranscript]);

  if (!isTranscriptionOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[280px] z-[60] pointer-events-none flex transition-all duration-300 ${
        isSidebarOpen && !isMobile ? 'ml-[140px]' : ''
      }`}
    >
      <div className="w-full h-full liquid-glass rounded-[2rem] flex flex-col overflow-hidden pointer-events-auto">
        {/* Header */}
        <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
               animate={isListening ? { scale: [1, 1.1, 1] } : {}}
               transition={{ duration: 1, repeat: Infinity }}
               className={`p-2.5 rounded-2xl bg-${theme.primary}/20 text-${theme.primary} shadow-lg shadow-${theme.primary}/10`}
            >
              {isListening ? <Mic size={20} className="animate-pulse" /> : <MicOff size={20} />}
            </motion.div>
            <div>
              <h3 className="text-sm font-display font-black text-white uppercase tracking-widest">Teacher Deck</h3>
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`} />
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                  {isListening ? 'Streaming Intelligence' : 'Stream Suspended'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <button 
              onClick={() => {
                setTranscript('');
                setInterimTranscript('');
                clearTranscript();
              }}
              className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              title="Clear Memory"
            >
              <Trash2 size={16} />
            </button>
            <button 
              onClick={() => setIsTranscriptionOpen(false)}
              className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div 
          ref={scrollRef}
          className="flex-1 p-8 overflow-y-auto custom-scrollbar space-y-6"
        >
          <div className="relative">
            <Quote size={32} className={`text-${theme.primary}/10 absolute -top-4 -left-4`} />
            
            {transcript || interimTranscript ? (
              <div className="relative z-10 pl-6 border-l border-white/5">
                <p className="text-lg md:text-xl font-display font-medium leading-relaxed tracking-tight text-white/90 whitespace-pre-wrap">
                  {transcript}
                  <span className={`text-${theme.primary}/60 italic font-normal ml-2`}>{interimTranscript}</span>
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 opacity-30 select-none text-center">
                <div className="relative mb-6">
                   <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className={`absolute inset-0 bg-${theme.primary} blur-3xl rounded-full`}
                   />
                   <BrainCircuit size={64} className="text-zinc-400 relative z-10" />
                </div>
                <p className="text-[11px] font-display font-bold uppercase tracking-[0.2em] text-zinc-500 leading-relaxed max-w-[200px]">
                  {isListening ? 'Detecting vocal patterns... Start explaining to visualize.' : 'Neural Receiver Offline. Click Mic to Reconnect.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Status Indicators */}
        <div className="p-6 bg-white/5 border-t border-white/5 space-y-4">
          <div className="flex items-center justify-between h-4 px-2">
            {[...Array(24)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  height: isListening ? [2, Math.random() * 12 + 2, 2] : 2,
                  opacity: isListening ? [0.2, 0.6, 0.2] : 0.1
                }}
                transition={{ duration: 0.3, delay: i * 0.05, repeat: Infinity }}
                className={`w-[2px] rounded-full bg-${theme.primary}`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isCorrecting ? (
                <Loader2 size={12} className={`text-${theme.primary} animate-spin`} />
              ) : (
                <Sparkles size={12} className="text-amber-400" />
              )}
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
                {isCorrecting ? 'Refining Syntax' : 'Semantic Processing'}
              </span>
            </div>
            <button 
              onClick={isListening ? stop : start}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 ${isListening ? 'bg-red-500/10 text-red-400' : `bg-${theme.primary}/10 text-${theme.primary}`} text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all`}
            >
              {isListening ? 'Stop' : 'Resume'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
