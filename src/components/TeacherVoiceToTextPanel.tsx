import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Captions, X, Sparkles, Volume2, Trash2, Maximize2, Minimize2, Languages, BrainCircuit } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { correctTranscription } from '../services/geminiService';

export function TeacherVoiceToTextPanel() {
  const { 
    isTranscriptionOpen, 
    setIsTranscriptionOpen, 
    language, 
    theme,
    transcript,
    setTranscript,
    interimTranscript,
    setInterimTranscript,
    setLatestFinalTranscript
  } = useStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isCorrecting, setIsCorrecting] = useState(false);
  const [neuralEnabled, setNeuralEnabled] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const onResult = useCallback(async (final: string, interim: string, latestFinal?: string, confidence?: number) => {
    if (final !== undefined) {
      setTranscript(final.trim());
    }
    setInterimTranscript(interim);
    
    // If we have a new final segment, apply neural correction for "100% precision" if enabled
    if (neuralEnabled && latestFinal && latestFinal.trim().length > 10) {
      setLatestFinalTranscript(latestFinal.trim());
      
      // Perform background neural correction to polish the text
      setIsCorrecting(true);
      try {
        const corrected = await correctTranscription(final, language === 'en' ? 'English' : language);
        if (corrected && corrected !== final) {
          setTranscript(corrected);
        }
      } catch (e: any) {
        // If quota exceeded, disable neural correction and don't show the error
        if (e.message?.includes('quota') || e.message?.includes('429')) {
          console.warn("Gemini quota exceeded, disabling neural transcription correction.");
          setNeuralEnabled(false);
        }
        console.error("Neural correction error:", e);
      } finally {
        setIsCorrecting(false);
      }
    }
  }, [setTranscript, setInterimTranscript, setLatestFinalTranscript, language, neuralEnabled]);

  const { isListening, error, isSupported, confidence, start, stop, clearTranscript } = useSpeechRecognition({
    language: language === 'en' ? 'en-US' : language,
    onResult
  });

  const handleClearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
    setLatestFinalTranscript('');
    clearTranscript();
  };

  // Explicitly clear error when retrying
  const handleRetry = () => {
    handleClearTranscript();
    start();
  };


  useEffect(() => {
    if (isTranscriptionOpen && isSupported) {
      start();
    } else {
      stop();
    }
  }, [isTranscriptionOpen, start, stop, isSupported]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript, interimTranscript]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      drag={!isFullscreen}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
      className={`fixed z-[100] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-grab active:cursor-grabbing ${
        isFullscreen 
          ? 'inset-6 rounded-[50px]' 
          : isMinimized
            ? 'bottom-12 right-12 w-20 h-20 rounded-full overflow-visible'
            : 'bottom-12 left-1/2 -translate-x-1/2 w-full max-w-5xl px-6'
      }`}
    >
        <div className={`h-full w-full bg-white/15 dark:bg-black/30 backdrop-blur-3xl border border-white/30 dark:border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.4)] flex flex-col relative ring-1 ring-white/20 overflow-hidden ${isMinimized ? 'rounded-full' : 'rounded-[50px]'}`}>
          {/* Internal Sheen & Reflections */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-white/40 blur-[1px] pointer-events-none" />
          
          {isMinimized ? (
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMinimized(false)}
              className={`w-full h-full flex items-center justify-center text-white relative group`}
            >
              <div className={`absolute inset-0 bg-${theme.primary}/20 mix-blend-overlay group-hover:bg-${theme.primary}/40 transition-colors animate-pulse`} />
              <div className="relative z-10">
                <Captions size={32} className={isListening ? 'animate-bounce' : 'opacity-80'} />
              </div>
              {isListening && (
                <motion.div 
                   animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
                   transition={{ duration: 2, repeat: Infinity }}
                   className={`absolute inset-0 bg-${theme.primary}/30 rounded-full blur-xl`}
                />
              )}
            </motion.button>
          ) : (
            <>
              {/* Decorative Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-${theme.primary} to-transparent animate-[scan_4s_linear_infinite]`} />
            <div className={`absolute -top-24 -left-24 w-64 h-64 bg-${theme.primary}/10 blur-[100px] rounded-full`} />
            <div className={`absolute -bottom-24 -right-24 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full`} />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-10 py-6 border-b border-white/10 dark:border-white/5 bg-white/5 dark:bg-black/10 backdrop-blur-3xl relative z-10">
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 rounded-3xl bg-gradient-to-br from-${theme.primary}/30 to-${theme.primary}/10 border border-white/20 flex items-center justify-center text-${theme.primary} shadow-xl shadow-${theme.primary}/20`}>
                <Captions size={28} className={isListening ? 'animate-pulse' : ''} />
              </div>
              <div>
                <h3 className={`text-xl font-display font-black ${theme.text} tracking-tight flex items-center gap-4`}>
                  Neural Audio Stream
                  {isListening && (
                    <motion.span 
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className={`w-3 h-3 rounded-full bg-${theme.primary} shadow-[0_0_15px_rgba(99,102,241,0.5)]`}
                    />
                  )}
                </h3>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/20 border border-white/5">
                    <div className={`w-1 h-1 rounded-full bg-emerald-400 animate-pulse`} />
                    <p className={`text-[9px] ${theme.textMuted} font-mono uppercase tracking-widest`}>Real-time Synthesis</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/20 border border-white/5">
                    <Languages size={9} className={`text-${theme.primary}`} />
                    <span className={`text-[9px] text-zinc-400 font-mono uppercase tracking-widest`}>{language === 'en' ? 'Natural Language (EN)' : language}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setNeuralEnabled(!neuralEnabled)}
                className={`p-3 rounded-2xl transition-all border shadow-sm ${neuralEnabled ? `bg-${theme.primary}/20 text-${theme.primary} border-${theme.primary}/30` : 'text-zinc-400 hover:text-white hover:bg-white/10 border-transparent hover:border-white/10'}`}
                title={neuralEnabled ? "Neural Correction Active" : "Neural Correction Disabled"}
              >
                <BrainCircuit size={20} className={neuralEnabled ? 'animate-pulse' : 'opacity-40'} />
              </button>
              <div className="w-px h-8 bg-white/10 mx-2" />
              <button 
                onClick={() => setIsMinimized(true)}
                className="p-3 text-zinc-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all border border-transparent hover:border-white/10 shadow-sm"
                title="Minimize Interface"
              >
                <Minimize2 size={20} />
              </button>
              <button 
                onClick={handleClearTranscript}
                className="p-3 text-zinc-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all border border-transparent hover:border-white/10 shadow-sm"
                title="Wipe Memory"
              >
                <Trash2 size={20} />
              </button>
              <div className="w-px h-8 bg-white/10 mx-3" />
              <button 
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-3 text-zinc-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all border border-transparent hover:border-white/10 shadow-sm"
              >
                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
              <button 
                onClick={() => setIsTranscriptionOpen(false)}
                className="p-3 text-rose-400 hover:text-white hover:bg-rose-500/30 rounded-2xl transition-all border border-transparent hover:border-rose-500/40 shadow-lg shadow-rose-500/10 ml-2"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Transcript Content */}
          <div 
            ref={scrollRef}
            className={`flex-1 p-8 md:p-14 overflow-y-auto custom-scrollbar relative z-10 ${
              isFullscreen ? 'text-4xl md:text-6xl leading-[1.3]' : 'max-h-[300px] text-2xl md:text-3xl leading-[1.4]'
            }`}
          >
            <div className="max-w-4xl mx-auto relative group">
              <div className={`absolute -left-10 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-${theme.primary}/40 to-transparent opacity-50 group-hover:opacity-100 transition-opacity`} />
              <span className={`text-zinc-100 font-display font-medium whitespace-pre-wrap drop-shadow-sm`}>
                {transcript}
              </span>
              <span className={`text-${theme.primary}/80 font-display font-medium italic ml-3 opacity-60`}>
                {interimTranscript}
              </span>
              {!transcript && !interimTranscript && (
                <div className="flex flex-col items-center justify-center h-full py-24">
                  {!isSupported ? (
                    <div className="flex flex-col items-center gap-6 text-center px-12">
                       <div className="p-6 bg-amber-500/10 border border-amber-500/30 rounded-[32px] text-amber-400 flex flex-col items-center shadow-xl shadow-amber-500/5">
                          <Languages size={56} className="mb-4" />
                          <p className="text-sm font-display font-black uppercase tracking-[0.25em]">System Compatibility Protocol</p>
                          <p className="text-xs opacity-60 mt-3 font-mono leading-relaxed">Browser environment incompatible.<br/>Transition to Chromium for full neural sync.</p>
                       </div>
                    </div>
                  ) : error ? (
                    <div className="flex flex-col items-center gap-6">
                       <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-[32px] text-rose-400 flex flex-col items-center shadow-xl shadow-rose-500/5">
                          <MicOff size={56} className="mb-4" />
                          <p className="text-sm font-display font-black uppercase tracking-[0.25em]">Link Disconnected</p>
                          <p className="text-xs opacity-60 mt-3 font-mono">Status: {error === 'not-allowed' ? 'I/O Permission Failure' : error}</p>
                       </div>
                       <button 
                          onClick={handleRetry}
                          className={`px-10 py-4 bg-${theme.primary} text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-${theme.primary}/30`}
                       >
                          Restore Connection
                       </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="relative mb-10">
                        <motion.div 
                          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className={`absolute inset-0 bg-${theme.primary} blur-3xl rounded-full`} 
                        />
                        <Mic size={80} className={`text-${theme.primary}/30 relative z-10 animate-float`} />
                      </div>
                      <p className="text-sm font-display font-bold uppercase tracking-[0.4em] text-zinc-500 animate-pulse">Awaiting Verbal Input</p>
                      <div className="flex gap-2 mt-6">
                        {[1, 2, 3].map(i => (
                          <div key={i} className={`w-1 h-1 rounded-full bg-${theme.primary}/30 animate-pulse`} style={{ animationDelay: `${i * 0.2}s` }} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer / Status Bar */}
          <div className="px-10 py-5 border-t border-white/10 dark:border-white/5 bg-white/5 dark:bg-black/20 backdrop-blur-3xl flex items-center justify-between relative z-10">
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-4">
                <div className="flex gap-1.5 items-end h-4">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <motion.div
                      key={i}
                      animate={{ 
                        height: isListening ? [3, Math.random() * 16 + 3, 3] : 3,
                        opacity: isListening ? [0.4, 1, 0.4] : 0.4
                      }}
                      transition={{ 
                        duration: 0.4, 
                        repeat: Infinity, 
                        repeatType: 'reverse',
                        delay: i * 0.06 
                      }}
                      className={`w-1 rounded-full bg-${theme.primary} shadow-[0_0_8px_rgba(99,102,241,0.4)]`}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.25em]">Audio Aura Engaged</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-1.5 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                  <div className={`w-2 h-2 rounded-full ${isCorrecting ? 'bg-indigo-400 animate-spin' : confidence > 0.8 ? 'bg-emerald-400' : 'bg-amber-400'} shadow-[0_0_10px_rgba(52,211,153,0.3)]`} />
                  <span className="text-[9px] font-mono text-zinc-300 uppercase tracking-widest font-bold">
                    {isCorrecting ? 'Refining Neural Matrix' : `Link Precision: ${Math.round((confidence || 0) * 100)}%`}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <Sparkles size={14} className={`text-${theme.primary}/70 translate-y-[-1px]`} />
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Holographic Upscaling</span>
              </div>
              <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                <BrainCircuit size={14} className="text-emerald-400/60" />
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Unit: <span className="text-zinc-300">X-SYNAPSE-V2</span></span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  </motion.div>
);
}
