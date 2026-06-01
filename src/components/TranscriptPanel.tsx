import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mic, MicOff, Trash2, Copy, Download, Maximize2, Minimize2, Languages, Sparkles, MessageSquare } from 'lucide-react';
import { useStore } from '../store/useStore';

export function TranscriptPanel() {
  const { 
    isTranscriptionOpen,
    isTranscriptHistoryOpen, 
    setIsTranscriptHistoryOpen, 
    language, 
    transcript,
    setTranscript,
    interimTranscript,
    setInterimTranscript,
    setLatestFinalTranscript,
    theme,
    isSidebarOpen,
    isMobile
  } = useStore();
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript, interimTranscript]);

  const handleClear = () => {
    setTranscript('');
    setInterimTranscript('');
    setLatestFinalTranscript('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(transcript);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([transcript], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `transcript-${new Date().toISOString()}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  if (!isTranscriptHistoryOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`fixed top-20 bottom-20 w-80 z-90 flex flex-col transition-all duration-300 ${isSidebarOpen && !isMobile ? 'left-[272px]' : 'left-4'}`}
    >
      <div className={`flex-1 ${theme.uiBg} backdrop-blur-md border ${theme.border} rounded-[24px] shadow-2xl flex flex-col overflow-hidden`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b ${theme.border} flex items-center justify-between bg-white/5`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg bg-${theme.primary}/20 border border-${theme.primary}/30 flex items-center justify-center text-${theme.primary}`}>
              <MessageSquare size={16} className={isTranscriptionOpen ? 'animate-pulse' : ''} />
            </div>
            <div>
              <h3 className={`text-xs font-bold ${theme.text} uppercase tracking-wider`}>Transcript</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className={`w-1 h-1 rounded-full ${isTranscriptionOpen ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`} />
                <span className={`text-[8px] font-mono ${theme.textMuted} uppercase tracking-widest`}>
                  {isTranscriptionOpen ? 'Live Processing' : 'Paused'}
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsTranscriptHistoryOpen(false)}
            className={`p-1.5 ${theme.textMuted} hover:${theme.text} hover:bg-white/10 rounded-lg transition-all`}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div 
          ref={scrollRef}
          className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-4"
        >
          {transcript ? (
            <div className={`text-sm ${theme.text} leading-relaxed whitespace-pre-wrap font-medium`}>
              {transcript}
              <span className={`text-${theme.primary}/60 italic ml-1`}>{interimTranscript}</span>
            </div>
          ) : interimTranscript ? (
            <div className={`text-sm text-${theme.primary}/60 italic leading-relaxed whitespace-pre-wrap font-medium`}>
              {interimTranscript}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Mic size={20} className={`${theme.textMuted} opacity-50`} />
              </div>
              <p className={`text-[10px] font-mono ${theme.textMuted} uppercase tracking-[0.2em]`}>Awaiting input...</p>
              <p className={`text-[9px] ${theme.textMuted} font-mono uppercase tracking-widest mt-2 opacity-60`}>Speak to begin transcription</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-4 py-3 border-t ${theme.border} bg-black/40 flex items-center justify-between`}>
          <div className="flex items-center gap-1">
            <button 
              onClick={handleCopy}
              disabled={!transcript}
              className={`p-2 ${theme.textMuted} hover:${theme.text} hover:bg-white/5 rounded-lg transition-all disabled:opacity-30`}
              title="Copy to clipboard"
            >
              <Copy size={14} />
            </button>
            <button 
              onClick={handleDownload}
              disabled={!transcript}
              className={`p-2 ${theme.textMuted} hover:${theme.text} hover:bg-white/5 rounded-lg transition-all disabled:opacity-30`}
              title="Download as text"
            >
              <Download size={14} />
            </button>
          </div>
          <button 
            onClick={handleClear}
            disabled={!transcript && !interimTranscript}
            className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all disabled:opacity-30"
          >
            <Trash2 size={12} />
            Clear
          </button>
        </div>
      </div>
    </motion.div>
  );
}
